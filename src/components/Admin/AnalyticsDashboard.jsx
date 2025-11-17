import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import usageAnalyticsService from '../../services/usageAnalyticsService';
import AdminHeader from '../Header/AdminHeader';
import { useAuth } from '../../contexts/AuthContext';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Analytics data
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all three analytics endpoints
      const results = await Promise.allSettled([
        usageAnalyticsService.getCompanyAnalytics(dateRange.startDate || undefined, dateRange.endDate || undefined),
        usageAnalyticsService.getCompanyTrends('30d', dateRange.startDate || undefined, dateRange.endDate || undefined),
        usageAnalyticsService.getAppLeaderboard(20, dateRange.startDate || undefined, dateRange.endDate || undefined)
      ]);

      // Handle each result individually
      if (results[0].status === 'fulfilled') {
        setAnalytics(results[0].value);
      } else {
        console.error('Company Analytics Error:', results[0].reason);
      }

      if (results[1].status === 'fulfilled') {
        setTrends(results[1].value);
      } else {
        console.error('Company Trends Error:', results[1].reason);
      }

      if (results[2].status === 'fulfilled') {
        setLeaderboard(results[2].value);
      } else {
        console.error('App Leaderboard Error:', results[2].reason);
      }

      // Only show error if all requests failed
      if (results.every(r => r.status === 'rejected')) {
        const firstError = results[0].reason;
        if (firstError?.status === 403) {
          setError('Access denied. You do not have permission to view analytics. Please ensure you are logged in as an admin or company owner.');
        } else {
          setError('Failed to load analytics data. Please try again.');
        }
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearDateRange = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    });
  };

  const renderOverview = () => {
    if (!analytics) return null;

    const { companyStats, dateRange: apiDateRange } = analytics;

    return (
      <div className="analytics-overview">
        <div className="date-range-info">
          <span>📅 Data Range: {apiDateRange?.startDate} to {apiDateRange?.endDate}</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-label">Total Employees</div>
              <div className="stat-value">{companyStats?.totalEmployees || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-label">Total Screen Time</div>
              <div className="stat-value">
                {usageAnalyticsService.formatTime(companyStats?.totalScreenTime || 0)}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Avg Screen Time</div>
              <div className="stat-value">
                {usageAnalyticsService.formatTime(companyStats?.averageScreenTime || 0)}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-label">Avg Productivity Score</div>
              <div className="stat-value">{companyStats?.averageProductivityScore?.toFixed(1) || 0}%</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-label">Total Records</div>
              <div className="stat-value">{companyStats?.totalRecords || 0}</div>
            </div>
          </div>
        </div>

        {/* Top Apps Section */}
        <div className="top-apps-section">
          <h3>🏆 Top Applications</h3>
          <div className="top-apps-grid">
            {analytics.topApps && analytics.topApps.length > 0 ? (
              analytics.topApps.slice(0, 5).map((app, index) => (
                <div key={index} className="top-app-card">
                  <div className="app-rank">#{index + 1}</div>
                  <div className="app-details">
                    <div className="app-name">{app._id}</div>
                    <div className="app-category" style={{ color: usageAnalyticsService.getCategoryColor(app.category) }}>
                      {app.category}
                    </div>
                    <div className="app-stats">
                      <span>⏱️ {usageAnalyticsService.formatTime(app.totalUsage)}</span>
                      <span>👥 {app.totalUsers} users</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No application data available</div>
            )}
          </div>
        </div>

        {/* Department Stats */}
        {analytics.departmentStats && analytics.departmentStats.length > 0 && (
          <div className="department-stats-section">
            <h3>🏢 Department Statistics</h3>
            <div className="department-grid">
              {analytics.departmentStats.map((dept, index) => (
                <div key={index} className="department-card">
                  <div className="dept-name">{dept.department || 'Unknown'}</div>
                  <div className="dept-stats">
                    <div>Employees: {dept.employeeCount}</div>
                    <div>Avg Time: {usageAnalyticsService.formatTime(dept.averageScreenTime)}</div>
                    <div>Productivity: {dept.averageProductivityScore?.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLeaderboard = () => {
    if (!leaderboard) return null;

    return (
      <div className="leaderboard-section">
        <div className="date-range-info">
          <span>📅 Data Range: {leaderboard.dateRange?.startDate} to {leaderboard.dateRange?.endDate}</span>
        </div>

        <div className="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Application</th>
                <th>Category</th>
                <th>Total Usage</th>
                <th>Total Users</th>
                <th>Avg Usage/User</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.leaderboard && leaderboard.leaderboard.length > 0 ? (
                leaderboard.leaderboard.map((app, index) => (
                  <tr key={index}>
                    <td className="rank-cell">
                      <span className={`rank-badge rank-${index < 3 ? index + 1 : 'other'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="app-name-cell">{app._id}</td>
                    <td>
                      <span 
                        className="category-badge"
                        style={{ backgroundColor: usageAnalyticsService.getCategoryColor(app.category) }}
                      >
                        {app.category}
                      </span>
                    </td>
                    <td>{usageAnalyticsService.formatTime(app.totalUsage)}</td>
                    <td>{app.totalUsers}</td>
                    <td>{usageAnalyticsService.formatTime(Math.round(app.averageUsage))}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No leaderboard data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTrends = () => {
    if (!trends) return null;

    return (
      <div className="trends-section">
        <div className="date-range-info">
          <span>📅 Data Range: {trends.dateRange?.startDate} to {trends.dateRange?.endDate}</span>
        </div>

        <div className="trends-content">
          {trends.dailyTrends && trends.dailyTrends.length > 0 ? (
            <div className="daily-trends">
              <h3>📈 Daily Trends</h3>
              <div className="trends-grid">
                {trends.dailyTrends.map((trend, index) => (
                  <div key={index} className="trend-card">
                    <div className="trend-date">{trend.date}</div>
                    <div className="trend-stats">
                      <div>Screen Time: {usageAnalyticsService.formatTime(trend.totalScreenTime)}</div>
                      <div>Users: {trend.userCount}</div>
                      <div>Apps: {trend.appCount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-data">No trend data available</div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="analytics-dashboard loading">
        <div className="loader"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard error">
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
          <button onClick={loadAnalytics} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <AdminHeader />
      <div className="analytics-dashboard-wrapper">
        <div className="page-header">
          <div className="header-left">
            <button 
              className="back-button"
              onClick={() => navigate(userRole === 'admin' ? '/admin/dashboard' : '/dashboard')}
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1>Usage Analytics</h1>
            <p>Track and analyze usage metrics across companies</p>
          </div>
          <div className="header-actions">
            <div className="date-range-filter">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                placeholder="Start Date"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                placeholder="End Date"
              />
              {(dateRange.startDate || dateRange.endDate) && (
                <button onClick={clearDateRange} className="clear-button">
                  Clear
                </button>
              )}
            </div>
            <button onClick={loadAnalytics} className="btn-primary">
              🔄 Refresh
            </button>
          </div>
        </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          App Leaderboard
        </button>
        <button
          className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </button>
      </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'leaderboard' && renderLeaderboard()}
          {activeTab === 'trends' && renderTrends()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
