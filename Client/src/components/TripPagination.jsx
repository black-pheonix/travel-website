import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

const TripPagination = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const [trips, setTrips] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const tripsPerPage = 6;

    // Fetch trips based on the current page
    const fetchTrips = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/trips?page=${page}&limit=${tripsPerPage}`);
            
            // Check if response contains trips and pagination
            if (response.data && response.data.trips && response.data.pagination) {
                setTrips(response.data.trips);
                setTotalPages(response.data.pagination.totalPages);
                setCurrentPage(page);
            } else {
                console.error("Unexpected response structure:", response.data);
                setTrips([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setLoading(false);
        }
    };
    

    // UseEffect to fetch trips initially or when currentPage changes
    useEffect(() => {
        fetchTrips(currentPage);
    }, [currentPage]);

    // Navigate to previous page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Navigate to next page
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle jump to specific page
    const jumpToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Navigate to OrganizerDashboard page
    const goToOrganizerDashboard = () => {
        navigate('/organizer-dashboard'); // Navigate to the OrganizerDashboard
    };

    return (
        <div>
            <div className="trip-cards">
                {loading ? (
                    <p>Loading trips...</p>
                ) : trips.length > 0 ? (
                    trips.map((trip) => (
                        <Link to={`/trip/${trip._id}`} key={trip._id} className="trip-link">
                            <div className="trip-card">
                                <h3>{trip.name}</h3>
                                <p>{trip.description}</p>
                                <p>{new Date(trip.dates).toLocaleDateString()}</p>
                                <p>{trip.price} USD</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No trips available</p>
                )}
            </div>

            <div className="pagination">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1} 
                    className={`arrow ${currentPage === 1 ? 'disabled' : ''}`}
                >
                    &#8592; Previous
                </button>

                <input
                    type="number"
                    value={currentPage}
                    min="1"
                    max={totalPages}
                    onChange={(e) => jumpToPage(Number(e.target.value))}
                />

                <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages} 
                    className={`arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                >
                    Next &#8594;
                </button>
            </div>

            {/* Button to navigate to OrganizerDashboard */}
            <button onClick={goToOrganizerDashboard} className="go-to-organizer-dashboard">
                Add a Trip
            </button>
        </div>
    );
};

export default TripPagination;
