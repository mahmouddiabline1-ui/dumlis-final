"""
DUMLIS - Seed Default System Users
Run once: python seed_users.py
Creates admin users with hashed passwords in the database.
"""
import sys
import uuid
from passlib.context import CryptContext
from sqlalchemy.orm import Session

# Setup path for imports
sys.path.insert(0, str(__file__).rsplit('\\', 1)[0])

from app.database import SessionLocal
from app import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

USERS_TO_CREATE = [
    {
        "username": "president",
        "email": "president@du.edu.eg",
        "password": "admin",
        "role": "super_admin",
        "faculty_id": None,
    },
    {
        "username": "affairs",
        "email": "affairs@du.edu.eg",
        "password": "affairs",
        "role": "student_affairs",
        "faculty_id": None,
    },
    {
        "username": "student",
        "email": "student@stud.du.edu.eg",
        "password": "student",
        "role": "student",
        "faculty_id": None,
    },
    {
        "username": "admin_fcai",
        "email": "fcai@du.edu.eg",
        "password": "admin",
        "role": "faculty_admin",
        "faculty_id": "FCAI",
    },
    # Faculty admins can be added after faculties are seeded in the database
    # Add them manually or via the admin panel
]


def seed_users():
    db = SessionLocal()
    try:
        for user_data in USERS_TO_CREATE:
            username = user_data["username"]

            # Check if user already exists
            existing = db.query(models.User).filter(
                models.User.username == username
            ).first()

            if existing:
                existing.hashed_password = pwd_context.hash(user_data["password"])
                existing.role = user_data["role"]
                existing.faculty_id = user_data["faculty_id"]
                print(f"Updated user: {username}")
                continue

            # Create new user
            user = models.User(
                id=uuid.uuid4(),
                username=username,
                email=user_data["email"],
                hashed_password=pwd_context.hash(user_data["password"]),
                role=user_data["role"],
                faculty_id=user_data["faculty_id"],
                is_active=True,
            )
            db.add(user)
            print(f"Created user: {username} (role: {user_data['role']})")

        db.commit()
        print("\nAll users seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding users: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed_users()
