/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import './Auth.css'; // Importing the shared CSS

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      // If login is successful, redirect to homepage
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">{t('auth_page.login_title')}</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          
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
              value={formData.password}
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
            {loading ? 'Logging in...' : t('auth_page.login_button')}
          </button>
        </form>
        
        <p className="auth-switch-link">
          {t('auth_page.register_prompt')}{' '}
          <Link to="/register">{t('auth_page.register_link')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;