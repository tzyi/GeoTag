import React, { useEffect, useState } from 'react';
import{ usePhotoStore } from '../store/photoStore';
import type { ExifData } from '@shared/types';

interface ExifDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExifDrawer: React.FC<ExifDrawerProps> = ({ isOpen, onClose }) => {
  const { currentPhotoId, photos } = usePhotoStore();
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [loading, setLoading] = useState(false);

  const currentPhoto = photos.find((p) => p.id === currentPhotoId);

  useEffect(() => {
    if (isOpen && currentPhoto) {
      setLoading(true);
      
      // Check if Electron API is available
      if (window.electron && typeof window.electron.readExif === 'function') {
        window.electron
          .readExif(currentPhoto.filePath)
          .then((data) => {
            setExifData(data);
          })
          .catch((error) => {
            console.error('Failed to read EXIF:', error);
            setExifData(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // No Electron API available, use photo's existing EXIF data
        setExifData(currentPhoto.exif);
        setLoading(false);
      }
    }
  }, [isOpen, currentPhoto]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-surface-dark shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">EXIF 資訊</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="material-icons animate-spin text-4xl text-slate-400">sync</span>
            </div>
          ) : currentPhoto ? (
            <>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">檔案資訊</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">檔名:</span>
                    <span className="font-medium">{currentPhoto.fileName}</span>
                  </div>
                </div>
              </div>

              {exifData ? (
                <div className="space-y-6">
                  {exifData.cameraModel && (
                    <div>
                      <h3 className="font-semibold mb-2">相機資訊</h3>
                      <div className="space-y-2 text-sm">
                        {exifData.cameraMake && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">品牌:</span>
                            <span className="font-medium">{exifData.cameraMake}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">型號:</span>
                          <span className="font-medium">{exifData.cameraModel}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {(exifData.iso || exifData.focalLength || exifData.aperture || exifData.shutterSpeed) && (
                    <div>
                      <h3 className="font-semibold mb-2">拍攝參數</h3>
                      <div className="space-y-2 text-sm">
                        {exifData.iso && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">ISO:</span>
                            <span className="font-medium">{exifData.iso}</span>
                          </div>
                        )}
                        {exifData.focalLength && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">焦距:</span>
                            <span className="font-medium">{exifData.focalLength}</span>
                          </div>
                        )}
                        {exifData.aperture && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">光圈:</span>
                            <span className="font-medium">{exifData.aperture}</span>
                          </div>
                        )}
                        {exifData.shutterSpeed && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-slate-400">快門:</span>
                            <span className="font-medium">{exifData.shutterSpeed}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {exifData.dateTime && (
                    <div>
                      <h3 className="font-semibold mb-2">拍攝時間</h3>
                      <div className="text-sm">
                        <span className="font-medium">{exifData.dateTime}</span>
                      </div>
                    </div>
                  )}

                  {(exifData.width || exifData.height) && (
                    <div>
                      <h3 className="font-semibold mb-2">影像尺寸</h3>
                      <div className="text-sm">
                        <span className="font-medium">
                          {exifData.width} × {exifData.height}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="material-icons text-6xl text-slate-300 dark:text-slate-600 mb-4">
                    info
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">無 EXIF 資料</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">未選擇照片</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExifDrawer;
