/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import apiService from './apiService';

// ===============================================
// Dashboard & Analytics
// ===============================================

/**
 * Fetches dashboard summary data
 * API: GET /admin/analytics/summary
 */
export const getDashboardSummary = () => {
  return apiService.get('/admin/analytics/summary');
};

// ===============================================
// Order Management
// ===============================================

/**
 * Fetches all orders for the Order Management table
 * API: GET /admin/orders
 */
export const getAllOrders = () => {
  return apiService.get('/admin/orders');
};

/**
 * Verifies a payment for a specific order.
 * API: PATCH /admin/orders/:id/verify
 */
export const verifyOrderPayment = (orderId) => {
  return apiService.patch(`/admin/orders/${orderId}/verify`, {});
};

/**
 * Updates the shipping status of an order.
 * API: PATCH /admin/orders/:id/shipping
 */
export const updateShippingStatus = (orderId, statusUpdate) => {
  return apiService.patch(`/admin/orders/${orderId}/shipping`, statusUpdate);
};

// ===============================================
// Product Management
// ===============================================

/**
 * Fetches ALL products for the admin panel.
 * API: GET /admin/products/all
 */
export const getAllAdminProducts = () => {
  return apiService.get('/admin/products/all');
};

/**
 * Creates a new product.
 * API: POST /admin/products
 */
export const createProduct = (productData) => {
  return apiService.post('/admin/products', productData);
};

/**
 * Fetches a single product for editing.
 * API: GET /public/products/:slug
 */
export const getProductBySlugForAdmin = (slug) => {
  return apiService.get(`/public/products/${slug}`);
};

/**
 * Updates an existing product.
 * API: PUT /admin/products/:id
 */
export const updateProduct = (mongoId, productData) => {
  return apiService.put(`/admin/products/${mongoId}`, productData);
};

/**
 * Deletes a product (Soft Delete).
 * API: DELETE /admin/products/:id
 */
export const deleteProduct = (mongoId) => {
  return apiService.delete(`/admin/products/${mongoId}`);
};

// ===============================================
// Category Management
// ===============================================

/**
 * Creates a new main category.
 * API: POST /admin/categories
 */
export const createCategory = (categoryData) => {
  return apiService.post('/admin/categories', categoryData);
};

/**
 * Creates a new subcategory.
 * API: POST /admin/subcategories
 */
export const createSubcategory = (subcategoryData) => {
  return apiService.post('/admin/subcategories', subcategoryData);
};

/**
 * Deletes a main category.
 * API: DELETE /admin/categories/:id
 */
export const deleteCategory = (categoryId) => {
  return apiService.delete(`/admin/categories/${categoryId}`);
};

/**
 * Deletes a subcategory.
 * API: DELETE /admin/subcategories/:id
 */
export const deleteSubcategory = (subcategoryId) => {
  return apiService.delete(`/admin/subcategories/${subcategoryId}`);
};

// ===============================================
// User Management
// ===============================================

/**
 * Fetches all registered users.
 * API: GET /admin/users
 */
export const getAllUsers = () => {
  return apiService.get('/admin/users');
};

// ===============================================
// Settings Management
// ===============================================

/**
 * --- NEW FUNCTION ---
 * Fetches the current payment settings.
 * (We reuse the public API, as it has the same info)
 * API: GET /public/payment-info
 */
export const getPaymentSettings = () => {
  return apiService.get('/public/payment-info');
};

/**
 * --- NEW FUNCTION ---
 * Updates the payment settings.
 * (Assuming the endpoint is PUT /admin/payment-info)
 * API: PUT /admin/payment-info
 */
export const updatePaymentSettings = (settingsData) => {
  // We assume your backend has a route like this
  return apiService.put('/admin/payment-info', settingsData);
};