import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Trash2,
  ArrowLeft,
  Settings,
  Power,
  AlertCircle,
  Calendar,
  Clock,
  User,
} from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import AddPsychologist from './AddPsychologist';
import PsychologistSettings from './PsychologistSettings';
import AvailabilityTab from './AvailabilityTab';
import BookingTab from './BookingTab';
import AdminHeader from '../Header/AdminHeader';
import './PsychologistManagement.css';

const PsychologistManagement = ({ onBack }) => {
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'add'
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('psychologists'); // 'psychologists', 'availability', or 'bookings'

  // Available specializations
  const specializationOptions = [
    'Anxiety Disorders',
    'Depression',
    'PTSD',
    'Couples Therapy',
    'Family Therapy',
    'Child Psychology',
    'Adolescent Psychology',
    'Addiction Counseling',
    'Grief Counseling',
    'Cognitive Behavioral Therapy',
    'Dialectical Behavior Therapy',
    'EMDR',
    'Mindfulness-Based Therapy',
    'Trauma Therapy',
    'Eating Disorders',
    'OCD',
    'Bipolar Disorder',
    'ADHD',
    'Autism Spectrum Disorders',
    'Workplace Mental Health',
  ];

  // Fetch psychologists on mount
  useEffect(() => {
    fetchPsychologists();
  }, []);

  // Apply filters whenever search or filters change
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedSpecialization, selectedStatus, psychologists]);

  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await psychologistService.getAllPsychologists(1, 100);
      setPsychologists(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch psychologists');
      console.error('Error fetching psychologists:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = psychologists;

    // Search by name or email
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.firstName?.toLowerCase().includes(query) ||
          p.lastName?.toLowerCase().includes(query) ||
          p.email?.toLowerCase().includes(query) ||
          p.licenseNumber?.toLowerCase().includes(query)
      );
    }

    // Filter by specialization
    if (selectedSpecialization) {
      filtered = filtered.filter((p) =>
        p.specializations?.includes(selectedSpecialization)
      );
    }

    // Filter by status
    if (selectedStatus) {
      if (selectedStatus === 'active') {
        filtered = filtered.filter((p) => !p.is_disabled);
      } else if (selectedStatus === 'inactive') {
        filtered = filtered.filter((p) => p.is_disabled === true);
      }
    }

    setFilteredPsychologists(filtered);
  };

  const handleDelete = async (psychologistId, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${name}? This action cannot be undone.`
      )
    ) {
      try {
        // Use admin delete endpoint
        await psychologistService.deletePsychologistAdmin(psychologistId);
        setPsychologists((prev) => prev.filter((p) => p.id !== psychologistId));
        showNotification(`${name} deleted successfully`, 'success');
      } catch (err) {
        showNotification(
          err.message || 'Failed to delete psychologist',
          'error'
        );
      }
    }
  };

  const handleToggleStatus = async (psychologist) => {
    try {
      const isEnabled = !psychologist.is_disabled;
      const action = isEnabled
        ? await psychologistService.disablePsychologist(psychologist.id)
        : await psychologistService.enablePsychologist(psychologist.id);

      if (action.success) {
        fetchPsychologists();
        showNotification(
          `${getFullName(psychologist)} ${
            isEnabled ? 'disabled' : 'enabled'
          } successfully`,
          'success'
        );
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update status', 'error');
    }
  };

  const handleSettings = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setShowSettingsModal(true);
  };

  const handleSettingsUpdate = () => {
    setShowSettingsModal(false);
    fetchPsychologists();
    showNotification('Settings updated successfully', 'success');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/admin/dashboard');
    }
  };

  const getFullName = (psychologist) => {
    return (
      psychologist.name ||
      `${psychologist.firstName || ''} ${psychologist.lastName || ''}`.trim()
    );
  };

  return (
    <div className="psychologist-management-page">
      {/* Show Add Form View */}
      {view === 'add' && (
        <AddPsychologist
          onSuccess={() => {
            setView('list');
            fetchPsychologists();
            showNotification('Psychologist added successfully', 'success');
          }}
          onBack={() => setView('list')}
        />
      )}

      {/* Show List View */}
      {view === 'list' && (
      <div className="psychologist-management">
        <AdminHeader />
        
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={handleBack}>
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1>Psychologist Management</h1>
            <p>Manage psychologist profiles, availability, bookings, and settings</p>
          </div>
          <button
            onClick={() => setView('add')}
            className="btn-primary"
          >
            <Plus size={20} />
            Add Psychologist
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs-navigation">
          <button
            className={`tab-button ${activeTab === 'psychologists' ? 'active' : ''}`}
            onClick={() => setActiveTab('psychologists')}
          >
            <User size={16} />
            Psychologists
          </button>
          <button
            className={`tab-button ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            <Clock size={16} />
            Availability Management
          </button>
          <button
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={16} />
            Booking Management
          </button>
        </div>

        {/* Filters Bar */}
        {activeTab === 'psychologists' && (
          <div className="filters-bar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or license..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="specialization">Specialization:</label>
              <select
                id="specialization"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializationOptions.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}

        {/* Notifications */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
            <button
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <div>
              <p>{error}</p>
              <button onClick={fetchPsychologists} className="retry-button">
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Psychologists Tab */}
        {activeTab === 'psychologists' && !loading && !error && (
          <div className="table-container">
            {filteredPsychologists.length === 0 ? (
              <div className="no-data">
                {psychologists.length === 0
                  ? 'No psychologists found. Click "Add Psychologist" to create one.'
                  : 'No psychologists match your filters.'}
              </div>
            ) : (
              <table className="psychologists-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>License</th>
                    <th>Specializations</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPsychologists.map((psychologist) => (
                    <tr key={psychologist.id}>
                      <td>
                        <div className="psychologist-info">
                          <div className="psychologist-avatar">
                            {getFullName(psychologist)
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="psychologist-name">
                              {getFullName(psychologist)}
                            </div>
                            <div className="psychologist-email">
                              {psychologist.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{psychologist.email}</td>
                      <td>
                        <span className="license-number">
                          {psychologist.licenseNumber || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="specializations">
                          {psychologist.specializations?.slice(0, 2).map((spec) => (
                            <span key={spec} className="specialization-tag">
                              {spec}
                            </span>
                          ))}
                          {psychologist.specializations?.length > 2 && (
                            <span className="specialization-count">
                              +{psychologist.specializations.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="experience">
                          {psychologist.experience || 0} years
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            psychologist.is_disabled ? 'disabled' : 'active'
                          }`}
                        >
                          <span className="status-dot"></span>
                          {psychologist.is_disabled ? 'Disabled' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            onClick={() => handleSettings(psychologist)}
                            className="action-btn edit"
                            title="Settings"
                          >
                            <Settings size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(psychologist)}
                            className={`action-btn power-btn ${
                              psychologist.is_disabled
                                ? 'disabled'
                                : 'enabled'
                            }`}
                            title={
                              psychologist.is_disabled
                                ? 'Enable'
                                : 'Disable'
                            }
                          >
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(
                                psychologist.id,
                                getFullName(psychologist)
                              )
                            }
                            className="action-btn delete"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && !loading && !error && (
          <BookingTab />
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && !loading && !error && (
          <AvailabilityTab />
        )}
      </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && selectedPsychologist && (
        <div
          className="modal-overlay"
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <PsychologistSettings
              psychologist={selectedPsychologist}
              onSuccess={handleSettingsUpdate}
              onClose={() => setShowSettingsModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};


export default PsychologistManagement;
