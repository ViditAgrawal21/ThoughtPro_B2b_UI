import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Trash2, AlertCircle, Check } from 'lucide-react';
import { availabilityService } from '../../services/availabilityService';
import './AvailabilityManager.css';

const AvailabilityManager = ({ psychologist, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [slots, setSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [holidaysLoading, setHolidaysLoading] = useState(false);

  // Form state for creating slots
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30 // minutes
  });

  // Form state for holidays
  const [holidayData, setHolidayData] = useState({
    date: '',
    name: '',
    description: ''
  });

  // Stats
  const [stats, setStats] = useState({
    totalSlots: 0,
    availableSlots: 0,
    bookedSlots: 0,
    blockedSlots: 0
  });

  useEffect(() => {
    if (psychologist?.id) {
      fetchSlots();
      fetchHolidays();
    }
  }, [psychologist?.id, activeTab]);

  const fetchSlots = async () => {
    try {
      setSlotsLoading(true);
      const data = await availabilityService.getAvailabilityByPsychologist(
        psychologist.id
      );
      setSlots(Array.isArray(data) ? data : data.slots || []);

      // Calculate stats
      const stats = {
        totalSlots: data.length || 0,
        availableSlots: data.filter(s => s.status === 'available').length || 0,
        bookedSlots: data.filter(s => s.status === 'booked').length || 0,
        blockedSlots: data.filter(s => s.status === 'blocked').length || 0
      };
      setStats(stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setSlotsLoading(false);
    }
  };

  const fetchHolidays = async () => {
    try {
      setHolidaysLoading(true);
      const data = await availabilityService.getAllHolidays();
      setHolidays(Array.isArray(data) ? data : data.holidays || []);
    } catch (err) {
      console.error('Error fetching holidays:', err);
    } finally {
      setHolidaysLoading(false);
    }
  };

  const handleCreateSlots = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.startDate || !formData.endDate) {
      setError('Please select start and end dates');
      return;
    }

    setLoading(true);
    try {
      await availabilityService.createBulkSlots({
        psychologistIds: [psychologist.id],
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        slotDuration: formData.slotDuration
      });

      setSuccess('Availability slots created successfully!');
      setFormData({
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30
      });
      fetchSlots();
    } catch (err) {
      setError(err.message || 'Failed to create slots');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!holidayData.date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    try {
      await availabilityService.addHoliday(holidayData);
      setSuccess('Holiday added successfully!');
      setHolidayData({ date: '', name: '', description: '' });
      fetchHolidays();
    } catch (err) {
      setError(err.message || 'Failed to add holiday');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await availabilityService.deleteSlot(slotId);
        setSuccess('Slot deleted successfully!');
        fetchSlots();
      } catch (err) {
        setError(err.message || 'Failed to delete slot');
      }
    }
  };

  const handleDeleteHoliday = async (holidayId) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        await availabilityService.deleteHoliday(holidayId);
        setSuccess('Holiday deleted successfully!');
        fetchHolidays();
      } catch (err) {
        setError(err.message || 'Failed to delete holiday');
      }
    }
  };

  const getFullName = () => {
    return psychologist?.name ||
      `${psychologist?.firstName || ''} ${psychologist?.lastName || ''}`.trim();
  };

  return (
    <div className="availability-manager">
      {/* Header */}
      <div className="manager-header">
        <div>
          <h2>Availability Manager</h2>
          <p className="psychologist-id">{getFullName()} • ID: {psychologist?.id}</p>
        </div>
        <button onClick={onClose} className="close-button" title="Close">
          <X size={24} />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-label">Total Slots</div>
          <div className="stat-value">{stats.totalSlots}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available</div>
          <div className="stat-value" style={{ color: '#22c55e' }}>
            {stats.availableSlots}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Booked</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {stats.bookedSlots}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Blocked</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>
            {stats.blockedSlots}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <div className="alert-content">{error}</div>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <Check size={18} />
          <div className="alert-content">{success}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <Plus size={16} />
          Create Slots
        </button>
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          <Calendar size={16} />
          View Slots ({stats.totalSlots})
        </button>
        <button
          className={`tab-button ${activeTab === 'holidays' ? 'active' : ''}`}
          onClick={() => setActiveTab('holidays')}
        >
          <Calendar size={16} />
          Holidays ({holidays.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Create Slots Tab */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSlots} className="form">
            <h3>Create Bulk Availability Slots</h3>

            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">Start Time *</label>
                <input
                  type="time"
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time *</label>
                <input
                  type="time"
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="slotDuration">Slot Duration (minutes)</label>
              <input
                type="number"
                id="slotDuration"
                value={formData.slotDuration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slotDuration: parseInt(e.target.value)
                  })
                }
                min="15"
                max="120"
                step="15"
                disabled={loading}
              />
            </div>

            <div className="info-box">
              <h4>Bulk Creation Info</h4>
              <ul>
                <li>Slots will be created for each day in the date range</li>
                <li>Existing slots will not be overwritten</li>
                <li>Slots are created automatically at specified intervals</li>
              </ul>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              <Plus size={16} />
              {loading ? 'Creating...' : 'Create Slots'}
            </button>
          </form>
        )}

        {/* View Slots Tab */}
        {activeTab === 'view' && (
          <div className="slots-list">
            <h3>Available Slots</h3>
            {slotsLoading ? (
              <div className="loading">Loading slots...</div>
            ) : slots.length === 0 ? (
              <div className="no-slots">No slots found. Create some slots first.</div>
            ) : (
              <div className="slots-grid">
                {slots.map(slot => (
                  <div
                    key={slot.id}
                    className={`slot-card slot-${slot.status}`}
                  >
                    <div className="slot-info">
                      <div className="slot-date">
                        {new Date(slot.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="slot-time">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <span className={`slot-status slot-status-${slot.status}`}>
                        {slot.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="delete-slot-btn"
                      title="Delete slot"
                      disabled={slot.status === 'booked'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Holidays Tab */}
        {activeTab === 'holidays' && (
          <form onSubmit={handleAddHoliday} className="form">
            <h3>Manage Holidays</h3>

            <div className="form-group">
              <label htmlFor="holidayDate">Date *</label>
              <input
                type="date"
                id="holidayDate"
                value={holidayData.date}
                onChange={(e) =>
                  setHolidayData({ ...holidayData, date: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="holidayName">Holiday Name</label>
              <input
                type="text"
                id="holidayName"
                placeholder="e.g., Christmas, Diwali"
                value={holidayData.name}
                onChange={(e) =>
                  setHolidayData({ ...holidayData, name: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="holidayDescription">Description</label>
              <input
                type="text"
                id="holidayDescription"
                placeholder="Optional description"
                value={holidayData.description}
                onChange={(e) =>
                  setHolidayData({
                    ...holidayData,
                    description: e.target.value
                  })
                }
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              <Plus size={16} />
              {loading ? 'Adding...' : 'Add Holiday'}
            </button>

            {/* List of Holidays */}
            {holidays.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h4>Holidays</h4>
                <div className="holidays-list">
                  {holidays.map(holiday => (
                    <div key={holiday.id} className="holiday-item">
                      <div className="holiday-info">
                        <div className="holiday-date">
                          {new Date(holiday.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        {holiday.name && (
                          <div className="holiday-name">{holiday.name}</div>
                        )}
                        {holiday.description && (
                          <div className="holiday-description">
                            {holiday.description}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteHoliday(holiday.id)}
                        className="delete-holiday-btn"
                        title="Delete holiday"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AvailabilityManager;