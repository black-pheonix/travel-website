import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import styles

const OrganizerDashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dates: null, // Use Date object for the date picker
    price: "",
    availableSlots: "",
    cancellationPolicy: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dates: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure date is selected
    if (!formData.dates) {
      setMessage("Please select valid dates for the trip.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in as an organizer to add a trip!");
        return;
      }

      const payload = { ...formData, dates: formData.dates.toISOString() }; // Convert date to string
      const response = await axios.post("http://localhost:5000/api/trips", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Trip added successfully!");
      setFormData({
        name: "",
        description: "",
        dates: null,
        price: "",
        availableSlots: "",
        cancellationPolicy: "",
      });
    } catch (error) {
      console.error("Error adding trip:", error);
      setMessage("Failed to add trip. Please try again.");
    }
  };

  return (
    <div className="organizer-dashboard">
      <h1>Organizer Dashboard</h1>
      <form onSubmit={handleSubmit} className="add-trip-form">
        <input
          type="text"
          name="name"
          placeholder="Trip Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        {/* Date Picker */}
        <DatePicker
          selected={formData.dates}
          onChange={handleDateChange}
          minDate={new Date()} // Prevent past dates
          showTimeSelect
          dateFormat="Pp" // Show date and time
          placeholderText="Select trip date and time"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="availableSlots"
          placeholder="Available Slots"
          value={formData.availableSlots}
          onChange={handleChange}
          required
        />
        <textarea
          name="cancellationPolicy"
          placeholder="Cancellation Policy"
          value={formData.cancellationPolicy}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Add Trip</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OrganizerDashboard;
