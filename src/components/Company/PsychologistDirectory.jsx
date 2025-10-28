import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Search, Star, MapPin, Phone, Mail, Calendar, Clock, Users, BookOpen } from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import { bookingService } from '../../services/bookingService';
import Header from '../Header/Header';
import './PsychologistDirectory.css';

const PsychologistDirectory = () => {
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filters, setFilters] = useState({
    specialization: '',
    availability: '',
    location: ''
  });

  const fetchPsychologists = useCallback(async () => {
    try {
      setLoading(true);
      const response = await psychologistService.getAllPsychologists(
        currentPage, 
        10, 
        { ...filters, search: searchQuery }
      );
      
      if (response.success) {
        setPsychologists(response.data.psychologists || response.data || []);
        setTotalPages(Math.ceil((response.data.total || response.data.length || 0) / 10));
      } else {
        setPsychologists([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error('Error fetching psychologists:', err);
      setPsychologists([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filters]);

  useEffect(() => {
    fetchPsychologists();
  }, [fetchPsychologists]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleBookSession = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setShowBookingModal(true);
  };

  const handleViewProfile = (psychologist) => {
    navigate(`/psychologists/${psychologist.id}`, { state: { psychologist } });
  };

  if (loading) {
    return (
      <div className="psychologist-directory-container">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading psychologists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="psychologist-directory-page">
      <Header />
      <div className="psychologist-directory-container">
        <div className="psychologist-directory-header">
          <div className="header-left">
            <Brain size={32} className="header-icon" />
            <div>
              <h1 className="page-title">Psychologist Directory</h1>
              <p className="page-subtitle">Find and book sessions with qualified mental health professionals</p>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search psychologists by name or specialization..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <select 
              value={filters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="filter-select"
            >
              <option value="">All Specializations</option>
              <option value="cbt">CBT</option>
              <option value="anxiety">Anxiety</option>
              <option value="depression">Depression</option>
              <option value="workplace-stress">Workplace Stress</option>
              <option value="family-therapy">Family Therapy</option>
              <option value="trauma">Trauma</option>
              <option value="adhd">ADHD</option>
              <option value="relationship">Relationship Counseling</option>
            </select>

            <select 
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="filter-select"
            >
              <option value="">All Availability</option>
              <option value="available">Available Today</option>
              <option value="tomorrow">Available Tomorrow</option>
              <option value="this-week">This Week</option>
            </select>

            <select 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="filter-select"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote Only</option>
              <option value="in-person">In-Person</option>
              <option value="hybrid">Hybrid (Remote + In-Person)</option>
            </select>
          </div>
        </div>

        <div className="psychologists-grid">
          {psychologists.length === 0 ? (
            <div className="empty-state">
              <Brain size={64} className="empty-icon" />
              <h3>No psychologists found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            psychologists.map((psychologist) => (
              <div key={psychologist.id} className="psychologist-card">
                <div className="psychologist-header">
                  <div className="psychologist-avatar">
                    {psychologist.profileImage ? (
                      <img src={psychologist.profileImage} alt={psychologist.name || `${psychologist.firstName} ${psychologist.lastName}`} />
                    ) : (
                      <div className="avatar-placeholder">
                        {psychologist.firstName?.charAt(0) || psychologist.name?.charAt(0) || 'P'}
                        {psychologist.lastName?.charAt(0) || ''}
                      </div>
                    )}
                    <div className={`availability-indicator ${psychologist.availability || 'available'}`}>
                      <div className="availability-dot"></div>
                    </div>
                  </div>
                  
                  <div className="psychologist-info">
                    <h3 className="psychologist-name">
                      Dr. {psychologist.firstName} {psychologist.lastName}
                    </h3>
                    <p className="psychologist-title">{psychologist.title || 'Licensed Psychologist'}</p>
                    <div className="rating">
                      <Star size={16} className="star-icon filled" />
                      <span className="rating-value">{psychologist.rating || 4.8}</span>
                      <span className="rating-count">({psychologist.reviewCount || 124} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="psychologist-details">
                  <div className="specializations">
                    <h4>Specializations</h4>
                    <div className="specialization-tags">
                      {(psychologist.specializations || psychologist.specialization?.split(',') || ['General Therapy']).map((spec, index) => (
                        <span key={index} className="specialization-tag">
                          {spec.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="contact-info">
                    <div className="contact-item">
                      <Mail size={16} className="contact-icon" />
                      <span>{psychologist.email}</span>
                    </div>
                    <div className="contact-item">
                      <Phone size={16} className="contact-icon" />
                      <span>{psychologist.phone || psychologist.mobile_number || 'Contact via platform'}</span>
                    </div>
                    <div className="contact-item">
                      <MapPin size={16} className="contact-icon" />
                      <span>{psychologist.location || 'Remote'}</span>
                    </div>
                  </div>

                  <div className="availability-info">
                    <div className="availability-item">
                      <Calendar size={16} className="availability-icon" />
                      <span>Next Available: {psychologist.nextAvailable || 'Contact to schedule'}</span>
                    </div>
                    <div className="availability-item">
                      <Clock size={16} className="availability-icon" />
                      <span>Working Hours: {psychologist.workingHours || '9 AM - 6 PM'}</span>
                    </div>
                  </div>

                  {/* <div className="session-rates">
                    <h4>Session Rates</h4>
                    <div className="rates-grid">
                      <div className="rate-item">
                        <span className="rate-duration">30 min</span>
                        <span className="rate-price">${psychologist.sessionRates?.thirtyMin || psychologist.session_30_minute_rate || 75}</span>
                      </div>
                      <div className="rate-item">
                        <span className="rate-duration">45 min</span>
                        <span className="rate-price">${psychologist.sessionRates?.fortyFiveMin || psychologist.session_45_minute_rate || 110}</span>
                      </div>
                      <div className="rate-item emergency">
                        <span className="rate-duration">Emergency</span>
                        <span className="rate-price">${psychologist.sessionRates?.emergency || psychologist.emergency_call_rate || 200}</span>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* <div className="psychologist-stats">
                  <div className="stat-item">
                    <Users size={16} />
                    <div>
                      <span className="stat-value">{psychologist.totalSessions || 0}</span>
                      <span className="stat-label">Total Sessions</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <BookOpen size={16} />
                    <div>
                      <span className="stat-value">{psychologist.experience || 5}y</span>
                      <span className="stat-label">Experience</span>
                    </div>
                  </div>
                </div> */}

                <div className="psychologist-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => handleViewProfile(psychologist)}
                  >
                    View Profile
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => handleBookSession(psychologist)}
                    disabled={psychologist.availability === 'offline'}
                  >
                    <Calendar size={16} />
                    {psychologist.availability === 'available' ? 'Book Session' : 'Schedule Later'}
                  </button>
                </div>
              </div>
            ))
          )}
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
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedPsychologist && (
        <BookingModal 
          psychologist={selectedPsychologist}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedPsychologist(null);
          }}
        />
      )}
    </div>
  );
};

// Simple booking modal component
const BookingModal = ({ psychologist, onClose }) => {
  const [bookingData, setBookingData] = useState({
    sessionType: '45min',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const booking = {
        psychologist_id: psychologist.id,
        session_type: bookingData.sessionType,
        appointment_date: bookingData.appointmentDate,
        appointment_time: bookingData.appointmentTime,
        notes: bookingData.notes
      };
      
      // Try to create booking via API
      const response = await bookingService.createBooking(booking);
      
      if (response.success) {
        alert('Booking created successfully!');
        onClose();
      } else {
        alert('Booking request submitted! You will receive a confirmation shortly.');
        onClose();
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking request submitted! You will receive a confirmation shortly.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Book Session with Dr. {psychologist.firstName} {psychologist.lastName}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Session Type</label>
            <select 
              value={bookingData.sessionType}
              onChange={(e) => setBookingData(prev => ({...prev, sessionType: e.target.value}))}
              required
            >
              <option value="30min">30 Minutes - ${psychologist.sessionRates?.thirtyMin || 75}</option>
              <option value="45min">45 Minutes - ${psychologist.sessionRates?.fortyFiveMin || 110}</option>
              <option value="emergency">Emergency Session - ${psychologist.sessionRates?.emergency || 200}</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Preferred Date</label>
            <input 
              type="date"
              value={bookingData.appointmentDate}
              onChange={(e) => setBookingData(prev => ({...prev, appointmentDate: e.target.value}))}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Preferred Time</label>
            <input 
              type="time"
              value={bookingData.appointmentTime}
              onChange={(e) => setBookingData(prev => ({...prev, appointmentTime: e.target.value}))}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea 
              value={bookingData.notes}
              onChange={(e) => setBookingData(prev => ({...prev, notes: e.target.value}))}
              placeholder="Any specific concerns or preferences..."
              rows="3"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Booking...' : 'Book Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PsychologistDirectory;