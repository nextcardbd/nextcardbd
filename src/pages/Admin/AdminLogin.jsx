/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authApi'; 
import { FaUserShield } from 'react-icons/fa';
import '../Auth/Auth.css'; // Reuse Auth styles

// Mock Admin Secret Key for frontend development testing. 
// In production, this would be retrieved securely.
const MOCK_ADMIN_SECRET_KEY = "admin-key-2025-nexcartbd"; 

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: 'admin@nexcartbd.com', // Pre-fill email for convenience
    password: 'adminpassword',
    secretKey: MOCK_ADMIN_SECRET_KEY, // Pre-fill secret key
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 1. Attempt standard login first
      const response = await loginUser({ email: formData.email, password: formData.password });
      
      if (response.data && response.data.token) {
        // 2. Assuming the backend checks if the user is an admin
        // We simulate saving admin token and the secret key
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminSecretKey', formData.secretKey); // Save the secret key
        
        // 3. Redirect to Admin Dashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Login failed: Invalid credentials or not an admin user.');
      }
    } catch (err) {
      console.error('Admin Login failed:', err);
      setError('Login failed. Please check credentials and Secret Key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">
          <FaUserShield style={{ marginRight: '10px', color: 'var(--secondary-color)' }} /> 
          {t('admin_page.login_title')}
        </h1>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="auth-form-group">
            <label htmlFor="email">{t('auth_page.email_label')}</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          
          <div className="auth-form-group">
            <label htmlFor="password">{t('auth_page.password_label')}</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
          </div>

          <div className="auth-form-group">
            <label htmlFor="secretKey">Admin Secret Key</label>
            <input type="password" id="secretKey" name="secretKey" value={formData.secretKey} onChange={handleInputChange} required />
          </div>

          {error && <p className="auth-error-message">{error}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : t('auth_page.login_button')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;