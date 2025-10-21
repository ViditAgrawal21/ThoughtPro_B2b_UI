#!/usr/bin/env python3
"""
Simple Postman-like API Tester for ThoughtPro B2B Production Server
Tests each endpoint and shows results in a clean, readable format
"""

import requests
import json
import time
from datetime import datetime

def make_api_request(method, url, data=None, headers=None):
    """Make API request and return formatted result"""
    start_time = time.time()
    
    try:
        # Prepare headers
        default_headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'ThoughtPro-API-Tester/1.0'
        }
        if headers:
            default_headers.update(headers)
        
        # Make request
        if method.upper() == 'GET':
            response = requests.get(url, headers=default_headers, timeout=10)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, headers=default_headers, timeout=10)
        elif method.upper() == 'PUT':
            response = requests.put(url, json=data, headers=default_headers, timeout=10)
        elif method.upper() == 'PATCH':
            response = requests.patch(url, json=data, headers=default_headers, timeout=10)
        elif method.upper() == 'DELETE':
            response = requests.delete(url, headers=default_headers, timeout=10)
        
        duration = round((time.time() - start_time) * 1000, 2)
        
        # Try to parse JSON response
        try:
            response_json = response.json()
        except:
            response_json = response.text if response.text else None
        
        return {
            'success': 200 <= response.status_code < 300,
            'status_code': response.status_code,
            'duration_ms': duration,
            'response': response_json,
            'headers': dict(response.headers)
        }
        
    except requests.exceptions.Timeout:
        return {
            'success': False,
            'status_code': 'TIMEOUT',
            'duration_ms': round((time.time() - start_time) * 1000, 2),
            'response': 'Request timed out',
            'headers': {}
        }
    except Exception as e:
        return {
            'success': False,
            'status_code': 'ERROR',
            'duration_ms': round((time.time() - start_time) * 1000, 2),
            'response': str(e),
            'headers': {}
        }

def print_result(endpoint_name, method, url, result, request_data=None):
    """Print API result in Postman-like format"""
    status_emoji = "✅" if result['success'] else "❌"
    
    print(f"\n{status_emoji} {endpoint_name}")
    print(f"   {method.upper()} {url}")
    print(f"   Status: {result['status_code']} | Duration: {result['duration_ms']}ms")
    
    if request_data:
        print(f"   Request Body: {json.dumps(request_data, indent=2)}")
    
    if result['response']:
        if isinstance(result['response'], dict) or isinstance(result['response'], list):
            print(f"   Response: {json.dumps(result['response'], indent=2)}")
        else:
            print(f"   Response: {result['response']}")
    
    print("-" * 100)

