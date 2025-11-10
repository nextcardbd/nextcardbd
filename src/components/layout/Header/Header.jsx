/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaSearch,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaBoxOpen,
} from 'react-icons/fa';
import './Header.css';

import { useCart } from '../../../store/CartContext';
import { useAuth } from '../../../store/AuthContext';
// 1. Import the new LanguageToggle component
import LanguageToggle from '../../common/LanguageToggle/LanguageToggle';

const Header = () => {
  const { t } = useTranslation(); // Keep this for the search placeholder
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 2. REMOVED: toggleLanguage function (now inside LanguageToggle)

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm.trim()}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  // REMOVED: isSticky logic (now handled by CSS)

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <NavLink to="/">
            NextCart<span>BD</span>
          </NavLink>
        </div>

        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder={t('header.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaSearch />
          </button>
        </form>

        {/* Right: Actions */}
        <div className="header-actions">
          
          {/* 3. Use the new LanguageToggle component */}
          <LanguageToggle className="header-action-btn" />

          {/* Wishlist (Desktop) */}
          <NavLink
            to="/wishlist"
            className="header-action-btn desktop-only"
            aria-label={t('header.wishlist')}
          >
            <FaHeart />
            <span className="badge">0</span>
          </NavLink>

          {/* Cart (Desktop) */}
          <NavLink
            to="/cart"
            className="header-action-btn desktop-only"
            aria-label={t('header.cart')}
          >
            <FaShoppingCart />
            <span className="badge">{cartCount}</span>
          </NavLink>

          {/* User Profile (Desktop) */}
          <div className="profile-dropdown-container desktop-only">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="header-action-btn profile-btn"
                  aria-label="User Profile"
                >
                  <FaUser />
                </button>
                
                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      Signed in as
                      <strong>{user?.username || 'User'}</strong>
                    </div>
                    <ul className="profile-dropdown-list">
                      <li>
                        <NavLink to="/dashboard" onClick={() => setIsProfileOpen(false)}>
                          <FaUser /> {t('auth_page.my_profile')}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/dashboard/orders" onClick={() => setIsProfileOpen(false)}>
                          <FaBoxOpen /> {t('auth_page.my_orders')}
                        </NavLink>
                      </li>
                      <li>
                        <button onClick={handleLogout}>
                          <FaSignOutAlt /> {t('auth_page.logout_button')}
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to="/login"
                className="header-action-btn"
                aria-label={t('header.profile')}
              >
                <FaUser />
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Toggle (Hamburger) */}
          <button
            className="header-action-btn mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <form className="mobile-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder={t('header.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaSearch />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;