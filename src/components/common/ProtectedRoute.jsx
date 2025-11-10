/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

/**
 * A wrapper for routes that require authentication.
 * If the user is not authenticated, redirects them to the /login page.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location
    // they were trying to go to.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // If authenticated, render the child component
};

export default ProtectedRoute;