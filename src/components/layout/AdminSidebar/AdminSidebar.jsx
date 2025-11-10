/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaTachometerAlt, 
  FaShoppingBag, 
  FaListAlt, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt,
  FaBoxes,
  FaChevronDown, // Icon for dropdown
  FaChevronRight // Icon for collapsed menu
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State to track which menu is currently open
  const [openMenu, setOpenMenu] = useState(null); 

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminSecretKey');
    navigate('/admin', { replace: true });
  };
  
  // Data structure including submenus (for future expansion)
  const navItems = [
    { name: t('admin_page.nav_dashboard'), path: '/admin/dashboard', icon: <FaTachometerAlt />, submenu: null },
    
    // Example Menu with Submenus
    { 
      name: t('admin_page.nav_orders'), 
      path: '/admin/dashboard/orders', 
      icon: <FaBoxes />, 
      submenu: [
        { name: 'All Orders', path: '/admin/dashboard/orders' },
        { name: 'Pending Verification', path: '/admin/dashboard/orders?status=pending' },
        { name: 'Shipped Orders', path: '/admin/dashboard/orders?status=shipped' },
      ] 
    },
    
    { name: t('admin_page.nav_products'), path: '/admin/dashboard/products', icon: <FaShoppingBag />, submenu: null },
    { name: t('admin_page.nav_categories'), path: '/admin/dashboard/categories', icon: <FaListAlt />, submenu: null },
    { name: t('admin_page.nav_users'), path: '/admin/dashboard/users', icon: <FaUsers />, submenu: null },
    { name: t('admin_page.nav_settings'), path: '/admin/dashboard/settings', icon: <FaCog />, submenu: null },
  ];

  const handleMenuClick = (item) => {
      if (item.submenu) {
          // If it has a submenu, toggle the accordion state
          setOpenMenu(openMenu === item.name ? null : item.name);
      } else {
          // If no submenu, navigate directly
          navigate(item.path);
          setOpenMenu(null); // Close any open menu
      }
  };

  return (
    <nav className="admin-sidebar">
      <div className="sidebar-header">
        <NavLink to="/admin/dashboard">
          NexCart<span>BD</span>
        </NavLink>
      </div>

      <ul className="sidebar-menu">
        {navItems.map((item) => (
          <li key={item.name} className="sidebar-menu-item">
            {/* Main Menu Button */}
            <button 
                className={`main-menu-link ${openMenu === item.name ? 'active' : ''}`}
                onClick={() => handleMenuClick(item)}
            >
                <div className="menu-icon-group">
                    {item.icon}
                    <span>{item.name}</span>
                </div>
                {/* Show Chevron for submenus */}
                {item.submenu && (
                    <span className="menu-chevron">
                        {openMenu === item.name ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                    </span>
                )}
            </button>

            {/* Submenu List (Accordion Content) */}
            {item.submenu && (
                <ul className={`submenu-list ${openMenu === item.name ? 'open' : ''}`}>
                    {item.submenu.map((sub) => (
                        <li key={sub.path}>
                            <NavLink to={sub.path}>
                                {sub.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout}>
          <FaSignOutAlt />
          <span>{t('auth_page.logout_button')}</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminSidebar;