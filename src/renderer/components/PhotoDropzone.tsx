import React, { useCallback } from 'react';
import { usePhotoStore } from '../store/photoStore';

const PhotoDropzone: React.FC = () => {
  const { addPhotos } = usePhotoStore();

  const handleImportClick = useCallback(async () => {
    try {
      const photos = await window.electron.importPhotos();
      if (photos.length > 0) {
        addPhotos(photos);
      }
    } catch (error) {
      console.error('Failed to import photos:', error);
    }
  }, [addPhotos]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Note: File drag & drop in Electron requires special handling
      // For now, we'll just use the import button
      console.log('Drop event - use import button for now');
    },
    []
  );

  return (
    <div
      className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-border-dark rounded-lg bg-slate-50 dark:bg-surface-dark/50 hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <span className="material-icons text-6xl text-slate-400 dark:text-slate-600 mb-4">
        add_photo_alternate
      </span>
      <h3 className="text-lg font-semibold mb-2">匯入照片</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">
        點擊下方按鈕選擇照片
      </p>
      <button
        onClick={handleImportClick}
        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
      >
        <span className="material-icons text-sm">folder_open</span>
        選擇照片
      </button>
    </div>
  );
};

export default PhotoDropzone;
