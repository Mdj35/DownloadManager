import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CreateAccountPage.css';

const CreateAccountPage = ({ onCloseModal }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate password
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    // Validate terms acceptance
    if (!termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }
  
    // Validate contact number
    const contactNumberPattern = /^(?:\+639|09)[0-9]{9,10}$/;
    if (!contactNumberPattern.test(contactNumber)) {
      setError('Contact number must start with +639 or 09 and be followed by 9-10 digits.');
      return;
    }
  
    // Send data to the API
    try {
      const response = await fetch('https://vynceianoani.helioho.st/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, contactNumber }),
      });
  
      const data = await response.json();
      if (data.status === 'success') {
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          setSuccessMessage('');
          if (onCloseModal) onCloseModal(); // Call the function to close the modal
        }, 1000); // Show success message for 2 seconds before closing modal
      } else {
        setError(data.message || 'An error occurred while creating the account.');
      }
    } catch (error) {
      setError('An error occurred while creating the account.');
    }
  };
  
  return (
    <div className="create-account-container1">
      <div className="create-account-box1">
        <h2>Create Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group1">
            <label htmlFor="full-name">Full Name</label>
            <input
              type="text"
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group1">
            <label htmlFor="contact-number">Contact Number</label>
            <input
              type="tel"
              id="contact-number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              maxLength="14" // Limiting input to 14 characters (including +639)
              pattern="(\+639|09)[0-9]{9,10}" // Matches +639 followed by 9-10 digits or 09 followed by 9 digits
              title="Contact number must start with +639 or 09 and be followed by 9-10 digits."
            />
          </div>
          <div className="form-group1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8" // Minimum length of 8 characters
              maxLength="16" // Maximum length of 16 characters
            />
          </div>
          <div className="form-group1">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8" // Minimum length of 8 characters
              maxLength="16" // Maximum length of 16 characters
            />
          </div>
          <div className="terms-conditions">
            <input
              type="checkbox"
              id="terms-conditions"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms-conditions">
              I accept the <Link to="/terms">terms and conditions</Link>.
            </label>
          </div>
          <button type="submit" className="create-account-button">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;
