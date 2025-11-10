// © Mahin LTD Developer Tanvir
// Your Role with Me:  
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { getOrderHistory } from '../../api/userApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { format } from 'date-fns';
import './OrderHistory.css';

// ---------- Helpers ----------
const safeLower = (v) => (v ? String(v).toLowerCase() : '');

// Status badge class mapper (keep in sync with your CSS)
const getStatusClass = (status) => {
  const s = safeLower(status);
  switch (s) {
    case 'pending':
      return 'status-pending';
    case 'verified':
      return 'status-verified';
    case 'packaging':
      return 'status-packaging';
    case 'shipped':
      return 'status-shipped';
    case 'delivered':
      return 'status-delivered';
    case 'cancelled':
      return 'status-cancelled';
    default:
      return '';
  }
};

// Prefer the same sources used by OrderDetailsPage for perfect parity
const resolveStatus = (order) => {
  if (!order) return 'pending';

  // 1) Field used in OrderDetailsPage
  let s = order.orderStatus;

  // 2) Fall back to last shipping update (same timeline used in details)
  if (!s && Array.isArray(order.shippingUpdates) && order.shippingUpdates.length > 0) {
    const last = order.shippingUpdates[order.shippingUpdates.length - 1];
    s = last?.status;
  }

  // 3) Other common fallbacks (depending on backend shape)
  s = s ?? order.currentStatus ?? order.latestStatus?.status ?? order.status ?? 'pending';

  return safeLower(s);
};

const statusKey = (status) => `dashboard_page.status_${safeLower(status) || 'pending'}`;

// ---------- Component ----------
const OrderHistory = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrderHistory();

        // Be flexible with response shapes:
        // { data: { orders: [...] } } | { data: [...] } | [...]
        let orderList = [];
        if (data && data.data && Array.isArray(data.data.orders)) {
          orderList = data.data.orders;
        } else if (data && Array.isArray(data.data)) {
          orderList = data.data;
        } else if (Array.isArray(data)) {
          orderList = data;
        }

        setOrders(orderList);
      } catch (err) {
        console.error('Failed to fetch order history:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (location.pathname === '/dashboard/orders') {
      fetchOrders();
    }
  }, [location.pathname]);

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="order-history-container">
      <h2 className="dashboard-content-title">{t('dashboard_page.orders_title')}</h2>

      {orders.length === 0 ? (
        <p>{t('dashboard_page.no_orders_message', 'You have not placed any orders yet.')}</p>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>{t('dashboard_page.order_id')}</th>
                <th>{t('dashboard_page.order_date')}</th>
                <th>{t('dashboard_page.order_amount')}</th>
                <th>{t('dashboard_page.order_status')}</th>
                <th>{t('dashboard_page.order_action')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const id = order?._id;
                const code = order?.orderId || (id ? `#${String(id).slice(-6)}` : '#—');
                const createdAt = order?.createdAt ? new Date(order.createdAt) : null;
                const amount = order?.totalAmount ?? 0;
                const s = resolveStatus(order);

                return (
                  <tr key={id || code}>
                    <td data-label={t('dashboard_page.order_id')}>
                      {code}
                    </td>

                    <td data-label={t('dashboard_page.order_date')}>
                      {createdAt ? format(createdAt, 'dd MMM, yyyy') : '—'}
                    </td>

                    <td data-label={t('dashboard_page.order_amount')}>
                      ৳ {amount}
                    </td>

                    <td data-label={t('dashboard_page.order_status')}>
                      <span className={`status-badge ${getStatusClass(s)}`}>
                        {t(statusKey(s), s)}
                      </span>
                    </td>

                    <td data-label={t('dashboard_page.order_action')}>
                      {id ? (
                        <Link to={`/dashboard/orders/${id}`} className="order-details-btn">
                          {t('dashboard_page.order_view_details')}
                        </Link>
                      ) : (
                        <span className="order-details-btn disabled">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
