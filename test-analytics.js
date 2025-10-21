// Quick test script for analytics service
import { analyticsService } from '../src/services/analyticsService.js';

const testAnalytics = async () => {
  console.log('Testing Analytics Service...\n');
  
  try {
    // Test dashboard stats
    console.log('🔍 Testing Dashboard Stats...');
    const dashboardResult = await analyticsService.getDashboardStats();
    
    console.log('Dashboard Stats Result:', {
      success: dashboardResult.success,
      fromCache: dashboardResult.fromCache,
      data: dashboardResult.data,
      error: dashboardResult.error
    });
    
    console.log('\n📊 Dashboard Statistics:');
    console.log(`- Companies: ${dashboardResult.data.totalCompanies}`);
    console.log(`- Employees: ${dashboardResult.data.totalEmployees}`);
    console.log(`- Psychologists: ${dashboardResult.data.totalPsychologists}`);
    console.log(`- Bookings: ${dashboardResult.data.totalBookings}`);
    console.log(`- Active Subscriptions: ${dashboardResult.data.activeSubscriptions}`);
    console.log(`- Last Updated: ${dashboardResult.data.lastUpdated}`);
    
    // Test analytics data
    console.log('\n🔍 Testing Analytics Data...');
    const analyticsResult = await analyticsService.getAnalyticsData();
    
    console.log('Analytics Data Result:', {
      success: analyticsResult.success,
      fromCache: analyticsResult.fromCache,
      hasGrowthData: !!analyticsResult.data.growth,
      hasBookingData: !!analyticsResult.data.bookings,
      hasActivityData: !!analyticsResult.data.activity
    });
    
    console.log('\n✅ Analytics Service Test Complete!');
    
  } catch (error) {
    console.error('❌ Analytics Service Test Failed:', error);
  }
};

// Run the test
testAnalytics();