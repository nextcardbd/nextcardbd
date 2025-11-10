/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCategories } from '../../api/publicApi';
import { createCategory, createSubcategory, deleteCategory, deleteSubcategory } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { FaTrash } from 'react-icons/fa';
import './AdminCategoryManagement.css'; 

// Helper to generate slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

const AdminCategoryManagement = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FIX: Added categoryId to state ---
  const [catForm, setCatForm] = useState({ 
    title_en: '', 
    title_bn: '', 
    slug: '', 
    icon: '',
    categoryId: '' // As requested
  });
  const [subCatForm, setSubCatForm] = useState({ 
    title_en: '', 
    title_bn: '', 
    slug: '', 
    parent: '' 
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      const catList = response.data || response || [];
      setCategories(catList);
    } catch (err) {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Form Handlers ---
  const handleCatChange = (e) => {
    const { name, value } = e.target;
    setCatForm(prev => ({ ...prev, [name]: value }));
    if (name === 'title_en') {
      setCatForm(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleSubCatChange = (e) => {
    const { name, value } = e.target;
    setSubCatForm(prev => ({ ...prev, [name]: value }));
    if (name === 'title_en') {
      setSubCatForm(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await createCategory(catForm); // Send the whole form state
      alert('Category created successfully!');
      fetchCategories(); 
      setCatForm({ title_en: '', title_bn: '', slug: '', icon: '', categoryId: '' }); // Reset form
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    if (!subCatForm.parent) {
      alert('Please select a parent category.');
      return;
    }
    
    // --- THIS IS THE FIX ---
    // Create the data object the backend expects
    const subcategoryData = {
      title_en: subCatForm.title_en,
      title_bn: subCatForm.title_bn,
      slug: subCatForm.slug,
      category: subCatForm.parent // Renamed 'parent' to 'category'
    };
    // --- END OF FIX ---
    
    try {
      await createSubcategory(subcategoryData); // Send the correct object
      alert('Subcategory created successfully!');
      fetchCategories(); 
      setSubCatForm({ title_en: '', title_bn: '', slug: '', parent: '' });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  
  const handleDelete = async (type, id) => {
    const name = (type === 'category' ? 'Category' : 'Subcategory');
    if (window.confirm(`Are you sure you want to delete this ${name}? This action cannot be undone.`)) {
        try {
            if (type === 'category') {
                await deleteCategory(id);
            } else {
                await deleteSubcategory(id);
            }
            alert(`${name} deleted successfully!`);
            fetchCategories();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    }
  };

  return (
    <div className="admin-category-container">
      <h1 className="admin-page-title">{t('admin_page.category_title')}</h1>
      
      <div className="category-form-grid">
        {/* Add Category Form */}
        <form className="admin-form-card" onSubmit={handleCreateCategory}>
          <h3>{t('admin_page.add_category_title')}</h3>
          
          {/* --- NEW FIELD ADDED --- */}
          <div className="form-group">
            <label htmlFor="cat_categoryId">{t('admin_page.category_id_label')}</label>
            <input id="cat_categoryId" name="categoryId" value={catForm.categoryId} onChange={handleCatChange} required />
          </div>
          {/* --- END OF NEW FIELD --- */}
          
          <div className="form-group">
            <label htmlFor="cat_title_en">{t('admin_page.category_name_en')}</label>
            <input id="cat_title_en" name="title_en" value={catForm.title_en} onChange={handleCatChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="cat_title_bn">{t('admin_page.category_name_bn')}</label>
            <input id="cat_title_bn" name="title_bn" value={catForm.title_bn} onChange={handleCatChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="cat_icon">{t('admin_page.category_icon')}</label>
            <input id="cat_icon" name="icon" value={catForm.icon} onChange={handleCatChange} />
          </div>
          <div className="form-group">
            <label htmlFor="cat_slug">{t('admin_page.category_slug')}</label>
            <input id="cat_slug" name="slug" value={catForm.slug} onChange={handleCatChange} required />
          </div>
          <button type="submit" className="add-new-btn">{t('admin_page.create_button')}</button>
        </form>
        
        {/* Add Subcategory Form */}
        <form className="admin-form-card" onSubmit={handleCreateSubcategory}>
          <h3>{t('admin_page.add_subcategory_title')}</h3>
          <div className="form-group">
            <label htmlFor="sub_parent">{t('admin_page.parent_category')}</label>
            <select id="sub_parent" name="parent" value={subCatForm.parent} onChange={handleSubCatChange} required>
              <option value="">{t('admin_page.select_parent')}</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.title_en}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="sub_title_en">{t('admin_page.category_name_en')}</label>
            <input id="sub_title_en" name="title_en" value={subCatForm.title_en} onChange={handleSubCatChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="sub_title_bn">{t('admin_page.category_name_bn')}</label>
            <input id="sub_title_bn" name="title_bn" value={subCatForm.title_bn} onChange={handleSubCatChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="sub_slug">{t('admin_page.category_slug')}</label>
            <input id="sub_slug" name="slug" value={subCatForm.slug} onChange={handleSubCatChange} required />
          </div>
          <button type="submit" className="add-new-btn">{t('admin_page.create_button')}</button>
        </form>
      </div>

      {/* --- Category List --- */}
      <div className="category-list-container">
        <h3 className="admin-section-title">{t('admin_page.all_categories_list')}</h3>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="categories-list">
            {categories.map(cat => (
              <div key={cat._id} className="category-list-item">
                <div className="category-item-header">
                  <h4>{cat.title_en} / {cat.title_bn} (ID: {cat.categoryId || 'N/A'})</h4>
                  <button className="delete-btn" onClick={() => handleDelete('category', cat._id)}>
                    <FaTrash />
                  </button>
                </div>
                <ul className="subcategory-list-display">
                  {cat.subcategories.map(sub => (
                    <li key={sub._id}>
                      <span>{sub.title_en} / {sub.title_bn}</span>
                      <button className="delete-btn sub" onClick={() => handleDelete('subcategory', sub._id)}>
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryManagement;