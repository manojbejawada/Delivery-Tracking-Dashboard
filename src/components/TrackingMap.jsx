import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Green truck icon for live agent
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Red icon for destination
const destIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Orange icon for Warehouse Hub
const startIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Auto-pan map when live marker moves
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.panTo(position, { animate: true, duration: 1 });
    }
  }, [position, map]);
  return null;
}

// Adjust map bounds to show the complete route initially
function MapBoundsUpdater({ start, end }) {
  const map = useMap();
  useEffect(() => {
    if (start && end) {
      map.fitBounds([start, end], { padding: [50, 50] });
    }
  }, [start, end, map]);
  return null;
}

// Fallbacks
const DEFAULT_START = [17.3600, 78.4500];
const DEFAULT_DEST = [17.4000, 78.5200];

const TrackingMap = ({ livePosition, destinationLabel = 'Delivery Address', isLive = false, startCoords, endCoords }) => {
  const startPosition = startCoords || DEFAULT_START;
  const destPosition = endCoords || DEFAULT_DEST;
  const centerPosition = livePosition || destPosition;

  return (
    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      {/* Status bar above the map */}
      <div style={{
        padding: '10px 16px',
        backgroundColor: isLive ? '#ecfdf5' : 'var(--secondary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
      }}>
        {isLive ? (
          <>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: '#10b981', display: 'inline-block',
              boxShadow: '0 0 0 3px rgba(16,185,129,0.3)',
              animation: 'pulse 1.5s infinite'
            }} />
            <span style={{ color: '#047857' }}>LIVE — Driver is moving from dispatch hub to your address!</span>
          </>
        ) : (
          <>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', display: 'inline-block' }} />
            <span className="text-muted">Route map (Dispatch Hub to Customer Address) — Live tracking starts when out for delivery</span>
          </>
        )}
      </div>

      {/* The actual map */}
      <div style={{ height: '380px', width: '100%' }}>
        <MapContainer center={centerPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Start Hub Pin */}
          <Marker position={startPosition} icon={startIcon}>
            <Popup>🏭 Dispatch Logistics Hub</Popup>
          </Marker>

          {/* Destination pin */}
          <Marker position={destPosition} icon={destIcon}>
            <Popup>📦 Destination: {destinationLabel}</Popup>
          </Marker>

          {/* Planned Delivery Route Path */}
          <Polyline 
            positions={[startPosition, destPosition]} 
            color="var(--primary)" 
            weight={3} 
            opacity={0.6} 
            dashArray="8, 8" 
          />

          {/* Traveled Route Path (when live) */}
          {isLive && livePosition && (
            <Polyline 
              positions={[startPosition, livePosition]} 
              color="#10b981" 
              weight={4} 
              opacity={0.8} 
            />
          )}

          {/* Live agent marker */}
          {isLive && livePosition && (
            <Marker position={livePosition} icon={truckIcon}>
              <Popup>🚚 Delivery Agent — Live Location</Popup>
            </Marker>
          )}

          {/* Fit view bounds to show full route */}
          <MapBoundsUpdater start={startPosition} end={destPosition} />

          {/* Auto-pan tracking marker in live mode */}
          {isLive && livePosition && <MapUpdater position={livePosition} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default TrackingMap;
