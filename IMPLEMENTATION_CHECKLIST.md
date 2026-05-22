# DUMLIS Migration - Implementation Checklist for IT Team

## Pre-Deployment Tasks

### 1. Database Preparation
- [ ] Backup current PostgreSQL database
- [ ] Run latest migrations: `cd backend && alembic upgrade head`
- [ ] Execute seed scripts to populate initial data:
  ```bash
  cd backend
  python seed.py        # Main seed data
  python seed_all_admins.py  # Admin user accounts
  ```
- [ ] Verify database has data:
  ```bash
  psql -U dumlis_user -d dumlis -c "SELECT COUNT(*) FROM students;"
  ```
- [ ] Check specific tables:
  - [ ] `faculties` table (at least 1 faculty)
  - [ ] `departments` table (at least 5 departments)
  - [ ] `courses` table (at least 20 courses)
  - [ ] `rooms` table (at least 30 classrooms/labs)

### 2. Backend Setup
- [ ] Verify environment variables in `backend/.env`:
  ```env
  DATABASE_URL=postgresql://dumlis_user:password@localhost:5432/dumlis
  ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
  ```
- [ ] Start FastAPI backend:
  ```bash
  cd backend
  python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  ```
- [ ] Verify API is running: `http://localhost:8000/health` (should return 200)
- [ ] Check Swagger UI: `http://localhost:8000/docs`
- [ ] Verify all routers are loaded by checking endpoints in Swagger

### 3. Frontend Setup
- [ ] Create `.env.local` file in project root:
  ```env
  VITE_API_URL=http://localhost:8000
  GEMINI_API_KEY=your_api_key_here
  ```
- [ ] Install dependencies: `npm install`
- [ ] Start dev server:
  ```bash
  npm run dev
  ```
- [ ] Access UI at: `http://localhost:5173`
- [ ] Check browser console - should see:
  - "✅ Dynamic form options loaded successfully"
  - No CORS errors
  - No 404 errors for API calls

### 4. Core Functionality Tests

#### Test 1: Faculty Management
- [ ] Login as super_admin
- [ ] Navigate to Faculty Analytics
- [ ] Verify faculties list loads from database
- [ ] Add a new faculty
- [ ] Verify new faculty appears immediately in dropdowns
- [ ] Refresh page - faculty still there

#### Test 2: Student Management
- [ ] Navigate to Student Data Management
- [ ] Verify student list loads from database
- [ ] Search for a student - works correctly
- [ ] Add a new student:
  - [ ] Fill in form (all fields except optional ones)
  - [ ] Submit
  - [ ] New student appears in list
  - [ ] Can select and edit the new student
- [ ] Refresh page - student still visible

#### Test 3: Course Management
- [ ] Navigate to Course Management
- [ ] Verify courses load from database
- [ ] Verify course dropdowns in forms are populated
- [ ] Add a new course
- [ ] Verify course appears in schedules and enrollments

#### Test 4: Room & Committee Management
- [ ] Navigate to Committee definition or assignment pages
- [ ] Verify rooms load from database (not hardcoded)
- [ ] View a committee:
  - [ ] Room name comes from database
  - [ ] Capacity matches database
- [ ] Add a new room to database via backend
- [ ] Verify new room appears in committee form dropdowns

#### Test 5: Dropdown Accuracy
- [ ] Create a new student form
- [ ] Verify all dropdowns are populated:
  - [ ] Faculties (from `/faculties/`)
  - [ ] Departments (from `/departments/`)
  - [ ] Levels (static: المستوى الأول, المستوى الثاني, etc.)
  - [ ] Status (static: مقيد, موقوف, etc.)
  - [ ] Cities (static: demietta, cairo, etc.)
- [ ] Filter department by faculty:
  - [ ] Select faculty → departments update
  - [ ] Select different faculty → departments change

#### Test 6: Network Validation
- [ ] Open Chrome DevTools (F12)
- [ ] Go to Network tab
- [ ] Reload page
- [ ] Filter by "Fetch/XHR"
- [ ] Verify API calls are made to:
  - [ ] `GET /faculties/`
  - [ ] `GET /departments/`
  - [ ] `GET /courses/`
  - [ ] `GET /rooms/`
  - [ ] `GET /users/` (for instructors)
- [ ] Verify NO hardcoded JSON data in responses
- [ ] Verify NO 404 errors (all endpoints return 200/500 appropriately)
- [ ] Check response times:
  - [ ] Should be < 500ms for most endpoints
  - [ ] Cache should reduce repeat request times

#### Test 7: Data Persistence
- [ ] Add a student with: ID, name, faculty, department
- [ ] Don't refresh page yet
- [ ] In different tab/window, login as different user
- [ ] Check if new student appears
- [ ] Go back to first tab and refresh
- [ ] Verify student still there
- [ ] In database, run:
  ```sql
  SELECT * FROM students WHERE student_id = 'NEW_STUDENT_ID';
  ```
