import React, { useCallback, useState, useRef } from 'react';
import { usePhotoStore } from '../store/photoStore';
import { v4 as uuidv4 } from 'uuid';
import type { Photo } from '@shared/types';

const PhotoDropzone: React.FC = () => {
  const { addPhotos } = usePhotoStore();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const photos: Photo[] = [];
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!supportedExtensions.includes(ext)) continue;

      const blobUrl = URL.createObjectURL(file);
      const isElectron = !!window.electron;
      const photo: Photo = {
        id: uuidv4(),
        fileName: file.name,
        filePath: isElectron ? '' : blobUrl, // Electron 下 filePath 由主程序決定
        selected: false,
        exif: null,
        gps: null,
        status: 'idle',
        ...(isElectron ? {} : { thumbnail: blobUrl }), // 僅瀏覽器模式預設 thumbnail
      };

      photos.push(photo);
    }

    if (photos.length > 0) {
      addPhotos(photos);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addPhotos]);

  const handleImportClick = useCallback(async () => {
    setError(null);
    
    // Check if Electron API is available
    if (window.electron && typeof window.electron.importPhotos === 'function') {
      try {
        const photos = await window.electron.importPhotos();
        if (photos.length > 0) {
          addPhotos(photos);
        }
      } catch (err) {
        setError('匯入照片時發生錯誤，請查看主控台。');
        console.error('Failed to import photos:', err);
      }
    } else {
      // Fallback to browser file input
      fileInputRef.current?.click();
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.tiff,.tif"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />
      {error && (
        <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
      )}
    </div>
  );
};

export default PhotoDropzone;
