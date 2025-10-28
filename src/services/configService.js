// Configuration service for ThoughtPro B2B application
class ConfigService {
  constructor() {
    // Use the production API URL with /v1 endpoint
    let baseUrl = process.env.REACT_APP_API_URL || 'https://thoughtprob2b.thoughthealer.org/api/v1';
    
    // Ensure base URL ends with /v1
    if (!baseUrl.endsWith('/v1') && !baseUrl.endsWith('/v1/')) {
      baseUrl = baseUrl.endsWith('/') ? baseUrl + 'v1' : baseUrl + '/v1';
    }
    
    this.config = {
      apiBaseUrl: baseUrl,
      appName: process.env.REACT_APP_APP_NAME || 'ThoughtPro B2B',
      version: process.env.REACT_APP_VERSION || '1.0.0',
      environment: process.env.REACT_APP_ENV || 'development',
      enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
      debugMode: process.env.REACT_APP_DEBUG_MODE === 'true',
      disableApi: process.env.REACT_APP_DISABLE_API === 'true',
      mockMode: process.env.REACT_APP_MOCK_MODE === 'true',
      offlineMode: process.env.REACT_APP_OFFLINE_MODE === 'true'
    };
  }

  get(key) {
    return this.config[key];
  }

  getApiUrl(endpoint = '') {
    return `${this.config.apiBaseUrl}${endpoint}`;
  }

  isProduction() {
    return this.config.environment === 'production';
  }

  isDevelopment() {
    return this.config.environment === 'development';
  }

  isApiDisabled() {
    return this.config.disableApi || this.config.offlineMode;
  }

  isMockMode() {
    return this.config.mockMode || this.config.offlineMode;
  }

  shouldUseOfflineMode() {
    return this.config.offlineMode;
  }
}

export const configService = new ConfigService();
export default configService;