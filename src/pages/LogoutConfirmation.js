// LogoutConfirmation.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LogoutConfirmation.css';

const LogoutConfirmation = ({ show, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Using useNavigate for programmatic navigation

  const handleLogout = () => {
    setIsLoading(true);
    
    // Clear user data from local storage
    localStorage.removeItem('userEmail'); // Replace 'user' with the key for your stored data

    // Simulate logout delay
    setTimeout(() => {
      navigate('/'); // Redirect to login page
    }, 2000);
  };

  if (!show) return null;

  return (
    <div className="logout-confirmation-overlay">
      <div className="logout-confirmation-box">
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <>
            <h3>Are you sure you want to logout?</h3>
            <div className="logout-confirmation-actions">
              <button onClick={handleLogout} className="yes-button">Yes,Logout</button>
              <button onClick={onClose} className="no-button">Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LogoutConfirmation;
