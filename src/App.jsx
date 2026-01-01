// src/App.jsx
import { useState } from 'react';
import axios from 'axios';
import LocationPicker from './LocationPicker'; // <--- Import the new component
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    history: '',
    latitude: '',
    longitude: '',
    model3DUrl: '',
    arOverlayUrl: '',
    images: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Callback function for the Map Component
  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      images: formData.images.split(',').map(url => url.trim()).filter(url => url !== '')
    };

    try {
      // REPLACE with your actual backend URL
      await axios.post('http://localhost:5000/api/places/add', payload);
      setMessage({ type: 'success', text: '✅ Place added successfully!' });
      
      // Reset form (Optional: You might want to keep the map location)
      setFormData({
        name: '', description: '', history: '', 
        latitude: '', longitude: '', // Reset these too
        model3DUrl: '', arOverlayUrl: '', images: ''
      });

    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: '❌ Error adding place.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🏛️ Ceylon Mate Admin</h1>
        <p>Search or Click on map to set location</p>
      </header>

      <form onSubmit={handleSubmit} className="place-form">
        
        {/* NEW: Map Section placed at the top for easy selection */}
        <div className="form-group">
          <h3>📍 Select Location</h3>
          <LocationPicker onLocationSelect={handleLocationSelect} />
        </div>

        {/* Basic Info */}
        <div className="form-group">
          <h3>📝 Details</h3>
          <input 
            type="text" name="name" placeholder="Place Name" 
            value={formData.name} onChange={handleChange} required 
          />
          <textarea 
            name="description" placeholder="Short Description" 
            value={formData.description} onChange={handleChange} required 
          />
          <textarea 
            name="history" placeholder="Detailed History" 
            value={formData.history} onChange={handleChange} rows="3"
          />
        </div>

        {/* Coordinates (Auto-filled but editable) */}
        <div className="form-group">
          <h3>🌍 Coordinates (Auto-Filled)</h3>
          <div className="row">
            <input 
              type="number" step="any" name="latitude" placeholder="Latitude" 
              value={formData.latitude} onChange={handleChange} required 
            />
            <input 
              type="number" step="any" name="longitude" placeholder="Longitude" 
              value={formData.longitude} onChange={handleChange} required 
            />
          </div>
        </div>

        {/* Assets */}
        <div className="form-group">
          <h3>🖼️ Assets</h3>
          <input 
            type="text" name="images" placeholder="Image URLs (comma separated)" 
            value={formData.images} onChange={handleChange} 
          />
          <input 
            type="text" name="model3DUrl" placeholder="3D Model URL" 
            value={formData.model3DUrl} onChange={handleChange} 
          />
          <input 
            type="text" name="arOverlayUrl" placeholder="AR Overlay URL" 
            value={formData.arOverlayUrl} onChange={handleChange} 
          />
        </div>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Saving...' : 'Save Place'}
        </button>
      </form>
    </div>
  );
}

export default App;