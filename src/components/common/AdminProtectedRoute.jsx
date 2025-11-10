/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Ensures user is authenticated AND has the necessary Admin Secret Key.
 */
const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();

  const adminToken = localStorage.getItem('adminToken');
  const adminSecretKey = localStorage.getItem('adminSecretKey');

  // Check 1: Is the user logged in as an Admin?
  if (!adminToken) {
    // If no token, send them to the main admin login page
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }
  
  // Check 2: Does the user have the Admin Secret Key?
  if (!adminSecretKey) {
     // If the key is missing (e.g., forgotten or manually deleted)
     localStorage.removeItem('adminToken'); // Clear bad token
     return <Navigate to="/admin" state={{ message: 'Secret Key Missing' }} replace />;
  }

  // If both checks pass, render the child component
  return children;
};

export default AdminProtectedRoute;