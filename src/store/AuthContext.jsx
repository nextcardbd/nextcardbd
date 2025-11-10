/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/authApi';
import { getProfile } from '../api/userApi'; // 1. Import getProfile
// apiService import is not needed

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem('userToken')
  );
  // 2. Add loading state for profile fetch
  const [authLoading, setAuthLoading] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 3. This effect ONLY saves/removes the token from localStorage.
  useEffect(() => {
    if (token) {
      localStorage.setItem('userToken', token);
    } else {
      localStorage.removeItem('userToken');
    }
  }, [token]);

  // 4. --- NEW EFFECT ---
  // Fetch user profile if token exists on page load
  useEffect(() => {
    const fetchUserOnLoad = async () => {
      if (token) {
        try {
          // apiService interceptor will automatically add the token
          const data = await getProfile(); 
          setUser(data.data || data); // Set user from profile
        } catch (err) {
          console.error("Failed to fetch profile on load (token might be invalid):", err);
          setToken(null); // Token is invalid, log them out
        }
      }
      setAuthLoading(false); // Done loading auth status
    };
    
    fetchUserOnLoad();
  }, [token]); // Run this only when token changes

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginUser({ email, password });
      
      if (data.data && data.data.token && data.data.user) {
        setToken(data.data.token);
        setUser(data.data.user);
        return true; 
      } else {
        setError('Login failed: Invalid server response.');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Failed to login.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
      try {
      setLoading(true);
      setError(null);
      await registerUser({ username, email, password });
      return true;
    } catch (err) {
      if (err.errors) {
        const validationMessage = err.errors.map(e => e.message).join(' ');
        setError(validationMessage);
      } else {
        setError(err.message || 'Failed to register.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading, // For login/register forms
    authLoading, // For checking auth on page load
    error,
    login,
    register,
    logout,
  };

  // 5. Don't render children until auth status is confirmed
  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
};