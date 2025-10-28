# Updated API Endpoints Documentation

This document outlines all the API endpoints that have been updated to match the new backend implementation.

## Summary of Changes

The following API endpoints have been updated across the application:

### 1. Authentication APIs

#### Unified Login Endpoint
- **Endpoint**: `POST /api/v1/auth/supabase/login`
- **Usage**: Used for all login purposes (admin, company, employee)
- **Implementation**: Updated in `authService.js`
- **Description**: Single endpoint that handles authentication for all user types and responds accordingly

**Updated Methods:**
- `authService.adminLogin()`
- `authService.companyLogin()` 
- `authService.employeeLogin()`

### 2. Company Management APIs

#### Company Creation
- **Endpoint**: `POST /api/v1/companies-supabase`
- **Usage**: Used for creating new companies from admin panel
- **Implementation**: Updated in `companyService.js` → `createCompany()` method
- **Component**: Used by `AddCompany.jsx` component

#### Subscription Configuration
- **Get Config**: `GET /api/v1/companies-supabase/{company-id}/subscription-config`
- **Update Config**: `PUT /api/v1/companies-supabase/{company-id}/subscription-config`
- **Usage**: For admin to update company subscription plans
- **Implementation**: Updated in `companyService.js`

### 3. Employee Management APIs

#### Single Employee Creation
- **Endpoint**: `POST /companies/{company-id}/employees`
- **Usage**: Create individual employee under specific company
- **Implementation**: Available in `employeeService.js` and `companyService.js`
- **Storage**: Company ID stored locally during login for easy access

#### Bulk Employee Creation
- **Endpoint**: `POST /companies/{company-id}/employees/bulk`
- **Usage**: Create multiple employees at once under specific company
- **Implementation**: Available in `employeeService.js` and `companyService.js`

#### Get Company Employees
- **Endpoint**: `GET /companies/{company-id}/employees`
- **Usage**: Company can view all their employees
- **Implementation**: Available in `employeeService.js` and `companyService.js`

#### Resend Employee Credentials
- **Endpoint**: `POST /companies/{company-id}/employees/{employee-id}/resend-credentials`
- **Usage**: Company can resend login credentials to employees
- **Implementation**: Available in `employeeService.js` and `companyService.js`

## Company ID Management

### Local Storage Strategy
After company login, the company ID is stored locally for easy access during employee operations:

```javascript
// During login (in authService.js)
if (userData.company_id) {
  localStorage.setItem('company_id', userData.company_id);
}

// Utility methods (in companyService.js)
getCurrentCompanyId() - Gets stored company ID
storeCompanyId(companyId) - Stores company ID
clearCompanyId() - Clears stored company ID during logout
```

### Usage Flow
1. Company logs in → Company ID stored locally
2. Company creates employees → Company ID automatically passed to API
3. Company views employees → Company ID used to filter results
4. Company resends credentials → Company ID used in API call

## Updated Service Methods

### AuthService (`authServices.js`)
- ✅ `adminLogin()` - Uses `/api/v1/auth/supabase/login`
- ✅ `companyLogin()` - Uses `/api/v1/auth/supabase/login`
- ✅ `employeeLogin()` - Uses `/api/v1/auth/supabase/login`

### CompanyService (`companyService.js`)
- ✅ `createCompany()` - Uses `/api/v1/companies-supabase`
- ✅ `getCompanySubscriptionConfig()` - Uses `/api/v1/companies-supabase/{id}/subscription-config`
- ✅ `updateCompanySubscriptionConfig()` - Uses `/api/v1/companies-supabase/{id}/subscription-config`
- ✅ `getCurrentCompanyId()` - Enhanced to check localStorage first
- ✅ `storeCompanyId()` - New method for storing company ID
- ✅ `clearCompanyId()` - New method for clearing company ID

### EmployeeService (`employeeService.js`)
- ✅ `createEmployeeForCompany()` - Uses `/companies/{company-id}/employees`
- ✅ `bulkCreateEmployeesForCompany()` - Uses `/companies/{company-id}/employees/bulk`
- ✅ `getEmployeesByCompany()` - Uses `/companies/{company-id}/employees`
- ✅ `resendEmployeeCredentials()` - Uses `/companies/{company-id}/employees/{employee-id}/resend-credentials`

## Frontend Components Updated

### AddCompany Component
- ✅ Uses updated `companyService.createCompany()` method
- ✅ Automatically calls `/api/v1/companies-supabase` endpoint
- ✅ Handles company creation with subscription plan selection
- ✅ Creates login credentials after company creation

## Implementation Status

All specified API endpoints have been successfully updated and are ready for use. The frontend services now align with the new backend API structure.

### Next Steps for Development Team

1. **Test company creation** through admin panel
2. **Test company login** with generated credentials  
3. **Test employee creation** after company login
4. **Test bulk employee upload** functionality
5. **Test credential resending** from company dashboard

All API calls are now properly configured to use the updated endpoints as specified.