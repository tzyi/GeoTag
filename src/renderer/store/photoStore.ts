import { create } from 'zustand';
import type { Photo } from '@shared/types';

interface PhotoStore {
  photos: Photo[];
  selectedPhotoIds: Set<string>;
  currentPhotoId: string | null;

  // Actions
  setPhotos: (photos: Photo[]) => void;
  addPhotos: (photos: Photo[]) => void;
  removePhotos: (photoIds: string[]) => void;
  clearPhotos: () => void;
  updatePhoto: (photoId: string, updates: Partial<Photo>) => void;
  togglePhotoSelection: (photoId: string) => void;
  selectAllPhotos: () => void;
  deselectAllPhotos: () => void;
  setCurrentPhoto: (photoId: string | null) => void;
  getSelectedPhotos: () => Photo[];
}

export const usePhotoStore = create<PhotoStore>((set, get) => ({
  photos: [],
  selectedPhotoIds: new Set<string>(),
  currentPhotoId: null,

  setPhotos: (photos) => set({ photos }),

  addPhotos: (newPhotos) =>
    set((state) => ({
      photos: [...state.photos, ...newPhotos],
    })),

  removePhotos: (photoIds) =>
    set((state) => ({
      photos: state.photos.filter((p) => !photoIds.includes(p.id)),
      selectedPhotoIds: new Set(
        Array.from(state.selectedPhotoIds).filter((id) => !photoIds.includes(id))
      ),
    })),


  updatePhoto: (photoId, updates) =>
    set((state) => ({
      photos: state.photos.map((p) => (p.id === photoId ? { ...p, ...updates } : p)),
    })),

  clearPhotos: () =>
    set({
      photos: [],
      selectedPhotoIds: new Set(),
      currentPhotoId: null,
    }),

  togglePhotoSelection: (photoId) =>
    set((state) => {
      const newSelection = new Set(state.selectedPhotoIds);
      if (newSelection.has(photoId)) {
        newSelection.delete(photoId);
      } else {
        newSelection.add(photoId);
      }
      return { selectedPhotoIds: newSelection };
    }),

  selectAllPhotos: () =>
    set((state) => ({
      selectedPhotoIds: new Set(state.photos.map((p) => p.id)),
    })),

  deselectAllPhotos: () =>
    set({ selectedPhotoIds: new Set() }),

  setCurrentPhoto: (photoId) =>
    set({ currentPhotoId: photoId }),

  getSelectedPhotos: () => {
    const state = get();
    return state.photos.filter((p) => state.selectedPhotoIds.has(p.id));
  },
}));
