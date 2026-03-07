import { useMemo } from 'react';
import { create } from 'zustand';
import * as MediaLibrary from 'expo-media-library';
import type { Photo, Folder } from '../types';
import { loadPersistedState, debouncedSave } from '../utils/storage';

interface StoreState {
  photos: Photo[];
  currentIndex: number;
  likedIds: string[];
  deletedIds: string[];
  folders: Folder[];
  isArchiveSheetOpen: boolean;
  isLoading: boolean;
  hasPermission: boolean | null;

  loadPhotos: () => Promise<void>;
  loadPersisted: () => Promise<void>;
  toggleLike: (id: string) => void;
  deletePhoto: (id: string) => Promise<boolean>;
  archiveToFolder: (photoId: string, folderId: string) => Promise<void>;
  createFolder: (name: string) => Promise<string>;
  openArchiveSheet: () => void;
  closeArchiveSheet: () => void;
  advanceToNext: () => void;
  goToPrevious: () => void;
  setCurrentIndex: (index: number) => void;
}

function persist(state: StoreState) {
  debouncedSave({
    likedIds: state.likedIds,
    deletedIds: state.deletedIds,
    folders: state.folders,
  });
}

export const useStore = create<StoreState>((set, get) => ({
  photos: [],
  currentIndex: 0,
  likedIds: [],
  deletedIds: [],
  folders: [],
  isArchiveSheetOpen: false,
  isLoading: false,
  hasPermission: null,

  loadPhotos: async () => {
    set({ isLoading: true });
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        set({ hasPermission: false, isLoading: false });
        return;
      }
      set({ hasPermission: true });

      const result = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        first: 500,
      });

      const photos: Photo[] = result.assets.map((asset) => ({
        id: asset.id,
        uri: asset.uri,
        date: new Date(asset.creationTime).toISOString(),
        width: asset.width,
        height: asset.height,
      }));

      set({ photos, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  loadPersisted: async () => {
    const data = await loadPersistedState();
    set(data);
  },

  toggleLike: (id) => {
    const { likedIds } = get();
    const next = likedIds.includes(id)
      ? likedIds.filter((x) => x !== id)
      : [...likedIds, id];
    set({ likedIds: next });
    persist(get());
  },

  deletePhoto: async (id) => {
    const { deletedIds } = get();
    if (deletedIds.includes(id)) return false;
    try {
      const success = await MediaLibrary.deleteAssetsAsync([id]);
      if (!success) return false;
      set({ deletedIds: [...deletedIds, id] });
      persist(get());
      return true;
    } catch {
      return false;
    }
  },

  archiveToFolder: async (photoId, folderId) => {
    const { folders } = get();
    const folder = folders.find((f) => f.id === folderId);
    if (!folder || folder.photoIds.includes(photoId)) return;
    const next = folders.map((f) =>
      f.id === folderId ? { ...f, photoIds: [...f.photoIds, photoId] } : f,
    );
    set({ folders: next });
    persist(get());
    if (folder.albumId) {
      try {
        await MediaLibrary.addAssetsToAlbumAsync([photoId], folder.albumId, false);
      } catch {
        // system album sync failed, local state already updated
      }
    }
  },

  createFolder: async (name) => {
    const id = `folder_${Date.now()}`;
    let albumId: string | undefined;
    try {
      const album = await MediaLibrary.createAlbumAsync(name);
      albumId = album.id;
    } catch {
      // system album creation failed, continue with local-only folder
    }
    const folder: Folder = { id, name, photoIds: [], createdAt: new Date().toISOString(), albumId };
    set({ folders: [...get().folders, folder] });
    persist(get());
    return id;
  },

  openArchiveSheet: () => set({ isArchiveSheetOpen: true }),
  closeArchiveSheet: () => set({ isArchiveSheetOpen: false }),

  advanceToNext: () => {
    const { currentIndex, photos, deletedIds } = get();
    const active = photos.filter((p) => !deletedIds.includes(p.id));
    if (currentIndex < active.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  goToPrevious: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  setCurrentIndex: (index) => set({ currentIndex: index }),
}));

// Hooks - use useMemo to avoid infinite re-render from new array references
export function useActivePhotos() {
  const photos = useStore((s) => s.photos);
  const deletedIds = useStore((s) => s.deletedIds);
  return useMemo(() => photos.filter((p) => !deletedIds.includes(p.id)), [photos, deletedIds]);
}

export function useCurrentPhoto() {
  const photos = useStore((s) => s.photos);
  const deletedIds = useStore((s) => s.deletedIds);
  const currentIndex = useStore((s) => s.currentIndex);
  return useMemo(() => {
    const active = photos.filter((p) => !deletedIds.includes(p.id));
    return active[currentIndex] ?? null;
  }, [photos, deletedIds, currentIndex]);
}

export function useLikedPhotos() {
  const photos = useStore((s) => s.photos);
  const likedIds = useStore((s) => s.likedIds);
  const deletedIds = useStore((s) => s.deletedIds);
  return useMemo(
    () => photos.filter((p) => likedIds.includes(p.id) && !deletedIds.includes(p.id)),
    [photos, likedIds, deletedIds],
  );
}
