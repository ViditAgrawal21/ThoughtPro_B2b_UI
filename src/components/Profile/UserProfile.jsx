import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building2, Calendar, Edit3, Save, X, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authServices';
import Header from '../Header/Header';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getUserProfileFromAPI();
      
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          department: response.data.department || '',
          position: response.data.position || '',
          bio: response.data.bio || ''
        });
      } else {
        // Fallback to local profile data
        const localProfile = authService.getUserProfile();
        const localUser = authService.getCurrentUser();
        
        const fallbackProfile = {
          name: localUser?.name || 'User',
          email: localUser?.email || '',
          phone: localUser?.phone || '',
          role: localProfile?.role || 'employee',
          company_name: localProfile?.company_name || '',
          department: '',
          position: '',
          bio: ''
        };
        
        setProfile(fallbackProfile);
        setFormData({
          name: fallbackProfile.name,
          email: fallbackProfile.email,
          phone: fallbackProfile.phone,
          department: fallbackProfile.department,
          position: fallbackProfile.position,
          bio: fallbackProfile.bio
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile information');
      
      // Use local fallback
      const localProfile = authService.getUserProfile();
      const localUser = authService.getCurrentUser();
      
      if (localUser) {
        const fallbackProfile = {
          name: localUser.name || 'User',
          email: localUser.email || '',
          phone: localUser.phone || '',
          role: localProfile?.role || 'employee',
          company_name: localProfile?.company_name || ''
        };
        setProfile(fallbackProfile);
        setFormData({
          name: fallbackProfile.name,
          email: fallbackProfile.email,
          phone: fallbackProfile.phone,
          department: '',
          position: '',
          bio: ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    if (editing) {
      // Cancel edit - reset form data
      setFormData({
        name: profile?.name || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        department: profile?.department || '',
        position: profile?.position || '',
        bio: profile?.bio || ''
      });
      setError('');
    }
    setEditing(!editing);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      // For now, we'll use registerProfile to update the profile
      // In a real implementation, there would be an updateProfile endpoint
      const response = await authService.registerProfile({
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        bio: formData.bio
      });

      if (response.success) {
        setSuccess('Profile updated successfully!');
        setProfile(prev => ({
          ...prev,
          ...formData
        }));
        setEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'admin': 'Administrator',
      'company': 'Company User', 
      'employee': 'Employee'
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-title">
            <User size={28} />
            <h1>My Profile</h1>
          </div>
          <button
            className={`edit-button ${editing ? 'cancel' : 'edit'}`}
            onClick={handleEditToggle}
            disabled={saving}
          >
            {editing ? <X size={20} /> : <Edit3 size={20} />}
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <label>
                  <User size={20} />
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <span>{profile?.name || 'Not provided'}</span>
                )}
              </div>

              <div className="detail-row">
                <label>
                  <Mail size={20} />
                  Email Address
                </label>
                <span className="readonly-field">{profile?.email || 'Not provided'}</span>
                {editing && <small>Email cannot be changed</small>}
              </div>

              <div className="detail-row">
                <label>
                  <Phone size={20} />
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <span>{profile?.phone || 'Not provided'}</span>
                )}
              </div>

              <div className="detail-row">
                <label>
                  <Building2 size={20} />
                  Role
                </label>
                <span className="role-badge">
                  {getRoleDisplayName(profile?.role)}
                </span>
              </div>

              {profile?.company_name && (
                <div className="detail-row">
                  <label>
                    <Building2 size={20} />
                    Company
                  </label>
                  <span>{profile.company_name}</span>
                </div>
              )}

              <div className="detail-row">
                <label>
                  <Building2 size={20} />
                  Department
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Enter your department"
                  />
                ) : (
                  <span>{profile?.department || 'Not specified'}</span>
                )}
              </div>

              <div className="detail-row">
                <label>
                  <Calendar size={20} />
                  Position
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Enter your position"
                  />
                ) : (
                  <span>{profile?.position || 'Not specified'}</span>
                )}
              </div>

              <div className="detail-row bio-row">
                <label>
                  <Edit3 size={20} />
                  Bio
                </label>
                {editing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                ) : (
                  <p className="bio-text">
                    {profile?.bio || 'No bio provided'}
                  </p>
                )}
              </div>

              {editing && (
                <div className="profile-actions">
                  <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="button-spinner"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;