import React from 'react';
import { authService } from '../../services/authServices';

// Higher-Order Component for role-based access control
export const withRoleAccess = (WrappedComponent, requiredRoles = []) => {
  return function RoleProtectedComponent(props) {
    const userRole = authService.getUserRole();
    
    if (!authService.isAuthenticated()) {
      return (
        <div className="access-denied">
          <h3>Authentication Required</h3>
          <p>Please log in to access this feature.</p>
        </div>
      );
    }
    
    if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
      return (
        <div className="access-denied">
          <h3>Access Denied</h3>
          <p>You don't have permission to access this feature.</p>
          <p>Required role: {requiredRoles.join(' or ')}</p>
          <p>Your role: {userRole}</p>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Component for conditional rendering based on roles
export const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [],
  fallback = null,
  showError = false 
}) => {
  const userRole = authService.getUserRole();
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);
  const hasRequiredPermissions = requiredPermissions.every(permission => 
    authService.hasPermission(permission)
  );
  
  if (!authService.isAuthenticated()) {
    if (showError) {
      return (
        <div className="auth-error">
          <p>Please log in to view this content.</p>
        </div>
      );
    }
    return fallback;
  }
  
  if (!hasRequiredRole || !hasRequiredPermissions) {
    if (showError) {
      return (
        <div className="access-error">
          <p>You don't have permission to view this content.</p>
        </div>
      );
    }
    return fallback;
  }
  
  return children;
};

// Admin-only component wrapper
export const AdminOnly = ({ children, fallback = null }) => (
  <RoleGuard allowedRoles={['admin']} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Company-level access (Admin + Company users)
export const CompanyAccess = ({ children, fallback = null }) => (
  <RoleGuard allowedRoles={['admin', 'company']} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Employee access (all authenticated users)
export const EmployeeAccess = ({ children, fallback = null }) => (
  <RoleGuard allowedRoles={['admin', 'company', 'employee']} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Permission-based access
export const PermissionGuard = ({ permission, children, fallback = null }) => (
  <RoleGuard requiredPermissions={[permission]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export default RoleGuard;