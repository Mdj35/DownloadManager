import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/FinalReservation.css';
import jsPDF from 'jspdf';

const loadPayPalScript = (callback) => {
  const script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=ASKmv9SI7KJMNK3yafnnS5xEG-BgdxBaTHuUmU9UXtSJ5VjoyaICL9Nqre4vewdy-q5uf5Lin_lC27Yl';
  script.onload = () => callback();
  document.body.appendChild(script);
};

const FinalizeReservationPage = () => {
  const [reservationDetails, setReservationDetails] = useState({});
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [queuePosition, setQueuePosition] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const details = location.state;
    if (details) {
      setReservationDetails(details);
    } else {
      navigate('/userpage');
    }

    loadPayPalScript(() => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: reservationDetails.price ? reservationDetails.price.toFixed(2) : '0.00',
              },
            }],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(() => {
            setIsPaid(true);
            createReservation(reservationDetails);
          });
        },
        onError: () => {
          setError('Payment failed. Please try again.');
          setPending(false);
        }
      }).render('#paypal-button-container'); 
    });
  }, [location, navigate, reservationDetails.price]);

  const createReservation = (details) => {
    if (reservationId) return; 
    
    setPending(true);
  
    getQueuePosition(details.services)
      .then((positions) => {
        const reservationData = {
          ...details,
          status: 'pending',
          queuePositions: positions, // Include queue positions
        };
  
        fetch('https://vynceianoani.helioho.st/billing.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData),
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success' && data.billing_id) {
              setReservationId(data.billing_id);
              setQueuePosition(positions); // Save queue positions for display
              setPending(false);
            } else {
              setPending(false);
              setError(data.message || 'Failed to create reservation.');
            }
          })
          .catch(() => {
            setPending(false);
            setError('Failed to create reservation.');
          });
      })
      .catch(() => {
        setPending(false);
        setError('Failed to fetch queue positions.');
      });
  };
  
  const getQueuePosition = async (services) => {
    const queueRequests = services.map(service =>
      fetch('https://vynceianoani.helioho.st/queue.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceName: service }),
      })
        .then(response => response.json())
        .then(data => ({ service, position: data.queue_position || 'N/A' }))
    );
  
    try {
      const positions = await Promise.all(queueRequests);
      return positions; // Return the positions to be used in createReservation
    } catch {
      throw new Error('Failed to fetch queue positions.');
    }
  };
  

  const savePaymentToDatabase = () => {
    const paymentData = {
      email: reservationDetails.email,
      billing_id: reservationId,
      date_of_payment: new Date().toISOString(),
      type_of_payment: 'PayPal',
      payment_confirmation: 'success'
    };

    fetch('https://vynceianoani.helioho.st/payment2.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setShowModal(true); 
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

  const closeModal = () => {
    setShowModal(false);
    navigate('/userpage'); 
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();
    const accentColor = '#000';
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Set light background color for the entire receipt
    doc.setFillColor(250, 235, 215); // Soft beige background close to #f6d08c
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'F');
  
    // Header Section with Logo
    doc.setFontSize(20);
    doc.setTextColor(accentColor);
    doc.setFont('helvetica', 'bold');
    doc.text("Chic Station", pageWidth / 2, 25, { align: 'center' }); // Centered title
    doc.setFontSize(12);
    doc.setTextColor('#000');
    doc.text("Reservation Receipt", pageWidth / 2, 35, { align: 'center' });
  
    // Draw Line Under Header
    doc.setDrawColor(accentColor);
    doc.setLineWidth(0.5);
    doc.line(10, 40, pageWidth - 10, 40); // Horizontal line separator
  
    // Reservation Information Section
    doc.setFontSize(14);
    doc.setTextColor(accentColor);
    doc.text("Reservation Information", 15, 50);
    doc.setDrawColor(accentColor);
    doc.setLineWidth(0.2);
    doc.line(15, 52, pageWidth - 15, 52); // Underline for section title
  
    doc.setFontSize(12);
    doc.setTextColor('#000');
    doc.text(`Reservation ID: ${reservationId}`, 15, 60);
    doc.text(`Email: ${reservationDetails.email}`, 15, 70);
    doc.text(`Branch: ${reservationDetails.branch}`, 15, 80);
    doc.text(`Reservation Date: ${reservationDetails.date}`, 15, 90);
    doc.text(`Reservation Time: ${reservationDetails.time}`, 15, 100);
    doc.text(`Total Price: $${reservationDetails.price ? reservationDetails.price.toFixed(2) : 'N/A'}`, 15, 110);
  
    // Box around Reservation Information
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.rect(12, 45, pageWidth - 24, 70);
  
    // Services Reserved Section
    doc.setFontSize(14);
    doc.setTextColor(accentColor);
    doc.text("Services Reserved", 15, 130);
    doc.line(15, 132, pageWidth - 15, 132); // Underline for section title
  
    reservationDetails.services.forEach((service, index) => {
      const employee = reservationDetails.employees && reservationDetails.employees[service] 
                       ? reservationDetails.employees[service][0] : 'N/A';
      doc.setFontSize(12);
      doc.setTextColor('#000');
      doc.text(`${index + 1}. ${service} - Assigned to: ${employee}`, 15, 140 + index * 10);
    });
  
    // Box around Services Reserved
    doc.setDrawColor(200, 200, 200);
    doc.rect(12, 125, pageWidth - 24, 10 + reservationDetails.services.length * 10);
  
    // Queue Positions Section
    doc.setFontSize(14);
    doc.setTextColor(accentColor);
    const queueStartY = 150 + reservationDetails.services.length * 10;
    doc.text("Queue Positions", 15, queueStartY);
    doc.line(15, queueStartY + 2, pageWidth - 15, queueStartY + 2);
  
    queuePosition.forEach((q, index) => {
      doc.setFontSize(12);
      doc.setTextColor('#000');
      doc.text(`${q.service}: Queue Position ${q.position}`, 15, queueStartY + 10 + index * 10);
    });
  
    // Box around Queue Positions
    doc.setDrawColor(200, 200, 200);
    doc.rect(12, queueStartY - 5, pageWidth - 24, 20 + queuePosition.length * 5);
  
   // Footer Section
doc.setFontSize(10);
doc.setTextColor('#555'); // Gray color for the footer
const footerY = pageHeight - 30; // Adjust to fit within the page

// Background for footer
doc.setFillColor(250, 235, 215); // Soft beige background close to #f6d08c
doc.rect(10, footerY, pageWidth - 20, 30, 'F'); // Create a filled rectangle for the footer

  // Footer text centered within the footer area
  doc.text(
    "Thank you for your reservation. Please keep this receipt for your records.",
    pageWidth / 2, footerY + 5, { align: 'center' }
  );
  doc.text(
    "Branch 1: Chippens Dormitory, 368 Padre Gomez St., Poblacion District, Davao City",
    pageWidth / 2, footerY + 10, { align: 'center' }
  );

  doc.text(
    "Branch 2: Rizal Extension, Corner De Jesus St, Davao City",
    pageWidth / 2, footerY + 15, { align: 'center' }
  );

  doc.text(
    "Phone: (+63) 945-443-0380 | Facebook: https://www.facebook.com/chicstationdavao",
    pageWidth / 2, footerY + 20, { align: 'center' }
  );
  
    // Save the PDF
    doc.save("ReservationReceipt.pdf");
  };
  
  return (
    <div>
      <Header />
      <div className="finalize-reservation-container">
        <div className="reservation-summary-box">
          <h2>Finalize Your Reservation</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="reservation-details">
            <p><strong>Email:</strong> {reservationDetails.email}</p>
            <p><strong>Branch:</strong> {reservationDetails.branch}</p>
            <p><strong>Date:</strong> {reservationDetails.date}</p>
            <p><strong>Time:</strong> {reservationDetails.time}</p>
            <p><strong>Total Price:</strong> ${reservationDetails.price ? reservationDetails.price.toFixed(2) : 'N/A'}</p>

            {reservationDetails.services && reservationDetails.services.map((service, index) => (
              <div key={index}>
                <p><strong>Service {index + 1}:</strong> {service}</p>
                <p>
                  <strong>Employee:</strong> 
                  {reservationDetails.employees && reservationDetails.employees[service] 
                    ? reservationDetails.employees[service][0]
                    : 'N/A'}
                </p>
              </div>
            ))}
          </div>

          <div id="paypal-button-container"></div>

          <div className="sample-button">
            <button onClick={savePaymentToDatabase} disabled={pending || !isPaid}>
              {pending ? 'Processing...' : isPaid ? 'Confirm Reservation' : 'Complete Payment First'}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reservation Confirmed!</h3>
            <p>Your reservation has been successfully completed. Please download your receipt for reference.</p>
            <ul>
              {queuePosition.map((qp, index) => (
                <li key={index}>{qp.service}: Queue Position {qp.position}</li>
              ))}
            </ul>
            <button onClick={downloadReceipt}>Download Receipt (PDF)</button>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalizeReservationPage;
