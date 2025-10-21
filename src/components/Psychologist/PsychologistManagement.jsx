import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Plus, 
  Save, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Eye, 
  Edit,
  Trash2,
  Search,
  Filter,
  Star,
  CheckCircle,
  XCircle,
  UserPlus,
  GraduationCap
} from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import AdminHeader from '../Header/AdminHeader';
import './PsychologistManagement.css';

const PsychologistManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [loading, setLoading] = useState(false);
  const [psychologists, setPsychologists] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    specializations: [],
    qualifications: '',
    experience: '',
    languages: [],
    licenseNumber: '',
    bio: '',
    hourlyRate: '',
    availability: {
      monday: { available: false, startTime: '09:00', endTime: '17:00' },
      tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
      wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
      thursday: { available: false, startTime: '09:00', endTime: '17:00' },
      friday: { available: false, startTime: '09:00', endTime: '17:00' },
      saturday: { available: false, startTime: '09:00', endTime: '17:00' },
      sunday: { available: false, startTime: '09:00', endTime: '17:00' }
    },
    status: 'active'
  });

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
    'Workplace Mental Health'
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese (Mandarin)',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Russian'
  ];

  useEffect(() => {
    if (view === 'list') {
      loadPsychologists();
    }

    // Check for state from navigation
    if (location.state) {
      if (location.state.message) {
        setNotification({
          message: location.state.message,
          type: location.state.type || 'success'
        });
        
        setTimeout(() => setNotification(null), 5000);
      }
      
      window.history.replaceState({}, document.title);
    }

    // Handle URL parameters for direct editing
    if (id && view === 'list') {
      setView('edit');
      loadPsychologistForEdit(id);
    }
  }, [view, location.state, id]);

  const loadPsychologists = async () => {
    try {
      setLoading(true);
      const response = await psychologistService.getAllPsychologists();
      
      if (Array.isArray(response)) {
        setPsychologists(response);
      } else if (response.data && Array.isArray(response.data)) {
        setPsychologists(response.data);
      } else if (response.success && response.data?.psychologists) {
        setPsychologists(response.data.psychologists);
      } else {
        setPsychologists([]);
      }
    } catch (error) {
      console.error('Error loading psychologists:', error);
      setPsychologists([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPsychologistForEdit = async (psychologistId) => {
    try {
      setLoading(true);
      const response = await psychologistService.getPsychologistById(psychologistId);
      
      if (response && (response.success || response.id)) {
        const psychologist = response.data || response;
        setSelectedPsychologist(psychologist);
        
        // Parse name into first and last name
        const nameParts = (psychologist.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setFormData({
          firstName,
          lastName,
          email: psychologist.email || '',
          phone: psychologist.phone || '',
          address: psychologist.address || '',
          specializations: psychologist.specializations || [],
          qualifications: psychologist.qualifications || '',
          experience: psychologist.experience || '',
          languages: psychologist.languages || [],
          licenseNumber: psychologist.licenseNumber || '',
          bio: psychologist.bio || '',
          hourlyRate: psychologist.hourlyRate?.toString() || '',
          availability: psychologist.availability || {
            monday: { available: false, startTime: '09:00', endTime: '17:00' },
            tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
            wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
            thursday: { available: false, startTime: '09:00', endTime: '17:00' },
            friday: { available: false, startTime: '09:00', endTime: '17:00' },
            saturday: { available: false, startTime: '09:00', endTime: '17:00' },
            sunday: { available: false, startTime: '09:00', endTime: '17:00' }
          },
          status: psychologist.status || 'active'
        });
      }
    } catch (error) {
      console.error('Error loading psychologist:', error);
      setErrors({ load: 'Failed to load psychologist details' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.includes('specializations')) {
        const specialization = name.replace('specializations_', '');
        setFormData(prev => ({
          ...prev,
          specializations: checked 
            ? [...prev.specializations, specialization]
            : prev.specializations.filter(s => s !== specialization)
        }));
      } else if (name.includes('languages')) {
        const language = name.replace('languages_', '');
        setFormData(prev => ({
          ...prev,
          languages: checked 
            ? [...prev.languages, language]
            : prev.languages.filter(l => l !== language)
        }));
      } else if (name.includes('availability')) {
        const day = name.replace('availability_', '');
        setFormData(prev => ({
          ...prev,
          availability: {
            ...prev.availability,
            [day]: {
              ...prev.availability[day],
              available: checked
            }
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvailabilityTimeChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }
    
    if (formData.specializations.length === 0) {
      newErrors.specializations = 'Please select at least one specialization';
    }
    
    if (formData.hourlyRate && isNaN(formData.hourlyRate)) {
      newErrors.hourlyRate = 'Please enter a valid hourly rate';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const psychologistData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null
      };

      if (view === 'edit' && selectedPsychologist) {
        // Update existing psychologist
        const result = await psychologistService.updatePsychologist(selectedPsychologist.id, psychologistData);
        
        if (result.success || result.id) {
          setView('list');
          setNotification({
            message: 'Psychologist updated successfully',
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
          loadPsychologists();
        } else {
          setErrors({ submit: result.error || 'Failed to update psychologist' });
        }
      } else {
        // Create new psychologist
        const result = await psychologistService.createPsychologist(psychologistData);
        
        if (result.success || result.id) {
          setView('list');
          setNotification({
            message: 'Psychologist created successfully',
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
          loadPsychologists();
        } else {
          setErrors({ submit: result.error || 'Failed to create psychologist' });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to process request' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPsychologist = (psychologist) => {
    setSelectedPsychologist(psychologist);
    
    // Parse name into first and last name
    const nameParts = (psychologist.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setFormData({
      firstName,
      lastName,
      email: psychologist.email || '',
      phone: psychologist.phone || '',
      address: psychologist.address || '',
      specializations: psychologist.specializations || [],
      qualifications: psychologist.qualifications || '',
      experience: psychologist.experience || '',
      languages: psychologist.languages || [],
      licenseNumber: psychologist.licenseNumber || '',
      bio: psychologist.bio || '',
      hourlyRate: psychologist.hourlyRate?.toString() || '',
      availability: psychologist.availability || {
        monday: { available: false, startTime: '09:00', endTime: '17:00' },
        tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
        wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
        thursday: { available: false, startTime: '09:00', endTime: '17:00' },
        friday: { available: false, startTime: '09:00', endTime: '17:00' },
        saturday: { available: false, startTime: '09:00', endTime: '17:00' },
        sunday: { available: false, startTime: '09:00', endTime: '17:00' }
      },
      status: psychologist.status || 'active'
    });
    setView('edit');
  };

  const handleDeletePsychologist = async (psychologistId) => {
    try {
      setLoading(true);
      const result = await psychologistService.deletePsychologist(psychologistId);
      
      if (result.success) {
        setPsychologists(psychologists.filter(p => p.id !== psychologistId));
        setShowDeleteConfirm(null);
        setNotification({
          message: 'Psychologist deleted successfully',
          type: 'success'
        });
        setTimeout(() => setNotification(null), 5000);
      } else {
        setErrors({ delete: result.error || 'Failed to delete psychologist' });
      }
    } catch (error) {
      console.error('Error deleting psychologist:', error);
      setErrors({ delete: error.message || 'Failed to delete psychologist' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setErrors({});
    if (newView === 'add') {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        specializations: [],
        qualifications: '',
        experience: '',
        languages: [],
        licenseNumber: '',
        bio: '',
        hourlyRate: '',
        availability: {
          monday: { available: false, startTime: '09:00', endTime: '17:00' },
          tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
          wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
          thursday: { available: false, startTime: '09:00', endTime: '17:00' },
          friday: { available: false, startTime: '09:00', endTime: '17:00' },
          saturday: { available: false, startTime: '09:00', endTime: '17:00' },
          sunday: { available: false, startTime: '09:00', endTime: '17:00' }
        },
        status: 'active'
      });
      setSelectedPsychologist(null);
    }
  };

  const filteredPsychologists = psychologists.filter(psychologist => {
    const matchesSearch = 
      psychologist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      psychologist.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      psychologist.specializations?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialization = filterSpecialization === 'all' || 
      psychologist.specializations?.includes(filterSpecialization);
    
    const matchesStatus = filterStatus === 'all' || psychologist.status === filterStatus;
    
    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  const PsychologistRow = ({ psychologist }) => (
    <tr className="psychologist-row">
      <td>
        <div className="psychologist-info">
          <div className="psychologist-avatar">
            <Brain size={20} />
          </div>
          <div>
            <div className="psychologist-name">{psychologist.name}</div>
            <div className="psychologist-email">{psychologist.email}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="specializations">
          {psychologist.specializations?.slice(0, 2).map(spec => (
            <span key={spec} className="specialization-tag">{spec}</span>
          ))}
          {psychologist.specializations?.length > 2 && (
            <span className="specialization-count">+{psychologist.specializations.length - 2}</span>
          )}
        </div>
      </td>
      <td>
        <div className="experience">
          {psychologist.experience ? `${psychologist.experience} years` : 'N/A'}
        </div>
      </td>
      <td>
        <div className="hourly-rate">
          {psychologist.hourlyRate ? `$${psychologist.hourlyRate}/hr` : 'N/A'}
        </div>
      </td>
      <td>
        <div className={`status-badge ${psychologist.status}`}>
          {psychologist.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {psychologist.status}
        </div>
      </td>
      <td>
        <div className="license-number">
          {psychologist.licenseNumber || 'N/A'}
        </div>
      </td>
      <td>
        <div className="actions">
          <button 
            className="action-btn view"
            onClick={() => navigate(`/admin/psychologists/${psychologist.id}`)}
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button 
            className="action-btn edit"
            onClick={() => handleEditPsychologist(psychologist)}
            title="Edit Psychologist"
          >
            <Edit size={16} />
          </button>
          <button 
            className="action-btn delete"
            onClick={() => setShowDeleteConfirm(psychologist.id)}
            title="Delete Psychologist"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  const ListView = () => (
    <div className="psychologist-management-list">
      <div className="page-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1>Psychologist Management</h1>
          <p>Manage all registered psychologists</p>
        </div>
        <button className="btn-primary" onClick={() => handleViewChange('add')}>
          <Plus size={20} />
          Add Psychologist
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search psychologists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={20} />
          <select 
            value={filterSpecialization} 
            onChange={(e) => setFilterSpecialization(e.target.value)}
          >
            <option value="all">All Specializations</option>
            {specializationOptions.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading psychologists...</p>
          </div>
        ) : (
          <table className="psychologists-table">
            <thead>
              <tr>
                <th>Psychologist</th>
                <th>Specializations</th>
                <th>Experience</th>
                <th>Rate</th>
                <th>Status</th>
                <th>License</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPsychologists.length > 0 ? (
                filteredPsychologists.map(psychologist => (
                  <PsychologistRow key={psychologist.id} psychologist={psychologist} />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No psychologists found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const FormView = () => (
    <div className="add-psychologist-container">
      <div className="add-psychologist-header">
        <button onClick={() => setView('list')} className="back-button">
          <ArrowLeft size={20} />
          <span>Back to Psychologists</span>
        </button>
        
        <div className="page-title">
          <UserPlus size={24} />
          <h1>{view === 'edit' ? 'Edit Psychologist' : 'Add New Psychologist'}</h1>
        </div>
      </div>

      <div className="add-psychologist-content">
        <form onSubmit={handleSubmit} className="psychologist-form">
          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}

          {errors.load && (
            <div className="error-message">
              {errors.load}
            </div>
          )}

          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">
                  <User size={16} />
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Enter first name"
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  <User size={16} />
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Enter last name"
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="psychologist@example.com"
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">
                <MapPin size={16} />
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                rows="3"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="form-section">
            <h3>Professional Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licenseNumber">
                  <GraduationCap size={16} />
                  License Number *
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className={errors.licenseNumber ? 'error' : ''}
                  placeholder="License number"
                />
                {errors.licenseNumber && <span className="field-error">{errors.licenseNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="experience">
                  <Star size={16} />
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Years of experience"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hourlyRate">Hourly Rate ($)</label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  className={errors.hourlyRate ? 'error' : ''}
                  placeholder="150"
                  min="0"
                  step="0.01"
                />
                {errors.hourlyRate && <span className="field-error">{errors.hourlyRate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="qualifications">
                <GraduationCap size={16} />
                Qualifications
              </label>
              <textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                placeholder="Educational background and certifications"
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Brief professional bio"
                rows="4"
              />
            </div>
          </div>

          {/* Specializations */}
          <div className="form-section">
            <h3>Specializations *</h3>
            {errors.specializations && <span className="field-error">{errors.specializations}</span>}
            
            <div className="checkbox-grid">
              {specializationOptions.map(specialization => (
                <label key={specialization} className="checkbox-label">
                  <input
                    type="checkbox"
                    name={`specializations_${specialization}`}
                    checked={formData.specializations.includes(specialization)}
                    onChange={handleInputChange}
                  />
                  <span>{specialization}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="form-section">
            <h3>Languages</h3>
            
            <div className="checkbox-grid">
              {languageOptions.map(language => (
                <label key={language} className="checkbox-label">
                  <input
                    type="checkbox"
                    name={`languages_${language}`}
                    checked={formData.languages.includes(language)}
                    onChange={handleInputChange}
                  />
                  <span>{language}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="form-section">
            <h3>Availability</h3>
            
            <div className="availability-grid">
              {Object.entries(formData.availability).map(([day, schedule]) => (
                <div key={day} className="availability-day">
                  <label className="day-checkbox">
                    <input
                      type="checkbox"
                      name={`availability_${day}`}
                      checked={schedule.available}
                      onChange={handleInputChange}
                    />
                    <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                  </label>
                  
                  {schedule.available && (
                    <div className="time-inputs">
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleAvailabilityTimeChange(day, 'startTime', e.target.value)}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleAvailabilityTimeChange(day, 'endTime', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => setView('list')}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? (view === 'edit' ? 'Updating...' : 'Creating...') : (view === 'edit' ? 'Update Psychologist' : 'Create Psychologist')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeleteConfirmModal = () => (
    <div className="modal-overlay">
      <div className="modal-content delete-confirm">
        <h3>Delete Psychologist</h3>
        <p>Are you sure you want to delete this psychologist? This action cannot be undone and will also remove all associated appointments and data.</p>
        <div className="form-actions">
          <button onClick={() => setShowDeleteConfirm(null)}>
            Cancel
          </button>
          <button 
            className="delete-btn"
            onClick={() => handleDeletePsychologist(showDeleteConfirm)}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Psychologist'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="psychologist-management-page">
      <AdminHeader />
      
      <div className="psychologist-management">
        {view === 'list' ? <ListView /> : <FormView />}
        
        {showDeleteConfirm && <DeleteConfirmModal />}
        
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
            <button onClick={() => setNotification(null)} className="notification-close">
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PsychologistManagement;