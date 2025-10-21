import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, BarChart3, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/helpers';
import './LoginPage.css';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
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
      // Use admin login flow with proper userType parameter
      const result = await login(email, password, 'admin');
      
      if (result.success) {
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Admin login failed');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Starting demo admin login...');
      // Use admin login flow for demo with proper userType parameter
      const result = await login('syneptlabs@gmail.com', 'Syneptlabs@a19', 'admin');
      console.log('Demo login result:', result);
      
      if (result.success) {
        console.log('Demo login successful, navigating to admin dashboard...');
        navigate('/admin/dashboard');
      } else {
        console.log('Demo login failed:', result);
        setError(result.error || 'Demo login failed - please try again');
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Demo login failed: ' + (err.message || 'Unknown error'));
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
              placeholder="syneptlabs@gmail.com"
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
              placeholder="Enter admin password"
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
            className="primary-button admin-button" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Admin Sign In'}
          </button>

          <button 
            type="button"
            onClick={handleDemoLogin} 
            className="demo-button"
            disabled={loading}
          >
            Use Demo Admin Account
          </button>
        </form>

        <div className="login-footer">
          {/* <div className="admin-features">
            <h4>Admin Features:</h4>
            <ul>
              <li>✓ Manage all companies</li>
              <li>✓ View platform analytics</li>
              <li>✓ User management</li>
              <li>✓ System settings</li>
            </ul>
          </div> */}
          
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