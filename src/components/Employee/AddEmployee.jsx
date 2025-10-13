import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, ArrowLeft, Save } from 'lucide-react';
import Header from '../Header/Header';
import './AddEmployee.css';

const AddEmployee = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [age, setAge] = useState('');
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
        setAge(employee.age.toString());
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

    if (!age || age < 1 || age > 100) {
      setError('Please enter a valid age between 1 and 100');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      
      if (isEditing && editingId) {
        // Update existing employee
        const updatedEmployees = employees.map(emp => 
          emp.id === editingId 
            ? { ...emp, name: employeeName.trim(), age: parseInt(age) }
            : emp
        );
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      } else {
        // Create new employee
        const employeeData = {
          id: Math.random().toString(36).substr(2, 9),
          name: employeeName.trim(),
          age: parseInt(age),
          createdAt: new Date().toISOString()
        };
        employees.push(employeeData);
        localStorage.setItem('employees', JSON.stringify(employees));
      }
      
      setSuccess(true);
      
      // Reset form if creating new
      if (!isEditing) {
        setEmployeeName('');
        setAge('');
      }
      
      // Redirect after success
      setTimeout(() => {
        navigate('/employee-list');
      }, 1500);
      
    } catch (err) {
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

            {/* Age Input */}
            <div className="input-group">
              <label className="label">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter age"
                className="input"
                disabled={loading}
                min="1"
                max="100"
              />
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}
            
            {/* Success Message */}
            {success && (
              <div className="success-message">
                Employee {isEditing ? 'updated' : 'created'} successfully! Redirecting to employee list...
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