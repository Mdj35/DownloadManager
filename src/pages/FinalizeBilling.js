import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import jsPDF from 'jspdf';
import '../styles/FinalReservation.css'; // You can reuse the same styles

const loadPayPalScript = (callback) => {
  const script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=ASKmv9SI7KJMNK3yafnnS5xEG-BgdxBaTHuUmU9UXtSJ5VjoyaICL9Nqre4vewdy-q5uf5Lin_lC27Yl';
  script.onload = () => callback();
  document.body.appendChild(script);
};

const FinalizeBillingPage = () => {
  const [billingDetails, setBillingDetails] = useState({});
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [queuePositions, setQueuePositions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const billing = location.state?.billing;
    if (billing) {
      setBillingDetails({ ...billing, email });
    } else {
      navigate('/userpage');
    }

    loadPayPalScript(() => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          const totalPrice = billingDetails.total_price ? parseFloat(billingDetails.total_price).toFixed(2) : '0.00';
          return actions.order.create({
            purchase_units: [{ amount: { value: totalPrice } }],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(() => {
            setIsPaid(true);
            savePaymentToDatabase();
          });
        },
        onError: () => {
          setError('Payment failed. Please try again.');
          setPending(false);
        }
      }).render('#paypal-button-container');
    });
  }, [location, navigate, billingDetails.total_price]);

  const savePaymentToDatabase = () => {
    const paymentData = {
      email: billingDetails.email,
      billing_id: billingDetails.billing_id,
      date_of_payment: new Date().toISOString(),
      type_of_payment: 'PayPal',
      payment_confirmation: 'success',
    };

    fetch('https://vynceianoani.helioho.st/payment2.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          retrieveReservationAndQueue();
        } else {
          setError('Failed to save payment information.');
          setPending(false);
        }
      })
      .catch(() => {
        setError('Failed to save payment information.');
        setPending(false);
      });
  };

  const retrieveReservationAndQueue = () => {
    const { billing_id } = billingDetails;

    fetch(`https://vynceianoani.helioho.st/getReservationId.php?billing_id=${billing_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success' && data.reservation_id) {
          fetchServices(data.reservation_id);
        } else {
          setError('Failed to retrieve reservation ID.');
        }
      })
      .catch(() => setError('Failed to retrieve reservation ID.'));
  };

  const fetchServices = (reservation_id) => {
    fetch(`https://vynceianoani.helioho.st/getReservationServices.php?reservation_id=${reservation_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success' && data.services) {
          const services = data.services;
          queueServices(services);
        } else {
          setError('Failed to retrieve services.');
        }
      })
      .catch(() => setError('Failed to retrieve services.'));
  };

  const queueServices = (services) => {
    const queueRequests = services.map((service) =>
      fetch('https://vynceianoani.helioho.st/queue.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceName: service.name }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            return { service: service.name, position: data.queue_position };
          } else {
            return { service: service.name, position: 'Error' };
          }
        })
        .catch(() => ({ service: service.name, position: 'Error' }))
    );

    Promise.all(queueRequests).then((positions) => {
      setQueuePositions(positions);
      setIsModalOpen(true); 
    });
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();
    const totalPrice = billingDetails.total_price && !isNaN(billingDetails.total_price)
      ? parseFloat(billingDetails.total_price).toFixed(2)
      : 'N/A';
  
    doc.setFontSize(12);
    doc.text("Billing Receipt", 10, 10);
    doc.text(`Billing ID: ${billingDetails.billing_id}`, 10, 20);
    doc.text(`Email: ${billingDetails.email}`, 10, 30);
    doc.text(`Date: ${billingDetails.billing_date}`, 10, 40);
    doc.text(`Time: ${billingDetails.billing_time}`, 10, 50);
    doc.text(`Total Price: $${totalPrice}`, 10, 60);
  
    doc.text("Queue Positions:", 10, 80);
    queuePositions.forEach((qp, index) => {
      doc.text(`${index + 1}. ${qp.service} - Position: ${qp.position}`, 10, 90 + index * 10);
    });
  
    doc.save("BillingReceipt.pdf");
  };

  return (
    <div>
      <Header />
      <div className="finalize-reservation-container">
        <div className="reservation-summary-box">
          <h2>Finalize Your Billing</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="reservation-details">
            <p><strong>Billing ID:</strong> {billingDetails.billing_id}</p>
            <p><strong>Email:</strong> {billingDetails.email}</p>
            <p><strong>Date:</strong> {billingDetails.billing_date}</p>
            <p><strong>Time:</strong> {billingDetails.billing_time}</p>
            <p><strong>Total Price:</strong> 
              ${billingDetails.total_price && !isNaN(billingDetails.total_price) 
                  ? parseFloat(billingDetails.total_price).toFixed(2) 
                  : 'N/A'}
            </p>
          </div>

          <div id="paypal-button-container"></div>

          <div className="sample-button">
            <button onClick={savePaymentToDatabase} disabled={pending || !isPaid}>
              {pending ? 'Processing...' : isPaid ? 'Confirm Payment' : 'Complete Payment First'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for displaying queue positions */}
      {/* Modal for displaying queue positions */}
{isModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Queue Positions</h3>
      <ul>
        {queuePositions.map((qp, index) => (
          <li key={index}>{qp.service}: Position {qp.position}</li>
        ))}
      </ul>
      <button onClick={downloadReceipt}>Download Receipt (PDF)</button>
      <button onClick={() => navigate('/userpage')}>Close</button>
    </div>
  </div>
)}

    </div>
  );
};

export default FinalizeBillingPage;
