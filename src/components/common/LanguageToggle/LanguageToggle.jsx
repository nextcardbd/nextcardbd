/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

/**
 * A reusable language toggle button (EN/BN).
 * @param {object} props
 * @param {string} [props.className] - Optional extra class for styling.
 */
const LanguageToggle = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`lang-toggle-btn ${className}`}
      aria-label="Toggle Language"
    >
      {i18n.language === 'en' ? 'বাংলা' : 'EN'}
    </button>
  );
};

export default LanguageToggle;