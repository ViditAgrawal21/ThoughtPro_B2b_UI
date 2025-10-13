import React, { useState, useEffect } from 'react';
import { Users, Search, Edit2, Trash2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load employees from localStorage
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      const employeeData = JSON.parse(savedEmployees);
      setEmployees(employeeData);
      setFilteredEmployees(employeeData);
    }
  }, []);

  useEffect(() => {
    // Filter employees based on search term
    if (searchTerm) {
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  const handleEdit = (employeeId) => {
    navigate(`/add-employee?id=${employeeId}`);
  };

  const handleDelete = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
      setEmployees(updatedEmployees);
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    }
  };

  const handleAddNew = () => {
    navigate('/add-employee');
  };

  return (
    <div className="employee-list-container">
      <Header />
      
      <div className="employee-list-content">
        <div className="employee-list-header">
          <div className="header-left">
            <Users size={28} className="header-icon" />
            <div>
              <h2 className="page-title">Employee Management</h2>
              <p className="page-subtitle">Manage your team members</p>
            </div>
          </div>
          
          <button onClick={handleAddNew} className="add-employee-btn">
            <UserPlus size={20} />
            <span>Add Employee</span>
          </button>
        </div>

        <div className="employee-list-actions">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="employee-count">
            <span>{filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <Users size={64} className="empty-icon" />
            <h3>No employees found</h3>
            <p>
              {employees.length === 0 
                ? 'Start by adding your first employee to the team.'
                : 'No employees match your search criteria.'
              }
            </p>
            {employees.length === 0 && (
              <button onClick={handleAddNew} className="empty-add-btn">
                <UserPlus size={20} />
                Add First Employee
              </button>
            )}
          </div>
        ) : (
          <div className="employee-grid">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="employee-card">
                <div className="employee-info">
                  <div className="employee-avatar">
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="employee-details">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-age">Age: {employee.age}</p>
                    <p className="employee-id">ID: {employee.id}</p>
                  </div>
                </div>
                
                <div className="employee-actions">
                  <button 
                    onClick={() => handleEdit(employee.id)}
                    className="action-btn edit-btn"
                    title="Edit employee"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(employee.id)}
                    className="action-btn delete-btn"
                    title="Delete employee"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;