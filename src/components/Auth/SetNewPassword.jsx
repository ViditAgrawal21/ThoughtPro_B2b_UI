import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authServices';
import './SetNewPassword.css';

const SetNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    temporaryPassword: location.state?.temporaryPassword || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    temp: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    // Get email and temporary password from location state or URL params
    const email = location.state?.email || new URLSearchParams(location.search).get('email');
    const tempPassword = location.state?.temporaryPassword;
    
    if (email) {
      setFormData(prev => ({ 
        ...prev, 
        email,
        temporaryPassword: tempPassword || prev.temporaryPassword
      }));
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.email || !formData.temporaryPassword || !formData.newPassword || !formData.confirmPassword) {
        throw new Error('All fields are required');
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (!validatePassword(formData.newPassword)) {
        throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters');
      }

      // First verify temporary login
      const tempLoginResponse = await authService.loginWithTemporary(formData.email, formData.temporaryPassword);
      
      if (tempLoginResponse.success || tempLoginResponse.requiresPasswordChange) {
        // Update password using the API endpoint
        const updateResponse = await authService.updateTemporaryPassword(
          formData.newPassword,
          formData.confirmPassword
        );
        
        if (updateResponse.success) {
          // Auto-login with new credentials
          const loginResponse = await login(formData.email, formData.newPassword, 'company');
          
          if (loginResponse.success) {
            navigate('/dashboard');
          } else {
            throw new Error('Failed to login with new password');
          }
        } else {
          throw new Error(updateResponse.message || 'Failed to update password');
        }
      } else {
        throw new Error('Invalid temporary credentials');
      }

    } catch (error) {
      setError(error.message || 'Failed to set new password');
    } finally {
      setLoading(false);
    }
  };

  const goBackToLogin = () => {
    navigate('/company/login');
  };

  return (
    <div className="set-password-container">
      <div className="set-password-card">
        <div className="set-password-header">
          <h2>Set New Password</h2>
          <p>{location.state?.message || 'Welcome! Please set your new password to continue.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="set-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="your-email@company.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="temporaryPassword">Temporary Password</label>
            <div className="password-input-group">
              <input
                type={showPasswords.temp ? 'text' : 'password'}
                id="temporaryPassword"
                name="temporaryPassword"
                value={formData.temporaryPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Enter temporary password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('temp')}
                tabIndex="-1"
              >
                {showPasswords.temp ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <small className="form-hint">Enter the temporary password provided by your administrator</small>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-group">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('new')}
                tabIndex="-1"
              >
                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <small className="form-hint">
              Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input-group">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
                tabIndex="-1"
              >
                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={goBackToLogin}
              className="btn-secondary"
              disabled={loading}
            >
              Back to Login
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Setting Password...' : 'Set Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetNewPassword;