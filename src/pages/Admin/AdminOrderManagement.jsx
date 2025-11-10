/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllOrders, verifyOrderPayment } from '../../api/adminApi'; 
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { format } from 'date-fns';
import './AdminOrderManagement.css'; 
// 1. Import the new Modal
import ShippingUpdateModal from '../../components/Admin/ShippingUpdateModal'; 

// ... (getStatusClass function remains the same) ...
const getStatusClass = (status) => {
  if (!status) return 'status-pending';
  switch (status.toLowerCase()) {
    case 'pending': return 'status-pending';
    case 'processing': return 'status-processing';
    case 'verified': return 'status-verified';
    case 'packaging': return 'status-packaging';
    case 'shipped': return 'status-shipped';
    case 'delivered': return 'status-delivered';
    case 'cancelled': return 'status-cancelled';
    default: return 'status-pending';
  }
};

const AdminOrderManagement = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. State to control the modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      // Don't set loading to true on every refresh, only on initial
      if (!orders.length) setLoading(true); 
      const response = await getAllOrders(); 
      const orderList = response.data || response || []; 
      setOrders(orderList); 
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please check API connection and Admin Secret Key.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Run only on mount

  const handleVerify = async (orderId, orderIdentifier) => {
    if (window.confirm(`Are you sure you want to verify payment for Order ID ${orderIdentifier}?`)) {
      try {
        await verifyOrderPayment(orderId);
        alert('Payment Verified Successfully!');
        fetchOrders(); // 3. Refresh the order list
      } catch (err) {
        alert(`Verification Failed: ${err.message}`);
      }
    }
  };

  // 4. Handle Shipping Update (Now just opens the modal)
  const handleOpenShippingModal = (order) => {
    setSelectedOrder(order);
  };
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };
  const handleUpdateSuccess = () => {
    fetchOrders(); // Refresh list after successful update
  };


  if (loading) {
    return <LoadingSpinner size="large" />;
  }
  
  return (
    <div className="admin-order-management-container">
      <h1 className="admin-page-title">{t('admin_page.nav_orders')}</h1>
      
      {error && <p className="admin-error-message">{error}</p>}
      
      {orders.length === 0 ? (
        <p>No orders found in the database.</p>
      ) : (
        <div className="orders-table-wrapper">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>{t('admin_page.order_id')}</th>
                <th>{t('admin_page.customer')}</th>
                <th>{t('admin_page.amount')}</th>
                <th>Payment Method</th>
                <th>{t('admin_page.status')}</th>
                <th>{t('admin_page.action')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td data-label={t('admin_page.order_id')}>#{order.orderId}</td>
                  <td data-label={t('admin_page.customer')}>{order.user?.username || order.shippingAddress?.fullName || 'N/A'}</td> 
                  <td data-label={t('admin_page.amount')}>৳ {order.totalAmount}</td>
                  <td data-label="Payment Method">{order.paymentDetails?.paymentMethod}</td>
                  <td data-label={t('admin_page.status')}>
                    <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td data-label={t('admin_page.action')} className="action-cell">
                    {order.orderStatus === 'Pending' && (
                      <button 
                        className="action-btn verify-btn" 
                        onClick={() => handleVerify(order._id, order.orderId)}
                      >
                        Verify
                      </button>
                    )}
                    {/* 5. Update Shipping button now opens the modal */}
                    {(order.orderStatus !== 'Pending' && order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled') && (
                      <button 
                        className="action-btn shipping-btn" 
                        onClick={() => handleOpenShippingModal(order)}
                      >
                        Update Shipping
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. Render the Modal if an order is selected */}
      {selectedOrder && (
        <ShippingUpdateModal 
          order={selectedOrder}
          onClose={handleCloseModal}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default AdminOrderManagement;