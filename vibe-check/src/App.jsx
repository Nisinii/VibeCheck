import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// PAGE IMPORTS
import Home from './pages/Home';
import PlaceDetails from './pages/PlaceDetails';
import DeveloperPage from './pages/DeveloperPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';

// ------------------------------------------------------------------
// COMPONENT: APP ROOT
// ------------------------------------------------------------------
// The entry point for the application's routing logic.
// Manages navigation between the Dashboard (Home), Details, and Info pages.

const App = () => {
  return (
    // Router must wrap the entire application to enable Link/useNavigate hooks
    <Router>
      <Routes>
        
        {/* 1. DASHBOARD (Landing & Search) */}
        <Route path="/" element={<Home />} />

        {/* 2. DYNAMIC PLACE DETAILS */}
        {/* The ':id' param allows us to grab the specific place ID from the URL */}
        <Route path="/place/:id" element={<PlaceDetails />} />

        {/* 3. INFO PAGES */}
        <Route path="/developer" element={<DeveloperPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* 4. 404 CATCH-ALL */}
        {/* The '*' matches any path not explicitly defined above */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
};

export default App;