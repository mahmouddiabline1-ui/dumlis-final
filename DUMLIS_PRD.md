# DUMLIS — University Student Affairs System
## Product Requirements Document (PRD) for API Testing

---

## 1. System Overview

DUMLIS is a university student affairs management system for Damietta University (جامعة دمياط). It manages students, academic programs, courses, enrollments, grades, attendance, financial records, and scheduling across multiple faculties.

**Production URLs:**
- **Backend API**: `https://dumlis-final-production.up.railway.app`
- **Frontend**: `https://dumlis-final.mahmouddiabline1.workers.dev`
- **API Docs (Swagger)**: `https://dumlis-final-production.up.railway.app/docs`
- **OpenAPI Spec**: `https://dumlis-final-production.up.railway.app/openapi.json`

---

## 2. Authentication

All endpoints (except `/auth/login`, `/health`, `/ready`) require Bearer JWT authentication.

**Login endpoint:** `POST /auth/login`
- Content-Type: `application/x-www-form-urlencoded`
- Body: `username=admin_fcai&password=admin`

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user_role": "faculty_admin",
  "username": "admin_fcai",
  "faculty_id": "FCAI"
}
```

**All subsequent requests:** Add header `Authorization: Bearer {access_token}`

**Test Credentials:**

| Username | Password | Role | Scope |
|---|---|---|---|
| `president` | `admin` | super_admin | All faculties |
| `admin_fcai` | `admin` | faculty_admin | FCAI only |
| `admin_fsc` | `test1234` | faculty_admin | FSC only |
| `2024006` | `test1234` | student | Own data only |

---

## 3. Faculty Scoping (Critical)

Faculty admins are **automatically scoped** to their faculty. They cannot see or modify data from other faculties. The `faculty_id` from the JWT token is applied server-side.

- `president` (super_admin) → can access all faculties
- `admin_fcai` → only sees FCAI data, `faculty_id=FCAI` enforced automatically

---

## 4. Core Entities

### Students
- **Endpoint:** `/students/`
- **Primary key:** `student_id` (string, e.g., "2024001")
- **Required fields on create:** `student_id`, `name`, `national_id`, `level` (1-7), `regulation` (لائحة جديدة|لائحة قديمة), `status`, `fees_status`
- **Status values (DB):** `مقيد`, `نشط`, `منسحب`, `منقطع`, `موقوف`, `خريج`, `مفصول`
- **Fees status values:** `مسدد`, `غير مسدد`, `مسدد جزئياً`, `معفي`

### Courses
- **Endpoint:** `/courses/`
- **Primary key:** `id` (string course code, e.g., "CS101")
- **Key fields:** `credit_hours` (int), `course_type` (إجباري|اختياري), `semester`, `program_id`, `department_id`, `faculty_id`

### Enrollments
- **Endpoint:** `/enrollments/`
- **Primary key:** `id` (UUID)
- **Status values:** `مسجل`, `منسحب`, `مؤجل`, `مكتمل`
- **Critical:** `semester` must be `"2024-2025 خريف"` to match seeded data

### Grades
- **Endpoint:** `/grades/`
- **Primary key:** `id` (UUID)
- **Key fields:** `student_id`, `course_id`, `faculty_id`, `semester`, `midterm`, `final_exam`, `total`, `grade_letter`, `grade_points`

### Financial Records
- **Endpoint:** `/financial/`
- **Primary key:** `id` (UUID)
- **Key fields:** `student_id`, `amount`, `paid_amount`, `status` (مسدد|غير مسدد), `fee_type`, `academic_year`

### Academic Programs
- **Endpoint:** `/programs/`
- **Primary key:** `id` (string, e.g., "CSB001")
- **Key fields:** `name`, `degree` (بكالوريوس|ماجستير|دكتوراه), `department_id`, `total_hours`, `mandatory_hours`, `elective_hours`, `tracks`

### Regulations (Bylaws)
- **Endpoint:** `/regulations/`
- **Primary key:** `id` (UUID)
- **Key fields:** `name`, `program_id`, `faculty_id`, `mandatory_hours`, `elective_hours`

### System Settings
- **Endpoint:** `/system-settings/`
- **Primary key:** `id` (string slug, e.g., "min_gpa")
- **Key fields:** `name`, `value`, `category`, `status` (Active|Inactive)

### Fee Setup
- **Endpoint:** `/fee-setup/`
- **Key fields:** `fee_type`, `level`, `amount`, `semester`, `academic_year`, `status`, `faculty_id`

---

## 5. Seeded Test Data (Production DB)

| Entity | Count |
|---|---|
| Faculties | 6 (FCAI, FSC, FEN, FED, PHR, LAW) |
| Departments | 15 |
| Courses | 32 |
| Students | 1700 (450 in FCAI) |
| Enrollments | ~6600 |
| Grades | ~4500 |
| Financial Records | ~600 |
| System Settings | 16 |
| Fee Setup Records | 16 |

**FCAI-specific data:**
- 450 students, 9 courses, 3 departments (CS, IS, AI), 3 programs
- Enrollment status = "مسجل", semester = "2024-2025 خريف"

---

## 6. Key API Test Scenarios

### Auth Tests
1. Login with valid credentials → 200 + token
2. Login with wrong password → 401
3. Access protected endpoint without token → 401
4. Access protected endpoint with invalid token → 401

### Student CRUD
1. List students (`GET /students/?limit=10`) → 200
2. List with filter (`GET /students/?level=1&status=مقيد`) → 200, filtered results
3. Get student by ID (`GET /students/{student_id}`) → 200 or 404
4. Create student (`POST /students/`) → 201, returns full student object
5. Update student status (`PUT /students/{id}`) → 200, returns updated object
6. Update gpa_mod_status + gpa_mod_reason → 200, fields persist on re-fetch
7. Delete student (`DELETE /students/{id}`) → 204, then GET → 404
8. Faculty scoping: admin_fcai cannot access FSC students → 404

### Student Statistics
- `GET /students/statistics` → `totalStudents`, `levelStats`, `feesStats`, `paymentRate`
- `GET /students/count` → `{"count": N}`

### Enrollment Tests
1. List enrollments → status must be "مسجل"
2. Create enrollment → check student_id + course_id exist
3. Double-enrollment of same student+course → should fail (409 or 422)

### Financial Tests
1. List financial records → `amount`, `paid_amount`, `status` present
2. Student summary: `GET /financial/student/{student_id}/summary`
3. Fee setup list → `fee_type`, `amount`, `level`, `semester` present

### System Settings
1. `GET /system-settings/` → at least 5 rows (min_gpa, warn1_gpa, etc.)
2. Create → 201; Update → 200; Delete → 204

### Programs & Regulations
1. `GET /programs/` → `degree`, `total_hours`, `department_id` present (NOT `degree_level` or `duration_years`)
2. `GET /regulations/` → `program_id`, `mandatory_hours` present

---

## 7. Business Rules & Constraints

1. **Faculty isolation** — faculty admins only see their faculty's data
2. **Student level** — integer 1–7
3. **GPA** — float 0.0–4.0
4. **Enrollment semester** format: `"YYYY-YYYY خريف|ربيع"`
5. **Student ID** — unique string (e.g., "2024001")
6. **National ID** — unique string
7. **Regulation values** — `لائحة جديدة` or `لائحة قديمة`
8. **Super admin** (`president`) has no faculty scoping restriction

---

## 8. Edge Cases to Test

1. Create student with duplicate `student_id` → 409 Conflict
2. Create student missing required field → 422 Validation Error
3. Update student from wrong faculty → 404 Not Found
4. Enroll student in non-existent course → 422 or 404
5. Delete non-existent resource → 404
6. Filter students with invalid level (e.g., `level=99`) → 422
7. Request with malformed JWT → 401
8. `GET /health` and `GET /ready` → 200 (no auth needed)

---

## 9. Response Structure Notes

- **Lists** return JSON arrays directly (not `{"items": [...]}`)
- **Create** returns the created object with all fields (201)
- **Update** returns the full updated object (200)
- **Delete** returns empty body (204)
- **Errors** return `{"detail": "message"}` or `{"detail": [validation errors]}`

---

## 10. TestSprite Setup Instructions

**Step 1 — API Base URL:**
```
https://dumlis-final-production.up.railway.app
```
*(NOT the frontend URL — that's Cloudflare Workers serving React)*

**Step 2 — Upload API Docs:**
Upload the file: `dumlis_openapi.json` (in project root — generated from `/openapi.json`)

**Step 3 — Extra Testing Instructions:**
```
All endpoints require Bearer JWT authentication except /auth/login, /health, /ready.
Get token via POST /auth/login with form data: username=admin_fcai&password=admin
Use header: Authorization: Bearer {token}
Faculty admins are auto-scoped to their faculty (faculty_id=FCAI for admin_fcai).
For super_admin access use username=president&password=admin.
Student IDs are strings like "2024001". Enrollment status = "مسجل".
Semester format: "2024-2025 خريف". Arabic text in status/regulation fields is required.
Lists return arrays directly, not wrapped objects.
Create returns 201, Update returns 200, Delete returns 204 with empty body.
```
