export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} Minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} Hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} Hour${hours > 1 ? 's' : ''} ${remainingMinutes} Minutes`;
};

export const formatPercentage = (value) => {
  return `${Math.round(value)}%`;
};

export const getTrendColor = (trend) => {
  return trend === 'up' ? '#10B981' : '#F59E0B';
};

export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};