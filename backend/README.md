# DUMLIS Backend — FastAPI + PostgreSQL

University Management & Learning Information System  
Faculty of Computers and AI (FCAI) — Damietta University

---

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI app + CORS + router registration
│   ├── database.py      # SQLAlchemy engine, session factory, get_db()
│   ├── models.py        # All SQLAlchemy 2.0 ORM models (18 entities)
│   ├── schemas.py       # All Pydantic schemas (Base / Create / Update / Response)
│   └── routers/
│       ├── faculties.py
│       ├── departments.py
│       ├── students.py           # includes /students/{id}/profile
│       ├── courses.py            # includes /courses/{id}/prerequisites
│       ├── enrollments.py
│       ├── grades.py
│       ├── attendance.py         # includes bulk insert + summary
│       ├── financial.py          # includes fee-setup + student summary
│       ├── schedules.py          # includes /schedules/student/{id}
│       ├── rooms.py
│       ├── committees.py         # includes /committees/{id}/students
│       └── registration_requests.py  # includes /blocks/
├── alembic/
│   ├── env.py
│   └── versions/
│       └── 0001_initial_schema.py
├── schema.sql           # Raw PostgreSQL DDL (18 tables)
├── alembic.ini
├── requirements.txt
├── .env.example
└── README.md
```

---

## Entities Covered

| Table | Description |
|---|---|
| faculties | 11 academic faculties |
| departments | Academic departments within faculties |
| users | System users (super_admin / faculty_admin / student_affairs / student) |
| students | Core student academic record |
| student_profiles | Detailed personal / family / military / medical data |
| courses | Course catalog with credit hours and type |
| course_prerequisites | Self-referencing M2M for prerequisite chains |
| course_equivalences | Requests to transfer credit between courses |
| enrollments | Student course registrations per semester |
| grades | Midterm / final / assignments / total / letter grade |
| attendance_records | Per-session attendance with status |
| rooms | Classrooms and labs with capacity and equipment |
| course_schedules | Weekly timetable with room, instructor, group |
| financial_records | Fee records with payment tracking |
| fee_setup | Fee definitions per faculty/level/semester |
| committees | Exam committees assigned to rooms |
| student_committee_assignments | Seat assignments within committees |
| registration_requests | Troubled enrollment issue forms |
| student_blocks | Student registration blocks with reason |
| activity_log | Audit trail of all changes |

---

## Quick Start

### 1. Prerequisites
- Python 3.11+
- PostgreSQL 15+

### 2. Setup

```bash
# Clone / navigate to the backend directory
cd d:\desktop\dumlis\backend

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\activate        # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Database

```bash
# Create PostgreSQL user and database
psql -U postgres
CREATE USER dumlis_user WITH PASSWORD 'your_password';
CREATE DATABASE dumlis_db OWNER dumlis_user;
\q
```

Copy `.env.example` to `.env` and set `DATABASE_URL`:
```
DATABASE_URL=postgresql://dumlis_user:your_password@localhost:5432/dumlis_db
```

### 4. Run Migrations

```bash
# Option A — use Alembic (recommended, incremental)
alembic upgrade head

# Option B — apply raw SQL directly
psql -U dumlis_user -d dumlis_db -f schema.sql
```

### 5. Start the API

```bash
uvicorn app.main:app --reload
```

Visit **http://127.0.0.1:8000/docs** for the interactive Swagger UI.

---

## API Overview

| Prefix | Entity | Endpoints |
|---|---|---|
| `/faculties` | Faculty | GET / GET:id / POST / PUT / DELETE |
| `/departments` | Department | GET?faculty_id / GET:id / POST / PUT / DELETE |
| `/students` | Student | GET (filters) / GET:id / POST / PUT / DELETE / count / profile |
| `/courses` | Course | GET (filters) / GET:id / POST / PUT / DELETE / prerequisites |
| `/enrollments` | Enrollment | GET (filters) / GET:id / POST / PUT / DELETE |
| `/grades` | Grade | GET (filters) / GET:id / POST / PUT / DELETE |
| `/attendance` | Attendance | GET / POST / bulk / summary / PUT / DELETE |
| `/financial` | Financial | GET / summary / POST / PUT / DELETE / fee-setup |
| `/schedules` | Schedule | GET (filters) / student/{id} / POST / PUT / DELETE |
| `/rooms` | Room | GET (type/status) / GET:id / POST / PUT / DELETE |
| `/committees` | Committee | GET / GET:id / POST / PUT / DELETE / students |
| `/registration-requests` | Requests | GET / POST / PUT / DELETE / blocks |

---

## Development Notes

- Arabic text is stored as UTF-8 in PostgreSQL. Ensure your DB collation supports it (`LC_COLLATE='ar_EG.UTF-8'` or `'C'` is also fine).  
- The `citext` extension is used for case-insensitive username/email matching.  
- `uuid-ossp` extension provides `uuid_generate_v4()` for primary key generation.  
- All nullable fields use SQLAlchemy `Optional[...]` mapped columns.  
- Pydantic v2 schemas use `model_config = {"from_attributes": True}` for ORM mode.
