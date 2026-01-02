import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapPicker from './MapPicker';
import './AddPlace.css'; // You can create simple CSS for padding

// ⚠️ CHANGE THIS TO YOUR BACKEND URL
const API_URL = 'http://localhost:5000/api/places/add'; 

export default function AddPlace() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', description: '', history: '',
    latitude: '', longitude: '',
    imageUrl: '', model3DUrl: ''
  });

  // Facts State
  const [facts, setFacts] = useState([{ label: '', value: '' }]);

  // Handlers
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Map Handler
  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  // Facts Handlers
  const handleFactChange = (index, field, value) => {
    const newFacts = [...facts];
    newFacts[index][field] = value;
    setFacts(newFacts);
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
        images: [formData.imageUrl], 
        facts: facts.filter(f => f.label && f.value) // Remove empty facts
      };

      await axios.post(API_URL, payload);
      alert('Place Saved Successfully!');
      navigate('/'); // Go back to dashboard
    } catch (err) {
      alert('Error saving place: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Add New Historical Place</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Place Name</label>
          <input name="name" onChange={handleChange} required placeholder="e.g. Sigiriya" />
        </div>

        <div className="form-group">
          <label>Map Location (Search or Click)</label>
          {/* 👇 MAP PICKER INTEGRATION */}
          <MapPicker onLocationSelect={handleLocationSelect} />
          
          <div className="row">
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

        {/* Dynamic Facts Section */}
        <div className="facts-section">
          <h4>Quick Facts</h4>
          {facts.map((fact, index) => (
            <div key={index} className="fact-row">
              <input placeholder="Label (e.g. Height)" value={fact.label} onChange={(e) => handleFactChange(index, 'label', e.target.value)} />
              <input placeholder="Value (e.g. 200m)" value={fact.value} onChange={(e) => handleFactChange(index, 'value', e.target.value)} />
              {facts.length > 1 && <button type="button" onClick={() => removeFact(index)} className="delete-btn">X</button>}
            </div>
          ))}
          <button type="button" onClick={addFact} className="add-btn">+ Add Fact</button>
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input name="imageUrl" onChange={handleChange} placeholder="https://..." />
        </div>

        <div className="form-group">
          <label>3D Model URL (.glb)</label>
          <input name="model3DUrl" onChange={handleChange} placeholder="https://..." />
        </div>

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Place'}
        </button>
      </form>
    </div>
  );
}