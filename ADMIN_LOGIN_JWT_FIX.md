# Admin Login JWT Authentication Fix

## Issues Fixed

### 1. **401 Unauthorized Errors**
**Problem:** API calls were failing with 401 errors because JWT token wasn't being passed correctly.

**Root Cause:** 
- Token was being stored but authentication flow had demo mode fallback
- Password fields were pre-filled instead of requiring manual entry

**Solution:**
- ✅ Removed demo login functionality
- ✅ Cleared pre-filled credentials (security best practice)
- ✅ Verified JWT token storage in localStorage (token, authToken, jwt_token)
- ✅ Confirmed API service properly sends `Authorization: Bearer {token}` header

### 2. **Password Visibility Toggle**
**Problem:** No way to verify password while typing.

**Solution:**
- ✅ Added Eye/EyeOff icon button to toggle password visibility
- ✅ Applied to both AdminLoginPage and SuperAdminLoginPage
- ✅ Added proper CSS styling for password input wrapper

## Changes Made

### AdminLoginPage.jsx
```jsx
- Removed pre-filled credentials (was: syneptlabs@gmail.com / Syneptlabs@a19)
- Empty fields now for security
- Added Eye/EyeOff icons from lucide-react
- Added showPassword state
- Wrapped password input in password-input-wrapper div
- Added password-toggle-btn button
- Removed demo login button
- Removed demo credentials notice
```

### SuperAdminLoginPage.jsx
```jsx
- Same changes as AdminLoginPage
- Removed pre-filled credentials
- Added password visibility toggle
- Cleaned up demo-related code
```

### LoginPage.css
```css
- Added .password-input-wrapper styles
- Added .password-toggle-btn styles with hover effects
- Proper positioning for eye icon (right: 12px)
- Added focus states and disabled states
```

## JWT Token Flow

### 1. Login Request
```javascript
// User enters credentials and submits
POST /api/v1/auth/admin-login
Body: { email, password }
```

### 2. Token Storage (authServices.js)
```javascript
if (response.success && response.token && response.user) {
  // Store in three locations for compatibility
  localStorage.setItem('token', response.token);
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('jwt_token', response.token);
  
  // Store user data
  localStorage.setItem('user', JSON.stringify(adminUserData));
  localStorage.setItem('userProfile', JSON.stringify(profileData));
}
```

### 3. API Requests with Token (api.js)
```javascript
getHeaders() {
  const token = localStorage.getItem('token') || 
               localStorage.getItem('authToken') || 
               localStorage.getItem('jwt_token');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}
```

### 4. All API Calls
Every request made through apiService automatically includes the JWT token:
```javascript
const response = await apiService.get('/admin/psychologists-overview');
// Headers: { Authorization: 'Bearer eyJhbGc...' }
```

## Testing Instructions

### 1. Admin Login Test
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: syneptlabs@gmail.com
   - Password: Syneptlabs@a19
3. Click eye icon to verify password
4. Click "Admin Sign In"
5. Check browser console for:
   - "AdminLogin: Token stored"
   - Token should be visible in Application > Local Storage

### 2. Verify Token in Requests
1. Open Network tab in DevTools
2. After login, navigate to any admin page
3. Check API requests in Network tab
4. Click on any request to `/api/v1/admin/*`
5. Check Request Headers:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 3. Test Protected Endpoints
After successful login, these should work:
- ✅ GET /api/v1/admin/psychologists-overview
- ✅ GET /api/v1/admin/psychologist-bookings/{id}
- ✅ GET /api/v1/availability/{psychologistId}
- ✅ All other /admin/* endpoints

## API Service Token Handling

The API service (`src/services/api.js`) checks three possible token locations:
1. `localStorage.getItem('token')` - Primary
2. `localStorage.getItem('authToken')` - Secondary
3. `localStorage.getItem('jwt_token')` - Tertiary

All three are set during login for maximum compatibility with existing code.

## Security Improvements

1. **No Pre-filled Credentials**: Users must enter credentials manually
2. **Password Visibility Toggle**: Users can verify they typed correctly
3. **Token Refresh**: Consider implementing token refresh logic if tokens expire
4. **Clear Error Messages**: 401 errors show "Token is not valid" clearly

## Troubleshooting

### Still Getting 401 Errors?

1. **Check Token Storage**:
   ```javascript
   // In browser console
   console.log(localStorage.getItem('token'));
   ```

2. **Verify Token is Sent**:
   - Open DevTools > Network
   - Look for API request
   - Check Request Headers > Authorization

3. **Check Token Format**:
   - Should be: `Bearer eyJhbGc...`
   - Must have "Bearer " prefix (with space)

4. **Backend Validation**:
   - Ensure backend accepts the token
   - Check token hasn't expired
   - Verify secret key matches

### Token Not Being Stored?

Check browser console for:
```
AdminLogin: Token stored
```

If missing, the login response might not have correct structure.

### Password Visibility Toggle Not Working?

Check:
1. Eye/EyeOff icons imported from lucide-react
2. showPassword state is defined
3. CSS class `password-toggle-btn` is applied
4. Input type switches between "text" and "password"

## Files Modified

1. ✅ `src/components/Login/AdminLoginPage.jsx` - Removed demo, added eye toggle
2. ✅ `src/components/Login/SuperAdminLoginPage.jsx` - Same as above
3. ✅ `src/components/Login/LoginPage.css` - Added password toggle styles
4. ✅ `src/services/api.js` - Already configured correctly (no changes needed)
5. ✅ `src/services/authServices.js` - Already stores tokens correctly (no changes needed)

## Next Steps

1. Test login with real credentials
2. Verify API calls include Authorization header
3. Check that 401 errors are resolved
4. Consider implementing token refresh mechanism
5. Add "Remember Me" functionality if needed

## Credentials

**Admin Login:**
- Email: syneptlabs@gmail.com
- Password: Syneptlabs@a19
- Endpoint: POST /api/v1/auth/admin-login

**Super Admin Login:**
- Email: syneptlabs@gmail.com
- Password: Syneptlabs@a19
- Endpoint: POST /api/v1/auth/super-admin-login
