import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/trips/${id}`);
        setTrip(response.data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };
    fetchTrip();
  }, [id]);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored after login
      if (!token) {
        alert("Please log in to book a trip!");
        navigate("/login");
        return;
      }
      await axios.post(
        "http://localhost:5000/api/bookings",
        { tripId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Trip booked successfully!");
    } catch (error) {
      console.error("Error booking trip:", error);
    }
  };

  if (!trip) return <p>Loading...</p>;

  return (
    <div className="trip-details">
      <h1>{trip.name}</h1>
      <p>{trip.description}</p>
      <p>Price: ${trip.price}</p>
      <p>Available Slots: {trip.availableSlots}</p>
      <p>Cancellation Policy: {trip.cancellationPolicy}</p>
      <button onClick={handleBooking}>Book Now</button>
    </div>
  );
};

export default TripDetails;
