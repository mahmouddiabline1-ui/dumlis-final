import requests
import json

BASE_URL = "http://localhost:8000"

def get_token(username, password):
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": username, "password": password})
    if resp.status_code == 200:
        return resp.json()["access_token"]
    return None

def check_endpoint(endpoint, token, expected_faculty):
    headers = {"Authorization": f"Bearer {token}"}
    # Verify current user info
    me_resp = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"DEBUG: Current User Info: {me_resp.json()}")
    
    resp = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
    if resp.status_code != 200:
        print(f"FAILED: {endpoint} returned status {resp.status_code}")
        return False
        
    data = resp.json()
    print(f"Checking {endpoint} for {expected_faculty}... (Count: {len(data)})")
    
    leak = False
    for item in data:
        # Check faculty_id if present
        fid = item.get("faculty_id")
        if fid and fid != expected_faculty:
            print(f"  LEAK DETECTED! Found item from {fid} in {expected_faculty} view.")
            leak = True
            
        # Check IDs that start with faculty prefixes
        id_val = str(item.get("id", ""))
        if id_val.startswith("FCAI-") and expected_faculty != "FCAI":
             print(f"  LEAK DETECTED! Found ID {id_val} in {expected_faculty} view.")
             leak = True
             
    if not leak:
        print(f"  SUCCESS: {endpoint} is correctly isolated for {expected_faculty}.")
    return not leak

def main():
    print("=== FINAL ISOLATION VERIFICATION ===")
    
    # Test 1: Science Admin (SCI)
    sci_token = get_token("admin_sci", "admin")
    if not sci_token:
        print("Could not get token for admin_sci")
        return

    check_endpoint("/course-closures", sci_token, "SCI")
    check_endpoint("/programs", sci_token, "SCI")
    check_endpoint("/report-signatures", sci_token, "SCI")
    check_endpoint("/academic-rules", sci_token, "SCI")
    check_endpoint("/regulations", sci_token, "SCI")
    
    # Test 2: FCAI Admin (FCAI)
    fcai_token = get_token("admin_fcai", "admin")
    if fcai_token:
        check_endpoint("/course-closures", fcai_token, "FCAI")
        check_endpoint("/programs", fcai_token, "FCAI")
        
    # Test 3: President (Super Admin - should see all)
    president_token = get_token("president", "admin")
    if president_token:
        headers = {"Authorization": f"Bearer {president_token}"}
        resp = requests.get(f"{BASE_URL}/course-closures", headers=headers)
        if resp.status_code == 200:
            print(f"President View - Total Closures: {len(resp.json())} (Should be many)")

if __name__ == "__main__":
    main()
