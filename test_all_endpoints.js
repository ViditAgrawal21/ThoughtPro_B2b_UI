/**
 * Comprehensive API Endpoint Testing Script
 * Tests all Admin and Availability endpoints
 */

const BASE_URL = 'https://thoughtprob2b.thoughthealer.org/api/v1';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkNTA2YzcyLWRkZDMtNGNhMy04YmFlLWFkNGE3OTlhMmYwOSIsImNyZWRlbnRpYWxJZCI6IjM5Y2U4YmI4LTFhNDUtNGVmNS05NWNhLTQ1Njg0Yzg5NjJlMiIsImNvbXBhbnkiOiJkYzk3N2FjZC1mOTk4LTQ2NGMtODVjOC0yYzc4YTU4N2YyZTIiLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6W10sImVtYWlsIjoidmlkaXRhZG1pbkB0ZWNoY29ycC5jb20iLCJpYXQiOjE3NjE2MzMxNzYsImV4cCI6MTc2MjIzNzk3Nn0.T5WOno7pI2O0eckwEeDswwnqNBrB6D6WNJxb5DozA2I';
const PSYCHOLOGIST_ID = '02c51337-5ecb-41b6-a288-0849fb8b1954';
const BOOKING_ID = 'dc08ffca-df3e-4251-b341-ea298c78fa75';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Test results storage
const results = {
  passed: [],
  failed: [],
  total: 0
};

/**
 * Make API request and return result
 */
async function testEndpoint(name, method, url, body = null) {
  results.total++;
  const startTime = Date.now();
  
  try {
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log(`\n${colors.cyan}Testing: ${name}${colors.reset}`);
    console.log(`${colors.blue}${method} ${url}${colors.reset}`);

    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (response.ok) {
      console.log(`${colors.green}✓ PASSED${colors.reset} (${response.status}) - ${duration}ms`);
      console.log(`Response:`, typeof responseData === 'object' ? JSON.stringify(responseData, null, 2).substring(0, 500) : responseData.substring(0, 500));
      results.passed.push({ name, method, url, status: response.status, duration });
      return { success: true, data: responseData, status: response.status };
    } else {
      console.log(`${colors.red}✗ FAILED${colors.reset} (${response.status}) - ${duration}ms`);
      console.log(`Error:`, typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData);
      results.failed.push({ name, method, url, status: response.status, error: responseData, duration });
      return { success: false, error: responseData, status: response.status };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`${colors.red}✗ ERROR${colors.reset} - ${duration}ms`);
    console.log(`Exception:`, error.message);
    results.failed.push({ name, method, url, error: error.message, duration });
    return { success: false, error: error.message };
  }
}

/**
 * Test Admin Endpoints
 */
