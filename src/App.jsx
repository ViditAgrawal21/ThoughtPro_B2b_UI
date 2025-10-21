import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/Login/LoginPage';
import AdminLoginPage from './components/Login/AdminLoginPage';
import CompanyLoginPage from './components/Login/CompanyLoginPage';
import SetNewPassword from './components/Auth/SetNewPassword';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import AddEmployee from './components/Employee/AddEmployee';
import EmployeeList from './components/Employee/EmployeeList';
import CompanyManagement from './components/Admin/CompanyManagement';
import PsychologistManagement from './components/Psychologist/PsychologistManagement';
import PsychologistDirectory from './components/Company/PsychologistDirectory';
import BookingList from './components/Booking/BookingList';
import CompanyForgotPassword from './components/Auth/CompanyForgotPassword';
import './App.css';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/company/login" />;
  }
  
  // If a specific role is required, check user role
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const PsychologistRouteComponent = () => {
  const { userRole } = useAuth();
  return userRole === 'admin' ? <PsychologistManagement /> : <PsychologistDirectory />;
};

const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Routes>
      {/* Default login redirect */}
      <Route 
        path="/login" 
        element={<LoginPage />} 
      />
      
      {/* Admin Login */}
      <Route 
        path="/admin/login" 
        element={
          isAuthenticated && userRole === 'admin' 
            ? <Navigate to="/admin/dashboard" /> 
            : <AdminLoginPage />
        } 
      />
      
      {/* Company Login */}
      <Route 
        path="/company/login" 
        element={
          isAuthenticated 
            ? userRole === 'admin' 
              ? <Navigate to="/admin/dashboard" />
              : <Navigate to="/dashboard" />
            : <CompanyLoginPage />
        } 
      />

      {/* Set New Password */}
      <Route 
        path="/company/set-password" 
        element={<SetNewPassword />} 
      />

      {/* Company Forgot Password */}
      <Route 
        path="/company/forgot-password" 
        element={<CompanyForgotPassword />} 
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      
      {/* Company Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/admin/companies"
        element={
          <PrivateRoute requiredRole="admin">
            <CompanyManagement />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin/companies/add"
        element={
          <PrivateRoute requiredRole="admin">
            <Navigate to="/admin/companies" />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin/companies/:id/edit"
        element={
          <PrivateRoute requiredRole="admin">
            <CompanyManagement />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin/psychologists"
        element={
          <PrivateRoute requiredRole="admin">
            <PsychologistManagement />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin/psychologists/add"
        element={
          <PrivateRoute requiredRole="admin">
            <Navigate to="/admin/psychologists" />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin/psychologists/:id/edit"
        element={
          <PrivateRoute requiredRole="admin">
            <PsychologistManagement />
          </PrivateRoute>
        }
      />
      
      {/* Legacy route for companies (redirects to admin version) */}
      <Route
        path="/companies"
        element={
          <PrivateRoute requiredRole="admin">
            <Navigate to="/admin/companies" />
          </PrivateRoute>
        }
      />
      
      {/* Legacy routes for add functionality */}
      <Route
        path="/companies/add"
        element={
          <PrivateRoute requiredRole="admin">
            <Navigate to="/admin/companies" />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/psychologists/add"
        element={
          <PrivateRoute>
            <Navigate to="/admin/psychologists" />
          </PrivateRoute>
        }
      />
      
      {/* Settings route */}
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <div style={{padding: '20px', textAlign: 'center'}}>
              <h2>Settings</h2>
              <p>Settings functionality coming soon...</p>
            </div>
          </PrivateRoute>
        }
      />
      
      {/* Companies credentials route - redirect to admin companies */}
      <Route
        path="/companies/credentials"
        element={
          <PrivateRoute requiredRole="admin">
            <Navigate to="/admin/companies" />
          </PrivateRoute>
        }
      />
      
      {/* Shared Routes (Admin and Company) */}
      <Route
        path="/add-employee"
        element={
          <PrivateRoute>
            <AddEmployee />
          </PrivateRoute>
        }
      />
      <Route
        path="/employee-list"
        element={
          <PrivateRoute>
            <EmployeeList />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <EmployeeList />
          </PrivateRoute>
        }
      />
      <Route
        path="/psychologists"
        element={
          <PrivateRoute>
            <PsychologistRouteComponent />
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <BookingList />
          </PrivateRoute>
        }
      />
      
      {/* Default redirect based on role */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? userRole === 'admin' 
              ? <Navigate to="/admin/dashboard" />
              : <Navigate to="/dashboard" />
            : <Navigate to="/company/login" />
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;