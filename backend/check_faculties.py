import sys
from app.database import SessionLocal
from app import models

sys.stdout.reconfigure(encoding='utf-8')

db = SessionLocal()
try:
    facs = db.query(models.Faculty).all()
    print(f"Total faculties: {len(facs)}")
    for f in facs:
        print(f"Faculty: {f.id}, Name: {f.name}")
finally:
    db.close()
