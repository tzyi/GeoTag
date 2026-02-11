import React, { useState } from 'react';
import type { GpsCoordinates } from '@shared/types';

interface CoordinatePanelProps {
  coordinates: GpsCoordinates | null;
  onManualInput?: (coords: GpsCoordinates) => void;
}

const CoordinatePanel: React.FC<CoordinatePanelProps> = ({ coordinates, onManualInput }) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onManualInput?.({ lat, lng });
      setShowManualInput(false);
      setManualLat('');
      setManualLng('');
    } else {
      alert('請輸入有效的座標（緯度: -90 to 90, 經度: -180 to 180）');
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white dark:bg-surface-dark rounded-lg shadow-xl p-4 border border-slate-200 dark:border-border-dark min-w-[280px] z-[1000]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">當前座標</h3>
        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-xs text-primary hover:text-primary/80 transition-colors"
        >
          {showManualInput ? '取消' : '手動輸入'}
        </button>
      </div>

      {showManualInput ? (
        <div className="space-y-2">
          <input
            type="number"
            step="any"
            placeholder="緯度 (Latitude)"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-border-dark rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            step="any"
            placeholder="經度 (Longitude)"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-border-dark rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleManualSubmit}
            className="w-full px-3 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded text-sm transition-colors"
          >
            確認
          </button>
        </div>
      ) : coordinates ? (
        <div className="space-y-1 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">緯度:</span>
            <span className="font-semibold">{coordinates.lat.toFixed(6)}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">經度:</span>
            <span className="font-semibold">{coordinates.lng.toFixed(6)}°</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-500 dark:text-slate-400">
          移動地圖選擇位置
        </div>
      )}
    </div>
  );
};

export default CoordinatePanel;
