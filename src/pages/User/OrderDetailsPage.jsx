/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSingleOrder } from '../../api/userApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { format } from 'date-fns';
import './OrderDetailsPage.css';

const OrderDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams(); // Get the order's MongoDB _id
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // This call expects the backend to populate product details
        const data = await getSingleOrder(id); 
        
        // Handle {data: ...} or just ...
        const fetchedOrder = data.data || data; 
        
        console.log("Fetched Order Details:", fetchedOrder); // Debug Log
        setOrder(fetchedOrder);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (!order) {
    return <p className="order-error-message">Order not found.</p>;
  }

  // --- 🔴 THIS IS THE FIX 🔴 ---
  // The key from the backend is 'items', not 'orderItems'
  const { shippingAddress, items, paymentDetails, totalAmount, orderStatus, orderId } = order;
  // --- End of Fix ---

  // Ensure items is an array for safe mapping (it's no longer needed, but good practice)
  const orderItems = items || []; 

  return (
    <div className="order-details-container">
      <h2 className="dashboard-content-title">
        {t('dashboard_page.order_details_title')} (ID: #{orderId})
      </h2>
      
      <div className="order-details-grid">
        {/* Left Column: Items & Timeline */}
        <div className="order-details-main">
          {/* Items List */}
          <div className="order-details-box">
            <h4>{t('dashboard_page.items_in_order')}</h4>
            <div className="order-items-list-details">
              {/* FIX: Map over 'orderItems' (which is now correctly assigned from 'items') */}
              {orderItems.map((item) => {
                // Safely get product data (backend populated this)
                const productData = item.product; 
                
                // CRITICAL CHECK: If productData is not an object
                if (!productData || typeof productData !== 'object' || !productData.title_en) {
                    return (
                        <div key={item._id || item.product} className="order-item-detail">
                            <img src='https://placehold.co/60x60?text=Error' alt='Product data error' />
                            <div className="item-info">
                                <span style={{color: '#d9534f'}}>Product Data Error (ID: {item.product})</span>
                                <span>Qty: {item.quantity}</span>
                            </div>
                            <span className="item-price">৳ {item.price * item.quantity}</span>
                        </div>
                    );
                }
                
                const name = i18n.language === 'bn' ? (productData.title_bn || productData.title_en) : productData.title_en;
                const imageUrl = (productData.images && productData.images.length > 0) ? productData.images[0] : 'https://placehold.co/60x60?text=No+Image';

                return (
                  <div className="order-item-detail" key={productData._id || item.product}>
                    <img 
                      src={imageUrl} 
                      alt={name} 
                    />
                    <div className="item-info">
                      <Link to={`/product/${productData.slug}`}>
                        {name}
                      </Link>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">৳ {item.price * item.quantity}</span>
                  </div>
                );
              })}
              {orderItems.length === 0 && <p>No items found for this order.</p>}
            </div>
          </div>
          
          {/* Timeline */}
          <div className="order-details-box">
            <h4>{t('dashboard_page.status_timeline')}</h4>
            {/* Status Timeline */}
            <div className="status-timeline">
                <p>Order Placed: {format(new Date(order.createdAt), 'dd MMM, yyyy - hh:mm a')}</p>
                <p>Current Status: <strong>{orderStatus}</strong></p>
                
                {/* Display all shipping updates */}
                <ul className="shipping-updates-list">
                  {order.shippingUpdates?.map((update, index) => (
                     <li key={index}>
                       <strong>{update.status}</strong>
                       <span className="update-date">{format(new Date(update.date), 'dd MMM, hh:mm a')}</span>
                       {update.notes && <span className="update-notes">({update.notes})</span>}
                     </li>
                  ))}
                </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Shipping & Summary */}
        <div className="order-details-side">
          {/* Shipping Info */}
          <div className="order-details-box">
            <h4>{t('dashboard_page.shipping_to')}</h4>
            <address>
              <strong>{shippingAddress?.fullName}</strong><br />
              {shippingAddress?.address}<br />
              {shippingAddress?.city}<br />
              Phone: {shippingAddress?.phone}
            </address>
          </div>
          
          {/* Order Summary */}
          <div className="order-details-box">
            <h4>{t('dashboard_page.summary_title')}</h4>
            <div className="summary-row">
              <span>{t('cart_page.subtotal')}</span>
              {/* FIX: Calculate subtotal from totalAmount and shippingCost */}
              <span>৳ {totalAmount - (order.shippingCost || 0)}</span>
            </div>
            <div className="summary-row">
              <span>{t('cart_page.shipping_fee')}</span>
              {/* FIX: Read shippingCost from root (if we add it) or calculate it */}
              <span>৳ {order.shippingCost || 0}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>{t('cart_page.grand_total')}</span>
              <span className="summary-value total-value">৳ {totalAmount}</span>
            </div>
            <div className="summary-divider"></div>
            <p><strong>Payment Method:</strong> {paymentDetails?.paymentMethod}</p>
            {paymentDetails?.transactionId && paymentDetails?.transactionId !== 'N/A (COD)' && (
                <p><strong>Txn ID:</strong> {paymentDetails.transactionId}</p>
            )}
            <p><strong>Sender Phone:</strong> {paymentDetails?.senderNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;