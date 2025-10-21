import { apiService } from './api';

class SubscriptionService {
  // Employee Subscription Management Operations
  
  async getAllSubscriptions(page = 1, limit = 10, filters = {}) {
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
      
      const response = await apiService.get(`/subscriptions?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch subscriptions');
    }
  }

  async getSubscriptionById(subscriptionId) {
    try {
      const response = await apiService.get(`/subscriptions/${subscriptionId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch subscription details');
    }
  }

  async createSubscription(subscriptionData) {
    try {
      const response = await apiService.post('/subscriptions', subscriptionData);
      return response;
    } catch (error) {
      throw new Error('Failed to create subscription');
    }
  }

  async updateSubscription(subscriptionId, subscriptionData) {
    try {
      const response = await apiService.put(`/subscriptions/${subscriptionId}`, subscriptionData);
      return response;
    } catch (error) {
      throw new Error('Failed to update subscription');
    }
  }

  async cancelSubscription(subscriptionId, reason = '') {
    try {
      const response = await apiService.post(`/subscriptions/${subscriptionId}/cancel`, { reason });
      return response;
    } catch (error) {
      throw new Error('Failed to cancel subscription');
    }
  }

  async renewSubscription(subscriptionId) {
    try {
      const response = await apiService.post(`/subscriptions/${subscriptionId}/renew`);
      return response;
    } catch (error) {
      throw new Error('Failed to renew subscription');
    }
  }

  async pauseSubscription(subscriptionId, pauseDuration) {
    try {
      const response = await apiService.post(`/subscriptions/${subscriptionId}/pause`, {
        duration: pauseDuration
      });
      return response;
    } catch (error) {
      throw new Error('Failed to pause subscription');
    }
  }

  async resumeSubscription(subscriptionId) {
    try {
      const response = await apiService.post(`/subscriptions/${subscriptionId}/resume`);
      return response;
    } catch (error) {
      throw new Error('Failed to resume subscription');
    }
  }

  async getEmployeeSubscription(employeeId) {
    try {
      const response = await apiService.get(`/subscriptions/employee/${employeeId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch employee subscription');
    }
  }

  async getCompanySubscriptions(companyId, status = 'all') {
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.append('status', status);
      
      const response = await apiService.get(`/subscriptions/company/${companyId}?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch company subscriptions');
    }
  }

  async verifyGooglePlaySubscription(purchaseToken, subscriptionId) {
    try {
      const response = await apiService.post('/subscriptions/verify-google-play', {
        purchaseToken,
        subscriptionId
      });
      return response;
    } catch (error) {
      throw new Error('Failed to verify Google Play subscription');
    }
  }

  async processSubscriptionWebhook(webhookData) {
    try {
      const response = await apiService.post('/subscriptions/webhook', webhookData);
      return response;
    } catch (error) {
      throw new Error('Failed to process subscription webhook');
    }
  }

  async getSubscriptionStats(period = 'month', companyId = null) {
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/subscriptions/stats?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch subscription statistics');
    }
  }

  async getSubscriptionPlans() {
    try {
      const response = await apiService.get('/subscriptions/plans');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch subscription plans');
    }
  }

  async createSubscriptionPlan(planData) {
    try {
      const response = await apiService.post('/subscriptions/plans', planData);
      return response;
    } catch (error) {
      throw new Error('Failed to create subscription plan');
    }
  }

  async updateSubscriptionPlan(planId, planData) {
    try {
      const response = await apiService.put(`/subscriptions/plans/${planId}`, planData);
      return response;
    } catch (error) {
      throw new Error('Failed to update subscription plan');
    }
  }

  async getSubscriptionHistory(subscriptionId) {
    try {
      const response = await apiService.get(`/subscriptions/${subscriptionId}/history`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch subscription history');
    }
  }

  async generateSubscriptionInvoice(subscriptionId) {
    try {
      const response = await apiService.get(`/subscriptions/${subscriptionId}/invoice`);
      return response;
    } catch (error) {
      throw new Error('Failed to generate subscription invoice');
    }
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;