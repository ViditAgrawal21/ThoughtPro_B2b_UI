import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Filter, Plus, Search, Eye, Edit, X } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import './BookingList.css';
import Header from '../Header/Header';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    psychologist: '',
    company: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings(
        currentPage, 
        10, 
        { ...filters, search: searchQuery }
      );
      
      if (response.success) {
        setBookings(response.data.bookings || []);
        setTotalPages(Math.ceil((response.data.total || 0) / 10));
      } else {
        setError(response.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, searchQuery, filters]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      let response;
      switch (newStatus) {
        case 'confirmed':
          response = await bookingService.confirmBooking(bookingId);
          break;
        case 'cancelled':
          response = await bookingService.cancelBooking(bookingId, 'Cancelled by admin');
          break;
        case 'completed':
          response = await bookingService.completeBooking(bookingId);
          break;
        default:
          return;
      }
      
      if (response.success) {
        fetchBookings();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'in-progress': 'status-in-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled',
      'no-show': 'status-no-show'
    };
    return classes[status] || 'status-pending';
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="booking-list-container">
        <div className="loading-spinner">Loading bookings</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-list-container">
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={fetchBookings} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="booking-list-container">
        <div className="booking-list-content">
          <div className="booking-list-header">
        <div className="header-left">
          <Calendar size={32} className="header-icon" />
          <div>
            <h1 className="page-title">Booking Management</h1>
            <p className="page-subtitle">Manage therapy session bookings and schedules</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="create-booking-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} />
            Create Booking
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>

          <select 
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this-week">This Week</option>
            <option value="next-week">Next Week</option>
            <option value="this-month">This Month</option>
          </select>

          <button className="filter-btn">
            <Filter size={16} />
            More Filters
          </button>
        </div>
      </div>

      <div className="bookings-table">
        <div className="table-header">
          <div className="table-row header-row">
            <div className="table-cell">Patient</div>
            <div className="table-cell">Psychologist</div>
            <div className="table-cell">Date & Time</div>
            <div className="table-cell">Duration</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Type</div>
            <div className="table-cell">Actions</div>
          </div>
        </div>
        
        <div className="table-body">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <Calendar size={64} className="empty-icon" />
              <h3>No bookings found</h3>
              <p>No bookings match your current filters</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="create-booking-btn primary"
              >
                <Plus size={20} />
                Create First Booking
              </button>
            </div>
          ) : (
            bookings.map((booking) => {
              const { date, time } = formatDateTime(booking.scheduledDateTime);
              return (
                <div key={booking.id} className="table-row booking-row">
                  <div className="table-cell patient-cell">
                    <div className="patient-info">
                      <div className="patient-avatar">
                        {booking.employee?.profileImage ? (
                          <img src={booking.employee.profileImage} alt={booking.employee.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {booking.employee?.firstName?.charAt(0)}{booking.employee?.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="patient-details">
                        <span className="patient-name">
                          {booking.employee?.firstName} {booking.employee?.lastName}
                        </span>
                        <span className="patient-company">
                          {booking.employee?.company?.name || 'Unknown Company'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="table-cell psychologist-cell">
                    <div className="psychologist-info">
                      <span className="psychologist-name">
                        Dr. {booking.psychologist?.firstName} {booking.psychologist?.lastName}
                      </span>
                      <span className="psychologist-specialization">
                        {booking.psychologist?.specialization || 'Clinical Psychology'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="table-cell datetime-cell">
                    <div className="datetime-info">
                      <div className="date-info">
                        <Calendar size={16} className="datetime-icon" />
                        <span>{date}</span>
                      </div>
                      <div className="time-info">
                        <Clock size={16} className="datetime-icon" />
                        <span>{time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="table-cell duration-cell">
                    <span>{booking.duration || 60} mins</span>
                  </div>
                  
                  <div className="table-cell status-cell">
                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status?.replace('-', ' ').toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                  
                  <div className="table-cell type-cell">
                    <span className="booking-type">
                      {booking.type || 'Individual'}
                    </span>
                    <span className="booking-mode">
                      {booking.mode || 'Video Call'}
                    </span>
                  </div>
                  
                  <div className="table-cell actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit"
                        title="Edit Booking"
                      >
                        <Edit size={16} />
                      </button>
                      {booking.status === 'pending' && (
                        <button 
                          className="action-btn confirm"
                          title="Confirm Booking"
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        >
                          ✓
                        </button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button 
                          className="action-btn cancel"
                          title="Cancel Booking"
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Booking Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Create New Booking</h2>
            <p>Booking creation form would go here</p>
            <button onClick={() => setShowCreateModal(false)}>Close</button>
          </div>
        </div>
      )}
        </div>
      </div>
    </>
  );
};

export default BookingList;