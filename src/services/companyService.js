import { apiService } from './api';
import { mockDataService } from './mockDataService';

class CompanyService {
  // Company Management Operations
  
  // Admin - Get all companies
  async getAllCompanies(page = 1, limit = 10, search = '') {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (search) params.append('search', search);
      
      const response = await apiService.get(`/companies-supabase?${params}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback to mock data
      return mockDataService.getAllCompanies();
    } catch (error) {
      console.warn('Companies API unavailable, using mock data:', error.message);
      return mockDataService.getAllCompanies();
    }
  }

  async getCompanyById(companyId) {
    try {
      const response = await apiService.get(`/companies/${companyId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback to mock data
      return mockDataService.getCompanyById(companyId);
    } catch (error) {
      console.warn('API unavailable, using mock data for company');
      return mockDataService.getCompanyById(companyId);
    }
  }

  async createCompany(companyData) {
    try {
      const response = await apiService.post('/companies-supabase', companyData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback to mock creation
      return mockDataService.createCompany(companyData);
    } catch (error) {
      console.warn('API unavailable, using mock data for company creation');
      return mockDataService.createCompany(companyData);
    }
  }

  async updateCompany(companyId, companyData) {
    try {
      const response = await apiService.put(`/companies/${companyId}`, companyData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback to mock update
      return mockDataService.updateCompany(companyId, companyData);
    } catch (error) {
      console.warn('API unavailable, using mock data for company update');
      return mockDataService.updateCompany(companyId, companyData);
    }
  }

  async deleteCompany(companyId) {
    try {
      const response = await apiService.delete(`/companies/${companyId}`);
      
      if (response.success) {
        return { success: true };
      }
      
      // Fallback to mock deletion
      return mockDataService.deleteCompany(companyId);
    } catch (error) {
      console.warn('API unavailable, using mock data for company deletion');
      return mockDataService.deleteCompany(companyId);
    }
  }

  async getCompanyEmployees(companyId, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await apiService.get(`/companies/${companyId}/employees?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch company employees');
    }
  }

  // Create employee with email credentials
  async createEmployeeWithCredentials(companyId, employeeData) {
    try {
      const response = await apiService.post(`/companies/${companyId}/employees`, employeeData);
      return response;
    } catch (error) {
      throw new Error('Failed to create employee with credentials');
    }
  }

  // Resend employee credentials
  async resendEmployeeCredentials(companyId, employeeId) {
    try {
      const response = await apiService.post(`/companies/${companyId}/employees/${employeeId}/resend-credentials`);
      return response;
    } catch (error) {
      throw new Error('Failed to resend employee credentials');
    }
  }

  // Bulk create employees
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

  // Send password reset link to personal email
  async sendPasswordResetToPersonalEmail(resetData) {
    try {
      const response = await apiService.post('/companies/forgot-password/personal-email', resetData);
      return response;
    } catch (error) {
      throw new Error('Failed to send password reset link');
    }
  }

  // Get company subscription configuration
  async getCompanySubscriptionConfig(companyId) {
    try {
      const response = await apiService.get(`/companies-supabase/${companyId}/subscription-config`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch company subscription configuration');
    }
  }

  // Update company subscription configuration
  async updateCompanySubscriptionConfig(companyId, configData) {
    try {
      const response = await apiService.put(`/companies-supabase/${companyId}/subscription-config`, configData);
      return response;
    } catch (error) {
      throw new Error('Failed to update company subscription configuration');
    }
  }

  // Create company login credentials with temporary password
  async createCompanyLogin(loginData) {
    try {
      const response = await apiService.post('/auth/supabase/create-credentials', {
        email: loginData.email,
        temporaryPassword: loginData.temporaryPassword,
        companyId: loginData.companyId,
        companyName: loginData.companyName,
        role: 'company',
        isFirstTimeLogin: true
      });
      return response;
    } catch (error) {
      throw new Error('Failed to create company login credentials');
    }
  }

  // Create employee with temporary password
  async createEmployeeWithTempPassword(employeeData) {
    try {
      const response = await apiService.post('/auth/supabase/create-employee-temp', {
        name: employeeData.name,
        personalEmail: employeeData.personalEmail,
        companyId: employeeData.companyId,
        role: employeeData.role || 'employee',
        department: employeeData.department,
        position: employeeData.position,
        employee_id: employeeData.employee_id,
        phone: employeeData.phone
      });
      return response;
    } catch (error) {
      throw new Error('Failed to create employee with temporary password');
    }
  }

  // Get employees with credential status
  async getEmployeesWithCredentialStatus(companyId) {
    try {
      const response = await apiService.get(`/auth/supabase/company/${companyId}/employees-status`);
      return response;
    } catch (error) {
      throw new Error('Failed to get employees with credential status');
    }
  }

  async getCompanyStats(companyId) {
    try {
      const response = await apiService.get(`/companies/${companyId}/stats`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch company statistics');
    }
  }

  async getCompanySubscription(companyId) {
    try {
      const response = await apiService.get(`/companies/${companyId}/subscription`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch company subscription');
    }
  }

  async updateCompanySettings(companyId, settings) {
    try {
      const response = await apiService.put(`/companies/${companyId}/settings`, settings);
      return response;
    } catch (error) {
      throw new Error('Failed to update company settings');
    }
  }

  // Company Users Management
  async getCompanyUsers(companyId) {
    try {
      const response = await apiService.get(`/companies/${companyId}/users`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback to mock data
      return mockDataService.getCompanyUsers(companyId);
    } catch (error) {
      console.warn('API unavailable, using mock data for company users');
      return mockDataService.getCompanyUsers(companyId);
    }
  }

  async createCompanyUser(companyId, userData) {
    try {
      const response = await apiService.post(`/companies/${companyId}/users`, userData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback to mock creation
      return mockDataService.createCompanyUser(companyId, userData);
    } catch (error) {
      console.warn('API unavailable, using mock data for company user creation');
      return mockDataService.createCompanyUser(companyId, userData);
    }
  }

  async updateCompanyUser(companyId, userId, userData) {
    try {
      const response = await apiService.put(`/companies/${companyId}/users/${userId}`, userData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Fallback to mock update
      return mockDataService.updateCompanyUser(companyId, userId, userData);
    } catch (error) {
      console.warn('API unavailable, using mock data for company user update');
      return mockDataService.updateCompanyUser(companyId, userId, userData);
    }
  }

  async deleteCompanyUser(companyId, userId) {
    try {
      const response = await apiService.delete(`/companies/${companyId}/users/${userId}`);
      
      if (response.success) {
        return { success: true };
      }
      
      // Fallback to mock deletion
      return mockDataService.deleteCompanyUser(companyId, userId);
    } catch (error) {
      console.warn('API unavailable, using mock data for company user deletion');
      return mockDataService.deleteCompanyUser(companyId, userId);
    }
  }

  // Company Profile Management (for company users)
  async getMyCompanyProfile() {
    const companyId = this.getCurrentCompanyId();
    if (!companyId) {
      throw new Error('No company ID found');
    }
    
    return this.getCompanyById(companyId);
  }

  async updateMyCompanyProfile(companyData) {
    const companyId = this.getCurrentCompanyId();
    if (!companyId) {
      throw new Error('No company ID found');
    }
    
    return this.updateCompany(companyId, companyData);
  }

  // Utility methods
  getCurrentCompanyId() {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      return profile.company_id;
    }
    return null;
  }

  isAdmin() {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      return profile.role === 'admin';
    }
    return false;
  }

  canManageCompany(companyId) {
    if (this.isAdmin()) {
      return true; // Admin can manage all companies
    }
    
    const currentCompanyId = this.getCurrentCompanyId();
    return currentCompanyId === companyId; // Company users can only manage their own company
  }
}

export const companyService = new CompanyService();
export default companyService;