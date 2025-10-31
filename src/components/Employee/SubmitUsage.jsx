import React, { useState } from 'react';
import usageAnalyticsService from '../../services/usageAnalyticsService';
import './SubmitUsage.css';

const SubmitUsage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    totalScreenTime: '',
    deviceType: 'laptop',
    os: ''
  });

  const [apps, setApps] = useState([
    { appName: '', usageTime: '', category: 'Productivity' }
  ]);

  const categories = [
    'Productivity',
    'Communication',
    'Entertainment',
    'Social Media',
    'Development',
    'Design',
    'Education',
    'Finance',
    'Other'
  ];

  const deviceTypes = ['laptop', 'desktop', 'mobile', 'tablet'];

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAppChange = (index, field, value) => {
    const newApps = [...apps];
    newApps[index][field] = value;
    setApps(newApps);
  };

  const addApp = () => {
    setApps([...apps, { appName: '', usageTime: '', category: 'Productivity' }]);
  };

  const removeApp = (index) => {
    if (apps.length > 1) {
      setApps(apps.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.date) {
      setError('Please select a date');
      return;
    }

    const validApps = apps.filter(app => app.appName && app.usageTime > 0);
    if (validApps.length === 0) {
      setError('Please add at least one app with usage time');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const usageData = {
        date: formData.date,
        apps: validApps.map(app => ({
          appName: app.appName,
          usageTime: parseInt(app.usageTime),
          category: app.category
        })),
        totalScreenTime: parseInt(formData.totalScreenTime) || validApps.reduce((sum, app) => sum + parseInt(app.usageTime || 0), 0),
        deviceInfo: {
          deviceType: formData.deviceType,
          os: formData.os || 'Unknown'
        }
      };

      const response = await usageAnalyticsService.submitDailyUsage(usageData);
      
      if (response.success) {
        setSuccess('Usage data submitted successfully!');
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          totalScreenTime: '',
          deviceType: 'laptop',
          os: ''
        });
        setApps([{ appName: '', usageTime: '', category: 'Productivity' }]);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Failed to submit usage:', err);
      setError(err.message || 'Failed to submit usage data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-usage">
      <div className="submit-usage-header">
        <h1>📝 Submit Daily Usage</h1>
        <p>Track your application usage for productivity insights</p>
      </div>

      <div className="submit-usage-container">
        {success && (
          <div className="alert alert-success">
            <span>✅</span>
            <p>{success}</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Total Screen Time (minutes)</label>
                <input
                  type="number"
                  value={formData.totalScreenTime}
                  onChange={(e) => handleFormChange('totalScreenTime', e.target.value)}
                  placeholder="Auto-calculated if empty"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Device Type *</label>
                <select
                  value={formData.deviceType}
                  onChange={(e) => handleFormChange('deviceType', e.target.value)}
                  required
                >
                  {deviceTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Operating System</label>
                <input
                  type="text"
                  value={formData.os}
                  onChange={(e) => handleFormChange('os', e.target.value)}
                  placeholder="e.g., Windows, macOS, Linux"
                />
              </div>
            </div>
          </div>

          {/* Apps Section */}
          <div className="form-section">
            <div className="section-header">
              <h3>Applications</h3>
              <button type="button" onClick={addApp} className="add-app-button">
                + Add App
              </button>
            </div>

            <div className="apps-list">
              {apps.map((app, index) => (
                <div key={index} className="app-entry">
                  <div className="app-entry-header">
                    <span>App {index + 1}</span>
                    {apps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeApp(index)}
                        className="remove-app-button"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="app-fields">
                    <div className="form-group">
                      <label>App Name *</label>
                      <input
                        type="text"
                        value={app.appName}
                        onChange={(e) => handleAppChange(index, 'appName', e.target.value)}
                        placeholder="e.g., Google Chrome"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Usage Time (minutes) *</label>
                      <input
                        type="number"
                        value={app.usageTime}
                        onChange={(e) => handleAppChange(index, 'usageTime', e.target.value)}
                        placeholder="120"
                        min="1"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={app.category}
                        onChange={(e) => handleAppChange(index, 'category', e.target.value)}
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                '✓ Submit Usage Data'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitUsage;
