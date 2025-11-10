/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { verifyEmailToken } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './VerifyEmailPage.css'; // New CSS file

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Read token from ?token=...

  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState(t('verification_page.verifying'));

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('verification_page.error_message'));
      return;
    }

    const verify = async () => {
      try {
        await verifyEmailToken(token);
        setStatus('success');
        setMessage(t('verification_page.success_message'));
      } catch (err) {
        setStatus('error');
        setMessage(err.message || t('verification_page.error_message'));
      }
    };
    
    verify();
  }, [token, t]);

  return (
    <div className="verify-page-container">
      <div className="verify-box">
        {status === 'verifying' && (
          <>
            <LoadingSpinner size="large" />
            <h2 className="verify-title">{message}</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <FaCheckCircle className="verify-icon success" />
            <h2 className="verify-title">{t('verification_page.success_title')}</h2>
            <p>{message}</p>
            <Link to="/login" className="verify-login-btn">
              {t('verification_page.login_button')}
            </Link>
          </>
        )}
        
        {status === 'error' && (
          <>
            <FaTimesCircle className="verify-icon error" />
            <h2 className="verify-title">{t('verification_page.error_title')}</h2>
            <p>{message}</p>
            <Link to="/login" className="verify-login-btn">
              {t('verification_page.login_button')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;