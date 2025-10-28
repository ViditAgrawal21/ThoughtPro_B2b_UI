import { apiService } from './api';

class DashboardService {
  // Executive Dashboard Operations
  
  async getDashboardData(companyId = null) {
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/executive-metrics?${params}`, false);
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error.message);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  async getProductivityMetrics(timeRange = 'week', companyId = null) {
    try {
      const params = new URLSearchParams();
      params.append('range', timeRange);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/productivity?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch productivity metrics:', error.message);
      throw new Error('Failed to fetch productivity metrics');
    }
  }

  async getPhoneUsageMetrics(timeRange = 'week', companyId = null) {
    try {
      const params = new URLSearchParams();
      params.append('range', timeRange);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/phone-usage?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch phone usage metrics:', error.message);
      throw new Error('Failed to fetch phone usage metrics');
    }
  }

  async getApplicationsData(companyId = null) {
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/applications?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch applications data:', error.message);
      throw new Error('Failed to fetch applications data');
    }
  }

  async getExecutiveOverview(companyId = null) {
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/executive-overview?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch executive overview:', error.message);
      throw new Error('Failed to fetch executive overview');
    }
  }

  async getEmployeeMetrics(companyId = null) {
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/employee-metrics?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch employee metrics:', error.message);
      throw new Error('Failed to fetch employee metrics');
    }
  }

  async getProductivityInsights(employeeId = null, dateRange = 'week') {
    try {
      const params = new URLSearchParams();
      if (employeeId) params.append('employee_id', employeeId);
      params.append('range', dateRange);
      
      const response = await apiService.get(`/dashboard/productivity-insights?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch productivity insights:', error.message);
      throw new Error('Failed to fetch productivity insights');
    }
  }

  async getCompanyDashboard(companyId) {
    try {
      const response = await apiService.get(`/dashboard/company/${companyId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch company dashboard:', error.message);
      throw new Error('Failed to fetch company dashboard');
    }
  }

  async getWellnessMetrics(companyId = null, period = 'month') {
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/wellness?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch wellness metrics:', error.message);
      throw new Error('Failed to fetch wellness metrics');
    }
  }

  async getBookingAnalytics(companyId = null, period = 'month') {
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/booking-analytics?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch booking analytics:', error.message);
      throw new Error('Failed to fetch booking analytics');
    }
  }

  async getSubscriptionAnalytics(companyId = null, period = 'month') {
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/subscription-analytics?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch subscription analytics:', error.message);
      throw new Error('Failed to fetch subscription analytics');
    }
  }

  async getRealtimeStats(companyId = null) {
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/realtime?${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch realtime stats:', error.message);
      throw new Error('Failed to fetch realtime stats');
    }
  }

  // Comprehensive dashboard data aggregation
  async getComprehensiveDashboard(companyId = null) {
    try {
      const [
        overview,
        productivity,
        phoneUsage,
        wellness,
        bookings,
        subscriptions,
        employees,
        realtime
      ] = await Promise.allSettled([
        this.getExecutiveOverview(companyId),
        this.getProductivityMetrics('month', companyId),
        this.getPhoneUsageMetrics('month', companyId),
        this.getWellnessMetrics(companyId, 'month'),
        this.getBookingAnalytics(companyId, 'month'),
        this.getSubscriptionAnalytics(companyId, 'month'),
        this.getEmployeeMetrics(companyId),
        this.getRealtimeStats(companyId)
      ]);

      return {
        overview: overview.status === 'fulfilled' ? overview.value : null,
        productivity: productivity.status === 'fulfilled' ? productivity.value : null,
        phoneUsage: phoneUsage.status === 'fulfilled' ? phoneUsage.value : null,
        wellness: wellness.status === 'fulfilled' ? wellness.value : null,
        bookings: bookings.status === 'fulfilled' ? bookings.value : null,
        subscriptions: subscriptions.status === 'fulfilled' ? subscriptions.value : null,
        employees: employees.status === 'fulfilled' ? employees.value : null,
        realtime: realtime.status === 'fulfilled' ? realtime.value : null,
        errors: [overview, productivity, phoneUsage, wellness, bookings, subscriptions, employees, realtime]
          .filter(result => result.status === 'rejected')
          .map(result => result.reason?.message || 'Unknown error')
      };
    } catch (error) {
      throw new Error('Failed to fetch comprehensive dashboard data');
    }
  }

  // Export functionality
  async exportDashboardData(companyId = null, format = 'pdf', dateRange = 'month') {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      params.append('dateRange', dateRange);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/export?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to export dashboard data');
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;