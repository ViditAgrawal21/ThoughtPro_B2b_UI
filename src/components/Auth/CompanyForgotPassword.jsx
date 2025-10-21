import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authServices';
import { validateEmail } from '../../utils/helpers';
import '../Login/LoginPage.css';

const CompanyForgotPassword = () => {
  const [personalEmail, setPersonalEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!personalEmail) {
      setError('Please enter your personal email address');
      return;
    }

    if (!validateEmail(personalEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const result = await authService.forgotPasswordCompany(personalEmail);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Failed to send password reset email');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="login-card company-login">
          <div className="login-header">
            <div className="logo company-logo">
              <Building2 size={40} />
            </div>
            <h1 className="login-title">Password Reset Sent</h1>
            <p className="login-subtitle">Check your personal email</p>
          </div>

          <div className="success-content">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <p className="success-message">
              We've sent a password reset link to your personal email address: 
              <strong> {personalEmail}</strong>
            </p>
            <p className="success-instructions">
              Please check your inbox and follow the instructions to reset your company account password.
            </p>
            
            <div className="success-actions">
              <button 
                onClick={() => navigate('/company/login')} 
                className="primary-button company-button"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card company-login">
        <div className="login-header">
          <div className="logo company-logo">
            <Building2 size={40} />
          </div>
          <h1 className="login-title">Reset Password</h1>
          <p className="login-subtitle">Company account password recovery</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="forgot-password-info">
            <p>
              Enter your personal email address associated with your company account. 
              We'll send you a secure link to reset your password.
            </p>
          </div>

          <div className="input-group">
            <label className="label">Personal Email Address</label>
            <input
              type="email"
              value={personalEmail}
              onChange={(e) => setPersonalEmail(e.target.value)}
              placeholder="your.personal@email.com"
              className="input"
              disabled={loading}
              required
            />
            <small className="input-hint">
              This is your personal email, not your company email address
            </small>
          </div>

          {error && (
            <div className="error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="primary-button company-button" 
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="login-footer">
          <div className="back-to-login">
            <Link to="/company/login" className="back-link">
              <ArrowLeft size={16} />
              Back to Company Login
            </Link>
          </div>
          
          <div className="help-section">
            <h4>Need Help?</h4>
            <p>
              If you don't have access to your personal email or need assistance, 
              please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyForgotPassword;