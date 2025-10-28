import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Save, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Globe,
  Users,
  Briefcase,
  Shield,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { companyService } from '../../services/companyService';
import PhoneInput from '../Common/PhoneInput';
import './AddCompany.css';

const AddCompany = ({ onSuccess, onBack }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    industry: '',
    size: '',
    description: '',
    contactPerson: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    contactPersonPosition: '',
    subscriptionPlan: 'basic',
    status: 'active',
    createLogin: true,
    loginEmail: '',
    temporaryPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  useEffect(() => {
    if (formData.createLogin) {
      const password = generateTemporaryPassword();
      setFormData(prev => ({ ...prev, temporaryPassword: password }));
    }
  }, [formData.createLogin]);

  useEffect(() => {
    if (formData.createLogin && formData.email) {
      setFormData(prev => ({ 
        ...prev, 
        loginEmail: formData.email 
      }));
    }
  }, [formData.email, formData.createLogin]);

  const handleInputChange = (e) => {
    e.persist();
    
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Company email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Company phone is required';
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      const localPhone = phoneDigits.length > 10 ? phoneDigits.slice(-10) : phoneDigits;
      if (localPhone.length !== 10) {
        newErrors.phone = 'Phone number must be exactly 10 digits';
      }
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }

    if (!formData.contactPersonEmail.trim()) {
      newErrors.contactPersonEmail = 'Contact person email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactPersonEmail)) {
      newErrors.contactPersonEmail = 'Please enter a valid email address';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.size) {
      newErrors.size = 'Company size is required';
    }

    if (!formData.subscriptionPlan) {
      newErrors.subscriptionPlan = 'Subscription plan is required';
    }

    if (formData.contactPersonPhone.trim()) {
      const phoneDigits = formData.contactPersonPhone.replace(/\D/g, '');
      const localPhone = phoneDigits.length > 10 ? phoneDigits.slice(-10) : phoneDigits;
      if (localPhone.length !== 10) {
        newErrors.contactPersonPhone = 'Phone number must be exactly 10 digits';
      }
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    if (formData.createLogin) {
      if (!formData.loginEmail.trim()) {
        newErrors.loginEmail = 'Login email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.loginEmail)) {
        newErrors.loginEmail = 'Please enter a valid email address';
      }

      if (!formData.temporaryPassword.trim()) {
        newErrors.temporaryPassword = 'Temporary password is required';
      } else if (formData.temporaryPassword.length < 8) {
        newErrors.temporaryPassword = 'Password must be at least 8 characters';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started...');
    console.log('Form data:', formData);
    
    const validationErrors = validateForm();
    console.log('Validation errors:', validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      console.log('Form validation failed, stopping submission');
      setErrors(validationErrors);
      return;
    }
    
    console.log('Form validation passed, proceeding with submission...');

    setLoading(true);
    setErrors({});
    
    try {
      // Generate unique domain slug from company name with .com extension
      const domainSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove consecutive hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      const fullDomain = `${domainSlug}.com`; // Add .com extension
      
      console.log('Generated domain:', fullDomain);
      
      // Map form size to API companySize format
      const companySizeMap = {
        '1': '1-10',
        '50': '11-50',
        '100': '51-100',
        '200': '101-200',
        '500': '201-500',
        '1000': '500+'
      };
      
      // Structure data according to API format
      const companyPayload = {
        name: formData.name,
        domain: fullDomain,
        industry: formData.industry,
        companySize: companySizeMap[formData.size] || '11-50',
        description: formData.description || `${formData.name} - Leading solutions provider`,
        website: formData.website || `https://${fullDomain}`,
        address: {
          street: formData.address || "123 Business Street",
          city: "Default City",
          state: "Default State", 
          zipCode: "12345",
          country: "India"
        },
        contact: {
          email: formData.email,
          phone: formData.phone.replace(/\D/g, '').slice(-10),
        },
        ownerName: formData.contactPerson,
        ownerEmail: formData.contactPersonEmail || formData.email,
        ownerPassword: formData.temporaryPassword,
        employee_subscription_config: {
          default_plan_type: formData.subscriptionPlan,
          default_validity_days: 90,
          subscription_expiry_days: 180,
          account_expiry_days: 365,
          employee_limit: 100,
          auto_assign_subscription: true,
          enforce_employee_limit: true,
          allowed_plan_types: ["basic", "premium", "ultra"]
        }
      };

      console.log('Sending payload to API:', companyPayload);

      const result = await companyService.createCompany(companyPayload);
      
      console.log('Company created successfully:', result);

      setCreatedCredentials({
        companyName: result.company?.name || formData.name,
        email: formData.loginEmail,
        password: formData.temporaryPassword,
        companyId: result.company?.id
      });

      setSuccess(true);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess(result);
        }, 3000);
      } else {
        setTimeout(() => {
          navigate('/admin/companies');
        }, 3000);
      }

    } catch (error) {
      console.error('Error creating company:', error);
      setErrors({ submit: error.message || 'Failed to create company. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      industry: '',
      size: '',
      description: '',
      contactPerson: '',
      contactPersonEmail: '',
      contactPersonPhone: '',
      contactPersonPosition: '',
      subscriptionPlan: 'basic',
      status: 'active',
      createLogin: true,
      loginEmail: '',
      temporaryPassword: ''
    });
    setErrors({});
    setSuccess(false);
    setCreatedCredentials(null);
  };

  const subscriptionPlans = [
    { value: 'basic', label: 'Basic Plan', description: 'Up to 50 employees' },
    { value: 'premium', label: 'Premium Plan', description: 'Up to 200 employees' },
    { value: 'ultra', label: 'Ultra Plan', description: 'Unlimited employees' }
  ];

  if (success && createdCredentials) {
    return (
      <div className="add-company-container">
        <div className="add-company-content">
          <div className="success-container">
            <CheckCircle className="success-icon" size={64} />
            <h2>Company Created Successfully!</h2>
            <p>The company has been registered in the system.</p>

            <div className="credentials-display">
              <h3>Login Credentials</h3>
              <div className="credentials-info">
                <div className="credential-item">
                  <span className="label">Company Name:</span>
                  <span className="value">{createdCredentials.companyName}</span>
                </div>
                <div className="credential-item">
                  <span className="label">Email:</span>
                  <span className="value">{createdCredentials.email}</span>
                </div>
                <div className="credential-item">
                  <span className="label">Temporary Password:</span>
                  <span className="value password">{createdCredentials.password}</span>
                </div>
              </div>
              <p className="credentials-note">
                ⚠️ Please save these credentials securely. The company will be required to change the password on first login.
              </p>
            </div>

            <p className="redirect-notice">Redirecting to companies list...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-company-container">
      <div className="add-company-content">
        <div className="page-header">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              <ArrowLeft size={16} />
              Back to Companies
            </button>
          )}
          <div className="header-title">
            <h1>Add New Company</h1>
            <p>Fill in the company details to create a new organization</p>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="company-form">
            <div className="form-section">
              <div className="section-header">
                <Building2 size={24} />
                <h2>Company Information</h2>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="required">
                    <Building2 size={16} />
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter company name"
                    disabled={loading}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="industry" className="required">
                    <Briefcase size={16} />
                    Industry
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={errors.industry ? 'error' : ''}
                    disabled={loading}
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Services">Services</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.industry && <span className="error-message">{errors.industry}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="required">
                    <Mail size={16} />
                    Company Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="company@example.com"
                    disabled={loading}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="required">
                    <Phone size={16} />
                    Company Phone
                  </label>
                  <PhoneInput
                    id="company-phone"
                    value={formData.phone}
                    onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                    placeholder="Enter phone number"
                    disabled={loading}
                    error={errors.phone}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="website">
                    <Globe size={16} />
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className={errors.website ? 'error' : ''}
                    placeholder="https://company.com"
                    disabled={loading}
                  />
                  {errors.website && <span className="error-message">{errors.website}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="size" className="required">
                    <Users size={16} />
                    Company Size
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className={errors.size ? 'error' : ''}
                    disabled={loading}
                  >
                    <option value="">Select Size</option>
                    <option value="1">1-10 employees</option>
                    <option value="50">11-50 employees</option>
                    <option value="100">51-100 employees</option>
                    <option value="200">101-200 employees</option>
                    <option value="500">201-500 employees</option>
                    <option value="1000">500+ employees</option>
                  </select>
                  {errors.size && <span className="error-message">{errors.size}</span>}
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
                    rows={3}
                    disabled={loading}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description about the company"
                    rows={3}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <User size={24} />
                <h2>Contact Person Details</h2>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="contactPerson" className="required">
                    <User size={16} />
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className={errors.contactPerson ? 'error' : ''}
                    placeholder="Enter contact person name"
                    disabled={loading}
                  />
                  {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contactPersonPosition">
                    Position
                  </label>
                  <input
                    type="text"
                    id="contactPersonPosition"
                    name="contactPersonPosition"
                    value={formData.contactPersonPosition}
                    onChange={handleInputChange}
                    placeholder="e.g., HR Manager, CEO"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactPersonEmail" className="required">
                    <Mail size={16} />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactPersonEmail"
                    name="contactPersonEmail"
                    value={formData.contactPersonEmail}
                    onChange={handleInputChange}
                    className={errors.contactPersonEmail ? 'error' : ''}
                    placeholder="contact@company.com"
                    disabled={loading}
                  />
                  {errors.contactPersonEmail && <span className="error-message">{errors.contactPersonEmail}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contactPersonPhone">
                    <Phone size={16} />
                    Contact Phone
                  </label>
                  <PhoneInput
                    id="contact-phone"
                    value={formData.contactPersonPhone}
                    onChange={(value) => setFormData(prev => ({ ...prev, contactPersonPhone: value }))}
                    placeholder="Contact person phone"
                    disabled={loading}
                    error={errors.contactPersonPhone}
                  />
                  {errors.contactPersonPhone && <span className="error-message">{errors.contactPersonPhone}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <Shield size={24} />
                <h2>Subscription Plan Selection</h2>
              </div>

              <div className="form-group">
                <label htmlFor="subscriptionPlan" className="required">
                  Select Subscription Plan for this Company
                </label>
                <select
                  id="subscriptionPlan"
                  name="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={handleInputChange}
                  className={errors.subscriptionPlan ? 'error' : ''}
                  disabled={loading}
                >
                  {subscriptionPlans.map(plan => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label} - {plan.description}
                    </option>
                  ))}
                </select>
                {errors.subscriptionPlan && <span className="error-message">{errors.subscriptionPlan}</span>}
                <p className="form-hint">
                  Choose the appropriate subscription plan based on the company's size and requirements
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="status">
                  Company Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <Key size={24} />
                <h2>Login Credentials</h2>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="createLogin"
                    checked={formData.createLogin}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <span className="checkmark"></span>
                  Create login credentials for this company
                </label>
                <p className="form-hint">
                  Enable this to create login access for the company to use the platform
                </p>
              </div>

              {formData.createLogin && (
                <div className="credentials-fields">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="loginEmail" className="required">
                        <Mail size={16} />
                        Login Email
                      </label>
                      <input
                        type="email"
                        id="loginEmail"
                        name="loginEmail"
                        value={formData.loginEmail}
                        onChange={handleInputChange}
                        className={errors.loginEmail ? 'error' : ''}
                        placeholder="login@company.com"
                        disabled={loading}
                      />
                      {errors.loginEmail && <span className="error-message">{errors.loginEmail}</span>}
                      <p className="form-hint">This email will be used for company login</p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="temporaryPassword" className="required">
                        <Key size={16} />
                        Password
                      </label>
                      <div className="password-input">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="temporaryPassword"
                          name="temporaryPassword"
                          value={formData.temporaryPassword}
                          onChange={handleInputChange}
                          className={errors.temporaryPassword ? 'error' : ''}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.temporaryPassword && <span className="error-message">{errors.temporaryPassword}</span>}
                      <p className="form-hint">
                        Company will be required to change this password on first login
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="generate-password-btn"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      temporaryPassword: generateTemporaryPassword()
                    }))}
                    disabled={loading}
                  >
                    Generate New Password
                  </button>
                </div>
              )}
            </div>

            <div className="form-actions">
              {errors.submit && (
                <div className="error-alert">
                  <AlertCircle size={16} />
                  {errors.submit}
                </div>
              )}

              <button
                type="button"
                className="reset-btn"
                onClick={handleReset}
                disabled={loading}
              >
                Reset Form
              </button>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="spinning" size={16} />
                    Creating Company
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Create Company
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompany;