// © Mahin LTD Developer Tanvir
// Your Role with Me:
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import './CartPage.css';

// ⬇️ TikTok helpers
import { ttqAddToCart, ttqInitiateCheckout } from '../../lib/ttqEvents';

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const {
    cartItems,
    cartSubtotal,
    grandTotal,
    shippingCost,
    shippingOption,
    setShipping,
    removeFromCart,
    updateQuantity
  } = useCart();
  const navigate = useNavigate();

  // small util: normalize price
  const getItemPrice = (item) => Number(item.salePrice || item.price || 0);

  // Increase Qty → we also fire AddToCart for the delta (best practice)
  const handleIncrease = (item) => {
    const idKey = item.productId;
    const newQty = (item.quantity || 1) + 1;
    updateQuantity(idKey, newQty);

    // TTQ: send only the increment as AddToCart delta
    const slug = item.slug || item.productSlug || item._id || idKey;
    const price = getItemPrice(item);
    if (slug && price >= 0) {
      ttqAddToCart({ slug, price, qty: 1 }); // only +1 added
    }
  };

  // Decrease Qty → no AddToCart event (optionally you could send RemoveFromCart)
  const handleDecrease = (item) => {
    const idKey = item.productId;
    const newQty = Math.max(1, (item.quantity || 1) - 1);
    updateQuantity(idKey, newQty);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-container">
        <h2>{t('cart_page.title')}</h2>
        <p>{t('cart_page.empty_message')}</p>
        <Link to="/" className="continue-shopping-btn">
          {t('cart_page.continue_shopping')}
        </Link>
      </div>
    );
  }

  // Checkout click → send InitiateCheckout with full cart, then navigate
  const handleCheckout = () => {
    try {
      const items = cartItems.map((it) => ({
        slug: it.slug || it.productSlug || it._id || it.productId,
        price: getItemPrice(it),
        qty: Number(it.quantity || 1),
      }));
      ttqInitiateCheckout({ items, currency: 'BDT' });
    } catch (e) {
      // silent fail – pixel optional
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-page-container">
      <h1 className="cart-page-title">{t('cart_page.title')}</h1>
      <div className="cart-layout">
        {/* Left Side: Cart Items */}
        <div className="cart-items-list">
          <div className="cart-header">
            <h4 className="cart-header-product">{t('cart_page.product')}</h4>
            <h4 className="cart-header-price">{t('cart_page.price')}</h4>
            <h4 className="cart-header-quantity">{t('cart_page.quantity')}</h4>
            <h4 className="cart-header-total">{t('cart_page.total')}</h4>
          </div>

          {cartItems.map((item) => {
            const name =
              (i18n.language === 'bn' ? item.title_bn : item.title_en) || 'Untitled';
            const price = getItemPrice(item);
            const imageUrl =
              item.images && item.images.length > 0
                ? item.images[0]
                : 'https://placehold.co/300x300?text=No+Image';
            const idKey = item.productId; // primary key from backend

            return (
              <div className="cart-item" key={idKey}>
                <div className="cart-item-product">
                  <img src={imageUrl} alt={name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <Link to={`/product/${item.slug}`} className="cart-item-name">
                      {name}
                    </Link>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(idKey)}
                    >
                      <FaTrash /> {t('cart_page.remove')}
                    </button>

                    {item.selectedSize && (
                      <p className="cart-item-option">Size: {item.selectedSize}</p>
                    )}
                    {item.selectedColor && (
                      <p className="cart-item-option">Color: {item.selectedColor}</p>
                    )}
                  </div>
                </div>

                <div className="cart-item-price">৳ {price}</div>

                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleDecrease(item)}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleIncrease(item)}
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="cart-item-total">৳ {price * item.quantity}</div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Order Summary */}
        <div className="order-summary-container">
          <h3 className="summary-title">{t('cart_page.order_summary')}</h3>
          <div className="summary-row">
            <span>{t('cart_page.subtotal')}</span>
            <span className="summary-value">৳ {cartSubtotal}</span>
          </div>

          <div className="delivery-options">
            <h4 className="delivery-title">{t('cart_page.delivery_title')}</h4>

            {/* Delivery Option Inside Dhaka */}
            <label className="delivery-option">
              <input
                type="radio"
                name="shipping"
                value="inside_dhaka"
                checked={shippingOption === 'inside_dhaka'}
                onChange={(e) => setShipping(e.target.value)}
              />
              <span className="delivery-option-label">
                {t('cart_page.delivery_inside_dhaka')}
              </span>
              <span className="delivery-option-price">৳ 70</span>
            </label>

            {/* Delivery Option Dhaka Sub Area */}
            <label className="delivery-option">
              <input
                type="radio"
                name="shipping"
                value="dhaka_subarea"
                checked={shippingOption === 'dhaka_subarea'}
                onChange={(e) => setShipping(e.target.value)}
              />
              <span className="delivery-option-label">
                {t('cart_page.delivery_dhaka_subarea')}
              </span>
              <span className="delivery-option-price">৳ 110</span>
            </label>

            {/* Delivery Option Outside Dhaka */}
            <label className="delivery-option">
              <input
                type="radio"
                name="shipping"
                value="outside_dhaka"
                checked={shippingOption === 'outside_dhaka'}
                onChange={(e) => setShipping(e.target.value)}
              />
              <span className="delivery-option-label">
                {t('cart_page.delivery_outside_dhaka')}
              </span>
              <span className="delivery-option-price">৳ 130</span>
            </label>
          </div>

          <div className="summary-row">
            <span>{t('cart_page.shipping_fee')}</span>
            <span className="summary-value">৳ {shippingCost}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total-row">
            <span>{t('cart_page.grand_total')}</span>
            <span className="summary-value total-value">৳ {grandTotal}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
          >
            {t('cart_page.checkout_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
