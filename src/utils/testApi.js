// Test utility for API integration
import { apiService } from '../services/api';
import { dashboardService } from '../services/dashboardService';

export const testApiConnection = async () => {
  console.log('🚀 Testing API connection to ThoughtPro B2B...');
  
  try {
    // Use the lightweight test connection method instead of full health check
    console.log('📡 Testing basic connectivity...');
    const connectionTest = await apiService.testConnection();
    
    if (connectionTest.success) {
      console.log('✅ API connection successful');
      
      // Only test one dashboard endpoint to avoid spam
      console.log('📊 Testing dashboard service...');
      const dashboardData = await dashboardService.getDashboardData();
      console.log('✅ Dashboard service working:', dashboardData ? 'API data' : 'Mock data');
      
      return { success: true, message: 'API integration test completed', usingMockData: !dashboardData };
    } else {
      console.log('⚠️ API not available, using mock data mode');
      return { success: false, error: connectionTest.error || 'API unavailable', mockMode: true };
    }
  } catch (error) {
    console.log('⚠️ API connection failed, using mock data:', error.message);
    return { success: false, error: error.message, mockMode: true };
  }
};

export const validateDashboardIntegration = () => {
  const baseUrl = process.env.REACT_APP_API_URL || 'https://thoughtprob2b.thoughthealer.org/api';
  
  console.log('🔍 Dashboard Integration Validation');
  console.log('📍 Base URL:', baseUrl);
  console.log('🔑 Has Auth Token:', !!localStorage.getItem('token'));
  
  const expectedEndpoints = [
    '/dashboard/executive-metrics',
    '/dashboard/productivity',
    '/dashboard/phone-usage',
    '/dashboard/applications',
    '/dashboard/executive-overview',
    '/dashboard/employee-metrics'
  ];
  
  console.log('📋 Expected API endpoints:');
  expectedEndpoints.forEach(endpoint => {
    console.log(`   • ${baseUrl}${endpoint}`);
  });
  
  return {
    baseUrl,
    endpoints: expectedEndpoints,
    hasToken: !!localStorage.getItem('token')
  };
};