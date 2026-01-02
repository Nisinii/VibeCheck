import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
// Make sure this matches your actual filename! You mentioned 'getDirections.jsx' but imported PlaceDetails
import PlaceDetails from './pages/PlaceDetails'; 
import DeveloperPage from './pages/DeveloperPage';

const App = () => {
  return (
    // 
    // The Router MUST wrap everything for hooks to work
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* The :id allows us to grab the place ID from the URL */}
        <Route path="/place/:id" element={<PlaceDetails />} />
        <Route path="/developer" element={<DeveloperPage />} />
      </Routes>
    </Router>
  );
};

export default App;