async function testAdminEndpoints() {
  console.log(`\n${colors.magenta}${'='.repeat(60)}`);
  console.log(`ADMIN ENDPOINTS`);
  console.log(`${'='.repeat(60)}${colors.reset}\n`);

  // 1. Get all psychologists with booking statistics
  await testEndpoint(
    'Get Psychologists Overview',
    'GET',
    `${BASE_URL}/admin/psychologists-overview`
  );

  // 2. Get bookings for a specific psychologist
  await testEndpoint(
    'Get Psychologist Bookings',
    'GET',
    `${BASE_URL}/admin/psychologist-bookings/${PSYCHOLOGIST_ID}`
  );

  // 3. Get all bookings
  await testEndpoint(
    'Get All Bookings',
    'GET',
    `${BASE_URL}/admin/all-bookings`
  );

  // 4. Reassign booking (PUT - may fail if booking doesn't exist or already completed)
  await testEndpoint(
    'Reassign Booking',
    'PUT',
    `${BASE_URL}/admin/bookings/${BOOKING_ID}/reassign`,
    { new_psychologist_id: PSYCHOLOGIST_ID }
  );

  // 5. Disable psychologist
  await testEndpoint(
    'Disable Psychologist',
    'POST',
    `${BASE_URL}/admin/psychologists/${PSYCHOLOGIST_ID}/disable`
  );

  // 6. Enable psychologist
  await testEndpoint(
    'Enable Psychologist',
    'POST',
    `${BASE_URL}/admin/psychologists/${PSYCHOLOGIST_ID}/enable`
  );

  // 7. Get psychologist status
  await testEndpoint(
    'Get Psychologist Status',
    'GET',
    `${BASE_URL}/admin/psychologists/${PSYCHOLOGIST_ID}/status`
  );

  // 8. Set booking limits
  await testEndpoint(
    'Set Booking Limits',
    'PUT',
    `${BASE_URL}/admin/psychologists/${PSYCHOLOGIST_ID}/booking-limits`,
    {
      weekly_booking_limit: 10,
      monthly_booking_limit: 40
    }
  );

  // 9. Get booking limits
  await testEndpoint(
    'Get Booking Limits',
    'GET',
    `${BASE_URL}/admin/psychologists/${PSYCHOLOGIST_ID}/booking-limits`
  );

  // 10. Get all companies
  await testEndpoint(
    'Get All Companies',
    'GET',
    `${BASE_URL}/admin/companies`
  );

  // Note: Skipping DELETE operations to avoid data loss
  console.log(`\n${colors.yellow}⚠ Skipping DELETE operations (psychologist/company) to preserve data${colors.reset}`);
}

/**
 * Test Availability Endpoints
 */
async function testAvailabilityEndpoints() {
  console.log(`\n${colors.magenta}${'='.repeat(60)}`);
  console.log(`AVAILABILITY ENDPOINTS`);
  console.log(`${'='.repeat(60)}${colors.reset}\n`);

  let testSlotId = null;
  let testHolidayId = null;

  // 1. Create availability slot
  const createSlotResult = await testEndpoint(
    'Create Availability Slot',
    'POST',
    `${BASE_URL}/availability`,
    {
      psychologist_id: PSYCHOLOGIST_ID,
      time_slot: '2025-11-15T14:00:00',
      availability_status: 'Available'
    }
  );

  if (createSlotResult.success && createSlotResult.data?.id) {
    testSlotId = createSlotResult.data.id;
  }

  // 2. Get availability by psychologist ID
  const availabilityResult = await testEndpoint(
    'Get Availability by Psychologist',
    'GET',
    `${BASE_URL}/availability/${PSYCHOLOGIST_ID}`
  );

  // If we didn't get a slot ID from creation, try to get one from the list
  if (!testSlotId && availabilityResult.success) {
    const slots = Array.isArray(availabilityResult.data) ? availabilityResult.data : availabilityResult.data?.slots || [];
    if (slots.length > 0 && slots[0].id) {
      testSlotId = slots[0].id;
      console.log(`${colors.yellow}Using existing slot ID: ${testSlotId}${colors.reset}`);
    }
  }

  // 3. Update availability status (if we have a slot ID)
  if (testSlotId) {
    await testEndpoint(
      'Update Availability Status',
      'PATCH',
      `${BASE_URL}/availability/${testSlotId}`,
      {
        availability_status: 'Available',
        notes: 'Updated by test script'
      }
    );
  } else {
    console.log(`${colors.yellow}⚠ Skipping Update Availability - No slot ID available${colors.reset}`);
  }

  // 4. Create bulk availability slots
  await testEndpoint(
    'Create Bulk Availability (Populate N Days)',
    'POST',
    `${BASE_URL}/availability/populate-n-days`,
    {
      psychologist_ids: [PSYCHOLOGIST_ID],
      start_date: '2025-11-20',
      end_date: '2025-11-22',
      start_time: '09:00',
      end_time: '17:00'
    }
  );

  // 5. Toggle day availability
  await testEndpoint(
    'Toggle Day Availability',
    'PATCH',
    `${BASE_URL}/availability/toggle-day`,
    {
      psychologist_id: PSYCHOLOGIST_ID,
      date: '2025-11-25',
      availability_status: 'Available'
    }
  );

  // 6. Get all holidays
  const holidaysResult = await testEndpoint(
    'Get All Holidays',
    'GET',
    `${BASE_URL}/holidays`
  );

  // 7. Add a holiday
  const createHolidayResult = await testEndpoint(
    'Add Holiday',
    'POST',
    `${BASE_URL}/holidays`,
    {
      date: '2025-12-25',
      description: 'Test Holiday - Created by test script'
    }
  );

  if (createHolidayResult.success && createHolidayResult.data?.id) {
    testHolidayId = createHolidayResult.data.id;
  }

  // If we didn't get a holiday ID from creation, try to get one from the list
  if (!testHolidayId && holidaysResult.success) {
    const holidays = Array.isArray(holidaysResult.data) ? holidaysResult.data : holidaysResult.data?.holidays || [];
    if (holidays.length > 0 && holidays[0].id) {
      testHolidayId = holidays[0].id;
      console.log(`${colors.yellow}Using existing holiday ID: ${testHolidayId}${colors.reset}`);
    }
  }

  // 8. Delete a holiday (cleanup test data)
  if (testHolidayId) {
    await testEndpoint(
      'Delete Holiday',
      'DELETE',
      `${BASE_URL}/holidays/${testHolidayId}`
    );
  } else {
    console.log(`${colors.yellow}⚠ Skipping Delete Holiday - No holiday ID available${colors.reset}`);
  }

  // 9. Delete availability slot (cleanup test data)
  if (testSlotId) {
    await testEndpoint(
      'Delete Availability Slot',
      'DELETE',
      `${BASE_URL}/availability/${testSlotId}`
    );
  } else {
    console.log(`${colors.yellow}⚠ Skipping Delete Slot - No slot ID available${colors.reset}`);
  }
}

