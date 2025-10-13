import { apiService } from './api';

class DashboardService {
  async getDashboardData() {
    try {
      // TODO: Implement actual API call
      const response = await apiService.get('/dashboard/metrics');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch dashboard data');
    }
  }

  async getProductivityMetrics(timeRange = 'week') {
    try {
      const response = await apiService.get(`/dashboard/productivity?range=${timeRange}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch productivity metrics');
    }
  }

  async getPhoneUsageMetrics(timeRange = 'week') {
    try {
      const response = await apiService.get(`/dashboard/phone-usage?range=${timeRange}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch phone usage metrics');
    }
  }

  async getApplicationsData() {
    try {
      const response = await apiService.get('/dashboard/applications');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch applications data');
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;