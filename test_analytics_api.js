// Quick Test Script for Usage Analytics Endpoints
// Run this in browser console or as a Node.js script

// ============================================
// Configuration
// ============================================
const API_BASE_URL = 'https://thoughtprob2b.thoughthealer.org/api/v1';
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';
const EMPLOYEE_TOKEN = 'YOUR_EMPLOYEE_TOKEN_HERE';

// ============================================
// Helper Functions
// ============================================
async function apiCall(endpoint, method = 'GET', body = null, token = EMPLOYEE_TOKEN) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json();
  
  console.log(`\n📡 ${method} ${endpoint}`);
  console.log(`Status: ${response.status}`);
  console.log('Response:', data);
  
  return data;
}

// ============================================
// Test Functions
// ============================================

// Test 1: Submit Daily Usage (Employee)
async function testSubmitUsage() {
  console.log('\n🧪 TEST 1: Submit Daily Usage');
  
  const usageData = {
    date: new Date().toISOString().split('T')[0],
    apps: [
      {
        appName: 'Visual Studio Code',
        usageTime: 180,
        category: 'Development'
      },
      {
        appName: 'Google Chrome',
        usageTime: 120,
        category: 'Productivity'
      },
      {
        appName: 'Slack',
        usageTime: 60,
        category: 'Communication'
      }
    ],
    totalScreenTime: 480,
    deviceInfo: {
      deviceType: 'laptop',
      os: 'Windows 11'
    }
  };

  return await apiCall('/usage/daily', 'POST', usageData, EMPLOYEE_TOKEN);
}

// Test 2: Get My Usage (Employee)
async function testGetMyUsage(page = 1, limit = 7) {
  console.log('\n🧪 TEST 2: Get My Usage');
  return await apiCall(`/usage/my-usage?page=${page}&limit=${limit}`, 'GET', null, EMPLOYEE_TOKEN);
}

// Test 3: Get Company Analytics (Admin)
async function testCompanyAnalytics(startDate = null, endDate = null) {
  console.log('\n🧪 TEST 3: Get Company Analytics');
  
  let endpoint = '/usage/company-analytics';
  const params = [];
  
  if (startDate) params.push(`startDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  
  if (params.length > 0) {
    endpoint += `?${params.join('&')}`;
  }
  
  return await apiCall(endpoint, 'GET', null, ADMIN_TOKEN);
}

// Test 4: Get Company Trends (Admin)
async function testCompanyTrends(period = '30d') {
  console.log('\n🧪 TEST 4: Get Company Trends');
  return await apiCall(`/usage/company-trends?period=${period}`, 'GET', null, ADMIN_TOKEN);
}

// Test 5: Get App Leaderboard (Admin)
async function testAppLeaderboard(limit = 20) {
  console.log('\n🧪 TEST 5: Get App Leaderboard');
  return await apiCall(`/usage/app-leaderboard?limit=${limit}`, 'GET', null, ADMIN_TOKEN);
}

// ============================================
// Run All Tests
// ============================================
async function runAllTests() {
  console.log('🚀 Starting Usage Analytics API Tests...\n');
  console.log('='  .repeat(50));

  try {
    // Employee Tests
    console.log('\n👤 EMPLOYEE TESTS');
    console.log('='  .repeat(50));
    
    await testSubmitUsage();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    await testGetMyUsage(1, 7);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Admin Tests
    console.log('\n\n👨‍💼 ADMIN TESTS');
    console.log('='  .repeat(50));
    
    await testCompanyAnalytics();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testCompanyTrends('30d');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testAppLeaderboard(10);

    console.log('\n\n✅ All tests completed!');
    console.log('='  .repeat(50));
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// ============================================
// Quick Test Commands
// ============================================
const quickTests = {
  // Submit usage for today
  submitToday: () => testSubmitUsage(),
  
  // Get my usage
  myUsage: () => testGetMyUsage(),
  
  // Get company stats
  companyStats: () => testCompanyAnalytics(),
  
  // Get this week's trends
  weekTrends: () => testCompanyTrends('7d'),
  
  // Get top 5 apps
  top5Apps: () => testAppLeaderboard(5),
  
  // Run everything
  all: () => runAllTests()
};

// ============================================
// Usage Examples
// ============================================
/*
// In browser console:

// 1. First, set your tokens:
const ADMIN_TOKEN = 'your_admin_token_here';
const EMPLOYEE_TOKEN = 'your_employee_token_here';

// 2. Copy and paste this entire file into console

// 3. Run individual tests:
await quickTests.submitToday();
await quickTests.myUsage();
await quickTests.companyStats();
await quickTests.weekTrends();
await quickTests.top5Apps();

// Or run all tests:
await quickTests.all();
*/

// ============================================
// Export for Node.js (optional)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testSubmitUsage,
    testGetMyUsage,
    testCompanyAnalytics,
    testCompanyTrends,
    testAppLeaderboard,
    runAllTests,
    quickTests
  };
}

// Auto-run if executed directly
if (typeof window === 'undefined') {
  // Running in Node.js
  console.log('💡 To run tests, execute: node test_analytics_api.js');
  console.log('💡 Or import functions and run individually');
} else {
  // Running in browser
  console.log('💡 Usage Analytics API Test Suite Loaded!');
  console.log('💡 Run: await quickTests.all()');
  console.log('💡 Or run individual tests:');
  console.log('   - await quickTests.submitToday()');
  console.log('   - await quickTests.myUsage()');
  console.log('   - await quickTests.companyStats()');
  console.log('   - await quickTests.weekTrends()');
  console.log('   - await quickTests.top5Apps()');
}
