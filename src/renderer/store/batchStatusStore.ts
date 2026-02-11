import { create } from 'zustand';
import type { BatchProgress } from '@shared/types';

interface BatchStatusStore {
  progress: BatchProgress | null;
  isWriting: boolean;

  // Actions
  setProgress: (progress: BatchProgress | null) => void;
  setIsWriting: (isWriting: boolean) => void;
  resetProgress: () => void;
}

export const useBatchStatusStore = create<BatchStatusStore>((set) => ({
  progress: null,
  isWriting: false,

  setProgress: (progress) => set({ progress }),
  
  setIsWriting: (isWriting) => set({ isWriting }),

  resetProgress: () => set({ progress: null, isWriting: false }),
}));
