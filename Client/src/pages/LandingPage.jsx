import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTrips, setTotalTrips] = useState(0);
  const tripsPerPage = 6; // 3x2 layout
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch trips data from the server
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/trips`, {
          params: { page: currentPage, limit: tripsPerPage },
        });
        setTrips(response.data.trips);
        setTotalTrips(response.data.totalTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();
  }, [currentPage]);

  const totalPages = Math.ceil(totalTrips / tripsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBookTrip = (tripId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to book a trip!");
      navigate("/login");
      return;
    }
    // Proceed to booking logic
    alert("Booking trip with ID: " + tripId);
  };

  return (
    <div className="landing-page">
      <h1>Available Trips</h1>
      <div className="trips-grid">
        {trips.map((trip) => (
          <div key={trip._id} className="trip-card">
            <h3>{trip.destination}</h3>
            <p>Date of Departure: {new Date(trip.dateOfDeparture).toLocaleDateString()}</p>
            <p>Price: ${trip.price}</p>
            <button onClick={() => handleBookTrip(trip._id)}>Book Now</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        )}
        <span>
          Page {currentPage} of {totalPages}
        </span>
        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
