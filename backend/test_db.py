import sys
import traceback
from app.database import SessionLocal
from app.models import ReportSignature

db = SessionLocal()
try:
    print(db.query(ReportSignature).all())
    print("OK")
except Exception as e:
    traceback.print_exc()
