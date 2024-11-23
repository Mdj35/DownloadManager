
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateAccountPage from './CreateAccountPage';
import '../styles/WelcomePage.css';
import { auth, provider, signInWithPopup,facebookProvider,signInWithRedirect } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FaFacebook, FaInstagram, FaFacebookMessenger, FaPhone } from 'react-icons/fa';



import image1 from '../images/chic1.jpg';
import image2 from '../images/chic2.jpg';
import image3 from '../images/chic3.jpg';
import image4 from '../images/chic4.jpg';
import image5 from '../images/chic5.jpg';
import branch1Image from '../images/LOC1.jpg';  
import branch2Image from '../images/LOC2.jpg';
import aboutUsBg from '../images/Chic Station.jpg'; // Correctly import the background image

const WelcomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentBranch, setCurrentBranch] = useState(0); // New state for current branch
  const images = [image1, image2, image3, image4, image5];
  const branches = [
    {
      image: branch1Image,
      address: 'Chippens Dormitory, 368 Padre Gomez St., Poblacion District, Davao City',
      locationLink:'https://www.google.com/maps/search/?api=1&query=Chippens+Dormitory%2C+368+Padre+Gomez+St.%2C+Poblacion+District%2C+Davao+City', // Link for Branch 1', // Link for Branch 1
    },
    {
      image: branch2Image,
      address: 'Rizal Extension, Corner De Jesus St, Davao City',
      locationLink:'https://www.google.com.ph/maps/place/Chic+Station+2/@7.06557,125.6117314,17z/data=!4m14!1m7!3m6!1s0x32f96d69293c4605:0xcc0838259e91370e!2sChic+Station+2!8m2!3d7.0655126!4d125.6119076!16s%2Fg%2F11s436fwh_!3m5!1s0x32f96d69293c4605:0xcc0838259e91370e!8m2!3d7.0655126!4d125.6119076!16s%2Fg%2F11s436fwh_?entry=ttu&g_ep=EgoyMDI0MTAxNi4wIKXMDSoASAFQAw%3D%3D', // Link for Branch 2', // Link for Branch 2
    },
  ];

  const [isClicked, setIsClicked] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
  
      // Store the email in localStorage
      localStorage.setItem('userEmail', user.email);
  
      // Prepare the user details to send to the backend
      const userDetails = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        contactNumber: "", // Optionally collect the contact number
      };
  
      // Send the user details to the backend
      const response = await fetch("https://vynceianoani.helioho.st/storeUserEmail.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });
  
      const data = await response.json();
      if (data.status === "success") {
        console.log("User details stored successfully in the database.");
      } else {
        console.error("Failed to store user details:", data.message);
      }
  
      // Navigate to the home or dashboard page
      navigate('/home');
    } catch (error) {
      console.error('Facebook Sign-In Error:', error);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Store the email in localStorage
      localStorage.setItem('userEmail', user.email);
  
      // Prepare the data to send to the backend
      const userDetails = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        contactNumber: "",  // You can prompt the user for a contact number if necessary
      };
  
      // Send the user details to the backend to store them in the database
      const response = await fetch("https://vynceianoani.helioho.st/storeUserEmail.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });
  
      const data = await response.json();
      if (data.status === "success") {
        console.log("User details stored successfully in the database.");
      } else {
        console.error("Failed to store user details:", data.message);
      }
  
      // Navigate to home or dashboard
      navigate('/home');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };
  


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (location.state && location.state.showLogin) {
      setShowLogin(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://vynceianoani.helioho.st/getServices3.php');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

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
      const response = await fetch('https://vynceianoani.helioho.st/login.php', {
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

  // New functions to navigate branches
  const handlePrevBranch = () => {
    setCurrentBranch((prev) => (prev - 1 + branches.length) % branches.length);
  };

  const handleNextBranch = () => {
    setCurrentBranch((prev) => (prev + 1) % branches.length);
  };

  return (
    <div className="scrollable-container">
      <div className="container">
        <div className="slideshow">
          {images.map((img, index) => (
            <div
              key={index}
              className={`slide ${index === currentImage ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}
        </div>

        {!showLogin ? (
          <div className={`welcome-container ${isClicked ? 'fade-out' : ''}`}>
            <div className="welcome-message">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSlpxpNoZdeY_qOKahqCVqVtfTxlwNZN6x6w&s"
                alt="Chic Station Logo"
                className="logo1"
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
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSlpxpNoZdeY_qOKahqCVqVtfTxlwNZN6x6w&s"
                alt="Chic Station Logo"
                className="logo1"
              />
              <h2>Login to Chic Station</h2>
              {error && <div className="error-message">{error}</div>}
        <button onClick={handleGoogleLogin} className="login-button google-login">
          Login with Google
        </button>
        <button onClick={handleFacebookLogin} className="login-button facebook-login">
  Login with Facebook
</button>

        <p>or</p>
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

      <div className="services-section1">
        <h2 className='h2-welcome'>Services Offered</h2>
        <div className="services-grid1">
          {Object.entries(services).map(([type, serviceList]) => (
            <div className="service-box1" key={type}>
              <h3>{type} Services</h3>
              <ul>
                {serviceList.map((service) => (
                  <li key={service.id}>{`${service.name} - ₱${service.price}`}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div 
        className="about-us-section" 
        style={{ backgroundImage: `url(${aboutUsBg})` }} // Set background image here
      >
        <div className="about-us-content">
          <h2>About Us</h2>
          <p>
            Welcome to Chic Station, where style meets convenience. Our team is dedicated to
            providing high-quality beauty services that cater to your personal needs. We aim to
            ensure every experience leaves you feeling refreshed and beautiful.
          </p>
        </div>
          <div className="branch-image">
    <div className="branch-navigation">
      <button
        onClick={handlePrevBranch}
        className="branch-button left"
        disabled={branches.length <= 1}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <h3>{`Branch ${currentBranch + 1}`}</h3>
      <button
        onClick={handleNextBranch}
        className="branch-button right"
        disabled={branches.length <= 1}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>

    <div className="image-container">
      <a 
        href={branches[currentBranch].locationLink} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <img
          src={branches[currentBranch].image}
          alt={`Chic Station Branch ${currentBranch + 1}`}
        />
      </a>
    </div>  
    <p>{branches[currentBranch].address}</p>
    </div>
    <footer className="social-footer">
      <p>Contact Us</p>
      <div className="social-icons">
        <a href="https://www.facebook.com/chicstationdavao" target="_blank" rel="noopener noreferrer">
          <FaFacebook size={30} />
        </a>
        <a href="https://www.instagram.com/chic.stationdvo/" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={30} />
        </a>
        <a href="https://www.messenger.com/t/111130090723943" target="_blank" rel="noopener noreferrer">
          <FaFacebookMessenger size={30} />
        </a>
        <div className="phone-icon">
          <FaPhone size={25} />
          <span> (+63) 945-443-0380 </span>
        </div>
      </div>
    </footer>
    </div>
    
    </div>
  );
};

export default WelcomePage;