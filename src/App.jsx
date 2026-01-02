import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ⚠️ CHANGE: Import directly from the same folder (./)
import AddPlace from './AddPlace'; 
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* This makes the AddPlace form the home page */}
        <Route path="/" element={<AddPlace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;