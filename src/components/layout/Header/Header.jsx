/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState } from 'react';
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

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  // REMOVED: isSticky state (now handled by CSS)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // --- NEW: State for Search ---
  const [searchTerm, setSearchTerm] = useState('');

  // Language toggle function
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
    setIsMobileMenuOpen(false);
  };

  // --- NEW: Handle Search Submit ---
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Stop form from reloading page
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm.trim()}`);
      setSearchTerm(''); // Clear search bar after submit
      setIsMobileMenuOpen(false); // Close mobile menu if open
    }
  };

  // REMOVED: useEffect for sticky header

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="header"> {/* REMOVED: sticky class logic */}
      <div className="header-container">
        <div className="header-logo">
          <NavLink to="/">
            NextCart<span>BD</span>
          </NavLink>
        </div>

        {/* --- UPDATED: Search Bar is now a form --- */}
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
          {/* ... (Lang Toggle, Wishlist, Cart - no changes) ... */}
          <button
            onClick={toggleLanguage}
            className="header-action-btn lang-toggle"
            aria-label="Toggle Language"
          >
            {i18n.language === 'en' ? 'বাংলা' : 'EN'}
          </button>

          <NavLink
            to="/wishlist"
            className="header-action-btn"
            aria-label={t('header.wishlist')}
          >
            <FaHeart />
            <span className="badge">0</span>
          </NavLink>

          <NavLink
            to="/cart"
            className="header-action-btn"
            aria-label={t('header.cart')}
          >
            <FaShoppingCart />
            <span className="badge">{cartCount}</span>
          </NavLink>

          {/* Conditional User Profile/Login Button */}
          {isAuthenticated ? (
            <div className="profile-dropdown-container">
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
            </div>
          ) : (
            <NavLink
              to="/login"
              className="header-action-btn"
              aria-label={t('header.profile')}
            >
              <FaUser />
            </NavLink>
          )}

          {/* Mobile Menu Toggle */}
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