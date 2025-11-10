/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaThList, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCart } from '../../../store/CartContext';
import { useAuth } from '../../../store/AuthContext';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const { t } = useTranslation();
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();

  // Determine account link based on auth state
  const accountLink = isAuthenticated ? '/dashboard' : '/login';

  return (
    <nav className="mobile-bottom-nav">
      {/* Home */}
      <NavLink to="/" className="mobile-nav-item" end>
        <FaHome size={20} />
        <span>{t('bottom_nav.home')}</span>
      </NavLink>
      
      {/* Categories (links to Products page as per our plan) */}
      <NavLink to="/products" className="mobile-nav-item">
        <FaThList size={20} />
        <span>{t('bottom_nav.categories')}</span>
      </NavLink>
      
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