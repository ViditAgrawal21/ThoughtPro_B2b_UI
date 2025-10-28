/**
 * Test to check psychologist data structure
 */

const BASE_URL = 'https://thoughtprob2b.thoughthealer.org/api/v1';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkNTA2YzcyLWRkZDMtNGNhMy04YmFlLWFkNGE3OTlhMmYwOSIsImNyZWRlbnRpYWxJZCI6IjM5Y2U4YmI4LTFhNDUtNGVmNS05NWNhLTQ1Njg0Yzg5NjJlMiIsImNvbXBhbnkiOiJkYzk3N2FjZC1mOTk4LTQ2NGMtODVjOC0yYzc4YTU4N2YyZTIiLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6W10sImVtYWlsIjoidmlkaXRhZG1pbkB0ZWNoY29ycC5jb20iLCJpYXQiOjE3NjE2MzMxNzYsImV4cCI6MTc2MjIzNzk3Nn0.T5WOno7pI2O0eckwEeDswwnqNBrB6D6WNJxb5DozA2I';

async function testPsychologistStructure() {
  try {
    console.log('Fetching psychologists...\n');
    
    const response = await fetch(`${BASE_URL}/psychologists?page=1&limit=5`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('Full API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n\nFirst Psychologist Object:');
    if (data.data && data.data.length > 0) {
      const firstPsych = data.data[0];
      console.log(JSON.stringify(firstPsych, null, 2));
      
      console.log('\n\nAvailable Fields:');
      Object.keys(firstPsych).forEach(key => {
        console.log(`  - ${key}: ${typeof firstPsych[key]} = ${firstPsych[key]}`);
      });
      
      console.log('\n\nLooking for UUID field:');
      const uuidFields = Object.keys(firstPsych).filter(key => 
        key.toLowerCase().includes('id') || 
        key.toLowerCase().includes('uuid')
      );
      uuidFields.forEach(field => {
        const value = firstPsych[field];
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
        console.log(`  ${field}: ${value} ${isUUID ? '✓ IS UUID' : '✗ NOT UUID'}`);
      });
    } else if (Array.isArray(data)) {
      const firstPsych = data[0];
      console.log(JSON.stringify(firstPsych, null, 2));
      
      console.log('\n\nAvailable Fields:');
      Object.keys(firstPsych).forEach(key => {
        console.log(`  - ${key}: ${typeof firstPsych[key]} = ${firstPsych[key]}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPsychologistStructure();
