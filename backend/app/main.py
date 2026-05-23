"""
DUMLIS - FastAPI Application Entry Point
"""
import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from app.routers import (
    faculties, departments, students, courses, enrollments,
    grades, attendance, financial, schedules, rooms,
    committees, registration_requests, course_closures, report_signatures,
    programs, regulations, academic_rules, auth,
    student_requirements, student_documents, activity_log, users,
    course_equivalences, system_settings, survey_rules, staff,
    academic_calendar, announcements
)

# ── Logging Setup ────────────────────────────────────────────────────────────
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DUMLIS University Management API",
    description=(
        "RESTful API for Damietta University Management and Learning Information System. "
        "Covers students, courses, enrollments, grades, attendance, financial records, "
        "schedules, rooms, committees, and registration requests."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ── Security Middleware ──────────────────────────────────────────────────────

# GZIP Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Trusted Host Middleware
if os.getenv("APP_ENV") == "production":
    # Extract hostnames from ALLOWED_ORIGINS URLs (removes scheme and port)
    allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "localhost")
    from urllib.parse import urlparse
    allowed_hosts = []
    for origin in allowed_origins_str.split(","):
        origin = origin.strip()
        if origin:
            parsed = urlparse(origin)
            hostname = parsed.hostname or origin
            allowed_hosts.append(hostname)
    if allowed_hosts:
        app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

# CORS Middleware (added last so it executes first)
allowed_origins_str = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3006,http://localhost:5173,https://dumlis-final.railway.app,https://dumlis-final-production.up.railway.app,https://dumlis-final.mahmouddiabline1.workers.dev"
)
ALLOWED_ORIGINS = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]
logger.info(f"CORS allowed origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# ── Global Exception Handler ─────────────────────────────────────────────────

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc) if os.getenv("DEBUG") == "True" else "An error occurred"
        }
    )

# ── Routers ───────────────────────────────────────────────────────
logger.info("Loading routers...")
app.include_router(auth.router,                   prefix="/auth",                   tags=["Authentication"])
logger.info("Auth router loaded")
app.include_router(faculties.router,              prefix="/faculties",              tags=["Faculties"])
app.include_router(departments.router,            prefix="/departments",            tags=["Departments"])
app.include_router(students.router,               prefix="/students",               tags=["Students"])
app.include_router(courses.router,                prefix="/courses",                tags=["Courses"])
app.include_router(enrollments.router,            prefix="/enrollments",            tags=["Enrollments"])
app.include_router(grades.router,                 prefix="/grades",                 tags=["Grades"])
# مسار بديل: بعض إضافات المتصفح تحجب كلمة "grades" في المسار فيظهر Failed to fetch
app.include_router(grades.router,                 prefix="/student-grades",          tags=["Student Grades"])
app.include_router(attendance.router,             prefix="/attendance",             tags=["Attendance"])
app.include_router(financial.router,              prefix="/financial",              tags=["Financial Records"])
app.include_router(schedules.router,              prefix="/schedules",              tags=["Schedules"])
app.include_router(rooms.router,                  prefix="/rooms",                  tags=["Rooms"])
app.include_router(committees.router,             prefix="/committees",             tags=["Committees"])
app.include_router(registration_requests.router,  prefix="/registration-requests",  tags=["Registration Requests"])
app.include_router(course_closures.router,        prefix="/course-closures",        tags=["Course Closures"])
app.include_router(course_equivalences.router,    prefix="/course-equivalences",    tags=["Course Equivalences"])
app.include_router(report_signatures.router,      prefix="/report-signatures",      tags=["Report Signatures"])
app.include_router(programs.router,               prefix="/programs",               tags=["Programs"])
app.include_router(regulations.router,            prefix="/regulations",            tags=["Study Regulations"])
app.include_router(academic_rules.router,         prefix="/academic-rules",         tags=["Academic Rules"])
app.include_router(student_requirements.router,   prefix="/student-requirements",   tags=["Student Requirements"])
app.include_router(student_documents.router,      prefix="/student-documents",      tags=["Student Documents"])
app.include_router(activity_log.router,            prefix="/activity-logs",          tags=["Activity Logs"])
app.include_router(users.router,                   prefix="/users",                  tags=["User Management"])
app.include_router(system_settings.router,      prefix="/system-settings",        tags=["System Settings"])
app.include_router(survey_rules.router,         prefix="/survey-rules",           tags=["Survey Rules"])
app.include_router(staff.router,                 prefix="/staff",                  tags=["Staff"])
app.include_router(academic_calendar.router,    prefix="/academic-calendar",      tags=["Academic Calendar"])
app.include_router(announcements.router,        prefix="/announcements",          tags=["Announcements"])


@app.get("/", tags=["Health"])
def root():
    logger.info("Root endpoint called - API is responsive")
    return {
        "status": "ok",
        "system": "DUMLIS API v1.0.0",
        "environment": os.getenv("APP_ENV", "development"),
        "routers_loaded": "yes"
    }


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": os.getenv("APP_ENV", "development")
    }


@app.get("/ready", tags=["Health"])
def readiness():
    """Readiness check - verify database connection"""
    try:
        from app.database import SessionLocal
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={"status": "not ready", "error": "Database connection failed"}
        )
