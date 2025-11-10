/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import apiService from './apiService';

/**
 * Registers a new user.
 * API: POST /auth/register
 * @param {object} userData - { username, email, password }
 */
export const registerUser = (userData) => {
  return apiService.post('/auth/register', userData);
};

/**
 * Logs in a user.
 * API: POST /auth/login
 * @param {object} credentials - { email, password }
 */
export const loginUser = (credentials) => {
  return apiService.post('/auth/login', credentials);
};