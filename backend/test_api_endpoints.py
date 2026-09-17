import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def run_test(name, method, path, payload=None, expected_status=200):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    data = json.dumps(payload).encode("utf-8") if payload else None
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            body = resp.read().decode("utf-8")
            res_json = json.loads(body) if body else {}
            print(f"[PASS] {method} {path} -> Status {status}")
            return True, res_json
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"[{'PASS' if e.code == expected_status else 'FAIL'}] {method} {path} -> Status {e.code} (Expected {expected_status})")
        return e.code == expected_status, body
    except Exception as e:
        print(f"[ERROR] {method} {path} -> {e}")
        return False, str(e)

def main():
    print("=" * 60)
    print("RUNNING API GET / POST VALIDATION TESTS")
    print("=" * 60)
    
    results = []

    # 1. Health Check GET
    ok, _ = run_test("Health Check", "GET", "/health")
    results.append(ok)

    # 2. GET Reservations
    ok, _ = run_test("Get Reservations", "GET", "/api/v1/reservations")
    results.append(ok)

    # 3. GET Availability
    ok, _ = run_test("Get Availability", "GET", "/api/v1/availability?property_id=P-001&check_in=2026-09-16&check_out=2026-09-20")
    results.append(ok)

    # 4. GET Arrivals (Member 1)
    ok, _ = run_test("Get Arrivals", "GET", "/api/v1/arrivals")
    results.append(ok)

    # 5. GET Operations Dashboard (Member 4)
    ok, _ = run_test("Get Operations Dashboard", "GET", "/api/v1/dashboard/operations")
    results.append(ok)

    # 6. GET MultiProperty Inventory (Team 2)
    ok, _ = run_test("Get Inventory", "GET", "/api/v1/inventory")
    results.append(ok)

    # 7. GET Upsell Offers (Team 2)
    ok, _ = run_test("Get Offers", "GET", "/api/v1/offers")
    results.append(ok)

    # 8. GET Spa Appointments (Member 2)
    ok, _ = run_test("Get Spa Appointments", "GET", "/api/v1/spa/appointments")
    results.append(ok)

    # 9. GET Orders (Member 3)
    ok, _ = run_test("Get Orders", "GET", "/api/v1/orders")
    results.append(ok)

    # 10. POST Staff Auth Login
    ok, login_res = run_test("POST Auth Login", "POST", "/api/v1/auth/login", {"username": "staff", "password": "staff123"})
    results.append(ok)

    # 11. POST Guest Auth Login
    ok, _ = run_test("POST Guest Login", "POST", "/api/v1/auth/guest/login", {"username": "guest", "password": "guest123"})
    results.append(ok)

    # 12. POST AI Chat Assistant (Member 4 / RAG)
    ok, ai_res = run_test(
        "POST AI Chat",
        "POST",
        "/api/v1/ai/chat",
        {"message": "What dining options and hours are available?", "history": []}
    )
    results.append(ok)

    print("=" * 60)
    passed = sum(1 for r in results if r)
    total = len(results)
    print(f"API TEST RESULT: {passed}/{total} ENDPOINTS PASSED")
    print("=" * 60)

    if passed < total:
        sys.exit(1)

if __name__ == "__main__":
    main()
