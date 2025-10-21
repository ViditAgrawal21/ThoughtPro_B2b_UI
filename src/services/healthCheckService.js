import { apiService } from './api';

class HealthCheckService {
  // Health Check Operations (API Documentation Compliant)
  // According to API docs, health check uses employee subscription status endpoint
  
  // Check Employee Subscription Service Status (API Documented Endpoint)
  async checkEmployeeSubscriptionServiceStatus() {
    try {
      const response = await apiService.get('/employee-subscriptions/status');
      return response;
    } catch (error) {
      throw new Error('Failed to check employee subscription service status');
    }
  }

  // Legacy method - not in API docs but kept for backward compatibility
  async getHealthStatus() {
    console.warn('getHealthStatus is not in API documentation. Use checkEmployeeSubscriptionServiceStatus instead.');
    try {
      const response = await apiService.get('/health');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch health status');
    }
  }

  async getDetailedHealthCheck() {
    try {
      const response = await apiService.get('/health/detailed');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch detailed health check');
    }
  }

  async getDatabaseStatus() {
    try {
      const response = await apiService.get('/health/database');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch database status');
    }
  }

  async getSystemMetrics() {
    try {
      const response = await apiService.get('/health/metrics');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch system metrics');
    }
  }

  async getServiceStatus() {
    try {
      const response = await apiService.get('/health/services');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch service status');
    }
  }

  async getApiVersion() {
    try {
      const response = await apiService.get('/health/version');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch API version');
    }
  }

  async testDatabaseConnection() {
    try {
      const response = await apiService.get('/health/test/database');
      return response;
    } catch (error) {
      throw new Error('Failed to test database connection');
    }
  }

  async testExternalServices() {
    try {
      const response = await apiService.get('/health/test/external');
      return response;
    } catch (error) {
      throw new Error('Failed to test external services');
    }
  }

  async getSystemLoad() {
    try {
      const response = await apiService.get('/health/system-load');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch system load');
    }
  }

  async getMemoryUsage() {
    try {
      const response = await apiService.get('/health/memory');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch memory usage');
    }
  }
}

export const healthCheckService = new HealthCheckService();
export default healthCheckService;