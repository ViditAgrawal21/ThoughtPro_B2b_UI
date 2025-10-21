import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Plus, Search, Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import Header from '../Header/Header';
import './PsychologistList.css';

const PsychologistList = () => {
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    specialization: '',
    availability: '',
    location: ''
  });

  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      const response = await psychologistService.getAllPsychologists(
        currentPage, 
        10, 
        { ...filters, search: searchQuery }
      );
      
      if (response.success) {
        setPsychologists(response.data.psychologists || []);
        setTotalPages(Math.ceil((response.data.total || 0) / 10));
      } else {
        setError(response.message || 'Failed to fetch psychologists');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
  }, [currentPage, searchQuery, filters]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="psychologist-list-container">
        <div className="loading-spinner">Loading psychologists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="psychologist-list-container">
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={fetchPsychologists} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="psychologist-list-page">
      <Header />
      <div className="psychologist-list-container">
        <div className="psychologist-list-header">
          <div className="psychologist-title">
            <UserCheck size={28} />
            <div>
              <h1>Psychologist Management</h1>
              <p>Manage psychologists and their availability</p>
            </div>
          </div>
          <button 
            className="add-psychologist-btn"
            onClick={() => navigate('/admin/psychologists/add')}
          >
            <Plus size={20} />
            Add Psychologist
          </button>
        </div>

        <div className="psychologist-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search psychologists..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="filter-box">
            <select 
              value={filters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
            >
              <option value="">All Specializations</option>
              <option value="clinical">Clinical Psychology</option>
              <option value="counseling">Counseling Psychology</option>
              <option value="cognitive">Cognitive Behavioral Therapy</option>
              <option value="family">Family Therapy</option>
              <option value="trauma">Trauma Therapy</option>
            </select>
          </div>

          <div className="filter-box">
            <select 
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            >
              <option value="">All Availability</option>
              <option value="available">Available Now</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

      <div className="psychologists-grid">
        {psychologists.length === 0 ? (
          <div className="empty-state">
            <UserCheck size={64} className="empty-icon" />
            <h3>No psychologists found</h3>
            <p>Get started by adding your first psychologist</p>
            <button className="add-psychologist-btn primary">
              <Plus size={20} />
              Add Psychologist
            </button>
          </div>
        ) : (
          psychologists.map((psychologist) => (
            <div key={psychologist.id} className="psychologist-card">
              <div className="psychologist-header">
                <div className="psychologist-avatar">
                  {psychologist.profileImage ? (
                    <img src={psychologist.profileImage} alt={psychologist.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {psychologist.firstName?.charAt(0)}{psychologist.lastName?.charAt(0)}
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
                  <p className="psychologist-title">{psychologist.title || 'Clinical Psychologist'}</p>

                </div>
              </div>

              <div className="psychologist-details">
                <div className="specializations">
                  <h4>Specializations</h4>
                  <div className="specialization-tags">
                    {(psychologist.specializations || ['CBT', 'Anxiety', 'Depression']).map((spec, index) => (
                      <span key={index} className="specialization-tag">
                        {spec}
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
                    <span>{psychologist.phone || 'Not provided'}</span>
                  </div>
                  <div className="contact-item">
                    <MapPin size={16} className="contact-icon" />
                    <span>{psychologist.location || 'Remote'}</span>
                  </div>
                </div>

                <div className="availability-info">
                  <div className="availability-item">
                    <Calendar size={16} className="availability-icon" />
                    <span>Next Available: {psychologist.nextAvailable || 'Today 2:00 PM'}</span>
                  </div>
                  <div className="availability-item">
                    <Clock size={16} className="availability-icon" />
                    <span>Working Hours: {psychologist.workingHours || '9 AM - 6 PM'}</span>
                  </div>
                </div>
              </div>



              <div className="psychologist-actions">
                <button className="btn-secondary">
                  <Calendar size={16} />
                  View Schedule
                </button>
                <button className="btn-primary">
                  Edit Profile
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
    </div>
  );
};

export default PsychologistList;