import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import MapPicker from "../components/MapPicker";

const API_URL = 'https://ceylonmate-backend.vercel.app/api/places';

export default function EditPlace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // State
  const [formData, setFormData] = useState({
    name: '', description: '', history: '',
    latitude: '', longitude: '',
    model3DNowUrl: '', model3DThenUrl: ''
  });
  const [images, setImages] = useState([]);
  const [facts, setFacts] = useState([]);

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        const p = res.data;
        
        setFormData({
          name: p.name,
          description: p.description,
          history: p.history || '',
          latitude: p.location.coordinates[1], // Mongo is [lng, lat]
          longitude: p.location.coordinates[0],
          model3DNowUrl: p.model3DNowUrl || '',
          model3DThenUrl: p.model3DThenUrl || ''
        });
        setImages(p.images && p.images.length > 0 ? p.images : ['']);
        setFacts(p.facts && p.facts.length > 0 ? p.facts : [{ label: '', value: '' }]);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        alert("Error loading place data");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // Handlers (Same as AddPlace)
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleLocationSelect = (lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  
  const handleImageChange = (index, value) => {
    const list = [...images]; list[index] = value; setImages(list);
  };
  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index) => setImages(images.filter((_, i) => i !== index));

  const handleFactChange = (index, field, value) => {
    const list = [...facts]; list[index][field] = value; setFacts(list);
  };
  const addFact = () => setFacts([...facts, { label: '', value: '' }]);
  const removeFact = (index) => setFacts(facts.filter((_, i) => i !== index));

  // Update Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        images: images.filter(img => img.trim() !== ''),
        facts: facts.filter(f => f.label && f.value)
      };

      await axios.put(`${API_URL}/${id}`, payload);
      alert('Updated Successfully!');
      navigate('/');
    } catch (err) {
      alert('Update Failed: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="header-row">
        <h2>Edit: {formData.name}</h2>
        <Link to="/" className="btn btn-secondary">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="place-form">
        <div className="form-group">
          <label>Place Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Location</label>
          {/* Pass initial Lat/Lng to MapPicker so marker shows up */}
          <MapPicker 
            onLocationSelect={handleLocationSelect} 
            initialLat={formData.latitude} 
            initialLng={formData.longitude} 
          />
          <div className="coord-row">
            <input name="latitude" value={formData.latitude} readOnly />
            <input name="longitude" value={formData.longitude} readOnly />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>History</label>
          <textarea name="history" value={formData.history} onChange={handleChange} />
        </div>

        {/* Images */}
        <div className="section-box">
          <h4>📸 Photos</h4>
          {images.map((url, index) => (
            <div key={index} className="dynamic-row">
              <input value={url} onChange={(e) => handleImageChange(index, e.target.value)} />
              <button type="button" onClick={() => removeImageField(index)} className="btn-x">✕</button>
            </div>
          ))}
          <button type="button" onClick={addImageField} className="btn-small">+ Add Image</button>
        </div>

        {/* Facts */}
        <div className="section-box">
          <h4>📊 Facts</h4>
          {facts.map((fact, index) => (
            <div key={index} className="dynamic-row">
              <input value={fact.label} onChange={(e) => handleFactChange(index, 'label', e.target.value)} />
              <input value={fact.value} onChange={(e) => handleFactChange(index, 'value', e.target.value)} />
              <button type="button" onClick={() => removeFact(index)} className="btn-x">✕</button>
            </div>
          ))}
          <button type="button" onClick={addFact} className="btn-small">+ Add Fact</button>
        </div>

        {/* 3D Models */}
        <div className="section-box">
          <h4>🧊 3D Models</h4>
          <div className="form-group">
            <label>Now URL</label>
            <input name="model3DNowUrl" value={formData.model3DNowUrl} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Then URL</label>
            <input name="model3DThenUrl" value={formData.model3DThenUrl} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-save">Update Place</button>
      </form>
    </div>
  );
}