/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../api/publicApi';
import { createProduct } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './AdminAddProduct.css';

// Helper to generate slug
const generateSlug = (text) => {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

const AdminAddProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Categories & Subcategories state
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  // Main form state
  const [formData, setFormData] = useState({
    productId: '',
    title_en: '',
    title_bn: '',
    slug: '',
    buyPrice: '',
    price: '',
    salePrice: '',
    stock: 99,
    category: '', // --- FIX: This will now hold the SLUG ---
    subcategory: '', // --- FIX: This will now hold the SLUG ---
    images: '',
    color: '',
    size: '',
    description_en: '',
    description_bn: '',
  });

  // Load categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await getCategories();
        const catList = response.data || response || [];
        setCategories(catList);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCats();
  }, []);

  // Update slug and subcategory list
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'title_en') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
    
    // When Parent Category changes...
    if (name === 'category') {
      // Find the selected category object
      const selectedCat = categories.find(cat => cat.slug === value);
      setSubcategories(selectedCat ? selectedCat.subcategories : []);
      setFormData(prev => ({ ...prev, subcategory: '' })); // Reset subcat
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare data for API based on your DB Schema
    const productData = {
      productId: formData.productId,
      title_en: formData.title_en,
      title_bn: formData.title_bn,
      slug: formData.slug,
      buyPrice: Number(formData.buyPrice),
      price: Number(formData.price),
      salePrice: Number(formData.salePrice) || null,
      stock: Number(formData.stock),
      category: formData.category, // Send Parent Category SLUG
      subcategory: formData.subcategory, // Send Subcategory SLUG
      images: formData.images.split(',').map(img => img.trim()).filter(img => img),
      color: formData.color.split(',').map(c => c.trim()).filter(c => c),
      size: formData.size.split(',').map(s => s.trim()).filter(s => s),
      description_en: formData.description_en,
      description_bn: formData.description_bn,
    };
    
    try {
      await createProduct(productData);
      alert('Product created successfully!');
      navigate('/admin/dashboard/products');
    } catch (err) {
      console.error('Failed to create product:', err);
      if (err.errors && Array.isArray(err.errors)) {
          const validationMessage = err.errors.map(e => e.field + ': ' + e.message).join(' | ');
          setError(validationMessage);
      } else {
          setError(err.message || 'Could not create product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-product-container">
      <h1 className="admin-page-title">{t('admin_page.add_product_title')}</h1>
      
      <form className="admin-form-card" onSubmit={handleSubmit}>
        <div className="form-grid-2-col">
          {/* Column 1 */}
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="productId">{t('admin_page.product_id_label')}</label>
              <input id="productId" name="productId" value={formData.productId} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="title_en">{t('admin_page.product_name')} (EN)</label>
              <input id="title_en" name="title_en" value={formData.title_en} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="title_bn">{t('admin_page.product_name')} (BN)</label>
              <input id="title_bn" name="title_bn" value={formData.title_bn} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="slug">{t('admin_page.category_slug')}</label>
              <input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} required />
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="buyPrice">{t('admin_page.buy_price')}</label>
                <input id="buyPrice" name="buyPrice" type="number" value={formData.buyPrice} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="price">{t('admin_page.sell_price')}</label>
                <input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="salePrice">{t('admin_page.sale_price')}</label>
                <input id="salePrice" name="salePrice" type="number" value={formData.salePrice} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="stock">{t('admin_page.stock_label')}</label>
                <input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} required />
              </div>
            </div>
          </div>
          
          {/* Column 2 */}
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="category">{t('admin_page.parent_category')}</label>
              {/* --- FIX: value is now cat.slug --- */}
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="">{t('admin_page.select_parent')}</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.slug}>{cat.title_en}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="subcategory">{t('admin_page.nav_subcategories')}</label>
              {/* --- FIX: value is now sub.slug --- */}
              <select id="subcategory" name="subcategory" value={formData.subcategory} onChange={handleInputChange} required disabled={subcategories.length === 0}>
                <option value="">{t('admin_page.select_subcategory')}</option>
                {subcategories.map(sub => (
                  <option key={sub._id} value={sub.slug}>{sub.title_en}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="color">Color (Comma separated)</label>
              <input id="color" name="color" value={formData.color} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="size">Size (Comma separated)</label>
              <input id="size" name="size" value={formData.size} onChange={handleInputChange} />
            </div>
          </div>
        </div>
        
        {/* Full Width Fields */}
        <div className="form-group">
          <label htmlFor="images">{t('admin_page.images_label')}</label>
          <textarea id="images" name="images" rows="3" value={formData.images} onChange={handleInputChange} placeholder={t('admin_page.images_placeholder')} />
        </div>
        <div className="form-group">
          <label htmlFor="description_en">{t('admin_page.desc_en')}</label>
          <textarea id="description_en" name="description_en" rows="5" value={formData.description_en} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description_bn">{t('admin_page.desc_bn')}</label>
          <textarea id="description_bn" name="description_bn" rows="5" value={formData.description_bn} onChange={handleInputChange} />
        </div>
        
        {error && <p className="admin-error-message" style={{textAlign: 'left'}}>{error}</p>}

        <button type="submit" className="add-new-btn" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : t('admin_page.create_button')}
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;