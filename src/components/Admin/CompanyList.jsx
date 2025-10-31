import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import { companyService } from '../../services/companyService';
import AdminHeader from '../Header/AdminHeader';
import CredentialsDisplay from './CredentialsDisplay';
import './CompanyList.css';

const CompanyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showCredentials, setShowCredentials] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadCompanies();
    
    // Check for state from navigation (credentials, messages)
    if (location.state) {
      if (location.state.showCredentials) {
        setShowCredentials(location.state.showCredentials);
      }
      
      if (location.state.message) {
        setNotification({
          message: location.state.message,
          type: location.state.type || 'success'
        });
        
        // Clear notification after 5 seconds
        setTimeout(() => setNotification(null), 5000);
      }
      
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAllCompanies();
      
      if (Array.isArray(response)) {
        // Enhance each company with subscription config
        const companiesWithSubscription = await Promise.all(
          response.map(async (company) => {
            try {
              const subscriptionResponse = await companyService.getCompanySubscriptionConfig(company.id);
              return {
                ...company,
                subscriptionConfig: subscriptionResponse.data || null
              };
            } catch (error) {
              console.warn(`Failed to load subscription for company ${company.id}:`, error);
              return company;
            }
          })
        );
        setCompanies(companiesWithSubscription);
      } else if (response.data && Array.isArray(response.data)) {
        // Enhance each company with subscription config
        const companiesWithSubscription = await Promise.all(
          response.data.map(async (company) => {
            try {
              const subscriptionResponse = await companyService.getCompanySubscriptionConfig(company.id);
              return {
                ...company,
                subscriptionConfig: subscriptionResponse.data || null
              };
            } catch (error) {
              console.warn(`Failed to load subscription for company ${company.id}:`, error);
              return company;
            }
          })
        );
        setCompanies(companiesWithSubscription);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = () => {
    navigate('/admin/companies/add');
  };

  const handleViewCompany = (company) => {
    // Navigate to company details page
    navigate(`/admin/companies/${company.id}`);
  };

  const handleEditCompany = (company) => {
    // Navigate to edit page or show edit modal
    navigate(`/admin/companies/${company.id}/edit`);
  };

  const handleManageSubscription = (company) => {
    // Navigate to subscription management page
    navigate(`/admin/companies/${company.id}/subscription`);
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      await companyService.deleteCompany(companyId);
      setCompanies(companies.filter(c => c.id !== companyId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company');
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
          <div className="plan-type">
            {company.subscriptionConfig?.default_plan_type || company.subscriptionPlan || 'N/A'}
          </div>
          <div className="employee-limit">
            Limit: {company.subscriptionConfig?.employee_limit || 'N/A'}
          </div>
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
            className="action-btn view"
            onClick={() => handleViewCompany(company)}
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button 
            className="action-btn edit"
            onClick={() => handleEditCompany(company)}
            title="Edit Company"
          >
            <Edit size={16} />
          </button>
          <button 
            className="action-btn subscription"
            onClick={() => handleManageSubscription(company)}
            title="Manage Subscription"
          >
            <Users size={16} />
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

  const CreateCompanyModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Company</h3>
        <form className="create-form">
          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input type="text" placeholder="Enter company name" required />
            </div>
            <div className="form-group">
              <label>Contact Email *</label>
              <input type="email" placeholder="contact@company.com" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Contact Person</label>
              <input type="text" placeholder="Full name" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+1 (555) 123-4567" />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea placeholder="Company address" rows="3"></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="form-group">
              <label>Subscription Plan</label>
              <select>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
            <button type="submit">
              Create Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeleteConfirmModal = () => (
    <div className="modal-overlay">
      <div className="modal-content delete-confirm">
        <h3>Delete Company</h3>
        <p>Are you sure you want to delete this company? This action cannot be undone.</p>
        <div className="form-actions">
          <button onClick={() => setShowDeleteConfirm(null)}>
            Cancel
          </button>
          <button 
            className="delete-btn"
            onClick={() => handleDeleteCompany(showDeleteConfirm)}
          >
            Delete Company
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="company-list-page">
      <AdminHeader />
      <div className="company-list">
        <div className="page-header">
          <div className="header-left">
            <button 
              className="back-to-dashboard-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back button clicked - navigating to /admin/dashboard');
                window.location.href = '/admin/dashboard';
              }}
              title="Back to Dashboard"
              type="button"
              style={{ 
                cursor: 'pointer', 
                zIndex: 1000, 
                position: 'relative',
                pointerEvents: 'auto',
                border: '2px solid red'
              }}
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <h1>Companies</h1>
            <p>Manage all registered companies</p>
        </div>
        <button className="btn-primary" onClick={handleCreateCompany}>
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

      {showCreateModal && <CreateCompanyModal />}
      {showDeleteConfirm && <DeleteConfirmModal />}
      
      {/* Show credentials modal if credentials were generated */}
      {showCredentials && (
        <CredentialsDisplay
          credentials={showCredentials}
          onClose={() => setShowCredentials(null)}
        />
      )}
      
      {/* Show notification if present */}
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

export default CompanyList;