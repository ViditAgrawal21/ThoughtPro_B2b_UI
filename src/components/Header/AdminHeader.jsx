import React, { useState, useEffect, useRef } from 'react';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './AdminHeader.css';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const userDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickAway = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="header-title">ThoughtPro</h1>
        <span className="header-subtitle">System Administration</span>
      </div>

      <div className="header-right">
        {/* User Menu */}
        <div className="header-item user-menu" ref={userDropdownRef}>
          <button
            className="user-menu-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'System Admin'}</span>
              <span className="user-role">Administrator</span>
            </div>
            <ChevronDown size={16} className={`chevron ${showDropdown ? 'open' : ''}`} />
          </button>

          {showDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-avatar large">
                  <User size={24} />
                </div>
                <div className="user-details">
                  <div className="name">{user?.name || 'System Admin'}</div>
                  <div className="email">{user?.email || 'syneptlabs@gmail.com'}</div>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <div className="dropdown-menu">
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;