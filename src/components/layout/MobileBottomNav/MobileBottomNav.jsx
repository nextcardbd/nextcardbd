// © Mahin LTD Developer Tanvir
// Your Role with Me:  
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaThList, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCart } from '../../../store/CartContext';
import { useAuth } from '../../../store/AuthContext';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const { t } = useTranslation();
  const { cartCount: rawCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth?.() || {};
  const navigate = useNavigate();

  const cartCount = Number.isFinite(Number(rawCount)) ? Number(rawCount) : 0;

  // Profile popover
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const linkClass = ({ isActive }) => `mobile-nav-item ${isActive ? 'is-active' : ''}`;

  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary">
      {/* Home */}
      <NavLink to="/" className={linkClass} end aria-label={t('bottom_nav.home')}>
        <FaHome size={20} className="nav-icon" />
        <span className="nav-label">{t('bottom_nav.home')}</span>
        <i className="active-underline" aria-hidden />
      </NavLink>

      {/* Categories: all categories page */}
      <NavLink to="/categories" className={linkClass} aria-label={t('bottom_nav.categories')}>
        <FaThList size={20} className="nav-icon" />
        <span className="nav-label">{t('bottom_nav.categories')}</span>
        <i className="active-underline" aria-hidden />
      </NavLink>

      {/* Cart */}
      <NavLink to="/cart" className={linkClass} aria-label={t('bottom_nav.cart')}>
        <div className="cart-icon-wrapper">
          <FaShoppingCart size={20} className="nav-icon" />
          {cartCount > 0 && (
            <span className="mobile-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
          )}
        </div>
        <span className="nav-label">{t('bottom_nav.cart')}</span>
        <i className="active-underline" aria-hidden />
      </NavLink>

      {/* Profile (native menu inside) */}
      <div className="mobile-nav-item profile-root" ref={menuRef}>
        <button
          className="profile-trigger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label={t('bottom_nav.account')}
        >
          <FaUser size={20} className="nav-icon" />
          <span className="nav-label">{t('bottom_nav.account')}</span>
          <i className="active-underline" aria-hidden />
        </button>

        {menuOpen && (
          <div className="profile-popover" role="menu">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <button className="profile-item" onClick={() => go('/admin/dashboard')} role="menuitem">
                    {t('profile_nav.admin_dashboard', 'Admin Dashboard')}
                  </button>
                )}
                <button className="profile-item" onClick={() => go('/dashboard')} role="menuitem">
                  {t('profile_nav.dashboard', 'Dashboard')}
                </button>
                <button className="profile-item" onClick={() => go('/dashboard/orders')} role="menuitem">
                  {t('profile_nav.orders', 'My Orders')}
                </button>
                <button className="profile-item" onClick={() => go('/dashboard/profile')} role="menuitem">
                  {t('profile_nav.profile', 'Profile')}
                </button>
                <button
                  className="profile-item danger"
                  onClick={() => {
                    logout?.();
                    setMenuOpen(false);
                    navigate('/login');
                  }}
                  role="menuitem"
                >
                  {t('auth.logout', 'Logout')}
                </button>
              </>
            ) : (
              <>
                <button className="profile-item" onClick={() => go('/login')} role="menuitem">
                  {t('auth.login', 'Login')}
                </button>
                <button className="profile-item" onClick={() => go('/register')} role="menuitem">
                  {t('auth.register', 'Register')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
