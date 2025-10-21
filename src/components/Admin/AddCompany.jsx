import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Save, ArrowLeft, Mail, Phone, MapPin, User } from 'lucide-react';
import { companyService } from '../../services/companyService';
import AdminHeader from '../Header/AdminHeader';
import './AddCompany.css';

const AddCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    description: '',
    website: '',
    industry: '',
    size: '',
    status: 'active',
    createLogin: true,
    loginEmail: '',
    temporaryPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-populate login email with company email when createLogin is enabled
    if (name === 'email' && formData.createLogin && !formData.loginEmail) {
      setFormData(prev => ({
        ...prev,
        loginEmail: value
      }));
    }
    
    // Auto-generate temporary password when login email is set
    if (name === 'loginEmail' && value && !formData.temporaryPassword) {
      const tempPassword = generateTemporaryPassword();
      setFormData(prev => ({
        ...prev,
        temporaryPassword: tempPassword
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

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.contactPersonEmail.trim()) {
      newErrors.contactPersonEmail = 'Contact person email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactPersonEmail)) {
      newErrors.contactPersonEmail = 'Please enter a valid email';
    }
    
    // Validate login credentials if creating login
    if (formData.createLogin) {
      if (!formData.loginEmail.trim()) {
        newErrors.loginEmail = 'Login email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.loginEmail)) {
        newErrors.loginEmail = 'Please enter a valid login email';
      }
      
      if (!formData.temporaryPassword.trim()) {
        newErrors.temporaryPassword = 'Temporary password is required';
      } else if (formData.temporaryPassword.length < 8) {
        newErrors.temporaryPassword = 'Password must be at least 8 characters';
      }
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
      // Create company first
      const companyResult = await companyService.createCompany(formData);
      
      if (companyResult.success || companyResult.id) {
        // Create login credentials if requested
        if (formData.createLogin) {
          try {
            await companyService.createCompanyLogin({
              companyId: companyResult.id,
              email: formData.loginEmail,
              temporaryPassword: formData.temporaryPassword,
              companyName: formData.name
            });
          } catch (loginError) {
            console.warn('Company created but login creation failed:', loginError);
            // Company was created successfully, just show warning about login
            navigate('/admin/companies', {
              state: { 
                message: `Company created successfully. Login credentials creation failed: ${loginError.message}`,
                type: 'warning'
              }
            });
            return;
          }
        }
        
        const successMessage = formData.createLogin 
          ? `Company created successfully with login credentials. Temporary password: ${formData.temporaryPassword}`
          : 'Company created successfully';
          
        // Success - redirect to companies list
        navigate('/admin/companies', {
          state: { 
            message: successMessage,
            type: 'success',
            showCredentials: formData.createLogin ? {
              email: formData.loginEmail,
              temporaryPassword: formData.temporaryPassword
            } : null
          }
        });
      } else {
        setErrors({ submit: companyResult.error || 'Failed to create company' });
      }
    } catch (error) {
      console.error('Error creating company:', error);
      setErrors({ submit: error.message || 'Failed to create company' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/companies');
  };

  return (
    <div className="add-company-page">
      <AdminHeader />
      
      <div className="add-company-container">
        <div className="add-company-header">
          <button onClick={handleBack} className="back-button">
            <ArrowLeft size={20} />
            <span>Back to Companies</span>
          </button>
          
          <div className="page-title">
            <Building2 size={24} />
            <h1>Add New Company</h1>
          </div>
        </div>

        <div className="add-company-content">
          <form onSubmit={handleSubmit} className="company-form">
            {errors.submit && (
              <div className="error-message">
                {errors.submit}
              </div>
            )}

            {/* Company Information */}
            <div className="form-section">
              <h3>Company Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <Building2 size={16} />
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter company name"
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="industry">Industry</label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} />
                    Company Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="company@example.com"
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.company.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="size">Company Size</label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
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
                  placeholder="Enter company address"
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the company"
                  rows="4"
                />
              </div>
            </div>

            {/* Contact Person Information */}
            <div className="form-section">
              <h3>Primary Contact Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactPerson">
                    <User size={16} />
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className={errors.contactPerson ? 'error' : ''}
                    placeholder="Full name"
                  />
                  {errors.contactPerson && <span className="field-error">{errors.contactPerson}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contactPersonPhone">
                    <Phone size={16} />
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contactPersonPhone"
                    name="contactPersonPhone"
                    value={formData.contactPersonPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contactPersonEmail">
                  <Mail size={16} />
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactPersonEmail"
                  name="contactPersonEmail"
                  value={formData.contactPersonEmail}
                  onChange={handleInputChange}
                  className={errors.contactPersonEmail ? 'error' : ''}
                  placeholder="contact@company.com"
                />
                {errors.contactPersonEmail && <span className="field-error">{errors.contactPersonEmail}</span>}
              </div>
            </div>

            {/* Login Credentials Section */}
            <div className="form-section">
              <h3>Company Login Credentials</h3>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="createLogin"
                    checked={formData.createLogin}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-custom"></span>
                  Create login credentials for this company
                </label>
                <small className="form-hint">
                  Generate temporary login credentials that will be sent to the company
                </small>
              </div>

              {formData.createLogin && (
                <>
                  <div className="form-group">
                    <label htmlFor="loginEmail">
                      <Mail size={16} />
                      Login Email *
                    </label>
                    <input
                      type="email"
                      id="loginEmail"
                      name="loginEmail"
                      value={formData.loginEmail}
                      onChange={handleInputChange}
                      className={errors.loginEmail ? 'error' : ''}
                      placeholder="login@company.com"
                    />
                    {errors.loginEmail && <span className="field-error">{errors.loginEmail}</span>}
                    <small className="form-hint">
                      This email will be used for company portal login
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="temporaryPassword">
                      Temporary Password *
                    </label>
                    <div className="password-input-group">
                      <input
                        type="text"
                        id="temporaryPassword"
                        name="temporaryPassword"
                        value={formData.temporaryPassword}
                        onChange={handleInputChange}
                        className={errors.temporaryPassword ? 'error' : ''}
                        placeholder="Auto-generated temporary password"
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          temporaryPassword: generateTemporaryPassword() 
                        }))}
                        className="regenerate-button"
                      >
                        Regenerate
                      </button>
                    </div>
                    {errors.temporaryPassword && <span className="field-error">{errors.temporaryPassword}</span>}
                    <small className="form-hint">
                      Company will be required to change this password on first login
                    </small>
                  </div>

                  <div className="credentials-info">
                    <p><strong>Important:</strong> These credentials will be sent to the company via email. 
                    Make sure the login email address is correct.</p>
                  </div>
                </>
              )}
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
                {loading ? 'Creating...' : 'Create Company'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompany;