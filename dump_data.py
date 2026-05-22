
import psycopg2
import json

def dump_data():
    try:
        conn = psycopg2.connect(
            dbname='dumlis_db',
            user='dumlis_user',
            password='dumlis_pass',
            host='localhost',
            port='5432'
        )
        cur = conn.cursor()
        
        # Faculties
        cur.execute("SELECT id, name, name_en, student_count, staff_count, color, icon FROM faculties order by id")
        faculties = []
        for row in cur.fetchall():
            faculties.append({
                "id": row[0],
                "name": row[1],
                "name_en": row[2],
                "student_count": row[3],
                "staff_count": row[4],
                "color": row[5],
                "icon": row[6]
            })
            
        # Users
        cur.execute("SELECT id, username, email, role, faculty_id FROM users order by username")
        users = []
        for row in cur.fetchall():
            users.append({
                "id": str(row[0]),
                "username": row[1],
                "email": row[2],
                "role": row[3],
                "faculty_id": row[4]
            })
            
        result = {
            "faculties": faculties,
            "users": users
        }
        
        with open('d:/desktop/dumlis/data_dump.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
            
        print("Data dumped to d:/desktop/dumlis/data_dump.json")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    dump_data()
