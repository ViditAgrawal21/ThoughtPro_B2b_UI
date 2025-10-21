import React, { useState } from 'react';
import { apiService } from '../../services/api';

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint, name) => {
    try {
      console.log(`Testing ${name}: ${endpoint}`);
      const response = await apiService.get(endpoint);
      console.log(`${name} response:`, response);
      return { success: true, data: response };
    } catch (error) {
      console.error(`${name} error:`, error);
      return { success: false, error: error.message };
    }
  };

  const runTests = async () => {
    setLoading(true);
    const testResults = {};

    // Test API connectivity
    console.log('API Service Configuration:', {
      baseURL: apiService.baseURL,
      isApiDisabled: apiService.isApiDisabled(),
      offlineMode: apiService.offlineMode
    });

    // Test different endpoint variations
    const endpoints = [
      { endpoint: '/v1/companies', name: 'Companies V1' },
      { endpoint: '/companies', name: 'Companies (no version)' },
      { endpoint: '/v1/psychologists', name: 'Psychologists V1' },
      { endpoint: '/psychologists', name: 'Psychologists (no version)' },
      { endpoint: '/v1/employees', name: 'Employees V1' },
      { endpoint: '/employees', name: 'Employees (no version)' },
      { endpoint: '/health', name: 'Health Check' },
      { endpoint: '/v1/health', name: 'Health Check V1' }
    ];

    for (const { endpoint, name } of endpoints) {
      testResults[name] = await testEndpoint(endpoint, name);
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>API Endpoint Test</h2>
      <button onClick={runTests} disabled={loading}>
        {loading ? 'Testing...' : 'Run API Tests'}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Results:</h3>
        {Object.entries(results).map(([name, result]) => (
          <div key={name} style={{ 
            marginBottom: '15px', 
            padding: '10px', 
            border: '1px solid #ccc',
            backgroundColor: result.success ? '#e8f5e8' : '#ffe8e8'
          }}>
            <strong>{name}:</strong>
            {result.success ? (
              <div>
                <div style={{ color: 'green' }}>✓ Success</div>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div style={{ color: 'red' }}>
                ✗ Failed: {result.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest;