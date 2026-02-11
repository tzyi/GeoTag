import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { GpsCoordinates } from '@shared/types';

interface MapViewProps {
  onCenterChange: (coords: GpsCoordinates) => void;
  initialCenter?: GpsCoordinates;
  focusCoords?: GpsCoordinates | null;
}

const MapEventHandler: React.FC<{ onMove: (coords: GpsCoordinates) => void }> = ({ onMove }) => {
  useMapEvents({
    moveend: (e) => {
      const center = e.target.getCenter();
      onMove({ lat: center.lat, lng: center.lng });
    },
  });
  return null;
};

const MapRecenter: React.FC<{ target?: GpsCoordinates | null }> = ({ target }) => {
  const map = useMap();
  const lastTarget = useRef<GpsCoordinates | null>(null);

  useEffect(() => {
    if (!target) return;
    const sameAsLast =
      lastTarget.current &&
      Math.abs(lastTarget.current.lat - target.lat) < 1e-9 &&
      Math.abs(lastTarget.current.lng - target.lng) < 1e-9;
    if (sameAsLast) return;

    map.flyTo([target.lat, target.lng], map.getZoom(), {
      animate: true,
      duration: 0.8,
    });
    lastTarget.current = target;
  }, [map, target]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({ onCenterChange, initialCenter, focusCoords }) => {
  const [center] = useState<GpsCoordinates>(initialCenter || { lat: 25.033, lng: 121.5654 });

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventHandler onMove={onCenterChange} />
        <MapRecenter target={focusCoords} />
      </MapContainer>

      {/* Crosshair in center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1000]">
        <div className="relative">
          <span className="material-icons text-red-500 text-5xl drop-shadow-lg">
            my_location
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
