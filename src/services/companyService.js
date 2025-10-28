import { apiService } from './api';

class CompanyService {
  // Create Company - Simple POST to API
  async createCompany(companyData) {
    try {
      console.log('Posting company data to API:', companyData);
      
      const response = await apiService.post('/companies', companyData);
      
      console.log('API Response:', response);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      if (response && response.error) {
        throw new Error(response.error);
      }
      
      throw new Error('Failed to create company');
    } catch (error) {
      console.error('Company creation error:', error);
      throw error;
    }
  }

  // Get Company by ID
  async getCompanyById(companyId) {
    try {
      const response = await apiService.get(`/companies/${companyId}`);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to fetch company');
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  }

  // Get All Companies
  async getAllCompanies() {
    try {
      const response = await apiService.get('/companies');
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to fetch companies');
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  // Update Company
  async updateCompany(companyId, companyData) {
    try {
      const response = await apiService.put(`/companies/${companyId}`, companyData);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to update company');
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  // Delete Company
  async deleteCompany(companyId) {
    try {
      const response = await apiService.delete(`/companies/${companyId}`);
      
      if (response && response.success) {
        return { success: true };
      }
      
      throw new Error('Failed to delete company');
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }

  // Get Company Stats
  async getCompanyStats(companyId) {
    try {
      const response = await apiService.get(`/companies/${companyId}/stats`);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to fetch company stats');
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // Get Company Subscription
  async getCompanySubscription(companyId) {
    try {
      const response = await apiService.get(`/companies/${companyId}/subscription`);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to fetch subscription');
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  // Update Company Settings
  async updateCompanySettings(companyId, settings) {
    try {
      const response = await apiService.put(`/companies/${companyId}/settings`, settings);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to update settings');
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Company Users Management
  async getCompanyUsers(companyId) {
    try {
      const response = await apiService.get(`/companies/${companyId}/users`);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to fetch company users');
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async createCompanyUser(companyId, userData) {
    try {
      const response = await apiService.post(`/companies/${companyId}/users`, userData);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to create user');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateCompanyUser(companyId, userId, userData) {
    try {
      const response = await apiService.put(`/companies/${companyId}/users/${userId}`, userData);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to update user');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteCompanyUser(companyId, userId) {
    try {
      const response = await apiService.delete(`/companies/${companyId}/users/${userId}`);
      
      if (response && response.success) {
        return { success: true };
      }
      
      throw new Error('Failed to delete user');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Create Employee with Temporary Password
  async createEmployeeWithTempPassword(employeeData) {
    try {
      const response = await apiService.post('/auth/supabase/create-employee', {
        email: employeeData.email,
        name: employeeData.name,
        company_id: employeeData.company_id,
        department: employeeData.department,
        position: employeeData.position,
        employee_id: employeeData.employee_id,
        phone: employeeData.phone
      });
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to create employee');
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  // Get Employees with Credential Status
  async getEmployeesWithCredentialStatus(companyId) {
    try {
      const response = await apiService.get(`/auth/supabase/company/${companyId}/employees-status`);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to get employee status');
    } catch (error) {
      console.error('Error fetching employee status:', error);
      throw error;
    }
  }

  // Company Profile Management
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

  // Utility Methods
  getCurrentCompanyId() {
    const companyId = localStorage.getItem('company_id');
    if (companyId) return companyId;
    
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        return profile.company_id;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  storeCompanyId(companyId) {
    localStorage.setItem('company_id', companyId);
  }

  clearCompanyId() {
    localStorage.removeItem('company_id');
  }

  isAdmin() {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        return profile.role === 'admin';
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  canManageCompany(companyId) {
    if (this.isAdmin()) return true;
    const currentCompanyId = this.getCurrentCompanyId();
    return currentCompanyId === companyId;
  }

  // ==================== ADMIN-SPECIFIC ENDPOINTS ====================

  /**
   * Get all companies for admin dashboard
   * GET /admin/companies
   */
  async getAllCompaniesAdmin() {
    try {
      const response = await apiService.get('/admin/companies');
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to fetch companies');
    } catch (error) {
      console.error('Error fetching admin companies:', error);
      throw error;
    }
  }

  /**
   * Delete a company (admin only)
   * DELETE /admin/companies/{companyId}
   */
  async deleteCompanyAdmin(companyId) {
    try {
      const response = await apiService.delete(`/admin/companies/${companyId}`);
      
      if (response && response.success) {
        return { success: true };
      }
      
      throw new Error('Failed to delete company');
    } catch (error) {
      console.error('Error deleting company (admin):', error);
      throw error;
    }
  }

  // ==================== SUBSCRIPTION CONFIG ENDPOINTS ====================

  /**
   * Get company subscription configuration
   * GET /companies/{companyId}/subscription-config
   */
  async getSubscriptionConfig(companyId) {
    try {
      const response = await apiService.get(`/companies/${companyId}/subscription-config`);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      // If no subscription config exists yet (404), return null
      if (response && response.status === 404) {
        return null;
      }
      
      throw new Error('Failed to fetch subscription configuration');
    } catch (error) {
      // Return null if subscription config doesn't exist yet
      if (error.response && error.response.status === 404) {
        return null;
      }
      console.error('Error fetching subscription config:', error);
      throw error;
    }
  }

  /**
   * Update company subscription configuration
   * PUT /companies/{companyId}/subscription-config
   */
  async updateSubscriptionConfig(companyId, configData) {
    try {
      const response = await apiService.put(`/companies/${companyId}/subscription-config`, configData);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to update subscription configuration');
    } catch (error) {
      console.error('Error updating subscription config:', error);
      throw error;
    }
  }

  /**
   * Create company subscription configuration
   * POST /companies/{companyId}/subscription-config
   */
  async createSubscriptionConfig(companyId, configData) {
    try {
      const response = await apiService.post(`/companies/${companyId}/subscription-config`, configData);
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to create subscription configuration');
    } catch (error) {
      console.error('Error creating subscription config:', error);
      throw error;
    }
  }
}

export const companyService = new CompanyService();
export default companyService;