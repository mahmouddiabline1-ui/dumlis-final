
import requests
import json
import psycopg2

def verify():
    print("Creating a test program via API...")
    program_data = {
        "id": "VERIFY-PROG-01",
        "name": "البرنامج الاختباري للتحقق",
        "name_en": "Verification Test Program",
        "code": "VERIFY-01",
        "degree": "بكالوريوس",
        "department_id": "CS",
        "faculty_id": "FCAI",
        "total_hours": 140,
        "mandatory_hours": 100,
        "elective_hours": 20,
        "university_requirements": 20,
        "tracks": []
    }
    
    try:
        # Create program
        resp = requests.post("http://localhost:8000/programs/", json=program_data)
        if resp.status_code == 201:
            print("Program created successfully via API.")
        else:
            print(f"Failed to create program: {resp.status_code} - {resp.text}")
            return

        # Verify in DB
        print("Checking database for the program's faculty_id...")
        conn = psycopg2.connect(
            dbname="dumlis_db",
            user="dumlis_user",
            password="dumlis_pass",
            host="localhost",
            port="5432"
        )
        cur = conn.cursor()
        cur.execute("SELECT faculty_id FROM programs WHERE id = 'VERIFY-PROG-01';")
        res = cur.fetchone()
        
        if res and res[0] == 'FCAI':
            print("SUCCESS: The program was correctly associated with faculty_id 'FCAI'.")
        else:
            print(f"FAILURE: The program faculty_id is {res[0] if res else 'None'}")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error during verification: {e}")

if __name__ == "__main__":
    verify()
