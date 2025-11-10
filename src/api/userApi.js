/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import apiService from './apiService';

/**
 * Places a new order.
 * API: POST /user/orders
 */
export const placeOrder = (orderData) => {
  return apiService.post('/user/orders', orderData);
};

/**
 * Fetches the logged-in user's order history.
 * API: GET /user/orders
 */
export const getOrderHistory = () => {
  // --- THIS IS THE FIX --- 
  return apiService.get('/user/orders', {
    headers: {
      // এই হেডারগুলো ব্রাউজার এবং প্রক্সি ক্যাশে বাইপাস করতে বাধ্য করবে 
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
  // --- FIX ENDS HERE ---
};

/**
 * --- NEW FUNCTION ---
 * Fetches details for a single order.
 * API: GET /user/orders/:id
 * (Note: We use order._id, NOT order.orderId)
 */
export const getSingleOrder = (orderMongoId) => {
  // এই ফাংশনে ক্যাশ কন্ট্রোল দেওয়ার দরকার নেই, কারণ এটি এমনিতেই নতুন ডেটা আনে
  return apiService.get(`/user/orders/${orderMongoId}`);
};


/**
 * Fetches the logged-in user's profile.
 * API: GET /user/profile
 */
export const getProfile = () => {
  return apiService.get('/user/profile');
};

/**
 * Updates the logged-in user's profile.
 * API: PUT /user/profile
 */
export const updateProfile = (profileData) => {
  return apiService.put('/user/profile', profileData);
};