/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
// 1. Import useSearchParams
import { useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FilterSidebar from '../../components/layout/FilterSidebar/FilterSidebar';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { getProducts } from '../../api/publicApi';
import './ProductListingPage.css';

const ProductListingPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchQuery = location.search;
  
  // 2. Read search param from URL
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(searchQuery); 
        
        console.log(`Raw API response for /public/products${searchQuery}:`, data);
        
        let productList = [];
        if (data && data.data && Array.isArray(data.data.products)) {
          productList = data.data.products;
        } else if (Array.isArray(data)) {
          productList = data;
        } else {
          console.warn('Data is not in an expected array format.');
        }
        setProducts(productList);

      } catch (error) {
        console.error('Failed to fetch filtered products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery]);

  return (
    <div className="product-listing-layout">
      {/* Left Column: Sticky Sidebar */}
      <FilterSidebar />
      
      {/* Right Column: Product Grid */}
      <div className="product-grid-container">
        
        {/* 3. NEW: Show search title if searchTerm exists */}
        {searchTerm && (
          <h2 className="search-results-title">
            {t('plp.search_results_for')}
            <span className="search-term">"{searchTerm}"</span>
          </h2>
        )}
        
        {loading ? (
          <LoadingSpinner size="large" />
        ) : products.length === 0 ? (
          <p className="no-products-found">{t('plp.no_products_found')}</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.productId || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;