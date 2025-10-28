import { configService } from './configService';
import { handleApiResponse, retryApiCall, formatApiError } from '../utils/apiUtils';

class ApiService {
  constructor() {
    this.baseURL = configService.getApiUrl();
    this.isOnline = true;
    this.offlineMode = configService.shouldUseOfflineMode();
    
    // Check if we should disable API calls entirely
    this.disableApi = configService.isApiDisabled();
    
    // Also check for mock mode
    const mockMode = configService.isMockMode();
    
    if (this.disableApi || this.offlineMode || mockMode) {
      console.log('API Service: Starting in offline/mock mode');
      this.offlineMode = true; // Force offline mode
    }
  }
  
  setOfflineMode(offline = true) {
    this.offlineMode = offline;
    console.log(`API Service: ${offline ? 'Offline' : 'Online'} mode activated`);
  }
  
  isApiDisabled() {
    return this.disableApi || this.offlineMode;
  }

  getHeaders() {
    // Check multiple possible token storage keys for compatibility
    const token = localStorage.getItem('token') || 
                 localStorage.getItem('authToken') || 
                 localStorage.getItem('jwt_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    // Development debug log for auth issues
    if (process.env.NODE_ENV === 'development') {
      console.log('API Headers:', { 
        hasToken: !!token, 
        tokenLength: token?.length || 0,
        tokenSource: token ? (
          localStorage.getItem('token') ? 'token' :
          localStorage.getItem('authToken') ? 'authToken' : 'jwt_token'
        ) : 'none'
      });
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    // If API is disabled or in offline mode, throw immediately
    if (this.isApiDisabled()) {
      throw new Error('API is disabled or in offline mode');
    }
    
    // Safely join base URL and endpoint to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const cleanBaseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const url = `${cleanBaseURL}${cleanEndpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      return await handleApiResponse(response);
    } catch (error) {
      const formattedError = formatApiError(error);
      
      // Automatically enter offline mode after 3 consecutive 500 errors
      if (formattedError.status >= 500) {
        console.warn('Server error detected, API may be unavailable:', formattedError.message);
      }
      
      console.error('API request failed:', formattedError);
      // Re-throw the original error to preserve stack trace and details
      throw error;
    }
  }

  async requestWithRetry(endpoint, options = {}, maxRetries = 2) {
    return retryApiCall(() => this.request(endpoint, options), maxRetries);
  }

  get(endpoint, useRetry = false) {
    const method = useRetry ? 'requestWithRetry' : 'request';
    return this[method](endpoint, { method: 'GET' });
  }

  post(endpoint, body, useRetry = false) {
    const method = useRetry ? 'requestWithRetry' : 'request';
    return this[method](endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, useRetry = false) {
    const method = useRetry ? 'requestWithRetry' : 'request';
    return this[method](endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, useRetry = false) {
    const method = useRetry ? 'requestWithRetry' : 'request';
    return this[method](endpoint, { method: 'DELETE' });
  }

  // Health check endpoint
  async healthCheck() {
    try {
      // Don't retry health checks - they should be quick
      const response = await this.get('/health');
      this.isOnline = true;
      return {
        success: true,
        ...response
      };
    } catch (error) {
      this.isOnline = false;
      return {
        success: false,
        error: 'Health check failed',
        details: error.message
      };
    }
  }
  
  // Quick connectivity test that doesn't spam the logs
  async testConnection() {
    if (this.isApiDisabled()) {
      return { success: false, offline: true };
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const isSuccessful = response.ok;
      
      if (isSuccessful) {
        this.isOnline = true;
        return { success: true, status: response.status };
      } else {
        this.isOnline = false;
        return { success: false, status: response.status };
      }
    } catch (error) {
      this.isOnline = false;
      return { 
        success: false, 
        error: error.name === 'AbortError' ? 'Timeout' : error.message 
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;