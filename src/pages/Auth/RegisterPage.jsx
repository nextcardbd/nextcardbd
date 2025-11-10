/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import './Auth.css'; // Importing the shared CSS

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    username: '', // Changed from 'name' to 'username'
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null); // Clear previous success message
    
    const success = await register(
      formData.username, // Send username
      formData.email,
      formData.password
    );
    
    if (success) {
      // Show success message and redirect to login
      setSuccessMessage('Registration successful! Please login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Wait 2 seconds
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">{t('auth_page.register_title')}</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="auth-form-group">
            <label htmlFor="username">{t('auth_page.username_label')}</label>
            <input
              type="text"
              id="username"
              name="username" // Changed from 'name'
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
          {successMessage && (
            <p className="auth-error-message" style={{ color: 'green' }}>
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : t('auth_page.register_button')}
          </button>
        </form>
        
        <p className="auth-switch-link">
          {t('auth_page.login_prompt')}{' '}
          <Link to="/login">{t('auth_page.login_link')}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;