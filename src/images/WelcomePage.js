import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateAccountPage from './CreateAccountPage';
import '../styles/WelcomePage.css';

// Import local images (ensure these paths are correct)
import image1 from '../images/default-profile.jpg';
import image2 from '../public/images/haircolor.jpg';
import image3 from 'public/images/manicure.jpg';

const WelcomePage = () => {
  const [currentImage, setCurrentImage] = useState(0); // Track the active image index
  const images = [image1, image2, image3]; // Array of imported images
  const [isClicked, setIsClicked] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Slideshow effect: Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, [images.length]);

  useEffect(() => {
    if (location.state && location.state.showLogin) {
      setShowLogin(true);
    }
  }, [location.state]);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setShowLogin(true);
    }, 500);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch('http://127.0.0.1/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        localStorage.setItem('userEmail', email);
        navigate(result.isAdmin ? '/admin-today-reservations' : '/home');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleBackToWelcome = () => {
    setShowLogin(false);
    setIsClicked(false);
  };

  const handleCreateAccountClick = () => {
    setShowCreateAccount(true);
    setTimeout(() => setIsModalVisible(true), 200);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setShowCreateAccount(false), 500);
  };

  return (
    <div className="container">
      {/* Left-side: Slideshow */}
      <div
        className="image-container"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      ></div>

      {/* Right-side: Welcome/Login */}
      {!showLogin ? (
        <div className={`welcome-container ${isClicked ? 'fade-out' : ''}`}>
          <div className="welcome-message">
            <img
              src={image1} // You can also use a specific logo here
              alt="Chic Station Logo"
              className="logo"
            />
            <h1>Welcome to Chic Station</h1>
            <p>Book your appointment with ease and style.</p>
            <button className="book-now-button" onClick={handleClick}>
              Book Now
            </button>
          </div>
        </div>
      ) : (
        <div className="login-container fade-in">
          <div className="login-box">
            <img
              src={image1} // Replace with another logo or relevant image
              alt="Chic Station Logo"
              className="login-logo"
            />
            <h2>Login to Chic Station</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
            <div className="additional-links">
              <button onClick={handleCreateAccountClick} className="create-account-button2">
                Create Account
              </button>
              <button onClick={handleBackToWelcome} className="back-button">
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateAccount && (
        <div className={`modal ${isModalVisible ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            <CreateAccountPage onCloseModal={handleCloseModal} />
          </div>
          <div className="modal-overlay" onClick={handleCloseModal}></div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
