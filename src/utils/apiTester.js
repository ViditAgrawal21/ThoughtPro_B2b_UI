// API Integration Test Script
// This script can be used to test all the updated API endpoints

import { authServices } from './services/authServices';
import { companyService } from './services/companyService';
import { psychologistService } from './services/psychologistService';
import { bookingService } from './services/bookingService';
import { employeeSubscriptionService } from './services/employeeSubscriptionService';
import { availabilityService } from './services/availabilityService';
import { apiService } from './services/api';

class ApiTester {
  constructor() {
    this.results = {};
  }

  async testHealthCheck() {
    console.log('🔍 Testing Health Check...');
    try {
      const result = await apiService.healthCheck();
      this.results.healthCheck = result;
      console.log('✅ Health Check:', result.success ? 'PASSED' : 'FAILED');
      return result;
    } catch (error) {
      console.log('❌ Health Check FAILED:', error.message);
      this.results.healthCheck = { success: false, error: error.message };
      return false;
    }
  }

  async testAuthEndpoints() {
    console.log('🔍 Testing Authentication Endpoints...');
    
    const testCredentials = {
      admin: { email: 'syneptlabs@gmail.com', password: 'Syneptlabs@a19' },
      company: { email: 'company@test.com', password: 'testpass' },
      employee: { email: 'employee@test.com', password: 'testpass' }
    };

    try {
      // Test admin login
      console.log('Testing Admin Login...');
      const adminResult = await authServices.adminLogin(
        testCredentials.admin.email, 
        testCredentials.admin.password
      );
      this.results.adminLogin = adminResult;

      // Test company login  
      console.log('Testing Company Login...');
      const companyResult = await authServices.companyLogin(
        testCredentials.company.email,
        testCredentials.company.password
      );
      this.results.companyLogin = companyResult;

      // Test employee login
      console.log('Testing Employee Login...');
      const employeeResult = await authServices.employeeLogin(
        testCredentials.employee.email,
        testCredentials.employee.password
      );
      this.results.employeeLogin = employeeResult;

      console.log('✅ Authentication tests completed');
      return true;
    } catch (error) {
      console.log('❌ Authentication tests FAILED:', error.message);
      return false;
    }
  }

  async testCompanyEndpoints() {
    console.log('🔍 Testing Company Endpoints...');
    try {
      // Test get all companies
      const companiesResult = await companyService.getAllCompanies(1, 10);
      this.results.getAllCompanies = companiesResult;

      // Test get company by ID (using mock ID)
      const companyResult = await companyService.getCompanyById('test-company-id');
      this.results.getCompanyById = companyResult;

      console.log('✅ Company endpoint tests completed');
      return true;
    } catch (error) {
      console.log('❌ Company endpoint tests FAILED:', error.message);
      return false;
    }
  }

  async testPsychologistEndpoints() {
    console.log('🔍 Testing Psychologist Endpoints...');
    try {
      // Test get all psychologists
      const psychologistsResult = await psychologistService.getAllPsychologists(1, 10);
      this.results.getAllPsychologists = psychologistsResult;

      // Test search psychologists
      const searchResult = await psychologistService.searchPsychologists('anxiety');
      this.results.searchPsychologists = searchResult;

      console.log('✅ Psychologist endpoint tests completed');
      return true;
    } catch (error) {
      console.log('❌ Psychologist endpoint tests FAILED:', error.message);
      return false;
    }
  }

  async testBookingEndpoints() {
    console.log('🔍 Testing Booking Endpoints...');
    try {
      // Test get my bookings
      const myBookingsResult = await bookingService.getMyBookings();
      this.results.getMyBookings = myBookingsResult;

      // Test get psychologist bookings
      const psychBookingsResult = await bookingService.getPsychologistBookings();
      this.results.getPsychologistBookings = psychBookingsResult;

      console.log('✅ Booking endpoint tests completed');
      return true;
    } catch (error) {
      console.log('❌ Booking endpoint tests FAILED:', error.message);
      return false;
    }
  }

  async testEmployeeSubscriptionEndpoints() {
    console.log('🔍 Testing Employee Subscription Endpoints...');
    try {
      // Test get employee subscriptions
      const subscriptionsResult = await employeeSubscriptionService.getEmployeeSubscriptions(1, 10);
      this.results.getEmployeeSubscriptions = subscriptionsResult;

      console.log('✅ Employee Subscription endpoint tests completed');
      return true;
    } catch (error) {
      console.log('❌ Employee Subscription endpoint tests FAILED:', error.message);
      return false;
    }
  }

  async testAvailabilityEndpoints() {
    console.log('🔍 Testing Availability Endpoints...');
    try {
      // Test get availability
      const availabilityResult = await availabilityService.getAvailability();
      this.results.getAvailability = availabilityResult;

      // Test get my availability
      const myAvailabilityResult = await availabilityService.getMyAvailability();
      this.results.getMyAvailability = myAvailabilityResult;

      console.log('✅ Availability endpoint tests completed');
      return true;
    } catch (error) {
      console.log('❌ Availability endpoint tests FAILED:', error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting API Integration Tests...\n');
    
    const tests = [
      this.testHealthCheck,
      this.testAuthEndpoints,
      this.testCompanyEndpoints,
      this.testPsychologistEndpoints,
      this.testBookingEndpoints,
      this.testEmployeeSubscriptionEndpoints,
      this.testAvailabilityEndpoints
    ];

    const results = [];
    for (const test of tests) {
      try {
        const result = await test.call(this);
        results.push(result);
      } catch (error) {
        console.log(`❌ Test failed: ${error.message}`);
        results.push(false);
      }
    }

    console.log('\n📊 Test Summary:');
    console.log('=================');
    const passed = results.filter(r => r).length;
    const total = results.length;
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}`);
    
    if (passed === total) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️  Some tests failed. Check individual results above.');
    }

    return this.results;
  }

  getDetailedResults() {
    return this.results;
  }
}

// Export for use in console or components
export { ApiTester };

// For testing in browser console:
// import { ApiTester } from './apiTester';
// const tester = new ApiTester();
// tester.runAllTests().then(results => console.log('Test Results:', results));