import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import usageAnalyticsService from '../../services/usageAnalyticsService';
import './MyUsage.css';

const MyUsage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [usageData, setUsageData] = useState(null);

  const loadUsageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usageAnalyticsService.getMyUsage(page, limit);
      setUsageData(data);
    } catch (err) {
      console.error('Failed to load usage data:', err);
      setError('Failed to load your usage data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (usageData?.pages || 1)) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="my-usage loading">
        <div className="loader"></div>
        <p>Loading your usage data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-usage error">
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
          <button onClick={loadUsageData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, usage, total, pages } = usageData || {};

  return (
    <div className="my-usage">
      <div className="page-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1>My Usage Statistics</h1>
          <p>View your personal usage analytics and screen time</p>
        </div>
        <button onClick={loadUsageData} className="btn-primary">
          🔄 Refresh
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-section">
          <h2>Summary</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">⏱️</div>
              <div className="summary-content">
                <div className="summary-label">Total Screen Time</div>
                <div className="summary-value">
                  {usageAnalyticsService.formatTime(summary.totalScreenTime)}
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <div className="summary-label">Average Screen Time</div>
                <div className="summary-value">
                  {usageAnalyticsService.formatTime(summary.averageScreenTime)}
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">⭐</div>
              <div className="summary-content">
                <div className="summary-label">Avg Productivity Score</div>
                <div className="summary-value">
                  {summary.averageProductivityScore?.toFixed(1) || 0}%
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">📅</div>
              <div className="summary-content">
                <div className="summary-label">Total Days Tracked</div>
                <div className="summary-value">{summary.totalDays || 0}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Details */}
      <div className="usage-details-section">
        <div className="section-header">
          <h2>Usage Details</h2>
          <div className="results-info">
            Showing {usage?.length || 0} of {total || 0} records
          </div>
        </div>

        {usage && usage.length > 0 ? (
          <div className="usage-list">
            {usage.map((item, index) => (
              <div key={item.id || index} className="usage-item">
                <div className="usage-app-info">
                  <div className="app-icon">📱</div>
                  <div className="app-details">
                    <div className="app-name">{item.app_name}</div>
                    <div 
                      className="app-category"
                      style={{ color: usageAnalyticsService.getCategoryColor(item.category) }}
                    >
                      {item.category}
                    </div>
                  </div>
                </div>
                <div className="usage-time">
                  <div className="time-label">Usage Time</div>
                  <div className="time-value">
                    {usageAnalyticsService.formatTime(item.usage_time_minutes)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <span>📊</span>
            <p>No usage data found</p>
            <p className="no-data-subtitle">Start tracking your application usage to see insights here</p>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="page-button"
            >
              ← Previous
            </button>
            <div className="page-info">
              Page {page} of {pages}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pages}
              className="page-button"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUsage;
