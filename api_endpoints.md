# ThoughtHealer ThoughtProB2B API - Complete Endpoint Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Companies](#companies)
3. [Psychologists](#psychologists)
4. [Bookings](#bookings)
5. [Employee Subscriptions](#employee-subscriptions)
6. [Availability](#availability)
7. [Health Check](#health-check)
8. [Employee Management](#employee-management)

---

## Authentication
**Category Description:** User authentication, authorization, and temporary password management for employee onboarding

### 1. Register User Profile
- **Method:** `POST`
- **Endpoint:** `/auth/supabase/register-profile`
- **Description:** Register user profile after Supabase authentication
- **Authentication:** Not Required

### 2. Create User Credentials
- **Method:** `POST`
- **Endpoint:** `/auth/supabase/create-credentials`
- **Description:** Create user credentials
- **Authentication:** Not Required

### 3. User Login
- **Method:** `POST`
- **Endpoint:** `/auth/supabase/login`
- **Description:** User login
- **Authentication:** Not Required

### 4. Get User Profile
- **Method:** `GET`
- **Endpoint:** `/auth/supabase/profile`
- **Description:** Get user profile
- **Authentication:** Required 🔒

### 5. Create Employee with Temporary Password
- **Method:** `POST`
- **Endpoint:** `/auth/supabase/create-employee-temp`
- **Description:** Create employee with temporary password
- **Authentication:** Required 🔒

### 6. Login with Temporary Password
- **Method:** `POST`
- **Endpoint:** `/auth/supabase/login-temp`
- **Description:** Login with temporary password check
- **Authentication:** Not Required

### 7. Update Temporary Password
- **Method:** `PUT`
- **Endpoint:** `/auth/supabase/update-temp-password`
- **Description:** Update temporary password to permanent password
- **Authentication:** Required 🔒

---

## Companies
**Category Description:** Company management operations

### 1. Create Company with Supabase
- **Method:** `POST`
- **Endpoint:** `/api/v1/companies-supabase`
- **Description:** Create a new company with subscription configuration
- **Authentication:** Not Required

### 2. Create Employee with Email
- **Method:** `POST`
- **Endpoint:** `/companies/{companyId}/employees`
- **Description:** Create employee with email credentials
- **Authentication:** Required 🔒

### 3. Get Company Employees
- **Method:** `GET`
- **Endpoint:** `/companies/{companyId}/employees`
- **Description:** Get company employees
- **Authentication:** Required 🔒

### 4. Resend Employee Credentials
- **Method:** `POST`
- **Endpoint:** `/companies/{companyId}/employees/{employeeId}/resend-credentials`
- **Description:** Resend employee credentials
- **Authentication:** Required 🔒

### 5. Bulk Create Employees
- **Method:** `POST`
- **Endpoint:** `/companies/{companyId}/employees/bulk`
- **Description:** Bulk create employees
- **Authentication:** Required 🔒

### 6. Send Password Reset Link
- **Method:** `POST`
- **Endpoint:** `/companies/forgot-password/personal-email`
- **Description:** Send password reset link to personal email
- **Authentication:** Not Required

### 7. Get Company Subscription Config
- **Method:** `GET`
- **Endpoint:** `/api/v1/companies-supabase/{companyId}/subscription-config`
- **Description:** Get company subscription configuration
- **Authentication:** Required 🔒

### 8. Update Company Subscription Config
- **Method:** `PUT`
- **Endpoint:** `/api/v1/companies-supabase/{companyId}/subscription-config`
- **Description:** Update company subscription configuration
- **Authentication:** Required 🔒

---

## Psychologists
**Category Description:** Psychologist management operations

### 1. Get All Psychologists
- **Method:** `GET`
- **Endpoint:** `/psychologists`
- **Description:** Get all psychologists
- **Authentication:** Not Required

### 2. Create Psychologist Profile
- **Method:** `POST`
- **Endpoint:** `/psychologists`
- **Description:** Create a new psychologist profile
- **Authentication:** Required 🔒

### 3. Search Psychologists by Name
- **Method:** `GET`
- **Endpoint:** `/psychologists/search`
- **Description:** Search psychologists by name
- **Authentication:** Not Required

### 4. Get Psychologist by ID
- **Method:** `GET`
- **Endpoint:** `/psychologists/{id}`
- **Description:** Get psychologist by ID
- **Authentication:** Not Required

---

## Bookings
**Category Description:** Therapy session booking management

### 1. Get My Bookings
- **Method:** `GET`
- **Endpoint:** `/bookings/my-bookings`
- **Description:** Get current user's bookings
- **Authentication:** Required 🔒

### 2. Get Psychologist's Bookings
- **Method:** `GET`
- **Endpoint:** `/bookings/psychologist-bookings`
- **Description:** Get psychologist's bookings
- **Authentication:** Required 🔒

### 3. Create New Booking
- **Method:** `POST`
- **Endpoint:** `/bookings`
- **Description:** Create a new booking
- **Authentication:** Required 🔒

---

## Employee Subscriptions
**Category Description:** Employee subscription and payment management

### 1. Verify Purchase
- **Method:** `POST`
- **Endpoint:** `/employee-subscriptions/verify/purchase`
- **Description:** Verify Google Play in-app purchase for employees
- **Authentication:** Not Required

### 2. Verify Subscription
- **Method:** `POST`
- **Endpoint:** `/employee-subscriptions/verify/subscription`
- **Description:** Verify Google Play subscription for employees
- **Authentication:** Not Required

### 3. Get Active Subscriptions
- **Method:** `GET`
- **Endpoint:** `/employee-subscriptions/active`
- **Description:** Get employee's active subscriptions
- **Authentication:** Not Required

### 4. Check Subscription Status
- **Method:** `GET`
- **Endpoint:** `/employee-subscriptions/status`
- **Description:** Check Employee Subscription Service Status
- **Authentication:** Not Required

---

## Availability
**Category Description:** Psychologist availability and holiday management

### 1. Create Availability Slot
- **Method:** `POST`
- **Endpoint:** `/api/v1/availability`
- **Description:** Create availability slot
- **Authentication:** Required 🔒

### 2. Get Availability by Psychologist ID
- **Method:** `GET`
- **Endpoint:** `/api/v1/availability/{psychologist_id}`
- **Description:** Get availability by psychologist ID
- **Authentication:** Required 🔒

### 3. Update Availability Status
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/availability/{id}`
- **Description:** Update availability status
- **Authentication:** Required 🔒

### 4. Delete Availability Slot
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/availability/{id}`
- **Description:** Delete availability slot
- **Authentication:** Required 🔒

### 5. Populate N Days Availability
- **Method:** `POST`
- **Endpoint:** `/api/v1/availability/populate-n-days`
- **Description:** Create availability slots for all psychologists (Bulk Operation)
- **Authentication:** Required 🔒

### 6. Toggle Day Availability
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/availability/toggle-day`
- **Description:** Toggle availability for a full day
- **Authentication:** Required 🔒

### 7. Get All Holidays
- **Method:** `GET`
- **Endpoint:** `/api/v1/holidays`
- **Description:** Get all holidays
- **Authentication:** Required 🔒

### 8. Add Holiday
- **Method:** `POST`
- **Endpoint:** `/api/v1/holidays`
- **Description:** Add a holiday
- **Authentication:** Required 🔒

### 9. Delete Holiday
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/holidays/{id}`
- **Description:** Delete a holiday
- **Authentication:** Required 🔒

---

## Health Check
**Category Description:** System health and status endpoints

### 1. Check Employee Subscription Service Status
- **Method:** `GET`
- **Endpoint:** `/employee-subscriptions/status`
- **Description:** Check Employee Subscription Service Status
- **Authentication:** Not Required

---

## Employee Management

### 1. Get Employees with Credential Status
- **Method:** `GET`
- **Endpoint:** `/auth/supabase/company/{companyId}/employees-status`
- **Description:** Get company employees with credential status
- **Authentication:** Required 🔒

---

## Data Models & Schemas

### Common Response Models

#### ErrorResponse
```json
{
  "success": boolean,
  "error": string,
  "details": object
}
```

#### SuccessResponse
```json
{
  "success": boolean,
  "message": string,
  "data": object
}
```

#### ValidationErrorResponse
```json
{
  "success": boolean,
  "message": string,
  "errors": array
}
```

---

### Authentication Models

#### EmployeeCreationResponse
```json
{
  "success": boolean,
  "message": string,
  "employee": object,
  "temporaryPassword": string,
  "credentialsId": string
}
```

#### TempPasswordLoginResponse
```json
{
  "success": boolean,
  "token": string,
  "requiresPasswordChange": boolean,
  "isFirstLogin": boolean,
  "user": object
}
```

#### UserProfile
```json
{
  "id": string,
  "name": string,
  "email": string,
  "phone": string,
  "company_id": string,
  "role": string,
  "is_active": boolean,
  "plan_type": string,
  "isPremium": boolean,
  "isUltra": boolean,
  "isBusiness": boolean,
  "expiry_date": string,
  "created_at": string,
  "updated_at": string
}
```

---

### Company Models

#### Company
```json
{
  "id": string,
  "name": string,
  "email": string,
  "phone": string,
  "address": string,
  "industry": string,
  "size": string,
  "subscription_plan": string,
  "is_active": boolean,
  "created_at": string
}
```

#### EmployeeCreateRequest
```json
{
  "name": string,           // Required *
  "personalEmail": string,  // Required *
  "role": string,
  "department": string,
  "position": string,
  "employee_id": string,
  "phone": string
}
```

---

### Psychologist Models

#### Psychologist
```json
{
  "id": string,
  "name": string,                    // Required *
  "email": string,
  "specialization": string,
  "experience_years": number,
  "rating": number,
  "hourly_rate": number,
  "availability": object,
  "is_available": boolean,
  "degree": string,                  // Required *
  "mobile_number": string,           // Required *
  "emergency_call_rate": number,
  "session_45_minute_rate": number,
  "session_30_minute_rate": number,
  "created_at": string,
  "updated_at": string
}
```

---

### Availability Models

#### Availability
```json
{
  "id": string,
  "psychologist_id": string,     // Required *
  "time_slot": string,           // Required *
  "availability_status": string, // Required *
  "created_at": string,
  "updated_at": string
}
```

#### AvailabilityCollectionResponse
```json
{
  "success": boolean,
  "message": string,
  "data": array
}
```

#### BulkAvailabilityResponse
```json
{
  "success": boolean,
  "message": string,
  "data": object
}
```

#### DayToggleResponse
```json
{
  "success": boolean,
  "message": string,
  "data": object
}
```

---

### Holiday Models

#### Holiday
```json
{
  "id": string,
  "date": string,           // Required *
  "description": string,    // Required *
  "created_at": string,
  "updated_at": string
}
```

#### HolidayCollectionResponse
```json
{
  "success": boolean,
  "message": string,
  "data": array
}
```

#### PsychologistBreak
```json
{
  "id": string,
  "psychologist_id": string,  // Required *
  "break_date": string,       // Required *
  "start_time": string,       // Required *
  "end_time": string,         // Required *
  "reason": string,
  "created_at": string,
  "updated_at": string
}
```

---

### Booking Models

#### Booking
```json
{
  "id": string,
  "employee_id": string,
  "psychologist_id": string,     // Required *
  "session_date": string,
  "session_duration": number,
  "session_type": string,        // Required *
  "status": string,
  "meeting_link": string,
  "notes": string,
  "cost": number,
  "created_at": string,
  "appointment_date": string,    // Required *
  "appointment_time": string,    // Required *
  "meet_link": string,
  "updated_at": string
}
```

---

### Subscription Models

#### EmployeePayment
```json
{
  "id": string,
  "employee_id": string,
  "email": string,
  "purchase_token": string,
  "product_id": string,
  "plan_type": string,
  "validity_days": number,
  "expiry_date": string,
  "is_subscription": boolean,
  "payment_gateway": string,
  "verification_data": object,
  "verified_at": string,
  "acknowledgment_handled": boolean,
  "created_at": string
}
```

#### GooglePlayPurchaseRequest
```json
{
  "email": string,                  // Required *
  "purchaseToken": string,          // Required *
  "productId": string,              // Required *
  "obfuscatedAccountId": string,
  "obfuscatedProfileId": string,
  "developerPayload": string
}
```

#### GooglePlaySubscriptionRequest
```json
{
  "email": string,                  // Required *
  "purchaseToken": string,          // Required *
  "subscriptionId": string,         // Required *
  "obfuscatedAccountId": string,
  "obfuscatedProfileId": string
}
```

#### EmployeeSubscriptionResponse
```json
{
  "success": boolean,
  "message": string,
  "data": object
}
```

---

## HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Authentication Note

🔒 = Requires authentication token in header:
```
Authorization: Bearer <your-token>
```

---

## Quick Reference Summary

**Total Endpoints:** 45

**By Category:**
- Authentication: 7 endpoints
- Companies: 8 endpoints
- Psychologists: 4 endpoints
- Bookings: 3 endpoints
- Employee Subscriptions: 4 endpoints
- Availability: 9 endpoints
- Health Check: 1 endpoint
- Employee Management: 1 endpoint

**By HTTP Method:**
- GET: 15 endpoints
- POST: 20 endpoints
- PUT: 2 endpoints
- PATCH: 3 endpoints
- DELETE: 3 endpoints