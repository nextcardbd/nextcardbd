/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCategories } from '../../../api/publicApi';
import { FaChevronDown } from 'react-icons/fa';
import './CategoryBar.css';

const CategoryBar = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && (Array.isArray(data.data) || Array.isArray(data.categories))) {
          setCategories(data.data || data.categories);
        }
      } catch (error) { // <-- THIS WAS THE FIX (Removed the underscore)
        console.error('Failed to fetch categories for menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="category-bar-loading">Loading Categories...</div>;
  }
  
  if (categories.length === 0) {
    return null; // Don't show the bar if no categories
  }

  return (
    <nav className="category-bar">
      <ul className="category-menu-list">
        {categories.map((category) => (
          <li className="category-menu-item" key={category._id}>
            <Link to={`/products?category=${category.slug}`}>
              {(i18n.language === 'bn' ? category.title_bn : category.title_en)}
              {/* Show dropdown arrow only if subcategories exist */}
              {category.subcategories && category.subcategories.length > 0 && (
                <FaChevronDown className="dropdown-icon" />
              )}
            </Link>
            
            {/* Desktop Pop-up Mega Menu (as per your plan) */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="mega-menu-popup">
                <ul className="subcategory-popup-list">
                  {category.subcategories.map((sub) => (
                    <li key={sub._id}>
                      <Link to={`/products?subcategory=${sub.slug}`}>
                        {(i18n.language === 'bn' ? sub.title_bn : sub.title_en)}
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* We can add a "Picture Icon" here later */}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryBar;