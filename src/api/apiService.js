/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import axios from 'axios';

const getToken = (key) => localStorage.getItem(key);

const apiService = axios.create({
  baseURL: 'https://nextcardbd.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiService.interceptors.request.use(
  (config) => {
    const { url, method } = config;
    
    // Check if it's a user route
    if (url.startsWith('/user')) {
      const userToken = getToken('userToken');
      if (userToken) {
        config.headers['Authorization'] = `Bearer ${userToken}`;
      }
    }
    
    // Check if it's an admin route
    if (url.startsWith('/admin')) {
      const adminToken = getToken('adminToken') || getToken('userToken');
      const adminSecretKey = getToken('adminSecretKey');

      if (adminToken) {
        config.headers['Authorization'] = `Bearer ${adminToken}`;
      }
      if (adminSecretKey) {
        config.headers['x-nextcardbd-admin'] = adminSecretKey;
      }
    }

    // --- THIS IS THE FIX ---
    // For GET requests, add cache-busting headers
    if (method === 'get') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
    }
    // --- END OF FIX ---
    
    return config;
  },
  (error) => {
    console.error('API Request Setup Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor (to pass the real error message)
apiService.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      return Promise.reject(error.response.data); 
    } 
    else if (error.request) {
      console.error('API Network Error (No Response):', error.request);
      return Promise.reject({ message: 'Network Error: Cannot connect to the server.' });
    } 
    else {
      console.error('API Client Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default apiService;