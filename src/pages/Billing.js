import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.js';
import '../styles/Billing.css';

const BillingList = () => {
  const [billings, setBillings] = useState([]);
  const [filteredBillings, setFilteredBillings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Paid');  // Default tab is 'Paid'
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/login');
      return;
    }

    setLoading(true);

    fetch('https://vynceianoani.helioho.st/fetchBillings.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 'success') {
          setBillings(data.billings);
          setFilteredBillings(data.billings.filter(billing => billing.status === 'paid')); // Initially show only paid billings
        } else {
          setError(data.message || 'Failed to fetch billings.');
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('An error occurred while fetching billings.');
      });
  }, [navigate]);

  // Handle tab change for paid/unpaid filter
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Paid') {
      setFilteredBillings(billings.filter(billing => billing.status === 'paid'));
    } else if (tab === 'Unpaid') {
      setFilteredBillings(billings.filter(billing => billing.status === 'pending'));
    }
  };

  const handlePayNow = (billing) => {
    navigate('/finalize-billing', { state: { billing } });
  };

  const handleCancelBilling = (billingId) => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    setLoading(true);
    fetch('https://vynceianoani.helioho.st/cancelBilling.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ billingId, email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 'success') {
          // Update the billing status locally after canceling
          setBillings((prevBillings) =>
            prevBillings.map((billing) =>
              billing.billing_id === billingId ? { ...billing, status: 'cancelled' } : billing
            )
          );
          setFilteredBillings((prevFilteredBillings) =>
            prevFilteredBillings.map((billing) =>
              billing.billing_id === billingId ? { ...billing, status: 'cancelled' } : billing
            )
          );
        } else {
          setError(data.message || 'Failed to cancel billing.');
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('An error occurred while canceling the billing.');
      });
  };

  return (
    <div>
      <Header />
      <div className="billing-list-container">
        <h2>Your Billings</h2>

        {/* Tabs for filtering billings */}
        <div className="reservation-tabs">
          {['Paid', 'Unpaid'].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && <p>Loading...</p>}
        {error && <div className="error-message">{error}</div>}

        <div className="billing-grid">
          {filteredBillings.length > 0 ? (
            filteredBillings.map((billing) => (
              <div key={billing.billing_id} className="billing-item">
                <div>
                  <p><strong>Billing ID:</strong> {billing.billing_id}</p>
                  <p><strong>Total Price:</strong> ${billing.total_price}</p>
                  <p><strong>Status:</strong> {billing.status}</p>
                  <p><strong>Date:</strong> {billing.billing_date}</p>
                  <p><strong>Time:</strong> {billing.billing_time}</p>
                </div>
                {billing.status === 'pending' && (
                  <div>
                    <button
                      className="pay-now-button"
                      onClick={() => handlePayNow(billing)}
                    >
                      Pay Now
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => handleCancelBilling(billing.billing_id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No billings found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingList;
