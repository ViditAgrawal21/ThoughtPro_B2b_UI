import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import { authService } from '../../services/authServices';
import { validateEmail } from '../../utils/helpers';
import './LoginPage.css';

const CompanyLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const { updateCompanyName } = useSettings();
  const navigate = useNavigate();

  const validateDomain = (domain) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const formatEmailFromDomain = (domain) => {
    return `company@`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    let actualEmail = email;
    if (!email.includes('@')) {
      if (!validateDomain(email)) {
        setError('Please enter a valid company domain (e.g., yourcompany.com)');
        return;
      }
      actualEmail = formatEmailFromDomain(email);
    } else {
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setLoading(true);
    
    try {
      let companyName = 'Your Company';
      let domain;
      
      if (email.includes('@')) {
        domain = email.split('@')[1];
      } else {
        domain = email;
      }
      
      if (domain) {
        const baseName = domain.split('.')[0];
        companyName = baseName.charAt(0).toUpperCase() + baseName.slice(1) + ' Company';
      }
      
      updateCompanyName(companyName);
      
      const result = await login(actualEmail, password, 'company');
      
      if (result.success) {
        navigate('/dashboard');
      } else if (result.requiresPasswordSetup || result.requiresPasswordChange) {
        navigate('/company/set-password', { 
          state: { 
            email: actualEmail,
            temporaryPassword: password,
            isFirstLogin: result.isFirstLogin || true,
            message: result.message || 'Welcome! Please set your new password to continue accessing your company portal.' 
          } 
        });
      } else {
        try {
          const tempResult = await authService.loginWithTemporary(actualEmail, password);
          
          if (tempResult.requiresPasswordChange || tempResult.isFirstLogin) {
            navigate('/company/set-password', { 
              state: { 
                email: actualEmail,
                temporaryPassword: password,
                isFirstLogin: tempResult.isFirstLogin,
                token: tempResult.token,
                message: 'This is your first login. Please set a new password to continue.' 
              } 
            });
          } else if (tempResult.success) {
            navigate('/dashboard');
          } else {
            setError('Invalid credentials. Please check your email and password or contact your administrator.');
          }
        } catch (tempError) {
          setError(result.error || result.message || 'Invalid company credentials. Please check your email and password or contact your administrator for assistance.');
        }
      }
    } catch (err) {
      console.error('Company login error:', err);
      
      if (err.message) {
        if (err.message.includes('Authentication required') || 
            err.message.includes('401') || 
            err.message.includes('Unauthorized') ||
            err.message.includes('Invalid credentials')) {
          setError('Invalid credentials. Please check your email and password.');
        } else if (err.message.includes('temporary') || 
                   err.message.includes('first') || 
                   err.message.includes('setup')) {
          navigate('/company/set-password', { 
            state: { 
              email: actualEmail,
              temporaryPassword: password,
              isFirstLogin: true,
              message: 'First time login detected. Please set your new password to continue.' 
            } 
          });
        } else if (err.message.includes('password') && err.message.includes('change')) {
          navigate('/company/set-password', { 
            state: { 
              email: actualEmail,
              temporaryPassword: password,
              message: 'Password change required. Please set your new password.' 
            } 
          });
        } else if (err.message.includes('Network error') || 
                   err.message.includes('NETWORK_ERROR')) {
          setError('Network connection error. Please check your internet connection.');
        } else if (err.message.includes('Server error') || 
                   err.message.includes('500')) {
          setError('Server temporarily unavailable. Please try again later.');
        } else {
          setError('Invalid credentials. Please check your email and password.');
        }
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card company-login">
        <div className="login-header">
          <div className="logo company-logo">
            <Building2 size={40} />
          </div>
          <h1 className="login-title">Company Portal</h1>
          <p className="login-subtitle">Manage your company's wellness</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="label">Company Domain or Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="company@gmail.com"
              className="input"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter company password"
                className="input"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
            {loading ? 'Signing in...' : 'Company Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <div className="login-switch">
            <p>System administrator?</p>
            <Link to="/admin/login" className="switch-link">
              <Shield size={16} />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLoginPage;
