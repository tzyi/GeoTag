import React, { useEffect, useState } from 'react';
import { usePhotoStore } from '../store/photoStore';
import type { Photo } from '@shared/types';

const PhotoSidebar: React.FC = () => {
  const { photos, selectedPhotoIds, togglePhotoSelection, selectAllPhotos, deselectAllPhotos, setCurrentPhoto } =
    usePhotoStore();
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  // Load thumbnails
  useEffect(() => {
    const loadThumbnails = async () => {
      for (const photo of photos) {
        if (!thumbnails[photo.id]) {
          try {
            let thumbnail: string;
            
            // Check if Electron API is available
            if (window.electron && typeof window.electron.getPhotoThumbnail === 'function') {
              thumbnail = await window.electron.getPhotoThumbnail(photo.filePath);
            } else {
              // Fallback: use the filePath directly (which is a blob URL in browser mode)
              thumbnail = photo.filePath;
            }
            
            setThumbnails((prev) => ({ ...prev, [photo.id]: thumbnail }));
          } catch (error) {
            console.error(`Failed to load thumbnail for ${photo.fileName}:`, error);
          }
        }
      }
    };

    if (photos.length > 0) {
      loadThumbnails();
    }
  }, [photos, thumbnails]);

  const handleSelectAll = () => {
    if (selectedPhotoIds.size === photos.length) {
      deselectAllPhotos();
    } else {
      selectAllPhotos();
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    togglePhotoSelection(photo.id);
    setCurrentPhoto(photo.id);
  };

  const isAllSelected = photos.length > 0 && selectedPhotoIds.size === photos.length;

  return (
    <aside className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-border-dark">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">照片</h2>
          <span className="px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded">
            {photos.length}
          </span>
        </div>
        {photos.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="rounded border-slate-300 dark:border-slate-700 bg-transparent text-primary focus:ring-primary"
              />
              <span className="text-slate-600 dark:text-slate-400">
                全選 ({photos.length})
              </span>
            </div>
            <span className="text-slate-600 dark:text-slate-400">
              已選 {selectedPhotoIds.size}
            </span>
          </div>
        )}
      </div>

      {/* Photo Grid */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {photos.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-8">
            尚無照片
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => {
              const isSelected = selectedPhotoIds.has(photo.id);
              const statusIcon =
                photo.status === 'success'
                  ? 'check_circle'
                  : photo.status === 'error'
                  ? 'error'
                  : photo.status === 'writing'
                  ? 'sync'
                  : null;

              return (
                <div
                  key={photo.id}
                  onClick={() => handlePhotoClick(photo)}
                  className={`relative group aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    isSelected
                      ? 'border-primary'
                      : 'border-transparent hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  {/* Thumbnail */}
                  {thumbnails[photo.id] ? (
                    <img
                      src={thumbnails[photo.id]}
                      alt={photo.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <span className="material-icons text-slate-400 animate-spin">sync</span>
                    </div>
                  )}

                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isSelected
                          ? 'bg-primary'
                          : 'border-2 border-white/50 bg-black/20'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-icons text-white text-[14px]">check</span>
                      )}
                    </div>
                  </div>

                  {/* Status Icon */}
                  {statusIcon && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span
                        className={`material-icons text-4xl ${
                          photo.status === 'success'
                            ? 'text-success'
                            : photo.status === 'error'
                            ? 'text-red-500'
                            : 'text-white animate-spin'
                        }`}
                      >
                        {statusIcon}
                      </span>
                    </div>
                  )}

                  {/* Filename */}
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] text-white truncate font-medium">
                      {photo.fileName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default PhotoSidebar;
