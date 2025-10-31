// Example: How to integrate analytics components into your App.jsx or routing

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Admin Components
import AnalyticsDashboard from './components/Admin/AnalyticsDashboard';

// Employee Components  
import MyUsage from './components/Employee/MyUsage';
import SubmitUsage from './components/Employee/SubmitUsage';

// Example routing structure
function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin">
          <Route path="analytics" element={<AnalyticsDashboard />} />
          {/* Other admin routes... */}
        </Route>

        {/* Employee Routes */}
        <Route path="/employee">
          <Route path="my-usage" element={<MyUsage />} />
          <Route path="submit-usage" element={<SubmitUsage />} />
          {/* Other employee routes... */}
        </Route>

        {/* Company Owner Routes - Can access both */}
        <Route path="/company">
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="my-usage" element={<MyUsage />} />
          <Route path="submit-usage" element={<SubmitUsage />} />
          {/* Other company routes... */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

// ============================================
// Example: Add to navigation menu
// ============================================

// For Admin Navigation
const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/companies', label: 'Companies', icon: '🏢' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' }, // NEW
  // ... other items
];

// For Employee Navigation
const employeeNavItems = [
  { path: '/employee/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/employee/my-usage', label: 'My Usage', icon: '📊' }, // NEW
  { path: '/employee/submit-usage', label: 'Submit Usage', icon: '📝' }, // NEW
  { path: '/employee/bookings', label: 'Bookings', icon: '📅' },
  // ... other items
];

// For Company Owner Navigation
const companyNavItems = [
  { path: '/company/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/company/analytics', label: 'Company Analytics', icon: '📈' }, // NEW
  { path: '/company/my-usage', label: 'My Usage', icon: '📊' }, // NEW
  { path: '/company/employees', label: 'Employees', icon: '👥' },
  // ... other items
];
