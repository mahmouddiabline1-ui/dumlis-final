
import psycopg2
import uuid

def seed():
    try:
        conn = psycopg2.connect(
            dbname='dumlis_db',
            user='dumlis_user',
            password='dumlis_pass',
            host='localhost',
            port='5432'
        )
        cur = conn.cursor()
        
        print("Cleaning up old data...")
        cur.execute("TRUNCATE TABLE users CASCADE")
        cur.execute("TRUNCATE TABLE faculties CASCADE")
        
        faculties = [
            ("FCAI", "كلية الحاسبات والذكاء الاصطناعي", "Faculty of Computers and AI", "💻", 2000, 120, "bg-blue-600"),
            ("SCI",  "كلية العلوم", "Faculty of Science", "🔬", 375, 250, "bg-green-600"),
            ("COM",  "كلية التجارة", "Faculty of Commerce", "📊", 375, 300, "bg-yellow-600"),
            ("EDU",  "كلية التربية", "Faculty of Education", "📚", 375, 200, "bg-red-600"),
            ("ENG",  "كلية الهندسة", "Faculty of Engineering", "⚙️", 375, 180, "bg-purple-600"),
            ("MED",  "كلية الطب", "Faculty of Medicine", "🏥", 1500, 150, "bg-pink-600"),
            ("PHR",  "كلية الصيدلة", "Faculty of Pharmacy", "💊", 1200, 100, "bg-indigo-600"),
            ("LAW",  "كلية الحقوق", "Faculty of Law", "⚖️", 3000, 120, "bg-gray-600"),
            ("ART",  "كلية الآداب", "Faculty of Arts", "📖", 4500, 180, "bg-orange-600"),
            ("AGR",  "كلية الزراعة", "Faculty of Agriculture", "🌾", 2800, 140, "bg-lime-600"),
            ("NRS",  "كلية التمريض", "Faculty of Nursing", "🏥", 2000, 110, "bg-teal-600")
        ]
        
        print("Inserting 11 faculties...")
        for f in faculties:
            cur.execute(
                "INSERT INTO faculties (id, name, name_en, icon, student_count, staff_count, color) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                f
            )
            
        print("Inserting admins...")
        # President (Super Admin)
        cur.execute(
            "INSERT INTO users (id, username, email, hashed_password, role, faculty_id) VALUES (%s, %s, %s, %s, %s, %s)",
            (str(uuid.uuid4()), "president", "president@du.edu.eg", "admin", "super_admin", None)
        )
        
        # Faculty Admins
        for f_id, name, _, _, _, _, _ in faculties:
            username = f"admin_{f_id.lower()}"
            email = f"{username}@du.edu.eg"
            password = "admin" # Simple for test
            cur.execute(
                "INSERT INTO users (id, username, email, hashed_password, role, faculty_id) VALUES (%s, %s, %s, %s, %s, %s)",
                (str(uuid.uuid4()), username, email, password, "faculty_admin", f_id)
            )
            
        conn.commit()
        print("Seed successful! 11 faculties and 12 users created.")
    except Exception as e:
        print(f"Error: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    seed()
