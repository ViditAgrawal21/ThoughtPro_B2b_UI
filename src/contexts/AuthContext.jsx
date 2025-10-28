import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authServices';

export const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requiresPasswordSetup, setRequiresPasswordSetup] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('userProfile');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      const userData = JSON.parse(storedUser);
      const profileData = storedProfile ? JSON.parse(storedProfile) : null;
      
      setUser(userData);
      setUserProfile(profileData);
      setIsAuthenticated(true);
      setUserRole(authService.getUserRole());
      setCompanyId(authService.getCompanyId());
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType = 'company') => {
    try {
      setLoading(true);
      
      let response;
      
      // Try normal login first
      if (userType === 'admin') {
        response = await authService.adminLogin(email, password);
      } else if (userType === 'company') {
        response = await authService.companyLogin(email, password);
      } else {
        response = await authService.employeeLogin(email, password);
      }
      
      // Handle different response scenarios
      if (response && response.requiresPasswordSetup) {
        setRequiresPasswordSetup(true);
        return {
          success: false,
          requiresPasswordSetup: true,
          requiresPasswordChange: true,
          email,
          message: response.message || 'Password setup required'
        };
      }
      
      // Check for successful login with token and user
      if (response.success && response.token && response.user) {
        console.log('AuthContext: Login response:', response);
        
        // Get user data from localStorage (authService already stored it)
        const storedUser = localStorage.getItem('user');
        const storedProfile = localStorage.getItem('userProfile');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const profileData = storedProfile ? JSON.parse(storedProfile) : null;
          
          setUser(userData);
          setUserProfile(profileData);
          setIsAuthenticated(true);
          setUserRole(authService.getUserRole());
          setCompanyId(authService.getCompanyId());
          setRequiresPasswordSetup(false);
          
          console.log('AuthContext: Login successful, user set:', userData);
          return { success: true, user: userData, profile: profileData };
        }
      }
      
      // Handle non-successful response (could be temporary password scenario)
      if (!response.success && response.requiresPasswordSetup) {
        setRequiresPasswordSetup(true);
        return {
          success: false,
          requiresPasswordSetup: true,
          requiresPasswordChange: true,
          email,
          message: response.message || 'Password setup required for first login'
        };
      }
      
      // If we get here, normal login failed - return the response as-is for the component to handle
      return response || { 
        success: false, 
        error: 'Login failed - invalid credentials or server error' 
      };
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Enhanced error handling for different scenarios
      if (error.message?.includes('temporary') || 
          error.message?.includes('requiresPasswordChange') ||
          error.response?.data?.requiresPasswordChange) {
        setRequiresPasswordSetup(true);
        return { 
          success: false, 
          requiresPasswordSetup: true, 
          requiresPasswordChange: true,
          email,
          message: error.message || 'First time login - password setup required' 
        };
      }
      
      // Return error for the component to handle
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithTemporaryPassword = async (email, temporaryPassword) => {
    try {
      setLoading(true);
      
      const response = await authService.loginWithTemporary(email, temporaryPassword);
      
      if (response.success) {
        if (response.requiresPasswordChange) {
          setRequiresPasswordSetup(true);
          return { 
            success: false, 
            requiresPasswordSetup: true, 
            email,
            temporaryPassword,
            message: 'Please set your new password' 
          };
        }
        
        // If password change not required, complete login
        const userData = response.user;
        setUser(userData);
        setIsAuthenticated(true);
        setUserRole(authService.getUserRole());
        setCompanyId(authService.getCompanyId());
        setRequiresPasswordSetup(false);
        
        return { success: true, user: userData };
      }
      
      throw new Error(response.message || 'Temporary login failed');
    } catch (error) {
      console.error('Temporary login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.clearUserData();
    setUser(null);
    setUserProfile(null);
    setIsAuthenticated(false);
    setUserRole(null);
    setCompanyId(null);
    setRequiresPasswordSetup(false);
  };

  const value = {
    user,
    userProfile,
    isAuthenticated,
    userRole,
    companyId,
    loading,
    requiresPasswordSetup,
    login,
    loginWithTemporaryPassword,
    logout,
    isAdmin: () => userRole === 'admin',
    isCompanyUser: () => userRole === 'company',
    canAccessCompanyData: () => userRole === 'admin' || userRole === 'company',
    getUserRole: () => userRole,
    getCompanyId: () => companyId,
    setRequiresPasswordSetup
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
