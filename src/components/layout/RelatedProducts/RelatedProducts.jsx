/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProducts } from '../../../api/publicApi';
import ProductCard from '../../common/ProductCard/ProductCard';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './RelatedProducts.css';

const RelatedProducts = ({ category, currentProductId }) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const fetchRelated = async () => {
      try {
        setLoading(true);
        // Fetch products by the same category
        const data = await getProducts(`?category=${category}`);
        
        let productList = [];
        if (data && data.data && Array.isArray(data.data.products)) {
          productList = data.data.products;
        } else if (Array.isArray(data)) {
          productList = data;
        }

        // Filter out the *current* product from the related list
        const related = productList.filter(
          (p) => p.productId !== currentProductId && p._id !== currentProductId
        );
        
        setProducts(related);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [category, currentProductId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return null; // Don't show the section if no related products
  }

  return (
    <div className="related-products-section">
      <h2 className="section-title">{t('product.related_products')}</h2>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={24}
        slidesPerView={4}
        breakpoints={{
          320: { slidesPerView: 1.5, spaceBetween: 16 },
          480: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="related-products-slider"
      >
        {products.map((product) => (
          <SwiperSlide key={product.productId || product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RelatedProducts;