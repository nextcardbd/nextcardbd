/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useTranslation } from 'react-i18next';
import { getCategories } from '../../../api/publicApi';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './CategorySection.css';
import { FaStore } from 'react-icons/fa'; // Default icon

const CategorySection = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        
        console.log('Raw API response for /public/categories:', data);
        
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && (Array.isArray(data.data) || Array.isArray(data.categories))) {
          setCategories(data.data || data.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 3. Handle subcategory click (stops card click)
  const handleSubcategoryClick = (e, slug) => {
    e.stopPropagation(); // Stop the click from bubbling to the main card's Link
    e.preventDefault(); // Stop default link behavior (just in case)
    navigate(`/products?subcategory=${slug}`);
  };

  return (
    <section className="category-section">
      <h2 className="section-title">{t('homepage.categories_title')}</h2>
      
      {loading ? (
        <LoadingSpinner size="large" />
      ) : categories.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No categories found.</p>
      ) : (
        <div className="category-grid">
          {categories.filter(Boolean).map((category) => (
            <Link
              to={`/products?category=${category.slug}`}
              key={category._id}
              className="category-card-link"
            >
              <div className="category-card">
                <div className="category-icon">
                  {/* TODO: Use category.icon if available */}
                  <FaStore />
                </div>
                
                <h3 className="category-name">
                  {(i18n.language === 'bn'
                    ? category.title_bn
                    : category.title_en) || 'Unnamed Category'}
                </h3>
                
                {/* 4. NEW Subcategory List (replaces badges) */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <ul className="subcategory-list-new">
                    {category.subcategories.slice(0, 4).map((sub) => ( // Show max 4
                      <li key={sub._id}>
                        <a 
                          href={`/products?subcategory=${sub.slug}`}
                          onClick={(e) => handleSubcategoryClick(e, sub.slug)}
                        >
                          {(i18n.language === 'bn' ? sub.title_bn : sub.title_en)}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;