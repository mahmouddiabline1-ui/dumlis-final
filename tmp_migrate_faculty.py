
import psycopg2
import os

def migrate():
    # Connection details from backend/.env or standard defaults
    conn = psycopg2.connect(
        dbname="dumlis_db",
        user="dumlis_user",
        password="dumlis_pass",
        host="localhost",
        port="5432"
    )
    cur = conn.cursor()
    
    try:
        print("Adding faculty_id to programs...")
        cur.execute("ALTER TABLE programs ADD COLUMN IF NOT EXISTS faculty_id VARCHAR(20) REFERENCES faculties(id) ON DELETE CASCADE;")
        cur.execute("UPDATE programs SET faculty_id = 'FCAI' WHERE faculty_id IS NULL;")
        
        print("Adding faculty_id to courses...")
        cur.execute("ALTER TABLE courses ADD COLUMN IF NOT EXISTS faculty_id VARCHAR(20) REFERENCES faculties(id) ON DELETE SET NULL;")
        cur.execute("UPDATE courses SET faculty_id = 'FCAI' WHERE faculty_id IS NULL;")
        
        conn.commit()
        print("Migration successful!")
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    migrate()
