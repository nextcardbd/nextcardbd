/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './StaticPage.css'; // Reusing the same CSS

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="static-page-container">
      <h1 className="static-page-title">{t('static_pages.contact_title')}</h1>
      <p>{t('static_pages.contact_subtitle')}</p>
      
      <div className="contact-grid">
        {/* Left: Contact Form */}
        <div className="contact-form">
          <h2 style={{marginTop: '20px'}}>{t('static_pages.contact_form_title')}</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">{t('static_pages.form_name')}</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('static_pages.form_email')}</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">{t('static_pages.form_subject')}</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('static_pages.form_message')}</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="add-new-btn" style={{fontSize: '16px'}}>
              {t('static_pages.form_send_button')}
            </button>
          </form>
        </div>
        
        {/* Right: Contact Info */}
        <div className="contact-info">
          <h2 style={{marginTop: '20px'}}>{t('static_pages.contact_info_title')}</h2>
          <p>{t('footer.about_text')}</p>
          <ul className="contact-info-list" style={{listStyle: 'none', padding: 0}}>
            <li style={{display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px'}}>
              <FaMapMarkerAlt size={20} color="var(--primary-color)" />
              <span>{t('static_pages.contact_address')}</span>
            </li>
            <li style={{display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px'}}>
              <FaEnvelope size={20} color="var(--primary-color)" />
              <span>{t('footer.contact_info.email')}</span>
            </li>
            <li style={{display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px'}}>
              <FaPhone size={20} color="var(--primary-color)" />
              <span>{t('footer.contact_info.phone')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;