import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import { validateEmail } from '../../utils/helpers';
import './LoginPage.css';

const LoginPage = () => {
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
      // Save default company name to settings
      updateCompanyName('Xyz Company');
      
      // Create user with default role
      const userData = {
        email,
        name: email.split('@')[0],
        role: 'CEO' // Default role
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      const result = await login(email, password);
      
      if (result.success || result === true) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Use default values
    const defaultCompany = 'Xyz Company';
    const defaultRole = 'CEO';
    const defaultEmail = 'demo@company.com';
    const defaultPassword = 'demo123';
    
    updateCompanyName(defaultCompany);
    
    const userData = {
      email: defaultEmail,
      name: 'demo',
      role: defaultRole
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    login(defaultEmail, defaultPassword);
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <BarChart3 size={40} />
          </div>
          <h1 className="login-title">Executive Dashboard</h1>
          <p className="login-subtitle">Sign in to access your metrics</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Input */}
          <div className="input-group">
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ceo@company.com"
              className="input"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input"
              disabled={loading}
            />
          </div>

          {error && <div className="error">{error}</div>}

          {/* Sign In Button */}
          <button 
            type="submit" 
            className="primary-button" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Skip Button */}
          <button 
            type="button"
            onClick={handleSkip} 
            className="skip-button"
            disabled={loading}
          >
            Skip for Now
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">Demo: Enter email and password or skip to continue</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;