# DUMLIS: React Mock Data → FastAPI + PostgreSQL Backend

This plan converts all mock data from the DUMLIS university management React project into a production-ready FastAPI backend with PostgreSQL.

---

## Entities Discovered

| Entity | Source File | Records (approx.) |
|---|---|---|
| Faculty (كلية) | [constants.tsx](file:///d:/desktop/dumlis/constants.tsx) | 11 |
| Department (قسم) | [constants.tsx](file:///d:/desktop/dumlis/constants.tsx) / [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | 6 (FCAI) |
| StudentProfile (بيانات الطالب الكاملة) | [constants.tsx](file:///d:/desktop/dumlis/constants.tsx) | 50 seeds + 3500 generated |
| Student (الطالب - basic) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | 3500 |
| Course (مقرر) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | 30+ |
| Enrollment (تسجيل) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | thousands |
| Grade (درجة) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | thousands |
| AttendanceRecord (حضور) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | thousands |
| FinancialRecord (مالية) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | thousands |
| CourseSchedule (جدول) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | hundreds |
| Room/Classroom (قاعة) | [committeesData.ts](file:///d:/desktop/dumlis/data/committeesData.ts) | 7 classrooms + 21 labs |
| Committee (لجنة امتحانية) | [committeesData.ts](file:///d:/desktop/dumlis/data/committeesData.ts) | dynamic |
| RegistrationRequest (طلب تسجيل) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | ~25 |
| CourseEquivalence (موازنة) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | few |
| StudentBlock (حجب) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | few |
| CoursePrerequisite (متطلب سابق) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | ~7 |
| FeeSetup (إعداد رسوم) | [mockData.ts](file:///d:/desktop/dumlis/data/mockData.ts) | dynamic |
| User (مستخدم) | [types.ts](file:///d:/desktop/dumlis/types.ts) | roles: super_admin, faculty_admin, student_affairs, student |

---

## Proposed Changes

### Backend Project Structure

```
d:\desktop\dumlis\backend\
├── app/
│   ├── __init__.py
│   ├── main.py               # FastAPI app entry point
│   ├── database.py           # Engine, session, base
│   ├── models.py             # All SQLAlchemy ORM models
│   ├── schemas.py            # All Pydantic schemas
│   └── routers/
│       ├── __init__.py
│       ├── faculties.py
│       ├── departments.py
│       ├── students.py
│       ├── courses.py
│       ├── enrollments.py
│       ├── grades.py
│       ├── attendance.py
│       ├── financial.py
│       ├── schedules.py
│       ├── rooms.py
│       ├── committees.py
│       └── registration_requests.py
├── alembic/
│   ├── env.py
│   └── versions/
│       └── 0001_initial_schema.py
├── alembic.ini
├── requirements.txt
├── .env.example
└── README.md
```

---

### PostgreSQL Schema — Table Relationships

```
faculties (1) ──< departments (many)
departments (1) ──< courses (many)
departments (1) ──< students (many)
faculties (1) ──< students (many)
students (1) ──< enrollments (many)
courses (1) ──< enrollments (many)
enrollments (1) ──< grades (1)  [one-to-one per semester]
students (1) ──< attendance_records (many)
courses (1) ──< attendance_records (many)
students (1) ──< financial_records (many)
courses (1) ──< course_schedules (many)
rooms (1) ──< course_schedules (many)
rooms (1) ──< committees (many)
students (many) ──>< committees (many)  [via student_committee_assignments]
students (1) ──< registration_requests (many)
courses (many) ──>< courses (many)  [course_prerequisites self-join]
courses (1) ──< course_equivalences (many)
students (1) ──< student_blocks (many)
students (1) ──< student_profiles (1-to-1)
users (1) ──< students (1)  [auth link]
```

---

## Output Files

### 1. [NEW] PostgreSQL Schema
#### [NEW] [schema.sql](file:///d:/desktop/dumlis/backend/schema.sql)
All `CREATE TABLE` statements with PKs, FKs, indexes, and constraints. Ordered to respect FK dependencies.

### 2. [NEW] SQLAlchemy Models
#### [NEW] [models.py](file:///d:/desktop/dumlis/backend/app/models.py)
ORM model classes for all 18+ entities with relationships, back_populates, nullable/unique/max_length.

### 3. [NEW] Pydantic Schemas
#### [NEW] [schemas.py](file:///d:/desktop/dumlis/backend/app/schemas.py)
Request (Create/Update) and Response Pydantic models for each entity.

### 4. [NEW] FastAPI Application
#### [NEW] [main.py](file:///d:/desktop/dumlis/backend/app/main.py)
App entry, CORS, router registration.

#### [NEW] [database.py](file:///d:/desktop/dumlis/backend/app/database.py)
SQLAlchemy engine, session factory, and `Base`.

#### [NEW] 12 Router Files
All CRUD endpoints (GET all, GET by id, POST, PUT, DELETE) for each entity.

### 5. [NEW] Alembic Migration
#### [NEW] [0001_initial_schema.py](file:///d:/desktop/dumlis/backend/alembic/versions/0001_initial_schema.py)
Full `upgrade()` and `downgrade()` migration.

### 6. [NEW] Config Files
- `requirements.txt` — all Python dependencies
- `.env.example` — DB connection template
- `alembic.ini` — Alembic config
- [README.md](file:///d:/desktop/dumlis/README.md) — Setup instructions

---

## Verification Plan

### Automated (Structural)
Since this is a new standalone backend with no existing tests, verification is focused on startup:

1. **Install dependencies**:
   ```
   cd d:\desktop\dumlis\backend
   pip install -r requirements.txt
   ```
2. **Check Alembic migration runs without errors** (dry-run review):
   - Review `0001_initial_schema.py` for correct `op.create_table()` order
3. **Check FastAPI app starts**:
   ```
   uvicorn app.main:app --reload
   ```
   - Browse to `http://127.0.0.1:8000/docs` — should show all endpoints
4. **Run SQLAlchemy model import check**:
   ```python
   python -c "from app.models import *; print('Models OK')"
   ```

### Manual Verification
1. Open `http://127.0.0.1:8000/docs` in browser
2. Verify all 12 entity groups appear in Swagger UI
3. Test one GET endpoint per entity (e.g. `GET /students/`, `GET /courses/`)
4. Test one POST endpoint (e.g. `POST /faculties/` with sample JSON)
5. Verify Pydantic validation rejects invalid input (e.g. missing required field)
