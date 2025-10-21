# Dual Authentication System Implementation

## Overview

This document outlines the implementation of a dual authentication system for the ThoughtPro B2B Frontend, supporting separate login flows for Admin and Company users as requested.

## 🔐 Authentication Flows

### 1. Admin Login Flow
- **URL**: `/admin/login`
- **Component**: `AdminLoginPage.jsx`
- **API Endpoint**: `POST /api/auth/admin/login`
- **Features**:
  - Secure administrative access
  - Demo admin account: `admin@thoughtpro.com` / `admin123`
  - Redirects to `/admin/dashboard` after successful login
  - Link to company login for non-admin users

### 2. Company Login Flow
- **URL**: `/company/login` (default login)
- **Component**: `CompanyLoginPage.jsx`
- **API Endpoint**: `POST /api/auth/company/login`
- **Features**:
  - Company-specific authentication
  - Demo company account: `company@demo.com` / `demo123`
  - Redirects to `/dashboard` after successful login
  - Forgot password functionality
  - Link to admin login for system administrators

## 🏗 Architecture Components

### Authentication Services

#### Updated `authServices.js`
```javascript
// Admin Login
async adminLogin(email, password)

// Company Login
async companyLogin(email, password)

// Legacy login (auto-detects based on email)
async login(email, password)
```

#### Company Management Service `companyService.js`
```javascript
// Admin Operations
async getAllCompanies()
async createCompany(companyData)
async updateCompany(companyId, companyData)
async deleteCompany(companyId)

// Company User Operations  
async getMyCompanyProfile()
async updateMyCompanyProfile(companyData)
async getCompanyUsers(companyId)
```

### Components Structure

```
src/components/
├── Login/
│   ├── LoginPage.jsx          # Redirects to company login
│   ├── AdminLoginPage.jsx     # Admin authentication
│   ├── CompanyLoginPage.jsx   # Company authentication
│   └── LoginPage.css          # Shared styles
├── Admin/
│   ├── CompanyList.jsx        # Admin company management
│   └── CompanyList.css
├── Company/
│   ├── CompanyProfile.jsx     # Company profile management
│   └── CompanyProfile.css
└── Dashboard/
    ├── AdminDashboard.jsx     # Admin system overview
    ├── CompanyDashboard.jsx   # Company-specific dashboard
    └── Dashboard.jsx          # Role-based router
```

### API Endpoints Integration

#### Authentication Endpoints
- `POST /api/auth/admin/login` - Admin user login
- `POST /api/auth/company/login` - Company user login

#### Company Management Endpoints (Admin)
- `GET /api/companies` - List all companies
- `POST /api/companies` - Create new company
- `GET /api/companies/{id}` - Get company details
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company

#### Company Users Endpoints
- `GET /api/companies/{id}/users` - List company users
- `POST /api/companies/{id}/users` - Create company user
- `PUT /api/companies/{id}/users/{userId}` - Update company user
- `DELETE /api/companies/{id}/users/{userId}` - Delete company user

### Mock Data Fallback

The system includes comprehensive mock data for development and demo purposes:

```javascript
// mockDataService.js
getAllCompanies()        // Demo companies list
getCompanyById(id)       // Individual company data
createCompany(data)      // Mock company creation
updateCompany(id, data)  // Mock company updates
deleteCompany(id)        // Mock company deletion
```

## 🔄 User Flows

### Admin Workflow
1. **Login**: Access `/admin/login` → Enter admin credentials
2. **Dashboard**: Redirected to `/admin/dashboard` with platform overview
3. **Company Management**: 
   - View all companies at `/companies`
   - Create new companies
   - Edit/delete existing companies
   - Manage company users
4. **System Administration**: Access to platform-wide settings and analytics

### Company Workflow  
1. **Login**: Access `/company/login` (or just `/login`) → Enter company credentials
2. **Dashboard**: Redirected to `/dashboard` with company-specific metrics
3. **Profile Management**: 
   - View/edit company profile
   - Manage company information
   - View employee list and bookings
4. **Employee Management**: Add/manage employees within their company

## 🎨 UI Features

### Visual Distinctions
- **Admin Login**: Red gradient theme with shield icon
- **Company Login**: Teal gradient theme with building icon
- **Feature Lists**: Each login shows relevant capabilities
- **Cross-Navigation**: Links between admin/company login pages

### Responsive Design
- Mobile-friendly login forms
- Adaptive layouts for different screen sizes
- Touch-friendly buttons and inputs

## 🔒 Security Implementation

### Role-Based Access Control
```javascript
// PrivateRoute component with role checking
<PrivateRoute requiredRole="admin">
  <AdminDashboard />
</PrivateRoute>
```

### Token Management
- Secure token storage in localStorage
- Automatic token refresh on API calls
- Role information embedded in user profile

### Route Protection
- Admin routes require `admin` role
- Company routes accessible to `company` and `admin` roles
- Automatic redirects based on authentication state

## 📱 Demo Accounts

### Admin Account
- **Email**: `admin@thoughtpro.com`
- **Password**: `admin123`
- **Access**: Full platform administration

### Company Account  
- **Email**: `company@demo.com`
- **Password**: `demo123`
- **Access**: Company-specific management

## 🚀 Getting Started

### 1. Access the Application
Navigate to the application URL. You'll be redirected to `/company/login` by default.

### 2. Choose Login Type
- **Company Users**: Use the default company login
- **System Admins**: Click "Admin Login" link or navigate to `/admin/login`

### 3. Login with Demo Accounts
Use the provided demo accounts or create new ones based on your role.

### 4. Explore Features
- **Admins**: Manage companies, view platform analytics, system settings
- **Companies**: Manage company profile, employees, view company-specific data

## 🔧 Development Notes

### Environment Setup
The system works in both connected and mock modes:
- **Connected Mode**: When backend API is available
- **Mock Mode**: Automatic fallback with realistic demo data

### Extending the System
To add new features:
1. Update service methods in `companyService.js`
2. Add corresponding mock data in `mockDataService.js`
3. Create UI components following the established patterns
4. Update routes in `App.jsx` with proper role protection

### API Integration
All service methods are designed to gracefully fall back to mock data when the backend is unavailable, ensuring smooth development and demonstration.

## 📋 Future Enhancements

### Security Features
- Two-factor authentication
- Password complexity requirements
- Session timeout management
- Audit logging

### User Management
- Company admin role for user management
- Employee invitation system
- Role assignment interface
- Bulk user operations

### Advanced Features
- Single Sign-On (SSO) integration
- LDAP authentication
- Custom company branding
- Advanced analytics and reporting

---

This implementation provides a robust foundation for multi-tenant B2B authentication while maintaining flexibility for future enhancements and integrations.