#!/usr/bin/env python3
"""
Comprehensive backend testing for Dr. Lalchandani Labs diagnostic platform
Tests all API endpoints with success and error scenarios
"""
import requests
import json
import uuid
import time
from typing import Dict, List, Any

# Configuration
BASE_URL = "https://labcheck-dr.preview.emergentagent.com/api"
TEST_SESSION_ID = "test_session_" + str(uuid.uuid4())[:8]
TEST_MOBILE = "9876543210"
TEST_OTP = "123456"

def print_test_result(test_name: str, success: bool, details: str = ""):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {test_name}")
    if details:
        print(f"    Details: {details}")
    print()

def make_request(method: str, endpoint: str, data: Dict = None, params: Dict = None) -> tuple:
    """Make HTTP request and return response and success status"""
    try:
        url = f"{BASE_URL}/{endpoint.lstrip('/')}"
        headers = {'Content-Type': 'application/json'}
        
        if method == "GET":
            response = requests.get(url, params=params, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=10)
        else:
            return None, False
            
        return response, True
    except Exception as e:
        print(f"    Request failed: {str(e)}")
        return None, False

def test_health_endpoint():
    """Test GET /api/health"""
    print("Testing Health Check Endpoint")
    response, success = make_request("GET", "/health")
    
    if not success:
        print_test_result("Health endpoint", False, "Request failed")
        return False
        
    if response.status_code == 200:
        data = response.json()
        success = data.get('status') == 'healthy'
        print_test_result("Health endpoint", success, f"Status: {data}")
        return success
    else:
        print_test_result("Health endpoint", False, f"Status: {response.status_code}")
        return False

def test_seed_endpoint():
    """Test POST /api/seed - Should be idempotent"""
    print("Testing Database Seeding")
    
    # First seed
    response, success = make_request("POST", "/seed")
    if not success:
        print_test_result("Seed endpoint", False, "Request failed")
        return False
    
    if response.status_code in [200, 201]:
        data = response.json()
        first_seed_result = data.get('message', '')
        
        # Second seed (should be idempotent)
        response2, success2 = make_request("POST", "/seed")
        if success2 and response2.status_code == 200:
            data2 = response2.json()
            second_seed_result = data2.get('message', '')
            
            # Should indicate already seeded
            idempotent = "already seeded" in second_seed_result.lower()
            print_test_result("Seed idempotency", idempotent, f"First: {first_seed_result}, Second: {second_seed_result}")
            return True
        else:
            print_test_result("Seed endpoint", False, "Second seed failed")
            return False
    else:
        print_test_result("Seed endpoint", False, f"Status: {response.status_code}")
        return False

