import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Clock,
  Server,
  Database,
  Wifi,
  Shield,
  Zap,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { healthCheckService } from '../../services/healthCheckService';
import Header from '../Header/Header';
import './HealthDashboard.css';

const HealthDashboard = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  const fetchHealthStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await healthCheckService.checkHealth();
      
      if (response.success && response.data) {
        setHealthStatus(response.data);
        setLastUpdated(new Date());
      } else {
        // Fallback to demo data
        setHealthStatus(getDemoHealthStatus());
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching health status:', error);
      setError('Failed to fetch system health status');
      // Show demo data even on error for demonstration
      setHealthStatus(getDemoHealthStatus());
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthStatus();
  }, [fetchHealthStatus]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh && !loading) {
      interval = setInterval(() => {
        fetchHealthStatus();
      }, refreshInterval * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, loading, fetchHealthStatus]);

  const getDemoHealthStatus = () => ({
    overall_status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api_server: {
        status: 'healthy',
        response_time: 45,
        uptime: '99.9%',
        last_check: new Date().toISOString()
      },
      database: {
        status: 'healthy',
        response_time: 23,
        connections: 12,
        max_connections: 100,
        last_check: new Date().toISOString()
      },
      authentication: {
        status: 'healthy',
        response_time: 67,
        active_sessions: 234,
        last_check: new Date().toISOString()
      },
      booking_service: {
        status: 'warning',
        response_time: 156,
        queue_size: 5,
        last_check: new Date().toISOString(),
        message: 'Slightly elevated response times'
      },
      notification_service: {
        status: 'healthy',
        response_time: 89,
        pending_notifications: 3,
        last_check: new Date().toISOString()
      },
      external_apis: {
        status: 'degraded',
        google_play: 'healthy',
        payment_gateway: 'degraded',
        email_service: 'healthy',
        last_check: new Date().toISOString(),
        message: 'Payment gateway experiencing intermittent issues'
      }
    },
    metrics: {
      total_requests: 45678,
      successful_requests: 44891,
      failed_requests: 787,
      average_response_time: 78,
      system_load: 0.65,
      memory_usage: 0.73,
      disk_usage: 0.45
    }
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="status-icon healthy" />;
      case 'warning':
        return <AlertTriangle className="status-icon warning" />;
      case 'degraded':
      case 'unhealthy':
        return <XCircle className="status-icon unhealthy" />;
      default:
        return <AlertTriangle className="status-icon unknown" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'healthy';
      case 'warning':
        return 'warning';
      case 'degraded':
      case 'unhealthy':
        return 'unhealthy';
      default:
        return 'unknown';
    }
  };

  const getServiceIcon = (serviceName) => {
    switch (serviceName) {
      case 'api_server':
        return <Server size={20} />;
      case 'database':
        return <Database size={20} />;
      case 'authentication':
        return <Shield size={20} />;
      case 'booking_service':
        return <Calendar size={20} />;
      case 'notification_service':
        return <Zap size={20} />;
      case 'external_apis':
        return <Wifi size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const formatServiceName = (serviceName) => {
    return serviceName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatUptime = (timestamp) => {
    if (!lastUpdated) return 'Unknown';
    const now = new Date();
    const lastUpdate = new Date(timestamp);
    const diffMs = now - lastUpdate;
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  };

  const getProgressPercentage = (value) => {
    return Math.round(value * 100);
  };

  if (loading && !healthStatus) {
    return (
      <div className="health-page">
        <Header />
        <div className="health-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading system health status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="health-page">
      <Header />
      <div className="health-container">
        <div className="health-header">
          <div className="health-title">
            <Activity size={28} />
            <h1>System Health Dashboard</h1>
          </div>
          <div className="header-controls">
            <div className="auto-refresh-control">
              <label>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                Auto-refresh every
              </label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                disabled={!autoRefresh}
              >
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={60}>1m</option>
                <option value={300}>5m</option>
              </select>
            </div>
            <button
              className="refresh-button"
              onClick={fetchHealthStatus}
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? 'spinning' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {healthStatus && (
          <>
            {/* Overall Status */}
            <div className={`overall-status ${getStatusColor(healthStatus.overall_status)}`}>
              <div className="status-info">
                {getStatusIcon(healthStatus.overall_status)}
                <div className="status-text">
                  <h2>System Status: {healthStatus.overall_status.toUpperCase()}</h2>
                  <p>
                    Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Unknown'}
                    {autoRefresh && ` • Auto-refresh: ${refreshInterval}s`}
                  </p>
                </div>
              </div>
              <div className="status-actions">
                <TrendingUp size={24} />
              </div>
            </div>

            {/* Services Grid */}
            <div className="services-grid">
              {Object.entries(healthStatus.services).map(([serviceName, service]) => (
                <div key={serviceName} className={`service-card ${getStatusColor(service.status)}`}>
                  <div className="service-header">
                    <div className="service-info">
                      {getServiceIcon(serviceName)}
                      <div>
                        <h3>{formatServiceName(serviceName)}</h3>
                        <div className="service-status">
                          {getStatusIcon(service.status)}
                          <span>{service.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="service-metrics">
                    {service.response_time && (
                      <div className="metric">
                        <Clock size={16} />
                        <span>{service.response_time}ms</span>
                      </div>
                    )}
                    
                    {service.uptime && (
                      <div className="metric">
                        <TrendingUp size={16} />
                        <span>{service.uptime}</span>
                      </div>
                    )}
                    
                    {service.connections !== undefined && (
                      <div className="metric">
                        <Database size={16} />
                        <span>{service.connections}/{service.max_connections} conn</span>
                      </div>
                    )}
                    
                    {service.active_sessions && (
                      <div className="metric">
                        <Shield size={16} />
                        <span>{service.active_sessions} sessions</span>
                      </div>
                    )}
                    
                    {service.queue_size !== undefined && (
                      <div className="metric">
                        <Activity size={16} />
                        <span>{service.queue_size} queued</span>
                      </div>
                    )}
                  </div>

                  {service.message && (
                    <div className="service-message">
                      <p>{service.message}</p>
                    </div>
                  )}

                  <div className="service-timestamp">
                    <span>Last check: {formatUptime(service.last_check)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* System Metrics */}
            {healthStatus.metrics && (
              <div className="metrics-section">
                <h2>System Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <TrendingUp size={20} />
                      <h3>System Load</h3>
                    </div>
                    <div className="metric-value">
                      <span className="value">{getProgressPercentage(healthStatus.metrics.system_load)}%</span>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${healthStatus.metrics.system_load > 0.8 ? 'high' : healthStatus.metrics.system_load > 0.6 ? 'medium' : 'low'}`}
                          style={{ width: `${getProgressPercentage(healthStatus.metrics.system_load)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <Database size={20} />
                      <h3>Memory Usage</h3>
                    </div>
                    <div className="metric-value">
                      <span className="value">{getProgressPercentage(healthStatus.metrics.memory_usage)}%</span>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${healthStatus.metrics.memory_usage > 0.8 ? 'high' : healthStatus.metrics.memory_usage > 0.6 ? 'medium' : 'low'}`}
                          style={{ width: `${getProgressPercentage(healthStatus.metrics.memory_usage)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <Server size={20} />
                      <h3>Disk Usage</h3>
                    </div>
                    <div className="metric-value">
                      <span className="value">{getProgressPercentage(healthStatus.metrics.disk_usage)}%</span>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${healthStatus.metrics.disk_usage > 0.8 ? 'high' : healthStatus.metrics.disk_usage > 0.6 ? 'medium' : 'low'}`}
                          style={{ width: `${getProgressPercentage(healthStatus.metrics.disk_usage)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <Activity size={20} />
                      <h3>Request Success Rate</h3>
                    </div>
                    <div className="metric-value">
                      <span className="value">
                        {Math.round((healthStatus.metrics.successful_requests / healthStatus.metrics.total_requests) * 100)}%
                      </span>
                      <div className="metric-details">
                        <small>
                          {healthStatus.metrics.successful_requests.toLocaleString()} / {healthStatus.metrics.total_requests.toLocaleString()} requests
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <Clock size={20} />
                      <h3>Average Response Time</h3>
                    </div>
                    <div className="metric-value">
                      <span className="value">{healthStatus.metrics.average_response_time}ms</span>
                      <div className="metric-details">
                        <small>Across all services</small>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <XCircle size={20} />
                      <h3>Failed Requests</h3>
                    </div>
                    <div className="metric-value">
                      <span className="value error">{healthStatus.metrics.failed_requests.toLocaleString()}</span>
                      <div className="metric-details">
                        <small>Last 24 hours</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HealthDashboard;