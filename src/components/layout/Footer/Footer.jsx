/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
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
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h4>{t('footer.quick_links')}</h4>
          <ul>
            <li>
              <NavLink to="/">{t('footer.links.home')}</NavLink>
            </li>
            <li>
              <NavLink to="/shop">{t('footer.links.shop')}</NavLink>
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
          {/* Using text placeholders from translation files */}
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