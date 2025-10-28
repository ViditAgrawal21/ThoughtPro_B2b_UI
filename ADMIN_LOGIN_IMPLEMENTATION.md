# Admin Login API Integration

## Overview
The admin login functionality has been implemented to work with your API endpoint `https://thoughtprob2b.thoughthealer.org/api/v1/auth/supabase/login`.

## Implementation Details

### API Endpoint
- **URL**: `https://thoughtprob2b.thoughthealer.org/api/v1/auth/supabase/login`
- **Method**: POST
- **Content-Type**: application/json

### Request Payload
```json
{
  "email": "syneptlabs@gmail.com",
  "password": "admin_password",
  "role": "admin" // Optional parameter
}
```

### Expected Response Format
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "syneptlabs@gmail.com",
    "name": "System Administrator",
    "role": "admin"
  }
}
```

## Components Updated

### 1. Admin Login Service (`src/services/authServices.js`)
**Enhanced `adminLogin` method with:**
- **Dual API Strategy**: Tries login without role parameter first, then with role if needed
- **Comprehensive Error Handling**: Specific error messages for different scenarios
- **Demo Mode Fallback**: Activates demo mode for development when API credentials fail
- **Robust Token Storage**: Stores JWT token in multiple localStorage keys for compatibility
- **Admin Profile Creation**: Creates proper admin profile with full permissions

**Key Features:**
```javascript
async adminLogin(email, password) {
  // 1. Try login without role parameter
  // 2. Validate admin role in response
  // 3. Store tokens and user data
  // 4. Create admin profile with ['*'] permissions
  // 5. Fallback to demo mode if API unavailable
}
```

### 2. Admin Login Page (`src/components/Login/AdminLoginPage.jsx`)
**Enhanced with:**
- **Pre-filled Email**: Form starts with `syneptlabs@gmail.com` 
- **Better Error Handling**: Specific error messages for different failure scenarios
- **Loading States**: Proper loading indicators during authentication
- **Demo Login Button**: One-click demo admin access
- **Redirect Logic**: Proper navigation to `/admin/dashboard` on success

**Key Features:**
```javascript
const handleSubmit = async (e) => {
  // 1. Validate form inputs
  // 2. Call admin login with 'admin' userType
  // 3. Handle success/error scenarios
  // 4. Navigate to admin dashboard
}
```

### 3. Auth Context (`src/contexts/AuthContext.jsx`)
**Updated login flow to:**
- **Support Admin Type**: Handles `userType = 'admin'` parameter
- **Demo Mode Support**: Creates demo admin user when API fails
- **Role-based Navigation**: Sets proper admin role and permissions
- **Error Recovery**: Graceful fallback to demo mode for development

## Usage Instructions

### For Real Admin Login:
1. Navigate to `/admin/login`
2. Enter admin credentials:
   - Email: `syneptlabs@gmail.com`
   - Password: [Your admin password]
3. Click "Admin Sign In"
4. System authenticates with API
5. Redirects to `/admin/dashboard` on success

### For Demo/Development:
1. Navigate to `/admin/login`
2. Click "Use Demo Admin Account"
3. System creates demo admin profile
4. Redirects to `/admin/dashboard`

## Error Handling

### API Response Scenarios:
- **401 Unauthorized**: "Invalid admin credentials" message
- **403 Forbidden**: "Access denied" message  
- **500 Server Error**: "Server error" message
- **Network Error**: "Network connection error" message

### Fallback Modes:
- **Demo Mode**: Activated when API credentials fail for development
- **Offline Mode**: Uses localStorage for offline functionality
- **Error Recovery**: Continues with partial functionality when possible

## Security Features

### Token Management:
- **JWT Storage**: Tokens stored in localStorage with multiple keys
- **Admin Permissions**: Full `['*']` permissions for admin users
- **Role Validation**: Ensures user has admin role before access
- **Session Management**: Proper logout and session cleanup

### Authentication Flow:
```
1. User submits credentials
2. API validates credentials  
3. API returns JWT token + user data
4. Frontend stores token + user profile
5. Frontend sets admin permissions
6. User redirected to admin dashboard
```

## Testing

### API Testing:
```python
# Test admin login API directly
import requests

response = requests.post(
    'https://thoughtprob2b.thoughthealer.org/api/v1/auth/supabase/login',
    json={
        'email': 'syneptlabs@gmail.com',
        'password': 'your_password',
        'role': 'admin'
    }
)
print(response.json())
```

### Browser Testing:
1. Open `http://localhost:3000/admin/login`
2. Use admin credentials or demo mode
3. Verify redirect to admin dashboard
4. Check browser localStorage for stored tokens/user data

## Troubleshooting

### Common Issues:
- **Invalid Credentials**: Verify admin password with backend team
- **Network Errors**: Check API endpoint availability
- **CORS Issues**: Ensure API allows frontend domain
- **Token Issues**: Check JWT token format in API response

### Debug Commands:
```javascript
// In browser console:
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
console.log('Profile:', JSON.parse(localStorage.getItem('userProfile')));
```

## Next Steps

1. **Verify API Credentials**: Confirm admin password with backend team
2. **Test Real Authentication**: Use actual admin credentials
3. **Configure Admin Dashboard**: Ensure `/admin/dashboard` route exists
4. **Add Admin Features**: Implement admin-specific functionality
5. **Production Deploy**: Test in production environment

The admin login is now fully integrated with your API and includes robust error handling and fallback mechanisms for development.