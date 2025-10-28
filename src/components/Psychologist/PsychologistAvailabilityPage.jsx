import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  Save,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import { availabilityService } from '../../services/availabilityService';
import { holidayService } from '../../services/holidayService';
import AdminHeader from '../Header/AdminHeader';
import BookingManager from './BookingManager';
import './PsychologistAvailabilityPage.css';

const PsychologistAvailabilityPage = () => {
  const { psychologistId } = useParams();
  const navigate = useNavigate();
  
  const [psychologist, setPsychologist] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookings, setShowBookings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    status: 'Available'
  });
  const [bulkConfig, setBulkConfig] = useState({
    numDays: 30,
    startTime: '09:00',
    endTime: '18:00'
  });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showToggleDayModal, setShowToggleDayModal] = useState(false);
  const [toggleDayStatus, setToggleDayStatus] = useState('Unavailable');

  // Status options based on API documentation: Available, Unavailable, Break
  const statusOptions = ['Available', 'Unavailable', 'Break'];

  const loadPsychologistData = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await psychologistService.getPsychologistById(psychologistId);
      
      // Handle different response structures
      const psychologistData = data?.data || data;
      console.log('Loaded psychologist data:', psychologistData);
      setPsychologist(psychologistData);
    } catch (err) {
      setError('Failed to load psychologist data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [psychologistId]);

  const loadAvailability = React.useCallback(async () => {
    try {
      const data = await availabilityService.getAvailabilityByPsychologist(psychologistId);
      
      // Ensure we always set an array
      let slots = [];
      if (Array.isArray(data)) {
        slots = data;
      } else if (data && Array.isArray(data.data)) {
        slots = data.data;
      } else if (data && data.success && Array.isArray(data.data)) {
        slots = data.data;
      }
      
      setAvailability(slots);
    } catch (err) {
      console.error('Error loading availability:', err);
      setAvailability([]);
    }
  }, [psychologistId]);

  const loadHolidays = useCallback(async () => {
    try {
      // Get holidays for current year (combines backend + local Indian holidays)
      const currentYear = currentDate.getFullYear();
      const holidayList = await holidayService.getAllHolidays(currentYear);
      console.log('Loaded holidays:', holidayList);
      setHolidays(holidayList);
    } catch (err) {
      console.error('Error loading holidays:', err);
      // Fallback to local holidays
      const currentYear = currentDate.getFullYear();
      const fallbackHolidays = holidayService.getHolidaysForYear(currentYear);
      setHolidays(fallbackHolidays);
    }
  }, [currentDate]);

  useEffect(() => {
    loadPsychologistData();
    loadHolidays();
  }, [loadPsychologistData, loadHolidays]);

  useEffect(() => {
    if (psychologistId) {
      loadAvailability();
    }
  }, [psychologistId, loadAvailability]);

  // Reload holidays when month/year changes
  useEffect(() => {
    loadHolidays();
  }, [loadHolidays]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAvailabilityForDate = (date) => {
    if (!date) return [];
    
    // Safety check: ensure availability is an array
    if (!Array.isArray(availability)) {
      console.warn('Availability is not an array:', availability);
      return [];
    }
    
    const dateStr = date.toISOString().split('T')[0];
    return availability.filter(slot => {
      const slotDate = new Date(slot.time_slot).toISOString().split('T')[0];
      return slotDate === dateStr;
    });
  };

  const getHolidayForDate = (date) => {
    if (!date || !Array.isArray(holidays)) return null;
    
    // Format both dates as YYYY-MM-DD for comparison
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const holiday = holidays.find(holiday => {
      if (!holiday.date) return false;
      // Handle both ISO string and simple date format
      const holidayDateStr = holiday.date.split('T')[0];
      return holidayDateStr === dateStr;
    });
    
    if (holiday) {
      console.log(`Holiday found for ${dateStr}:`, holiday);
    }
    
    return holiday;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    // Toggle selection: if clicking the same date, unselect it
    if (selectedDate && selectedDate.toDateString() === date.toDateString()) {
      setSelectedDate(null);
      setNewSlot({
        ...newSlot,
        date: ''
      });
    } else {
      setSelectedDate(date);
      setNewSlot({
        ...newSlot,
        date: date.toISOString().split('T')[0]
      });
    }
  };

  const handleAddSlot = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Create proper ISO datetime string
      const dateTimeString = `${newSlot.date}T${newSlot.startTime}:00.000Z`;
      
      console.log('Creating slot with data:', {
        psychologist_id: psychologistId,
        time_slot: dateTimeString,
        availability_status: newSlot.status
      });
      
      await availabilityService.createSlot({
        psychologist_id: psychologistId,
        time_slot: dateTimeString,
        availability_status: newSlot.status
      });
      
      setSuccess('Availability slot added successfully');
      setShowAddSlotModal(false);
      loadAvailability();
      
      // Reset form
      setNewSlot({
        date: '',
        startTime: '09:00',
        endTime: '10:00',
        status: 'Available'
      });
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding slot:', err);
      setError(err.message || 'Failed to add availability slot');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;
    
    try {
      setSaving(true);
      await availabilityService.deleteSlot(slotId);
      setSuccess('Slot deleted successfully');
      loadAvailability();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete slot');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSlotStatus = async (slotId, newStatus) => {
    try {
      setSaving(true);
      await availabilityService.updateSlotStatus(slotId, {
        availability_status: newStatus
      });
      setSuccess('Status updated successfully');
      loadAvailability();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update status');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleBulkCreate = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await availabilityService.createBulkSlots({
        psychologist_ids: [psychologistId],
        num_days: parseInt(bulkConfig.numDays),
        start_time: bulkConfig.startTime,
        end_time: bulkConfig.endTime
      });
      
      setSuccess(`Successfully created slots for ${bulkConfig.numDays} days`);
      setShowBulkModal(false);
      loadAvailability();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating bulk slots:', err);
      setError(err.message || 'Failed to create bulk availability slots');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDay = async () => {
    if (!selectedDate) return;
    
    try {
      setSaving(true);
      setError(null);
      
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      await availabilityService.toggleDayAvailability({
        psychologist_id: psychologistId,
        date: dateStr,
        status: toggleDayStatus
      });
      
      setSuccess(`All slots for ${dateStr} set to ${toggleDayStatus}`);
      setShowToggleDayModal(false);
      loadAvailability();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error toggling day:', err);
      setError(err.message || 'Failed to toggle day availability');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'status-available';
      case 'unavailable':
        return 'status-unavailable';
      case 'break':
        return 'status-break';
      default:
        return 'status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return <CheckCircle size={14} />;
      case 'unavailable':
        return <XCircle size={14} />;
      case 'break':
        return <Clock size={14} />;
      default:
        return null;
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="availability-page">
        <AdminHeader />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="availability-page">
      <AdminHeader />
      
      <div className="availability-content">
        {/* Page Header */}
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="page-title-section">
            <div className="psychologist-info">
              <div className="avatar-large">
                {psychologist?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase() || '?'}
              </div>
              <div>
                <h1>{psychologist?.name || 'Psychologist'}</h1>
                <p className="subtitle">Availability Management</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowBookings(true)}
              className="btn-view-bookings"
            >
              <Users size={18} />
              View Bookings
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="message success-message">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="message error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Calendar Controls */}
        <div className="calendar-controls">
          <button onClick={handlePrevMonth} className="nav-button">
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <h2 className="current-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button onClick={handleNextMonth} className="nav-button">
            Next
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Quick Actions Bar */}
        <div className="quick-actions-bar">
          <button 
            onClick={() => setShowBulkModal(true)} 
            className="btn-quick-action bulk"
            title="Create slots for multiple days (9 AM - 6 PM, skips weekends)"
          >
            <CalendarIcon size={16} />
            Bulk Create Slots
          </button>
          
          {selectedDate && (
            <button 
              onClick={() => setShowToggleDayModal(true)} 
              className="btn-quick-action toggle"
              title="Set all slots for selected date to same status"
            >
              <Clock size={16} />
              Toggle Entire Day
            </button>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-container">
          <div className="calendar-header">
            {dayNames.map(day => (
              <div key={day} className="calendar-day-name">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {getDaysInMonth(currentDate).map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="calendar-day empty"></div>;
              }

              const slots = getAvailabilityForDate(date);
              const holiday = getHolidayForDate(date);
              const isToday = new Date().toDateString() === date.toDateString();
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const isHoliday = !!holiday;

              return (
                <div
                  key={index}
                  className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${slots.length > 0 ? 'has-slots' : ''} ${isHoliday ? 'has-holiday' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="day-number">{date.getDate()}</div>
                  
                  {holiday && (
                    <div className="holiday-indicator" title={holiday.description}>
                      <span className="holiday-icon">🎉</span>
                      <span className="holiday-name">{holiday.description}</span>
                    </div>
                  )}
                  
                  {slots.length > 0 && (
                    <div className="day-slots">
                      {slots.slice(0, 3).map((slot, idx) => (
                        <div 
                          key={idx} 
                          className={`slot-indicator ${getStatusColor(slot.availability_status)}`}
                          title={`${formatTime(slot.time_slot)} - ${slot.availability_status}`}
                        >
                          {getStatusIcon(slot.availability_status)}
                        </div>
                      ))}
                      {slots.length > 3 && (
                        <div className="more-slots">+{slots.length - 3}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="date-details">
            <div className="details-header">
              <h3>
                <CalendarIcon size={20} />
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button 
                onClick={() => setShowAddSlotModal(true)}
                className="btn-add-slot"
              >
                <Plus size={16} />
                Add Slot
              </button>
            </div>

            {/* Holiday Banner */}
            {getHolidayForDate(selectedDate) && (
              <div className="holiday-banner">
                <span className="holiday-banner-icon">🎉</span>
                <div className="holiday-banner-content">
                  <strong>{getHolidayForDate(selectedDate).description}</strong>
                  <small>This is a public holiday</small>
                </div>
              </div>
            )}

            <div className="slots-list">
              {getAvailabilityForDate(selectedDate).length === 0 ? (
                <div className="no-slots">
                  <Clock size={32} />
                  <p>No availability slots for this day</p>
                  <button onClick={() => setShowAddSlotModal(true)} className="btn-secondary">
                    Add First Slot
                  </button>
                </div>
              ) : (
                getAvailabilityForDate(selectedDate)
                  .sort((a, b) => new Date(a.time_slot) - new Date(b.time_slot))
                  .map((slot) => (
                    <div key={slot.id} className={`slot-card ${getStatusColor(slot.availability_status)}`}>
                      <div className="slot-info">
                        <div className="slot-time">
                          <Clock size={16} />
                          {formatTime(slot.time_slot)}
                        </div>
                        <select
                          value={slot.availability_status}
                          onChange={(e) => handleUpdateSlotStatus(slot.id, e.target.value)}
                          className="status-select"
                          disabled={saving}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="btn-delete"
                        disabled={saving}
                        title="Delete slot"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* Add Slot Modal */}
        {showAddSlotModal && (
          <div className="modal-overlay" onClick={() => setShowAddSlotModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Availability Slot</h3>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>End Time</label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newSlot.status}
                    onChange={(e) => setNewSlot({ ...newSlot, status: e.target.value })}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => setShowAddSlotModal(false)}
                  className="btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSlot}
                  className="btn-primary"
                  disabled={saving || !newSlot.date}
                >
                  <Save size={16} />
                  {saving ? 'Adding...' : 'Add Slot'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Create Modal */}
        {showBulkModal && (
          <div className="modal-overlay" onClick={() => setShowBulkModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Bulk Create Availability Slots</h3>
                <p className="modal-description">
                  Creates slots from 9 AM to 6 PM in 30-minute intervals. 
                  Automatically skips weekends and holidays.
                </p>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Number of Days (Max 365)</label>
                  <input
                    type="number"
                    value={bulkConfig.numDays}
                    onChange={(e) => setBulkConfig({ ...bulkConfig, numDays: e.target.value })}
                    min="1"
                    max="365"
                    placeholder="30"
                  />
                  <small>Slots will be created for the next {bulkConfig.numDays} days</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      value={bulkConfig.startTime}
                      onChange={(e) => setBulkConfig({ ...bulkConfig, startTime: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>End Time</label>
                    <input
                      type="time"
                      value={bulkConfig.endTime}
                      onChange={(e) => setBulkConfig({ ...bulkConfig, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="info-box">
                  <AlertCircle size={16} />
                  <div>
                    <strong>Note:</strong> This will create availability slots for all working hours. 
                    Existing slots will be skipped (no duplicates).
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => setShowBulkModal(false)}
                  className="btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBulkCreate}
                  className="btn-primary"
                  disabled={saving || !bulkConfig.numDays}
                >
                  <CalendarIcon size={16} />
                  {saving ? 'Creating...' : `Create ${bulkConfig.numDays} Days`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Day Modal */}
        {showToggleDayModal && selectedDate && (
          <div className="modal-overlay" onClick={() => setShowToggleDayModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Toggle Entire Day Status</h3>
                <p className="modal-description">
                  Set all slots for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} to the same status.
                </p>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Set All Slots To</label>
                  <select
                    value={toggleDayStatus}
                    onChange={(e) => setToggleDayStatus(e.target.value)}
                    className="large-select"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="info-box">
                  <AlertCircle size={16} />
                  <div>
                    <strong>Note:</strong> This will update all existing slots for this date. 
                    Only slots that already exist will be affected.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => setShowToggleDayModal(false)}
                  className="btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleToggleDay}
                  className="btn-primary"
                  disabled={saving}
                >
                  <CheckCircle size={16} />
                  {saving ? 'Updating...' : 'Update All Slots'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Manager Modal */}
      {showBookings && psychologist && (
        <div className="modal-overlay-full">
          <div className="modal-full-content">
            <BookingManager 
              psychologist={psychologist} 
              onClose={() => setShowBookings(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychologistAvailabilityPage;
