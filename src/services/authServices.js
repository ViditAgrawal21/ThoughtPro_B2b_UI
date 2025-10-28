import { apiService } from './api';

class AuthService {
  // Register User Profile (according to API documentation)
  async registerProfile(profileData) {
    try {
      const response = await apiService.post('/auth/supabase/register-profile', profileData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to register profile');
    }
  }

  // Create User Credentials (according to API documentation)
  async createCredentials(credentialsData) {
    try {
      const response = await apiService.post('/auth/supabase/create-credentials', credentialsData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create credentials');
    }
  }

  // Get User Profile (according to API documentation)
  async getUserProfileFromAPI() {
    try {
      const response = await apiService.get('/auth/supabase/profile');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }

  // Authentication and Authorization Operations
  
  // Admin Login Flow using dedicated admin endpoint
  async adminLogin(email, password) {
    try {
      console.log('AdminLogin: Attempting admin login for:', email);
      
      // Use the dedicated admin login endpoint
      const response = await apiService.post('/auth/admin-login', {
        email,
        password
      });
      
      console.log('AdminLogin: API response:', response);
      
      // Handle successful login - API returns data directly in response
      if (response.success && response.token && response.user) {
        const userData = response.user;
        
        console.log('AdminLogin: Login successful, storing data...');
        
        // Store JWT token
        localStorage.setItem('token', response.token);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('jwt_token', response.token);
        console.log('AdminLogin: Token stored');
        
        // Store user data with admin role
        const adminUserData = {
          id: userData.id,
          email: userData.email || email,
          name: userData.name || 'System Administrator',
          role: 'admin',
          is_active: true,
          permissions: ['*']
        };
        
        localStorage.setItem('user', JSON.stringify(adminUserData));
        console.log('AdminLogin: Admin user stored:', adminUserData);
        
        // Store admin profile with full permissions
        localStorage.setItem('userProfile', JSON.stringify({
          role: 'admin',
          email: userData.email || email,
          name: userData.name || 'System Administrator',
          permissions: ['*'], // Admin has all permissions
          isAdmin: true
        }));
        
        console.log('AdminLogin: Admin profile stored');
        return response;
      }
      
      // Handle case where response structure is different
      if (response.success && response.data) {
        const userData = response.data.user || response.data;
        
        if (response.data.token || response.token) {
          const token = response.data.token || response.token;
          localStorage.setItem('token', token);
          localStorage.setItem('authToken', token);
          localStorage.setItem('jwt_token', token);
        }
        
        const adminUserData = {
          id: userData.id,
          email: userData.email || email,
          name: userData.name || 'System Administrator',
          role: 'admin',
          is_active: true,
          permissions: ['*']
        };
        
        localStorage.setItem('user', JSON.stringify(adminUserData));
        localStorage.setItem('userProfile', JSON.stringify({
          role: 'admin',
          email: userData.email || email,
          name: userData.name || 'System Administrator',
          permissions: ['*'],
          isAdmin: true
        }));
        
        return {
          success: true,
          token: response.data.token || response.token,
          user: adminUserData
        };
      }
      
      console.log('AdminLogin: Login failed - invalid response format');
      return {
        success: false,
        error: 'Invalid admin credentials'
      };
      
    } catch (error) {
      console.error('AdminLogin: Error occurred:', error);
      
      // Provide specific error messages based on response
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        
        if (status === 401) {
          throw new Error('Invalid admin credentials. Please check your email and password.');
        } else if (status === 403) {
          throw new Error('Access denied. This account does not have admin privileges.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(message || 'Admin authentication failed');
        }
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Admin authentication failed');
      }
    }
  }

  // Super Admin Login Flow using dedicated super admin endpoint
  async superAdminLogin(email, password) {
    try {
      console.log('SuperAdminLogin: Attempting super admin login for:', email);
      
      // Use the dedicated super admin login endpoint
      const response = await apiService.post('/auth/super-admin-login', {
        email,
        password
      });
      
      console.log('SuperAdminLogin: API response:', response);
      
      // Handle successful login
      if (response.success && response.token && response.user) {
        const userData = response.user;
        
        console.log('SuperAdminLogin: Login successful, storing data...');
        
        // Store JWT token
        localStorage.setItem('token', response.token);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('jwt_token', response.token);
        console.log('SuperAdminLogin: Token stored');
        
        // Store user data with super admin role
        const superAdminUserData = {
          id: userData.id,
          email: userData.email || email,
          name: userData.name || 'Super Administrator',
          role: 'super_admin',
          is_active: true,
          permissions: ['*'] // Super admin has all permissions
        };
        
        localStorage.setItem('user', JSON.stringify(superAdminUserData));
        console.log('SuperAdminLogin: Super admin user stored:', superAdminUserData);
        
        // Store super admin profile
        localStorage.setItem('userProfile', JSON.stringify({
          role: 'super_admin',
          email: userData.email || email,
          name: userData.name || 'Super Administrator',
          permissions: ['*'],
          isSuperAdmin: true
        }));
        
        console.log('SuperAdminLogin: Super admin profile stored');
        return response;
      }
      
      // Handle case where response structure is different
      if (response.success && response.data) {
        const userData = response.data.user || response.data;
        
        if (response.data.token || response.token) {
          const token = response.data.token || response.token;
          localStorage.setItem('token', token);
          localStorage.setItem('authToken', token);
          localStorage.setItem('jwt_token', token);
        }
        
        const superAdminUserData = {
          id: userData.id,
          email: userData.email || email,
          name: userData.name || 'Super Administrator',
          role: 'super_admin',
          is_active: true,
          permissions: ['*']
        };
        
        localStorage.setItem('user', JSON.stringify(superAdminUserData));
        localStorage.setItem('userProfile', JSON.stringify({
          role: 'super_admin',
          email: userData.email || email,
          name: userData.name || 'Super Administrator',
          permissions: ['*'],
          isSuperAdmin: true
        }));
        
        return {
          success: true,
          token: response.data.token || response.token,
          user: superAdminUserData
        };
      }
      
      console.log('SuperAdminLogin: Login failed - invalid response format');
      return {
        success: false,
        error: 'Invalid super admin credentials'
      };
      
    } catch (error) {
      console.error('SuperAdminLogin: Error occurred:', error);
      
      // Handle specific errors
      if (error.message && (
        error.message.includes('Invalid credentials') || 
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )) {
        throw new Error('Invalid super admin email or password. Please check your credentials.');
      } else if (error.message && (
        error.message.includes('403') || 
        error.message.includes('Access denied') ||
        error.message.includes('not authorized')
      )) {
        throw new Error('This account does not have super admin privileges.');
      } else if (error.message && error.message.includes('500')) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Super admin authentication failed');
      }
    }
  }

  // Company Login Flow using Supabase
  async companyLogin(email, password) {
    try {
      const response = await apiService.post('/auth/supabase/login', {
        email,
        password
      });
      
      console.log('Raw API Response:', response);
      
      // Store token and user data if login successful
      if (response.success && response.token && response.user) {
        // The response IS the data - no need to access response.data
        const userData = response.user;
        
        console.log('Login response:', response);
        console.log('User data:', userData);
        
        // Store JWT token
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('jwt_token', response.token);
          console.log('Token stored:', response.token.substring(0, 20) + '...');
        }
        
        // Store company ID from user data
        if (userData.company) {
          localStorage.setItem('company_id', userData.company);
          localStorage.setItem('companyId', userData.company);
          console.log('Company ID stored:', userData.company);
        }
        
        // Store user data with proper structure
        const userToStore = {
          id: userData.id,
          email: userData.email || email,
          name: userData.name,
          role: userData.role || 'company',
          company_id: userData.company,
          phone: userData.phone,
          plan_type: userData.planType,
          validityDays: userData.validityDays,
          productId: userData.productId,
          isFirstLogin: userData.isFirstLogin,
          requiresPasswordChange: userData.requiresPasswordChange,
          is_active: true
        };
        
        localStorage.setItem('user', JSON.stringify(userToStore));
        console.log('User stored:', userToStore);
        
        // Store user profile for permissions
        localStorage.setItem('userProfile', JSON.stringify({
          role: userData.role || 'company',
          company_id: userData.company,
          email: userData.email || email,
          name: userData.name,
          permissions: userData.role === 'admin' ? ['*'] : [
            'view_employees',
            'manage_employees',
            'create_employees',
            'manage_subscriptions'
          ]
        }));
      }
      
      return response;
    } catch (error) {
      console.error('Company login error:', error);
      // Check if it's a temporary password scenario
      if (error.response?.status === 401 && 
          (error.response?.data?.message?.includes('temporary') || 
           error.response?.data?.requiresPasswordChange)) {
        return {
          success: false,
          requiresPasswordSetup: true,
          message: 'Please set your new password to continue'
        };
      }
      throw new Error(error.response?.data?.message || 'Company authentication failed');
    }
  }

  // Employee Login Flow using Supabase
  async employeeLogin(email, password) {
    try {
      const response = await apiService.post('/auth/supabase/login', {
        email,
        password,
        role: 'employee'
      });
      
      // Store token and employee data if login successful
      if (response.success && response.data) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        if (response.data.employee) {
          localStorage.setItem('user', JSON.stringify({
            id: response.data.employee.id,
            email: email,
            name: response.data.employee.name,
            role: 'employee'
          }));
          localStorage.setItem('employee', JSON.stringify(response.data.employee));
        }
        // Store employee profile
        localStorage.setItem('userProfile', JSON.stringify({
          role: 'employee',
          employee_id: response.data.employee?.id,
          company_id: response.data.employee?.company_id,
          name: response.data.employee?.name,
          email: email,
          permissions: [
            'view_bookings',
            'create_bookings',
            'view_psychologists',
            'view_profile'
          ]
        }));
      }
      
      return response;
    } catch (error) {
      throw new Error('Employee authentication failed');
    }
  }

