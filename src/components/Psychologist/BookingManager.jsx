import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Clock, AlertCircle, Trash2, ArrowRight, Edit } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { psychologistService } from '../../services/psychologistService';
import './BookingManager.css';

const BookingManager = ({ psychologist, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'
  const [allPsychologists, setAllPsychologists] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reassignTo, setReassignTo] = useState('');
  const [editFormData, setEditFormData] = useState({
    appointment_date: '',
    start_time: '',
    end_time: '',
    session_type: '',
    status: '',
    notes: ''
  });

  useEffect(() => {
    fetchBookings();
    fetchAllPsychologists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [psychologist?.id]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (psychologist?.id) {
        const data = await bookingService.getBookingsByPsychologist(
          psychologist.id
        );
        setBookings(Array.isArray(data) ? data : data.bookings || []);
      } else {
        const data = await bookingService.getAllBookings();
        setBookings(Array.isArray(data) ? data : data.bookings || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPsychologists = async () => {
    try {
      const data = await psychologistService.getAllPsychologists(1, 100);
      setAllPsychologists(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Error fetching psychologists:', err);
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date || booking.appointmentDate);
      const now = new Date();
      
      if (filter === 'upcoming') {
        return bookingDate > now && booking.status !== 'cancelled';
      } else if (filter === 'completed') {
        return bookingDate <= now && booking.status !== 'cancelled';
      } else if (filter === 'cancelled') {
        return booking.status === 'cancelled';
      }
      return true;
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm('Are you sure you want to cancel this booking?')
    ) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId, 'Cancelled by admin');
      fetchBookings();
      showNotification('Booking cancelled successfully', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to cancel booking', 'error');
    }
  };

  const handleReassignBooking = async () => {
    if (!reassignTo) {
      showNotification('Please select a psychologist', 'error');
      return;
    }

    try {
      await bookingService.reassignBooking(selectedBooking.id, reassignTo);
      fetchBookings();
      setShowReassignModal(false);
      setSelectedBooking(null);
      setReassignTo('');
      showNotification('Booking reassigned successfully', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to reassign booking', 'error');
    }
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      appointment_date: booking.appointment_date || booking.date || '',
      start_time: booking.start_time || booking.time || '',
      end_time: booking.end_time || '',
      session_type: booking.session_type || booking.type || '45_minute',
      status: booking.status || 'pending',
      notes: booking.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateBooking = async () => {
    try {
      await bookingService.updateBooking(selectedBooking.id, editFormData);
      fetchBookings();
      setShowEditModal(false);
      setSelectedBooking(null);
      showNotification('Booking updated successfully', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to update booking', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString) => {
    try {
      return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timeString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="booking-manager">
      <div className="manager-header">
        <div>
          <h2>Booking Management</h2>
          {psychologist && (
            <p className="psychologist-subtitle">
              {psychologist.name ||
                `${psychologist.firstName} ${psychologist.lastName}`}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="close-button"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Bookings
          <span className="count">{bookings.length}</span>
        </button>
        <button
          className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
          <span className="count">
            {bookings.filter(
              (b) =>
                new Date(b.date || b.appointmentDate) > new Date() &&
                b.status !== 'cancelled'
            ).length}
          </span>
        </button>
        <button
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
          <span className="count">
            {bookings.filter(
              (b) =>
                new Date(b.date || b.appointmentDate) <= new Date() &&
                b.status !== 'cancelled'
            ).length}
          </span>
        </button>
        <button
          className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
          <span className="count">
            {bookings.filter((b) => b.status === 'cancelled').length}
          </span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-state">
          <AlertCircle size={20} />
          <p>{error}</p>
          <button onClick={fetchBookings} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      )}

      {/* Bookings List */}
      {!loading && !error && (
        <div className="bookings-container">
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <Calendar size={48} />
              <p>No bookings found</p>
            </div>
          ) : (
            <div className="bookings-list">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-title">
                      <Calendar size={18} />
                      <div>
                        <h4>
                          {booking.clientName || booking.client?.name || 'Client'}
                        </h4>
                        <p className="booking-type">
                          {booking.type || 'Session'}
                        </p>
                      </div>
                    </div>
                    <span className={`status-badge ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-details">
                    <div className="detail-item">
                      <Clock size={16} />
                      <div>
                        <span className="detail-label">Date & Time</span>
                        <span className="detail-value">
                          {formatDate(booking.date || booking.appointmentDate)}{' '}
                          at {formatTime(booking.time || booking.appointmentTime)}
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <User size={16} />
                      <div>
                        <span className="detail-label">Client Email</span>
                        <span className="detail-value">
                          {booking.clientEmail || booking.client?.email || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="detail-item">
                        <AlertCircle size={16} />
                        <div>
                          <span className="detail-label">Notes</span>
                          <span className="detail-value">{booking.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    {booking.status !== 'cancelled' && (
                      <>
                        <button
                          className="action-btn edit"
                          onClick={() => handleEditBooking(booking)}
                          title="Edit booking details"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          className="action-btn reassign"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowReassignModal(true);
                          }}
                          title="Reassign to another psychologist"
                        >
                          <ArrowRight size={16} />
                          Reassign
                        </button>
                        <button
                          className="action-btn cancel"
                          onClick={() => handleCancelBooking(booking.id)}
                          title="Cancel booking"
                        >
                          <Trash2 size={16} />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reassign Modal */}
      {showReassignModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content reassign-modal">
            <h3>Reassign Booking</h3>
            <p className="modal-subtitle">
              Select a psychologist to reassign this booking to
            </p>

            <div className="booking-info">
              <p>
                <strong>Client:</strong>{' '}
                {selectedBooking.clientName ||
                  selectedBooking.client?.name ||
                  'Client'}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {formatDate(
                  selectedBooking.date || selectedBooking.appointmentDate
                )}
              </p>
              <p>
                <strong>Time:</strong>{' '}
                {formatTime(
                  selectedBooking.time || selectedBooking.appointmentTime
                )}
              </p>
            </div>

            <div className="form-group">
              <label>Select Psychologist</label>
              <select
                value={reassignTo}
                onChange={(e) => setReassignTo(e.target.value)}
                className="psychologist-select"
              >
                <option value="">-- Choose a psychologist --</option>
                {allPsychologists
                  .filter((p) => p.id !== selectedBooking.psychologistId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || `${p.firstName} ${p.lastName}`}
                    </option>
                  ))}
              </select>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowReassignModal(false);
                  setSelectedBooking(null);
                  setReassignTo('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleReassignBooking}
                className="btn-primary"
              >
                Reassign Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content edit-modal">
            <h3>Edit Booking</h3>
            <p className="modal-subtitle">
              Update booking details for {selectedBooking.clientName || 'Client'}
            </p>

            <div className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Date</label>
                  <input
                    type="date"
                    value={editFormData.appointment_date}
                    onChange={(e) => setEditFormData({ ...editFormData, appointment_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={editFormData.start_time}
                    onChange={(e) => setEditFormData({ ...editFormData, start_time: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={editFormData.end_time}
                    onChange={(e) => setEditFormData({ ...editFormData, end_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Session Type</label>
                  <select
                    value={editFormData.session_type}
                    onChange={(e) => setEditFormData({ ...editFormData, session_type: e.target.value })}
                  >
                    <option value="45_minute">45 Minute Session</option>
                    <option value="20_minute">20 Minute Session</option>
                    <option value="emergency">Emergency Session</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  rows="3"
                  placeholder="Add any notes or special instructions..."
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedBooking(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBooking}
                className="btn-primary"
              >
                Update Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;