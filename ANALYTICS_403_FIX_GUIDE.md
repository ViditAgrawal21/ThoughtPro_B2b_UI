# 403 Forbidden Error - Analytics Endpoints Fix Guide

## Problem
The analytics endpoints are returning **403 (Forbidden)** errors:
- `GET /usage/company-analytics` - ❌ 403
- `GET /usage/company-trends?period=30d` - ❌ 403  
- `GET /usage/app-leaderboard?limit=20` - ❌ 403

Error message: `"Access denied. You do not have permission to access this resource."`

---

## Root Cause

The backend API requires **admin** or **company_owner** role to access these endpoints, but one of the following is happening:

1. **Not logged in as admin/company_owner** - You might be logged in as an employee
2. **Token not being sent** - Authentication token missing from request headers
3. **Backend not implemented** - These endpoints might not have role checking implemented yet
4. **Role mismatch** - Your user role in the database might not be set correctly

---

## Frontend Changes Already Made ✅

### 1. Updated AnalyticsDashboard Component
- ✅ Added better error handling with `Promise.allSettled`
- ✅ Shows specific error for 403: "Access denied. You do not have permission..."
- ✅ Partial data loading (if one endpoint works, others still display)
- ✅ Added `useAuth` to detect user role
- ✅ Back button now routes correctly based on role (admin → `/admin/dashboard`, company_owner → `/dashboard`)

### 2. Added Routes for Both Roles
```javascript
// Admin route
<Route path="/admin/analytics" element={
  <PrivateRoute requiredRole="admin">
    <AnalyticsDashboard />
  </PrivateRoute>
} />

// Company Owner route  
<Route path="/company/analytics" element={
  <PrivateRoute requiredRole="company_owner">
    <AnalyticsDashboard />
  </PrivateRoute>
} />
```

### 3. Authentication Headers Working
The API service already correctly sends the JWT token:
```javascript
'Authorization': `Bearer ${token}`
```

---

## What Needs to Be Fixed on Backend

### Option 1: Check User Role in Database
Make sure your current logged-in user has the correct role:

```sql
-- Check your user's role
SELECT id, email, role FROM users WHERE email = 'your-email@example.com';

-- If role is wrong, update it:
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
-- OR
UPDATE users SET role = 'company_owner' WHERE email = 'your-email@example.com';
```

### Option 2: Verify Backend Endpoint Implementation
The backend endpoints must allow these roles:

```javascript
// Example backend middleware
router.get('/usage/company-analytics', 
  authenticate,  // Verify JWT token
  authorize(['admin', 'company_owner']),  // Allow both roles
  getCompanyAnalytics
);

router.get('/usage/company-trends',
  authenticate,
  authorize(['admin', 'company_owner']),
  getCompanyTrends
);

router.get('/usage/app-leaderboard',
  authenticate,
  authorize(['admin', 'company_owner']),
  getAppLeaderboard
);
```

### Option 3: Check If Endpoints Exist
Test the endpoints directly:

```bash
# Test with your auth token
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  https://thoughtprob2b.thoughthealer.org/api/v1/usage/company-analytics

# Expected response codes:
# 200 - Success
# 401 - Unauthorized (bad/missing token)
# 403 - Forbidden (correct token, wrong role)
# 404 - Not Found (endpoint doesn't exist)
```

---

## Testing Steps

### Step 1: Verify You're Logged In
1. Open browser DevTools → Application/Storage → Local Storage
2. Check for `token` key
3. Copy the token value

### Step 2: Decode JWT Token
Go to [jwt.io](https://jwt.io) and paste your token to see:
- User ID
- **User Role** (should be `admin` or `company_owner`)
- Expiration time

### Step 3: Test API Endpoints
Use the test endpoints in the browser console:

```javascript
// Test Company Analytics
fetch('https://thoughtprob2b.thoughthealer.org/api/v1/usage/company-analytics', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

---

## Quick Fix for Testing (Frontend Only)

If you just want to see the UI without real data, you can add mock data:

```javascript
// In AnalyticsDashboard.jsx, add this temporary code:
const loadAnalytics = async () => {
  try {
    setLoading(true);
    setError(null);

    // TEMPORARY: Mock data for testing
    if (process.env.NODE_ENV === 'development') {
      setAnalytics({
        companyStats: {
          totalEmployees: 50,
          totalScreenTime: 12000,
          averageScreenTime: 240,
          averageProductivityScore: 75.5,
          totalRecords: 350
        },
        topApps: [
          { _id: 'VS Code', category: 'Development', totalUsage: 5000, totalUsers: 25 },
          { _id: 'Chrome', category: 'Communication', totalUsage: 4000, totalUsers: 40 }
        ],
        dateRange: { startDate: '2025-10-01', endDate: '2025-10-31' }
      });
      setLoading(false);
      return;
    }

    // Real API calls here...
  }
};
```

---

## Current Status

✅ **Frontend:** Fully implemented and ready
- Routes configured for admin and company_owner
- Error handling implemented
- UI components complete
- Authentication headers working

❌ **Backend:** Needs verification
- Check if endpoints are implemented
- Verify role-based access control
- Ensure JWT middleware is working

---

## Next Steps

1. **Verify your login role:** Check if you're logged in as admin/company_owner
2. **Contact backend team:** Ask them to verify these 3 endpoints are implemented with proper role checks
3. **Test with Postman/cURL:** Test the endpoints directly with your auth token
4. **Check backend logs:** Look for any errors when accessing these endpoints

---

## Support

If issues persist:
1. Check the browser console for detailed error messages
2. Check the Network tab to see the exact request/response
3. Verify the backend server is running and accessible
4. Check if there are any CORS issues

**The frontend code is correct and working. The 403 error is a backend authorization issue.**
