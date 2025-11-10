// © Mahin LTD Developer Tanvir
// Your Role with Me:
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getProducts } from '../../../api/publicApi';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ProductCard from '../../common/ProductCard/ProductCard';
import './TopSelling.css';

const TopSelling = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---- TikTok helpers ----
  const getContentId = useCallback((p) => {
    // try common keys safely
    return (
      p?.slug ||
      p?.productSlug ||
      p?.productId ||
      p?._id ||
      p?.sku ||
      // last fallback: sanitized name
      (p?.name ? String(p.name).toLowerCase().replace(/\s+/g, '-').slice(0, 80) : undefined)
    );
  }, []);

  const trackViewCategory = useCallback((items) => {
    try {
      if (!window.ttq || !Array.isArray(items) || items.length === 0) return;
      const contents = items
        .map((p) => {
          const id = getContentId(p);
          return id ? { content_id: String(id), content_type: 'product' } : null;
        })
        .filter(Boolean)
        // cap to 20 to keep payload small
        .slice(0, 20);

      if (!contents.length) return;

      window.ttq.track('ViewCategory', {
        content_type: 'product_group',
        contents,
        currency: 'BDT',
        // optional value, you can sum prices if needed
      });
    } catch (_) {}
  }, [getContentId]);

  const trackViewContent = useCallback((product) => {
    try {
      if (!window.ttq) return;
      const id = getContentId(product);
      if (!id) return;

      window.ttq.track('ViewContent', {
        content_type: 'product',
        contents: [{ content_id: String(id) }],
        value: Number(product?.price || 0),
        currency: 'BDT',
      });
    } catch (_) {}
  }, [getContentId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();
        console.log('Raw API response for /public/products:', data);

        let productList = [];

        if (data && data.data && Array.isArray(data.data.products)) {
          // Case 1 (YOUR CASE): API returns { data: { products: [...] } }
          productList = data.data.products;
        } else if (Array.isArray(data)) {
          // Case 2: API returns [...]
          productList = data;
        } else if (data && Array.isArray(data.data)) {
          // Case 3: API returns { data: [...] }
          productList = data.data;
        } else if (data && Array.isArray(data.products)) {
          // Case 4: API returns { products: [...] }
          productList = data.products;
        } else {
          console.warn('Data is not in an expected array format.');
        }

        setProducts(productList);

        // 🔹 Fire ViewCategory once when list is loaded (browser event)
        if (productList && productList.length) {
          trackViewCategory(productList);
        }
      } catch (error) {
        console.error('Failed to fetch top selling products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [trackViewCategory]);

  // wrapper click handler so that a product click tracks ViewContent
  const handleCardClick = useCallback((product) => {
    // fire ViewContent with content_id (fixes "Content ID missing" warning)
    trackViewContent(product);
  }, [trackViewContent]);

  return (
    <section className="top-selling-section">
      <h2 className="section-title">{t('homepage.featured_products_title')}</h2>

      {loading ? (
        <LoadingSpinner size="large" />
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No products found.</p>
      ) : (
        <div className="top-selling-grid">
          {products.map((product) => {
            const key = product?.productId || product?._id || getContentId(product);
            return (
              <div
                key={key}
                onClick={() => handleCardClick(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' ? handleCardClick(product) : null)}
                style={{ outline: 'none' }}
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TopSelling;
