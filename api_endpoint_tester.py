#!/usr/bin/env python3
"""
ThoughtPro B2B Production API Endpoint Tester
Similar to Postman - tests each API endpoint and fetches results
"""

import requests
import json
import time
from datetime import datetime
import sys
import os
from urllib.parse import urljoin

class ProductionAPITester:
    def __init__(self, base_url="https://thoughtprob2b.thoughthealer.org/api/v1"):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.auth_token = None
        self.test_data = {}
        self.results = []
        
        # Set up session headers
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'ThoughtPro-API-Tester/1.0',
            'Accept': 'application/json'
        })

    def log_result(self, method, endpoint, status_code, response_data, duration, error=None):
        """Log the API test result"""
        result = {
            'timestamp': datetime.now().isoformat(),
            'method': method,
            'endpoint': endpoint,
            'full_url': f"{self.base_url}{endpoint}",
            'status_code': status_code,
            'duration_ms': round(duration * 1000, 2),
            'success': 200 <= status_code < 300,
            'response_data': response_data,
            'error': error
        }
        self.results.append(result)
        
        # Console output
        status_emoji = "✅" if result['success'] else "❌"
        print(f"{status_emoji} {method} {endpoint}")
        print(f"   Status: {status_code} | Duration: {result['duration_ms']}ms")
        if result['success']:
            print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
        else:
            print(f"   Error: {error or 'Request failed'}")
        print("-" * 80)
        
        return result

    def make_request(self, method, endpoint, data=None, headers=None, auth_required=False):
        """Make HTTP request to API endpoint"""
        url = f"{self.base_url}{endpoint}"
        
        # Prepare headers
        request_headers = self.session.headers.copy()
        if headers:
            request_headers.update(headers)
        
        # Add auth token if available and required
        if self.auth_token and (auth_required or 'Authorization' not in request_headers):
            request_headers['Authorization'] = f'Bearer {self.auth_token}'
        
        try:
            start_time = time.time()
            
            if method.upper() == 'GET':
                response = self.session.get(url, headers=request_headers, timeout=30)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, headers=request_headers, timeout=30)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, headers=request_headers, timeout=30)
            elif method.upper() == 'PATCH':
                response = self.session.patch(url, json=data, headers=request_headers, timeout=30)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=request_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            duration = time.time() - start_time
            
            # Try to parse JSON response
            try:
                response_data = response.json()
            except:
                response_data = response.text[:500] if response.text else None
            
            return self.log_result(method, endpoint, response.status_code, response_data, duration)
            
        except requests.exceptions.Timeout:
            duration = time.time() - start_time
            return self.log_result(method, endpoint, 408, None, duration, "Request timeout")
        except requests.exceptions.ConnectionError:
            duration = time.time() - start_time
            return self.log_result(method, endpoint, 0, None, duration, "Connection error")
        except Exception as e:
            duration = time.time() - start_time
            return self.log_result(method, endpoint, 0, None, duration, str(e))

    def test_authentication_endpoints(self):
        """Test all authentication related endpoints"""
        print("\n🔐 TESTING AUTHENTICATION ENDPOINTS")
        print("=" * 80)
        
        # 1. Register User Profile
        register_data = {
            "email": f"test.user.{int(time.time())}@example.com",
            "name": "Test User",
            "phone": "+1234567890",
            "role": "admin"
        }
        result = self.make_request('POST', '/auth/supabase/register-profile', register_data)
        if result['success']:
            self.test_data['user_email'] = register_data['email']
        
        # 2. Create User Credentials
        if 'user_email' in self.test_data:
            credentials_data = {
                "email": self.test_data['user_email'],
                "password": "SecurePassword123!",
                "confirmPassword": "SecurePassword123!"
            }
            self.make_request('POST', '/auth/supabase/create-credentials', credentials_data)
        
        # 3. User Login
        if 'user_email' in self.test_data:
            login_data = {
                "email": self.test_data['user_email'],
                "password": "SecurePassword123!"
            }
            result = self.make_request('POST', '/auth/supabase/login', login_data)
            if result['success'] and result['response_data']:
                # Extract token from response
                token = None
                if isinstance(result['response_data'], dict):
                    token = (result['response_data'].get('token') or 
                            result['response_data'].get('data', {}).get('token'))
                if token:
                    self.auth_token = token
                    print(f"🔑 Auth token acquired: {token[:20]}...")
        
        # 4. Get User Profile (requires auth)
        self.make_request('GET', '/auth/supabase/profile', auth_required=True)
        
        # 5. Create Employee with Temp Password
        temp_employee_data = {
            "email": f"temp.employee.{int(time.time())}@company.com",
            "name": "Temp Employee",
            "company_id": "test-company-123"
        }
        self.make_request('POST', '/auth/supabase/create-employee-temp', temp_employee_data)
        
        # 6. Login with Temporary Password
        temp_login_data = {
            "email": f"temp.employee.{int(time.time())}@company.com",
            "tempPassword": "TempPass123"
        }
        self.make_request('POST', '/auth/supabase/login-temp', temp_login_data)
        
        # 7. Update Temporary Password
        update_password_data = {
            "newPassword": "NewSecurePassword123!",
            "confirmPassword": "NewSecurePassword123!"
        }
        self.make_request('PUT', '/auth/supabase/update-temp-password', update_password_data, auth_required=True)

    def test_company_endpoints(self):
        """Test all company management endpoints"""
        print("\n🏢 TESTING COMPANY ENDPOINTS")
        print("=" * 80)
        
        # 1. Create Company with Supabase
        company_data = {
            "name": f"Test Company {int(time.time())}",
            "email": f"company.{int(time.time())}@example.com",
            "phone": "+1234567890",
            "address": "123 Test Street, Test City",
            "plan_type": "basic",
            "contact_person": "John Doe"
        }
        result = self.make_request('POST', '/companies-supabase', company_data)
        if result['success'] and result['response_data']:
            # Extract company ID from response
            if isinstance(result['response_data'], dict):
                company_id = (result['response_data'].get('company_id') or 
                            result['response_data'].get('data', {}).get('id') or 
                            result['response_data'].get('id'))
                if company_id:
                    self.test_data['company_id'] = company_id
        
        # Use test company ID if creation failed
        if 'company_id' not in self.test_data:
            self.test_data['company_id'] = 'test-company-123'
        
        company_id = self.test_data['company_id']
        
        # 2. Create Employee with Email
        employee_data = {
            "name": "Test Employee",
            "email": f"employee.{int(time.time())}@company.com",
            "phone": "+1234567890",
            "department": "IT"
        }
        result = self.make_request('POST', f'/companies/{company_id}/employees', employee_data, auth_required=True)
        if result['success']:
            self.test_data['employee_id'] = f"employee-{int(time.time())}"
        
        # 3. Get Company Employees
        self.make_request('GET', f'/companies/{company_id}/employees', auth_required=True)
        
        # 4. Resend Employee Credentials
        employee_id = self.test_data.get('employee_id', 'test-employee-123')
        self.make_request('POST', f'/companies/{company_id}/employees/{employee_id}/resend-credentials', auth_required=True)
        
        # 5. Bulk Create Employees
        bulk_employees_data = {
            "employees": [
                {
                    "name": "Bulk Employee 1",
                    "email": f"bulk1.{int(time.time())}@company.com",
                    "department": "HR"
                },
                {
                    "name": "Bulk Employee 2", 
                    "email": f"bulk2.{int(time.time())}@company.com",
                    "department": "Finance"
                }
            ]
        }
        self.make_request('POST', f'/companies/{company_id}/employees/bulk', bulk_employees_data, auth_required=True)
        
        # 6. Send Password Reset Link
        reset_data = {
            "personalEmail": f"reset.{int(time.time())}@personal.com"
        }
        self.make_request('POST', '/companies/forgot-password/personal-email', reset_data)
        
        # 7. Get Company Subscription Config
        self.make_request('GET', f'/companies-supabase/{company_id}/subscription-config', auth_required=True)
        
        # 8. Update Company Subscription Config
        subscription_config = {
            "max_employees": 100,
            "features": ["basic_analytics", "employee_management"],
            "billing_cycle": "monthly"
        }
        self.make_request('PUT', f'/companies-supabase/{company_id}/subscription-config', subscription_config, auth_required=True)
        
        # 9. Get Employees with Credential Status
        self.make_request('GET', f'/auth/supabase/company/{company_id}/employees-status', auth_required=True)

    def test_psychologist_endpoints(self):
        """Test all psychologist management endpoints"""
        print("\n🧠 TESTING PSYCHOLOGIST ENDPOINTS")
        print("=" * 80)
        
        # 1. Get All Psychologists
        self.make_request('GET', '/psychologists')
        
        # 2. Create Psychologist Profile
        psychologist_data = {
            "name": f"Dr. Test Psychologist {int(time.time())}",
            "email": f"psychologist.{int(time.time())}@clinic.com",
            "phone": "+1234567890",
            "specialization": ["anxiety", "depression", "stress_management"],
            "experience_years": 5,
            "license_number": f"PSY{int(time.time())}",
            "bio": "Experienced psychologist specializing in cognitive behavioral therapy",
            "consultation_fee": 150.00,
            "availability": {
                "monday": {"start": "09:00", "end": "17:00"},
                "tuesday": {"start": "09:00", "end": "17:00"},
                "wednesday": {"start": "09:00", "end": "17:00"}
            }
        }
        result = self.make_request('POST', '/psychologists', psychologist_data, auth_required=True)
        if result['success'] and result['response_data']:
            if isinstance(result['response_data'], dict):
                psych_id = (result['response_data'].get('psychologist_id') or 
                          result['response_data'].get('data', {}).get('id') or 
                          result['response_data'].get('id'))
                if psych_id:
                    self.test_data['psychologist_id'] = psych_id
        
        # 3. Search Psychologists by Name
        search_params = {"name": "Test"}
        self.make_request('GET', '/psychologists/search', search_params)
        
        # 4. Get Psychologist by ID
        psych_id = self.test_data.get('psychologist_id', 'test-psychologist-123')
        self.make_request('GET', f'/psychologists/{psych_id}')

    def test_booking_endpoints(self):
        """Test all booking related endpoints"""
        print("\n📅 TESTING BOOKING ENDPOINTS")
        print("=" * 80)
        
        # 1. Get My Bookings
        self.make_request('GET', '/bookings/my-bookings', auth_required=True)
        
        # 2. Get Psychologist's Bookings
        self.make_request('GET', '/bookings/psychologist-bookings', auth_required=True)
        
        # 3. Create New Booking
        booking_data = {
            "psychologist_id": self.test_data.get('psychologist_id', 'test-psychologist-123'),
            "employee_id": self.test_data.get('employee_id', 'test-employee-123'),
            "session_date": "2025-10-25",
            "session_time": "14:00",
            "session_type": "individual",
            "notes": "Initial consultation for stress management"
        }
        self.make_request('POST', '/bookings', booking_data, auth_required=True)

    def test_employee_subscription_endpoints(self):
        """Test employee subscription related endpoints"""
        print("\n💳 TESTING EMPLOYEE SUBSCRIPTION ENDPOINTS")
        print("=" * 80)
        
        # 1. Verify Google Play Purchase
        purchase_data = {
            "purchaseToken": f"test_purchase_token_{int(time.time())}",
            "productId": "premium_subscription",
            "employeeId": self.test_data.get('employee_id', 'test-employee-123')
        }
        self.make_request('POST', '/employee-subscriptions/verify/purchase', purchase_data)
        
        # 2. Verify Google Play Subscription
        subscription_data = {
            "subscriptionId": f"test_subscription_{int(time.time())}",
            "purchaseToken": f"test_sub_token_{int(time.time())}",
            "employeeId": self.test_data.get('employee_id', 'test-employee-123')
        }
        self.make_request('POST', '/employee-subscriptions/verify/subscription', subscription_data)
        
        # 3. Get Active Subscriptions
        self.make_request('GET', '/employee-subscriptions/active', auth_required=True)
        
        # 4. Check Subscription Status
        self.make_request('GET', '/employee-subscriptions/status')

    def test_availability_endpoints(self):
        """Test availability and holiday management endpoints"""
        print("\n📋 TESTING AVAILABILITY & HOLIDAY ENDPOINTS")
        print("=" * 80)
        
        # 1. Create Availability Slot
        availability_data = {
            "psychologist_id": self.test_data.get('psychologist_id', 'test-psychologist-123'),
            "date": "2025-10-25",
            "start_time": "09:00",
            "end_time": "10:00",
            "is_available": True
        }
        result = self.make_request('POST', '/availability', availability_data, auth_required=True)
        if result['success'] and result['response_data']:
            if isinstance(result['response_data'], dict):
                avail_id = (result['response_data'].get('availability_id') or 
                          result['response_data'].get('data', {}).get('id') or 
                          result['response_data'].get('id'))
                if avail_id:
                    self.test_data['availability_id'] = avail_id
        
        # 2. Get Availability by Psychologist ID
        psych_id = self.test_data.get('psychologist_id', 'test-psychologist-123')
        self.make_request('GET', f'/availability/{psych_id}', auth_required=True)
        
        # 3. Update Availability Status
        avail_id = self.test_data.get('availability_id', 'test-availability-123')
        update_data = {"is_available": False}
        self.make_request('PATCH', f'/availability/{avail_id}', update_data, auth_required=True)
        
        # 4. Delete Availability Slot
        self.make_request('DELETE', f'/availability/{avail_id}', auth_required=True)
        
        # 5. Populate N Days Availability
        populate_data = {
            "psychologist_id": self.test_data.get('psychologist_id', 'test-psychologist-123'),
            "start_date": "2025-10-21",
            "number_of_days": 7,
            "daily_slots": [
                {"start_time": "09:00", "end_time": "10:00"},
                {"start_time": "14:00", "end_time": "15:00"}
            ]
        }
        self.make_request('POST', '/availability/populate-n-days', populate_data, auth_required=True)
        
        # 6. Toggle Day Availability
        toggle_data = {
            "psychologist_id": self.test_data.get('psychologist_id', 'test-psychologist-123'),
            "date": "2025-10-25",
            "is_available": False
        }
        self.make_request('PATCH', '/availability/toggle-day', toggle_data, auth_required=True)
        
        # 7. Get All Holidays
        self.make_request('GET', '/holidays', auth_required=True)
        
        # 8. Add Holiday
        holiday_data = {
            "name": f"Test Holiday {int(time.time())}",
            "date": "2025-12-25",
            "description": "Test holiday for API testing"
        }
        result = self.make_request('POST', '/holidays', holiday_data, auth_required=True)
        if result['success'] and result['response_data']:
            if isinstance(result['response_data'], dict):
                holiday_id = (result['response_data'].get('holiday_id') or 
                            result['response_data'].get('data', {}).get('id') or 
                            result['response_data'].get('id'))
                if holiday_id:
                    self.test_data['holiday_id'] = holiday_id
        
        # 9. Delete Holiday
        holiday_id = self.test_data.get('holiday_id', 'test-holiday-123')
        self.make_request('DELETE', f'/holidays/{holiday_id}', auth_required=True)

    def test_health_check_endpoints(self):
        """Test system health and status endpoints"""
        print("\n❤️ TESTING HEALTH CHECK ENDPOINTS")
        print("=" * 80)
        
        # 1. Employee Subscription Service Status
        self.make_request('GET', '/employee-subscriptions/status')
        
        # 2. General API Health Check (if exists)
        self.make_request('GET', '/health')
        
        # 3. System Status (if exists)
        self.make_request('GET', '/status')

    def run_all_tests(self):
        """Run all API endpoint tests"""
        print(f"🚀 STARTING PRODUCTION API TESTS")
        print(f"Base URL: {self.base_url}")
        print(f"Started at: {datetime.now().isoformat()}")
        print("=" * 80)
        
        try:
            self.test_authentication_endpoints()
            self.test_company_endpoints()
            self.test_psychologist_endpoints()
            self.test_booking_endpoints()
            self.test_employee_subscription_endpoints()
            self.test_availability_endpoints()
            self.test_health_check_endpoints()
        except KeyboardInterrupt:
            print("\n⚠️  Tests interrupted by user")
        except Exception as e:
            print(f"\n❌ Unexpected error during testing: {str(e)}")
        
        # Generate summary report
        self.generate_report()

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n📊 GENERATING TEST REPORT")
        print("=" * 80)
        
        total_tests = len(self.results)
        successful_tests = sum(1 for r in self.results if r['success'])
        failed_tests = total_tests - successful_tests
        
        success_rate = (successful_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"📈 SUMMARY STATISTICS:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Successful: {successful_tests} ({success_rate:.1f}%)")
        print(f"   Failed: {failed_tests} ({100-success_rate:.1f}%)")
        print(f"   Base URL: {self.base_url}")
        print(f"   Test Duration: {datetime.now().isoformat()}")
        
        # Save detailed report to file
        report_filename = f"api_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        report_data = {
            'summary': {
                'total_tests': total_tests,
                'successful_tests': successful_tests,
                'failed_tests': failed_tests,
                'success_rate': success_rate,
                'base_url': self.base_url,
                'test_timestamp': datetime.now().isoformat()
            },
            'test_data_used': self.test_data,
            'detailed_results': self.results
        }
        
        try:
            with open(report_filename, 'w', encoding='utf-8') as f:
                json.dump(report_data, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Detailed report saved to: {report_filename}")
        except Exception as e:
            print(f"\n❌ Failed to save report: {str(e)}")
        
        # Print failed tests summary
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS SUMMARY:")
            for result in self.results:
                if not result['success']:
                    print(f"   {result['method']} {result['endpoint']} - {result['status_code']} - {result['error']}")

def main():
    """Main execution function"""
    print("🔬 ThoughtPro B2B Production API Endpoint Tester")
    print("Similar to Postman - Tests each API endpoint systematically")
    print("=" * 80)
    
    # Get base URL from user or use default
    base_url = input("Enter API Base URL (default: https://thoughtprob2b.thoughthealer.org/api/v1): ").strip()
    if not base_url:
        base_url = "https://thoughtprob2b.thoughthealer.org/api/v1"
    
    # Initialize and run tests
    tester = ProductionAPITester(base_url)
    
    print(f"\n🎯 Testing Production API: {base_url}")
    print("⏳ Starting comprehensive endpoint tests...")
    
    tester.run_all_tests()
    
    print("\n✅ Production API testing completed!")
    print("📄 Check the generated JSON report for detailed results")

if __name__ == "__main__":
    main()