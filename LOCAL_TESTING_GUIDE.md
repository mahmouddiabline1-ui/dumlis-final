# DUMLIS Local Testing Guide

## Overview
Database contains:
- **12 users** (president, affairs, student + more)
- **550 students** (50 per faculty)
- **11 faculties** with 5 departments each
- **55 programs/majors** (التخصصات - 1 per faculty × 5 per department)
- **55 courses** (المقررات - 5 per faculty)
- **11 study regulations** (اللوائح)
- **1,650 enrollments**
- **1,650 grades**
- **1,000 attendance records**
- **550 financial records** (EGP 2,285,000 total revenue)

---

## Step 1: Start Backend Server

Open **Terminal or PowerShell**:

```bash
cd d:\desktop\dumlis\backend
python -m uvicorn app.main:app --port 8000 --reload
```

Wait for message:
```
Application startup complete
```

Test it in another terminal:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status":"healthy","version":"1.0.0"}
```

---

## Step 2: Start Frontend Dev Server

Open **another Terminal/PowerShell**:

```bash
cd d:\desktop\dumlis
npm run dev
```

Wait for message showing your dev URL (usually `http://localhost:5173`)

---

## Step 3: Test Login

Open browser to **http://localhost:5173**

### Test Accounts:

| Role | Username | Password |
|------|----------|----------|
| Super Admin | `president` | `admin` |
| Staff | `affairs` | `affairs` |
| Student | `student` | `student` |

---

## Step 4: Test Faculty Data

After login, test each faculty independently:

### For Super Admin (president):
1. Click **Faculty > Faculty List** (if available)
2. For each of 11 faculties, verify:
   - ✓ 50 students
   - ✓ 5 departments
   - ✓ 1 program/major (التخصص)
   - ✓ 5 courses (المقررات)
   - ✓ Student list loads with database data (NOT mock)

### For Staff (affairs):
1. Navigate to student management
2. Verify student data is from database
3. Test search by name

### For Student:
1. Login as student
2. View own enrolled courses
3. Check grades
4. View attendance

---

## Step 5: Test Database-Backed Pages

Pages that MUST use real database data (NOT mock):

```
✓ student_list - All 550 students
✓ advanced_student_search - Search by name
✓ detailed_grades - All grades (1,650)
✓ detailed_attendance - Attendance records (1,000)
✓ financial_records - Financial data (550 records)
✓ course_catalog - 55 courses
✓ course_schedules - Schedules
✓ program_data - 11 programs
✓ view_departments - 55 departments
✓ study_regulations - 11 regulations
```

---

## Step 6: Test API Directly

### Test Search API:
```bash
curl -X GET "http://localhost:8000/students/?search=احمد&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Statistics:
```bash
curl -X GET "http://localhost:8000/students/statistics" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Troubleshooting

### "Failed to fetch" error in frontend
**Problem**: Backend not running or API URL wrong

**Solution**:
1. Make sure backend is running: `python -m uvicorn app.main:app --port 8000`
2. Check `.env.local` contains: `VITE_API_URL=http://localhost:8000`
3. Check browser console for CORS errors

### Backend won't start on port 8000
**Problem**: Port already in use

**Solution**:
```bash
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different port
python -m uvicorn app.main:app --port 8001
```

### Frontend won't start
**Problem**: Dependencies missing

**Solution**:
```bash
npm install
npm run dev
```

### Database errors
**Problem**: PostgreSQL not running

**Solution**:
- Start PostgreSQL service
- Verify DATABASE_URL in `backend/.env` is correct

---

## Checklist for Testing Each Faculty

For **FCAI** (Computer Science), verify:

- [ ] 50 students exist
- [ ] 5 departments (CS, IS, AI, etc.)
- [ ] 1 program (Bachelor's)
- [ ] 5 courses (Programming, DB, etc.)
- [ ] Student list shows real names (NOT "Student 001")
- [ ] Can search by name
- [ ] Financial data shows for students
- [ ] Grades appear (1,650 total across all)
- [ ] Attendance shows (1,000 records total)

Repeat for all 11 faculties:
- FCAI (Computer Science)
- SCI (Science)
- COM (Commerce)
- EDU (Education)
- ENG (Engineering)
- LAW (Law)
- MED (Medicine)
- NRS (Nursing)
- PHR (Pharmacy)
- AGR (Agriculture)
- ART (Arts)

---

## Expected Results

### Database Queries
- `/students/` → Returns 550 students
- `/students/?search=محمد` → Returns filtered results
- `/students/count` → Returns 550
- `/students/statistics` → Returns stats with EGP 2,285,000 revenue
- `/faculties/` → Returns 11 faculties
- `/courses/` → Returns 55 courses
- `/programs/` → Returns 11 programs

### Frontend Pages
- Student list shows real DB data (not mock)
- Search works with real student names
- Statistics dashboard shows real numbers
- Each faculty shows correct student count
- No "Generate fake data" messages should appear

---

## Notes

- **Mock Data**: Pages using `DynamicPage` (not in DB_BACKED_IDS) still use mock data
- **Real Data**: Pages in `DbBackedPage` use real database
- **Auth**: JWT tokens required for all data endpoints
- **CORS**: Configured for localhost only (change in production)

---

## After Testing

If all tests pass:
1. ✓ System is ready for deployment preparation
2. ✓ No mock data in production pages
3. ✓ Database schema is complete
4. ✓ API endpoints working with real data
5. ✓ Authentication system functional

Next phase: Clean up debug code and prepare for domain deployment
