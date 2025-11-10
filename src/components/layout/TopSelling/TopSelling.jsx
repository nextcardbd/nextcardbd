/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProducts } from '../../../api/publicApi';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ProductCard from '../../common/ProductCard/ProductCard';
import './TopSelling.css';

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
        
        // --- THIS IS THE FIX ---
        // Based on your log: { data: { products: [...] } }
        
        let productList = [];
        
        if (data && data.data && Array.isArray(data.data.products)) {
          // Case 1 (YOUR CASE): API returns { data: { products: [...] } }
          productList = data.data.products;
        } 
        else if (Array.isArray(data)) {
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
            <ProductCard key={product.productId || product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TopSelling;