def test_tests_endpoint():
    """Test GET /api/tests with various filters"""
    print("Testing Tests Listing")
    
    # Test basic listing
    response, success = make_request("GET", "/tests")
    if not success:
        print_test_result("Tests listing", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        tests = data.get('tests', [])
        basic_success = len(tests) >= 10  # Should have multiple tests
        print_test_result("Tests basic listing", basic_success, f"Found {len(tests)} tests")
    else:
        print_test_result("Tests listing", False, f"Status: {response.status_code}")
        return False
    
    # Test category filter
    response, success = make_request("GET", "/tests", params={"category": "Haematology"})
    if success and response.status_code == 200:
        data = response.json()
        filtered_tests = data.get('tests', [])
        category_success = len(filtered_tests) > 0 and all(t.get('category') == 'Haematology' for t in filtered_tests)
        print_test_result("Tests category filter", category_success, f"Found {len(filtered_tests)} Haematology tests")
    else:
        print_test_result("Tests category filter", False)
    
    # Test search filter
    response, success = make_request("GET", "/tests", params={"search": "CBC"})
    if success and response.status_code == 200:
        data = response.json()
        search_tests = data.get('tests', [])
        search_success = len(search_tests) > 0 and any('CBC' in t.get('name', '') for t in search_tests)
        print_test_result("Tests search filter", search_success, f"Found {len(search_tests)} tests with CBC")
    else:
        print_test_result("Tests search filter", False)
    
    # Test popular filter
    response, success = make_request("GET", "/tests", params={"popular": "true"})
    if success and response.status_code == 200:
        data = response.json()
        popular_tests = data.get('tests', [])
        popular_success = len(popular_tests) > 0 and all(t.get('popular') == True for t in popular_tests)
        print_test_result("Tests popular filter", popular_success, f"Found {len(popular_tests)} popular tests")
    else:
        print_test_result("Tests popular filter", False)
    
    return True

def test_packages_endpoint():
    """Test GET /api/packages"""
    print("Testing Packages Listing")
    
    response, success = make_request("GET", "/packages")
    if not success:
        print_test_result("Packages listing", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        packages = data.get('packages', [])
        success = len(packages) >= 3  # Should have multiple packages
        print_test_result("Packages listing", success, f"Found {len(packages)} packages")
        return success
    else:
        print_test_result("Packages listing", False, f"Status: {response.status_code}")
        return False

def test_leads_endpoint():
    """Test POST /api/leads with validation"""
    print("Testing Lead Creation")
    
    # Valid lead
    valid_data = {"mobile": TEST_MOBILE, "pincode": "110048"}
    response, success = make_request("POST", "/leads", data=valid_data)
    
    if not success:
        print_test_result("Lead creation", False, "Request failed")
        return False
    
    if response.status_code == 201:
        data = response.json()
        lead_success = data.get('message') and data.get('lead', {}).get('id')
        print_test_result("Valid lead creation", lead_success, f"Response: {data.get('message')}")
    else:
        print_test_result("Valid lead creation", False, f"Status: {response.status_code}")
        return False
    
    # Invalid lead - missing mobile
    invalid_data = {"pincode": "110048"}
    response, success = make_request("POST", "/leads", data=invalid_data)
    if success and response.status_code == 400:
        print_test_result("Lead validation (missing mobile)", True, "Correctly rejected")
    else:
        print_test_result("Lead validation (missing mobile)", False, "Should have rejected")
    
    # Invalid lead - missing pincode
    invalid_data2 = {"mobile": TEST_MOBILE}
    response, success = make_request("POST", "/leads", data=invalid_data2)
    if success and response.status_code == 400:
        print_test_result("Lead validation (missing pincode)", True, "Correctly rejected")
    else:
        print_test_result("Lead validation (missing pincode)", False, "Should have rejected")
    
    return True

def test_cart_flow():
    """Test complete cart flow: add -> get -> remove -> verify empty"""
    print("Testing Cart Operations")
    
    # Test data for cart item
    test_item_id = str(uuid.uuid4())
    cart_item = {
        "sessionId": TEST_SESSION_ID,
        "itemId": test_item_id,
        "itemType": "test",
        "name": "CBC",
        "price": 299
    }
    
    # Add item to cart
    response, success = make_request("POST", "/cart/add", data=cart_item)
    if not success:
        print_test_result("Cart add", False, "Request failed")
        return False
    
    if response.status_code == 201:
        data = response.json()
        cart = data.get('cart', [])
        add_success = len(cart) > 0 and any(item.get('itemId') == test_item_id for item in cart)
        print_test_result("Add to cart", add_success, f"Cart has {len(cart)} items")
    else:
        print_test_result("Add to cart", False, f"Status: {response.status_code}")
        return False
    
    # Test duplicate prevention
    response, success = make_request("POST", "/cart/add", data=cart_item)
    if success and response.status_code == 200:
        data = response.json()
        duplicate_msg = data.get('message', '')
        duplicate_prevented = 'already in cart' in duplicate_msg.lower()
        print_test_result("Duplicate prevention", duplicate_prevented, duplicate_msg)
    
    # Get cart
    response, success = make_request("GET", f"/cart/{TEST_SESSION_ID}")
    if not success:
        print_test_result("Get cart", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        cart = data.get('cart', [])
        get_success = len(cart) > 0 and any(item.get('itemId') == test_item_id for item in cart)
        print_test_result("Get cart", get_success, f"Retrieved cart with {len(cart)} items")
    else:
        print_test_result("Get cart", False, f"Status: {response.status_code}")
        return False
    
    # Remove item
    remove_data = {"sessionId": TEST_SESSION_ID, "itemId": test_item_id}
    response, success = make_request("POST", "/cart/remove", data=remove_data)
    if not success:
        print_test_result("Remove from cart", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        cart = data.get('cart', [])
        remove_success = not any(item.get('itemId') == test_item_id for item in cart)
        print_test_result("Remove from cart", remove_success, f"Cart now has {len(cart)} items")
        return remove_success
    else:
        print_test_result("Remove from cart", False, f"Status: {response.status_code}")
        return False

def test_otp_flow():
    """Test OTP send and verify flow"""
    print("Testing OTP Authentication")
    
    # Send OTP
    otp_data = {"mobile": TEST_MOBILE}
    response, success = make_request("POST", "/auth/send-otp", data=otp_data)
    
    if not success:
        print_test_result("Send OTP", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        send_success = data.get('message') and 'sent' in data.get('message', '').lower()
        print_test_result("Send OTP", send_success, data.get('message'))
    else:
        print_test_result("Send OTP", False, f"Status: {response.status_code}")
        return False
    
    # Test invalid mobile validation
    invalid_mobile_data = {"mobile": "123"}
    response, success = make_request("POST", "/auth/send-otp", data=invalid_mobile_data)
    if success and response.status_code == 400:
        print_test_result("OTP mobile validation", True, "Correctly rejected invalid mobile")
    else:
        print_test_result("OTP mobile validation", False, "Should reject invalid mobile")
    
    # Verify OTP
    verify_data = {"mobile": TEST_MOBILE, "otp": TEST_OTP}
    response, success = make_request("POST", "/auth/verify-otp", data=verify_data)
    
    if not success:
        print_test_result("Verify OTP", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        user = data.get('user', {})
        verify_success = data.get('message') and user.get('id') and user.get('mobile') == TEST_MOBILE
        print_test_result("Verify OTP", verify_success, f"User created/verified: {user.get('id')}")
        return verify_success
    else:
        print_test_result("Verify OTP", False, f"Status: {response.status_code}")
        return False
    
    # Test wrong OTP
    wrong_otp_data = {"mobile": TEST_MOBILE, "otp": "999999"}
    response, success = make_request("POST", "/auth/verify-otp", data=wrong_otp_data)
    if success and response.status_code == 400:
        print_test_result("Wrong OTP rejection", True, "Correctly rejected wrong OTP")
    else:
        print_test_result("Wrong OTP rejection", False, "Should reject wrong OTP")

def test_prescription_upload():
    """Test POST /api/prescriptions"""
    print("Testing Prescription Upload")
    
    prescription_data = {
        "fileName": "test_prescription.pdf",
        "fileType": "application/pdf",
        "fileSize": 1024,
        "sessionId": TEST_SESSION_ID
    }
    
    response, success = make_request("POST", "/prescriptions", data=prescription_data)
    
    if not success:
        print_test_result("Prescription upload", False, "Request failed")
        return False
    
    if response.status_code == 201:
        data = response.json()
        prescription = data.get('prescription', {})
        upload_success = data.get('message') and prescription.get('id') and prescription.get('status')
        print_test_result("Prescription upload", upload_success, f"Uploaded with ID: {prescription.get('id')}")
        return upload_success
    else:
        print_test_result("Prescription upload", False, f"Status: {response.status_code}")
        return False

def test_booking_flow():
    """Test POST /api/bookings and cart clearing"""
    print("Testing Booking Creation and Cart Clearing")
    
    # First add item to cart for booking
    test_item_id = str(uuid.uuid4())
    cart_item = {
        "sessionId": TEST_SESSION_ID,
        "itemId": test_item_id,
        "itemType": "test",
        "name": "CBC",
        "price": 299
    }
    
    # Add to cart
    response, success = make_request("POST", "/cart/add", data=cart_item)
    if not success or response.status_code != 201:
        print_test_result("Booking setup (add to cart)", False, "Failed to add item to cart")
        return False
    
    # Create booking
    booking_data = {
        "sessionId": TEST_SESSION_ID,
        "items": [{"id": test_item_id, "name": "CBC", "price": 299}],
        "totalAmount": 299,
        "patientName": "John Doe",
        "patientAge": "30",
        "patientGender": "male",
        "mobile": TEST_MOBILE,
        "collectionType": "home",
        "address": "123 Test Street, New Delhi",
        "timeSlot": "9-10 AM",
        "paymentMethod": "pay_at_home"
    }
    
    response, success = make_request("POST", "/bookings", data=booking_data)
    
    if not success:
        print_test_result("Booking creation", False, "Request failed")
        return False
    
    if response.status_code == 201:
        data = response.json()
        booking = data.get('booking', {})
        booking_success = data.get('message') and booking.get('id') and booking.get('status')
        print_test_result("Booking creation", booking_success, f"Booking ID: {booking.get('id')}")
        
        # Verify cart is cleared
        cart_response, cart_success = make_request("GET", f"/cart/{TEST_SESSION_ID}")
        if cart_success and cart_response.status_code == 200:
            cart_data = cart_response.json()
            cart = cart_data.get('cart', [])
            cart_cleared = len(cart) == 0
            print_test_result("Cart cleared after booking", cart_cleared, f"Cart now has {len(cart)} items")
            return booking_success and cart_cleared
        else:
            print_test_result("Cart check after booking", False, "Failed to check cart")
            return False
    else:
        print_test_result("Booking creation", False, f"Status: {response.status_code}")
        return False

def run_all_tests():
    """Run comprehensive backend tests"""
    print("=" * 60)
    print("DR. LALCHANDANI LABS - BACKEND API TESTING")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print(f"Test Session: {TEST_SESSION_ID}")
    print("=" * 60)
    
    tests = [
        ("Health Check", test_health_endpoint),
        ("Database Seeding", test_seed_endpoint),
        ("Tests Endpoint", test_tests_endpoint),
        ("Packages Endpoint", test_packages_endpoint),
        ("Leads Creation", test_leads_endpoint),
        ("Cart Operations", test_cart_flow),
        ("OTP Authentication", test_otp_flow),
        ("Prescription Upload", test_prescription_upload),
        ("Booking & Cart Clear", test_booking_flow),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            if test_func():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print_test_result(test_name, False, f"Exception: {str(e)}")
            failed += 1
    
    print("\n" + "=" * 60)
    print("FINAL RESULTS")
    print("=" * 60)
    print(f"✅ PASSED: {passed}")
    print(f"❌ FAILED: {failed}")
    print(f"📊 SUCCESS RATE: {passed/(passed+failed)*100:.1f}%")
    print("=" * 60)
    
    return passed, failed

if __name__ == "__main__":
    run_all_tests()