import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Reservations.css';
import Header from './Header';

const UserReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [email, setEmail] = useState(null);
  const [activeTab, setActiveTab] = useState('Approved'); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilteredReservations(
      reservations.filter(
        reservation => reservation.status && reservation.status.toLowerCase() === tab.toLowerCase()
      )
    );
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/login');
      return;
    }
    setEmail(userEmail);

    fetch('https://vynceianoani.helioho.st/reservations.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Fetched data:", data);
        const sortedReservations = data.reservations.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setReservations(sortedReservations);
        setFilteredReservations(
          sortedReservations.filter(reservation => reservation.status === 'approved')
        ); 
      })
      .catch(error => {
        console.error('Error fetching reservations:', error);
        setError('An error occurred while fetching reservations.');
      });
  }, [navigate]);

  return (
    <div>
      <div className="sticky-header">
        <Header />
      </div>
      <div className="user-reservations-container">
        <div className="reservations-box">

          {/* Tabs for filtering reservations */}
          <div className="reservation-tabs">
  {['Approved', 'Pending', 'Completed'].map((tab) => (
    <button
      key={tab}
      className={`tab-button ${activeTab === tab ? 'active' : ''}`}
      onClick={() => handleTabChange(tab)}
    >
      {tab}
    </button>
  ))}
</div>


          <h2>Your Reservations</h2>
          {error && <div className="error-message">{error}</div>}

          {filteredReservations.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            <div className="reservations-grid">
              {filteredReservations.map((reservation, index) => (
                <div key={index} className="reservation-card">
                  <h3>Reservation #{index + 1}</h3>
                  <p><strong>Branch:</strong> {reservation.branch_name} ({reservation.branch_address})</p>
                  <p><strong>Date:</strong> {reservation.date}</p>
                  <p><strong>Time:</strong> {reservation.time}</p>
                  <p><strong>Status:</strong> {reservation.status}</p>
                  <p><strong>Total Price:</strong> {reservation.price ? reservation.price.toFixed(2) : 'N/A'}</p>

                  {/* Display services and their respective employees */}
                  {reservation.services && reservation.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="service-details">
                      <p><strong>Service:</strong> {service.name}</p>
                      <p><strong>Employee:</strong> {service.employees.map(emp => emp.name).join(', ')}</p>
                      {/* Conditionally render Queue Position based on status */}
                      {reservation.status !== 'completed' && (
                        <p><strong>Queue Position:</strong> {service.queue_position}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReservationsPage;
