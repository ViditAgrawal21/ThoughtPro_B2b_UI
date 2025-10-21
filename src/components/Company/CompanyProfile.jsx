import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Users, Calendar, Save, Edit } from 'lucide-react';
import { companyService } from '../../services/companyService';
import { useAuth } from '../../hooks/useAuth';
import './CompanyProfile.css';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editForm, setEditForm] = useState({});
  
  const { getCompanyId } = useAuth();

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);
      const companyData = await companyService.getMyCompanyProfile();
      setCompany(companyData);
      setEditForm(companyData);
    } catch (error) {
      console.error('Error loading company profile:', error);
      setError('Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm(company);
    setError('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const updatedCompany = await companyService.updateMyCompanyProfile(editForm);
      setCompany(updatedCompany);
      setEditing(false);
    } catch (error) {
      console.error('Error updating company profile:', error);
      setError('Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="company-profile loading">
        <div className="spinner"></div>
        <p>Loading company profile...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-profile error">
        <p>Company profile not found</p>
      </div>
    );
  }

  return (
    <div className="company-profile">
      <div className="profile-header">
        <div className="company-avatar">
          <Building2 size={32} />
        </div>
        <div className="company-title">
          <h1>{company.name}</h1>
          <p>Company Profile</p>
        </div>
        <div className="profile-actions">
          {editing ? (
            <>
              <button 
                className="btn-secondary" 
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={handleEdit}>
              <Edit size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Company Name</label>
              {editing ? (
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter company name"
                />
              ) : (
                <div className="info-value">
                  <Building2 size={16} />
                  {company.name}
                </div>
              )}
            </div>

            <div className="info-item">
              <label>Contact Email</label>
              {editing ? (
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@company.com"
                />
              ) : (
                <div className="info-value">
                  <Mail size={16} />
                  {company.email || 'Not provided'}
                </div>
              )}
            </div>

            <div className="info-item">
              <label>Phone Number</label>
              {editing ? (
                <input
                  type="tel"
                  value={editForm.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              ) : (
                <div className="info-value">
                  <Phone size={16} />
                  {company.phone || 'Not provided'}
                </div>
              )}
            </div>

            <div className="info-item">
              <label>Contact Person</label>
              {editing ? (
                <input
                  type="text"
                  value={editForm.contactPerson || ''}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder="Full name"
                />
              ) : (
                <div className="info-value">
                  <Users size={16} />
                  {company.contactPerson || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Address Information</h3>
          <div className="info-item full-width">
            <label>Company Address</label>
            {editing ? (
              <textarea
                value={editForm.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter complete company address"
                rows="3"
              />
            ) : (
              <div className="info-value">
                <MapPin size={16} />
                {company.address || 'Not provided'}
              </div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Employee Count</label>
              <div className="info-value readonly">
                <Users size={16} />
                {company.employeeCount || 0}
              </div>
            </div>

            <div className="info-item">
              <label>Subscription Plan</label>
              <div className="info-value readonly">
                <Building2 size={16} />
                {company.subscriptionPlan || 'Standard'}
              </div>
            </div>

            <div className="info-item">
              <label>Account Status</label>
              <div className={`info-value readonly status ${company.status}`}>
                <div className={`status-indicator ${company.status}`}></div>
                {company.status || 'Active'}
              </div>
            </div>

            <div className="info-item">
              <label>Member Since</label>
              <div className="info-value readonly">
                <Calendar size={16} />
                {company.createdAt 
                  ? new Date(company.createdAt).toLocaleDateString()
                  : 'Unknown'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;