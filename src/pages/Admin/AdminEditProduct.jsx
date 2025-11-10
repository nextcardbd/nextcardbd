/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories } from '../../api/publicApi';
import { getProductBySlugForAdmin, updateProduct } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './AdminAddProduct.css'; // Re-using the same CSS as Add Product

const AdminEditProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { slug } = useParams(); // Get the slug from the URL
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  // Store the product's MongoDB _id
  const [mongoId, setMongoId] = useState(null); 
  
  const [formData, setFormData] = useState({
    productId: '',
    title_en: '',
    title_bn: '',
    slug: '',
    buyPrice: '',
    price: '',
    salePrice: '',
    stock: 0,
    category: '', // Will hold the category SLUG
    subcategory: '', // Will hold the subcategory SLUG
    images: '',
    color: '',
    size: '',
    description_en: '',
    description_bn: '',
  });

  // 1. Load all categories and the specific product
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        // Fetch all categories for the dropdown
        const catResponse = await getCategories();
        const catList = catResponse.data || catResponse || [];
        setCategories(catList);

        // Fetch the product to be edited
        const prodResponse = await getProductBySlugForAdmin(slug);
        const product = prodResponse.data || prodResponse;
        
        // Find the parent category object from the list
        const parentCat = catList.find(c => c.slug === product.category);
        
        // Populate the form
        setFormData({
          productId: product.productId || '',
          title_en: product.title_en || '',
          title_bn: product.title_bn || '',
          slug: product.slug || '',
          buyPrice: product.buyPrice || 0,
          price: product.price || 0,
          salePrice: product.salePrice || '',
          stock: product.stock || 0,
          category: product.category || '', // Set category slug
          subcategory: product.subcategory || '', // Set subcategory slug
          images: (product.images || []).join(', '), // Convert array to string
          color: (product.color || []).join(', '), // Convert array to string
          size: (product.size || []).join(', '), // Convert array to string
          description_en: product.description_en || '',
          description_bn: product.description_bn || '',
        });
        
        // Save the MongoDB _id for the PUT request
        setMongoId(product._id); 

        // Load the subcategory dropdown
        if (parentCat) {
          setSubcategories(parentCat.subcategories || []);
        }
        
      } catch (err) {
        setError('Failed to load product data.');
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'category') {
      const selectedCat = categories.find(cat => cat.slug === value);
      setSubcategories(selectedCat ? selectedCat.subcategories : []);
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = {
      ...formData,
      images: formData.images.split(',').map(img => img.trim()).filter(img => img),
      color: formData.color.split(',').map(c => c.trim()).filter(c => c),
      size: formData.size.split(',').map(s => s.trim()).filter(s => s),
      buyPrice: Number(formData.buyPrice),
      price: Number(formData.price),
      salePrice: Number(formData.salePrice) || null,
      stock: Number(formData.stock),
    };

    try {
      await updateProduct(mongoId, productData); // Use mongoId
      alert('Product updated successfully!');
      navigate('/admin/dashboard/products');
    } catch (err) {
      setError(err.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="admin-add-product-container">
      <h1 className="admin-page-title">Edit Product</h1>
      
      <form className="admin-form-card" onSubmit={handleSubmit}>
        {/* The form structure is identical to AdminAddProduct.jsx */}
        {/* ... (Copy the full <form> content from AdminAddProduct.jsx) ... */}
        {/* ... It will be pre-filled by the state ... */}

        {/* --- Form Grid --- */}
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
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="">{t('admin_page.select_parent')}</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.slug}>{cat.title_en}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="subcategory">{t('admin_page.nav_subcategories')}</label>
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
          {loading ? <LoadingSpinner size="small" /> : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminEditProduct;