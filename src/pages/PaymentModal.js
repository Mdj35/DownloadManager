// PaymentModal.js
import React from 'react';
import '../styles/Modal.css'

const PaymentModal = ({ isOpen, onClose, onPayNow, onPayLater }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Choose Payment Option</h3>
        <button onClick={onPayNow}>Pay Now</button>
        <button onClick={onPayLater}>Pay Later</button>
      </div>
    </div>
  );
};

export default PaymentModal;
