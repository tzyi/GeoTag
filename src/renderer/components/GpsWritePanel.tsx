import React, { useCallback, useEffect } from 'react';
import { usePhotoStore } from '../store/photoStore';
import { useBatchStatusStore } from '../store/batchStatusStore';
import type { GpsCoordinates } from '@shared/types';

interface GpsWritePanelProps {
  currentCoordinates: GpsCoordinates | null;
  onClose: () => void;
}

const GpsWritePanel: React.FC<GpsWritePanelProps> = ({ currentCoordinates, onClose }) => {
  const { getSelectedPhotos, updatePhoto } = usePhotoStore();
  const { progress, isWriting, setProgress, setIsWriting, resetProgress } = useBatchStatusStore();

  const selectedPhotos = getSelectedPhotos();

  useEffect(() => {
    // Listen for GPS write progress
    const handleProgress = (progressData: { completed: number; total: number; failed: number }) => {
      setProgress({
        total: progressData.total,
        completed: progressData.completed,
        failed: progressData.failed,
      });
    };

    window.electron.on('gps:writeProgress', handleProgress);

    return () => {
      window.electron.off('gps:writeProgress', handleProgress);
    };
  }, [setProgress]);

  const handleWriteGps = useCallback(async () => {
    if (!currentCoordinates || selectedPhotos.length === 0) return;

    try {
      setIsWriting(true);
      setProgress({
        total: selectedPhotos.length,
        completed: 0,
        failed: 0,
      });

      // Mark photos as writing
      selectedPhotos.forEach((photo) => {
        updatePhoto(photo.id, { status: 'writing' });
      });

      const photoPaths = selectedPhotos.map((p) => p.filePath);
      const result = await window.electron.writeGpsToPhotos(
        photoPaths,
        currentCoordinates.lat,
        currentCoordinates.lng
      );

      // Update photo statuses
      result.success.forEach((path) => {
        const photo = selectedPhotos.find((p) => p.filePath === path);
        if (photo) {
          updatePhoto(photo.id, {
            status: 'success',
            gps: currentCoordinates,
          });
        }
      });

      result.failed.forEach((path) => {
        const photo = selectedPhotos.find((p) => p.filePath === path);
        if (photo) {
          updatePhoto(photo.id, { status: 'error' });
        }
      });
    } catch (error) {
      console.error('Failed to write GPS:', error);
    } finally {
      setIsWriting(false);
      setTimeout(() => {
        resetProgress();
      }, 2000);
    }
  }, [currentCoordinates, selectedPhotos, setIsWriting, setProgress, resetProgress, updatePhoto]);

  if (!currentCoordinates) {
    return (
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-surface-dark rounded-lg shadow-2xl p-6 border border-slate-200 dark:border-border-dark">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          請移動地圖選擇 GPS 座標
        </p>
      </div>
    );
  }

  return (
    <>
      {/* GPS Write Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-surface-dark rounded-lg shadow-2xl p-6 border border-slate-200 dark:border-border-dark min-w-[400px]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">當前 GPS 座標</h3>
          <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
            <div>緯度: {currentCoordinates.lat.toFixed(6)}°</div>
            <div>經度: {currentCoordinates.lng.toFixed(6)}°</div>
          </div>
        </div>

        {selectedPhotos.length > 0 ? (
          <button
            onClick={handleWriteGps}
            disabled={isWriting}
            className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isWriting ? (
              <>
                <span className="material-icons animate-spin text-sm">sync</span>
                寫入中...
              </>
            ) : (
              <>
                <span className="material-icons text-sm">location_on</span>
                寫入 GPS 至所選照片 ({selectedPhotos.length})
              </>
            )}
          </button>
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
            請先選擇照片
          </div>
        )}
      </div>

      {/* Progress Overlay */}
      {isWriting && progress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-2xl p-8 min-w-[400px]">
            <h3 className="text-xl font-bold mb-4">正在寫入 GPS 資訊</h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">進度</span>
                <span className="font-semibold text-primary">
                  {Math.round((progress.completed / progress.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-border-dark h-3 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{
                    width: `${(progress.completed / progress.total) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">
                處理中: {progress.completed} / {progress.total} 張照片
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GpsWritePanel;
