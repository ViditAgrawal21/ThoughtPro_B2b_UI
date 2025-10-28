import { apiService } from './api';

class EmployeeService {
  // Employee Management Operations
  
  async getAllEmployees(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await apiService.get(`/employees?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch employees:', error.message);
      throw new Error('Failed to fetch employees');
    }
  }

  async getEmployeeById(employeeId) {
    try {
      const response = await apiService.get(`/employees/${employeeId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch employee details');
    }
  }

  async createEmployee(employeeData) {
    try {
      const response = await apiService.post('/employees', employeeData);
      return response;
    } catch (error) {
      throw new Error('Failed to create employee');
    }
  }

  // Create employee under specific company
  async createEmployeeForCompany(companyId, employeeData) {
    try {
      const response = await apiService.post(`/companies/${companyId}/employees`, employeeData);
      return response;
    } catch (error) {
      console.error('Employee creation error:', error);
      
      // Provide more specific error messages based on the error
      if (error.status === 400) {
        if (error.message && error.message.includes('duplicate')) {
          throw new Error('duplicate_email');
        } else if (error.message && error.message.includes('validation')) {
          throw new Error('validation_failed');
        } else {
          throw new Error('invalid_data');
        }
      } else if (error.status === 401) {
        throw new Error('unauthorized');
      } else if (error.status === 403) {
        throw new Error('permission_denied');
      } else if (error.status >= 500) {
        throw new Error('server_error');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('network_error');
      } else {
        throw new Error('unknown_error');
      }
    }
  }

  // Bulk create employees for a company
  async bulkCreateEmployeesForCompany(companyId, employeesData) {
    try {
      const response = await apiService.post(`/companies/${companyId}/employees/bulk`, {
        employees: employeesData
      });
      return response;
    } catch (error) {
      throw new Error('Failed to bulk create employees for company');
    }
  }

  // Resend credentials for an employee
  async resendEmployeeCredentials(companyId, employeeId, personalEmail) {
    try {
      const response = await apiService.post(`/companies/${companyId}/employees/${employeeId}/resend-credentials`, {
        personalEmail: personalEmail
      });
      return response;
    } catch (error) {
      console.error('Resend credentials error:', error);
      
      // Provide more specific error messages
      if (error.status === 400) {
        throw new Error('invalid_email');
      } else if (error.status === 401) {
        throw new Error('unauthorized');
      } else if (error.status === 404) {
        throw new Error('employee_not_found');
      } else if (error.status >= 500) {
        throw new Error('server_error');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('network_error');
      } else {
        throw new Error('unknown_error');
      }
    }
  }

  async updateEmployee(employeeId, employeeData) {
    try {
      const response = await apiService.put(`/employees/${employeeId}`, employeeData);
      return response;
    } catch (error) {
      throw new Error('Failed to update employee');
    }
  }

  async deleteEmployee(employeeId) {
    try {
      const response = await apiService.delete(`/employees/${employeeId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to delete employee');
    }
  }

  async getEmployeeProfile(employeeId) {
    try {
      const response = await apiService.get(`/employees/${employeeId}/profile`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch employee profile');
    }
  }

  async updateEmployeeProfile(employeeId, profileData) {
    try {
      const response = await apiService.put(`/employees/${employeeId}/profile`, profileData);
      return response;
    } catch (error) {
      throw new Error('Failed to update employee profile');
    }
  }

  async getEmployeeBookings(employeeId, status = 'all') {
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.append('status', status);
      
      const response = await apiService.get(`/employees/${employeeId}/bookings?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch employee bookings');
    }
  }

  async getEmployeeSubscription(employeeId) {
    try {
      const response = await apiService.get(`/employees/${employeeId}/subscription`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch employee subscription');
    }
  }

  // Get employees by company ID - using correct API endpoint with pagination support
  async getEmployeesByCompany(companyId, page = 1, limit = 100) {
    try {
      // Add pagination parameters to ensure we get all employees
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await apiService.get(`/companies/${companyId}/employees?${params}`);
      
      console.log('Raw API response for employees:', response);
      
      // Handle successful API response
      if (response.success && response.data && response.data.data) {
        const result = {
          success: true,
          data: response.data.data, // Extract the actual employees array
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          pages: response.data.pages
        };
        
        // If there are more pages, fetch them all
        if (response.data.pages > 1 && page === 1) {
          console.log(`Fetching additional pages: ${response.data.pages - 1} more pages`);
          const allEmployees = [...response.data.data];
          
          // Fetch remaining pages
          for (let p = 2; p <= response.data.pages; p++) {
            try {
              const nextPageResponse = await this.getEmployeesByCompany(companyId, p, limit);
              if (nextPageResponse.success && nextPageResponse.data) {
                allEmployees.push(...nextPageResponse.data);
              }
            } catch (pageError) {
              console.warn(`Failed to fetch page ${p}:`, pageError);
              // Continue with partial data rather than failing completely
            }
          }
          
          result.data = allEmployees;
          result.total = allEmployees.length;
          console.log(`Fetched all employees: ${allEmployees.length} total`);
        }
        
        return result;
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching employees by company:', error);
      throw new Error('Failed to fetch employees for company');
    }
  }

  async assignEmployeeToCompany(employeeId, companyId, role = 'employee') {
    try {
      const response = await apiService.post(`/employees/${employeeId}/assign-company`, {
        companyId,
        role
      });
      return response;
    } catch (error) {
      throw new Error('Failed to assign employee to company');
    }
  }

  async removeEmployeeFromCompany(employeeId, companyId) {
    try {
      // Soft delete employee from company using the correct API endpoint
      const response = await apiService.delete(`/companies/${companyId}/employees/${employeeId}`);
      return response;
    } catch (error) {
      console.error('Error removing employee from company:', error);
      throw error;
    }
  }

  async bulkCreateEmployees(companyId, employeesData, onProgress = null) {
    try {
      // Transform the employee data to match API expectations
      const transformedEmployees = employeesData.map(emp => ({
        name: emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
        personalEmail: emp.email,
        role: emp.role || 'employee',
        department: emp.department,
        position: emp.position || emp.designation,
        phone: emp.phone,
        employee_id: emp.employee_id || emp.employeeId,
        startDate: emp.startDate || emp.joiningDate,
        dob: emp.dob,
        gender: emp.gender
      }));

      // For large datasets (>20 employees), process in batches
      if (transformedEmployees.length > 20) {
        return this.processBulkEmployeesInBatches(companyId, transformedEmployees, onProgress);
      }

      // For smaller datasets, process all at once
      if (onProgress) onProgress(30);
      
      const response = await apiService.post(`/companies/${companyId}/employees/bulk`, {
        employees: transformedEmployees
      });
      
      if (onProgress) onProgress(100);
      
      return response;
    } catch (error) {
      console.error('Bulk create employees error:', error);
      
      // Provide more specific error messages
      if (error.status === 400) {
        if (error.message && error.message.includes('duplicate')) {
          throw new Error('duplicate_employees');
        } else if (error.message && error.message.includes('validation')) {
          throw new Error('validation_failed');
        } else {
          throw new Error('invalid_data');
        }
      } else if (error.status === 401) {
        throw new Error('unauthorized');
      } else if (error.status === 403) {
        throw new Error('permission_denied');
      } else if (error.status >= 500) {
        throw new Error('server_error');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('network_error');
      } else {
        throw new Error('bulk_create_failed');
      }
    }
  }

  // Process large batches of employees in smaller chunks
  async processBulkEmployeesInBatches(companyId, employeesData, onProgress = null) {
    const BATCH_SIZE = 10; // Process 10 employees at a time
    const batches = [];
    
    // Split employees into batches
    for (let i = 0; i < employeesData.length; i += BATCH_SIZE) {
      batches.push(employeesData.slice(i, i + BATCH_SIZE));
    }

    const results = {
      success: true,
      data: {
        successful: [],
        failed: [],
        total: employeesData.length
      }
    };

    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const progress = Math.round(((i + 1) / batches.length) * 80) + 10; // 10-90% range
      
      if (onProgress) onProgress(progress);
      
      try {
        const response = await apiService.post(`/companies/${companyId}/employees/bulk`, {
          employees: batch
        });

        if (response.success && response.data) {
          if (response.data.successful) {
            results.data.successful.push(...response.data.successful);
          }
          if (response.data.failed) {
            results.data.failed.push(...response.data.failed);
          }
        }
      } catch (error) {
        console.error(`Batch ${i + 1} failed:`, error);
        // Add failed batch employees to failed array
        batch.forEach(emp => {
          results.data.failed.push({
            employee: emp,
            error: error.message || 'Processing failed'
          });
        });
      }

      // Small delay between batches to prevent overwhelming the server
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    if (onProgress) onProgress(100);
    
    return results;
  }

  async bulkImportEmployees(companyId, employeesData) {
    try {
      const response = await apiService.post('/employees/bulk-import', {
        companyId,
        employees: employeesData
      });
      return response;
    } catch (error) {
      throw new Error('Failed to bulk import employees');
    }
  }

  async exportEmployees(companyId, format = 'csv') {
    try {
      const response = await apiService.get(`/employees/export?companyId=${companyId}&format=${format}`);
      return response;
    } catch (error) {
      throw new Error('Failed to export employees');
    }
  }

  async sendTemporaryPassword(employeeId) {
    try {
      const response = await apiService.post(`/employees/${employeeId}/send-temp-password`);
      return response;
    } catch (error) {
      throw new Error('Failed to send temporary password');
    }
  }

  async resetEmployeePassword(employeeId) {
    try {
      const response = await apiService.post(`/employees/${employeeId}/reset-password`);
      return response;
    } catch (error) {
      throw new Error('Failed to reset employee password');
    }
  }
}

export const employeeService = new EmployeeService();
export default employeeService;