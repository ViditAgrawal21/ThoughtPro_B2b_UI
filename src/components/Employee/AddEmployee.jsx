//add employee 
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, ArrowLeft, Save } from 'lucide-react';
import Header from '../Header/Header';
import { employeeService } from '../../services/employeeService';
import { authService } from '../../services/authServices';
import { getUserFriendlyErrorMessage } from '../../utils/errorUtils';
import { DEPARTMENTS } from '../../utils/constants';
import PhoneInput from '../Common/PhoneInput';
import './AddEmployee.css';

const AddEmployee = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if we're editing an existing employee
    const employeeId = searchParams.get('id');
    if (employeeId) {
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        setEmployeeName(employee.name);
        setEmail(employee.email || '');
        setDepartment(employee.department || '');
        setPhoneNumber(employee.phone || '');
        setIsEditing(true);
        setEditingId(employeeId);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!employeeName.trim()) {
      setError('Please enter employee name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter employee email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!department.trim()) {
      setError('Please select a department');
      return;
    }

    // Phone validation - extract only the phone number digits (excluding country code)
    let phoneDigits = phoneNumber.replace(/\D/g, ''); // Remove all non-digits
    
    // Remove country code if present (any code from 1-4 digits at the start)
    // Common country codes: +1 (1 digit), +91 (2 digits), +971 (3 digits), etc.
    if (phoneDigits.length > 10) {
      // Try to identify and remove country code
      // If the number is longer than 10 digits, assume the extra digits are the country code
      phoneDigits = phoneDigits.slice(-10); // Take only the last 10 digits
    }
    
    if (!phoneDigits || phoneDigits.length === 0) {
      setError('Please enter phone number');
      return;
    }
    
    if (phoneDigits.length !== 10) {
      setError(`Phone number must be exactly 10 digits (currently ${phoneDigits.length} digits)`);
      return;
    }

    setLoading(true);
    
    try {
      // Get company ID from local storage
      const companyId = authService.getStoredCompanyId();
      if (!companyId) {
        setError('Company ID not found. Please login again.');
        return;
      }

      const employeeData = {
        name: employeeName.trim(),
        personalEmail: email.trim(), // API expects "personalEmail", not "personal_email"
        role: 'employee',
        department: department.trim(),
        position: department.trim(), // Use department as position for now
        employee_id: `EMP${Date.now()}`, // Generate unique employee ID
        phone: phoneNumber.replace(/\D/g, '') // Store only digits
      };
      
      if (isEditing && editingId) {
        // Update existing employee (fallback to localStorage for now)
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const updatedEmployees = employees.map(emp => 
          emp.id === editingId 
            ? { ...emp, name: employeeName.trim(), email: email.trim(), department: department.trim(), phone: phoneNumber.replace(/\D/g, '') }
            : emp
        );
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      } else {
        // Create new employee using API
        try {
          const result = await employeeService.createEmployeeForCompany(companyId, employeeData);
          console.log('Employee created successfully:', result);
        } catch (apiError) {
          console.warn('API call failed:', apiError.message);
          
          // Use utility function to get user-friendly error message
          const userFriendlyError = getUserFriendlyErrorMessage(apiError, 'employee');
          setError(userFriendlyError);
          return; // Don't proceed with success
        }
      }
      
      setSuccess(true);
      
      // Reset form if creating new
      if (!isEditing) {
        setEmployeeName('');
        setEmail('');
        setDepartment('');
        setPhoneNumber('');
      }
      
      // Redirect after success
      setTimeout(() => {
        navigate('/employee-list');
      }, 1500);
      
    } catch (err) {
      console.error('Employee creation error:', err);
      setError('Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/employee-list');
  };

  return (
    <div className="add-employee-container">
      <Header />
      
      <div className="add-employee-content">
        <div className="add-employee-header">
          <button onClick={handleBack} className="back-button">
            <ArrowLeft size={20} />
            <span>Back to Employee List</span>
          </button>
          
          <div className="page-title-section">
            <UserPlus size={32} className="page-icon" />
            <div>
              <h1 className="page-title">
                {isEditing ? 'Edit Employee' : 'Add New Employee'}
              </h1>
              <p className="page-subtitle">
                {isEditing ? 'Update employee information below' : 'Enter employee information below'}
              </p>
            </div>
          </div>
        </div>

        <div className="employee-form-container">
          <form onSubmit={handleSubmit} className="employee-form">
            {/* Employee Name Input */}
            <div className="input-group">
              <label className="label">Employee Name</label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Enter full name"
                className="input"
                disabled={loading}
                maxLength={50}
              />
            </div>

            {/* Email Input */}
            <div className="input-group">
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="input"
                disabled={loading}
              />
            </div>

            {/* Phone Number Input */}
            <div className="input-group">
              <label className="label">Phone Number</label>
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                disabled={loading}
                placeholder="Enter phone number"
              />
              {error && error.includes('phone') && (
                <div className="field-error">{error}</div>
              )}
            </div>

            {/* Department Input */}
            <div className="input-group">
              <label className="label">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input"
                disabled={loading}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(department => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>

            {/* General Error Message */}
            {error && !error.includes('phone') && (
              <div className="error-message">{error}</div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="success-message">
                Employee {isEditing ? 'updated' : 'created'} successfully! Redirecting to employee list
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading || success}
            >
              <Save size={20} />
              <span>
                {loading 
                  ? (isEditing ? 'Updating Employee...' : 'Creating Employee...') 
                  : (isEditing ? 'Update Employee' : 'Create Employee')
                }
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;