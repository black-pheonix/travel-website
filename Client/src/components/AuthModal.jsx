import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root"); // Accessibility

const AuthModal = ({ isOpen, onRequestClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // Only required for Sign Up
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "login" : "register";
    const payload = isLogin 
      ? { email: formData.email, password: formData.password } 
      : { ...formData };

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
      const token = response.data.token; // Assuming login returns a token
      if (token) {
        localStorage.setItem("token", token);
        setMessage("Success!");
        onRequestClose(); // Close modal
      } else {
        setMessage(response.data.msg || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to authenticate. Please try again.");
    }
  };

  const handleGoBack = () => {
    onRequestClose(); // Close modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Authentication Modal"
      className="auth-modal"
      overlayClassName="auth-overlay"
    >
      {/* Close Button */}
      <div className="back-button" onClick={handleGoBack}>
        &times;
      </div>

      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>

      <p className="auth-toggle">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Sign Up" : "Login"}</span>
      </p>
      {message && <p className="auth-message">{message}</p>}
    </Modal>
  );
};

export default AuthModal;
