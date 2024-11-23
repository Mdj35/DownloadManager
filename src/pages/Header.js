// Import the Font Awesome icon components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'; // Logout icon
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutConfirmation from '../pages/LogoutConfirmation';
import '../styles/Header.css';

const Header = () => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutConfirmation(true);
  };

  const handleClose = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <header className="header1">
      <div className="logo-container1">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSlpxpNoZdeY_qOKahqCVqVtfTxlwNZN6x6w&s" 
          alt="Logo" 
          className="logo1" 
        />
      </div>
      <nav>
        <ul className="nav-list1">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/userpage">Book</Link></li>
          <li><Link to="/reservations">Reservations</Link></li>
          <li><Link to="/billing">Fees</Link></li>
          <li><Link to="/profilepage">Profile</Link></li>
          <li>
            <a href="/" onClick={handleLogoutClick} className="logout-icon">
              <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
            </a>
          </li>
        </ul>
      </nav>
      <LogoutConfirmation show={showLogoutConfirmation} onClose={handleClose} />
    </header>
  );
};

export default Header;