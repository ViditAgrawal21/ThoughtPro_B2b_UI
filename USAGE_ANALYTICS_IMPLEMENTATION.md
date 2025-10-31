# Usage Analytics Implementation

## Overview
Complete implementation of usage analytics features for the ThoughtPro B2B platform, including employee usage tracking and admin analytics dashboard.

## Endpoints Implemented

### 1. POST /usage/daily
Submit daily application usage data.

**Request Body:**
```json
{
  "date": "2025-10-31",
  "apps": [
    {
      "appName": "Google Chrome",
      "usageTime": 120,
      "category": "Productivity"
    }
  ],
  "totalScreenTime": 480,
  "deviceInfo": {
    "deviceType": "laptop",
    "os": "macOS"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usage data submitted successfully",
  "usage": {
    "id": "uuid",
    "user_profile_id": "uuid",
    "company_id": "uuid",
    "app_name": "Google Chrome",
    "category": "Productivity",
    "usage_time_minutes": 120
  }
}
```

### 2. GET /usage/my-usage
Get current user's usage data with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 7)

**Response:**
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "pages": 1,
  "summary": {
    "totalScreenTime": 120,
    "averageScreenTime": 120,
    "averageProductivityScore": 85,
    "totalDays": 1
  },
  "usage": [
    {
      "id": "uuid",
      "user_profile_id": "uuid",
      "company_id": "uuid",
      "app_name": "Google Chrome",
      "category": "Productivity",
      "usage_time_minutes": 120
    }
  ]
}
```

### 3. GET /usage/company-analytics (Admin Only)
Get company-wide analytics.

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "dateRange": {
    "startDate": "2025-10-31",
    "endDate": "2025-10-31"
  },
  "companyStats": {
    "totalEmployees": 50,
    "totalScreenTime": 12000,
    "averageScreenTime": 240,
    "averageProductivityScore": 75,
    "totalRecords": 150
  },
  "topApps": [
    {
      "_id": "Google Chrome",
      "totalUsage": 12500,
      "totalUsers": 25,
      "category": "Productivity"
    }
  ],
  "departmentStats": [],
  "dailyTrends": []
}
```

### 4. GET /usage/company-trends (Admin Only)
Get company usage trends over time.

**Query Parameters:**
- `period` (optional): Time period ('7d', '30d', '90d')
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "dateRange": {
    "startDate": "2025-10-01",
    "endDate": "2025-10-31"
  },
  "dailyTrends": [
    {
      "date": "2025-10-31",
      "totalScreenTime": 1200,
      "userCount": 10,
      "appCount": 5
    }
  ]
}
```

### 5. GET /usage/app-leaderboard (Admin Only)
Get most used applications leaderboard.

**Query Parameters:**
- `limit` (optional): Number of apps (default: 20)
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "dateRange": {
    "startDate": "2025-10-01",
    "endDate": "2025-10-31"
  },
  "leaderboard": [
    {
      "_id": "Google Chrome",
      "totalUsage": 12500,
      "totalUsers": 25,
      "category": "Productivity",
      "averageUsage": 500
    }
  ]
}
```

## Service Layer

### usageAnalyticsService.js
Located at: `src/services/usageAnalyticsService.js`

**Key Methods:**

1. `submitDailyUsage(usageData)` - Submit daily usage data
2. `getMyUsage(page, limit)` - Get current user's usage
3. `getCompanyAnalytics(startDate, endDate)` - Get company analytics
4. `getCompanyTrends(period, startDate, endDate)` - Get company trends
5. `getAppLeaderboard(limit, startDate, endDate)` - Get app leaderboard

**Helper Methods:**
- `formatTime(minutes)` - Format minutes to "Xh Ym" format
- `getCategoryColor(category)` - Get color for category badges

## Components

### 1. AnalyticsDashboard (Admin)
**Location:** `src/components/Admin/AnalyticsDashboard.jsx`

**Features:**
- Overview tab with company statistics
- Top applications display
- Department statistics (if available)
- App leaderboard tab with rankings
- Trends tab for daily analytics
- Date range filtering
- Real-time data refresh
- Responsive design

**Key Features:**
- 📊 Company-wide statistics cards
- 🏆 Top 5 applications grid
- 📈 App leaderboard with rankings
- 📅 Date range picker
- 🔄 Manual refresh button
- Tab-based navigation

### 2. MyUsage (Employee)
**Location:** `src/components/Employee/MyUsage.jsx`

**Features:**
- Personal usage summary cards
- Paginated usage history
- App-wise breakdown
- Time formatting
- Category color coding
- Responsive design

**Key Features:**
- ⏱️ Total screen time
- 📊 Average screen time
- ⭐ Productivity score
- 📅 Days tracked
- Pagination support

### 3. SubmitUsage (Employee)
**Location:** `src/components/Employee/SubmitUsage.jsx`

**Features:**
- Form to submit daily usage
- Multiple app entries
- Dynamic app addition/removal
- Category selection
- Device information
- Auto-calculation of total screen time
- Form validation
- Success/error notifications

**Key Features:**
- 📝 Date selection (max: today)
- ➕ Add multiple apps dynamically
- ✕ Remove app entries
- 🎯 Category selection (9 categories)
- 💻 Device type selection
- ⚙️ OS input
- ✅ Auto-calculation of total screen time

