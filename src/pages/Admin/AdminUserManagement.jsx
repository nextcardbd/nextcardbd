/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllUsers } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { FaUserCheck, FaUserSlash } from 'react-icons/fa';
import { format } from 'date-fns';
import './AdminUserManagement.css'; // New CSS file

const AdminUserManagement = () => {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      // Assuming API returns { data: [...] } or just [...]
      const userList = response.data || response || []; 
      setUsers(userList);
    } catch (err) {
      setError('Failed to load users. Check API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = (id, username) => {
    // TODO: Implement user disable/enable API
    alert(`Toggling status for ${username} (API call pending)`);
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="admin-user-management-container">
      <h1 className="admin-page-title">{t('admin_page.nav_users')}</h1>
      
      {error && <p className="admin-error-message">{error}</p>}
      
      {users.length === 0 ? (
        <p>No users found in the database.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td data-label="Username">{user.username}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Joined">
                    {format(new Date(user.createdAt), 'dd MMM, yyyy')}
                  </td>
                  <td data-label="Status">
                    {/* Assuming backend sends 'isActive' or 'status' */}
                    <span className={`status-badge ${user.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                      {user.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td data-label="Action" className="action-cell">
                    <button 
                      className={`action-btn ${user.isActive ? 'delete-btn' : 'edit-btn'}`}
                      onClick={() => handleToggleActive(user._id, user.username)}
                      title={user.isActive ? 'Disable User' : 'Enable User'}
                    >
                      {user.isActive ? <FaUserSlash /> : <FaUserCheck />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;