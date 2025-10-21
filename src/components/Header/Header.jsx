import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LogOut, UserPlus, Users, Building2, UserCheck, Calendar, Menu, X, Settings, Brain } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import { AuthContext } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { companyName } = useSettings();
  const { userRole, isAdmin, isCompanyUser, userProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      {
        path: '/dashboard',
        icon: Home,
        label: 'Dashboard'
      }
    ];

    if (isAdmin()) {
      return [
        ...baseItems,
        {
          path: '/companies',
          icon: Building2,
          label: 'Companies'
        },
        {
          path: '/psychologists',
          icon: Brain,
          label: 'Psychologists'
        },
        {
          path: '/employee-list',
          icon: Users,
          label: 'All Employees'
        },
        {
          path: '/bookings',
          icon: Calendar,
          label: 'All Bookings'
        },
        {
          path: '/settings',
          icon: Settings,
          label: 'Settings'
        }
      ];
    }

    if (isCompanyUser()) {
      return [
        ...baseItems,
        {
          path: '/employees',
          icon: Users,
          label: 'Employees'
        },
        {
          path: '/psychologists',
          icon: UserCheck,
          label: 'Psychologists'
        },
        {
          path: '/bookings',
          icon: Calendar,
          label: 'Bookings'
        }
      ];
    }

    // Default employee view
    return [
      ...baseItems,
      {
        path: '/bookings',
        icon: Calendar,
        label: 'My Bookings'
      },
      {
        path: '/profile',
        icon: UserPlus,
        label: 'Profile'
      }
    ];
  };

  const navigationItems = getNavigationItems();

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="home-button" 
            title={companyName || 'ThoughtPro B2B'}
          >
            <Home size={24} className="header-icon" />
            <div className="company-info">
              <h1 className="header-title">{companyName || 'ThoughtPro B2B'}</h1>
              {companyName && companyName.length > 30 && (
                <span className="company-subtitle">Executive Dashboard</span>
              )}
            </div>
          </button>
        </div>
        
        <nav className="header-nav">
          <div className="nav-items">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-item ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        
        <div className="header-right">
          {/* {(isAdmin() || isCompanyUser()) && (
            <button 
              onClick={() => navigate('/add-employee')} 
              className="add-employee-button"
            >
              <UserPlus size={20} />
              <span>{isAdmin() ? 'Add User' : 'Add Employee'}</span>
            </button>
          )} */}
          
          <div className="user-info">
            <span className="user-name">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
            <div className="user-details">
              <span className="user-role">{userRole === 'admin' ? 'Administrator' : userRole === 'company' ? 'Company User' : 'Employee'}</span>
              {userProfile?.company_name && (
                <span className="user-company">{userProfile.company_name}</span>
              )}
            </div>
          </div>
          
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`mobile-nav-item ${isActivePath(item.path) ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Header;