/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaThList, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCart } from '../../../store/CartContext';
import { useAuth } from '../../../store/AuthContext';
import './MobileBottomNav.css';

// 1. Accept 'onCategoryClick' prop
const MobileBottomNav = ({ onCategoryClick }) => {
  const { t } = useTranslation();
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();

  const accountLink = isAuthenticated ? '/dashboard' : '/login';

  return (
    <nav className="mobile-bottom-nav">
      {/* Home */}
      <NavLink to="/" className="mobile-nav-item" end>
        <FaHome size={20} />
        <span>{t('bottom_nav.home')}</span>
      </NavLink>
      
      {/* 2. --- THIS IS THE FIX ---
          Changed from NavLink to button.
          It no longer links to /products, it opens the drawer.
      */}
      <button 
        type="button" 
        className="mobile-nav-item" 
        onClick={onCategoryClick}
      >
        <FaThList size={20} />
        <span>{t('bottom_nav.categories')}</span>
      </button>
      
      {/* Cart */}
      <NavLink to="/cart" className="mobile-nav-item">
        <div className="cart-icon-wrapper">
          <FaShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="mobile-cart-badge">{cartCount}</span>
          )}
        </div>
        <span>{t('bottom_nav.cart')}</span>
      </NavLink>
      
      {/* Account (Login/Dashboard) */}
      <NavLink to={accountLink} className="mobile-nav-item">
        <FaUser size={20} />
        <span>{t('bottom_nav.account')}</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;