import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './AdminHeader';
import '../styles/AdminPage.css';
import defaultProfileImg from '../images/default-profile.jpg';

const AdminReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [filter, setFilter] = useState('Pending');  // Set default filter to 'Pending'
  const [proofImage, setProofImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmail = localStorage.getItem('userEmail');
    if (!adminEmail || !adminEmail.includes('@chicstation')) {
      navigate('/login');
      return;
    }

    // Fetch profile data
    fetch('https://vynceianoani.helioho.st/getprofileadmin.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setUserData(data.data);
          setImageUrl(data.data.profileImageUrl || defaultProfileImg);
        } else {
          setError('Failed to load user data.');
        }
      })
      .catch(() => setError('Failed to load user data.'));

    // Fetch reservations
    fetch('https://vynceianoani.helioho.st/getReservationsAdmin.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setReservations(data.reservations);
          setFilteredReservations(data.reservations);
        } else {
          setError('Failed to load reservations.');
        }
      })
      .catch(() => setError('Failed to load reservations.'));
  }, [navigate]);

  // Filter reservations based on the selected filter status
  useEffect(() => {
    setFilteredReservations(
      filter === 'All'
        ? reservations
        : reservations.filter(reservation =>
            reservation.services.some(
              service => service.status.toLowerCase() === filter.toLowerCase()
            )
          )
    );
  }, [filter, reservations]);

  const updateStatus = async (reservationId, serviceId, newStatus) => {
    try {
      const response = await fetch('https://vynceianoani.helioho.st/updateReservations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reservationId, status: newStatus, employee_id: userData.id }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Reservation status updated successfully!');
        setError('');
        setReservations(prevReservations =>
          prevReservations.map(reservation =>
            reservation.reservation_id === reservationId
              ? {
                  ...reservation,
                  services: reservation.services.map(service =>
                    service.service_id === serviceId
                      ? { ...service, status: newStatus }
                      : service
                  ),
                }
              : reservation
          )
        );
      } else {
        setError(result.message);
        setSuccess('');
      }
    } catch {
      setError('An error occurred while updating the reservation status.');
      setSuccess('');
    }
  };

  const fetchProofImage = async (reservationId) => {
    try {
      const response = await fetch('https://vynceianoani.helioho.st/getProofImage.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setProofImage(result.proofUrl || null);
      } else {
        setProofImage(null);
      }
      setShowModal(true);
    } catch {
      setProofImage(null);
      setShowModal(true);
    }
  };

  const filterServicesForEmployee = (services) => {
    if (!userData) return services;
    const employeeId = userData.id;
    return services.filter(service => service.employee_id === employeeId);
  };

  return (
    <div>
      <Header />

      {userData && (
        <div className="upper-left-profile">
          <div className="upper-left-profile-img-container">
            <img src={imageUrl} alt="Profile" className="upper-left-profile-img" />
          </div>
          <div className="upper-left-profile-info">
            <span className="upper-left-profile-name">{userData.fullName}</span>
            <span className="upper-left-profile-branch">{userData.branchName}: {userData.address}</span>
          </div>
        </div>
      )}

      <div className="admin-reservation-container">
        <div className="admin-box">
          <h2 className='h22'>Admin: Manage Reservations</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Filter Tabs - Removed 'All' and set 'Pending' as default */}
          <div className="filter-tabs">
            {['Pending', 'Approved', 'Rejected', 'Completed'].map((status) => (
              <button
                key={status}
                className={`filter-tab ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Scrollable Reservations Table */}
          <div className="scrollable-table-container">
            <table className="reservation-table">
              <thead>
                <tr>
                  <th>User Email</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map(reservation => (
                  <tr key={reservation.reservation_id}>
                    <td>{reservation.user_email}</td>
                    <td>
                      {filterServicesForEmployee(reservation.services).map((service, index) => (
                        <div key={index}>
                          {service.name}
                        </div>
                      ))}
                    </td>
                    <td>{reservation.date}</td>
                    <td>{reservation.time}</td>
                    <td>₱{reservation.price}</td>
                    <td>
                      {filterServicesForEmployee(reservation.services).map((service, index) => (
                        <div key={index}>
                          {service.status !== 'approved' && service.status !== 'rejected' && service.status !== 'completed' ? (
                            <>
                              <button
                                className="b1"
                                onClick={() => updateStatus(reservation.reservation_id, service.service_id, 'approved')}
                              >
                                Approve
                              </button>
                              <button
                                className="b1"
                                onClick={() => updateStatus(reservation.reservation_id, service.service_id, 'rejected')}
                              >
                                Reject
                              </button>
                            </>
                          ) : service.status === 'completed' ? (
                            <button onClick={() => fetchProofImage(reservation.reservation_id)}>Show Proof</button>
                          ) : (
                            <span className={`status ${service.status.toLowerCase()}`}>{service.status}</span>
                          )}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowModal(false)}>&times;</button>
            {proofImage ? (
              <img src={proofImage} alt="Proof" className="proof-image" />
            ) : (
              <p>No proof image found for this reservation.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservationPage;
