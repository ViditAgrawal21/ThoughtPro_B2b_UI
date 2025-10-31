import { apiService } from './api';

class UsageAnalyticsService {
  /**
   * Submit daily usage data
   * @param {Object} usageData - Daily usage data
   * @param {string} usageData.date - Date in format YYYY-MM-DD
   * @param {Array} usageData.apps - Array of app usage objects
   * @param {number} usageData.totalScreenTime - Total screen time in minutes
   * @param {Object} usageData.deviceInfo - Device information
   * @returns {Promise} Response with usage data
   */
  async submitDailyUsage(usageData) {
    try {
      const response = await apiService.post('/usage/daily', usageData);
      return response;
    } catch (error) {
      console.error('Failed to submit daily usage:', error);
      throw error;
    }
  }

  /**
   * Get current user's usage data
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 7)
   * @returns {Promise} Response with user usage data and summary
   */
  async getMyUsage(page = 1, limit = 7) {
    try {
      const response = await apiService.get(`/usage/my-usage?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Failed to get user usage:', error);
      throw error;
    }
  }

  /**
   * Get company-wide analytics (Admin only)
   * @param {string} startDate - Optional start date (YYYY-MM-DD)
   * @param {string} endDate - Optional end date (YYYY-MM-DD)
   * @returns {Promise} Response with company analytics
   */
  async getCompanyAnalytics(startDate = null, endDate = null) {
    try {
      let url = '/usage/company-analytics';
      const params = [];
      
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      console.error('Failed to get company analytics:', error);
      throw error;
    }
  }

  /**
   * Get company usage trends (Admin only)
   * @param {string} period - Time period (e.g., '7d', '30d', '90d')
   * @param {string} startDate - Optional start date (YYYY-MM-DD)
   * @param {string} endDate - Optional end date (YYYY-MM-DD)
   * @returns {Promise} Response with company trends
   */
  async getCompanyTrends(period = '30d', startDate = null, endDate = null) {
    try {
      let url = '/usage/company-trends';
      const params = [`period=${period}`];
      
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      
      url += `?${params.join('&')}`;
      
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      console.error('Failed to get company trends:', error);
      throw error;
    }
  }

  /**
   * Get app usage leaderboard (Admin only)
   * @param {number} limit - Number of top apps to return (default: 20)
   * @param {string} startDate - Optional start date (YYYY-MM-DD)
   * @param {string} endDate - Optional end date (YYYY-MM-DD)
   * @returns {Promise} Response with app leaderboard
   */
  async getAppLeaderboard(limit = 20, startDate = null, endDate = null) {
    try {
      let url = '/usage/app-leaderboard';
      const params = [`limit=${limit}`];
      
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      
      url += `?${params.join('&')}`;
      
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      console.error('Failed to get app leaderboard:', error);
      throw error;
    }
  }

  /**
   * Format minutes to hours and minutes
   * @param {number} minutes - Total minutes
   * @returns {string} Formatted time string
   */
  formatTime(minutes) {
    if (!minutes || minutes === 0) return '0m';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    
    return `${hours}h ${mins}m`;
  }

  /**
   * Get category color
   * @param {string} category - Category name
   * @returns {string} Color code
   */
  getCategoryColor(category) {
    const colors = {
      'Productivity': '#4CAF50',
      'Communication': '#2196F3',
      'Entertainment': '#FF9800',
      'Social Media': '#E91E63',
      'Development': '#9C27B0',
      'Design': '#FF5722',
      'Education': '#00BCD4',
      'Finance': '#8BC34A',
      'Other': '#9E9E9E'
    };
    
    return colors[category] || colors['Other'];
  }
}

export const usageAnalyticsService = new UsageAnalyticsService();
export default usageAnalyticsService;
