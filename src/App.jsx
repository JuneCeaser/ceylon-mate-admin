import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 👇 FIX: Use "./" (dot slash) and ensure the folder name matches exactly (usually lowercase "pages")
import Dashboard from './pages/Dashboard';
import AddPlace from './pages/AddPlace';
import EditPlace from './pages/EditPlace';

import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <h1>Ceylon Mate Admin</h1>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddPlace />} />
            <Route path="/edit/:id" element={<EditPlace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;