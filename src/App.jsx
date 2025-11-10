/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react'; // 1. Import useState
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';

// --- Import Layout Components ---
import Header from './components/layout/Header/Header';
import CategoryBar from './components/layout/CategoryBar/CategoryBar';
import AuthHeader from './components/layout/AuthHeader/AuthHeader';
import Footer from './components/layout/Footer/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav/MobileBottomNav';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';
import CategoryDrawer from './components/common/CategoryDrawer/CategoryDrawer'; // 2. Import Drawer

// --- Import Page Components ---
import HomePage from './pages/Public/HomePage';
import ProductListingPage from './pages/Public/ProductListingPage';
import ProductDetailsPage from './pages/Public/ProductDetailsPage';
import CartPage from './pages/Public/CartPage';
import CheckoutPage from './pages/Public/CheckoutPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import OrderSuccessPage from './pages/Public/OrderSuccessPage';
import UserDashboardPage from './pages/User/DashboardPage';

// --- Import Static Pages ---
import ContactPage from './pages/Public/ContactPage';
import FAQPage from './pages/Public/FAQPage';
import { ShippingPolicyPage, ReturnPolicyPage } from './pages/Public/PolicyPage';

// --- Import Admin Page Components ---
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminOrderManagement from './pages/Admin/AdminOrderManagement';
import AdminProductManagement from './pages/Admin/AdminProductManagement';
import AdminAddProduct from './pages/Admin/AdminAddProduct';
import AdminEditProduct from './pages/Admin/AdminEditProduct';
import AdminCategoryManagement from './pages/Admin/AdminCategoryManagement';

const AdminUserManagement = () => <h2>User Management (To be built)</h2>;
const AdminSettings = () => <h2>Settings (To be built)</h2>;
const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const PublicLayoutWrapper = () => {
  const location = useLocation();
  const { pathname } = location;
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <>
      {isAuthPage ? <AuthHeader /> : <Header />}
      {!isAuthPage && <CategoryBar />}
    </>
  );
};

function App() {
  const { i18n } = useTranslation();
  
  // 3. State for controlling the category drawer
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="app-container">
      <ScrollToTop />
      
      <Routes>
        {/* --- Public Routes (with Layout) --- */}
        <Route 
          element={
            <>
              <PublicLayoutWrapper />
              <main className="main-content"><Outlet /></main>
              <Footer />
              {/* 4. Pass the click handler to the nav, render the drawer */}
              <MobileBottomNav onCategoryClick={() => setIsCategoryDrawerOpen(true)} />
              <CategoryDrawer 
                isOpen={isCategoryDrawerOpen} 
                onClose={() => setIsCategoryDrawerOpen(false)} 
              />
            </>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:slug" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
          
          <Route 
            path="/checkout" 
            element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard/*" 
            element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} 
          />
        </Route>

        {/* --- Admin Routes (Layout handles Header/Footer hiding) --- */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} /> 
          <Route path="orders" element={<AdminOrderManagement />} />
          <Route path="products" element={<AdminProductManagement />} />
          <Route path="products/new" element={<AdminAddProduct />} />
          <Route path="products/edit/:slug" element={<AdminEditProduct />} />
          <Route path="categories" element={<AdminCategoryManagement />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;