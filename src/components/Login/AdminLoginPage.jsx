import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, BarChart3, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/helpers';
import './LoginPage.css';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
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
      console.log('AdminLoginPage: Attempting login for admin:', email);
      
      // Use admin login flow with proper userType parameter
      const result = await login(email, password, 'admin');
      
      console.log('AdminLoginPage: Login result:', result);
      
      if (result.success) {
        console.log('AdminLoginPage: Login successful, redirecting to admin dashboard...');
        // Small delay to ensure localStorage is updated
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 100);
      } else {
        console.log('AdminLoginPage: Login failed:', result.error);
        setError(result.error || result.message || 'Admin login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('AdminLoginPage: Login error:', err);
      
      // Handle specific error types
      if (err.message.includes('Invalid admin credentials') || 
          err.message.includes('401') || 
          err.message.includes('Unauthorized')) {
        setError('Invalid credentials. Please check your email and password.');
      } else if (err.message.includes('Access denied') || 
                 err.message.includes('403')) {
        setError('Access denied. This account does not have admin privileges.');
      } else if (err.message.includes('Network error') || 
                 err.message.includes('NETWORK_ERROR')) {
        setError('Network connection error. Please check your internet connection and try again.');
      } else if (err.message.includes('Server error') || 
                 err.message.includes('500')) {
        setError('Server temporarily unavailable. Please try again in a few moments.');
      } else {
        setError('Invalid credentials. Please check your email and password.');
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
            <Shield size={40} />
          </div>
          <h1 className="login-title">Admin Portal</h1>
          <p className="login-subtitle">Secure administrative access</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="label">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
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
                placeholder="Enter admin password"
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
            {loading ? 'Signing in...' : 'Admin Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <div className="login-switch">
            <p>Not an admin?</p>
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

export default AdminLoginPage;