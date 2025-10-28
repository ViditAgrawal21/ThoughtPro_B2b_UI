import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, BarChart3, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authServices';
import { validateEmail } from '../../utils/helpers';
import './LoginPage.css';

const SuperAdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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
      console.log('SuperAdminLoginPage: Attempting login for super admin:', email);
      
      // Use super admin login flow
      const result = await authService.superAdminLogin(email, password);
      
      console.log('SuperAdminLoginPage: Login result:', result);
      
      if (result.success) {
        console.log('SuperAdminLoginPage: Login successful, redirecting to super admin dashboard...');
        // Small delay to ensure localStorage is updated
        setTimeout(() => {
          navigate('/super-admin/dashboard');
        }, 100);
      } else {
        console.log('SuperAdminLoginPage: Login failed:', result.error);
        setError(result.error || result.message || 'Super admin login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('SuperAdminLoginPage: Login error:', err);
      
      // Handle specific error types
      if (err.message.includes('Invalid super admin credentials')) {
        setError('Invalid super admin email or password. Please verify your credentials.');
      } else if (err.message.includes('Access denied')) {
        setError('This account does not have super admin privileges.');
      } else if (err.message.includes('Network error')) {
        setError('Network connection error. Please check your internet connection and try again.');
      } else if (err.message.includes('Server error')) {
        setError('Server temporarily unavailable. Please try again in a few moments.');
      } else {
        setError(err.message || 'Super admin login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card admin-login">
        <div className="login-header">
          <div className="logo admin-logo">
            <ShieldCheck size={40} />
          </div>
          <h1 className="login-title">Super Admin Portal</h1>
          <p className="login-subtitle">Maximum security access</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="label">Super Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter super admin email"
              className="input"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter super admin password"
                className="input"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            className="primary-button admin-button" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Super Admin Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <div className="login-switch">
            <p>Switch login type:</p>
            <Link to="/admin/login" className="switch-link">
              <BarChart3 size={16} />
              Admin Login
            </Link>
            <Link to="/login" className="switch-link">
              <BarChart3 size={16} />
              Company Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
