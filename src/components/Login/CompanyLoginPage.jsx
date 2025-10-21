import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Shield, AlertCircle } from 'lucide-react';
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
  
  const { login } = useAuth();
  const { updateCompanyName } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // Extract company name from email domain for display
      const domain = email.split('@')[1];
      let companyName = 'Your Company';
      
      if (domain) {
        companyName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1) + ' Company';
      }
      
      updateCompanyName(companyName);
      
      // First, try logging in with regular company login
      const result = await login(email, password, 'company');
      
      if (result.success) {
        // Successful regular login - redirect to company dashboard
        navigate('/dashboard');
      } else if (result.requiresPasswordSetup || result.requiresPasswordChange) {
        // Password setup/change required - redirect to password setup with proper context
        navigate('/company/set-password', { 
          state: { 
            email: email,
            temporaryPassword: password,
            isFirstLogin: result.isFirstLogin || true,
            message: result.message || 'Welcome! Please set your new password to continue accessing your company portal.' 
          } 
        });
      } else {
        // Regular login failed - this could be a temporary password scenario
        // According to API docs, we should try temporary login flow
        try {
          // Try login with temporary password API endpoint
          const tempResult = await authService.loginWithTemporary(email, password);
          
          if (tempResult.requiresPasswordChange || tempResult.isFirstLogin) {
            // Temporary login successful but needs password change
            navigate('/company/set-password', { 
              state: { 
                email: email,
                temporaryPassword: password,
                isFirstLogin: tempResult.isFirstLogin,
                token: tempResult.token,
                message: 'This is your first login. Please set a new password to continue.' 
              } 
            });
          } else if (tempResult.success) {
            // Temporary login successful and no password change needed
            navigate('/dashboard');
          } else {
            setError('Invalid credentials. Please check your email and password or contact your administrator.');
          }
        } catch (tempError) {
          // Both regular and temporary login failed
          setError(result.error || result.message || 'Invalid company credentials. Please check your email and password or contact your administrator for assistance.');
        }
      }
    } catch (err) {
      console.error('Company login error:', err);
      
      // Enhanced error handling based on API response
      if (err.message) {
        if (err.message.includes('temporary') || err.message.includes('first') || err.message.includes('setup')) {
          navigate('/company/set-password', { 
            state: { 
              email: email,
              temporaryPassword: password,
              isFirstLogin: true,
              message: 'First time login detected. Please set your new password to continue.' 
            } 
          });
        } else if (err.message.includes('password') && err.message.includes('change')) {
          navigate('/company/set-password', { 
            state: { 
              email: email,
              temporaryPassword: password,
              message: 'Password change required. Please set your new password.' 
            } 
          });
        } else {
          setError(err.message);
        }
      } else {
        setError('Login failed. Please try again or contact your administrator.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    updateCompanyName('Demo Company Ltd');
    
    setLoading(true);
    try {
      const result = await login('company@demo.com', 'demo123');
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Demo login failed');
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
            <label className="label">Company Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="company@yourcompany.com"
              className="input"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter company password"
              className="input"
              disabled={loading}
            />
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

          <button 
            type="button"
            onClick={handleDemoLogin} 
            className="demo-button"
            disabled={loading}
          >
            Use Demo Company Account
          </button>
        </form>

        <div className="login-footer">
          {/* <div className="company-features">
            <h4>Company Portal Features:</h4>
            <ul>
              <li>✓ Employee wellness monitoring</li>
              <li>✓ Therapy session management</li>
              <li>✓ Company analytics dashboard</li>
              <li>✓ Employee onboarding tools</li>
            </ul>
          </div> */}
          
          <div className="forgot-password">
            <Link to="/company/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>
          
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