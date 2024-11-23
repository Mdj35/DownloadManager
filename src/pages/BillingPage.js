import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';


const BillingPage = () => {
  const [billingDetails, setBillingDetails] = useState({});
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve billing details from location state
    const details = location.state;
    if (details) {
      setBillingDetails(details);
    } else {
      navigate('/userpage'); // Redirect if no billing details found
    }
  }, [location, navigate]);

  const handleBillingProcess = () => {
    setPending(true);
    // Implement the billing logic here

    // Simulate success and navigate back to user page
    setTimeout(() => {
      setPending(false);
      navigate('/userpage'); // Navigate to a success page
    }, 2000);
  };

  return (
    <div className="billing-page-container">
      <Header />
      <div className="billing-summary-box">
        <h2>Billing Information</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="billing-details">
          <p><strong>Email:</strong> {billingDetails.email}</p>
          <p><strong>Service:</strong> {billingDetails.service}</p>
          <p><strong>Branch:</strong> {billingDetails.branch}</p>
          <p><strong>Date:</strong> {billingDetails.date}</p>
          <p><strong>Time:</strong> {billingDetails.time}</p>
          <p><strong>Employee:</strong> {billingDetails.employee}</p>
          <p><strong>Price:</strong> {billingDetails.price}</p>
        </div>
        <div className="billing-button">
          <button onClick={handleBillingProcess} disabled={pending}>
            {pending ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