/**
 * Print test summary
 */
function printSummary() {
  console.log(`\n${colors.magenta}${'='.repeat(60)}`);
  console.log(`TEST SUMMARY`);
  console.log(`${'='.repeat(60)}${colors.reset}\n`);

  console.log(`${colors.cyan}Total Tests: ${results.total}${colors.reset}`);
  console.log(`${colors.green}Passed: ${results.passed.length}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed.length}${colors.reset}`);
  
  const successRate = ((results.passed.length / results.total) * 100).toFixed(2);
  console.log(`${colors.cyan}Success Rate: ${successRate}%${colors.reset}\n`);

  if (results.failed.length > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}`);
    results.failed.forEach((test, index) => {
      console.log(`  ${index + 1}. ${test.name} - ${test.method} ${test.url}`);
      console.log(`     Status: ${test.status || 'ERROR'}`);
      console.log(`     Duration: ${test.duration}ms`);
    });
  }

  if (results.passed.length > 0) {
    console.log(`\n${colors.green}Passed Tests:${colors.reset}`);
    results.passed.forEach((test, index) => {
      console.log(`  ${index + 1}. ${test.name} - ${test.status} (${test.duration}ms)`);
    });
  }

  console.log(`\n${colors.magenta}${'='.repeat(60)}${colors.reset}\n`);
}

/**
 * Main execution
 */
async function runAllTests() {
  console.log(`${colors.magenta}${'='.repeat(60)}`);
  console.log(`ThoughtPro B2B API Endpoint Testing`);
  console.log(`${'='.repeat(60)}${colors.reset}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Psychologist ID: ${PSYCHOLOGIST_ID}`);
  console.log(`Booking ID: ${BOOKING_ID}`);
  console.log(`Token: ${JWT_TOKEN.substring(0, 30)}...`);
  
  try {
    await testAdminEndpoints();
    await testAvailabilityEndpoints();
  } catch (error) {
    console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  } finally {
    printSummary();
  }
}

// Run the tests
runAllTests().catch(console.error);
