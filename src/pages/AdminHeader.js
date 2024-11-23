// Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutConfirmation from '../pages/LogoutConfirmation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'; // Import logout icon
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
          <li><Link to="/admin-today-reservations">Home</Link></li>
          <li><Link to="/adminpage">Reservations</Link></li>
          <li><Link to="/adminprofile">Profile</Link></li>
          <li>
            <a href="/" onClick={handleLogoutClick}>
              <FontAwesomeIcon icon={faRightFromBracket} size="lg" /> {/* Logout Icon */}
            </a>
          </li>
        </ul>
      </nav>
      <LogoutConfirmation show={showLogoutConfirmation} onClose={handleClose} />
    </header>
  );
};

export default Header;