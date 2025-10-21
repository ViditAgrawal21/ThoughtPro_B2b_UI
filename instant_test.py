#!/usr/bin/env python3
"""
Instant API Test - Run this immediately to test your implementation

No dependencies required except Python standard library and requests
"""

import json
try:
    import requests
except ImportError:
    print("❌ Please install requests: pip install requests")
    exit(1)

def test_now():
    """Run immediate tests on critical endpoints"""
    
    API_URL = "https://thoughtprob2b.thoughthealer.org"
    UI_URL = "http://localhost:3000"
    
    print("🔬 ThoughtPro B2B - INSTANT API TEST")
    print("=" * 50)
    
    # Test critical API endpoints
    tests = [
        ("GET", "/psychologists", "Get Psychologists List"),
        ("GET", "/employee-subscriptions/status", "Health Check"),
        ("POST", "/auth/supabase/login", "Login Endpoint"),
        ("POST", "/api/v1/companies-supabase", "Create Company"),
        ("GET", "/api/v1/holidays", "Get Holidays"),
    ]
    
    results = []
    
    for method, endpoint, description in tests:
        try:
            url = f"{API_URL}{endpoint}"
            if method == "GET":
                response = requests.get(url, timeout=5)
            else:
                response = requests.post(url, json={}, timeout=5)
            
            if response.status_code in [200, 201]:
                status = "✅ OK"
            elif response.status_code in [400, 401, 422]:
                status = "⚠️ RESPOND"  # Responding but expecting different input
            else:
                status = "❌ ERROR"
                
            result = f"{status} {method:4} {endpoint:35} {description}"
            print(result)
            results.append((status, method, endpoint, description, response.status_code))
            
        except Exception as e:
            result = f"❌ FAIL {method:4} {endpoint:35} {description} - {str(e)[:30]}"
            print(result)
            results.append(("❌ FAIL", method, endpoint, description, 0))
    
    # Test UI
    print(f"\n🌐 UI TEST ({UI_URL}):")
    try:
        response = requests.get(UI_URL, timeout=3)
        if response.status_code == 200:
            print("✅ OK   UI   /                               React App Running")
        else:
            print(f"⚠️ WARN UI   /                               HTTP {response.status_code}")
    except:
        print("❌ FAIL UI   /                               Not Running (npm start needed)")
    
    # Summary
    ok_count = len([r for r in results if r[0] == "✅ OK"])
    respond_count = len([r for r in results if "RESPOND" in r[0]])
    fail_count = len([r for r in results if "FAIL" in r[0] or "ERROR" in r[0]])
    
    print(f"\n📊 QUICK SUMMARY:")
    print(f"✅ Working: {ok_count}")
    print(f"⚠️ Responding: {respond_count}")  
    print(f"❌ Failed: {fail_count}")
    
    if fail_count == 0:
        print("\n🎉 API server is responding to all endpoints!")
    elif ok_count + respond_count > 0:
        print(f"\n👍 API server is running - {ok_count + respond_count}/{len(tests)} endpoints responding")
    else:
        print("\n⚠️ API server may be down or unreachable")
    
    print(f"\n💡 For detailed testing, run: python test_api_ui_integration.py")

if __name__ == "__main__":
    test_now()