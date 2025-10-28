import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Save, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Edit,
  Trash2,
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  Lock,
  Copy,
  RefreshCw,
  Settings,
  X
} from 'lucide-react';
import { companyService } from '../../services/companyService';
import AdminHeader from '../Header/AdminHeader';
import CredentialsDisplay from './CredentialsDisplay';
import AddCompany from './AddCompany';
import './CompanyManagement.css';

const CompanyManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showCredentials, setShowCredentials] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

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
    // Company Login Credentials
    loginEmail: '',
    temporaryPassword: '',
    generatePassword: false
  });

  // Generated password state
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Password generation function
  const generateRandomPassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      loadCompanies();
    }

    // Check for state from navigation
    if (location.state) {
      if (location.state.showCredentials) {
        setShowCredentials(location.state.showCredentials);
      }
      
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
      loadCompanyForEdit(id);
    }
  }, [view, location.state, id]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      // Use admin endpoint to get all companies
      const response = await companyService.getAllCompaniesAdmin();

      if (Array.isArray(response)) {
        setCompanies(response);
      } else if (response.data && Array.isArray(response.data)) {
        setCompanies(response.data);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      setCompanies([]);
      setNotification({
        type: 'error',
        message: error?.message?.includes('Server error')
          ? 'Unable to load company list. Server may be temporarily unavailable.'
          : 'Failed to load company list. Please try again.'
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyForEdit = async (companyId) => {
    try {
      setLoading(true);
      const response = await companyService.getCompanyById(companyId);
      
      if (response && (response.success || response.id)) {
        const company = response.data || response;
        setSelectedCompany(company);
        setFormData({
          name: company.name || '',
          email: company.email || '',
          phone: company.phone || '',
          address: company.address || '',
          contactPerson: company.contactPerson || '',
          contactPersonEmail: company.contactPersonEmail || '',
          contactPersonPhone: company.contactPersonPhone || '',
          description: company.description || '',
          website: company.website || '',
          industry: company.industry || '',
          size: company.size || '',
          status: company.status || 'active'
        });
      }
    } catch (error) {
      console.error('Error loading company:', error);
      setErrors({ load: 'Failed to load company details' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    // Handle password generation checkbox
    if (name === 'generatePassword') {
      if (checked) {
        // Generate new password when checked
        const newPassword = generateRandomPassword();
        setGeneratedPassword(newPassword);
        setFormData(prev => ({
          ...prev,
          temporaryPassword: newPassword
        }));
      } else {
        // Clear password when unchecked
        setGeneratedPassword('');
        setCopySuccess(false);
        setFormData(prev => ({
          ...prev,
          temporaryPassword: ''
        }));
      }
    }
    
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
      newErrors.name = 'Company name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }
    
    if (!formData.contactPersonEmail.trim()) {
      newErrors.contactPersonEmail = 'Contact person email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactPersonEmail)) {
      newErrors.contactPersonEmail = 'Please enter a valid contact person email';
    }

    // Validate login credentials for new companies
    if (view === 'add') {
      if (!formData.loginEmail.trim()) {
        newErrors.loginEmail = 'Login email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.loginEmail)) {
        newErrors.loginEmail = 'Please enter a valid login email';
      }

      if (!formData.generatePassword && !formData.temporaryPassword.trim()) {
        newErrors.temporaryPassword = 'Temporary password is required';
      } else if (!formData.generatePassword && formData.temporaryPassword.length < 8) {
        newErrors.temporaryPassword = 'Password must be at least 8 characters long';
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
      if (view === 'edit' && selectedCompany) {
        // Update existing company
        const result = await companyService.updateCompany(selectedCompany.id, formData);
        
        if (result.success || result.id) {
          setView('list');
          setNotification({
            message: 'Company updated successfully',
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
          loadCompanies();
        } else {
          setErrors({ submit: result.error || 'Failed to update company' });
        }
      } else {
        // Create new company
        const companyResult = await companyService.createCompany(formData);
        
        if (companyResult.success || companyResult.id) {
          const companyId = companyResult.data?.id || companyResult.id;
          
          try {
            const credentials = await companyService.createCompanyLogin({
              companyId: companyId,
              email: formData.contactPersonEmail,
              password: Math.random().toString(36).slice(-8),
              contactPersonName: formData.contactPerson
            });
            
            if (credentials.success || credentials.username) {
              setView('list');
              setShowCredentials({
                username: credentials.username || formData.contactPersonEmail,
                password: credentials.password,
                companyName: formData.name,
                contactPerson: formData.contactPerson
              });
              loadCompanies();
            }
          } catch (loginError) {
            console.error('Company created but login creation failed:', loginError);
            setView('list');
            setNotification({
              message: 'Company created successfully, but login creation failed',
              type: 'warning'
            });
            setTimeout(() => setNotification(null), 5000);
            loadCompanies();
          }
        } else {
          setErrors({ submit: companyResult.error || 'Failed to create company' });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to process request' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name || '',
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || '',
      contactPerson: company.contactPerson || '',
      contactPersonEmail: company.contactPersonEmail || '',
      contactPersonPhone: company.contactPersonPhone || '',
      description: company.description || '',
      website: company.website || '',
      industry: company.industry || '',
      size: company.size || '',
      status: company.status || 'active'
    });
    setView('edit');
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      setLoading(true);
      // Use admin delete endpoint
      const result = await companyService.deleteCompanyAdmin(companyId);
      
      if (result.success) {
        setCompanies(companies.filter(c => c.id !== companyId));
        setShowDeleteConfirm(null);
        setNotification({
          message: 'Company deleted successfully',
          type: 'success'
        });
        setTimeout(() => setNotification(null), 5000);
      } else {
        setErrors({ delete: result.error || 'Failed to delete company' });
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      setErrors({ delete: error.message || 'Failed to delete company' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setErrors({});
    setGeneratedPassword('');
    setCopySuccess(false);
    if (newView === 'add') {
      setFormData({
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
        loginEmail: '',
        temporaryPassword: '',
        generatePassword: false
      });
      setSelectedCompany(null);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || company.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const CompanyRow = ({ company }) => (
    <tr className="company-row">
      <td>
        <div className="company-info">
          <div className="company-avatar">
            <Building2 size={20} />
          </div>
          <div>
            <div className="company-name">{company.name}</div>
            <div className="company-email">{company.email}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="contact-person">
          {company.contactPerson || 'N/A'}
        </div>
      </td>
      <td>
        <div className={`status-badge ${company.status}`}>
          {company.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {company.status}
        </div>
      </td>
      <td>
        <div className="employee-count">
          <Users size={14} />
          {company.employeeCount || 0}
        </div>
      </td>
      <td>
        <div className="subscription-plan">
          {company.subscriptionPlan || 'Standard'}
        </div>
      </td>
      <td>
        <div className="created-date">
          {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      </td>
      <td>
        <div className="actions">
          <button 
            className="action-btn edit"
            onClick={() => handleEditCompany(company)}
            title="Edit Company"
          >
            <Edit size={16} />
          </button>
          <button 
            className="action-btn subscription"
            onClick={() => setShowSubscriptionModal(company)}
            title="Manage Subscription"
          >
            <Settings size={16} />
          </button>
          <button 
            className="action-btn delete"
            onClick={() => setShowDeleteConfirm(company.id)}
            title="Delete Company"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  const ListView = () => (
    <div className="company-management-list">
      <div className="page-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1>Company Management</h1>
          <p>Manage all registered companies</p>
        </div>
        <button className="btn-primary" onClick={() => handleViewChange('add')}>
          <Plus size={20} />
          Add Company
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={20} />
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
            <p>Loading companies...</p>
          </div>
        ) : (
          <table className="companies-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact Person</th>
                <th>Status</th>
                <th>Employees</th>
                <th>Plan</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map(company => (
                  <CompanyRow key={company.id} company={company} />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No companies found
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
    <div className="add-company-container">
      <div className="add-company-header">
        <button onClick={() => setView('list')} className="back-button">
          <ArrowLeft size={20} />
          <span>Back to Companies</span>
        </button>
        
        <div className="page-title">
          <Building2 size={24} />
          <h1>{view === 'edit' ? 'Edit Company' : 'Add New Company'}</h1>
        </div>
      </div>

      <div className="add-company-content">
        <form onSubmit={handleSubmit} className="company-form">
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

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

            <div className="form-row">
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
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the company"
                rows="3"
              />
            </div>
          </div>

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
                  placeholder="Full name of contact person"
                />
                {errors.contactPerson && <span className="field-error">{errors.contactPerson}</span>}
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

            <div className="form-row">
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
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {view === 'add' && (
            <div className="form-section">
              <h3>Company Login Credentials</h3>
              
              <div className="form-row">
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
                    placeholder="company.admin@company.com"
                  />
                  {errors.loginEmail && <span className="field-error">{errors.loginEmail}</span>}
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="generatePassword"
                        checked={formData.generatePassword}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Generate Password Automatically
                    </label>
                  </div>
                </div>
              </div>

              {formData.generatePassword && generatedPassword && (
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <Lock size={16} />
                      Generated Password
                    </label>
                    <div className="password-display">
                      <input
                        type="text"
                        value={generatedPassword}
                        readOnly
                        className="generated-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedPassword)}
                        className="copy-password-btn"
                        title="Copy to clipboard"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newPassword = generateRandomPassword();
                          setGeneratedPassword(newPassword);
                          setFormData(prev => ({
                            ...prev,
                            temporaryPassword: newPassword
                          }));
                        }}
                        className="regenerate-password-btn"
                        title="Generate new password"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </div>
                    {copySuccess && (
                      <span className="copy-success">✓ Password copied to clipboard!</span>
                    )}
                    <small className="field-hint">
                      12-character password with letters, numbers, and symbols
                    </small>
                  </div>
                </div>
              )}

              {!formData.generatePassword && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="temporaryPassword">
                      <Lock size={16} />
                      Temporary Password *
                    </label>
                    <input
                      type="password"
                      id="temporaryPassword"
                      name="temporaryPassword"
                      value={formData.temporaryPassword}
                      onChange={handleInputChange}
                      className={errors.temporaryPassword ? 'error' : ''}
                      placeholder="Enter temporary password"
                    />
                    {errors.temporaryPassword && <span className="field-error">{errors.temporaryPassword}</span>}
                    <small className="field-hint">
                      Password should be at least 8 characters with numbers and letters
                    </small>
                  </div>
                </div>
              )}
            </div>
          )}

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
              {loading ? (view === 'edit' ? 'Updating...' : 'Creating...') : (view === 'edit' ? 'Update Company' : 'Create Company')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Handle subscription plan update
  const handleUpdateSubscription = async (companyId, newPlan) => {
    setSubscriptionLoading(true);
    try {
      await companyService.updateCompanySubscriptionConfig(companyId, {
        subscriptionPlan: newPlan,
        updated_at: new Date().toISOString()
      });
      
      // Update local companies state
      setCompanies(prev => 
        prev.map(company => 
          company.id === companyId 
            ? { ...company, subscriptionPlan: newPlan }
            : company
        )
      );
      
      setShowSubscriptionModal(null);
      setNotification({
        type: 'success',
        message: 'Subscription plan updated successfully!'
      });
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
      
    } catch (error) {
      console.error('Error updating subscription:', error);
      setNotification({
        type: 'error',
        message: 'Failed to update subscription plan: ' + error.message
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const SubscriptionModal = () => {
    const [selectedPlan, setSelectedPlan] = useState(showSubscriptionModal?.subscriptionPlan || 'basic');
    
    return (
      <div className="modal-overlay">
        <div className="modal-content subscription-modal">
          <div className="modal-header">
            <h3>Manage Subscription Plan</h3>
            <button 
              className="modal-close"
              onClick={() => setShowSubscriptionModal(null)}
              disabled={subscriptionLoading}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="company-info">
              <div className="company-name">{showSubscriptionModal?.name}</div>
              <div className="current-plan">
                <span className="label">Current Plan:</span>
                <span className="plan-badge">{showSubscriptionModal?.subscriptionPlan || 'Basic'}</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subscriptionPlan" className="form-label">Select New Plan</label>
              <select
                id="subscriptionPlan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                disabled={subscriptionLoading}
                className="subscription-select"
              >
                <option value="basic">Basic Plan</option>
                <option value="premium">Premium Plan</option>
                <option value="ultra">Ultra Plan</option>
                <option value="business">Business Plan</option>
                <option value="enterprise">Enterprise Plan</option>
              </select>
            </div>

            <div className="plan-info">
              <div className="plan-info-header">Plan Features</div>
              <ul className="plan-features-list">
                {selectedPlan === 'basic' && (
                  <>
                    <li>Up to 50 employees</li>
                    <li>Basic analytics</li>
                    <li>Email support</li>
                  </>
                )}
                {selectedPlan === 'premium' && (
                  <>
                    <li>Up to 200 employees</li>
                    <li>Advanced analytics</li>
                    <li>Priority support</li>
                    <li>Custom reports</li>
                  </>
                )}
                {selectedPlan === 'ultra' && (
                  <>
                    <li>Up to 500 employees</li>
                    <li>Premium analytics</li>
                    <li>24/7 support</li>
                    <li>Advanced integrations</li>
                  </>
                )}
                {selectedPlan === 'business' && (
                  <>
                    <li>Up to 1000 employees</li>
                    <li>Business analytics</li>
                    <li>Dedicated support</li>
                    <li>Custom features</li>
                  </>
                )}
                {selectedPlan === 'enterprise' && (
                  <>
                    <li>Unlimited employees</li>
                    <li>Enterprise analytics</li>
                    <li>White-label options</li>
                    <li>Custom solutions</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <div className="modal-actions">
            <button
              type="button"
              onClick={() => setShowSubscriptionModal(null)}
              disabled={subscriptionLoading}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleUpdateSubscription(showSubscriptionModal.id, selectedPlan)}
              disabled={subscriptionLoading || selectedPlan === showSubscriptionModal?.subscriptionPlan}
              className="update-button"
            >
              {subscriptionLoading ? 'Updating...' : 'Update Plan'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = () => (
    <div className="modal-overlay">
      <div className="modal-content delete-confirm">
        <h3>Delete Company</h3>
        <p>Are you sure you want to delete this company? This action cannot be undone and will also remove all associated employees and data.</p>
        <div className="form-actions">
          <button onClick={() => setShowDeleteConfirm(null)}>
            Cancel
          </button>
          <button 
            className="delete-btn"
            onClick={() => handleDeleteCompany(showDeleteConfirm)}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Company'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="company-management-page">
      <AdminHeader />
      
      <div className="company-management">
        {view === 'list' ? (
          <ListView />
        ) : view === 'add' ? (
          <div>
            <div className="add-company-header">
              <button onClick={() => setView('list')} className="back-button">
                <ArrowLeft size={20} />
                <span>Back to Companies</span>
              </button>
            </div>
            <AddCompany 
              onSuccess={() => {
                setView('list');
                setNotification({ message: 'Company created successfully', type: 'success' });
                loadCompanies();
              }}
              onBack={() => setView('list')}
            />
          </div>
        ) : (
          <FormView />
        )}
        
        {showDeleteConfirm && <DeleteConfirmModal />}
        
        {showSubscriptionModal && <SubscriptionModal />}
        
        {showCredentials && (
          <CredentialsDisplay
            credentials={showCredentials}
            onClose={() => setShowCredentials(null)}
          />
        )}
        
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

export default CompanyManagement;