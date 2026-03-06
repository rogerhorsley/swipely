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
  deletePhoto: (id: string) => void;
  archiveToFolder: (photoId: string, folderId: string) => void;
  createFolder: (name: string) => string;
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

  deletePhoto: (id) => {
    const { deletedIds } = get();
    if (deletedIds.includes(id)) return;
    set({ deletedIds: [...deletedIds, id] });
    persist(get());
    // auto-advance handled by caller
  },

  archiveToFolder: (photoId, folderId) => {
    const { folders } = get();
    const next = folders.map((f) =>
      f.id === folderId && !f.photoIds.includes(photoId)
        ? { ...f, photoIds: [...f.photoIds, photoId] }
        : f,
    );
    set({ folders: next });
    persist(get());
  },

  createFolder: (name) => {
    const id = `folder_${Date.now()}`;
    const folder: Folder = { id, name, photoIds: [], createdAt: new Date().toISOString() };
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

// Selectors
export function useActivePhotos() {
  return useStore((s) => s.photos.filter((p) => !s.deletedIds.includes(p.id)));
}

export function useCurrentPhoto() {
  return useStore((s) => {
    const active = s.photos.filter((p) => !s.deletedIds.includes(p.id));
    return active[s.currentIndex] ?? null;
  });
}

export function useLikedPhotos() {
  return useStore((s) =>
    s.photos.filter((p) => s.likedIds.includes(p.id) && !s.deletedIds.includes(p.id)),
  );
}

export function useFolderPhotos(folderId: string) {
  return useStore((s) => {
    const folder = s.folders.find((f) => f.id === folderId);
    if (!folder) return [];
    return s.photos.filter(
      (p) => folder.photoIds.includes(p.id) && !s.deletedIds.includes(p.id),
    );
  });
}
