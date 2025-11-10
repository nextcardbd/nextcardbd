/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/AuthContext';
import { getProfile, updateProfile } from '../../api/userApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); // Get user info from context
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // --- UPDATED: Calling live API ---
        const data = await getProfile();
        
        // --- FIX: Check for data.data or data.data.profile ---
        const profile = data.data?.profile || data.data || data;
        
        setFormData({
          username: profile.username || '',
          email: profile.email || '',
          phone: profile.phone || '', // Assuming 'phone' is a field
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const profileData = {
        username: formData.username,
        phone: formData.phone,
      };
      await updateProfile(profileData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.email) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="profile-container">
      <h2 className="dashboard-content-title">{t('dashboard_page.profile_title')}</h2>
      
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">{t('auth_page.username_label')}</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">{t('auth_page.email_label')}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            readOnly
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">{t('checkout_page.form.phone')}</label>
          <input
            type="tel" 
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        
        {error && <p className="profile-message error">{error}</p>}
        {success && <p className="profile-message success">{success}</p>}

        <button type="submit" className="profile-update-btn" disabled={loading}>
          {loading ? 'Updating...' : t('dashboard_page.profile_update_button')}
        </button>
      </form>
    </div>
  );
};

export default Profile;