// Admin Login Test - Verify API Integration
// This file tests the admin login functionality with the actual API

const testAdminLogin = async () => {
  console.log('=== Admin Login API Test ===');
  
  const testCredentials = {
    email: 'syneptlabs@gmail.com',
    password: 'Syneptlabs@a19'
  };
  
  try {
    console.log('Testing admin login with:', testCredentials.email);
    
    // Test API endpoint directly
    const response = await fetch('https://thoughtprob2b.thoughthealer.org/api/v1/auth/supabase/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testCredentials.email,
        password: testCredentials.password,
        role: 'admin'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.json();
    console.log('Response data:', responseData);
    
    if (response.ok && responseData.success) {
      console.log('✅ Admin login API test PASSED');
      console.log('Token received:', responseData.token ? 'Yes' : 'No');
      console.log('User data received:', responseData.user ? 'Yes' : 'No');
      
      if (responseData.user) {
        console.log('Admin user details:', {
          id: responseData.user.id,
          email: responseData.user.email,
          name: responseData.user.name,
          role: responseData.user.role
        });
      }
      
      return {
        success: true,
        data: responseData
      };
    } else {
      console.log('❌ Admin login API test FAILED');
      console.log('Error:', responseData.message || responseData.error);
      
      return {
        success: false,
        error: responseData.message || responseData.error || 'Unknown error'
      };
    }
    
  } catch (error) {
    console.log('❌ Admin login API test ERROR');
    console.error('Network/Request error:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Test different credential scenarios
const testAdminLoginScenarios = async () => {
  console.log('\n=== Admin Login Scenarios Test ===');
  
  const scenarios = [
    {
      name: 'Valid Admin Credentials',
      email: 'syneptlabs@gmail.com',
      password: 'Syneptlabs@a19',
      expectedResult: true
    },
    {
      name: 'Invalid Password', 
      email: 'syneptlabs@gmail.com',
      password: 'wrongpassword',
      expectedResult: false
    },
    {
      name: 'Invalid Email',
      email: 'invalid@email.com',
      password: 'Syneptlabs@a19',
      expectedResult: false
    }
  ];
  
  for (const scenario of scenarios) {
    console.log(`\nTesting: ${scenario.name}`);
    
    try {
      const response = await fetch('https://thoughtprob2b.thoughthealer.org/api/v1/auth/supabase/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: scenario.email,
          password: scenario.password,
          role: 'admin'
        })
      });
      
      const data = await response.json();
      const success = response.ok && data.success;
      
      if (success === scenario.expectedResult) {
        console.log(`✅ ${scenario.name}: PASSED`);
      } else {
        console.log(`❌ ${scenario.name}: FAILED`);
        console.log(`Expected: ${scenario.expectedResult}, Got: ${success}`);
      }
      
      console.log(`Status: ${response.status}, Message: ${data.message || data.error || 'N/A'}`);
      
    } catch (error) {
      console.log(`❌ ${scenario.name}: ERROR - ${error.message}`);
    }
  }
};

// Test localStorage integration
const testLocalStorageIntegration = () => {
  console.log('\n=== LocalStorage Integration Test ===');
  
  // Mock successful login response
  const mockResponse = {
    success: true,
    token: 'mock-admin-token-123',
    user: {
      id: 'admin-123',
      email: 'syneptlabs@gmail.com',
      name: 'System Administrator',
      role: 'admin'
    }
  };
  
  // Simulate what authService.adminLogin would do
  localStorage.setItem('token', mockResponse.token);
  localStorage.setItem('authToken', mockResponse.token);
  localStorage.setItem('jwt_token', mockResponse.token);
  
  const adminUserData = {
    id: mockResponse.user.id,
    email: mockResponse.user.email,
    name: mockResponse.user.name,
    role: 'admin',
    is_active: true,
    permissions: ['*']
  };
  
  localStorage.setItem('user', JSON.stringify(adminUserData));
  localStorage.setItem('userProfile', JSON.stringify({
    role: 'admin',
    email: mockResponse.user.email,
    name: mockResponse.user.name,
    permissions: ['*'],
    isAdmin: true
  }));
  
  // Verify data was stored correctly
  const storedToken = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
  
  console.log('Token stored:', storedToken ? '✅' : '❌');
  console.log('User stored:', storedUser ? '✅' : '❌');
  console.log('Profile stored:', storedProfile ? '✅' : '❌');
  console.log('Admin role set:', storedUser?.role === 'admin' ? '✅' : '❌');
  console.log('Admin permissions:', storedProfile?.permissions?.includes('*') ? '✅' : '❌');
  
  // Clean up
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user');
  localStorage.removeItem('userProfile');
  
  console.log('✅ LocalStorage integration test completed');
};

// Run all tests
const runAllAdminLoginTests = async () => {
  console.log('🚀 Starting Admin Login Tests...\n');
  
  // Test basic API functionality
  await testAdminLogin();
  
  // Test different scenarios
  await testAdminLoginScenarios();
  
  // Test localStorage integration
  testLocalStorageIntegration();
  
  console.log('\n🏁 Admin Login Tests Complete!');
  console.log('\nNext Steps:');
  console.log('1. Open http://localhost:3000/admin/login');
  console.log('2. Use credentials: syneptlabs@gmail.com / Syneptlabs@a19');
  console.log('3. Click "Admin Sign In" or "Use Demo Admin Account"');
  console.log('4. Should redirect to /admin/dashboard on success');
};

// Export for browser console usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testAdminLogin,
    testAdminLoginScenarios,
    testLocalStorageIntegration,
    runAllAdminLoginTests
  };
}

// Auto-run if called directly
if (typeof window !== 'undefined') {
  // Browser environment - make functions available globally
  window.testAdminLogin = testAdminLogin;
  window.testAdminLoginScenarios = testAdminLoginScenarios;
  window.testLocalStorageIntegration = testLocalStorageIntegration;
  window.runAllAdminLoginTests = runAllAdminLoginTests;
  
  console.log('Admin login test functions available:');
  console.log('- testAdminLogin()');
  console.log('- testAdminLoginScenarios()');
  console.log('- testLocalStorageIntegration()');
  console.log('- runAllAdminLoginTests()');
}