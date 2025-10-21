# ThoughtPro B2B API & UI Integration Test Suite

Automated testing scripts to validate API endpoint connectivity and UI integration according to the ThoughtPro B2B API documentation.

## 📁 Files Overview

### Test Scripts
- `test_api_ui_integration.py` - Comprehensive test suite for all API endpoints and UI pages
- `quick_health_check.py` - Lightweight script for rapid validation of critical endpoints
- `requirements.txt` - Python dependencies for the test suite

### Batch Scripts (Windows)
- `run_full_tests.bat` - Execute comprehensive test suite with automatic dependency installation
- `run_quick_check.bat` - Execute quick health check with minimal setup

### Output Files (Generated)
- `api_ui_test_report.txt` - Detailed test results and recommendations
- `api_test_results.log` - Execution logs and debugging information

## 🚀 Quick Start

### Option 1: Quick Health Check (Recommended for first-time users)
```batch
# Double-click or run from command prompt
run_quick_check.bat
```

### Option 2: Comprehensive Test Suite
```batch
# Double-click or run from command prompt  
run_full_tests.bat
```

### Option 3: Manual Python Execution
```bash
# Install dependencies
pip install -r requirements.txt

# Run comprehensive tests
python test_api_ui_integration.py

# Or run quick check
python quick_health_check.py
```

## 📋 What Gets Tested

### 🔐 Authentication Endpoints (7 endpoints)
- User registration and profile creation
- Login with email/password and temporary passwords
- User profile retrieval
- Employee creation with temporary credentials
- Password management and updates

### 🏢 Company Management (8 endpoints)
- Company creation and configuration
- Employee management (create, bulk create, get list)
- Subscription configuration management
- Password reset functionality
- Employee credential management

### 👩‍⚕️ Psychologist Management (4 endpoints)
- Psychologist profile creation and retrieval
- Search functionality
- Profile management

### 📅 Booking Management (3 endpoints)
- Booking creation and retrieval
- User bookings and psychologist schedules
- Session management

### 💳 Employee Subscriptions (4 endpoints)
- Google Play purchase verification
- Subscription status checking
- Active subscription management

### 🕐 Availability & Holidays (9 endpoints)
- Availability slot management
- Bulk availability creation
- Holiday management
- Day-level availability toggling

### ❤️ Health Check (1 endpoint)
- System status verification

### 👥 Employee Management (1 endpoint)
- Employee credential status tracking

### 🌐 UI Integration Tests
- Landing page accessibility
- Login page functionality
- Dashboard loading
- Employee management interface
- Key navigation routes

## 📊 Test Results Interpretation

### Status Indicators
- ✅ **PASS** - Endpoint working correctly
- ❌ **FAIL** - Endpoint not responding or returning errors
- ⚠️ **WARNING** - Endpoint responding but may need attention (404, auth issues)
- ⏭️ **SKIP** - Test skipped (usually due to missing authentication)

### Common Results
- **HTTP 200/201** - Success responses
- **HTTP 401** - Authentication required (expected for protected endpoints)
- **HTTP 404** - Endpoint not found (may not be implemented yet)
- **Connection Error** - Server not running or unreachable

## 🔧 Configuration

### Default URLs
- **API**: `https://thoughtprob2b.thoughthealer.org`
- **UI**: `http://localhost:3000` (React development server)

### Custom Configuration
When running the comprehensive test suite, you'll be prompted to enter custom URLs if needed.

## 📝 Prerequisites

### For API Testing
- API server running and accessible
- Internet connection for external API testing

### For UI Testing
- React development server running (`npm start`)
- Node.js application accessible on localhost:3000

### System Requirements
- Python 3.7 or higher
- `requests` library (auto-installed by batch scripts)

## 🔍 Troubleshooting

### Common Issues

#### "Python is not installed"
- Install Python from https://python.org
- Ensure Python is added to system PATH

#### "Connection failed" errors
- Verify API server is running and accessible
- Check network connectivity
- Confirm URLs are correct

#### UI tests failing
- Ensure React development server is running (`npm start`)
- Check if UI is accessible at http://localhost:3000
- Verify no firewall blocking localhost connections

#### Authentication-related skips
- Expected for protected endpoints without valid tokens
- The test suite handles this gracefully
- Real authentication would require valid login credentials

## 📖 Understanding the Report

### Summary Statistics
- Total number of endpoints tested
- Pass/Fail/Warning/Skip counts and percentages
- Test execution time and timestamps

### Detailed Results
Organized by category with individual endpoint results:
- Status indicator and timing
- HTTP method and endpoint path
- Authentication requirements (🔒/🔓)
- Error messages for failed tests

### Recommendations
- Actionable items for fixing failed endpoints
- Suggestions for improving test coverage
- Deployment readiness assessment

## 🎯 Use Cases

### Development Validation
- Verify API endpoints are implemented correctly
- Test UI integration after code changes
- Validate authentication flows

### Deployment Readiness
- Ensure all critical endpoints are operational
- Verify UI builds and serves correctly
- Check system health before production

### Debugging Support
- Identify specific failing endpoints
- Get detailed error messages and timing information
- Generate logs for development team analysis

### Continuous Integration
- Integrate into CI/CD pipeline
- Automated testing after deployments
- Regular health monitoring

## 🔄 Regular Usage

### Daily Development
```bash
# Quick validation during development
run_quick_check.bat
```

### Pre-deployment Testing
```bash
# Comprehensive validation before releases
run_full_tests.bat
```

### Automated Monitoring
Set up scheduled execution for continuous monitoring of production systems.

---

## 📞 Support

If you encounter issues with the test suite:

1. Check the generated log files for detailed error information
2. Verify your Python installation and network connectivity
3. Ensure both API and UI servers are running
4. Review the troubleshooting section above

The test suite is designed to be robust and provide clear feedback about system status and any issues discovered during testing.