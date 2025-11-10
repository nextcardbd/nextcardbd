/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaFacebook,
  FaTiktok, // 1. Import FaTiktok
  FaInstagram, // Keep Instagram for now, or remove if you are sure
  FaArrowUp,
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: About */}
        <div className="footer-column">
          <h3 className="footer-logo">
            NextCart<span>BD</span>
          </h3>
          <p>{t('footer.about_text')}</p>
          
          {/* --- UPDATED: Social Icons --- */}
          <div className="social-icons">
            <a 
              href="https://www.facebook.com/share/1DckEHmwPM/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a 
              href="https://www.tiktok.com/@nextcardbd?_r=1&_t=ZS-91H65YaJtR7" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
            {/* Instagram link removed as requested */}
          </div>
          {/* --- END OF UPDATE --- */}

        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h4>{t('footer.quick_links')}</h4>
          <ul>
            <li>
              <NavLink to="/">{t('footer.links.home')}</NavLink>
            </li>
            <li>
              <NavLink to="/products">{t('footer.links.shop')}</NavLink>
            </li>
            <li>
              <NavLink to="/cart">{t('footer.links.cart')}</NavLink>
            </li>
            <li>
              <NavLink to="/contact">{t('footer.links.contact')}</NavLink>
            </li>
          </ul>
        </div>

        {/* Column 3: Service */}
        <div className="footer-column">
          <h4>{t('footer.service')}</h4>
          <ul>
            <li>
              <NavLink to="/faq">{t('footer.service_links.faq')}</NavLink>
            </li>
            <li>
              <NavLink to="/shipping-policy">
                {t('footer.service_links.shipping')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/return-policy">
                {t('footer.service_links.returns')}
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="footer-column">
          <h4>{t('footer.contact')}</h4>
          <p>{t('footer.contact_info.address')}</p>
          <p>{t('footer.contact_info.email')}</p>
          <p>{t('footer.contact_info.phone')}</p>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment */}
      <div className="footer-bottom">
        <p className="copyright">{t('footer.copyright')}</p>
        <div className="payment-icons">
          <span>{t('footer.pay_with')}</span>
          <span className="payment-placeholder bkash">
            {t('footer.payment_methods.bkash')}
          </span>
          <span className="payment-placeholder nagad">
            {t('footer.payment_methods.nagad')}
          </span>
          <span className="payment-placeholder rocket">
            {t('footer.payment_methods.rocket')}
          </span>
          <span className="payment-placeholder bank">
            {t('footer.payment_methods.bank')}
          </span>
          <span className="payment-placeholder cod">
            {t('footer.payment_methods.cod')}
          </span>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        className="scroll-to-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;