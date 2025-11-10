/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React from 'react';
import { useTranslation } from 'react-i18next';
// 1. Import Routes, Route, and useLocation
import { NavLink, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { FaUser, FaBoxOpen, FaSignOutAlt } from 'react-icons/fa';
import './DashboardPage.css';

// 2. Import the content pages
import Profile from './Profile';
import OrderHistory from './OrderHistory';
import OrderDetailsPage from './OrderDetailsPage'; // Import OrderDetailsPage

const DashboardPage = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">{t('dashboard_page.title')}</h1>
      
      <div className="dashboard-layout">
        {/* Left: Sidebar Navigation */}
        <nav className="dashboard-nav">
          <ul>
            <li>
              {/* 'end' prop ensures this only matches /dashboard */}
              <NavLink to="/dashboard" end>
                <FaUser /> {t('dashboard_page.nav_profile')}
              </NavLink>
            </li>
            <li>
              {/* This link now matches /dashboard/orders */}
              <NavLink to="/dashboard/orders">
                <FaBoxOpen /> {t('dashboard_page.nav_orders')}
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout}>
                <FaSignOutAlt /> {t('dashboard_page.nav_logout')}
              </button>
            </li>
          </ul>
        </nav>
        
        {/* 3. --- THIS IS THE FIX --- */}
        {/* Right: Content Area with Nested Routes */}
        <main className="dashboard-content">
          <Routes>
            {/* Route for /dashboard */}
            <Route path="/" element={<Profile />} /> 
            {/* Route for /dashboard/orders */}
            <Route path="orders" element={<OrderHistory />} /> 
            {/* Route for /dashboard/orders/:id */}
            <Route path="orders/:id" element={<OrderDetailsPage />} /> 
          </Routes>
        </main>
        {/* --- END OF FIX --- */}
      </div>
    </div>
  );
};

export default DashboardPage;