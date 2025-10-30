import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Users, TrendingUp, Settings, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { companyService } from '../../services/companyService';
import './CompanyList.css';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchQuery]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAllCompanies(currentPage, 10, searchQuery);
      
      if (response.success) {
        setCompanies(response.data.companies || []);
        setTotalPages(Math.ceil((response.data.total || 0) / 10));
      } else {
        setError(response.message || 'Failed to fetch companies');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.deleteCompany(companyId);
        fetchCompanies();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="company-list-container">
        <div className="loading-spinner">Loading companies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-list-container">
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={fetchCompanies} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-list-container">
      <div className="company-list-header">
        <div className="header-left">
          <Building2 size={32} className="header-icon" />
          <div>
            <h1 className="page-title">Company Management</h1>
            <p className="page-subtitle">Manage companies and their settings</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="add-company-btn btn-small"
          >
            <Plus size={14} />
            Add Company
          </button>
        </div>
      </div>

      <div className="companies-grid">
        {companies.length === 0 ? (
          <div className="empty-state">
            <Building2 size={64} className="empty-icon" />
            <h3>No companies found</h3>
            <p>Get started by adding your first company</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="add-company-btn primary"
            >
              <Plus size={20} />
              Add Company
            </button>
          </div>
        ) : (
          companies.map((company) => (
            <div key={company.id} className="company-card">
              <div className="company-card-header">
                <div className="company-info">
                  <div className="company-avatar">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} />
                    ) : (
                      <Building2 size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="company-name">{company.name}</h3>
                    <p className="company-industry">{company.industry || 'Technology'}</p>
                  </div>
                </div>
                <div className="company-actions">
                  <button className="action-btn">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              <div className="company-stats">
                <div className="stat-item">
                  <Users size={16} className="stat-icon" />
                  <span className="stat-value">{company.employeeCount || 0}</span>
                  <span className="stat-label">Employees</span>
                </div>
                <div className="stat-item">
                  <TrendingUp size={16} className="stat-icon" />
                  <span className="stat-value">{company.subscriptionStatus || 'Active'}</span>
                  <span className="stat-label">Status</span>
                </div>
              </div>

              <div className="company-details">
                <p className="company-description">
                  {company.description || 'No description available'}
                </p>
                <div className="company-meta">
                  <span className="meta-item">
                    Created: {new Date(company.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="company-card-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => console.log('Edit company', company.id)}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => console.log('Company settings', company.id)}
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => handleDeleteCompany(company.id)}
                >
                  <Trash2 size={16} />
                  Delete
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

      {/* Add Company Modal would go here */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Add New Company</h2>
            <p>Company creation form would go here</p>
            <button onClick={() => setShowAddModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;