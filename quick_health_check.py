#!/usr/bin/env python3
"""
ThoughtPro B2B Quick API Health Check

A lightweight version for quick validation of critical endpoints.
"""

import requests
import json
import time
from datetime import datetime

class QuickHealthCheck:
    def __init__(self, api_url="https://thoughtprob2b.thoughthealer.org", ui_url="http://localhost:3000"):
        self.api_url = api_url.rstrip('/')
        self.ui_url = ui_url.rstrip('/')
        self.results = []
    
    def test_endpoint(self, method, endpoint, description):
        """Quick endpoint test"""
        try:
            url = f"{self.api_url}{endpoint}"
            start = time.time()
            
            if method.upper() == 'GET':
                response = requests.get(url, timeout=10)
            elif method.upper() == 'POST':
                response = requests.post(url, json={}, timeout=10)
            else:
                response = requests.request(method.upper(), url, timeout=10)
            
            duration = time.time() - start
            status = "✅ OK" if response.status_code in [200, 201, 400, 401] else "❌ FAIL"
            
            result = f"{status} {method:4} {endpoint:40} {description} ({response.status_code}) {duration:.2f}s"
            print(result)
            self.results.append(result)
            
        except Exception as e:
            result = f"❌ FAIL {method:4} {endpoint:40} {description} - {str(e)[:50]}"
            print(result)
            self.results.append(result)
    
    def test_ui_page(self, path, description):
        """Quick UI test"""
        try:
            url = f"{self.ui_url}{path}"
            start = time.time()
            response = requests.get(url, timeout=5)
            duration = time.time() - start
            
            status = "✅ OK" if response.status_code == 200 else "⚠️ WARN"
            result = f"{status} UI   {path:40} {description} ({response.status_code}) {duration:.2f}s"
            print(result)
            self.results.append(result)
            
        except Exception as e:
            result = f"❌ FAIL UI   {path:40} {description} - Connection failed"
            print(result)
            self.results.append(result)
    
    def run_quick_check(self):
        """Run essential endpoint checks"""
        print("🔬 ThoughtPro B2B Quick Health Check")
        print("=" * 60)
        print(f"API: {self.api_url}")
        print(f"UI:  {self.ui_url}")
        print("=" * 60)
        
        # Critical API endpoints
        print("\n🔧 API ENDPOINTS:")
        self.test_endpoint("POST", "/auth/supabase/login", "User Login")
        self.test_endpoint("GET", "/psychologists", "Get Psychologists")
        self.test_endpoint("POST", "/api/v1/companies-supabase", "Create Company")
        self.test_endpoint("GET", "/employee-subscriptions/status", "Health Check")
        self.test_endpoint("POST", "/bookings", "Create Booking")
        
        # UI pages
        print("\n🌐 UI PAGES:")
        self.test_ui_page("/", "Landing Page")
        self.test_ui_page("/login", "Login Page") 
        self.test_ui_page("/dashboard", "Dashboard")
        self.test_ui_page("/employees", "Employee Management")
        
        print(f"\n📊 SUMMARY: {len(self.results)} tests completed at {datetime.now().strftime('%H:%M:%S')}")
        
        # Count results
        ok_count = len([r for r in self.results if "✅ OK" in r])
        fail_count = len([r for r in self.results if "❌ FAIL" in r])
        warn_count = len([r for r in self.results if "⚠️ WARN" in r])
        
        print(f"✅ OK: {ok_count} | ❌ FAIL: {fail_count} | ⚠️ WARN: {warn_count}")
        
        if fail_count == 0:
            print("\n🎉 All critical endpoints are responding!")
        else:
            print(f"\n⚠️ {fail_count} endpoints need attention")

if __name__ == "__main__":
    checker = QuickHealthCheck()
    checker.run_quick_check()