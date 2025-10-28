import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Edit2, Trash2, UserPlus, Upload, Check, X, RefreshCw, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import BulkAddEmployee from './BulkAddEmployee';
import { employeeService } from '../../services/employeeService';
import { authService } from '../../services/authServices';
import { getUserFriendlyErrorMessage } from '../../utils/errorUtils';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState({});
  const [resendSuccess, setResendSuccess] = useState({});
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

  // Function to fetch employees from API
  const fetchEmployees = useCallback(async () => {
    console.log('EmployeeList: Starting fetchEmployees...');
    setLoading(true);
    setError('');
    
    try {
      const companyId = authService.getStoredCompanyId();
      console.log('EmployeeList: Retrieved company ID:', companyId);
      
      if (!companyId) {
        console.warn('EmployeeList: No company ID found, loading from localStorage');
        // Fallback to localStorage
        const savedEmployees = localStorage.getItem('employees');
        if (savedEmployees) {
          const employeeData = JSON.parse(savedEmployees);
          console.log('EmployeeList: Loaded employees from localStorage:', employeeData.length);
          setEmployees(employeeData);
          setFilteredEmployees(employeeData);
          setAvailableDepartments(getUniqueDepartments(employeeData));
        } else {
          console.log('EmployeeList: No employees in localStorage either');
        }
        return;
      }

      console.log('EmployeeList: Calling API with company ID:', companyId);
      // Try to fetch from API
      const result = await employeeService.getEmployeesByCompany(companyId);
      console.log('EmployeeList: API result:', result);
      
      if (result.success && result.data) {
        const employeeData = Array.isArray(result.data) ? result.data : [];
        console.log('EmployeeList: Successfully fetched employees from API:', employeeData.length);
        console.log('EmployeeList: Employee data:', employeeData);
        
        // Check if we have pagination info
        if (result.total && result.total > employeeData.length) {
          console.log(`EmployeeList: Fetched ${employeeData.length} of ${result.total} total employees`);
        }
        
        setEmployees(employeeData);
        setFilteredEmployees(employeeData);
        setAvailableDepartments(getUniqueDepartments(employeeData));
        
        // Show success feedback
        setRefreshSuccess(true);
        setTimeout(() => setRefreshSuccess(false), 2000);
        
        // Also save to localStorage as backup
        localStorage.setItem('employees', JSON.stringify(employeeData));
      } else {
        console.warn('EmployeeList: API call failed or no data, falling back to localStorage');
        console.log('EmployeeList: Result was:', result);
        
        // Fallback to localStorage
        const savedEmployees = localStorage.getItem('employees');
        if (savedEmployees) {
          const employeeData = JSON.parse(savedEmployees);
          console.log('EmployeeList: Using localStorage fallback:', employeeData.length, 'employees');
          setEmployees(employeeData);
          setFilteredEmployees(employeeData);
          setAvailableDepartments(getUniqueDepartments(employeeData));
          setError('Unable to load latest data from server. Showing previously saved information.');
        } else {
          console.log('EmployeeList: No localStorage fallback available');
          setError('Unable to load employee data. Please check your internet connection and try refreshing.');
        }
      }
    } catch (err) {
      console.error('EmployeeList: Failed to fetch employees:', err);
      console.error('EmployeeList: Error details:', err.message, err.stack);
      
      // Use utility function for user-friendly error message
      const userFriendlyError = getUserFriendlyErrorMessage(err, 'loading');
      
      // Fallback to localStorage
      const savedEmployees = localStorage.getItem('employees');
      if (savedEmployees) {
        const employeeData = JSON.parse(savedEmployees);
        console.log('EmployeeList: Error fallback - using localStorage:', employeeData.length, 'employees');
        setEmployees(employeeData);
        setFilteredEmployees(employeeData);
        setAvailableDepartments(getUniqueDepartments(employeeData));
        
        // Show error with indication that we're showing cached data
        setError(`${userFriendlyError} Showing previously saved data.`);
      } else {
        console.log('EmployeeList: Error fallback - no localStorage data available');
        setError(userFriendlyError);
      }
    } finally {
      setLoading(false);
    }
  }, [getUniqueDepartments]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    // Filter employees based on search term and department
    let filtered = employees;

    // Filter by search term (name, personal email, or company email)
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.personal_email && employee.personal_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (employee.personalEmail && employee.personalEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
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

  const confirmDelete = async () => {
    const employee = deleteConfirm.employee;
    const employeeId = employee.id;
    const companyId = authService.getStoredCompanyId();
    
    setLoading(true);
    setError('');

    try {
      console.log('Attempting to delete employee:', employeeId, 'from company:', companyId);
      
      // Call API to soft delete employee from company
      const result = await employeeService.removeEmployeeFromCompany(employeeId, companyId);
      
      if (result.success) {
        console.log('Employee deleted successfully:', result);
        
        // Update local state
        const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees.filter(emp => {
          const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               emp.personalEmail?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment;
          return matchesSearch && matchesDepartment;
        }));
        setAvailableDepartments(getUniqueDepartments(updatedEmployees));
        
        // Update localStorage
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        
        // Close modal and show success message
        setDeleteConfirm({ show: false, employee: null });
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      const errorMessage = getUserFriendlyErrorMessage(error);
      setError(errorMessage || 'Failed to delete employee. Please try again.');
      setDeleteConfirm({ show: false, employee: null });
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, employee: null });
  };

  const handleAddNew = () => {
    navigate('/add-employee');
  };

  const handleResendCredentials = async (employee) => {
    const employeeId = employee.id;
    const personalEmail = employee.personal_email || employee.personalEmail;
    
    if (!personalEmail) {
      setError('Personal email is required to resend credentials');
      return;
    }

    setResendLoading(prev => ({ ...prev, [employeeId]: true }));
    setError('');

    try {
      const companyId = localStorage.getItem('company_id') || localStorage.getItem('companyId');
      
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const response = await employeeService.resendEmployeeCredentials(companyId, employeeId, personalEmail);
      
      if (response.success) {
        setResendSuccess(prev => ({ ...prev, [employeeId]: true }));
        setTimeout(() => {
          setResendSuccess(prev => ({ ...prev, [employeeId]: false }));
        }, 3000);
      }
    } catch (error) {
      console.error('Error resending credentials:', error);
      const friendlyMessage = getUserFriendlyErrorMessage(error.message, 'resend_credentials');
      setError(friendlyMessage);
    } finally {
      setResendLoading(prev => ({ ...prev, [employeeId]: false }));
    }
  };

  // Debug logging before render
  console.log('EmployeeList: Render state - employees:', employees.length, 'filtered:', filteredEmployees.length, 'loading:', loading);

  // Make fetch function available for debugging
  React.useEffect(() => {
    window.debugEmployeeFetch = fetchEmployees;
    window.debugEmployeeState = { employees, filteredEmployees, loading, error };
  }, [fetchEmployees, employees, filteredEmployees, loading, error]);

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
            <button 
              onClick={fetchEmployees} 
              className={`refresh-btn ${loading ? 'refreshing' : ''} ${refreshSuccess ? 'success' : ''}`} 
              title="Refresh employee list"
              disabled={loading}
            >
              {refreshSuccess ? (
                <>
                  <Check size={20} className="success-icon" />
                  <span>Updated!</span>
                </>
              ) : (
                <>
                  <RefreshCw size={20} className={`refresh-icon ${loading ? 'spinning' : ''}`} />
                  <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                </>
              )}
            </button>
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
            <span>
              {searchTerm || selectedDepartment ? 
                `${filteredEmployees.length} of ${employees.length} employee${employees.length !== 1 ? 's' : ''}` :
                `${employees.length} employee${employees.length !== 1 ? 's' : ''}`
              }
            </span>
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
              <button onClick={() => setError('')} className="error-dismiss" title="Dismiss">
                ×
              </button>
            </div>
          </div>
        )}

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
                    <p className="employee-email">
                      <span className="email-label">Mail ID: </span>
                      {employee.personal_email || employee.personalEmail || 'No email provided'}
                    </p>
                    {employee.department && (
                      <span className="employee-department">{employee.department}</span>
                    )}
                    <p className="employee-id">ID: {employee.employee_id || employee.id}</p>
                  </div>
                </div>
                
                <div className="employee-actions">
                  <button 
                    onClick={() => handleEdit(employee.id)}
                    className="action-btn edit-btn"
                    title="Edit employee"
                  >
                    <Edit2 size={32} />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleResendCredentials(employee)}
                    className={`action-btn resend-btn ${resendLoading[employee.id] ? 'loading' : ''} ${resendSuccess[employee.id] ? 'success' : ''}`}
                    title="Resend credentials"
                    disabled={resendLoading[employee.id]}
                  >
                    {resendSuccess[employee.id] ? (
                      <>
                        <Check size={32} />
                        <span>Sent!</span>
                      </>
                    ) : (
                      <>
                        <Send size={32} className={resendLoading[employee.id] ? 'spinning' : ''} />
                        <span>Resend</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => handleDelete(employee)}
                    className="action-btn delete-btn"
                    title="Delete employee"
                  >
                    <Trash2 size={32} />
                    <span>Delete</span>
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
                disabled={loading}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="employee-delete-details">
                <p className="delete-confirmation-text">
                  Are you sure you want to delete <strong>{deleteConfirm.employee?.name}</strong>?
                </p>
                
                {deleteConfirm.employee && (
                  <div className="employee-info-box">
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{deleteConfirm.employee.email || deleteConfirm.employee.personalEmail || 'N/A'}</span>
                    </div>
                    {deleteConfirm.employee.department && (
                      <div className="info-row">
                        <span className="info-label">Department:</span>
                        <span className="info-value">{deleteConfirm.employee.department}</span>
                      </div>
                    )}
                    {deleteConfirm.employee.position && (
                      <div className="info-row">
                        <span className="info-label">Position:</span>
                        <span className="info-value">{deleteConfirm.employee.position}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="warning-box">
                  <p className="warning-text">
                    ⚠️ This will soft delete the employee from the company.
                  </p>
                  <p className="info-text">
                    Only company owners, admins, and HR managers can delete employees.
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                onClick={cancelDelete} 
                className="cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="confirm-delete-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="spinning" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Employee
                  </>
                )}
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