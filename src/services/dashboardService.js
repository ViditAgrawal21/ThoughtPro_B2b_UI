import { apiService } from './api';
import { mockDataService } from './mockDataService';

class DashboardService {
  constructor() {
    // Check environment variables for mock mode
    const mockMode = process.env.REACT_APP_MOCK_MODE === 'true';
    const offlineMode = process.env.REACT_APP_OFFLINE_MODE === 'true';
    
    this.useApiFirst = !mockMode && !offlineMode; // Try API first only if not in mock mode
    this.consecutiveFailures = 0;
    this.maxFailures = 3; // Switch to mock mode after 3 failures
    
    if (mockMode) {
      console.log('Dashboard Service: Starting in mock data mode (REACT_APP_MOCK_MODE=true)');
    }
    if (offlineMode) {
      console.log('Dashboard Service: Starting in offline mode (REACT_APP_OFFLINE_MODE=true)');
    }
  }
  
  handleApiError(error, mockFallback) {
    this.consecutiveFailures++;
    
    // Log the error but don't spam console
    if (this.consecutiveFailures <= 2) {
      console.warn('API unavailable, using mock data:', error.message);
    } else if (this.consecutiveFailures === 3) {
      console.warn('Multiple API failures detected, switching to mock data mode');
      this.useApiFirst = false; // Switch to mock-first mode
    }
    
    return mockFallback;
  }
  
  handleApiSuccess() {
    // Reset failure counter on successful API call
    if (this.consecutiveFailures > 0) {
      console.log('API connection restored');
      this.consecutiveFailures = 0;
      this.useApiFirst = true;
    }
  }

  // Executive Dashboard Operations
  
  async getDashboardData(companyId = null) {
    // If not trying API first, return mock data immediately
    if (!this.useApiFirst) {
      return mockDataService.getDashboardData();
    }
    
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/executive-metrics?${params}`, false);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getDashboardData());
    }
  }

  async getProductivityMetrics(timeRange = 'week', companyId = null) {
    if (!this.useApiFirst) {
      return mockDataService.getProductivityMetrics(timeRange, companyId);
    }
    
    try {
      const params = new URLSearchParams();
      params.append('range', timeRange);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/productivity?${params}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getProductivityMetrics(timeRange, companyId));
    }
  }

  async getPhoneUsageMetrics(timeRange = 'week', companyId = null) {
    if (!this.useApiFirst) {
      return mockDataService.getPhoneUsageMetrics(timeRange, companyId);
    }
    
    try {
      const params = new URLSearchParams();
      params.append('range', timeRange);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/phone-usage?${params}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getPhoneUsageMetrics(timeRange, companyId));
    }
  }

  async getApplicationsData(companyId = null) {
    if (!this.useApiFirst) {
      return mockDataService.getApplicationsData(companyId);
    }
    
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/applications?${params}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getApplicationsData(companyId));
    }
  }

  async getExecutiveOverview(companyId = null) {
    if (!this.useApiFirst) {
      return mockDataService.getExecutiveOverview(companyId);
    }
    
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/executive-overview?${params}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getExecutiveOverview(companyId));
    }
  }

  async getEmployeeMetrics(companyId = null) {
    if (!this.useApiFirst) {
      return mockDataService.getEmployeeMetrics(companyId);
    }
    
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/employee-metrics?${params}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getEmployeeMetrics(companyId));
    }
  }

  async getProductivityInsights(employeeId = null, dateRange = 'week') {
    if (!this.useApiFirst) {
      return mockDataService.getProductivityInsights(employeeId, dateRange);
    }
    
    try {
      const params = new URLSearchParams();
      if (employeeId) params.append('employee_id', employeeId);
      params.append('range', dateRange);
      
      const response = await apiService.get(`/dashboard/productivity-insights?${params}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getProductivityInsights(employeeId, dateRange));
    }
  }

  async getCompanyDashboard(companyId) {
    if (!this.useApiFirst) {
      return mockDataService.getCompanyDashboard(companyId);
    }
    
    try {
      const response = await apiService.get(`/dashboard/company/${companyId}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getCompanyDashboard(companyId));
    }
  }

  async getWellnessMetrics(companyId = null, period = 'month') {
    if (!this.useApiFirst) {
      return mockDataService.getWellnessMetrics(companyId, period);
    }
    
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/wellness?${params}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getWellnessMetrics(companyId, period));
    }
  }

  async getBookingAnalytics(companyId = null, period = 'month') {
    if (!this.useApiFirst) {
      return mockDataService.getBookingAnalytics(companyId, period);
    }
    
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/booking-analytics?${params}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getBookingAnalytics(companyId, period));
    }
  }

  async getSubscriptionAnalytics(companyId = null, period = 'month') {
    if (!this.useApiFirst) {
      return mockDataService.getSubscriptionAnalytics(companyId, period);
    }
    
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/subscription-analytics?${params}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getSubscriptionAnalytics(companyId, period));
    }
  }

  async getRealtimeStats(companyId = null) {
    if (!this.useApiFirst) {
      return mockDataService.getRealtimeStats(companyId);
    }
    
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await apiService.get(`/dashboard/realtime?${params}`);
      this.handleApiSuccess();
      return response;
    } catch (error) {
      return this.handleApiError(error, mockDataService.getRealtimeStats(companyId));
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