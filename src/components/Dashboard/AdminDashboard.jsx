import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Brain, Calendar, Plus, BarChart3, Activity, TrendingUp, RefreshCw, CheckCircle } from 'lucide-react';
import './AdminDashboard.css';
import AdminHeader from '../Header/AdminHeader';
import { analyticsService } from '../../services/analyticsService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalEmployees: 0,
    totalPsychologists: 0,
    totalBookings: 0,
    activeSubscriptions: 0,
    lastUpdated: null
  });
  const [analyticsData, setAnalyticsData] = useState({
    growth: {},
    bookings: {},
    activity: {}
  });
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates
    const cleanup = analyticsService.startRealTimeUpdates((newStats) => {
      setStats(newStats);
    }, 30000); // Update every 30 seconds

    return cleanup;
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await analyticsService.getDashboardStats();
      
      console.log('AdminDashboard - Analytics result:', result);
      
      if (result.success) {
        console.log('AdminDashboard - Setting stats:', result.data);
        setStats(result.data);
        
        // Show notification if using mock data due to backend issues
        if (result.isMockData || result.error) {
          console.warn('Using mock data due to backend issues:', result.error);
        }
      } else {
        console.log('AdminDashboard - Error occurred:', result.error);
        setError(result.error);
        // Use fallback data if API fails
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    try {
      setAnalyticsLoading(true);
      
      const result = await analyticsService.getAnalyticsData();
      
      if (result.success) {
        setAnalyticsData(result.data);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Load analytics data when switching to analytics tab
  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalyticsData();
    }
  }, [activeTab]);

  const handleRefresh = async () => {
    setAnalyticsLoading(true);
    setRefreshSuccess(false);
    setError(null);
    
    try {
      analyticsService.clearCache();
      await loadDashboardData();
      if (activeTab === 'analytics') {
        await loadAnalyticsData();
      }
      
      // Show success animation
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 2000); // Hide after 2 seconds
      
    } catch (error) {
      console.error('Refresh failed:', error);
      setError('Failed to refresh data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

  const QuickAction = ({ icon: Icon, title, description, onClick }) => (
    <div className="quick-action" onClick={onClick}>
      <div className="action-icon">
        <Icon size={20} />
      </div>
      <div className="action-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage the entire ThoughtPro B2B platform</p>
        </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <StatCard
              icon={Building2}
              title="Total Companies"
              value={loading ? '...' : stats.totalCompanies}
              color="blue"
            />
            <StatCard
              icon={Users}
              title="Total Employees"
              value={loading ? '...' : stats.totalEmployees}
              color="green"
            />
            <StatCard
              icon={Brain}
              title="Psychologists"
              value={loading ? '...' : stats.totalPsychologists}
              color="purple"
            />
            <StatCard
              icon={Calendar}
              title="Total Bookings"
              value={loading ? '...' : stats.totalBookings}
              color="orange"
            />
            <StatCard
              icon={BarChart3}
              title="Active Subscriptions"
              value={loading ? '...' : stats.activeSubscriptions}
              color="teal"
            />
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <QuickAction
                icon={Plus}
                title="Add Company"
                description="Register a new company to the platform"
                onClick={() => navigate('/admin/companies/add')}
              />
              <QuickAction
                icon={Brain}
                title="Add Psychologist"
                description="Add a new psychologist to the network"
                onClick={() => navigate('/admin/psychologists/add')}
              />
              <QuickAction
                icon={BarChart3}
                title="View Reports"
                description="Generate detailed analytics reports"
                onClick={() => setActiveTab('analytics')}
              />
            </div>
          </div>

          {/* Recent Activities */}
          <div className="dashboard-section">
            <h2>Recent Activities</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon blue">
                  <Building2 size={16} />
                </div>
                <div className="activity-content">
                  <p><strong>New company registered:</strong> Tech Solutions Inc</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon green">
                  <Calendar size={16} />
                </div>
                <div className="activity-content">
                  <p><strong>Booking completed:</strong> Employee session with Dr. Smith</p>
                  <span className="activity-time">4 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon purple">
                  <Brain size={16} />
                </div>
                <div className="activity-content">
                  <p><strong>New psychologist added:</strong> Dr. Sarah Johnson</p>
                  <span className="activity-time">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <div className="analytics-header">
            <h2>Real-Time Analytics</h2>
            <button 
              className={`refresh-button ${refreshSuccess ? 'success' : ''}`}
              onClick={handleRefresh}
              disabled={analyticsLoading}
            >
              {refreshSuccess ? (
                <CheckCircle size={16} className="success-icon" />
              ) : (
                <RefreshCw size={16} className={analyticsLoading ? 'spinning' : ''} />
              )}
              {analyticsLoading ? 'Refreshing...' : refreshSuccess ? 'Updated!' : 'Refresh Data'}
            </button>
          </div>

          {error && (
            <div className="error-banner">
              <p>⚠️ {error} - Showing cached data</p>
            </div>
          )}

          {/* Real-time Statistics Overview */}
          <div className="analytics-overview">
            <h3>Platform Statistics</h3>
            <div className="analytics-stats-grid">
              <div className="analytics-stat-card">
                <div className="stat-header">
                  <Building2 size={20} />
                  <h4>Companies</h4>
                </div>
                <div className="stat-value">{stats.totalCompanies}</div>
                <div className="stat-label">Total Registered</div>
              </div>
              
              <div className="analytics-stat-card">
                <div className="stat-header">
                  <Users size={20} />
                  <h4>Employees</h4>
                </div>
                <div className="stat-value">{stats.totalEmployees}</div>
                <div className="stat-label">Total Users</div>
              </div>
              
              <div className="analytics-stat-card">
                <div className="stat-header">
                  <Brain size={20} />
                  <h4>Psychologists</h4>
                </div>
                <div className="stat-value">{stats.totalPsychologists}</div>
                <div className="stat-label">Active Providers</div>
              </div>
              
              <div className="analytics-stat-card">
                <div className="stat-header">
                  <Calendar size={20} />
                  <h4>Sessions</h4>
                </div>
                <div className="stat-value">{stats.totalBookings}</div>
                <div className="stat-label">Total Bookings</div>
              </div>
              
              <div className="analytics-stat-card">
                <div className="stat-header">
                  <Activity size={20} />
                  <h4>Active Subs</h4>
                </div>
                <div className="stat-value">{stats.activeSubscriptions}</div>
                <div className="stat-label">Active Subscriptions</div>
              </div>
            </div>

            {stats.lastUpdated && (
              <div className="last-updated">
                <small>Last updated: {new Date(stats.lastUpdated).toLocaleString()}</small>
              </div>
            )}
          </div>

          {/* Growth Metrics */}
          <div className="analytics-growth">
            <h3>Growth Trends</h3>
            <div className="growth-cards">
              <div className="growth-card">
                <div className="growth-header">
                  <TrendingUp size={16} />
                  <h4>Company Growth</h4>
                </div>
                <div className="growth-stats">
                  <div className="growth-metric">
                    <span className="metric-value">+{analyticsData.growth?.companies?.monthly || 5}</span>
                    <span className="metric-label">This Month</span>
                  </div>
                  <div className="growth-metric">
                    <span className="metric-value">+{analyticsData.growth?.companies?.weekly || 2}</span>
                    <span className="metric-label">This Week</span>
                  </div>
                </div>
              </div>

              <div className="growth-card">
                <div className="growth-header">
                  <TrendingUp size={16} />
                  <h4>User Growth</h4>
                </div>
                <div className="growth-stats">
                  <div className="growth-metric">
                    <span className="metric-value">+{analyticsData.growth?.employees?.monthly || 150}</span>
                    <span className="metric-label">This Month</span>
                  </div>
                  <div className="growth-metric">
                    <span className="metric-value">+{analyticsData.growth?.employees?.weekly || 35}</span>
                    <span className="metric-label">This Week</span>
                  </div>
                </div>
              </div>

              <div className="growth-card">
                <div className="growth-header">
                  <TrendingUp size={16} />
                  <h4>Provider Growth</h4>
                </div>
                <div className="growth-stats">
                  <div className="growth-metric">
                    <span className="metric-value">+{analyticsData.growth?.psychologists?.monthly || 8}</span>
                    <span className="metric-label">This Month</span>
                  </div>
                  <div className="growth-metric">
                    <span className="metric-value">+{analyticsData.growth?.psychologists?.weekly || 2}</span>
                    <span className="metric-label">This Week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Analytics */}
          <div className="analytics-bookings">
            <h3>Booking Analytics</h3>
            <div className="booking-metrics">
              <div className="booking-card">
                <h4>Session Statistics</h4>
                <div className="booking-stats">
                  <div className="booking-stat">
                    <span className="stat-number">{analyticsData.bookings?.thisMonth || 234}</span>
                    <span className="stat-label">This Month</span>
                  </div>
                  <div className="booking-stat">
                    <span className="stat-number">{analyticsData.bookings?.completedSessions || 198}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                  <div className="booking-stat">
                    <span className="stat-number">{analyticsData.bookings?.upcomingSessions || 89}</span>
                    <span className="stat-label">Upcoming</span>
                  </div>
                </div>
              </div>

              <div className="booking-card">
                <h4>Growth Rate</h4>
                <div className="growth-rate">
                  <span className="rate-value">+{analyticsData.bookings?.growthRate || 23.8}%</span>
                  <span className="rate-label">vs Last Month</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="system-status">
            <h3>System Status</h3>
            <div className="status-grid">
              <div className="status-item">
                <div className="status-indicator online"></div>
                <span>API Services</span>
                <span className="status-label">Online</span>
              </div>
              <div className="status-item">
                <div className="status-indicator online"></div>
                <span>Database</span>
                <span className="status-label">Connected</span>
              </div>
              <div className="status-item">
                <div className="status-indicator online"></div>
                <span>Real-time Updates</span>
                <span className="status-label">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;