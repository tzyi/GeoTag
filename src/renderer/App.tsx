import React, { useState, useEffect, useCallback } from 'react';
import PhotoSidebar from './components/PhotoSidebar';
import PhotoDropzone from './components/PhotoDropzone';
import MapView from './components/MapView';
import CoordinatePanel from './components/CoordinatePanel';
import MapSearchBar from './components/MapSearchBar';
import GpsWritePanel from './components/GpsWritePanel';
import { usePhotoStore } from './store/photoStore';
import { useThemeStore } from './store/themeStore';
import { useBatchStatusStore } from './store/batchStatusStore';
import type { GpsCoordinates } from '@shared/types';

const App: React.FC = () => {
  const { photos, currentPhotoId, getSelectedPhotos, updatePhoto } = usePhotoStore();
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const { progress, isWriting, setProgress, setIsWriting, resetProgress } = useBatchStatusStore();
  const [currentCoords, setCurrentCoords] = useState<GpsCoordinates | null>(null);
  
  const selectedPhotos = getSelectedPhotos();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    // Listen for GPS write progress (only if Electron API is available)
    if (!window.electron || typeof window.electron.on !== 'function') {
      return;
    }

    const handleProgress = (...args: unknown[]) => {
      if (args && args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
        const progressData = args[0] as { completed: number; total: number; failed: number };
        setProgress({
          total: progressData.total,
          completed: progressData.completed,
          failed: progressData.failed,
        });
      }
    };

    window.electron.on('gps:writeProgress', handleProgress);

    return () => {
      if (window.electron && typeof window.electron.off === 'function') {
        window.electron.off('gps:writeProgress', handleProgress);
      }
    };
  }, [setProgress]);

  const handleMapSearch = async (query: string) => {
    try {
      // Use Nominatim (OpenStreetMap) geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const results = await response.json();
      
      if (results && results.length > 0) {
        const { lat, lon } = results[0];
        setCurrentCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
        // Note: In a real app, we would also pan the map to this location
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleManualCoordInput = (coords: GpsCoordinates) => {
    setCurrentCoords(coords);
    // In a real app, we would also pan the map to this location
  };

  const handleWriteGps = useCallback(async () => {
    if (!currentCoords || selectedPhotos.length === 0) return;

    // Check if Electron API is available
    console.log('handleWriteGps - Checking Electron API...');
    console.log('window.electron:', window.electron);
    console.log('window.electron.writeGpsToPhotos:', window.electron?.writeGpsToPhotos);
    
    if (!window.electron || typeof window.electron.writeGpsToPhotos !== 'function') {
      const errorMsg = !window.electron 
        ? 'GPS 寫入功能需要在 Electron 桌面環境中執行\n\n錯誤: window.electron 未定義'
        : `GPS 寫入功能需要在 Electron 桌面環境中執行\n\n錯誤: writeGpsToPhotos 方法不存在或類型錯誤 (${typeof window.electron.writeGpsToPhotos})`;
      alert(errorMsg);
      console.error(errorMsg);
      return;
    }

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
        currentCoords.lat,
        currentCoords.lng
      );

      // Update photo statuses
      result.success.forEach((path) => {
        const photo = selectedPhotos.find((p) => p.filePath === path);
        if (photo) {
          updatePhoto(photo.id, {
            status: 'success',
            gps: currentCoords,
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
  }, [currentCoords, selectedPhotos, setIsWriting, setProgress, resetProgress, updatePhoto]);

  return (
    <div className="h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark flex items-center justify-between px-4 z-50 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-icons text-primary text-2xl">location_on</span>
            <h1 className="font-bold text-lg tracking-tight">
              GeoTag <span className="text-primary">Pro</span>
            </h1>
          </div>
          <div className="h-6 w-px bg-slate-300 dark:bg-border-dark mx-2"></div>
          <div className="flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span>照片:</span>
            <span className="text-slate-900 dark:text-slate-100">{photos.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <span className="material-icons text-sm">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {theme === 'dark' ? '淺色' : '深色'}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
            <span className="material-icons text-sm">settings</span>
            設定
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <PhotoSidebar />

        {/* Main View */}
        <div className="flex-1 relative">
          {photos.length === 0 ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="max-w-2xl w-full">
                <PhotoDropzone />
              </div>
            </div>
          ) : (
            <>
              {/* Map View */}
              <MapView
                onCenterChange={setCurrentCoords}
                initialCenter={{ lat: 25.033, lng: 121.5654 }}
              />

              {/* Map Overlays */}
              <MapSearchBar onSearch={handleMapSearch} />
              <CoordinatePanel
                coordinates={currentCoords}
                onManualInput={handleManualCoordInput}
                selectedCount={selectedPhotos.length}
                isWriting={isWriting}
                onWriteGps={handleWriteGps}
              />
              
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
          )}
        </div>
      </main>

      {/* EXIF Drawer 已移除 */}
    </div>
  );
};

export default App;
