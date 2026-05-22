import os
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("DATABASE_URL", "postgresql://dumlis_user:dumlis_pass@localhost:5432/dumlis_db")
print("BACKEND IS USING URL:", url)

try:
    from app.database import engine
    with engine.connect() as conn:
        print("SQLAlchemy Connected successfully!")
except Exception as e:
    print("SQLAlchemy Connection Error:", e)
