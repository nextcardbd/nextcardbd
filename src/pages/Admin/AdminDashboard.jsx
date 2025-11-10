// © Mahin LTD Developer Tanvir
// Your Role with Me:  
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */
/* Your Role with Me: Senior Developer Mentor + Creative Learning Partner */

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { FaExternalLinkAlt, FaChartLine } from 'react-icons/fa';

// Recharts (simple, no custom colors)
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// KPI slider (mobile)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import './AdminDashboard.css';

// ---------- Helpers ----------
const formatCurrency = (amount) => {
  const n = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  return '৳ ' + new Intl.NumberFormat('en-IN').format(n);
};

const formatBDT = (v) => '৳ ' + new Intl.NumberFormat('en-IN').format(Number(v) || 0);

// Normalize API response safely based on { data: { sales: ..., counts: ... } }
const normalizeSummary = (raw) => {
  const d = raw?.data || raw || {};
  const sales = d.sales || {};
  const counts = d.counts || {};

  const totalSell = Number(sales.totalSell) || 0;
  const totalBuy  = Number(sales.totalBuy)  || 0;
  const totalProfit = Math.max(0, totalSell - totalBuy);

  return {
    totalOrders: Number(counts.totalOrders)    || 0,
    verifiedOrders: Number(counts.verifiedOrders) || 0,
    pendingOrders: Number(counts.pendingOrders) || 0,
    totalRevenue: Number(sales.totalRevenue) || totalSell, // prefer provided, fallback to totalSell
    totalSell,
    totalBuy,
    totalProfit,
    dailyRevenue: Array.isArray(sales.dailyRevenue) ? sales.dailyRevenue : [],
  };
};

// Fallback chart data if API doesn’t provide dailyRevenue
const fallbackChartData = [
  { date: 'Mon', amount: 0 },
  { date: 'Tue', amount: 0 },
  { date: 'Wed', amount: 0 },
  { date: 'Thu', amount: 0 },
  { date: 'Fri', amount: 0 },
  { date: 'Sat', amount: 0 },
  { date: 'Sun', amount: 0 },
];

// ---------- Component ----------
const AdminDashboard = () => {
  const { t } = useTranslation();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load summary on mount
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        // Pass AbortController signal if your apiService/axios supports it
        const response = await getDashboardSummary({ signal: ctrl.signal });
        console.log('Raw API response for /admin/analytics/summary:', response);
        setSummaryData(normalizeSummary(response));
      } catch (err) {
        if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
          console.error('Failed to fetch dashboard summary:', err);
          setError(err?.message || 'Failed to load dashboard data. Check API connection/auth.');
          setSummaryData(normalizeSummary({})); // safe zeros
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  // KPIs (with i18n key for total_profit)
  const kpiData = useMemo(() => {
    if (!summaryData) return [];
    return [
      { title: t('admin_page.total_orders'),   value: summaryData.totalOrders,    color: 'var(--primary-color)' },
      { title: t('admin_page.verified_orders'), value: summaryData.verifiedOrders, color: '#0575E6' },
      { title: t('admin_page.pending_orders'),  value: summaryData.pendingOrders,  color: 'var(--accent-color)' },
      { title: t('admin_page.total_revenue'),   value: formatCurrency(summaryData.totalSell), color: '#111827' },
      { title: t('admin_page.total_profit'),    value: formatCurrency(summaryData.totalProfit), color: '#34A853' },
    ];
  }, [summaryData, t]);

  // Revenue chart data
  const chartData = useMemo(() => {
    if (!summaryData) return fallbackChartData;
    const src = summaryData.dailyRevenue?.length ? summaryData.dailyRevenue : fallbackChartData;
    return src.map((x) => ({
      date: x.date || x.label || '',
      amount: Number(x.amount ?? x.value ?? 0) || 0,
    }));
  }, [summaryData]);

  const hasRevenue = useMemo(
    () => (summaryData?.dailyRevenue || []).some(x => (x.amount ?? x.value ?? 0) > 0),
    [summaryData]
  );

  if (loading) return <LoadingSpinner size="large" />;

  return (
    <div className="admin-dashboard-overview">
      <h1 className="admin-page-title">{t('admin_page.dashboard_title')}</h1>

      {error && <p className="admin-error-message">{error}</p>}

      <div className="admin-stats-container">
        {/* Desktop Grid with optional quick navigation */}
        <div className="admin-stats-grid desktop-view">
          {kpiData.map((kpi, index) => {
            const link =
              kpi.title === t('admin_page.pending_orders')  ? '/admin/orders?status=pending'  :
              kpi.title === t('admin_page.verified_orders') ? '/admin/orders?status=verified' :
              null;

            const Card = ({ children }) =>
              link ? (
                <Link to={link} className="stat-card" style={{ borderLeft: `5px solid ${kpi.color}` }}>
                  {children}
                </Link>
              ) : (
                <div className="stat-card" style={{ borderLeft: `5px solid ${kpi.color}` }}>
                  {children}
                </div>
              );

            return (
              <Card key={index}>
                <p>{kpi.title}</p>
                <h2 style={{ color: kpi.color }}>{kpi.value}</h2>
              </Card>
            );
          })}
        </div>

        {/* Mobile Slider (Swiper) */}
        <div className="admin-stats-slider mobile-view">
          <Swiper
            modules={[Pagination]}
            spaceBetween={10}
            slidesPerView={1.2}
            pagination={{ clickable: true }}
            className="kpi-swiper"
          >
            {kpiData.map((kpi, index) => (
              <SwiperSlide key={index}>
                <div className="stat-card" style={{ borderLeft: `5px solid ${kpi.color}` }}>
                  <p>{kpi.title}</p>
                  <h2 style={{ color: kpi.color }}>{kpi.value}</h2>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="admin-chart-area">
        <h3><FaChartLine style={{ marginRight: '10px' }} />Revenue Analysis</h3>
        <p style={{ marginBottom: 12 }}>Daily revenue (fallback to zeros if API not ready)</p>
        <div style={{ width: '100%', height: 280 }}>
          {hasRevenue ? (
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={formatBDT} />
                <Tooltip
                  formatter={(value) => [formatBDT(value), 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line type="monotone" dataKey="amount" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{display:'grid',placeItems:'center',height:'100%',color:'var(--text-light)'}}>
              No revenue data
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders placeholder */}
      <div className="admin-recent-orders">
        <h3>
          Recent Orders{' '}
          <Link to="/admin/dashboard/orders" className="view-all-link">
            {t('admin_page.view_all')} <FaExternalLinkAlt size={12} />
          </Link>
        </h3>
        <p>A list of the last 10 orders will show here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
