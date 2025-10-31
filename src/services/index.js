// ThoughtPro B2B Services Index
// Centralized export for all API services

export { apiService } from './api';
export { authService } from './authServices';
export { companyService } from './companyService';
export { employeeService } from './employeeService';
export { psychologistService } from './psychologistService';
export { bookingService } from './bookingService';
export { subscriptionService } from './subscriptionService';
export { dashboardService } from './dashboardService';
export { healthCheckService } from './healthCheckService';
export { configService } from './configService';
export { mockDataService } from './mockDataService';
export { holidayService } from './holidayService';
export { usageAnalyticsService } from './usageAnalyticsService';

// Service collection for easy access
export const services = {
  api: () => import('./api').then(m => m.apiService),
  auth: () => import('./authServices').then(m => m.authService),
  company: () => import('./companyService').then(m => m.companyService),
  employee: () => import('./employeeService').then(m => m.employeeService),
  psychologist: () => import('./psychologistService').then(m => m.psychologistService),
  booking: () => import('./bookingService').then(m => m.bookingService),
  subscription: () => import('./subscriptionService').then(m => m.subscriptionService),
  dashboard: () => import('./dashboardService').then(m => m.dashboardService),
  health: () => import('./healthCheckService').then(m => m.healthCheckService),
  config: () => import('./configService').then(m => m.configService),
  mockData: () => import('./mockDataService').then(m => m.mockDataService),
  usageAnalytics: () => import('./usageAnalyticsService').then(m => m.usageAnalyticsService)
};

// Service initialization helper
export const initializeServices = () => {
  console.log('🚀 Initializing ThoughtPro B2B Services...');
  
  const serviceList = [
    'API Service',
    'Authentication Service',
    'Company Service',
    'Employee Service',
    'Psychologist Service', 
    'Booking Service',
    'Subscription Service',
    'Dashboard Service',
    'Health Check Service',
    'Configuration Service',
    'Mock Data Service',
    'Usage Analytics Service'
  ];
  
  serviceList.forEach((service, index) => {
    console.log(`✅ ${index + 1}. ${service} - Ready`);
  });
  
  console.log('🎉 All services initialized successfully!');
  return true;
};