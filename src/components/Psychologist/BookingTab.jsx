import React, { useState, useEffect } from 'react';
import { Search, Calendar, Sliders, AlertCircle } from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import BookingLimitsManager from '../Admin/BookingLimitsManager';
import './BookingTab.css';

const BookingTab = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [showBookingLimitsModal, setShowBookingLimitsModal] = useState(false);

  useEffect(() => {
    fetchPsychologists();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, psychologists]);

  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await psychologistService.getAllPsychologists(1, 100);
      let psychologistList = Array.isArray(data) ? data : data.data || [];
      // Filter out disabled psychologists
      psychologistList = psychologistList.filter(p => !p.is_disabled);
      setPsychologists(psychologistList);
      setFilteredPsychologists(psychologistList);
    } catch (err) {
      setError(err.message || 'Failed to fetch psychologists');
      console.error('Error fetching psychologists:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = psychologists;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.email?.toLowerCase().includes(query)
      );
    }

    setFilteredPsychologists(filtered);
  };

  const handleManageBookingLimits = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setShowBookingLimitsModal(true);
  };

  const handleBookingLimitsUpdate = () => {
    setShowBookingLimitsModal(false);
    fetchPsychologists();
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading psychologists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <AlertCircle size={20} />
        <div>
          <p>{error}</p>
          <button onClick={fetchPsychologists} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-tab">
      <div className="tab-header">
        <div className="tab-header-left">
          <Sliders size={24} />
          <div>
            <h2>Booking Management</h2>
            <p>Manage psychologist booking limits and settings</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search psychologist by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Psychologists Grid */}
      <div className="psychologists-grid">
        {filteredPsychologists.length === 0 ? (
          <div className="no-data">
            {psychologists.length === 0
              ? 'No psychologists found.'
              : 'No psychologists match your search.'}
          </div>
        ) : (
          filteredPsychologists.map((psychologist) => (
            <div key={psychologist.id} className="psychologist-card">
              <div className="card-header">
                <div className="psychologist-avatar-large">
                  {psychologist.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || '?'}
                </div>
                <div className="psychologist-details">
                  <h3>{psychologist.name}</h3>
                  <p className="email">{psychologist.email}</p>
                  {psychologist.mobile_number && (
                    <p className="phone">{psychologist.mobile_number}</p>
                  )}
                </div>
              </div>

              <div className="card-body">
                <div className="limits-info">
                  <div className="limit-item">
                    <span className="limit-label">Weekly Limit:</span>
                    <span className="limit-value">
                      {psychologist.weekly_booking_limit || 'Not Set'}
                    </span>
                  </div>
                  <div className="limit-item">
                    <span className="limit-label">Monthly Limit:</span>
                    <span className="limit-value">
                      {psychologist.monthly_booking_limit || 'Not Set'}
                    </span>
                  </div>
                </div>

                {psychologist.degree && (
                  <div className="info-row">
                    <span className="label">Degree:</span>
                    <span className="value">{psychologist.degree}</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button
                  onClick={() => handleManageBookingLimits(psychologist)}
                  className="btn-manage-booking"
                >
                  <Calendar size={16} />
                  Manage Booking Limits
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Limits Modal */}
      {showBookingLimitsModal && selectedPsychologist && (
        <BookingLimitsManager
          psychologist={selectedPsychologist}
          onSuccess={handleBookingLimitsUpdate}
          onClose={() => setShowBookingLimitsModal(false)}
        />
      )}
    </div>
  );
};

export default BookingTab;
