/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateShippingStatus } from '../../api/adminApi';
import { FaTimes } from 'react-icons/fa';
import './ShippingUpdateModal.css';

// --- UPDATED: "Out for delivery" removed ---
const STATUS_OPTIONS = [
  'Processing',
  'Packaging',
  'Shipped',
  'In Transit',
  // 'Out for delivery', // Removed as per your request
  'Delivered',
  'On Hold',
  'Cancelled',
];

const ShippingUpdateModal = ({ order, onClose, onUpdateSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    setError(null);
    try {
      const notes = {
        'Shipped': 'Your order is on the way.',
        'Delivered': 'Your order has been delivered. Thank you!',
        'Cancelled': 'Your order has been cancelled.'
      };
      
      const statusUpdate = { 
        status: newStatus, 
        notes: notes[newStatus] || `Status updated to ${newStatus}.` 
      };
      
      await updateShippingStatus(order._id, statusUpdate);
      alert('Shipping Status Updated!');
      onUpdateSuccess(); 
      onClose(); 
      
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="modal-title">
          {t('admin_page.modal_title')} (ID: #{order.orderId})
        </h3>
        
        <div className="status-buttons-grid">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              className={`status-btn ${status.toLowerCase().replace(' ', '')}`}
              onClick={() => handleStatusUpdate(status)}
              disabled={loading || order.orderStatus === status}
            >
              {/* Fallback to 'status' if translation key is missing */}
              {t(`dashboard_page.status_${status.toLowerCase().replace(' ', '')}`, status)}
            </button>
          ))}
        </div>

        {error && <p className="modal-error">{error}</p>}
      </div>
    </div>
  );
};

export default ShippingUpdateModal;