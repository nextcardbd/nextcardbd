/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import './Auth.css';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  
  // 1. --- NEW: State for success message ---
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null); // Clear previous messages
    
    const success = await register(
      formData.username,
      formData.email,
      formData.password
    );
    
    if (success) {
      // 2. --- THIS IS THE FIX ---
      // Show success message instead of redirecting
      setSuccessMessage(t('auth_page.register_success'));
      setFormData({ username: '', email: '', password: '' }); // Clear form
      // No navigation, user must check email
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">{t('auth_page.register_title')}</h1>
        
        {/* 3. Show success message if it exists */}
        {successMessage ? (
          <div className="auth-success-message">
            <FaCheckCircle className="auth-success-icon" />
            <p>{successMessage}</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="username">{t('auth_page.username_label')}</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="email">{t('auth_page.email_label')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="auth-form-group">
              <label htmlFor="password">{t('auth_page.password_label')}</label>
              <input
                type="password"
                id="password"
                name="password"
                minLength="6"
                onChange={handleInputChange}
                required
              />
            </div>

            {error && <p className="auth-error-message">{error}</p>}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Registering...' : t('auth_page.register_button')}
            </button>
          </form>
        )}
        
        <p className="auth-switch-link">
          {t('auth_page.login_prompt')}{' '}
          <Link to="/login">{t('auth_page.login_link')}</Link>
        </p>
      </div>
    </div>
  );
};

// Import FaCheckCircle for the success message
import { FaCheckCircle } from 'react-icons/fa';

export default RegisterPage;