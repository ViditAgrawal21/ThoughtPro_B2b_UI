import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, AlertCircle } from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import './AvailabilityTab.css';

const AvailabilityTab = () => {
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      const psychologistList = Array.isArray(data) ? data : data.data || [];
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

  const handleManageAvailability = (psychologist) => {
    // Navigate to the full availability page
    navigate(`/admin/psychologists/${psychologist.id}/availability`);
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
    <div className="availability-tab">
      <div className="tab-header">
        <div className="tab-header-left">
          <Clock size={24} />
          <div>
            <h2>Availability Management</h2>
            <p>Manage psychologist availability slots and holidays</p>
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
                {psychologist.degree && (
                  <div className="info-row">
                    <span className="label">Degree:</span>
                    <span className="value">{psychologist.degree}</span>
                  </div>
                )}
                {psychologist.languages && psychologist.languages.length > 0 && (
                  <div className="info-row">
                    <span className="label">Languages:</span>
                    <span className="value">{psychologist.languages.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button
                  onClick={() => handleManageAvailability(psychologist)}
                  className="btn-manage-availability"
                >
                  <Calendar size={16} />
                  Manage Availability
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailabilityTab;
