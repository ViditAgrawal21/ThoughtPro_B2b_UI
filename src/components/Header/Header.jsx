import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { companyName } = useSettings(); // NEW: Get company name from settings
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddEmployee = () => {
    navigate('/add-employee');
  };

  const handleEmployeeList = () => {
    navigate('/employee-list');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Home size={24} className="header-icon" />
          <h1 className="header-title">{companyName}</h1> {/* UPDATED: Dynamic company name */}
        </div>
        
        <div className="header-right">
          <button onClick={handleEmployeeList} className="employee-list-button">
            <Users size={20} />
            <span>Employee List</span>
          </button>
          
          <button onClick={handleAddEmployee} className="add-employee-button">
            <UserPlus size={20} />
            <span>Add Employee</span>
          </button>
          
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;