- [ ] Verify record exists in database

#### Test 8: Error Handling
- [ ] Stop the backend (Ctrl+C in terminal)
- [ ] Try to load a page in frontend
- [ ] Should see error message:
  ```
  تعذر تحميل البيانات: Network error
  ```
- [ ] Should NOT crash the entire app
- [ ] Restart backend
- [ ] Page should load successfully without refresh

#### Test 9: Large Dataset Performance
- [ ] Backend: Load test data if available
  - [ ] 5000+ students
  - [ ] 200+ courses
  - [ ] 100+ rooms
- [ ] Frontend: Load student list page
  - [ ] Should complete within 5 seconds
  - [ ] Should not freeze UI
- [ ] Search for a student with large dataset
  - [ ] Search should complete within 2 seconds
  - [ ] Results should be accurate

#### Test 10: Department Isolation (Faculty Admins)
- [ ] Login as faculty_admin for FCAI
- [ ] View student list - should show only FCAI students
- [ ] View courses - should show only FCAI courses
- [ ] Add student - should default to FCAI faculty
- [ ] Login as different faculty_admin
- [ ] Should see only that faculty's data

### 5. Browser Compatibility Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if Mac available)
- [ ] Edge (latest)
- For each browser:
  - [ ] Form options load correctly
  - [ ] Dropdowns work properly
  - [ ] No console errors
  - [ ] API calls succeed

### 6. Performance Optimization Check
- [ ] Form options are cached (5-minute TTL)
- [ ] Repeated API calls return cached data
- [ ] Test by:
  - [ ] Open student form
  - [ ] Check Network tab for `/faculties/` call
  - [ ] Open another student form immediately
  - [ ] `/faculties/` call should NOT appear (cached)
  - [ ] Wait 5+ minutes
  - [ ] Open student form again
  - [ ] `/faculties/` call should appear (cache expired)

### 7. Documentation & Knowledge Transfer
- [ ] Read MIGRATION_STATUS.md
- [ ] Read this IMPLEMENTATION_CHECKLIST.md
- [ ] Review code comments in:
  - [ ] lookupApi.ts
  - [ ] formOptions.ts
  - [ ] committeesData.ts
- [ ] Document any custom configurations made
- [ ] Create runbooks for:
  - [ ] How to add a new faculty
  - [ ] How to seed new data
  - [ ] How to diagnose API issues

### 8. Production Deployment Checklist
- [ ] All local tests pass
- [ ] Staging environment prepared
- [ ] Database backed up (full backup)
- [ ] Migration scripts tested in staging
- [ ] Performance tests in staging environment passed
- [ ] Security scan of API endpoints
- [ ] SSL certificates configured (if HTTPS)
- [ ] Monitoring/logging setup:
  - [ ] API request logging
  - [ ] Database query logging
  - [ ] Error tracking (e.g., Sentry)
- [ ] Rollback plan documented
- [ ] User communication prepared (if needed)

## Quick Troubleshooting

### Issue: "Failed to fetch dynamic form options"
**Solution:**
1. Check if backend is running: `http://localhost:8000/health`
2. Check if database is accessible
3. Check browser console for specific error
4. Verify .env.local has correct `VITE_API_URL`

### Issue: Dropdowns are empty
**Solution:**
1. Check if data exists in database:
   ```sql
   SELECT COUNT(*) FROM faculties;
   SELECT COUNT(*) FROM departments;
   ```
2. Check API endpoint directly:
   ```bash
   curl http://localhost:8000/faculties/
   ```
3. If empty, run seed script:
   ```bash
   cd backend && python seed.py
   ```

### Issue: CORS error when loading form options
**Solution:**
1. Check backend CORS configuration in `app/main.py`
2. Verify ALLOWED_ORIGINS includes your frontend URL
3. Restart backend
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: Student creation fails
**Solution:**
1. Check browser console for error message
2. Check backend logs for validation errors
3. Verify all required fields are filled
4. Check if student_id already exists
5. Check database permissions

## Sign-Off

- [ ] All tests completed successfully
- [ ] No critical issues found
- [ ] Team trained on new system
- [ ] Documentation complete
- [ ] Ready for production deployment

**Tested By**: ________________  
**Date**: ________________  
**Sign-Off**: ________________  

---

## Contact & Support

If issues arise during implementation:
1. Check MIGRATION_STATUS.md for detailed info
2. Review browser console and Network tab in DevTools
3. Check backend logs: `docker logs dumlis-api` (if containerized)
4. Check database logs
5. Review code comments in lookupApi.ts and formOptions.ts
