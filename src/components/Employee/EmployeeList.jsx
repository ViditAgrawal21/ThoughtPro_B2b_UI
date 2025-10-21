import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Edit2, Trash2, UserPlus, Upload, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import BulkAddEmployee from './BulkAddEmployee';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, employee: null });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  // Get unique departments from employees
  const getUniqueDepartments = useCallback((employeeList) => {
    const departments = employeeList
      .map(emp => emp.department)
      .filter(dept => dept && dept.trim() !== '')
      .filter((dept, index, arr) => arr.indexOf(dept) === index)
      .sort();
    return departments;
  }, []);

  useEffect(() => {
    // Load employees from localStorage
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      const employeeData = JSON.parse(savedEmployees);
      setEmployees(employeeData);
      setFilteredEmployees(employeeData);
      setAvailableDepartments(getUniqueDepartments(employeeData));
    }
  }, [getUniqueDepartments]);

  useEffect(() => {
    // Filter employees based on search term and department
    let filtered = employees;

    // Filter by search term (name or email)
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(employee =>
        employee.department === selectedDepartment
      );
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, selectedDepartment, employees]);

  const handleEdit = (employeeId) => {
    navigate(`/add-employee?id=${employeeId}`);
  };

  const handleDelete = (employee) => {
    setDeleteConfirm({ show: true, employee });
  };

  const confirmDelete = () => {
    const employeeId = deleteConfirm.employee.id;
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    setEmployees(updatedEmployees);
    setAvailableDepartments(getUniqueDepartments(updatedEmployees));
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    // Close modal and show success message
    setDeleteConfirm({ show: false, employee: null });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, employee: null });
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
          
          <div className="header-buttons">
            <button onClick={handleAddNew} className="add-employee-btn">
              <UserPlus size={20} />
              <span>Add Employee</span>
            </button>
            <button onClick={() => setShowBulkModal(true)} className="bulk-add-btn">
              <Upload size={20} />
              <span>Bulk Add</span>
            </button>
          </div>
        </div>

        <div className="employee-list-actions">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search Employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-container">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="department-filter"
            >
              <option value="">All Departments</option>
              {availableDepartments.map(department => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
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
                    <p className="employee-email">{employee.email || 'No email provided'}</p>
                    {employee.department && (
                      <span className="employee-department">{employee.department}</span>
                    )}
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
                    onClick={() => handleDelete(employee)}
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

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          <Check size={20} />
          Employee deleted successfully!
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Delete Employee</h3>
              <button 
                onClick={cancelDelete} 
                className="modal-close-btn"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteConfirm.employee?.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="confirm-delete-btn">
                <Trash2 size={16} />
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkModal && (
        <BulkAddEmployee 
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            setShowBulkModal(false);
            // Refresh employee list
            const savedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
            setEmployees(savedEmployees);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeList;