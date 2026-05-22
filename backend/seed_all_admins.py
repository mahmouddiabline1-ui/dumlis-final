"""
DUMLIS - Seed All Faculty Admins
Creates an administrator account for every faculty in the database.
"""
import sys
import uuid
import os
from passlib.context import CryptContext
from sqlalchemy.orm import Session

# Setup path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEFAULT_PASSWORD = "admin"

def seed_all_admins():
    db = SessionLocal()
    try:
        # Get all faculties
        faculties = db.query(models.Faculty).all()
        print(f"Found {len(faculties)} faculties. Ensuring each has an admin...")

        for faculty in faculties:
            # Pattern: admin + faculty_id (e.g., admin_sci, admin_med)
            username = f"admin_{faculty.id.lower()}"
            email = f"admin.{faculty.id.lower()}@du.edu.eg"
            
            # Check if user already exists
            existing = db.query(models.User).filter(
                models.User.username == username
            ).first()

            if existing:
                print(f"[SKIP] User {username} already exists for faculty {faculty.id}")
                continue

            # Create new user
            user = models.User(
                id=uuid.uuid4(),
                username=username,
                email=email,
                hashed_password=pwd_context.hash(DEFAULT_PASSWORD),
                role="faculty_admin",
                faculty_id=faculty.id,
                is_active=True,
            )
            db.add(user)
            print(f"[CREATED] User: {username} (Faculty: {faculty.id})")

        # Create Super Admin (President)
        if not db.query(models.User).filter(models.User.role == "super_admin").first():
            president = models.User(
                id=uuid.uuid4(),
                username="president",
                email="president@du.edu.eg",
                hashed_password=pwd_context.hash(DEFAULT_PASSWORD),
                role="super_admin",
                faculty_id=None,
                is_active=True,
            )
            db.add(president)
            print("[CREATED] Super Admin: president")

        db.commit()
        print("\nAll administrators seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding admins: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_all_admins()
