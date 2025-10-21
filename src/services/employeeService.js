import { apiService } from './api';
import { mockDataService } from './mockDataService';

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
      console.warn('Employees API unavailable, using mock data:', error.message);
      // Return mock data when API is not available
      return mockDataService.getEmployees();
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

  // Get employees by company ID
  async getEmployeesByCompany(companyId) {
    try {
      const response = await apiService.get(`/employees/company/${companyId}`);
      
      // If API fails, return mock data filtered by company
      if (!response.success && response.isMockData) {
        const mockData = await mockDataService.getEmployeesByCompany(companyId);
        return {
          success: true,
          data: mockData,
          isMockData: true
        };
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching employees by company:', error);
      
      // Fallback to mock data
      const mockData = await mockDataService.getEmployeesByCompany(companyId);
      return {
        success: true,
        data: mockData,
        isMockData: true
      };
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
      const response = await apiService.delete(`/employees/${employeeId}/companies/${companyId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to remove employee from company');
    }
  }

  async bulkCreateEmployees(companyId, employeesData) {
    try {
      const response = await apiService.post(`/companies/${companyId}/employees/bulk`, {
        employees: employeesData
      });
      return response;
    } catch (error) {
      throw new Error('Failed to bulk create employees');
    }
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