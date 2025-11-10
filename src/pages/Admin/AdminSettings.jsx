/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPaymentSettings, updatePaymentSettings } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './AdminSettings.css'; // New CSS file

const AdminSettings = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state for all payment methods
  const [formData, setFormData] = useState({
    bkash_number: '',
    bkash_type: 'Personal',
    nagad_number: '',
    nagad_type: 'Personal',
    rocket_number: '',
    rocket_type: 'Personal',
    bank_name: '',
    bank_branch: '',
    bank_accountName: '',
    bank_accountNumber: '',
  });

  // Load existing settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoadingData(true);
        const response = await getPaymentSettings();
        const settings = response.data || response;
        
        if (settings) {
          setFormData({
            bkash_number: settings.bkash?.number || '',
            bkash_type: settings.bkash?.type || 'Personal',
            nagad_number: settings.nagad?.number || '',
            nagad_type: settings.nagad?.type || 'Personal',
            rocket_number: settings.rocket?.number || '',
            rocket_type: settings.rocket?.type || 'Personal',
            bank_name: settings.bank?.name || '',
            bank_branch: settings.bank?.branch || '',
            bank_accountName: settings.bank?.accountName || '',
            bank_accountNumber: settings.bank?.accountNumber || '',
          });
        }
      } catch (err) {
        setError('Failed to load settings.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Prepare data in the format the backend expects
    const settingsData = {
      bkash: {
        number: formData.bkash_number,
        type: formData.bkash_type,
      },
      nagad: {
        number: formData.nagad_number,
        type: formData.nagad_type,
      },
      rocket: {
        number: formData.rocket_number,
        type: formData.rocket_type,
      },
      bank: {
        name: formData.bank_name,
        branch: formData.bank_branch,
        accountName: formData.bank_accountName,
        accountNumber: formData.bank_accountNumber,
      },
    };

    try {
      await updatePaymentSettings(settingsData);
      setSuccess('Payment settings updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="admin-settings-container">
      <h1 className="admin-page-title">{t('admin_page.nav_settings')}</h1>
      
      <form className="admin-form-card" onSubmit={handleSubmit}>
        <h3 className="admin-section-title">Payment Methods</h3>
        
        {error && <p className="admin-error-message">{error}</p>}
        {success && <p className="admin-success-message">{success}</p>}
        
        {/* bKash Section */}
        <fieldset className="form-fieldset">
          <legend>bKash</legend>
          <div className="form-group-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="bkash_number">bKash Number</label>
              <input id="bkash_number" name="bkash_number" value={formData.bkash_number} onChange={handleInputChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="bkash_type">Type</label>
              <select id="bkash_type" name="bkash_type" value={formData.bkash_type} onChange={handleInputChange}>
                <option value="Personal">Personal</option>
                <option value="Agent">Agent</option>
                <option value="Merchant">Merchant</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Nagad Section */}
        <fieldset className="form-fieldset">
          <legend>Nagad</legend>
          <div className="form-group-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="nagad_number">Nagad Number</label>
              <input id="nagad_number" name="nagad_number" value={formData.nagad_number} onChange={handleInputChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="nagad_type">Type</label>
              <select id="nagad_type" name="nagad_type" value={formData.nagad_type} onChange={handleInputChange}>
                <option value="Personal">Personal</option>
                <option value="Agent">Agent</option>
                <option value="Merchant">Merchant</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Rocket Section */}
        <fieldset className="form-fieldset">
          <legend>Rocket</legend>
          <div className="form-group-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="rocket_number">Rocket Number</label>
              <input id="rocket_number" name="rocket_number" value={formData.rocket_number} onChange={handleInputChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="rocket_type">Type</label>
              <select id="rocket_type" name="rocket_type" value={formData.rocket_type} onChange={handleInputChange}>
                <option value="Personal">Personal</option>
                <option value="Agent">Agent</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Bank Section */}
        <fieldset className="form-fieldset">
          <legend>Bank Transfer</legend>
          <div className="form-group">
            <label htmlFor="bank_name">Bank Name</label>
            <input id="bank_name" name="bank_name" value={formData.bank_name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="bank_branch">Branch Name</label>
            <input id="bank_branch" name="bank_branch" value={formData.bank_branch} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="bank_accountName">Account Name</label>
            <input id="bank_accountName" name="bank_accountName" value={formData.bank_accountName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="bank_accountNumber">Account Number</label>
            <input id="bank_accountNumber" name="bank_accountNumber" value={formData.bank_accountNumber} onChange={handleInputChange} />
          </div>
        </fieldset>

        <button type="submit" className="add-new-btn" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;