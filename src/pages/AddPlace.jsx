import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import MapPicker from "../components/MapPicker";

const API_URL = 'http://localhost:5000/api/places/add'; 

export default function AddPlace() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Basic Info
  const [formData, setFormData] = useState({
    name: '', description: '', history: '',
    latitude: '', longitude: '',
    model3DNowUrl: '', model3DThenUrl: '' // 👈 Two Models
  });

  // Dynamic Lists
  const [images, setImages] = useState(['']); // Start with 1 empty image slot
  const [facts, setFacts] = useState([{ label: '', value: '' }]);

  // --- HANDLERS ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  // Image Handlers
  const handleImageChange = (index, value) => {
    const list = [...images];
    list[index] = value;
    setImages(list);
  };
  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index) => setImages(images.filter((_, i) => i !== index));

  // Fact Handlers
  const handleFactChange = (index, field, value) => {
    const list = [...facts];
    list[index][field] = value;
    setFacts(list);
  };
  const addFact = () => setFacts([...facts, { label: '', value: '' }]);
  const removeFact = (index) => setFacts(facts.filter((_, i) => i !== index));

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        images: images.filter(img => img.trim() !== ''), // Remove empty strings
        facts: facts.filter(f => f.label && f.value)     // Remove empty facts
      };

      await axios.post(API_URL, payload);
      alert('Place Saved Successfully!');
      navigate('/'); 
    } catch (err) {
      alert('Error saving place: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
       <div className="header-row">
        <h2>Add New Place</h2>
        <Link to="/" className="btn btn-secondary">Cancel</Link>
      </div>
      
      <form onSubmit={handleSubmit} className="place-form">
        {/* Basic Info */}
        <div className="form-group">
          <label>Place Name</label>
          <input name="name" onChange={handleChange} required placeholder="e.g. Sigiriya" />
        </div>

        {/* Map */}
        <div className="form-group">
          <label>Location (Search or Click Map)</label>
          <MapPicker onLocationSelect={handleLocationSelect} />
          <div className="coord-row">
            <input name="latitude" value={formData.latitude} readOnly placeholder="Lat" />
            <input name="longitude" value={formData.longitude} readOnly placeholder="Lng" />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>History</label>
          <textarea name="history" onChange={handleChange} />
        </div>

        {/* Images Section */}
        <div className="section-box">
          <h4>📸 Photo Gallery</h4>
          {images.map((url, index) => (
            <div key={index} className="dynamic-row">
              <input 
                placeholder={`Image URL #${index + 1}`} 
                value={url} 
                onChange={(e) => handleImageChange(index, e.target.value)} 
              />
              {images.length > 1 && (
                <button type="button" onClick={() => removeImageField(index)} className="btn-x">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addImageField} className="btn-small">+ Add Image URL</button>
        </div>

        {/* Facts Section */}
        <div className="section-box">
          <h4>📊 Quick Facts</h4>
          {facts.map((fact, index) => (
            <div key={index} className="dynamic-row">
              <input placeholder="Label (e.g. Height)" value={fact.label} onChange={(e) => handleFactChange(index, 'label', e.target.value)} />
              <input placeholder="Value (e.g. 200m)" value={fact.value} onChange={(e) => handleFactChange(index, 'value', e.target.value)} />
              <button type="button" onClick={() => removeFact(index)} className="btn-x">✕</button>
            </div>
          ))}
          <button type="button" onClick={addFact} className="btn-small">+ Add Fact</button>
        </div>

        {/* 3D Models */}
        <div className="section-box">
          <h4>🧊 3D Models</h4>
          <div className="form-group">
            <label>Current View (.glb URL)</label>
            <input name="model3DNowUrl" onChange={handleChange} placeholder="https://.../sigiriya-now.glb" />
          </div>
          <div className="form-group">
            <label>Ancient View (.glb URL)</label>
            <input name="model3DThenUrl" onChange={handleChange} placeholder="https://.../sigiriya-then.glb" />
          </div>
        </div>

        <button type="submit" className="btn btn-save" disabled={loading}>
          {loading ? 'Saving...' : 'Save Place'}
        </button>
      </form>
    </div>
  );
}