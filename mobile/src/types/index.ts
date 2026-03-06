export interface Photo {
  id: string;
  uri: string;
  date: string;
  location?: string;
  width: number;
  height: number;
}

export interface Folder {
  id: string;
  name: string;
  photoIds: string[];
  createdAt: string;
}

export type TabId = 'browse' | 'liked' | 'folders';

export type AnimState = 'idle' | 'like' | 'delete' | 'archive' | 'transitioning';
