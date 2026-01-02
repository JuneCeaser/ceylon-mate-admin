import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';

// Fix for missing default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// 1. Search Bar Component
const SearchField = () => {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false, // We handle the marker ourselves
      autoClose: true,
      retainZoomLevel: false,
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
};

// 2. Click Handler Component
const LocationMarker = ({ setPosition, position }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng); // Update parent state on click
    },
  });

  return position ? <Marker position={position} /> : null;
};

export default function MapPicker({ onLocationSelect, initialLat, initialLng }) {
  // Default to Sri Lanka center if no initial pos
  const defaultCenter = [7.8731, 80.7718]; 
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  // When position changes, notify the parent form
  useEffect(() => {
    if (position) {
      onLocationSelect(position.lat, position.lng);
    }
  }, [position]);

  return (
    <div style={{ height: '400px', width: '100%', marginBottom: '20px', border: '2px solid #ddd' }}>
      <MapContainer 
        center={initialLat ? [initialLat, initialLng] : defaultCenter} 
        zoom={initialLat ? 15 : 8} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <SearchField />
        <LocationMarker setPosition={setPosition} position={position} />
      </MapContainer>
      <div style={{marginTop: '5px', fontSize: '12px', color: '#666'}}>
        Tip: Search for a place or click anywhere on the map to pin it.
      </div>
    </div>
  );
}