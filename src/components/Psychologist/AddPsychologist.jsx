import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Save, ArrowLeft, Mail, Phone, MapPin, User, GraduationCap, Star } from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import AdminHeader from '../Header/AdminHeader';
import './AddPsychologist.css';

const AddPsychologist = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
        name: `${formData.firstName} ${formData.lastName}`
      };
      
      const result = await psychologistService.createPsychologist(psychologistData);
      
      if (result.success || result.id) {
        // Success - redirect to psychologists list
        navigate('/admin/psychologists', {
          state: { 
            message: 'Psychologist created successfully',
            type: 'success'
          }
        });
      } else {
        setErrors({ submit: result.error || 'Failed to create psychologist' });
      }
    } catch (error) {
      console.error('Error creating psychologist:', error);
      setErrors({ submit: error.message || 'Failed to create psychologist' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/psychologists');
  };

  return (
    <div className="add-psychologist-page">
      <AdminHeader />
      
      <div className="add-psychologist-container">
        <div className="add-psychologist-header">
          <button onClick={handleBack} className="back-button">
            <ArrowLeft size={20} />
            <span>Back to Psychologists</span>
          </button>
          
          <div className="page-title">
            <UserPlus size={24} />
            <h1>Add New Psychologist</h1>
          </div>
        </div>

        <div className="add-psychologist-content">
          <form onSubmit={handleSubmit} className="psychologist-form">
            {errors.submit && (
              <div className="error-message">
                {errors.submit}
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

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleBack}
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
                {loading ? 'Creating...' : 'Create Psychologist'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPsychologist;