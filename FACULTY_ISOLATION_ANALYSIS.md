# Faculty Isolation Problem - Root Cause Analysis

## The Problem

Faculty data is mixing across all pages. The Faculty of Science (SCI) shows Computer Science (FCAI) courses and programs. ALL faculties except Computer Science have data corruption issues.

## Root Cause

### 1. Two-Tier Architecture Issue
The system uses **two different data sources**:

- **Tier 1: Real Database** (via `DbBackedPage`)
  - ~35 pages use real database data with proper faculty isolation
  - Examples: student_list, course_catalog, financial_records
  - Status: ✅ Working correctly with faculty filtering

- **Tier 2: Mock Data** (via `DynamicPage`)  
  - ~50+ pages use hardcoded mock data
  - Generated dynamically from `pageConfig.ts`
  - **Problem**: Uses HARDCODED IT-ONLY programs (CS, IT, IS) for ALL faculties

### 2. The Hardcoded Programs Issue

**File**: `data/pageConfig.ts` lines 2800-2803

```typescript
const programs = academicRules.studySystem.graduationRequirementsDetails.majorRequirements.programs;
const programsList = Object.keys(programs).filter(key => programs[key as 'CS' | 'IT' | 'IS']);
```

**Problem**: Every faculty's academic rules contain the SAME hardcoded programs:
- CS (علوم الحاسب - Computer Science)
- IT (تكنولوجيا المعلومات - Information Technology)
- IS (نظم المعلومات - Information Systems)

When you select Faculty of Science (SCI):
1. System fetches SCI's academic rules
2. Extracts programs array: CS, IT, IS (same for all faculties!)
3. Generates pages using IT-focused course names
4. Filters mock students by department name (e.g., "علوم الحاسب")
5. Returns courses from CS, IT, IS programs regardless of faculty context

### 3. Pages Still Using Mock Data

These 50+ pages show mixing of IT data in all faculties:
- program_data, view_departments, manage_departments
- program_rules, study_courses, bylaw_courses
- course_schedules, student_personal_schedules
- room_utilization, instructor_workload
- equivalent_courses (before our fix)
- classroom_assignments, assign_room
- academic_rules display
- And 30+ more...

### 4. Why This Only Affects Non-IT Faculties

Faculty of Computers and AI (FCAI) works correctly because:
- The hardcoded programs ARE for IT (CS, IT, IS)
- When FCAI academic rules load, they contain CS, IT, IS programs
- The mock data generation matches what's actually in FCAI
- **Pure coincidence** - not by design!

## Why Database Isolation Works

The backend properly isolates data:
- `/students/` with `faculty_id=SCI` returns only SCI students
- `/courses/` with `faculty_id=SCI` returns only SCI courses
- All API endpoints check `scoped_faculty_id` from user token
- `get_scoped_faculty_id()` in auth.py enforces this

**The database is correct. The problem is the mock data layer.**

## Solution Options

### Option A: Move All Mock Pages to Database (RECOMMENDED)
**Effort**: 🔴 Very High (2-3 days)
- Convert all 50+ remaining DynamicPage to DbBackedPage
- Create API endpoints for each page type
- Remove mock data generation from pageConfig.ts
- Benefit: Complete real-time data, no manual seeding needed

### Option B: Fix Mock Data Generation (Quick Fix)
**Effort**: 🟢 Low (2-3 hours)
- Extract faculty-specific programs from database
- Replace hardcoded CS, IT, IS with actual faculty programs
- Keep using mock generation but make it faculty-aware
- Risk: Still not real-time, requires reseeding

### Option C: Hybrid Approach (BALANCED)
**Effort**: 🟡 Medium (4-6 hours)
**Recommended**: Start with high-priority pages, convert to DB gradually

## What's Really Happening

When you navigate to Faculty of Science and view "البرامج الدراسية" (programs):

```
Frontend: "SCI" faculty selected
  ↓
pageConfig.getPageConfig('program_data', 'SCI')
  ↓
Creates default academic rules with hardcoded { CS, IT, IS } programs
  ↓
Data shown: 
  - Computer Science Bachelor (علوم الحاسب)
  - Information Technology Bachelor (تكنولوجيا المعلومات)
  - Information Systems Bachelor (نظم المعلومات)
  ↓
Result: ❌ User sees IT programs in Science faculty!
```

## Proper Flow (For DB-Backed Pages)

```
Frontend: "SCI" faculty selected
  ↓
DbBackedPage calls fetchForPage('course_catalog', 'SCI')
  ↓
Calls: coursesApi.list({ faculty_id: 'SCI' })
  ↓
API calls: GET /courses/?faculty_id=SCI
  ↓
Backend verifies scoped_faculty_id == SCI (user's permission)
  ↓
Database returns: Only SCI courses (MATH101, BIO201, CHEM301, etc.)
  ↓
Result: ✅ Correct data!
```

## Files Affected

### Pages Using Real Data (DB-Backed) ✅
- student_list
- course_catalog
- financial_records
- detailed_grades
- detailed_attendance
- course_schedules
- program_data (only API-backed, not pageConfig)
- study_regulations
- And 25+ others in `DB_BACKED_IDS`

### Pages Using Mock Data (DynamicPage) ❌
- program_data (from pageConfig)
- view_departments
- manage_departments
- program_rules
- study_courses
- bylaw_courses
- course_schedules (from pageConfig)
- room_utilization
- instructor_workload
- assign_room
- classroom_assignments
- equivalent_courses (before fix)
- And 30+ more...

## Recommended Next Steps

1. **Identify which mock-data pages are critical** (used regularly)
2. **Prioritize converting top 10-15 pages to database**
3. **Create API endpoints** for those page types
4. **Update DbBackedPage** to handle those pages
5. **Remove mock generation** from pageConfig.ts for those pages
6. **Gradually convert remaining pages** or keep them as-is if rarely used

---

**Status**: 🔴 System-wide isolation failure in mock data layer
**Severity**: High (affects majority of pages except student/course views)
**Root Cause**: Hardcoded IT programs used across all faculties
**Quick Fix**: Convert high-priority pages to database backing
