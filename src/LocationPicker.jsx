// src/LocationPicker.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icon in Leaflet with React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle Map Clicks
function ClickHandler({ setPos }) {
  useMapEvents({
    click(e) {
      setPos(e.latlng); // Update state on click
    },
  });
  return null;
}

// Component to fly to new location when search or click changes
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15); // Zoom level 15
    }
  }, [center, map]);
  return null;
}

export default function LocationPicker({ onLocationSelect }) {
  // Default center: Colombo, Sri Lanka
  const [position, setPosition] = useState({ lat: 6.9271, lng: 79.8612 });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Send coordinates back to parent (App.jsx) whenever position changes
  useEffect(() => {
    onLocationSelect(position.lat, position.lng);
  }, [position]);

  // Search function using OpenStreetMap Nominatim API (Free)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(newPos); // Move marker and map
      } else {
        alert("Location not found!");
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {/* Search Bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search place (e.g. Galle Fort)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading}
          style={{ padding: "10px 20px", background: "#333", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          {loading ? "Searching..." : "Find"}
        </button>
      </div>

      {/* Map Container */}
      <div style={{ height: "300px", borderRadius: "10px", overflow: "hidden", border: "2px solid #ddd" }}>
        <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker position={position} />
          
          <ClickHandler setPos={setPosition} />
          <MapUpdater center={[position.lat, position.lng]} />
        </MapContainer>
      </div>
      
      <p style={{ fontSize: "12px", color: "#666", marginTop: "5px", textAlign: "center" }}>
        📍 Selected: {position.lat.toFixed(5)}, {position.lng.toFixed(5)} (Click map to adjust)
      </p>
    </div>
  );
}