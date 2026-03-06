import { create } from '../core/zustand-wrapper';

export interface Photo {
  id: string;
  url: string;
  date: string;
  location: string;
}

export interface Folder {
  id: string;
  name: string;
  photoIds: string[];
}

export type TabId = 'browse' | 'liked' | 'folders';
export type AnimState = 'idle' | 'like' | 'delete' | 'archive' | 'transitioning';

export interface SwipelyState {
  activeTab: TabId;
  photos: Photo[];
  currentIndex: number;
  likedIds: string[];
  deletedIds: string[];
  folders: Folder[];
  isArchiveSheetOpen: boolean;
  animState: AnimState;
  heartAnimPhotoId: string;
  isGlitching: boolean;
  transitionDirection: 'up' | 'down';

  setActiveTab: (tab: TabId) => void;
  setCurrentIndex: (index: number) => void;
  likePhoto: (photoId: string) => void;
  deletePhoto: (photoId: string) => void;
  archivePhotoToFolder: (photoId: string, folderId: string) => void;
  openArchiveSheet: () => void;
  closeArchiveSheet: () => void;
  setAnimState: (state: AnimState) => void;
  setHeartAnimPhotoId: (id: string) => void;
  setIsGlitching: (val: boolean) => void;
  createFolder: (name: string) => void;
  advanceToNext: () => void;
  setTransitionDirection: (dir: 'up' | 'down') => void;
}

const rawPhotos: Photo[] = (window.App?.store?.photos ?? []) as Photo[];
const rawFolders: Folder[] = (window.App?.store?.folders ?? []) as Folder[];

export const useStore = create<SwipelyState>((set, get) => ({
  activeTab: 'browse',
  photos: rawPhotos,
  currentIndex: 0,
  likedIds: [],
  deletedIds: [],
  folders: rawFolders,
  isArchiveSheetOpen: false,
  animState: 'idle',
  heartAnimPhotoId: '',
  isGlitching: false,
  transitionDirection: 'up',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentIndex: (index) => set({ currentIndex: index }),

  likePhoto: (photoId) => {
    const { likedIds } = get();
    if (!likedIds.includes(photoId)) {
      set({ likedIds: [...likedIds, photoId] });
    }
  },

  deletePhoto: (photoId) => {
    const { deletedIds } = get();
    if (!deletedIds.includes(photoId)) {
      set({ deletedIds: [...deletedIds, photoId] });
    }
  },

  archivePhotoToFolder: (photoId, folderId) => {
    const { folders } = get();
    const updated = folders.map((f) =>
      f.id === folderId
        ? { ...f, photoIds: f.photoIds.includes(photoId) ? f.photoIds : [...f.photoIds, photoId] }
        : f
    );
    set({ folders: updated });
  },

  openArchiveSheet: () => set({ isArchiveSheetOpen: true }),
  closeArchiveSheet: () => set({ isArchiveSheetOpen: false }),

  setAnimState: (state) => set({ animState: state }),
  setHeartAnimPhotoId: (id) => set({ heartAnimPhotoId: id }),
  setIsGlitching: (val) => set({ isGlitching: val }),

  createFolder: (name) => {
    if (!name.trim()) return;
    const { folders } = get();
    const newFolder: Folder = {
      id: `f${Date.now()}`,
      name: name.trim(),
      photoIds: [],
    };
    set({ folders: [...folders, newFolder] });
  },

  advanceToNext: () => {
    const { currentIndex, photos, deletedIds } = get();
    const activePlus = photos.filter((p) => !deletedIds.includes(p.id));
    const currentPhoto = photos[currentIndex];
    if (!currentPhoto) return;
    const currentActive = activePlus.findIndex((p) => p.id === currentPhoto.id);
    if (currentActive >= 0 && currentActive < activePlus.length - 1) {
      const nextPhoto = activePlus[currentActive + 1];
      const nextRealIndex = photos.findIndex((p) => p.id === nextPhoto.id);
      set({ currentIndex: nextRealIndex, transitionDirection: 'up' });
    }
  },

  setTransitionDirection: (dir) => set({ transitionDirection: dir }),
}));
