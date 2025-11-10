/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import apiService from './apiService';

/**
 * Registers a new user.
 * API: POST /auth/register
 */
export const registerUser = (userData) => {
  return apiService.post('/auth/register', userData);
};

/**
 * Logs in a user.
 * API: POST /auth/login
 */
export const loginUser = (credentials) => {
  return apiService.post('/auth/login', credentials);
};

/**
 * --- NEW FUNCTION ---
 * Verifies the user's email using the token from the URL.
 * API: GET /auth/verify-email/:token
 */
export const verifyEmailToken = (token) => {
  return apiService.get(`/auth/verify-email/${token}`);
};