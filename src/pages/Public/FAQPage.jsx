/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';
import './StaticPage.css'; // Reusing the same CSS

// Example FAQ Data
const faqs = [
  {
    q_en: "1. How do I place an order?",
    a_en: "Placing an order is easy! Browse our products, add items to your cart, go to the Cart Page, select your delivery option, and proceed to Checkout. Fill in your shipping details, choose a payment method, and click 'Place Order'.",
    q_bn: "১. আমি কিভাবে অর্ডার করব?",
    a_bn: "অর্ডার করা খুবই সহজ! আমাদের প্রোডাক্টগুলো দেখুন, আপনার পছন্দের আইটেমগুলো কার্টে যোগ করুন, কার্ট পেজে যান, আপনার ডেলিভারি অপশন সিলেক্ট করুন এবং চেকআউটে যান। আপনার শিপিং বিবরণ পূরণ করুন, একটি পেমেন্ট পদ্ধতি বেছে নিন এবং 'অর্ডার প্লেস করুন' এ ক্লিক করুন।",
  },
  {
    q_en: "2. What are the shipping charges?",
    a_en: "Our delivery charges are: 70 TK for Inside Dhaka, 110 TK for Dhaka Sub Area, and 130 TK for Outside Dhaka.",
    q_bn: "২. শিপিং চার্জ কত?",
    a_bn: "আমাদের ডেলিভারি চার্জ: ঢাকার ভেতরে ৭০ টাকা, ঢাকার উপশহরে ১১০ টাকা, এবং ঢাকার বাইরে ১৩০ টাকা।",
  },
  {
    q_en: "3. How long does delivery take?",
    a_en: "Delivery typically takes 2-3 days for Inside Dhaka and 3-5 days for Outside Dhaka.",
    q_bn: "৩. ডেলিভারি হতে কত সময় লাগে?",
    a_bn: "ঢাকার ভেতরে ডেলিভারি সাধারণত ২-৩ দিন এবং ঢাকার বাইরে ৩-৫ দিন সময় লাগে।",
  },
  {
    q_en: "4. What is your return policy?",
    a_en: "We have a 7-day return policy for items that are defective, damaged, or incorrect. Please read our full Return & Refund Policy page for details.",
    q_bn: "৪. আপনাদের রিটার্ন পলিসি কি?",
    a_bn: "ত্রুটিপূর্ণ, ক্ষতিগ্রস্থ বা ভুল আইটেমের জন্য আমাদের ৭ দিনের রিটার্ন পলিসি রয়েছে। বিস্তারিত জানার জন্য অনুগ্রহ করে আমাদের 'রিটার্ন ও রিফান্ড পলিসি' পেজটি পড়ুন।",
  },
];

const FAQItem = ({ faq }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{i18n.language === 'bn' ? faq.q_bn : faq.q_en}</span>
        <FaChevronDown className="faq-icon" />
      </button>
      <div className="faq-answer">
        <p>{i18n.language === 'bn' ? faq.a_bn : faq.a_en}</p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const { t } = useTranslation();
  return (
    <div className="static-page-container">
      <h1 className="static-page-title">{t('static_pages.faq_title')}</h1>
      <div className="static-page-content">
        {faqs.map((faq, index) => (
          <FAQItem key={index} faq={faq} />
        ))}
      </div>
    </div>
  );
};

export default FAQPage;