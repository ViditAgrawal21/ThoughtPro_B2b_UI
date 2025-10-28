import React, { useState, useEffect, useCallback } from 'react';
import { Save, X, AlertCircle, Check, TrendingUp, Calendar, Clock } from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import './BookingLimitsManager.css';

const BookingLimitsManager = ({ psychologist, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [loadingLimits, setLoadingLimits] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    weeklyLimit: 25,
    monthlyLimit: 100,
  });
  const [currentUsage, setCurrentUsage] = useState({
    weekly: 0,
    monthly: 0,
  });

  // Log psychologist object to debug ID issue
  useEffect(() => {
    console.log('=== BookingLimitsManager Debug ===');
    console.log('Full psychologist object:', JSON.stringify(psychologist, null, 2));
    console.log('psychologist.id:', psychologist?.id);
    console.log('psychologist.psychologist_id:', psychologist?.psychologist_id);
    console.log('psychologist.email:', psychologist?.email);
    console.log('All keys:', psychologist ? Object.keys(psychologist) : 'null');
    
    // Find UUID fields
    if (psychologist) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      Object.keys(psychologist).forEach(key => {
        const value = psychologist[key];
        if (typeof value === 'string' && uuidRegex.test(value)) {
          console.log(`Found UUID in field "${key}":`, value);
        }
      });
    }
    console.log('==================================');
  }, [psychologist]);

  const fetchBookingLimits = useCallback(async () => {
    try {
      setLoadingLimits(true);
      setError(null);
      
      // Use psychologist_id if id is not a UUID
      const psychologistId = psychologist.psychologist_id || psychologist.id;
      console.log('Using psychologist ID for fetch:', psychologistId);
      
      const data = await psychologistService.getBookingLimits(psychologistId);
      
      if (data && data.limits) {
        setFormData({
          weeklyLimit: data.limits.weeklyLimit || 25,
          monthlyLimit: data.limits.monthlyLimit || 100,
        });
      }
      
      if (data && data.usage) {
        setCurrentUsage({
          weekly: data.usage.weekly || 0,
          monthly: data.usage.monthly || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching booking limits:', err);
      setError('Failed to load current booking limits. Using defaults.');
    } finally {
      setLoadingLimits(false);
    }
  }, [psychologist?.id, psychologist?.psychologist_id]);

  useEffect(() => {
    if (psychologist?.id) {
      fetchBookingLimits();
    }
  }, [psychologist?.id, fetchBookingLimits]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation
      if (formData.weeklyLimit <= 0 || formData.monthlyLimit <= 0) {
        throw new Error('All limits must be greater than 0');
      }

      if (formData.weeklyLimit > formData.monthlyLimit) {
        throw new Error('Weekly limit cannot exceed monthly limit');
      }

      // Use psychologist_id if id is not a UUID
      const psychologistId = psychologist.psychologist_id || psychologist.id;
      console.log('Using psychologist ID for submit:', psychologistId);

      const result = await psychologistService.setBookingLimits(psychologistId, formData);

      if (result.success) {
        setSuccess('Booking limits updated successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        throw new Error('Failed to update booking limits');
      }
    } catch (err) {
      console.error('Error updating booking limits:', err);
      setError(err.message || 'Failed to update booking limits');
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercentage = (current, limit) => {
    if (limit === 0) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return '#ef4444'; // red
    if (percentage >= 70) return '#f59e0b'; // yellow
    return '#10b981'; // green
  };

  if (loadingLimits) {
    return (
      <div className="booking-limits-modal-overlay">
        <div className="booking-limits-modal">
          <div className="modal-header">
            <h2>Booking Limits Manager</h2>
            <button onClick={onClose} className="close-btn">
              <X size={20} />
            </button>
          </div>
          <div className="modal-content loading-state">
            <p>Loading booking limits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-limits-modal-overlay">
      <div className="booking-limits-modal">
        <div className="modal-header">
          <h2>
            <Calendar size={24} />
            Booking Limits Manager
          </h2>
          <button onClick={onClose} className="close-btn" disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="psychologist-info">
            <h3>{psychologist?.name || `${psychologist?.firstName} ${psychologist?.lastName}`}</h3>
            <p className="email">{psychologist?.email}</p>
            <p className="license">License: {psychologist?.licenseNumber}</p>
          </div>

          {/* Current Usage Statistics */}
          <div className="usage-stats">
            <h4>
              <TrendingUp size={18} />
              Current Usage
            </h4>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <span>Weekly</span>
                  <span className="stat-value">{currentUsage.weekly} / {formData.weeklyLimit}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${getUsagePercentage(currentUsage.weekly, formData.weeklyLimit)}%`,
                      backgroundColor: getUsageColor(getUsagePercentage(currentUsage.weekly, formData.weeklyLimit))
                    }}
                  />
                </div>
                <span className="percentage">
                  {getUsagePercentage(currentUsage.weekly, formData.weeklyLimit).toFixed(0)}% used
                </span>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span>Monthly</span>
                  <span className="stat-value">{currentUsage.monthly} / {formData.monthlyLimit}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${getUsagePercentage(currentUsage.monthly, formData.monthlyLimit)}%`,
                      backgroundColor: getUsageColor(getUsagePercentage(currentUsage.monthly, formData.monthlyLimit))
                    }}
                  />
                </div>
                <span className="percentage">
                  {getUsagePercentage(currentUsage.monthly, formData.monthlyLimit).toFixed(0)}% used
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="limits-form">
            <h4>
              <Clock size={18} />
              Set Booking Limits
            </h4>

            <div className="form-group">
              <label htmlFor="weeklyLimit">
                Weekly Booking Limit
                <span className="hint">Maximum bookings allowed per week</span>
              </label>
              <input
                type="number"
                id="weeklyLimit"
                name="weeklyLimit"
                value={formData.weeklyLimit}
                onChange={handleInputChange}
                min="1"
                max="200"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="monthlyLimit">
                Monthly Booking Limit
                <span className="hint">Maximum bookings allowed per month</span>
              </label>
              <input
                type="number"
                id="monthlyLimit"
                name="monthlyLimit"
                value={formData.monthlyLimit}
                onChange={handleInputChange}
                min="1"
                max="500"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <Check size={16} />
                {success}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn-cancel"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-save"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Limits
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingLimitsManager;
