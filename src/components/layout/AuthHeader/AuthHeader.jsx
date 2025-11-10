/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AuthHeader.css';

const AuthHeader = () => {
  const { t, i18n } = useTranslation();

  // Language toggle function
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="auth-header">
      <div className="auth-header-container">
        {/* Left: Brand Logo */}
        <div className="auth-header-logo">
          <NavLink to="/">
            NextCart<span>BD</span>
          </NavLink>
        </div>

        {/* Right: Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="auth-lang-toggle"
          aria-label="Toggle Language"
        >
          {i18n.language === 'en' ? 'বাংলা' : 'EN'}
        </button>
      </div>
    </header>
  );
};

export default AuthHeader;