def test_production_endpoints():
    """Test all production API endpoints like Postman"""
    
    BASE_URL = "https://thoughtprob2b.thoughthealer.org/api/v1"
    
    print("🔬 ThoughtPro B2B Production API Tester (Postman-like)")
    print(f"Testing: {BASE_URL}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 100)
    
    # Store test data for chaining requests
    test_data = {}
    auth_token = None
    
    # 1. AUTHENTICATION ENDPOINTS
    print("\n🔐 AUTHENTICATION ENDPOINTS")
    print("=" * 100)
    
    # Register User Profile
    register_data = {
        "email": f"test.api.{int(time.time())}@example.com",
        "name": "API Test User",
        "phone": "+1234567890",
        "role": "admin"
    }
    result = make_api_request('POST', f"{BASE_URL}/auth/supabase/register-profile", register_data)
    print_result("Register User Profile", "POST", "/auth/supabase/register-profile", result, register_data)
    
    if result['success']:
        test_data['user_email'] = register_data['email']
    
    # Create User Credentials
    if 'user_email' in test_data:
        credentials_data = {
            "email": test_data['user_email'],
            "password": "TestPassword123!",
            "confirmPassword": "TestPassword123!"
        }
        result = make_api_request('POST', f"{BASE_URL}/auth/supabase/create-credentials", credentials_data)
        print_result("Create User Credentials", "POST", "/auth/supabase/create-credentials", result, credentials_data)
    
    # User Login
    if 'user_email' in test_data:
        login_data = {
            "email": test_data['user_email'],
            "password": "TestPassword123!"
        }
        result = make_api_request('POST', f"{BASE_URL}/auth/supabase/login", login_data)
        print_result("User Login", "POST", "/auth/supabase/login", result, login_data)
        
        # Extract auth token if login successful
        if result['success'] and isinstance(result['response'], dict):
            token = (result['response'].get('token') or 
                    result['response'].get('data', {}).get('token'))
            if token:
                auth_token = token
                print(f"🔑 Auth token acquired: {token[:30]}...")
    
    # Get User Profile (with auth)
    headers = {'Authorization': f'Bearer {auth_token}'} if auth_token else None
    result = make_api_request('GET', f"{BASE_URL}/auth/supabase/profile", headers=headers)
    print_result("Get User Profile", "GET", "/auth/supabase/profile", result)
    
    # Login with Temporary Password
    temp_login_data = {
        "email": f"temp.{int(time.time())}@example.com",
        "tempPassword": "TempPass123"
    }
    result = make_api_request('POST', f"{BASE_URL}/auth/supabase/login-temp", temp_login_data)
    print_result("Login with Temporary Password", "POST", "/auth/supabase/login-temp", result, temp_login_data)
    
    # 2. COMPANY ENDPOINTS
    print("\n🏢 COMPANY ENDPOINTS")
    print("=" * 100)
    
    # Create Company
    company_data = {
        "name": f"API Test Company {int(time.time())}",
        "email": f"company.{int(time.time())}@example.com",
        "phone": "+1234567890",
        "address": "123 API Test Street",
        "plan_type": "premium"
    }
    result = make_api_request('POST', f"{BASE_URL}/companies-supabase", company_data)
    print_result("Create Company", "POST", "/companies-supabase", result, company_data)
    
    # Extract company ID
    company_id = "test-company-123"  # fallback
    if result['success'] and isinstance(result['response'], dict):
        company_id = (result['response'].get('company_id') or 
                     result['response'].get('data', {}).get('id') or 
                     result['response'].get('id') or 
                     company_id)
    
    # Create Employee
    employee_data = {
        "name": "API Test Employee",
        "email": f"employee.{int(time.time())}@company.com",
        "phone": "+1234567890",
        "department": "IT"
    }
    headers = {'Authorization': f'Bearer {auth_token}'} if auth_token else None
    result = make_api_request('POST', f"{BASE_URL}/companies/{company_id}/employees", employee_data, headers)
    print_result("Create Employee", "POST", f"/companies/{company_id}/employees", result, employee_data)
    
    # Get Company Employees
    result = make_api_request('GET', f"{BASE_URL}/companies/{company_id}/employees", headers=headers)
    print_result("Get Company Employees", "GET", f"/companies/{company_id}/employees", result)
    
    # Forgot Password
    forgot_password_data = {
        "personalEmail": f"forgot.{int(time.time())}@personal.com"
    }
    result = make_api_request('POST', f"{BASE_URL}/companies/forgot-password/personal-email", forgot_password_data)
    print_result("Company Forgot Password", "POST", "/companies/forgot-password/personal-email", result, forgot_password_data)
    
    # 3. PSYCHOLOGIST ENDPOINTS
    print("\n🧠 PSYCHOLOGIST ENDPOINTS")
    print("=" * 100)
    
    # Get All Psychologists
    result = make_api_request('GET', f"{BASE_URL}/psychologists")
    print_result("Get All Psychologists", "GET", "/psychologists", result)
    
    # Create Psychologist
    psychologist_data = {
        "name": f"Dr. API Test {int(time.time())}",
        "email": f"psychologist.{int(time.time())}@clinic.com",
        "phone": "+1234567890",
        "specialization": ["anxiety", "depression"],
        "experience_years": 8,
        "license_number": f"PSY{int(time.time())}",
        "consultation_fee": 200.00
    }
    headers = {'Authorization': f'Bearer {auth_token}'} if auth_token else None
    result = make_api_request('POST', f"{BASE_URL}/psychologists", psychologist_data, headers)
    print_result("Create Psychologist", "POST", "/psychologists", result, psychologist_data)
    
    # Search Psychologists
    result = make_api_request('GET', f"{BASE_URL}/psychologists/search?name=Test")
    print_result("Search Psychologists", "GET", "/psychologists/search?name=Test", result)
    
    # Get Psychologist by ID
    result = make_api_request('GET', f"{BASE_URL}/psychologists/test-psychologist-123")
    print_result("Get Psychologist by ID", "GET", "/psychologists/test-psychologist-123", result)
    
    # 4. BOOKING ENDPOINTS
    print("\n📅 BOOKING ENDPOINTS")
    print("=" * 100)
    
    # Get My Bookings
    headers = {'Authorization': f'Bearer {auth_token}'} if auth_token else None
    result = make_api_request('GET', f"{BASE_URL}/bookings/my-bookings", headers=headers)
    print_result("Get My Bookings", "GET", "/bookings/my-bookings", result)
    
    # Create Booking
    booking_data = {
        "psychologist_id": "test-psychologist-123",
        "employee_id": "test-employee-123",
        "session_date": "2025-10-25",
        "session_time": "14:00",
        "session_type": "individual"
    }
    result = make_api_request('POST', f"{BASE_URL}/bookings", booking_data, headers)
    print_result("Create Booking", "POST", "/bookings", result, booking_data)
    
    # 5. EMPLOYEE SUBSCRIPTION ENDPOINTS
    print("\n💳 EMPLOYEE SUBSCRIPTION ENDPOINTS")
    print("=" * 100)
    
    # Verify Google Play Purchase
    purchase_data = {
        "purchaseToken": f"test_token_{int(time.time())}",
        "productId": "premium_subscription",
        "employeeId": "test-employee-123"
    }
    result = make_api_request('POST', f"{BASE_URL}/employee-subscriptions/verify/purchase", purchase_data)
    print_result("Verify Google Play Purchase", "POST", "/employee-subscriptions/verify/purchase", result, purchase_data)
    
    # Get Subscription Status
    result = make_api_request('GET', f"{BASE_URL}/employee-subscriptions/status")
    print_result("Get Subscription Status", "GET", "/employee-subscriptions/status", result)
    
    # 6. AVAILABILITY ENDPOINTS
    print("\n📋 AVAILABILITY ENDPOINTS")
    print("=" * 100)
    
    # Create Availability
    availability_data = {
        "psychologist_id": "test-psychologist-123",
        "date": "2025-10-25",
        "start_time": "09:00",
        "end_time": "10:00",
        "is_available": True
    }
    headers = {'Authorization': f'Bearer {auth_token}'} if auth_token else None
    result = make_api_request('POST', f"{BASE_URL}/availability", availability_data, headers)
    print_result("Create Availability", "POST", "/availability", result, availability_data)
    
    # Get Holidays
    result = make_api_request('GET', f"{BASE_URL}/holidays", headers=headers)
    print_result("Get All Holidays", "GET", "/holidays", result)
    
    # Add Holiday
    holiday_data = {
        "name": f"API Test Holiday {int(time.time())}",
        "date": "2025-12-31",
        "description": "Test holiday via API"
    }
    result = make_api_request('POST', f"{BASE_URL}/holidays", holiday_data, headers)
    print_result("Add Holiday", "POST", "/holidays", result, holiday_data)
    
    # 7. HEALTH CHECK ENDPOINTS
    print("\n❤️ HEALTH CHECK ENDPOINTS")
    print("=" * 100)
    
    # Employee Subscription Status
    result = make_api_request('GET', f"{BASE_URL}/employee-subscriptions/status")
    print_result("Employee Subscription Service Status", "GET", "/employee-subscriptions/status", result)
    
    # API Health Check
    result = make_api_request('GET', f"{BASE_URL}/health")
    print_result("API Health Check", "GET", "/health", result)
    
    print(f"\n✅ API Testing Completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 100)

if __name__ == "__main__":
    test_production_endpoints()