// © Mahin LTD Developer Tanvir
// Your Role with Me:  
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProducts } from '../../../api/publicApi';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ProductCard from '../../common/ProductCard/ProductCard';
import './TopSelling.css';

// ⬇️ TikTok helper: product_group ViewContent (listing/home)
import { ttqViewProductGroup } from '../../../lib/ttqEvents';

const TopSelling = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();
        console.log('Raw API response for /public/products:', data);

        // Normalize various API shapes to a product array
        let productList = [];
        if (data && data.data && Array.isArray(data.data.products)) {
          // Case 1: { data: { products: [...] } }
          productList = data.data.products;
        } else if (Array.isArray(data)) {
          // Case 2: [...]
          productList = data;
        } else if (data && Array.isArray(data.data)) {
          // Case 3: { data: [...] }
          productList = data.data;
        } else if (data && Array.isArray(data.products)) {
          // Case 4: { products: [...] }
          productList = data.products;
        } else {
          console.warn('Data is not in an expected array format.');
        }

        setProducts(productList);

        // ⭐ TikTok: send product_group “ViewContent” from listing/home
        // Try common slug keys: slug, seoSlug, handle, productSlug, _id
        const slugs = (productList || [])
          .map(p => p.slug || p.seoSlug || p.handle || p.productSlug || p._id)
          .filter(Boolean);

        if (slugs.length) {
          ttqViewProductGroup({ slugs }); // value=0, currency=BDT by default
        }

      } catch (error) {
        console.error('Failed to fetch top selling products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="top-selling-section">
      <h2 className="section-title">{t('homepage.featured_products_title')}</h2>

      {loading ? (
        <LoadingSpinner size="large" />
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No products found.</p>
      ) : (
        <div className="top-selling-grid">
          {products.map((product) => (
            <ProductCard key={product.productId || product._id || product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TopSelling;
