import React, { useState } from 'react';
import { Upload, Download, Plus, Trash2, AlertCircle, CheckCircle, X, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { employeeService } from '../../services/employeeService';
import { useAuth } from '../../hooks/useAuth';
import './BulkAddEmployee.css';

const BulkAddEmployee = ({ onClose, onSuccess }) => {
  const { user, isCompanyUser } = useAuth();
  const [employees, setEmployees] = useState([
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      startDate: ''
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadMode, setUploadMode] = useState('manual'); // 'manual', 'csv', or 'file'
  const [csvData, setCsvData] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Get company ID from user context
  const companyId = isCompanyUser ? user?.companyId : null;

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Support',
    'Product Management',
    'Design',
    'Legal'
  ];

  const addEmployee = () => {
    setEmployees([
      ...employees,
      {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        startDate: ''
      }
    ]);
  };

  const removeEmployee = (index) => {
    if (employees.length > 1) {
      const newEmployees = employees.filter((_, i) => i !== index);
      setEmployees(newEmployees);
      
      // Remove validation errors for this employee
      const newValidationErrors = { ...validationErrors };
      delete newValidationErrors[index];
      setValidationErrors(newValidationErrors);
    }
  };

  const updateEmployee = (index, field, value) => {
    const newEmployees = [...employees];
    newEmployees[index] = { ...newEmployees[index], [field]: value };
    setEmployees(newEmployees);

    // Clear validation error for this field
    if (validationErrors[index]?.[field]) {
      const newValidationErrors = { ...validationErrors };
      delete newValidationErrors[index][field];
      if (Object.keys(newValidationErrors[index]).length === 0) {
        delete newValidationErrors[index];
      }
      setValidationErrors(newValidationErrors);
    }
  };

  const validateEmployee = (employee, index) => {
    const errors = {};
    
    if (!employee.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!employee.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!employee.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!employee.department) {
      errors.department = 'Department is required';
    }
    
    if (!employee.position?.trim()) {
      errors.position = 'Position is required';
    }

    return errors;
  };

  const validateAllEmployees = () => {
    const newValidationErrors = {};
    let hasErrors = false;

    employees.forEach((employee, index) => {
      const errors = validateEmployee(employee, index);
      if (Object.keys(errors).length > 0) {
        newValidationErrors[index] = errors;
        hasErrors = true;
      }
    });

    setValidationErrors(newValidationErrors);
    return !hasErrors;
  };

  const parseCsvData = () => {
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const expectedHeaders = ['firstname', 'lastname', 'email', 'phone', 'department', 'position', 'startdate'];
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setErrors([`Missing required CSV headers: ${missingHeaders.join(', ')}`]);
        return false;
      }

      const parsedEmployees = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === headers.length) {
          const employee = {};
          headers.forEach((header, index) => {
            switch (header) {
              case 'firstname':
                employee.firstName = values[index];
                break;
              case 'lastname':
                employee.lastName = values[index];
                break;
              case 'startdate':
                employee.startDate = values[index];
                break;
              default:
                employee[header] = values[index];
            }
          });
          parsedEmployees.push(employee);
        }
      }

      setEmployees(parsedEmployees);
      setErrors([]);
      return true;
    } catch (error) {
      setErrors(['Invalid CSV format. Please check your data.']);
      return false;
    }
  };

  const downloadTemplate = () => {
    const headers = 'firstName,lastName,email,phone,department,position,startDate\n';
    const sampleData = 'John,Doe,john.doe@company.com,+1234567890,Engineering,Software Engineer,2024-01-15\n';
    const csvContent = headers + sampleData;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employee_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadExcelTemplate = () => {
    const headers = ['firstName', 'lastName', 'email', 'phone', 'department', 'position', 'startDate'];
    const sampleData = [
      ['John', 'Doe', 'john.doe@company.com', '+1234567890', 'Engineering', 'Software Engineer', '2024-01-15'],
      ['Jane', 'Smith', 'jane.smith@company.com', '+1234567891', 'Marketing', 'Marketing Manager', '2024-01-20']
    ];
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    
    XLSX.writeFile(workbook, 'employee_template.xlsx');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setErrors(['Please upload a CSV or Excel file (.csv, .xlsx, .xls)']);
      return;
    }

    setUploadedFile(file);
    setErrors([]);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (fileExtension === 'csv') {
          const csvText = e.target.result;
          setCsvData(csvText);
          parseFileData(csvText, 'csv');
        } else {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          parseFileData(jsonData, 'excel');
        }
      } catch (error) {
        setErrors(['Error reading file. Please check the file format and try again.']);
        setUploadedFile(null);
      }
    };

    if (fileExtension === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const parseFileData = (data, type) => {
    try {
      let lines, headers;
      
      if (type === 'csv') {
        lines = data.trim().split('\n');
        headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      } else {
        // Excel data
        if (!data || data.length < 2) {
          setErrors(['Excel file must contain at least a header row and one data row.']);
          return false;
        }
        headers = data[0].map(h => h.toString().toLowerCase().trim());
        lines = data.slice(1);
      }

      const requiredHeaders = ['firstname', 'lastname', 'email'];
      const missingHeaders = requiredHeaders.filter(header => 
        !headers.some(h => h.includes(header))
      );

      if (missingHeaders.length > 0) {
        setErrors([`Missing required headers: ${missingHeaders.join(', ')}`]);
        return false;
      }

      const parsedEmployees = [];
      
      for (let i = 0; i < lines.length; i++) {
        let values;
        
        if (type === 'csv') {
          if (i === 0) continue; // Skip header row
          values = lines[i].split(',').map(v => v.trim());
        } else {
          values = lines[i] || [];
        }
        
        if (values.length > 0 && values.some(v => v && v.toString().trim())) {
          const employee = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            department: '',
            position: '',
            startDate: ''
          };

          headers.forEach((header, index) => {
            const value = values[index] ? values[index].toString().trim() : '';
            switch (header.replace(/[^a-z]/g, '')) {
              case 'firstname':
              case 'fname':
                employee.firstName = value;
                break;
              case 'lastname':
              case 'lname':
                employee.lastName = value;
                break;
              case 'startdate':
              case 'dateofjoining':
              case 'joindate':
                employee.startDate = value;
                break;
              case 'phonenumber':
              case 'phone':
              case 'mobile':
                employee.phone = value;
                break;
              default:
                const cleanHeader = header.replace(/[^a-z]/g, '');
                if (['email', 'department', 'position'].includes(cleanHeader)) {
                  employee[cleanHeader] = value;
                }
            }
          });
          
          if (employee.firstName && employee.lastName && employee.email) {
            parsedEmployees.push(employee);
          }
        }
      }

      if (parsedEmployees.length === 0) {
        setErrors(['No valid employee data found in the file.']);
        return false;
      }

      setEmployees(parsedEmployees);
      setErrors([]);
      setSuccessMessage(`Successfully parsed ${parsedEmployees.length} employees from file.`);
      return true;
    } catch (error) {
      setErrors(['Error parsing file data. Please check the file format.']);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!companyId) {
      setErrors(['Company ID not found. Please ensure you are logged in as a company user.']);
      return;
    }

    if (!validateAllEmployees()) {
      setErrors(['Please fix the validation errors before submitting.']);
      return;
    }

    setLoading(true);
    setErrors([]);
    setSuccessMessage('');

    try {
      const response = await employeeService.bulkCreateEmployees(companyId, employees);
      
      if (response.success) {
        setSuccessMessage(`Successfully created ${employees.length} employees!`);
        setTimeout(() => {
          onSuccess && onSuccess(response.data);
          onClose && onClose();
        }, 2000);
      } else {
        setErrors([response.message || 'Failed to create employees']);
      }
    } catch (error) {
      console.error('Bulk create employees error:', error);
      setErrors([error.message || 'An error occurred while creating employees']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bulk-add-overlay">
      <div className="bulk-add-modal">
        <div className="bulk-add-header">
          <h2>Bulk Add Employees</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="bulk-add-content">
          {/* Mode Selection */}
          <div className="mode-selection">
            <button
              className={`mode-btn ${uploadMode === 'manual' ? 'active' : ''}`}
              onClick={() => setUploadMode('manual')}
            >
              Manual Entry
            </button>
            <button
              className={`mode-btn ${uploadMode === 'csv' ? 'active' : ''}`}
              onClick={() => setUploadMode('csv')}
            >
              CSV Text
            </button>
            <button
              className={`mode-btn ${uploadMode === 'file' ? 'active' : ''}`}
              onClick={() => setUploadMode('file')}
            >
              <FileText size={16} />
              File Upload
            </button>
          </div>

          {/* CSV Upload Mode */}
          {uploadMode === 'csv' && (
            <div className="csv-section">
              <div className="csv-instructions">
                <h3>CSV Upload Instructions</h3>
                <p>Upload a CSV file with the following headers:</p>
                <code>firstName,lastName,email,phone,department,position,startDate</code>
                <button className="download-template-btn" onClick={downloadTemplate}>
                  <Download size={16} />
                  Download Template
                </button>
              </div>
              
              <textarea
                className="csv-textarea"
                placeholder="Paste your CSV data here or upload a file..."
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                rows={8}
              />
              
              <button
                className="parse-csv-btn"
                onClick={parseCsvData}
                disabled={!csvData.trim()}
              >
                Parse CSV Data
              </button>
            </div>
          )}

          {/* File Upload Mode */}
          {uploadMode === 'file' && (
            <div className="file-section">
              <div className="file-instructions">
                <h3>File Upload Instructions</h3>
                <p>Upload a CSV or Excel file (.csv, .xlsx, .xls) with the following headers:</p>
                <code>firstName,lastName,email,phone,department,position,startDate</code>
                <div className="template-buttons">
                  <button 
                    type="button" 
                    className="download-template-btn" 
                    onClick={downloadTemplate}
                  >
                    <Download size={16} />
                    Download CSV Template
                  </button>
                  <button 
                    type="button" 
                    className="download-template-btn excel" 
                    onClick={downloadExcelTemplate}
                  >
                    <Download size={16} />
                    Download Excel Template
                  </button>
                </div>
              </div>
              
              <div className="file-upload-area">
                <input
                  type="file"
                  id="fileUpload"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="fileUpload" className="file-upload-label">
                  <Upload size={24} />
                  <div>
                    <p>Click to upload file or drag and drop</p>
                    <span>Supports CSV, Excel (.xlsx, .xls) files</span>
                  </div>
                </label>
                {uploadedFile && (
                  <div className="uploaded-file-info">
                    <FileText size={16} />
                    <span>{uploadedFile.name}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setUploadedFile(null);
                        setEmployees([{
                          firstName: '',
                          lastName: '',
                          email: '',
                          phone: '',
                          department: '',
                          position: '',
                          startDate: ''
                        }]);
                        setSuccessMessage('');
                      }}
                      className="remove-file-btn"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="error-messages">
              <AlertCircle size={16} />
              <div>
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="success-message">
              <CheckCircle size={16} />
              <p>{successMessage}</p>
            </div>
          )}

          {/* Employee Forms */}
          <form onSubmit={handleSubmit} className="bulk-form">
            <div className="employees-section">
              <div className="section-header">
                <h3>Employees ({employees.length})</h3>
                <button
                  type="button"
                  className="add-employee-btn"
                  onClick={addEmployee}
                >
                  <Plus size={16} />
                  Add Employee
                </button>
              </div>

              <div className="employees-list">
                {employees.map((employee, index) => (
                  <div key={index} className="employee-form">
                    <div className="employee-form-header">
                      <h4>Employee {index + 1}</h4>
                      {employees.length > 1 && (
                        <button
                          type="button"
                          className="remove-employee-btn"
                          onClick={() => removeEmployee(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          value={employee.firstName}
                          onChange={(e) => updateEmployee(index, 'firstName', e.target.value)}
                          className={validationErrors[index]?.firstName ? 'error' : ''}
                          placeholder="Enter first name"
                        />
                        {validationErrors[index]?.firstName && (
                          <span className="field-error">{validationErrors[index].firstName}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          value={employee.lastName}
                          onChange={(e) => updateEmployee(index, 'lastName', e.target.value)}
                          className={validationErrors[index]?.lastName ? 'error' : ''}
                          placeholder="Enter last name"
                        />
                        {validationErrors[index]?.lastName && (
                          <span className="field-error">{validationErrors[index].lastName}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={employee.email}
                          onChange={(e) => updateEmployee(index, 'email', e.target.value)}
                          className={validationErrors[index]?.email ? 'error' : ''}
                          placeholder="Enter email address"
                        />
                        {validationErrors[index]?.email && (
                          <span className="field-error">{validationErrors[index].email}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          value={employee.phone}
                          onChange={(e) => updateEmployee(index, 'phone', e.target.value)}
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div className="form-group">
                        <label>Department *</label>
                        <select
                          value={employee.department}
                          onChange={(e) => updateEmployee(index, 'department', e.target.value)}
                          className={validationErrors[index]?.department ? 'error' : ''}
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                        {validationErrors[index]?.department && (
                          <span className="field-error">{validationErrors[index].department}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Position *</label>
                        <input
                          type="text"
                          value={employee.position}
                          onChange={(e) => updateEmployee(index, 'position', e.target.value)}
                          className={validationErrors[index]?.position ? 'error' : ''}
                          placeholder="Enter job position"
                        />
                        {validationErrors[index]?.position && (
                          <span className="field-error">{validationErrors[index].position}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="date"
                          value={employee.startDate}
                          onChange={(e) => updateEmployee(index, 'startDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bulk-add-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading || employees.length === 0}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Creating Employees...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Create {employees.length} Employee{employees.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkAddEmployee;