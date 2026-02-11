import React, { useState, useEffect } from 'react';
import PhotoSidebar from './components/PhotoSidebar';
import PhotoDropzone from './components/PhotoDropzone';
import MapView from './components/MapView';
import CoordinatePanel from './components/CoordinatePanel';
import MapSearchBar from './components/MapSearchBar';
import GpsWritePanel from './components/GpsWritePanel';
import ExifDrawer from './components/ExifDrawer';
import { usePhotoStore } from './store/photoStore';
import { useThemeStore } from './store/themeStore';
import type { GpsCoordinates } from '@shared/types';

const App: React.FC = () => {
  const { photos, currentPhotoId } = usePhotoStore();
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const [currentCoords, setCurrentCoords] = useState<GpsCoordinates | null>(null);
  const [showExifDrawer, setShowExifDrawer] = useState(false);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    if (currentPhotoId) {
      setShowExifDrawer(true);
    }
  }, [currentPhotoId]);

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
              />
              <GpsWritePanel
                currentCoordinates={currentCoords}
                onClose={() => {}}
              />
            </>
          )}
        </div>
      </main>

      {/* EXIF Drawer */}
      <ExifDrawer isOpen={showExifDrawer} onClose={() => setShowExifDrawer(false)} />
    </div>
  );
};

export default App;
