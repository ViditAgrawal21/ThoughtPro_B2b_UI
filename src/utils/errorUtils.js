// Utility functions for handling and displaying user-friendly error messages

export const getUserFriendlyErrorMessage = (error, context = 'general') => {
  const errorMessage = error?.message || error || '';
  const errorLower = errorMessage.toLowerCase();
  
  // Network and connection errors
  if (errorLower.includes('network') || errorLower.includes('connection') || errorLower.includes('fetch')) {
    return 'Network connection failed. Please check your internet connection and try again.';
  }
  
  // Authentication errors
  if (errorLower.includes('unauthorized') || errorLower.includes('401')) {
    return 'Session expired. Please log in again to continue.';
  }
  
  if (errorLower.includes('permission') || errorLower.includes('forbidden') || errorLower.includes('403')) {
    return 'You do not have permission to perform this action.';
  }
  
  // Validation errors
  if (errorLower.includes('validation') || errorLower.includes('invalid')) {
    return 'Please check that all required fields are filled correctly.';
  }
  
  // Duplicate/conflict errors
  if (errorLower.includes('duplicate') || errorLower.includes('already exists') || errorLower.includes('conflict')) {
    switch (context) {
      case 'employee':
        return 'An employee with this email already exists. Please use a different email.';
      case 'company':
        return 'A company with this name or email already exists. Please use different details.';
      default:
        return 'This record already exists. Please check your information.';
    }
  }
  
  // Server errors
  if (errorLower.includes('server') || errorLower.includes('500') || errorLower.includes('503')) {
    return 'Server is temporarily unavailable. Please try again in a few minutes.';
  }
  
  // Not found errors
  if (errorLower.includes('not found') || errorLower.includes('404')) {
    return 'The requested information could not be found.';
  }
  
  // Rate limiting
  if (errorLower.includes('rate limit') || errorLower.includes('too many requests')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  // Context-specific fallback messages
  switch (context) {
    case 'employee':
      return 'Unable to process employee request. Please try again or contact support.';
    case 'company':
      return 'Unable to process company request. Please try again or contact support.';
    case 'login':
      return 'Login failed. Please check your credentials and try again.';
    case 'loading':
      return 'Unable to load data. Please try refreshing the page.';
    case 'resend_credentials':
      if (errorLower.includes('invalid_email')) {
        return 'Invalid email address. Please verify the employee email and try again.';
      }
      if (errorLower.includes('employee_not_found')) {
        return 'Employee not found. Please refresh the page and try again.';
      }
      return 'Unable to resend credentials. Please try again or contact support.';
    case 'bulk_create':
      if (errorLower.includes('duplicate_employees') || errorLower.includes('duplicate')) {
        return 'Some employees already exist with the provided email addresses. Please check for duplicates and try again.';
      }
      if (errorLower.includes('validation_failed')) {
        return 'Invalid employee data. Please check all required fields are properly filled.';
      }
      if (errorLower.includes('bulk_create_failed')) {
        return 'Unable to create employees in bulk. Please try again or create them individually.';
      }
      return 'Unable to create employees. Please check your data and try again.';
    default:
      return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
  }
};

export const handleApiError = (error, context = 'general') => {
  console.error(`API Error (${context}):`, error);
  return getUserFriendlyErrorMessage(error, context);
};

export const showErrorNotification = (error, context = 'general') => {
  const message = getUserFriendlyErrorMessage(error, context);
  
  // You can integrate with a notification library here
  // For now, we'll just return the message
  return message;
};

// Error boundary helper
export const formatErrorForDisplay = (error, componentName = 'Component') => {
  const userMessage = getUserFriendlyErrorMessage(error, 'general');
  
  return {
    userMessage,
    technicalDetails: {
      component: componentName,
      error: error?.message || error,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    }
  };
};