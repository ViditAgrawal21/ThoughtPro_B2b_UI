import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  MapPin,
  Users,
  CalendarDays,
  Search,
  Filter
} from 'lucide-react';
import { availabilityService } from '../../services/availabilityService';
import Header from '../Header/Header';
import './HolidayManagement.css';

const HolidayManagement = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [holidayForm, setHolidayForm] = useState({
    id: '',
    name: '',
    date: '',
    description: '',
    isRecurring: false,
    isActive: true,
    location: '',
    affectedUsers: 'all'
  });

  const fetchHolidays = useCallback(async () => {
    try {
      setLoading(true);
      const response = await availabilityService.getHolidays();
      
      if (response.success && response.data) {
        setHolidays(response.data);
      } else {
        // Fallback to demo data
        setHolidays(getDemoHolidays());
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setError('Failed to load holidays');
      setHolidays(getDemoHolidays());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const getDemoHolidays = () => [
    {
      id: 'h1',
      name: 'New Year\'s Day',
      date: '2025-01-01',
      description: 'Annual celebration marking the beginning of the new year',
      isRecurring: true,
      isActive: true,
      location: 'Global',
      affectedUsers: 'all',
      createdAt: '2024-12-01T00:00:00Z'
    },
    {
      id: 'h2',
      name: 'Independence Day',
      date: '2025-07-04',
      description: 'National holiday celebrating independence',
      isRecurring: true,
      isActive: true,
      location: 'USA',
      affectedUsers: 'usa-team',
      createdAt: '2024-12-01T00:00:00Z'
    },
    {
      id: 'h3',
      name: 'Company Founding Day',
      date: '2025-03-15',
      description: 'Annual celebration of company establishment',
      isRecurring: true,
      isActive: true,
      location: 'All Offices',
      affectedUsers: 'all',
      createdAt: '2024-12-01T00:00:00Z'
    },
    {
      id: 'h4',
      name: 'Team Retreat',
      date: '2025-06-20',
      description: 'Annual team building and planning retreat',
      isRecurring: false,
      isActive: true,
      location: 'Mountain Resort',
      affectedUsers: 'development-team',
      createdAt: '2024-12-01T00:00:00Z'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHolidayForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openModal = (type, holiday = null) => {
    setModalType(type);
    
    if (holiday) {
      setHolidayForm({
        id: holiday.id,
        name: holiday.name,
        date: holiday.date,
        description: holiday.description || '',
        isRecurring: holiday.isRecurring || false,
        isActive: holiday.isActive !== false,
        location: holiday.location || '',
        affectedUsers: holiday.affectedUsers || 'all'
      });
    } else {
      setHolidayForm({
        id: '',
        name: '',
        date: '',
        description: '',
        isRecurring: false,
        isActive: true,
        location: '',
        affectedUsers: 'all'
      });
    }
    
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let response;
      
      if (modalType === 'add') {
        response = await availabilityService.addHoliday({
          name: holidayForm.name,
          date: holidayForm.date,
          description: holidayForm.description,
          isRecurring: holidayForm.isRecurring,
          location: holidayForm.location,
          affectedUsers: holidayForm.affectedUsers
        });
      } else {
        response = await availabilityService.updateHoliday(holidayForm.id, {
          name: holidayForm.name,
          date: holidayForm.date,
          description: holidayForm.description,
          isRecurring: holidayForm.isRecurring,
          isActive: holidayForm.isActive,
          location: holidayForm.location,
          affectedUsers: holidayForm.affectedUsers
        });
      }

      if (response.success) {
        setSuccess(`Holiday ${modalType === 'add' ? 'added' : 'updated'} successfully!`);
        setShowModal(false);
        await fetchHolidays();
      } else {
        setError(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Holiday operation error:', error);
      setError('Failed to save holiday. Please try again.');
    }
  };

  const handleDelete = async (holidayId) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        const response = await availabilityService.deleteHoliday(holidayId);
        
        if (response.success) {
          setSuccess('Holiday deleted successfully!');
          await fetchHolidays();
        } else {
          setError('Failed to delete holiday');
        }
      } catch (error) {
        console.error('Delete holiday error:', error);
        setError('Failed to delete holiday');
      }
    }
  };

  const filteredHolidays = holidays.filter(holiday => {
    const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         holiday.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         holiday.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && holiday.isActive !== false) ||
                         (filterStatus === 'inactive' && holiday.isActive === false);
    
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

  const isUpcoming = (dateString) => {
    const holidayDate = new Date(dateString);
    const today = new Date();
    return holidayDate >= today;
  };

  const getDaysUntil = (dateString) => {
    const holidayDate = new Date(dateString);
    const today = new Date();
    const diffTime = holidayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="holiday-page">
        <Header />
        <div className="holiday-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading holidays...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="holiday-page">
      <Header />
      <div className="holiday-container">
        <div className="holiday-header">
          <div className="holiday-title">
            <CalendarDays size={28} />
            <h1>Holiday Management</h1>
          </div>
          <button
            className="add-holiday-button"
            onClick={() => openModal('add')}
          >
            <Plus size={20} />
            Add Holiday
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

        <div className="holiday-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search holidays..."
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
              <option value="all">All Holidays</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="holidays-grid">
          {filteredHolidays.length > 0 ? (
            filteredHolidays.map((holiday) => (
              <div key={holiday.id} className={`holiday-card ${!holiday.isActive ? 'inactive' : ''}`}>
                <div className="holiday-header-info">
                  <div className="holiday-title-info">
                    <h3>{holiday.name}</h3>
                    <div className="holiday-badges">
                      {holiday.isRecurring && (
                        <span className="badge recurring">Recurring</span>
                      )}
                      {isUpcoming(holiday.date) && (
                        <span className="badge upcoming">
                          {getDaysUntil(holiday.date) === 0 
                            ? 'Today' 
                            : `${getDaysUntil(holiday.date)} days`}
                        </span>
                      )}
                      {!holiday.isActive && (
                        <span className="badge inactive">Inactive</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="holiday-actions">
                    <button
                      className="action-button edit"
                      onClick={() => openModal('edit', holiday)}
                      title="Edit Holiday"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDelete(holiday.id)}
                      title="Delete Holiday"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="holiday-date">
                  <Calendar size={20} />
                  <span>{formatDate(holiday.date)}</span>
                </div>

                {holiday.description && (
                  <div className="holiday-description">
                    <p>{holiday.description}</p>
                  </div>
                )}

                <div className="holiday-details">
                  {holiday.location && (
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{holiday.location}</span>
                    </div>
                  )}
                  
                  <div className="detail-item">
                    <Users size={16} />
                    <span>
                      {holiday.affectedUsers === 'all' ? 'All Employees' : holiday.affectedUsers}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <CalendarDays size={64} />
              <h3>No Holidays Found</h3>
              <p>
                {searchTerm || filterStatus !== 'all' 
                  ? 'No holidays match your current search and filter criteria.' 
                  : 'No holidays have been added yet.'}
              </p>
              <button
                className="add-holiday-button"
                onClick={() => openModal('add')}
              >
                <Plus size={20} />
                Add First Holiday
              </button>
            </div>
          )}
        </div>

        {/* Holiday Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{modalType === 'add' ? 'Add New Holiday' : 'Edit Holiday'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="holiday-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Holiday Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={holidayForm.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter holiday name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={holidayForm.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={holidayForm.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter holiday description (optional)"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={holidayForm.location}
                      onChange={handleInputChange}
                      placeholder="Global, USA, Office, etc."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Affected Users</label>
                    <select
                      name="affectedUsers"
                      value={holidayForm.affectedUsers}
                      onChange={handleInputChange}
                    >
                      <option value="all">All Employees</option>
                      <option value="usa-team">USA Team</option>
                      <option value="development-team">Development Team</option>
                      <option value="management">Management</option>
                      <option value="custom">Custom Group</option>
                    </select>
                  </div>
                </div>

                <div className="form-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isRecurring"
                      checked={holidayForm.isRecurring}
                      onChange={handleInputChange}
                    />
                    <span>Recurring annually</span>
                  </label>
                  
                  {modalType === 'edit' && (
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={holidayForm.isActive}
                        onChange={handleInputChange}
                      />
                      <span>Active</span>
                    </label>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                  >
                    <CheckCircle size={20} />
                    {modalType === 'add' ? 'Add Holiday' : 'Update Holiday'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayManagement;