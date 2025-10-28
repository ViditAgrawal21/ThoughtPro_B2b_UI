import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Save, ArrowLeft, Mail, User, GraduationCap, Star, DollarSign, Clock } from 'lucide-react';
import { psychologistService } from '../../services/psychologistService';
import AdminHeader from '../Header/AdminHeader';
import PhoneInput from '../Common/PhoneInput';
import './AddPsychologist-Simple.css';

const AddPsychologist = ({ onSuccess, onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    degree: '',
    specialization: [],
    experience_years: '',
    languages: [],
    emergency_call_rate: '',
    session_45_minute_rate: '',
    session_30_minute_rate: '',
    rating: ''
  });

  const specializationOptions = [
    'anxiety',
    'depression',
    'stress_management',
    'ptsd',
    'couples_therapy',
    'family_therapy',
    'child_psychology',
    'adolescent_psychology',
    'addiction_counseling',
    'grief_counseling',
    'cognitive_behavioral_therapy',
    'dialectical_behavior_therapy',
    'emdr',
    'mindfulness_based_therapy',
    'trauma_therapy',
    'eating_disorders',
    'ocd',
    'bipolar_disorder',
    'adhd',
    'autism_spectrum_disorders',
    'workplace_mental_health'
  ];

  const languageOptions = [
    'English',
    'Marathi',
    'Hindi',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese (Mandarin)',
    'Japanese',
    'Korean',
    'Arabic',
    'Russian',
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.includes('specialization')) {
        const specialization = name.replace('specialization_', '');
        setFormData(prev => ({
          ...prev,
          specialization: checked 
            ? [...prev.specialization, specialization]
            : prev.specialization.filter(s => s !== specialization)
        }));
      } else if (name.includes('languages')) {
        const language = name.replace('languages_', '');
        setFormData(prev => ({
          ...prev,
          languages: checked 
            ? [...prev.languages, language]
            : prev.languages.filter(l => l !== language)
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = 'Phone number is required';
    }
    
    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }
    
    if (formData.specialization.length === 0) {
      newErrors.specialization = 'Please select at least one specialization';
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
      // Prepare data matching API structure
      const psychologistData = {
        name: formData.name,
        email: formData.email,
        mobile_number: formData.mobile_number.replace(/\D/g, ''), // Remove formatting
        degree: formData.degree,
        specialization: formData.specialization,
        languages: formData.languages,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        emergency_call_rate: formData.emergency_call_rate ? parseFloat(formData.emergency_call_rate) : undefined,
        session_45_minute_rate: formData.session_45_minute_rate ? parseFloat(formData.session_45_minute_rate) : undefined,
        session_30_minute_rate: formData.session_30_minute_rate ? parseFloat(formData.session_30_minute_rate) : undefined,
        rating: formData.rating ? parseFloat(formData.rating) : undefined
      };
      
      const result = await psychologistService.createPsychologist(psychologistData);
      
      if (result.success || result.id) {
        // Success - call onSuccess callback or navigate
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/admin/psychologists', {
            state: { 
              message: 'Psychologist created successfully',
              type: 'success'
            }
          });
        }
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
    if (onBack) {
      onBack();
    } else {
      navigate('/admin/psychologists');
    }
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
                  <label htmlFor="name">
                    <User size={16} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter full name"
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mobile_number">
                    Mobile Number *
                  </label>
                  <PhoneInput
                    id="mobile_number"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={(value) => setFormData(prev => ({ ...prev, mobile_number: value }))}
                    error={errors.mobile_number}
                    placeholder="Enter phone number"
                    required
                  />
                  {errors.mobile_number && <span className="field-error">{errors.mobile_number}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="degree">
                    <GraduationCap size={16} />
                    Degree *
                  </label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className={errors.degree ? 'error' : ''}
                    placeholder="e.g., Ph.D. in Clinical Psychology"
                  />
                  {errors.degree && <span className="field-error">{errors.degree}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experience_years">
                    <Star size={16} />
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experience_years"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    placeholder="Years of experience"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rating">
                    <Star size={16} />
                    Rating (Optional)
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="e.g., 4.8"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="form-section">
              <h3>Rate Information (Optional)</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emergency_call_rate">
                    <DollarSign size={16} />
                    Emergency Call Rate
                  </label>
                  <input
                    type="number"
                    id="emergency_call_rate"
                    name="emergency_call_rate"
                    value={formData.emergency_call_rate}
                    onChange={handleInputChange}
                    placeholder="Enter emergency call rate"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="session_45_minute_rate">
                    <Clock size={16} />
                    45-Minute Session Rate
                  </label>
                  <input
                    type="number"
                    id="session_45_minute_rate"
                    name="session_45_minute_rate"
                    value={formData.session_45_minute_rate}
                    onChange={handleInputChange}
                    placeholder="Enter 45-minute session rate"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="session_30_minute_rate">
                    <Clock size={16} />
                    30-Minute Session Rate
                  </label>
                  <input
                    type="number"
                    id="session_30_minute_rate"
                    name="session_30_minute_rate"
                    value={formData.session_30_minute_rate}
                    onChange={handleInputChange}
                    placeholder="Enter 30-minute session rate"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group"></div>
              </div>
            </div>

            {/* Specializations */}
            <div className="form-section">
              <h3>Specializations *</h3>
              {errors.specialization && <span className="field-error">{errors.specialization}</span>}
              
              <div className="checkbox-grid">
                {specializationOptions.map(specialization => (
                  <label key={specialization} className="checkbox-label">
                    <input
                      type="checkbox"
                      name={`specialization_${specialization}`}
                      checked={formData.specialization.includes(specialization)}
                      onChange={handleInputChange}
                    />
                    <span>{specialization.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
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