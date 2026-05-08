import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTheme } from '../../context/ThemeContext';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const issIcon = new L.divIcon({
  className: 'custom-iss-icon',
  html: `<div style="
    width: 40px; 
    height: 40px; 
    border: 3px solid #e07b39; 
    border-radius: 50%; 
    background: white; 
    box-shadow: 0 0 12px rgba(224,123,57,0.6); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 20px;
  ">🛸</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function ISSMap({ loading, positions, currentPos }) {
  const { isDark } = useTheme();
  
  if (loading && !currentPos) {
    return <div className="skeleton w-full h-72 md:h-96 rounded-xl"></div>;
  }

  const center = currentPos 
    ? { lat: currentPos.latitude, lng: currentPos.longitude } 
    : { lat: 0, lng: 0 };

  const polylinePositions = positions.map(p => [p.latitude, p.longitude]);

  return (
    <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-inner relative z-0">
      <MapContainer center={[center.lat, center.lng]} zoom={3} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          key={isDark ? 'dark' : 'light'}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url={
            isDark 
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />
        <MapUpdater center={center} />
        
        {polylinePositions.length > 0 && (
          <Polyline 
            positions={polylinePositions} 
            pathOptions={{ color: '#e07b39', weight: 2.5, opacity: 0.85, dashArray: "6 4" }} 
          />
        )}
        
        {currentPos && (
          <Marker position={[center.lat, center.lng]} icon={issIcon}>
            <Popup>
              <div className="text-center font-sans">
                <strong className="block text-accent mb-1">ISS Position</strong>
                <span className="block text-gray-700 dark:text-gray-300">Lat: {center.lat.toFixed(3)}</span>
                <span className="block text-gray-700 dark:text-gray-300">Lon: {center.lng.toFixed(3)}</span>
                <span className="block text-xs text-gray-500 mt-1">{currentPos.timeLabel}</span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
