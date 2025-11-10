// © Mahin LTD Developer Tanvir
// Your Role with Me:  
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaThList, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCart } from '../../../store/CartContext';
import { useAuth } from '../../../store/AuthContext';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const { t } = useTranslation();
  const { cartCount: rawCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  // Normalize cart count
  const cartCount = Number.isFinite(Number(rawCount)) ? Number(rawCount) : 0;

  // Role-aware account route
  const accountLink = isAuthenticated
    ? (user?.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    : '/login';

  // Bounce animation on cartCount change
  const badgeRef = useRef(null);
  useEffect(() => {
    if (!badgeRef.current) return;
    if (cartCount > 0) {
      badgeRef.current.classList.remove('badge-bounce');
      // reflow to restart animation
      // eslint-disable-next-line no-unused-expressions
      badgeRef.current.offsetHeight;
      badgeRef.current.classList.add('badge-bounce');
    }
  }, [cartCount]);

  // Util: NavLink class with active state
  const linkClass = ({ isActive }) =>
    `mobile-nav-item ${isActive ? 'is-active' : ''}`;

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary">
      {/* Home */}
      <NavLink to="/" className={linkClass} end aria-label={t('bottom_nav.home')}>
        <FaHome size={20} className="nav-icon" />
        <span className="nav-label">{t('bottom_nav.home')}</span>
        <i className="active-underline" aria-hidden />
      </NavLink>

      {/* Categories */}
      <NavLink to="/products" className={linkClass} aria-label={t('bottom_nav.categories')}>
        <FaThList size={20} className="nav-icon" />
        <span className="nav-label">{t('bottom_nav.categories')}</span>
        <i className="active-underline" aria-hidden />
      </NavLink>

      {/* Cart */}
      <NavLink to="/cart" className={linkClass} aria-label={t('bottom_nav.cart')}>
        <div className="cart-icon-wrapper">
          <FaShoppingCart size={20} className="nav-icon" />
          {cartCount > 0 && (
            <span ref={badgeRef} className="mobile-cart-badge" aria-label={`${cartCount} items in cart`}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
        <span className="nav-label">{t('bottom_nav.cart')}</span>
        <i className="active-underline" aria-hidden />
      </NavLink>

      {/* Account (Login/Dashboard/Admin) */}
      <NavLink to={accountLink} className={linkClass} aria-label={t('bottom_nav.account')}>
        <FaUser size={20} className="nav-icon" />
        <span className="nav-label">{t('bottom_nav.account')}</span>
        <i className="active-underline" aria-hidden />
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
