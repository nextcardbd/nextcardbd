/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import apiService from './apiService';

/**
 * Fetches all public categories.
 * API: GET /public/categories
 */
export const getCategories = () => {
  return apiService.get('/public/categories');
};

/**
 * Fetches products. Can be filtered (e.g., ?category=...&search=...).
 * API: GET /public/products
 */
export const getProducts = (filterQuery = '') => {
  return apiService.get(`/public/products${filterQuery}`);
};

/**
 * Fetches a single product by its slug.
 * API: GET /public/products/:slug
 */
export const getProductBySlug = (slug) => {
  return apiService.get(`/public/products/${slug}`);
};

/**
 * --- UPDATED: NOW USES REAL API ---
 * Fetches manual payment info (Bkash, Nagad numbers, etc.)
 * API: GET /public/payment-info
 */
export const getPaymentInfo = () => {
  // Mock data removed, now calling live API
  return apiService.get('/public/payment-info');
};