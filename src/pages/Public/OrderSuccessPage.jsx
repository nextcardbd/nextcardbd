/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const orderId = location.state?.orderId; // Get orderId from navigation state

  return (
    <div className="order-success-container">
      <FaCheckCircle className="success-icon" />
      <h1 className="success-title">{t('order_success_page.title')}</h1>
      <p className="success-message">{t('order_success_page.message')}</p>
      
      {orderId && (
        <p className="order-id-message">
          {t('order_success_page.order_id')} <strong>{orderId}</strong>
        </p>
      )}
      
      <Link to="/" className="back-to-home-btn">
        {t('order_success_page.back_to_home')}
      </Link>
    </div>
  );
};

export default OrderSuccessPage;