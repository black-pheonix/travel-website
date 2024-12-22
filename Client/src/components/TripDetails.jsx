import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TripDetails = () => {
    const { id } = useParams(); // Get the trip ID from the URL
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const response = await axios.get(`/api/trips/${id}`);
                setTrip(response.data);
            } catch (error) {
                console.error("Error fetching trip details:", error);
            }
        };

        fetchTripDetails();
    }, [id]);

    if (!trip) {
        return <p>Loading trip details...</p>;
    }

    return (
        <div>
            <h2>{trip.name}</h2>
            <p>{trip.description}</p>
            <p>Date of Departure: {new Date(trip.dates).toLocaleDateString()}</p>
            <p>Price: {trip.price} USD</p>
            {/* Add more details like images, location, etc. */}
        </div>
    );
};

export default TripDetails;
