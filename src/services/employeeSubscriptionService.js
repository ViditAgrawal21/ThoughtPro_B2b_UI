import { apiService } from './api';

class EmployeeSubscriptionService {
  // Employee Subscription Management Operations (API Documentation Compliant)

  // Verify Google Play in-app purchase for employees
  async verifyPurchase(purchaseData) {
    try {
      const response = await apiService.post('/employee-subscriptions/verify/purchase', purchaseData);
      return response;
    } catch (error) {
      throw new Error('Failed to verify Google Play purchase');
    }
  }

  // Verify Google Play subscription for employees
  async verifySubscription(subscriptionData) {
    try {
      const response = await apiService.post('/employee-subscriptions/verify/subscription', subscriptionData);
      return response;
    } catch (error) {
      throw new Error('Failed to verify Google Play subscription');
    }
  }

  // Get employee's active subscriptions
  async getActiveSubscriptions() {
    try {
      const response = await apiService.get('/employee-subscriptions/active');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch active subscriptions');
    }
  }

  // Check Employee Subscription Service Status
  async checkSubscriptionStatus() {
    try {
      const response = await apiService.get('/employee-subscriptions/status');
      return response;
    } catch (error) {
      throw new Error('Failed to check subscription status');
    }
  }

  // Legacy methods (kept for backward compatibility but not in API docs)
  async createEmployeeSubscription(subscriptionData) {
    try {
      const response = await apiService.post('/api/v1/employee-subscriptions', subscriptionData);
      return response;
    } catch (error) {
      throw new Error('Failed to create employee subscription');
    }
  }

  async getEmployeeSubscriptions(page = 1, limit = 10, filters = {}) {
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
      
      const response = await apiService.get(`/api/v1/employee-subscriptions?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch employee subscriptions');
    }
  }

  async getEmployeeSubscriptionById(subscriptionId) {
    try {
      const response = await apiService.get(`/api/v1/employee-subscriptions/${subscriptionId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch employee subscription details');
    }
  }

  async deleteEmployeeSubscription(subscriptionId) {
    try {
      const response = await apiService.delete(`/api/v1/employee-subscriptions/${subscriptionId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to delete employee subscription');
    }
  }

  // Additional methods for subscription management
  async updateEmployeeSubscription(subscriptionId, subscriptionData) {
    try {
      const response = await apiService.put(`/api/v1/employee-subscriptions/${subscriptionId}`, subscriptionData);
      return response;
    } catch (error) {
      throw new Error('Failed to update employee subscription');
    }
  }

  async getSubscriptionsByCompany(companyId, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      params.append('companyId', companyId);
      
      const response = await apiService.get(`/api/v1/employee-subscriptions?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch company subscriptions');
    }
  }

  async getSubscriptionsByEmployee(employeeId) {
    try {
      const response = await apiService.get(`/api/v1/employee-subscriptions?employeeId=${employeeId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch employee subscriptions');
    }
  }

  async activateSubscription(subscriptionId) {
    try {
      const response = await apiService.post(`/api/v1/employee-subscriptions/${subscriptionId}/activate`);
      return response;
    } catch (error) {
      throw new Error('Failed to activate subscription');
    }
  }

  async deactivateSubscription(subscriptionId) {
    try {
      const response = await apiService.post(`/api/v1/employee-subscriptions/${subscriptionId}/deactivate`);
      return response;
    } catch (error) {
      throw new Error('Failed to deactivate subscription');
    }
  }

  async getSubscriptionStats(companyId = null, period = 'month') {
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      params.append('period', period);
      
      const response = await apiService.get(`/api/v1/employee-subscriptions/stats?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch subscription statistics');
    }
  }
}

export const employeeSubscriptionService = new EmployeeSubscriptionService();
export default employeeSubscriptionService;