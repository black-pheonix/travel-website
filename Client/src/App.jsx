import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TripPagination from './components/TripPagination';
import TripDetails from './components/TripDetails'; 
import NavBar from './components/NavBar';
import OrganizerDashboard from './pages/OrganizerDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar /> {/* NavBar stays common across all routes */}
        <Routes>
          {/* Render TripPagination only on the "/" route */}
          <Route path="/" element={
            <>
              <h1>Available Trips</h1>
              <TripPagination />
            </>
          } />

          {/* Route for OrganizerDashboard */}
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />

          {/* Route for TripDetails */}
          <Route path="/trip/:id" element={<TripDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
