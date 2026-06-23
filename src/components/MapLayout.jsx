import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Calendar, MapPin, Download } from 'lucide-react';
import { generateIcsFile, generateGoogleCalendarUrl } from '../utils/icsExport';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored icons by type
const createColoredIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 12px;
      height: 12px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
};

const typeColors = {
  'Conference': '#3b82f6',
  'Workshop': '#8b5cf6',
  'Summer School': '#f59e0b',
};

// Component to recenter map when conferences change
const MapUpdater = ({ conferences }) => {
  const map = useMap();
  useEffect(() => {
    if (conferences.length > 0) {
      const validConfs = conferences.filter(c => c.coordinates[0] !== 0 || c.coordinates[1] !== 0);
      if (validConfs.length > 0) {
        const bounds = L.latLngBounds(validConfs.map(c => c.coordinates));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 4 });
      }
    }
  }, [conferences, map]);
  return null;
};

// Component to focus on a specific conference when clicked from the list
const MapFocusUpdater = ({ selectedConferenceId, conferences }) => {
  const map = useMap();
  const prevIdRef = useRef(null);
  useEffect(() => {
    if (selectedConferenceId && selectedConferenceId !== prevIdRef.current) {
      prevIdRef.current = selectedConferenceId;
      const conf = conferences.find(c => c.id === selectedConferenceId);
      if (conf && conf.coordinates) {
        if (conf.coordinates[0] !== 0 || conf.coordinates[1] !== 0) {
          map.flyTo(conf.coordinates, 8, { duration: 1.5 });
        }
      }
    }
  }, [selectedConferenceId, conferences, map]);
  return null;
};

const MapLayout = ({ conferences, selectedConferenceId }) => {
  const defaultCenter = [48.8566, 2.3522];

  // Filter out conferences with 0,0 coordinates (online events)
  const mappableConferences = conferences.filter(c => c.coordinates[0] !== 0 || c.coordinates[1] !== 0);

  return (
    <div className="glass-panel" style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }}></span> Conference</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: '#8b5cf6' }}></span> Workshop</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }}></span> Summer School</div>
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater conferences={mappableConferences} />
        <MapFocusUpdater selectedConferenceId={selectedConferenceId} conferences={conferences} />
        
        {mappableConferences.map(conf => (
          <Marker 
            key={conf.id} 
            position={conf.coordinates}
            icon={createColoredIcon(typeColors[conf.type] || '#3b82f6')}
          >
            <Popup>
              <div style={{ padding: '0.5rem', minWidth: '220px', color: '#f8fafc' }}>
                <a 
                  href={conf.website !== '#' ? conf.website : '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ margin: '0 0 0.5rem 0', color: '#93c5fd', fontSize: '1rem', fontWeight: 700, display: 'block', textDecoration: 'none' }}
                >
                  {conf.name} ↗
                </a>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong style={{ color: '#f8fafc' }}>Type:</strong> {conf.type}
                </p>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong style={{ color: '#f8fafc' }}>Date:</strong> {conf.eventDateStart} → {conf.eventDateEnd}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong style={{ color: '#f8fafc' }}>Deadline:</strong> {conf.deadline}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a 
                    href={generateGoogleCalendarUrl(conf)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="glass-button" 
                    style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', fontSize: '0.8rem' }}
                  >
                    <Calendar size={14} /> GCal
                  </a>
                  <button 
                    className="glass-button primary" 
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                    onClick={() => generateIcsFile(conf)}
                  >
                    <Download size={14} /> .ICS
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapLayout;
