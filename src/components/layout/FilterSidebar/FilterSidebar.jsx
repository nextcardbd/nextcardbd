/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCategories } from '../../../api/publicApi';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import './FilterSidebar.css';

const FilterSidebar = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState({}); // To track accordions
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (data && (Array.isArray(data.data) || Array.isArray(data.categories))) {
          setCategories(data.data || data.categories);
        } else if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <aside className="filter-sidebar">
      <h3 className="filter-title">{t('plp.filters_title')}</h3>
      <div className="filter-group">
        <h4 className="filter-group-title">{t('plp.all_categories')}</h4>
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <ul className="category-filter-list">
            {categories.map((category) => (
              <li key={category._id} className="category-filter-item">
                <div 
                  className="category-parent-link"
                  onClick={() => toggleCategory(category._id)}
                >
                  <NavLink to={`/products?category=${category.slug}`}>
                    {(i18n.language === 'bn' ? category.title_bn : category.title_en)}
                  </NavLink>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <span className="accordion-icon">
                      {openCategories[category._id] ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                  )}
                </div>
                
                {/* Subcategory List (Accordion) */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <ul className={`subcategory-filter-list ${openCategories[category._id] ? 'open' : ''}`}>
                    {category.subcategories.map((sub) => (
                      <li key={sub._id}>
                        <NavLink to={`/products?subcategory=${sub.slug}`}>
                          {(i18n.language === 'bn' ? sub.title_bn : sub.title_en)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* TODO: Add Price Range Filter here */}
    </aside>
  );
};

export default FilterSidebar;