## Categories Supported

1. **Productivity** - Office suites, project management tools
2. **Communication** - Email, chat, video conferencing
3. **Entertainment** - Media players, games
4. **Social Media** - Social networking platforms
5. **Development** - IDEs, coding tools
6. **Design** - Graphics, UI/UX tools
7. **Education** - Learning platforms, courses
8. **Finance** - Banking, accounting software
9. **Other** - Miscellaneous applications

## Styling

### Color Scheme
- **Primary**: #4CAF50 (Green)
- **Secondary**: #2196F3 (Blue)
- **Accent**: Gradient backgrounds for cards
- **Error**: #d32f2f (Red)
- **Success**: #2e7d32 (Green)

### Responsive Breakpoints
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px
- Small Mobile: < 480px

## Usage Examples

### For Admins

```jsx
import AnalyticsDashboard from './components/Admin/AnalyticsDashboard';

// In your admin route
<Route path="/admin/analytics" element={<AnalyticsDashboard />} />
```

### For Employees

```jsx
import MyUsage from './components/Employee/MyUsage';
import SubmitUsage from './components/Employee/SubmitUsage';

// In your employee routes
<Route path="/employee/my-usage" element={<MyUsage />} />
<Route path="/employee/submit-usage" element={<SubmitUsage />} />
```

### Direct Service Usage

```javascript
import { usageAnalyticsService } from './services/usageAnalyticsService';

// Submit usage
await usageAnalyticsService.submitDailyUsage({
  date: '2025-10-31',
  apps: [
    { appName: 'VS Code', usageTime: 180, category: 'Development' }
  ],
  totalScreenTime: 480,
  deviceInfo: { deviceType: 'laptop', os: 'Windows' }
});

// Get my usage
const myUsage = await usageAnalyticsService.getMyUsage(1, 7);

// Get company analytics (admin)
const analytics = await usageAnalyticsService.getCompanyAnalytics();

// Get leaderboard (admin)
const leaderboard = await usageAnalyticsService.getAppLeaderboard(20);
```

## Security & Authorization

- **Employee endpoints** (`/usage/my-usage`, `/usage/daily`): Require valid user token
- **Admin endpoints** (`/usage/company-analytics`, `/usage/company-trends`, `/usage/app-leaderboard`): Require admin role

All requests include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Error Handling

All components include:
- Loading states with spinners
- Error messages with retry buttons
- Form validation
- API error handling
- User-friendly error messages

## Features Implemented

✅ Submit daily usage data
✅ View personal usage statistics
✅ Paginated usage history
✅ Company-wide analytics dashboard
✅ App usage leaderboard
✅ Usage trends visualization
✅ Date range filtering
✅ Category-based organization
✅ Responsive design
✅ Loading & error states
✅ Form validation
✅ Success notifications

## Future Enhancements

### Potential Features:
1. 📊 Interactive charts (Chart.js/Recharts integration)
2. 📥 Export data to CSV/Excel
3. 🔔 Usage alerts and notifications
4. 📱 Mobile app integration
5. 🎯 Goal setting and tracking
6. 🏅 Achievement badges
7. 📧 Email reports
8. 🔍 Advanced filtering options
9. 📈 Predictive analytics
10. 👥 Team comparisons

### Chart Integration Example:
```javascript
// Install: npm install recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// In component
<LineChart data={trendsData}>
  <Line type="monotone" dataKey="totalScreenTime" stroke="#4CAF50" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
</LineChart>
```

## Testing

### Manual Testing Checklist:

**Employee Features:**
- [ ] Submit usage data with single app
- [ ] Submit usage with multiple apps
- [ ] View personal usage summary
- [ ] Navigate through paginated results
- [ ] Verify time formatting
- [ ] Test form validation
- [ ] Test date restrictions

**Admin Features:**
- [ ] View company analytics
- [ ] Filter by date range
- [ ] View app leaderboard
- [ ] Check trends data
- [ ] Test tab navigation
- [ ] Verify responsive design
- [ ] Test refresh functionality

## Files Created

1. **Service:**
   - `src/services/usageAnalyticsService.js`

2. **Admin Components:**
   - `src/components/Admin/AnalyticsDashboard.jsx`
   - `src/components/Admin/AnalyticsDashboard.css`

3. **Employee Components:**
   - `src/components/Employee/MyUsage.jsx`
   - `src/components/Employee/MyUsage.css`
   - `src/components/Employee/SubmitUsage.jsx`
   - `src/components/Employee/SubmitUsage.css`

4. **Documentation:**
   - `USAGE_ANALYTICS_IMPLEMENTATION.md` (this file)

## Integration Notes

1. Update your routing configuration to include the new components
2. Add navigation menu items for analytics pages
3. Ensure proper role-based access control
4. Configure API base URL in `configService`
5. Test with real JWT tokens for authentication

## Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify API endpoint availability
3. Confirm JWT token validity
4. Check network tab in browser DevTools
5. Review response data structure

---

**Last Updated:** October 31, 2025
**Version:** 1.0.0
**Status:** ✅ Complete & Ready for Production
