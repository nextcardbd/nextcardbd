/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';
import { useCart } from '../../../store/CartContext';

/**
 * Displays a single product card based on MongoDB Schema
 * @param {object} props
 * @param {object} props.product - The product object to display.
 */
const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();

  // 1. Using 'title_en' / 'title_bn' as per your schema
  const name =
    (i18n.language === 'bn' ? product.title_bn : product.title_en) ||
    'Untitled Product';

  // 2. Using 'images[0]' as per your schema
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://placehold.co/300x300?text=No+Image';
      
  // 3. Using 'status' as per your schema
  const inStock = product.status === 'active';

  // 4. Using price fields as per your schema
  const hasSale = product.salePrice && product.salePrice < product.price;
  const displayPrice = hasSale ? product.salePrice : product.price;
  const oldPrice = hasSale ? product.price : null;
  
  // 5. Using 'slug' as per your schema
  const slug = product.slug || product.productId;

  return (
    <div className="product-card">
      <Link
        to={`/product/${slug}`}
        className="product-card-top-link"
      >
        <div className="product-image-container">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
          />
        </div>
        <h4 className="product-name">{name}</h4>
        <div className="product-price">
          <span className="current-price">৳ {displayPrice}</span>
          {oldPrice && (
            <span className="old-price">৳ {oldPrice}</span>
          )}
        </div>
      </Link>
      
      <button
        className="add-to-cart-btn"
        onClick={() => addToCart(product)}
        disabled={!inStock}
      >
        <FaShoppingCart /> 
        {inStock ? t('product.add_to_cart') : t('product.out_of_stock')}
      </button>
    </div>
  );
};

export default ProductCard;