// © Mahin LTD Developer Tanvir
// Your Role with Me:
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProductBySlug } from '../../api/publicApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import RelatedProducts from '../../components/layout/RelatedProducts/RelatedProducts';
import { FaShoppingCart, FaTruck, FaChevronDown } from 'react-icons/fa';
import './ProductDetailsPage.css';
import { useCart } from '../../store/CartContext';

// ⬇️ TikTok helpers
import { ttqViewProduct, ttqAddToCart } from '../../lib/ttqEvents';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isDeliveryInfoOpen, setIsDeliveryInfoOpen] = useState(false);

  // options
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const getDisplayPrice = (p) => {
    if (!p) return 0;
    const hasSale = p.salePrice && Number(p.salePrice) < Number(p.price);
    return Number(hasSale ? p.salePrice : p.price || 0);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setValidationError(null);

        const data = await getProductBySlug(slug);
        const prod = data?.data || data;
        setProduct(prod);
        setSelectedImage(0);
        setSelectedColor(null);
        setSelectedSize(null);

        // ⭐ TTQ: ViewContent (single product) once data is ready
        if (prod?.slug) {
          ttqViewProduct({
            slug: prod.slug,
            price: getDisplayPrice(prod),
            currency: 'BDT',
          });
        }
      } catch (err) {
        setError(err?.message || 'Failed to fetch product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <div className="product-error-message">Error: {error}</div>;
  if (!product) return <div className="product-error-message">Product not found.</div>;

  // UI data
  const name =
    (i18n.language === 'bn' ? product.title_bn : product.title_en) || 'Untitled';
  const description =
    (i18n.language === 'bn' ? product.description_bn : product.description_en) ||
    'No description available.';
  const images = product.images || [];
  const colors = product.color || [];
  const sizes = product.size || [];

  const hasSale = product.salePrice && product.salePrice < product.price;
  const displayPrice = getDisplayPrice(product);
  const oldPrice = hasSale ? product.price : null;
  const inStock = product.status === 'active';

  // ✅ Add to Cart with validation + TTQ AddToCart
  const handleAddToCart = () => {
    setValidationError(null);

    if (colors.length > 0 && !selectedColor) {
      setValidationError(t('product.validation_select_color'));
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      setValidationError(t('product.validation_select_size'));
      return;
    }

    // 1) Add to local cart with selected options
    addToCart({
      ...product,
      selectedColor: selectedColor || null,
      selectedSize: selectedSize || null,
    });

    // 2) ⭐ TTQ AddToCart (sends content_id, price, qty=1)
    const contentSlug =
      product.slug || product.productSlug || product._id || product.productId;
    if (contentSlug) {
      ttqAddToCart({
        slug: contentSlug,
        price: displayPrice,
        qty: 1,
        currency: 'BDT',
      });
    }
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setValidationError(null);
  };
  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setValidationError(null);
  };

  return (
    <div className="product-details-container">
      <div className="product-main-info">
        {/* Image Gallery */}
        <div className="product-image-gallery">
          <div className="main-image-container">
            <img
              src={images[selectedImage] || 'https://placehold.co/600x600?text=No+Image'}
              alt={name}
            />
          </div>
          {images.length > 1 && (
            <div className="thumbnail-list">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail-item ${index === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-content">
          <h1 className="product-title">{name}</h1>

          <div className="product-price-details">
            <span className="current-price-large">৳ {displayPrice}</span>
            {oldPrice && <span className="old-price-large">৳ {oldPrice}</span>}
          </div>

          <div className="product-availability">
            <span className="availability-label">{t('product.availability')}:</span>
            {inStock ? (
              <span className="stock-status in-stock">{t('product.in_stock')}</span>
            ) : (
              <span className="stock-status out-of-stock">{t('product.out_of_stock')}</span>
            )}
          </div>

          {/* Delivery Info */}
          <div className="delivery-info-dropdown">
            <button
              type="button"
              className="delivery-info-header"
              onClick={() => setIsDeliveryInfoOpen(!isDeliveryInfoOpen)}
            >
              <div className="delivery-info-title">
                <FaTruck />
                <span>{t('product.delivery_info.title')}</span>
              </div>
              <FaChevronDown className={`delivery-arrow ${isDeliveryInfoOpen ? 'open' : ''}`} />
            </button>

            {isDeliveryInfoOpen && (
              <div className="delivery-info-content">
                <table>
                  <thead>
                    <tr>
                      <th>{t('product.delivery_info.location')}</th>
                      <th>{t('product.delivery_info.time')}</th>
                      <th>{t('product.delivery_info.charge')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('product.delivery_info.inside_dhaka')}</td>
                      <td>{t('product.delivery_info.time_2_3_days')}</td>
                      <td>৳ 70</td>
                    </tr>
                    <tr>
                      <td>{t('product.delivery_info.dhaka_subarea')}</td>
                      <td>{t('product.delivery_info.time_2_3_days')}</td>
                      <td>৳ 110</td>
                    </tr>
                    <tr>
                      <td>{t('product.delivery_info.outside_dhaka')}</td>
                      <td>{t('product.delivery_info.time_3_5_days')}</td>
                      <td>৳ 130</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Color Options */}
          {colors.length > 0 && (
            <div className="product-options-group">
              <span className="option-label">Color:</span>
              <div className="options-list">
                {colors.map((color) => (
                  <span
                    key={color}
                    className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                    onClick={() => handleSelectColor(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {sizes.length > 0 && (
            <div className="product-options-group">
              <span className="option-label">Size:</span>
              <div className="options-list">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => handleSelectSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Validation Error */}
          {validationError && <p className="product-validation-error">{validationError}</p>}

          <button
            className="add-to-cart-btn-large"
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            <FaShoppingCart />
            {inStock ? t('product.add_to_cart') : t('product.out_of_stock')}
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="product-tabs-section">
        <div className="tab-headers">
          <button className="tab-btn active">{t('product.tab_description')}</button>
        </div>
        <div className="tab-content">
          <div className="tab-pane" style={{ whiteSpace: 'pre-wrap' }}>
            {description}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={product.category}
        currentProductId={product.productId || product._id}
      />
    </div>
  );
};

export default ProductDetailsPage;
