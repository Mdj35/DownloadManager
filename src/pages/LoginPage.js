import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
  
    try {
      const response = await fetch('https://vynceianoani.helioho.st/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
      console.log(result); 
  
      if (result.status === 'success') {
        localStorage.setItem('userEmail', email);
        if (result.isAdmin) {
          navigate('/admin-today-reservations');
        } else {
          navigate('/home'); 
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSlpxpNoZdeY_qOKahqCVqVtfTxlwNZN6x6w&s"
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
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="additional-links">
          <Link to="/create-account" className="create-account-button2">
            Create Account
          </Link>
          <Link to="/" className="back-button">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
