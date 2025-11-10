/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { useTranslation } from 'react-i18next';
import './StaticPage.css'; // Reusing the same CSS

// This is the base component
const PolicyPage = ({ titleKey, content }) => {
  const { t } = useTranslation();

  return (
    <div className="static-page-container">
      <h1 className="static-page-title">{t(titleKey)}</h1>
      <div className="static-page-content">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

// --- Content Definitions are now FUNCTIONS that accept 't' ---

const getShippingPolicyContent = (t, i18n) => {
  const content_en = `
    <h2>Order Processing</h2>
    <p>Orders are processed within 24 hours of payment verification (excluding weekends and holidays). For Cash on Delivery (COD) orders, confirmation is done via phone call.</p>
    
    <h2>Delivery Time</h2>
    <p>We strive to deliver your products as fast as possible. Estimated delivery times are:</p>
    <ul>
      <li><strong>Inside Dhaka:</strong> 2-3 working days.</li>
      <li><strong>Dhaka Sub Area:</strong> 2-3 working days.</li>
      <li><strong>Outside Dhaka:</strong> 3-5 working days.</li>
    </ul>
    <p><em>Note: Delivery times may vary due to political instability, natural disasters, or other unforeseen circumstances.</em></p>
    
    <h2>Shipping Charges</h2>
    <ul>
      <li><strong>Inside Dhaka:</strong> 70 TK</li>
      <li><strong>Dhaka Sub Area:</strong> 110 TK</li>
      <li><strong>Outside Dhaka:</strong> 130 TK</li>
    </ul>
  `;

  const content_bn = `
    <h2>অর্ডার প্রসেসিং</h2>
    <p>পেমেন্ট ভেরিফিকেশনের পর ২৪ ঘন্টার মধ্যে অর্ডার প্রসেস করা হয় (সাপ্তাহিক ছুটি এবং সরকারী ছুটি ব্যতীত)। ক্যাশ অন ডেলিভারি (COD) অর্ডারের ক্ষেত্রে, ফোন কলের মাধ্যমে অর্ডার কনফার্ম করা হয়।</p>
    
    <h2>ডেলিভারি সময়</h2>
    <p>আমরা যত দ্রুত সম্ভব আপনার পণ্য পৌঁছে দিতে সচেষ্ট। আনুমানিক ডেলিভারি সময়:</p>
    <ul>
      <li><strong>ঢাকার ভেতরে:</strong> ২-৩ কার্যদিবস।</li>
      <li><strong>ঢাকার উপশহর:</strong> ২-৩ কার্যদিবস।</li>
      <li><strong>ঢাকার বাইরে:</strong> ৩-৫ কার্যদিবস।</li>
    </ul>
    <p><em>দ্রষ্টব্য: রাজনৈতিক অস্থিরতা, প্রাকৃতিক দুর্যোগ বা অন্যান্য অপ্রত্যাশিত কারণে ডেলিভারির সময় পরিবর্তিত হতে পারে।</em></p>
    
    <h2>শিপিং চার্জ</h2>
    <ul>
      <li><strong>ঢাকার ভেতরে:</strong> ৭০ টাকা</li>
      <li><strong>ঢাকার উপশহর:</strong> ১১০ টাকা</li>
      <li><strong>ঢাকার বাইরে:</strong> ১৩০ টাকা</li>
    </ul>
  `;
  
  return i18n.language === 'bn' ? content_bn : content_en;
};

const getReturnPolicyContent = (t, i18n) => {
  const email = t('footer.contact_info.email');
  const phone = t('footer.contact_info.phone');

  const content_en = `
    <h2>7-Day Return Policy</h2>
    <p>We have a 7-day return policy, which means you have 7 days after receiving your item to request a return.</p>
    
    <h2>Conditions for Return</h2>
    <p>To be eligible for a return, your item must meet one of the following conditions:</p>
    <ul>
      <li>Product is defective, damaged, or broken upon arrival.</li>
      <li>Product is incorrect (wrong item, wrong size, or wrong color).</li>
      <li>Product is incomplete or missing parts.</li>
    </ul>
    <p>The item must be in the same condition that you received it: unused, with tags, and in its original packaging. You must provide the original invoice.</p>
    
    <h2>How to Request a Return</h2>
    <p>To start a return, please contact us at <strong>${email}</strong> or call <strong>${phone}</strong> with your Order ID and photos/videos of the issue. If your return is accepted, we will provide instructions on how and where to send your package.</p>
    
    <h2>Refunds</h2>
    <p>Once we receive and inspect your return, we will notify you if the refund is approved. If approved, you will be automatically refunded via your original payment method (e.g., bKash, Nagad) within 5-7 working days. For COD orders, refunds will be processed via bank or mobile banking.</p>
  `;

  const content_bn = `
    <h2>৭ দিনের রিটার্ন পলিসি</h2>
    <p>আমাদের ৭ দিনের রিটার্ন পলিসি রয়েছে। এর মানে হলো, আপনি পণ্যটি হাতে পাওয়ার পর ৭ দিনের মধ্যে রিটার্নের জন্য আবেদন করতে পারবেন।</p>
    
    <h2>রিটার্নের শর্তাবলী</h2>
    <p>রিটার্নের জন্য যোগ্য হতে, আপনার আইটেমটিকে অবশ্যই নিম্নলিখিত শর্তগুলির মধ্যে একটি পূরণ করতে হবে:</p>
    <ul>
      <li>পণ্যটি ত্রুটিপূর্ণ, ক্ষতিগ্রস্থ বা ভাঙা অবস্থায় পাওয়া গেলে।</li>
      <li>পণ্যটি ভুল হলে (ভুল আইটেম, ভুল আকার, বা ভুল রঙ)।</li>
      <li>পণ্যটি অসম্পূর্ণ বা অংশবিশেষ অনুপস্থিত থাকলে।</li>
    </ul>
    <p>আইটেমটি অবশ্যই অব্যবহৃত, ট্যাগ সহ এবং অরিজিনাল প্যাকেজিং-এ থাকতে হবে। অবশ্যই অরিজিনাল ইনভয়েস প্রদান করতে হবে।</p>
    
    <h2>রিটার্নের জন্য আবেদন</h2>
    <p>রিটার্ন শুরু করতে, অনুগ্রহ করে আপনার অর্ডার আইডি এবং সমস্যার ছবি/ভিডিও সহ আমাদের সাথে <strong>${email}</strong>-এ ইমেইল করুন বা <strong>${phone}</strong> নম্বরে কল করুন। আপনার আবেদন গৃহীত হলে, আমরা আপনাকে প্যাকেজটি পাঠানোর নির্দেশাবলী সরবরাহ করব।</p>
    
    <h2>রিফান্ড</h2>
    <p>আমরা আপনার রিটার্ন করা পণ্যটি পাওয়ার পর এবং পরীক্ষা করার পর আপনাকে রিফান্ডের বিষয়ে অবহিত করব। রিফান্ড অনুমোদিত হলে, আপনাকে ৫-৭ কার্যদিবসের মধ্যে আপনার মূল পেমেন্ট পদ্ধতিতে (যেমন: বিকাশ, নগদ) রিফান্ড করা হবে। COD অর্ডারের ক্ষেত্রে, রিফান্ড ব্যাংক বা মোবাইল ব্যাংকিংয়ের মাধ্যমে প্রসেস করা হবে।</p>
  `;
  
  return i18n.language === 'bn' ? content_bn : content_en;
};


// --- Export specific page versions ---

export const ShippingPolicyPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <PolicyPage
      titleKey="static_pages.shipping_policy_title"
      content={getShippingPolicyContent(t, i18n)}
    />
  );
};

export const ReturnPolicyPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <PolicyPage
      titleKey="static_pages.return_policy_title"
      content={getReturnPolicyContent(t, i18n)}
    />
  );
};