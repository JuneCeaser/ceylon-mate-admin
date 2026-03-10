import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// ⚠️ CHECK PORT
const API_URL = 'https://ceylonmate-backend.vercel.app/api/places';                                                       

export default function Dashboard() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch places on load
  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(`${API_URL}/all`);
      setPlaces(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch places. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        // Remove from UI immediately
        setPlaces(places.filter(p => p._id !== id));
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  // 2. Filter Logic (Search by Name or Description)
  const filteredPlaces = places.filter((place) => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading Places...</div>;

  return (
    <div className="container">
      <div className="header-row">
        <h2>All Historical Places</h2>
        <Link to="/add" className="btn btn-primary">+ Add New Place</Link>
      </div>

      {/* 3. Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Search places..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Images</th>
            <th>Models</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* 4. Use 'filteredPlaces' instead of 'places' */}
          {filteredPlaces.map((place) => (
            <tr key={place._id}>
              <td>
                <strong>{place.name}</strong>
                <p className="small-text">{place.description?.substring(0, 50)}...</p>
              </td>
              <td>{place.location?.coordinates[1].toFixed(4)}, {place.location?.coordinates[0].toFixed(4)}</td>
              <td>{place.images?.length || 0} Photos</td>
              <td>
                {place.model3DNowUrl && <span className="badge badge-now">Now</span>}
                {place.model3DThenUrl && <span className="badge badge-then">Then</span>}
              </td>
              <td>
                <Link to={`/edit/${place._id}`} className="btn btn-edit">Edit</Link>
                <button onClick={() => handleDelete(place._id)} className="btn btn-delete">Delete</button>
              </td>
            </tr>
          ))}
          
          {filteredPlaces.length === 0 && (
            <tr>
              <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                {searchTerm ? "No matching places found." : "No places found. Add one!"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}