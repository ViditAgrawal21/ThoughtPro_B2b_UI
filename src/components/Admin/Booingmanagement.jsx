import React, { useState, useEffect } from 'react';
import { X, Search, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { bookingService, adminService } from '../../services/bookingService';
import './BookingManagement.css';

const BookingManagement = ({ psychologist, onClose, psychologists = [] }) => {
  const [activeTab, setActiveTab] = useState('specific');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [reassignModal, setReassignModal] = useState(null);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  });

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedStatus, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (activeTab === 'specific' && psychologist?.id) {
        data = await bookingService.getBookingsByPsychologist(psychologist.id);
      } else {
        data = await bookingService.getAllBookings();
      }

      const bookingsArray = Array.isArray(data) ? data : data.bookings || [];
      setBookings(bookingsArray);

      // Calculate stats
      const stats = {
        totalBookings: bookingsArray.length || 0,
        confirmedBookings:
          bookingsArray.filter(b => b.status === 'confirmed').length || 0,
        pendingBookings:
          bookingsArray.filter(b => b.status === 'pending').length || 0,
        completedBookings:
          bookingsArray.filter(b => b.status === 'completed').length || 0,
        cancelledBookings:
          bookingsArray.filter(b => b.status === 'cancelled').length || 0
      };
      setStats(stats);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = bookings;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        b =>
          b.clientName?.toLowerCase().includes(query) ||
          b.clientEmail?.toLowerCase().includes(query) ||
          b.id?.toLowerCase().includes(query)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(b => b.status === selectedStatus);
    }

    setFilteredBookings(filtered);
  };

  const handleReassign = async () => {
    if (!reassignModal || !selectedPsychologist) {
      setError('Please select a psychologist');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await bookingService.reassignBooking(reassignModal.id, selectedPsychologist);
      setSuccess('Booking reassigned successfully!');
      setReassignModal(null);
      setSelectedPsychologist(null);
      fetchBookings();
    } catch (err) {
      setError(err.message || 'Failed to reassign booking');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFullName = () => {
    return psychologist?.name ||
      `${psychologist?.firstName || ''} ${psychologist?.lastName || ''}`.trim();
  };

  return (
    <div className="booking-management">
      {/* Header */}
      <div className="manager-header">
        <div>
          <h2>Booking Management</h2>
          {psychologist && (
            <p className="psychologist-id">
              {getFullName()} • ID: {psychologist?.id}
            </p>
          )}
        </div>
        <button onClick={onClose} className="close-button" title="Close">
          <X size={24} />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{stats.totalBookings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Confirmed</div>
          <div className="stat-value" style={{ color: '#22c55e' }}>
            {stats.confirmedBookings}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {stats.pendingBookings}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value" style={{ color: '#3b82f6' }}>
            {stats.completedBookings}
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
      {psychologist && (
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'specific' ? 'active' : ''}`}
            onClick={() => setActiveTab('specific')}
          >
            Psychologist Bookings
          </button>
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by client name, email, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-filter"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Content */}
      <div className="bookings-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <p>
              {bookings.length === 0
                ? 'No bookings found.'
                : 'No bookings match your filters.'}
            </p>
          </div>
        ) : (
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Client</th>
                  <th>Date & Time</th>
                  <th>Psychologist</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>
                      <span className="booking-id">{booking.id}</span>
                    </td>
                    <td>
                      <div className="client-info">
                        <div className="client-name">{booking.clientName}</div>
                        <div className="client-email">{booking.clientEmail}</div>
                      </div>
                    </td>
                    <td>
                      <div className="booking-time">
                        {formatDate(booking.scheduledDate)}
                      </div>
                    </td>
                    <td>
                      <div className="psychologist-info">
                        {booking.psychologist?.name ||
                          `${booking.psychologist?.firstName} ${booking.psychologist?.lastName}`}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusBadgeColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="booking-actions">
                        <button
                          onClick={() => setReassignModal(booking)}
                          className="action-btn reassign"
                          title="Reassign booking"
                          disabled={booking.status === 'completed'}
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reassign Modal */}
      {reassignModal && (
        <div className="modal-overlay" onClick={() => setReassignModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="reassign-modal">
              <h3>Reassign Booking</h3>
              <p className="reassign-info">
                Booking ID: {reassignModal.id}
                <br />
                Current: {reassignModal.psychologist?.name}
                <br />
                Date: {formatDate(reassignModal.scheduledDate)}
              </p>

              <div className="form-group">
                <label htmlFor="newPsychologist">Select New Psychologist *</label>
                <select
                  id="newPsychologist"
                  value={selectedPsychologist || ''}
                  onChange={(e) => setSelectedPsychologist(e.target.value)}
                  disabled={loading}
                >
                  <option value="">-- Choose Psychologist --</option>
                  {psychologists
                    .filter(p => p.id !== reassignModal.psychologist?.id && !p.is_disabled)
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name || `${p.firstName} ${p.lastName}`} ({p.specializations?.[0]})
                      </option>
                    ))}
                </select>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setReassignModal(null);
                    setSelectedPsychologist(null);
                  }}
                  className="cancel-button"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReassign}
                  className="submit-button"
                  disabled={loading || !selectedPsychologist}
                >
                  {loading ? 'Reassigning...' : 'Reassign Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;