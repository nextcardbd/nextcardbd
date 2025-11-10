/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// 1. Import deleteProduct API
import { getAllAdminProducts, deleteProduct } from '../../api/adminApi'; 
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './AdminProductManagement.css'; 

// ... (formatCurrency function) ...
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '৳ 0';
    return '৳ ' + new Intl.NumberFormat('en-IN').format(amount);
};


const AdminProductManagement = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllAdminProducts(); 
      const productList = response.data?.products || response.data || response || [];
      setProducts(productList);
    } catch (err) {
      setError('Failed to load products. Please check API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const handleAddNew = () => {
    navigate('/admin/dashboard/products/new');
  };

  // 2. --- UPDATED: Edit Function ---
  const handleEdit = (slug) => {
    // Navigate to the edit page using the product's slug
    navigate(`/admin/dashboard/products/edit/${slug}`);
  };
  
  // 3. --- UPDATED: Delete Function ---
  const handleDelete = async (mongoId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProduct(mongoId);
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh the product list
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }
  
  return (
    <div className="admin-product-management-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{t('admin_page.nav_products')}</h1>
        <button className="add-new-btn" onClick={handleAddNew}>
          <FaPlus /> Add New Product
        </button>
      </div>
      
      {error && <p className="admin-error-message">{error}</p>}
      
      {products.length === 0 ? (
        <p>No products found in the database.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-data-table">
            <thead>
              {/* ... (table headers) ... */}
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productId || product._id}>
                  <td data-label="Image">
                    <img 
                      src={product.images[0]} 
                      alt={product.title_en} 
                      className="table-product-image" 
                    />
                  </td>
                  <td data-label={t('admin_page.product_name')}>
                    {i18n.language === 'bn' ? product.title_bn : product.title_en}
                  </td>
                  <td data-label="Category">
                    {product.category && typeof product.category === 'object'
                      ? (i18n.language === 'bn' ? product.category.title_bn : product.category.title_en)
                      : product.category}
                  </td>
                  <td data-label={t('admin_page.product_price')}>
                    {formatCurrency(product.salePrice || product.price)}
                  </td>
                  <td data-label="Stock">{product.stock || 0}</td>
                  <td data-label={t('admin_page.status')}>
                    <span className={`status-badge ${product.status === 'active' ? 'status-delivered' : 'status-cancelled'}`}>
                      {product.status}
                    </span>
                  </td>
                  {/* 4. --- UPDATED: Button onClick Handlers --- */}
                  <td data-label={t('admin_page.action')} className="action-cell">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(product.slug)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(product._id, product.title_en)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;