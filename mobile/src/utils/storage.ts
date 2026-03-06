import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Folder } from '../types';

const KEYS = {
  LIKED: '@swipely:liked',
  DELETED: '@swipely:deleted',
  FOLDERS: '@swipely:folders',
} as const;

export async function loadPersistedState() {
  try {
    const [liked, deleted, folders] = await Promise.all([
      AsyncStorage.getItem(KEYS.LIKED),
      AsyncStorage.getItem(KEYS.DELETED),
      AsyncStorage.getItem(KEYS.FOLDERS),
    ]);
    return {
      likedIds: JSON.parse(liked || '[]') as string[],
      deletedIds: JSON.parse(deleted || '[]') as string[],
      folders: JSON.parse(folders || '[]') as Folder[],
    };
  } catch {
    return { likedIds: [], deletedIds: [], folders: [] };
  }
}

let saveTimeout: ReturnType<typeof setTimeout>;

export function debouncedSave(state: {
  likedIds: string[];
  deletedIds: string[];
  folders: Folder[];
}) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(KEYS.LIKED, JSON.stringify(state.likedIds)),
        AsyncStorage.setItem(KEYS.DELETED, JSON.stringify(state.deletedIds)),
        AsyncStorage.setItem(KEYS.FOLDERS, JSON.stringify(state.folders)),
      ]);
    } catch {
      // silent fail
    }
  }, 500);
}
