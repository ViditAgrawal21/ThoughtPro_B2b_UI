// API response handlers and error utilities
export class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

export const handleApiResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorDetails = null;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorDetails = errorData.details || errorData;
    } catch (parseError) {
      // If response is not JSON, use status text
      console.warn('Failed to parse error response:', parseError);
    }
    
    // Enhanced error messages for common HTTP status codes
    switch (response.status) {
      case 401:
        errorMessage = 'Authentication required. Please login again.';
        break;
      case 403:
        errorMessage = 'Access denied. You do not have permission to access this resource.';
        break;
      case 404:
        errorMessage = 'Resource not found. The requested endpoint may not be available.';
        break;
      case 500:
        errorMessage = 'Server error. The API service may be temporarily unavailable.';
        break;
      case 502:
      case 503:
      case 504:
        errorMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        // Keep the original error message for other status codes
        break;
    }
    
    const apiError = new ApiError(errorMessage, response.status, response);
    apiError.details = errorDetails;
    throw apiError;
  }

  try {
    return await response.json();
  } catch (parseError) {
    throw new ApiError('Invalid JSON response', response.status, response);
  }
};

export const formatApiError = (error) => {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
      type: 'api_error'
    };
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      message: 'Network error - please check your connection',
      status: 0,
      type: 'network_error'
    };
  }
  
  return {
    message: error.message || 'An unexpected error occurred',
    status: 500,
    type: 'unknown_error'
  };
};

export const retryApiCall = async (apiCall, maxRetries = 2, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      // Don't retry client errors (4xx) or specific server errors
      if (error instanceof ApiError) {
        // Don't retry authentication errors, forbidden, or not found
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        // For 500 errors, only retry once with longer delay
        if (error.status === 500 && attempt === 1) {
          console.warn(`Server error (500), retrying attempt ${attempt + 1}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, delay * 2));
          continue;
        }
        
        // For other server errors, retry with exponential backoff
        if (error.status >= 500) {
          console.warn(`Server error (${error.status}), retrying attempt ${attempt + 1}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
          continue;
        }
      }
      
      // For network errors, retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};