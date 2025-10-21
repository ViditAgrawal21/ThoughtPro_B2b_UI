import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  MapPin,
  Search,
  Filter,
  Edit,
  RefreshCw,
  AlertTriangle,
  Phone,
  VideoIcon as Video
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import Header from '../Header/Header';
import './BookingManagement.css';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'confirm', 'cancel', 'reschedule'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookings();
      
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        // Fallback to demo data
        setBookings(getDemoBookings());
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
      setBookings(getDemoBookings());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getDemoBookings = () => [
    {
      id: 'booking_1',
      client_name: 'John Smith',
      client_email: 'john.smith@example.com',
      psychologist_name: 'Dr. Sarah Johnson',
      session_date: '2025-01-25',
      session_time: '10:00',
      duration: 60,
      session_type: 'video',
      status: 'confirmed',
      notes: 'Initial consultation session',
      created_at: '2025-01-20T09:00:00Z',
      location: 'Online',
      phone: '+1-555-0123'
    },
    {
      id: 'booking_2',
      client_name: 'Mary Johnson',
      client_email: 'mary.johnson@example.com',
      psychologist_name: 'Dr. Michael Brown',
      session_date: '2025-01-26',
      session_time: '14:30',
      duration: 45,
      session_type: 'in-person',
      status: 'pending',
      notes: 'Follow-up session',
      created_at: '2025-01-20T11:30:00Z',
      location: 'Main Office, Room 201',
      phone: '+1-555-0124'
    },
    {
      id: 'booking_3',
      client_name: 'Robert Wilson',
      client_email: 'robert.wilson@example.com',
      psychologist_name: 'Dr. Emily Davis',
      session_date: '2025-01-24',
      session_time: '16:00',
      duration: 60,
      session_type: 'phone',
      status: 'cancelled',
      notes: 'Client requested cancellation',
      created_at: '2025-01-18T14:15:00Z',
      location: 'Phone Call',
      phone: '+1-555-0125'
    }
  ];

  const handleBookingAction = async (action, booking) => {
    setSelectedBooking(booking);
    setModalType(action);
    setShowModal(true);
    setError('');
    setSuccess('');
    
    if (action === 'reschedule') {
      setRescheduleForm({
        newDate: '',
        newTime: '',
        reason: ''
      });
    }
  };

  const confirmAction = async () => {
    if (!selectedBooking) return;
    
    setActionLoading(true);
    setError('');

    try {
      let response;
      
      switch (modalType) {
        case 'confirm':
          response = await bookingService.confirmBooking(selectedBooking.id);
          break;
        case 'cancel':
          response = await bookingService.cancelBooking(selectedBooking.id, {
            reason: 'Cancelled by administrator'
          });
          break;
        case 'reschedule':
          if (!rescheduleForm.newDate || !rescheduleForm.newTime) {
            setError('Please select a new date and time');
            setActionLoading(false);
            return;
          }
          response = await bookingService.rescheduleBooking(selectedBooking.id, {
            newDate: rescheduleForm.newDate,
            newTime: rescheduleForm.newTime,
            reason: rescheduleForm.reason
          });
          break;
        default:
          throw new Error('Invalid action type');
      }

      if (response.success) {
        setSuccess(`Booking ${modalType}ed successfully!`);
        setShowModal(false);
        await fetchBookings();
      } else {
        setError(response.message || `Failed to ${modalType} booking`);
      }
    } catch (error) {
      console.error(`${modalType} booking error:`, error);
      setError(`Failed to ${modalType} booking. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setModalType('');
    setError('');
    setRescheduleForm({ newDate: '', newTime: '', reason: '' });
  };

  const handleRescheduleInputChange = (e) => {
    const { name, value } = e.target;
    setRescheduleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="status-icon confirmed" />;
      case 'pending':
        return <Clock className="status-icon pending" />;
      case 'cancelled':
        return <XCircle className="status-icon cancelled" />;
      case 'completed':
        return <CheckCircle className="status-icon completed" />;
      default:
        return <AlertTriangle className="status-icon unknown" />;
    }
  };

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video size={16} />;
      case 'phone':
        return <Phone size={16} />;
      case 'in-person':
        return <MapPin size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.psychologist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const canModifyBooking = (booking) => {
    return ['pending', 'confirmed'].includes(booking.status);
  };

  if (loading) {
    return (
      <div className="booking-page">
        <Header />
        <div className="booking-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading bookings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <Header />
      <div className="booking-container">
        <div className="booking-header">
          <div className="booking-title">
            <Calendar size={28} />
            <div>
              <h1>Booking Management</h1>
              <p>Manage therapy session bookings and schedules</p>
            </div>
          </div>
          <button
            className="refresh-button"
            onClick={fetchBookings}
          >
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-message">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        <div className="booking-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by client, psychologist, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-box">
            <Filter size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="bookings-grid">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className={`booking-card ${booking.status}`}>
                <div className="booking-header-info">
                  <div className="client-info">
                    <h3>{booking.client_name}</h3>
                    <p className="client-email">{booking.client_email}</p>
                  </div>
                  <div className="status-info">
                    {getStatusIcon(booking.status)}
                    <span className={`status-text ${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="session-details">
                  <div className="detail-item">
                    <Users size={16} />
                    <span>Dr. {booking.psychologist_name}</span>
                  </div>
                  
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{formatDate(booking.session_date)} at {formatTime(booking.session_time)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{booking.duration} minutes</span>
                  </div>
                  
                  <div className="detail-item session-type">
                    {getSessionTypeIcon(booking.session_type)}
                    <span>{booking.session_type.charAt(0).toUpperCase() + booking.session_type.slice(1)}</span>
                  </div>
                  
                  {booking.location && (
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{booking.location}</span>
                    </div>
                  )}
                </div>

                {booking.notes && (
                  <div className="booking-notes">
                    <p>{booking.notes}</p>
                  </div>
                )}

                {canModifyBooking(booking) && (
                  <div className="booking-actions">
                    {booking.status === 'pending' && (
                      <button
                        className="action-button confirm"
                        onClick={() => handleBookingAction('confirm', booking)}
                      >
                        <CheckCircle size={16} />
                        Confirm
                      </button>
                    )}
                    <button
                      className="action-button reschedule"
                      onClick={() => handleBookingAction('reschedule', booking)}
                    >
                      <Edit size={16} />
                      Reschedule
                    </button>
                    <button
                      className="action-button cancel"
                      onClick={() => handleBookingAction('cancel', booking)}
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Calendar size={64} />
              <h3>No Bookings Found</h3>
              <p>
                {searchTerm || filterStatus !== 'all' 
                  ? 'No bookings match your current search and filter criteria.' 
                  : 'No bookings have been made yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Action Modal */}
        {showModal && selectedBooking && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  {modalType === 'confirm' && 'Confirm Booking'}
                  {modalType === 'cancel' && 'Cancel Booking'}
                  {modalType === 'reschedule' && 'Reschedule Booking'}
                </h3>
                <button className="modal-close" onClick={closeModal}>
                  <XCircle size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="booking-summary">
                  <h4>Booking Details</h4>
                  <div className="summary-item">
                    <strong>Client:</strong> {selectedBooking.client_name}
                  </div>
                  <div className="summary-item">
                    <strong>Psychologist:</strong> {selectedBooking.psychologist_name}
                  </div>
                  <div className="summary-item">
                    <strong>Date & Time:</strong> {formatDate(selectedBooking.session_date)} at {formatTime(selectedBooking.session_time)}
                  </div>
                  <div className="summary-item">
                    <strong>Type:</strong> {selectedBooking.session_type}
                  </div>
                </div>

                {modalType === 'reschedule' && (
                  <div className="reschedule-form">
                    <h4>New Schedule</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>New Date</label>
                        <input
                          type="date"
                          name="newDate"
                          value={rescheduleForm.newDate}
                          onChange={handleRescheduleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>New Time</label>
                        <input
                          type="time"
                          name="newTime"
                          value={rescheduleForm.newTime}
                          onChange={handleRescheduleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Reason (Optional)</label>
                      <textarea
                        name="reason"
                        value={rescheduleForm.reason}
                        onChange={handleRescheduleInputChange}
                        placeholder="Enter reason for rescheduling..."
                        rows="3"
                      />
                    </div>
                  </div>
                )}

                {modalType === 'cancel' && (
                  <div className="cancel-warning">
                    <AlertTriangle size={24} />
                    <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={closeModal}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  className={`confirm-button ${modalType}`}
                  onClick={confirmAction}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <div className="button-spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {modalType === 'confirm' && <><CheckCircle size={20} /> Confirm Booking</>}
                      {modalType === 'cancel' && <><XCircle size={20} /> Cancel Booking</>}
                      {modalType === 'reschedule' && <><Edit size={20} /> Reschedule</>}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;