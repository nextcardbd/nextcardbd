/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar/AdminSidebar';
import AdminProtectedRoute from '../../components/common/AdminProtectedRoute';
import AdminDashboard from './AdminDashboard';
import AdminOrderManagement from './AdminOrderManagement';
import AdminProductManagement from './AdminProductManagement';
import AdminAddProduct from './AdminAddProduct'; // 1. Import
import AdminCategoryManagement from './AdminCategoryManagement';
import { FaBars, FaTimes } from 'react-icons/fa';
import './AdminLayout.css'; 

const AdminUserManagement = () => <h2>User Management</h2>;
const AdminSettings = () => <h2>Settings</h2>;

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <AdminProtectedRoute>
            <div className={`admin-layout-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
                    {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
                <AdminSidebar />
                <main className="admin-main-content">
                    {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
                    <div className="admin-content-wrapper">
                        <Outlet /> {/* Renders the nested routes */}
                    </div>
                </main>
            </div>
        </AdminProtectedRoute>
    );
};

export default AdminLayout;