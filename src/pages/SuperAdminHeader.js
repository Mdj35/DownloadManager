// Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutConfirmation from './LogoutConfirmation';
import '../styles/SuperAdminHeader.css'; // Import the new CSS

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
    <aside className="superadmin-sidebar">
      <div className="logo-container">
        {/* Admin Dashboard Title */}
        <h1 className="dashboard-title">Admin Dashboard</h1>

        {/* Logo */}
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSlpxpNoZdeY_qOKahqCVqVtfTxlwNZN6x6w&s"
          alt="Logo"
          className="logo"
        />
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="nav-list">
          <li><Link to="/adminsales">Sales Report</Link></li>
          <li><Link to="/manage-service">Manage Service</Link></li>
          <li><Link to="/manage-user-employee">Employee/User Management</Link></li>
          <li><Link to="/create-admin">Create Employee</Link></li>
        </ul>
      </nav>

      {/* Logout Confirmation */}
      <LogoutConfirmation show={showLogoutConfirmation} onClose={handleClose} />
    </aside>
  );
};

export default Header;