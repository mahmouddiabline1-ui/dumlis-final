import os
import sys
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.database import DATABASE_URL
from app.models import User, CourseClose, Course

def diagnose():
    engine = create_engine(DATABASE_URL)
    with Session(engine) as session:
        # Check admin_sci user
        user = session.query(User).filter(User.username == 'admin_sci').first()
        if user:
            print(f"User: {user.username}, Role: {user.role}, FacultyID: {user.faculty_id}")
        else:
            print("User admin_sci NOT FOUND")

        # Check CourseClose counts
        total_closures = session.query(CourseClose).count()
        print(f"Total CourseClose records: {total_closures}")

        # Check a few records
        closures = session.query(CourseClose).limit(5).all()
        for c in closures:
            print(f"Closure ID: {c.id}, Faculty: {c.faculty_id}, Course: {c.course_code}")

        # Simulate the query in the router
        fid = user.faculty_id if user and user.role != 'super_admin' else None
        print(f"Simulating query for faculty_id: {fid}")
        
        q = select(CourseClose)
        if fid:
            q = q.where(CourseClose.faculty_id == fid)
        
        results = session.execute(q).scalars().all()
        print(f"Found {len(results)} records for simulated query.")
        for r in results:
            print(f" - {r.course_code} (Faculty: {r.faculty_id})")

if __name__ == "__main__":
    diagnose()