  // Legacy login method (for backward compatibility)
  async login(email, password) {
    // Determine login type based on email or use admin as default
    if (email.toLowerCase().includes('admin') || 
        email.toLowerCase().includes('thoughtpro') || 
        email.toLowerCase().includes('syneptlabs@gmail.com')) {
      return this.adminLogin(email, password);
    } else {
      return this.companyLogin(email, password);
    }
  }

  // Login with Temporary Password (according to API documentation)
  async loginWithTemporary(email, tempPassword) {
    try {
      const response = await apiService.post('/auth/supabase/login-temp', {
        email,
        tempPassword
      });
      
      if (response.success && response.data) {
        // Store token if provided
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        // Check if password change is required
        if (response.data.requiresPasswordChange || response.data.isFirstLogin) {
          return {
            success: false,
            requiresPasswordChange: true,
            isFirstLogin: response.data.isFirstLogin,
            token: response.data.token,
            user: response.data.user,
            message: 'Password change required'
          };
        }
        
        // If no password change required, complete login
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          email: email,
          name: userData.name,
          role: userData.role,
          company_id: userData.company_id
        }));
        
        localStorage.setItem('userProfile', JSON.stringify({
          role: userData.role,
          company_id: userData.company_id,
          email: email,
          name: userData.name,
          permissions: userData.role === 'admin' ? ['*'] : [
            'view_employees',
            'manage_employees'
          ]
        }));
      }
      
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Temporary login failed');
    }
  }

  async logout() {
    try {
      await apiService.post('/auth/logout');
      // Clear all stored data
      this.clearUserData();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if API call fails
      this.clearUserData();
    }
  }

  clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('company_id');
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
  }

  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async validateToken() {
    try {
      const response = await apiService.get('/auth/validate');
      return response;
    } catch (error) {
      return null;
    }
  }

  async refreshToken() {
    try {
      const response = await apiService.post('/auth/refresh');
      
      // Update stored token
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  // Forgot Password for Company Users (according to API documentation)
  async forgotPasswordCompany(personalEmail) {
    try {
      const response = await apiService.post('/companies/forgot-password/personal-email', {
        email: personalEmail
      });
      return response;
    } catch (error) {
      console.error('Forgot password error details:', error);
      // Preserve original error message from API if it's an ApiError
      const errorMessage = error.message || error.response?.data?.message || 'Failed to send password reset email';
      throw new Error(errorMessage);
    }
  }

  async forgotPassword(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        password: newPassword
      });
      return response;
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response;
    } catch (error) {
      throw new Error('Failed to change password');
    }
  }

  async verifyEmail(token) {
    try {
      const response = await apiService.post('/auth/verify-email', { token });
      return response;
    } catch (error) {
      throw new Error('Failed to verify email');
    }
  }

  async resendVerificationEmail(email) {
    try {
      const response = await apiService.post('/auth/resend-verification', { email });
      return response;
    } catch (error) {
      throw new Error('Failed to resend verification email');
    }
  }

  async sendTemporaryPassword(employeeId) {
    try {
      const response = await apiService.post('/auth/send-temp-password', {
        employeeId
      });
      return response;
    } catch (error) {
      throw new Error('Failed to send temporary password');
    }
  }

  async validateTemporaryPassword(tempPassword, employeeId) {
    try {
      const response = await apiService.post('/auth/validate-temp-password', {
        tempPassword,
        employeeId
      });
      return response;
    } catch (error) {
      throw new Error('Invalid temporary password');
    }
  }

  // Update Temporary Password (according to API documentation)
  async updateTemporaryPassword(newPassword, confirmPassword, token = null) {
    try {
      const response = await apiService.put('/auth/supabase/update-temp-password', {
        newPassword,
        confirmPassword
      });
      
      if (response.success && response.data) {
        // Update stored user data if provided
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      }
      
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  }

  async setupPassword(tempPassword, newPassword, employeeId) {
    try {
      const response = await apiService.post('/auth/setup-password', {
        tempPassword,
        newPassword,
        employeeId
      });
      return response;
    } catch (error) {
      throw new Error('Failed to setup password');
    }
  }

  // User session management
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserProfile() {
    const profile = localStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getJwtToken() {
    return localStorage.getItem('jwt_token');
  }

  getStoredCompanyId() {
    // Try multiple possible keys for company ID
    return localStorage.getItem('company_id') || 
           localStorage.getItem('companyId') || 
           this.getCompanyId();
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getUserRole() {
    const profile = this.getUserProfile();
    const user = this.getCurrentUser();
    
    // Check if user is admin (can manage companies and psychologists)
    if (profile?.role === 'admin' || user?.role === 'admin') {
      return 'admin';
    }
    
    // Check if user is company user (limited to their company data)
    if (profile?.company_id || user?.company_id) {
      return 'company';
    }
    
    // Default to employee role
    return 'employee';
  }

  getCompanyId() {
    const profile = this.getUserProfile();
    const user = this.getCurrentUser();
    return profile?.company_id || user?.company_id || null;
  }

  isAdmin() {
    return this.getUserRole() === 'admin';
  }

  isCompanyUser() {
    return this.getUserRole() === 'company';
  }

  isEmployee() {
    return this.getUserRole() === 'employee';
  }

  canAccessCompanyData() {
    return this.isAdmin() || this.isCompanyUser();
  }

  canManagePsychologists() {
    return this.isAdmin();
  }

  canCreateCompanies() {
    return this.isAdmin();
  }

  hasRole(role) {
    return this.getUserRole() === role;
  }

  hasPermission(permission) {
    const user = this.getCurrentUser();
    const profile = this.getUserProfile();
    
    // Check user permissions
    if (user?.permissions?.includes(permission)) {
      return true;
    }
    
    // Check profile permissions
    if (profile?.permissions?.includes(permission)) {
      return true;
    }
    
    // Role-based permissions
    const userRole = this.getUserRole();
    const rolePermissions = {
      admin: ['*'], // Admin has all permissions
      company: [
        'view_employees',
        'manage_employees'
      ],
      employee: [
        'view_own_profile',
        'book_sessions',
        'view_own_bookings'
      ]
    };
    
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes('*') || permissions.includes(permission);
  }
}

export const authService = new AuthService();
export default authService;
