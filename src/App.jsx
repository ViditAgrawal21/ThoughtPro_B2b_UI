import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext'; // NEW IMPORT
import { ThemeProvider } from './contexts/ThemeContext'; // NEW IMPORT
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/Login/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import AddEmployee from './components/Employee/AddEmployee';
import EmployeeList from './components/Employee/EmployeeList';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
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
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider> {/* NEW: Wrap with SettingsProvider */}
          <ThemeProvider> {/* NEW: Wrap with ThemeProvider */}
            <AppRoutes />
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;