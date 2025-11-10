/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getCategories } from '../../../api/publicApi';
import { FaTimes, FaChevronDown, FaChevronRight, FaStore } from 'react-icons/fa';
import './CategoryDrawer.css';
// --- THIS IS THE FIX ---
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
// --- END OF FIX ---

const CategoryDrawer = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openParent, setOpenParent] = useState(null); // Accordion state

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          setLoading(true);
          const response = await getCategories();
          const catList = response.data?.categories || response.data || response || [];
          setCategories(catList);
        } catch (error) {
          console.error("Failed to fetch categories for drawer", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const handleParentClick = (id) => {
    setOpenParent(openParent === id ? null : id); // Toggle accordion
  };

  const handleLinkClick = () => {
    onClose(); // Close drawer on any link click
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`category-drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
      />
      {/* Drawer Content */}
      <div className={`category-drawer-content ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>{t('bottom_nav.all_categories_title')}</h3>
          <button onClick={onClose} className="drawer-close-btn">
            <FaTimes />
          </button>
        </div>
        <div className="drawer-body">
          {loading ? (
            <LoadingSpinner /> // This will now work
          ) : (
            <ul className="drawer-category-list">
              {categories.map((cat) => {
                const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;
                
                return (
                  <li key={cat._id} className="drawer-category-item">
                    <div 
                      className="drawer-parent-link" 
                      onClick={hasSubcategories ? () => handleParentClick(cat._id) : handleLinkClick}
                    >
                      <Link 
                        to={`/products?category=${cat.slug}`} 
                        onClick={hasSubcategories ? (e) => e.preventDefault() : handleLinkClick}
                      >
                        <FaStore />
                        <span>{i18n.language === 'bn' ? cat.title_bn : cat.title_en}</span>
                      </Link>
                      {hasSubcategories && (
                        <span className="drawer-accordion-icon">
                          {openParent === cat._id ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                      )}
                    </div>
                    
                    {hasSubcategories && (
                      <ul className={`drawer-subcategory-list ${openParent === cat._id ? 'open' : ''}`}>
                        {cat.subcategories.map((sub) => (
                          <li key={sub._id}>
                            <Link to={`/products?subcategory=${sub.slug}`} onClick={handleLinkClick}>
                              {i18n.language === 'bn' ? sub.title_bn : sub.title_en}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryDrawer;