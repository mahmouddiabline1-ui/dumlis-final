from app.database import SessionLocal
from app import models

db = SessionLocal()
try:
    users = db.query(models.User).all()
    print(f"Total users: {len(users)}")
    for u in users:
        print(f"User: {u.username}, Role: {u.role}, Faculty: {u.faculty_id}")
finally:
    db.close()
