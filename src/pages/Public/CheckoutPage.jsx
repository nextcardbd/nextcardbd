/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import { getPaymentInfo } from '../../api/publicApi';
import { placeOrder } from '../../api/userApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { cartItems, cartSubtotal, shippingCost, grandTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    txnId: '',
    senderNumber: '', // Required by backend
  });
  
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loadingPaymentInfo, setLoadingPaymentInfo] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bkash'); 
  const isTxnIdRequired = selectedPaymentMethod !== 'cod';
  const isSenderNumberRequired = selectedPaymentMethod !== 'cod'; 

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.username || '',
      }));
    }
  }, [user]);
  
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoadingPaymentInfo(true);
        const data = await getPaymentInfo();
        setPaymentInfo(data.data || data); 
      } catch (error) {
        console.error('Failed to fetch payment info:', error);
      } finally {
        setLoadingPaymentInfo(false);
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && !isPlacingOrder) {
      navigate('/cart');
    }
  }, [cartItems, navigate, isPlacingOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    setOrderError(null);

    // Validation Checks (Client-side)
    if (formData.fullName.trim() === '' || formData.phone.trim() === '' || formData.address.trim() === '' || formData.city.trim() === '') {
        setOrderError("Shipping details (Name, Phone, Address, City) are required.");
        return;
    }
    if (isTxnIdRequired && formData.txnId.trim() === '') {
        setOrderError(t('checkout_page.validation_txn_id'));
        return;
    }
    if (isSenderNumberRequired && formData.senderNumber.trim() === '') {
        setOrderError("Sender phone number is required.");
        return;
    }

    setIsPlacingOrder(true);
    
    const orderData = {
      // 1. Shipping Address (Keys match backend schema)
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
      },
      
      // 2. Order Items (Product ID Fix)
      orderItems: cartItems.map(item => {
        // Your debug log proved the ID is directly in item._id
        const productIdString = item._id; 
        
        if (!productIdString) {
            console.error("Critical: Cart item is missing product ID. Item:", item);
            throw new Error("Cannot place order. Product ID is missing from the cart.");
        }
        
        return {
          productId: productIdString, // <-- FIX: Key name 'productId' to match backend controller
          quantity: item.quantity,
          price: item.salePrice || item.price, 
          color: item.selectedColor || null, 
          size: item.selectedSize || null,
        };
      }),
      
      // 3. Payment Details (Keys match backend schema)
      paymentDetails: {
        paymentMethod: selectedPaymentMethod,
        transactionId: isTxnIdRequired ? formData.txnId : 'N/A (COD)',
        senderNumber: isSenderNumberRequired ? formData.senderNumber : 'N/A (COD)',
        amount: grandTotal, // The total amount paid
      },
      
      // 4. Total Amount (For backend validation)
      totalAmount: grandTotal, 
    };

    console.log("Submitting Final Order Data:", orderData);

    try {
      // 'placeOrder' uses apiService, which returns response.data
      const response = await placeOrder(orderData); 
      const newOrderId = response.data?._id; 
      clearCart();
      navigate('/order-success', { state: { orderId: newOrderId } });
      
    } catch (err) {
      // 'err' is error.response.data (from apiService interceptor)
      console.error('Failed to place order:', err);
      if (err && Array.isArray(err.errors)) {
          const validationMessage = err.errors.map(e => `${e.field}: ${e.message}`).join(' | ');
          setOrderError(`Validation Failed: ${validationMessage}`);
      } else if (err?.message) {
          setOrderError(err.message);
      } else {
          setOrderError('Could not place order. Please try again.');
      }
      setIsPlacingOrder(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="checkout-login-prompt">
        <h2>{t('checkout_page.login_prompt')}</h2>
        <Link to="/login" className="checkout-login-btn">
          {t('checkout_page.login_button')}
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <h1 className="checkout-page-title">{t('checkout_page.title')}</h1>
      
      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        {/* Left Side: Shipping Form */}
        <div className="shipping-details-form">
          <h2 className="checkout-section-title">
            {t('checkout_page.shipping_title')}
          </h2>
          <div className="form-group">
            <label htmlFor="fullName">{t('checkout_page.form.full_name')}</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">{t('checkout_page.form.phone')}</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="address">{t('checkout_page.form.address')}</label>
            <textarea id="address" name="address" rows="3" value={formData.address} onChange={handleInputChange} required></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="city">{t('checkout_page.form.city')}</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
          </div>
        </div>

        {/* Right Side: Payment & Order Summary */}
        <div className="payment-summary-container">
          <h2 className="checkout-section-title">
            {t('checkout_page.payment_title')}
          </h2>
          
          <div className="payment-info-box">
            <p>{t('checkout_page.payment_instructions')}</p>
            
            {loadingPaymentInfo ? <LoadingSpinner /> : (
              <>
                <div className="payment-method-tabs">
                  <button type="button" className={`payment-method-tab ${selectedPaymentMethod === 'bkash' ? 'active' : ''}`} onClick={() => setSelectedPaymentMethod('bkash')}>
                    {t('checkout_page.method_bkash')}
                  </button>
                  <button type="button" className={`payment-method-tab ${selectedPaymentMethod === 'nagad' ? 'active' : ''}`} onClick={() => setSelectedPaymentMethod('nagad')}>
                    {t('checkout_page.method_nagad')}
                  </button>
                  <button type="button" className={`payment-method-tab ${selectedPaymentMethod === 'rocket' ? 'active' : ''}`} onClick={() => setSelectedPaymentMethod('rocket')}>
                    {t('checkout_page.method_rocket')}
                  </button>
                  <button type="button" className={`payment-method-tab ${selectedPaymentMethod === 'bank' ? 'active' : ''}`} onClick={() => setSelectedPaymentMethod('bank')}>
                    {t('checkout_page.method_bank')}
                  </button>
                  <button type="button" className={`payment-method-tab ${selectedPaymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setSelectedPaymentMethod('cod')}>
                    {t('checkout_page.method_cod')}
                  </button>
                </div>
                
                <div className="payment-method-details">
                  {paymentInfo && (
                    <ul className="payment-methods-list">
                      {selectedPaymentMethod === 'bkash' && paymentInfo.bkash && (
                        <li><strong>bKash:</strong> {paymentInfo.bkash?.number} ({paymentInfo.bkash?.type})</li>
                      )}
                      {selectedPaymentMethod === 'nagad' && paymentInfo.nagad && (
                        <li><strong>Nagad:</strong> {paymentInfo.nagad?.number} ({paymentInfo.nagad?.type})</li>
                      )}
                      {selectedPaymentMethod === 'rocket' && paymentInfo.rocket && (
                        <li><strong>Rocket:</strong> {paymentInfo.rocket?.number} ({paymentInfo.rocket?.type})</li>
                      )}
                      {selectedPaymentMethod === 'bank' && paymentInfo.bank && (
                        <li style={{ whiteSpace: 'pre-wrap' }}>
                          <strong>Bank:</strong>
                          {typeof paymentInfo.bank === 'object' ?
                            `\nName: ${paymentInfo.bank?.name}\nBranch: ${paymentInfo.bank?.branch}\nA/C Name: ${paymentInfo.bank?.accountName}\nA/C No: ${paymentInfo.bank?.accountNumber}`
                            : paymentInfo.bank
                          }
                        </li>
                      )}
                      {selectedPaymentMethod === 'cod' && (
                        <li>{t('checkout_page.cod_details')}</li>
                      )}
                    </ul>
                  )}
                </div>
              </>
            )}
            
            <p className="payment-note">{t('checkout_page.payment_note')}</p>
          </div>
          
          {/* SENDER NUMBER FIELD */}
          {isSenderNumberRequired && (
              <div className="form-group">
                <label htmlFor="senderNumber">Sender Phone Number</label>
                <input
                  type="tel"
                  id="senderNumber"
                  name="senderNumber"
                  value={formData.senderNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
          )}
          
          {/* TXN ID FIELD */}
          <div className="form-group">
            <label htmlFor="txnId">
              {isTxnIdRequired ? t('checkout_page.form.txn_id_required') : t('checkout_page.form.txn_id')}
            </label>
            <input
              type="text"
              id="txnId"
              name="txnId"
              value={formData.txnId}
              onChange={handleInputChange}
              required={isTxnIdRequired}
              disabled={!isTxnIdRequired}
              placeholder={!isTxnIdRequired ? 'N/A for Cash on Delivery' : ''}
            />
          </div>
          
          <div className="checkout-order-summary">
            <h3 className="summary-title">{t('cart_page.order_summary')}</h3>
            <div className="summary-row">
              <span>{t('cart_page.subtotal')}</span>
              <span className="summary-value">৳ {cartSubtotal}</span>
            </div>
            <div className="summary-row">
              <span>{t('cart_page.shipping_fee')}</span>
              <span className="summary-value">৳ {cartSubtotal > 0 ? shippingCost : 0}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>{t('cart_page.grand_total')}</span>
              <span className="summary-value total-value">৳ {cartSubtotal > 0 ? grandTotal : 0}</span>
            </div>
          </div>
          
          {orderError && <p className="auth-error-message">{orderError}</p>}
          
          <button
            type="submit" 
            className="place-order-btn"
            disabled={isPlacingOrder || cartItems.length === 0}
          >
            {isPlacingOrder ? 'Placing Order...' : t('checkout_page.place_order_button')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;