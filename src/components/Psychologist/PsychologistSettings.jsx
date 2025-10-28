import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle, Check } from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import { availabilityService } from '../../services/availabilityService';
import './PsychologistSettings.css';

const PsychologistSettings = ({ psychologist, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    displayCharges: psychologist?.displayCharges || 0,
    costToSynept: psychologist?.costToSynept || 0,
    weeklySessionsAllowed: psychologist?.weeklySessionsAllowed || 10,
    monthlySessionsAllowed: psychologist?.monthlySessionsAllowed || 40,
  });
  const [sessionStats, setSessionStats] = useState({
    currentWeeklySlots: 0,
    currentMonthlySlots: 0,
    weeklyLimit: formData.weeklySessionsAllowed,
    monthlyLimit: formData.monthlySessionsAllowed,
    loadingStats: true,
  });

  // Fetch current session counts on mount
  useEffect(() => {
    fetchSessionStats();
  }, [psychologist?.id]);

  const fetchSessionStats = async () => {
    try {
      setSessionStats(prev => ({ ...prev, loadingStats: true }));
      
      if (!psychologist?.id) {
        setSessionStats(prev => ({ ...prev, loadingStats: false }));
        return;
      }

      // Get current available slots
      const currentWeekly = await availabilityService.countAvailableSlots(
        psychologist.id,
        getWeekStartDate(),
        getWeekEndDate()
      );

      const currentMonthly = await availabilityService.countAvailableSlots(
        psychologist.id,
        getMonthStartDate(),
        getMonthEndDate()
      );

      setSessionStats({
        currentWeeklySlots: currentWeekly || 0,
        currentMonthlySlots: currentMonthly || 0,
        weeklyLimit: formData.weeklySessionsAllowed,
        monthlyLimit: formData.monthlySessionsAllowed,
        loadingStats: false,
      });
    } catch (err) {
      console.error('Error fetching session stats:', err);
      // Set stats to 0 if error - don't block form
      setSessionStats(prev => ({ 
        ...prev, 
        currentWeeklySlots: 0,
        currentMonthlySlots: 0,
        loadingStats: false 
      }));
    }
  };

  const getWeekStartDate = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return start.toISOString().split('T')[0];
  };

  const getWeekEndDate = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() + 7);
    return start.toISOString().split('T')[0];
  };

  const getMonthStartDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
  };

  const getMonthEndDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Sessions') ? parseInt(value) : parseFloat(value)
    }));
    setError(null);
  };

  const validateForm = () => {
    const errors = [];

    if (formData.displayCharges < 0) {
      errors.push('Display Charges cannot be negative');
    }

    if (formData.costToSynept < 0) {
      errors.push('Cost To Synept cannot be negative');
    }

    if (formData.weeklySessionsAllowed < 1) {
      errors.push('Weekly Sessions Allowed must be at least 1');
    }

    if (formData.monthlySessionsAllowed < 1) {
      errors.push('Monthly Sessions Allowed must be at least 1');
    }

    if (formData.monthlySessionsAllowed < formData.weeklySessionsAllowed) {
      errors.push('Monthly Sessions cannot be less than Weekly Sessions');
    }

    // Check if current slots exceed new limits
    if (sessionStats.currentWeeklySlots > formData.weeklySessionsAllowed) {
      errors.push(
        `Current weekly slots (${sessionStats.currentWeeklySlots}) exceed new limit (${formData.weeklySessionsAllowed})`
      );
    }

    if (sessionStats.currentMonthlySlots > formData.monthlySessionsAllowed) {
      errors.push(
        `Current monthly slots (${sessionStats.currentMonthlySlots}) exceed new limit (${formData.monthlySessionsAllowed})`
      );
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedPsychologist = await psychologistService.updatePsychologistSettings(
        psychologist.id,
        formData
      );

      setSuccess('Settings updated successfully!');
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      // Check if error is due to existing bookings
      if (err.message?.includes('booking') || err.message?.includes('booked')) {
        setError(
          'Cannot update: Already existing bookings must stay in place.'
        );
      } else {
        setError(err.message || 'Failed to update settings');
      }
      console.error('Error updating settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFullName = () => {
    return psychologist?.name ||
           `${psychologist?.firstName || ''} ${psychologist?.lastName || ''}`.trim();
  };

  return (
    <div className="psychologist-settings">
      <div className="settings-header">
        <div>
          <h2>Update Settings</h2>
          <p className="psychologist-name-subtitle">
            {getFullName()} {psychologist?.licenseNumber && `• ${psychologist.licenseNumber}`}
          </p>
        </div>
        <button onClick={onClose} className="close-button" title="Close">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <div className="alert-content">
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="alert alert-success">
            <Check size={18} />
            <div className="alert-content">
              <p>{success}</p>
            </div>
          </div>
        )}

        {/* Display Charges */}
        <div className="form-group">
          <label htmlFor="displayCharges">
            Display Charges
            <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              id="displayCharges"
              name="displayCharges"
              value={formData.displayCharges}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              disabled={loading}
            />
          </div>
          <span className="help-text">
            Amount displayed to clients for a single session
          </span>
        </div>

        {/* Cost To Synept */}
        <div className="form-group">
          <label htmlFor="costToSynept">
            Cost To Synept
            <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              id="costToSynept"
              name="costToSynept"
              value={formData.costToSynept}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              disabled={loading}
            />
          </div>
          <span className="help-text">
            Your cost or platform fee per session
          </span>
        </div>

        {/* Session Limits Section */}
        <div className="session-limits-section">
          <h3>Session Limits</h3>
          <p className="section-description">
            Maximum available slots per week and month
          </p>

          <div className="limits-row">
            {/* Weekly Sessions */}
            <div className="form-group">
              <label htmlFor="weeklySessionsAllowed">
                Weekly Sessions
                <span className="required">*</span>
              </label>
              <input
                type="number"
                id="weeklySessionsAllowed"
                name="weeklySessionsAllowed"
                value={formData.weeklySessionsAllowed}
                onChange={handleInputChange}
                min="1"
                step="1"
                disabled={loading}
              />
              {!sessionStats.loadingStats && (
                <span className="help-text">
                  Current: {sessionStats.currentWeeklySlots} / {formData.weeklySessionsAllowed}
                </span>
              )}
            </div>

            {/* Monthly Sessions */}
            <div className="form-group">
              <label htmlFor="monthlySessionsAllowed">
                Monthly Sessions
                <span className="required">*</span>
              </label>
              <input
                type="number"
                id="monthlySessionsAllowed"
                name="monthlySessionsAllowed"
                value={formData.monthlySessionsAllowed}
                onChange={handleInputChange}
                min="1"
                step="1"
                disabled={loading}
              />
              {!sessionStats.loadingStats && (
                <span className="help-text">
                  Current: {sessionStats.currentMonthlySlots} / {formData.monthlySessionsAllowed}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <h4>Important Notes</h4>
          <ul>
            <li>Existing bookings will remain unchanged</li>
            <li>You cannot lower limits below current slots</li>
            <li>Changes take effect immediately</li>
          </ul>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            <Save size={18} />
            {loading ? 'Updating...' : 'Update Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PsychologistSettings;