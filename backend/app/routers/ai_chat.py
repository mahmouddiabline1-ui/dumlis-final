"""
DUMLIS - AI Chat Router
Full agentic access: admins can read/write everything; students read their own data only.
Uses direct DB queries — no HTTP self-calls.
"""
import os
import json
import uuid as _uuid
from typing import Any, Optional
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from openai import AsyncOpenAI
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.routers.auth import get_current_user, pwd_context
from app import models

router = APIRouter()
ADMIN_ROLES = {"super_admin", "faculty_admin", "student_affairs"}

# ── Provider registry (tried in order, skip on 429 / auth error) ──────────────
PROVIDERS = [
    {
        "env":      "GROQ_API_KEY",
        "base_url": "https://api.groq.com/openai/v1",
        "model":    "llama-3.3-70b-versatile",
        "name":     "Groq-70B",
    },
    {
        "env":      "GEMINI_API_KEY",
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
        "model":    "gemini-2.0-flash",
        "name":     "Gemini-Flash",
    },
    {
        "env":      "CEREBRAS_API_KEY",
        "base_url": "https://api.cerebras.ai/v1",
        "model":    "llama3.3-70b",
        "name":     "Cerebras-70B",
    },
    {
        "env":      "SAMBANOVA_API_KEY",
        "base_url": "https://api.sambanova.ai/v1",
        "model":    "Meta-Llama-3.3-70B-Instruct",
        "name":     "SambaNova-70B",
    },
    {
        "env":      "CLOUDFLARE_API_TOKEN",
        "base_url": None,   # built dynamically from account id
        "model":    "@cf/meta/llama-3.1-70b-instruct",
        "name":     "Cloudflare-70B",
    },
    {
        "env":      "GROQ_API_KEY",
        "base_url": "https://api.groq.com/openai/v1",
        "model":    "llama-3.1-8b-instant",
        "name":     "Groq-8B-fallback",
    },
]
_provider_clients: dict[str, AsyncOpenAI] = {}


def _get_client(provider: dict) -> Optional[AsyncOpenAI]:
    key = os.getenv(provider["env"])
    if not key:
        return None
    base_url = provider["base_url"]
    if base_url is None:
        # Cloudflare: build URL from account id
        account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
        if not account_id:
            return None
        base_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1"
    cache_key = f"{provider['env']}:{base_url}"
    if cache_key not in _provider_clients:
        _provider_clients[cache_key] = AsyncOpenAI(api_key=key, base_url=base_url)
    return _provider_clients[cache_key]


def _should_skip_provider(e: Exception) -> bool:
    """Return True for any API-level error that means 'try next provider'."""
    s = str(e).lower()
    return any(x in s for x in [
        "429", "rate_limit", "quota",
        "401", "403", "404",
        "invalid_api_key", "invalid api key", "please pass a valid", "api key",
        "authentication", "decommissioned", "not_found", "notfound",
        "does not exist", "model_not_found", "no access",
        "tool_use_failed", "tool call validation", "parameters for tool",
        "did not match schema",
    ])


# ── Schemas ───────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

class ChatResponse(BaseModel):
    response: str


# ── Prompts ───────────────────────────────────────────────────────────────────

ADMIN_SYSTEM = """أنت مساعد إداري لنظام DUMLIS الجامعي. لديك أدوات للقراءة والتعديل.

قواعد مهمة:
1. استدعِ أداة واحدة أو اثنتين على الأكثر لكل سؤال، ثم أجب فوراً.
2. بعد حصولك على نتيجة أي أداة، قدّم الإجابة نصاً مباشرة — لا تستدعي أدوات إضافية إلا لو الطلب يتطلب ذلك صراحةً.
3. للأسئلة الإحصائية (كم عدد، كم طالب، إلخ): استخدم get_statistics مرة واحدة فقط ثم أجب.
4. تحدث بالعربية دائماً.
5. بعد أي تعديل، اذكر ما تم بوضوح في جملة أو اثنتين.
"""

STUDENT_SYSTEM = """أنت مساعد للطلاب في نظام DUMLIS — تعرض بيانات الطالب المسجّل فقط (قراءة فقط).
تتحدث بالعربية دائماً. لا يمكنك تعديل أي بيانات أو الوصول لبيانات طلاب آخرين.
"""


# ── Tool helper ───────────────────────────────────────────────────────────────

def _row(obj, keys=None) -> dict:
    cols = keys or [c.name for c in obj.__table__.columns]
    d = {}
    for k in cols:
        val = getattr(obj, k, None)
        if hasattr(val, 'isoformat'):
            val = val.isoformat()
        elif not isinstance(val, (str, int, float, bool, type(None))):
            val = str(val)
        d[k] = val
    return d

STUDENT_KEYS = ["student_id","name","faculty_id","department_id","level","status","fees_status","phone","email","gpa"]

def _fn(name: str, desc: str, props: dict, required: list = None) -> dict:
    return {"type": "function", "function": {
        "name": name, "description": desc,
        "parameters": {"type": "object", "properties": props,
                       **({"required": required} if required else {})}}}


# ── Tool Definitions ──────────────────────────────────────────────────────────

def _s(t): return {"type": t}
def _si(): return {"type": "integer"}
def _sn(): return {"type": "number"}
def _sb(): return {"type": "boolean"}

ADMIN_TOOLS = [
    _fn("search_students",   "بحث طلاب",      {"search": _s("string"), "faculty_id": _s("string"), "level": _si(), "status": _s("string"), "fees_status": _s("string"), "limit": _si()}),
    _fn("get_student",       "بيانات طالب",   {"student_id": _s("string")}, ["student_id"]),
    _fn("create_student",    "إنشاء طالب",    {"student_id": _s("string"), "name": _s("string"), "faculty_id": _s("string"), "level": _si(), "regulation": _s("string"), "national_id": _s("string"), "phone": _s("string"), "email": _s("string")}, ["student_id","name","faculty_id","level","regulation"]),
    _fn("update_student",    "تعديل طالب",    {"student_id": _s("string"), "name": _s("string"), "status": _s("string"), "fees_status": _s("string"), "phone": _s("string"), "email": _s("string"), "level": _si(), "gpa": _sn(), "city": _s("string")}, ["student_id"]),
    _fn("delete_student",    "حذف طالب",      {"student_id": _s("string")}, ["student_id"]),
    _fn("block_student",     "حجب طالب",      {"student_id": _s("string"), "reason": _s("string"), "notes": _s("string")}, ["student_id","reason"]),
    _fn("unblock_student",   "رفع الحجب",     {"student_id": _s("string")}, ["student_id"]),
    _fn("list_student_blocks","الطلاب المحجوبون",{"faculty_id": _s("string"), "status": _s("string")}),

    _fn("get_student_grades","درجات طالب",    {"student_id": _s("string"), "semester": _s("string")}, ["student_id"]),
    _fn("update_grade",      "تعديل درجة",    {"grade_id": _si(), "midterm": _sn(), "final_exam": _sn(), "assignments": _sn(), "oral": _sn(), "practical": _sn(), "total": _sn(), "grade_letter": _s("string"), "grade_points": _sn()}, ["grade_id"]),
    _fn("create_grade",      "إضافة درجة",    {"student_id": _s("string"), "course_id": _s("string"), "semester": _s("string"), "midterm": _sn(), "final_exam": _sn(), "total": _sn(), "grade_letter": _s("string")}, ["student_id","course_id","semester"]),

    _fn("get_student_attendance","حضور طالب", {"student_id": _s("string"), "course_id": _s("string")}, ["student_id"]),
    _fn("update_attendance", "تعديل حضور",    {"attendance_id": _si(), "status": _s("string"), "notes": _s("string")}, ["attendance_id","status"]),

    _fn("get_student_financial","ماليات طالب",{"student_id": _s("string")}, ["student_id"]),
    _fn("update_financial_record","تحديث مالية",{"record_id": _si(), "paid_amount": _sn(), "status": _s("string"), "receipt_no": _s("string")}, ["record_id"]),
    _fn("list_financial_records","قائمة ماليات",{"faculty_id": _s("string"), "student_id": _s("string"), "status": _s("string"), "academic_year": _s("string"), "limit": _si()}),

    _fn("list_enrollments",  "قائمة تسجيلات", {"student_id": _s("string"), "course_id": _s("string"), "semester": _s("string"), "faculty_id": _s("string"), "limit": _si()}),
    _fn("create_enrollment", "تسجيل في مادة", {"student_id": _s("string"), "course_id": _s("string"), "semester": _s("string"), "faculty_id": _s("string")}, ["student_id","course_id","semester"]),
    _fn("update_enrollment", "تعديل تسجيل",   {"enrollment_id": _si(), "status": _s("string")}, ["enrollment_id","status"]),
    _fn("delete_enrollment", "حذف تسجيل",     {"enrollment_id": _si()}, ["enrollment_id"]),

    _fn("list_courses",      "قائمة مواد",    {"faculty_id": _s("string"), "level": _si(), "semester": _s("string"), "limit": _si()}),
    _fn("create_course",     "إنشاء مادة",    {"id": _s("string"), "name": _s("string"), "level": _si(), "faculty_id": _s("string"), "credit_hours": _si(), "course_type": _s("string"), "semester": _s("string")}, ["id","name","level","faculty_id"]),
    _fn("update_course",     "تعديل مادة",    {"course_id": _s("string"), "name": _s("string"), "level": _si(), "credit_hours": _si(), "semester": _s("string"), "course_type": _s("string")}, ["course_id"]),
    _fn("delete_course",     "حذف مادة",      {"course_id": _s("string")}, ["course_id"]),

    _fn("list_faculties",    "قائمة الكليات", {}),
    _fn("list_departments",  "قائمة الأقسام", {"faculty_id": _s("string")}),

    _fn("list_rooms",        "قائمة القاعات", {"room_type": _s("string"), "status": _s("string")}),
    _fn("update_room",       "تعديل قاعة",    {"room_id": _s("string"), "name": _s("string"), "capacity": _si(), "status": _s("string")}, ["room_id"]),

    _fn("list_committees",   "قائمة اللجان",  {"faculty_id": _s("string"), "semester": _s("string")}),
    _fn("update_committee",  "تعديل لجنة",    {"committee_id": _si(), "supervisor": _s("string"), "exam_date": _s("string"), "status": _s("string")}, ["committee_id"]),

    _fn("list_registration_requests","طلبات التسجيل",{"faculty_id": _s("string"), "status": _s("string"), "limit": _si()}),
    _fn("update_registration_request","قبول/رفض طلب",{"request_id": _s("string"), "status": _s("string"), "admin_response": _s("string")}, ["request_id","status"]),

    _fn("list_announcements","قائمة إعلانات", {"faculty_id": _s("string")}),
    _fn("create_announcement","إنشاء إعلان",  {"title": _s("string"), "body": _s("string"), "faculty_id": _s("string"), "priority": _s("string")}, ["title","body"]),
    _fn("update_announcement","تعديل إعلان",  {"announcement_id": _s("string"), "title": _s("string"), "body": _s("string"), "is_active": _sb()}, ["announcement_id"]),
    _fn("delete_announcement","حذف إعلان",    {"announcement_id": _s("string")}, ["announcement_id"]),

    _fn("list_users",        "قائمة المستخدمين",{"faculty_id": _s("string"), "role": _s("string")}),
    _fn("list_staff",        "قائمة الموظفين",  {"faculty_id": _s("string")}),

    _fn("get_statistics",    "إحصائيات",      {"faculty_id": _s("string")}),
    _fn("get_activity_logs", "سجل النشاطات",  {"faculty_id": _s("string"), "entity_type": _s("string"), "limit": _si()}),
]

STUDENT_TOOLS = [
    _fn("get_my_profile",    "بياناتي",       {}),
    _fn("get_my_grades",     "درجاتي",        {"semester": _s("string")}),
    _fn("get_my_attendance", "حضوري",         {"course_id": _s("string")}),
    _fn("get_my_financial",  "ماليتي",        {}),
    _fn("get_my_schedule",   "جدولي",         {"semester": _s("string")}),
    _fn("get_my_enrollments","موادي",          {"semester": _s("string")}),
    _fn("list_announcements","الإعلانات",     {"faculty_id": _s("string")}),
]


# ── Tool Execution ────────────────────────────────────────────────────────────

def _int(v, default=None):
    try: return int(v)
    except (TypeError, ValueError): return default

def _float(v, default=None):
    try: return float(v)
    except (TypeError, ValueError): return default

async def run_tool(name: str, args: dict, user: models.User, db: Session) -> Any:
    # Coerce common mistyped params (LLM sometimes sends strings instead of numbers)
    for k in ("limit", "level", "grade_id", "attendance_id", "record_id",
              "enrollment_id", "committee_id"):
        if k in args and args[k] is not None:
            args[k] = _int(args[k])
    for k in ("midterm", "final_exam", "assignments", "oral", "practical",
              "total", "grade_points", "paid_amount", "gpa"):
        if k in args and args[k] is not None:
            args[k] = _float(args[k])

    # ── Students ──────────────────────────────────────────────────────────────
    if name == "search_students":
        q = db.query(models.Student)
        if args.get("search"):
            t = f"%{args['search']}%"
            q = q.filter(models.Student.name.ilike(t) | models.Student.student_id.ilike(t))
        if args.get("faculty_id"):  q = q.filter(models.Student.faculty_id == args["faculty_id"])
        if args.get("level"):       q = q.filter(models.Student.level == args["level"])
        if args.get("status"):      q = q.filter(models.Student.status == args["status"])
        if args.get("fees_status"): q = q.filter(models.Student.fees_status == args["fees_status"])
        rows = q.limit(min(args.get("limit", 10), 15)).all()
        return {"count": len(rows), "students": [_row(s, STUDENT_KEYS) for s in rows]}

    elif name == "get_student":
        s = db.get(models.Student, args["student_id"])
        return _row(s, STUDENT_KEYS) if s else {"error": "الطالب غير موجود"}

    elif name == "create_student":
        s = models.Student(**{k: v for k, v in args.items() if v is not None})
        db.add(s); db.commit()
        return {"success": True, "student": _row(s)}

    elif name == "update_student":
        s = db.get(models.Student, args["student_id"])
        if not s: return {"error": "الطالب غير موجود"}
        for f in ("name","status","fees_status","phone","email","level","gpa","city"):
            if args.get(f) is not None: setattr(s, f, args[f])
        db.commit()
        return {"success": True, "student": _row(s)}

    elif name == "delete_student":
        s = db.get(models.Student, args["student_id"])
        if not s: return {"error": "الطالب غير موجود"}
        db.delete(s); db.commit()
        return {"success": True, "deleted": args["student_id"]}

    elif name == "block_student":
        b = models.StudentBlock(
            student_id=args["student_id"],
            reason=args["reason"],
            notes=args.get("notes"),
            faculty_id=user.faculty_id,
            blocked_by=user.id,
        )
        db.add(b); db.commit()
        return {"success": True, "block_id": b.id}

    elif name == "unblock_student":
        b = db.query(models.StudentBlock).filter(
            models.StudentBlock.student_id == args["student_id"],
            models.StudentBlock.status == "محجوب"
        ).first()
        if not b: return {"error": "لا يوجد حجب نشط لهذا الطالب"}
        b.status = "مرفوع"
        db.commit()
        return {"success": True}

    elif name == "list_student_blocks":
        q = db.query(models.StudentBlock)
        if args.get("faculty_id"): q = q.filter(models.StudentBlock.faculty_id == args["faculty_id"])
        if args.get("status"):     q = q.filter(models.StudentBlock.status == args["status"])
        rows = q.limit(50).all()
        return {"count": len(rows), "blocks": [_row(r) for r in rows]}

    # ── Grades ────────────────────────────────────────────────────────────────
    elif name == "get_student_grades":
        q = db.query(models.Grade).filter(models.Grade.student_id == args["student_id"])
        if args.get("semester"): q = q.filter(models.Grade.semester == args["semester"])
        rows = q.all()
        return {"count": len(rows), "grades": [_row(g, ["id","student_id","course_id","semester","midterm","final_exam","total","grade_letter","grade_points"]) for g in rows]}

    elif name == "update_grade":
        g = db.get(models.Grade, args["grade_id"])
        if not g: return {"error": "الدرجة غير موجودة"}
        for f in ("midterm","final_exam","assignments","oral","practical","total","grade_letter","grade_points"):
            if args.get(f) is not None: setattr(g, f, args[f])
        db.commit()
        return {"success": True, "grade": _row(g)}

    elif name == "create_grade":
        g = models.Grade(**{k: v for k, v in args.items() if v is not None})
        db.add(g); db.commit()
        return {"success": True, "grade": _row(g)}

    # ── Attendance ────────────────────────────────────────────────────────────
    elif name == "get_student_attendance":
        q = db.query(models.AttendanceRecord).filter(
            models.AttendanceRecord.student_id == args["student_id"])
        if args.get("course_id"): q = q.filter(models.AttendanceRecord.course_id == args["course_id"])
        rows = q.order_by(models.AttendanceRecord.attendance_date.desc()).limit(100).all()
        present = sum(1 for r in rows if r.status == "حاضر")
        return {"total": len(rows), "present": present, "absent": len(rows)-present,
                "rate": round(present/len(rows)*100,1) if rows else 0,
                "records": [_row(r) for r in rows[:30]]}

    elif name == "update_attendance":
        r = db.get(models.AttendanceRecord, args["attendance_id"])
        if not r: return {"error": "السجل غير موجود"}
        r.status = args["status"]
        if args.get("notes"): r.notes = args["notes"]
        db.commit()
        return {"success": True, "record": _row(r)}

    # ── Financial ─────────────────────────────────────────────────────────────
    elif name == "get_student_financial":
        rows = db.query(models.FinancialRecord).filter(
            models.FinancialRecord.student_id == args["student_id"]).all()
        total_due  = sum(float(r.amount or 0) for r in rows)
        total_paid = sum(float(r.paid_amount or 0) for r in rows)
        return {"total_due": total_due, "total_paid": total_paid,
                "remaining": total_due-total_paid, "records": [_row(r) for r in rows]}

    elif name == "update_financial_record":
        r = db.get(models.FinancialRecord, args["record_id"])
        if not r: return {"error": "السجل غير موجود"}
        for f in ("paid_amount","status","receipt_no"):
            if args.get(f) is not None: setattr(r, f, args[f])
        db.commit()
        return {"success": True, "record": _row(r)}

    elif name == "list_financial_records":
        q = db.query(models.FinancialRecord)
        if args.get("faculty_id"):    q = q.filter(models.FinancialRecord.faculty_id == args["faculty_id"])
        if args.get("student_id"):    q = q.filter(models.FinancialRecord.student_id == args["student_id"])
        if args.get("status"):        q = q.filter(models.FinancialRecord.status == args["status"])
        if args.get("academic_year"): q = q.filter(models.FinancialRecord.academic_year == args["academic_year"])
        rows = q.limit(args.get("limit", 50)).all()
        return {"count": len(rows), "records": [_row(r) for r in rows]}

    # ── Enrollments ───────────────────────────────────────────────────────────
    elif name == "list_enrollments":
        q = db.query(models.Enrollment)
        if args.get("student_id"): q = q.filter(models.Enrollment.student_id == args["student_id"])
        if args.get("course_id"):  q = q.filter(models.Enrollment.course_id == args["course_id"])
        if args.get("semester"):   q = q.filter(models.Enrollment.semester == args["semester"])
        if args.get("faculty_id"): q = q.filter(models.Enrollment.faculty_id == args["faculty_id"])
        rows = q.limit(args.get("limit", 50)).all()
        return {"count": len(rows), "enrollments": [_row(r) for r in rows]}

    elif name == "create_enrollment":
        e = models.Enrollment(
            student_id=args["student_id"],
            course_id=args["course_id"],
            semester=args["semester"],
            faculty_id=args.get("faculty_id"),
            status="مسجل",
        )
        db.add(e); db.commit()
        return {"success": True, "enrollment": _row(e)}

    elif name == "update_enrollment":
        e = db.get(models.Enrollment, args["enrollment_id"])
        if not e: return {"error": "التسجيل غير موجود"}
        e.status = args["status"]
        db.commit()
        return {"success": True, "enrollment": _row(e)}

    elif name == "delete_enrollment":
        e = db.get(models.Enrollment, args["enrollment_id"])
        if not e: return {"error": "التسجيل غير موجود"}
        db.delete(e); db.commit()
        return {"success": True}

    # ── Courses ───────────────────────────────────────────────────────────────
    elif name == "list_courses":
        q = db.query(models.Course)
        if args.get("faculty_id"): q = q.filter(models.Course.faculty_id == args["faculty_id"])
        if args.get("level"):      q = q.filter(models.Course.level == args["level"])
        if args.get("semester"):   q = q.filter(models.Course.semester == args["semester"])
        rows = q.limit(args.get("limit", 50)).all()
        return {"count": len(rows), "courses": [_row(c) for c in rows]}

    elif name == "create_course":
        c = models.Course(**{k: v for k, v in args.items() if v is not None})
        db.add(c); db.commit()
        return {"success": True, "course": _row(c)}

    elif name == "update_course":
        c = db.get(models.Course, args["course_id"])
        if not c: return {"error": "المادة غير موجودة"}
        for f in ("name","level","credit_hours","semester","course_type"):
            if args.get(f) is not None: setattr(c, f, args[f])
        db.commit()
        return {"success": True, "course": _row(c)}

    elif name == "delete_course":
        c = db.get(models.Course, args["course_id"])
        if not c: return {"error": "المادة غير موجودة"}
        db.delete(c); db.commit()
        return {"success": True}

    # ── Faculties & Departments ────────────────────────────────────────────────
    elif name == "list_faculties":
        rows = db.query(models.Faculty).all()
        return {"count": len(rows), "faculties": [_row(f) for f in rows]}

    elif name == "list_departments":
        q = db.query(models.Department)
        if args.get("faculty_id"): q = q.filter(models.Department.faculty_id == args["faculty_id"])
        rows = q.all()
        return {"count": len(rows), "departments": [_row(d) for d in rows]}

    # ── Rooms ─────────────────────────────────────────────────────────────────
    elif name == "list_rooms":
        q = db.query(models.Room)
        if args.get("room_type"): q = q.filter(models.Room.room_type == args["room_type"])
        if args.get("status"):    q = q.filter(models.Room.status == args["status"])
        rows = q.limit(50).all()
        return {"count": len(rows), "rooms": [_row(r) for r in rows]}

    elif name == "update_room":
        r = db.get(models.Room, args["room_id"])
        if not r: return {"error": "القاعة غير موجودة"}
        for f in ("name","capacity","status"):
            if args.get(f) is not None: setattr(r, f, args[f])
        db.commit()
        return {"success": True, "room": _row(r)}

    # ── Committees ────────────────────────────────────────────────────────────
    elif name == "list_committees":
        q = db.query(models.Committee)
        if args.get("faculty_id"): q = q.filter(models.Committee.faculty_id == args["faculty_id"])
        if args.get("semester"):   q = q.filter(models.Committee.semester == args["semester"])
        rows = q.limit(50).all()
        return {"count": len(rows), "committees": [_row(c) for c in rows]}

    elif name == "update_committee":
        c = db.get(models.Committee, args["committee_id"])
        if not c: return {"error": "اللجنة غير موجودة"}
        if args.get("supervisor"): c.supervisor = args["supervisor"]
        if args.get("status"):     c.status = args["status"]
        if args.get("exam_date"):  c.exam_date = date.fromisoformat(args["exam_date"])
        db.commit()
        return {"success": True, "committee": _row(c)}

    # ── Registration Requests ─────────────────────────────────────────────────
    elif name == "list_registration_requests":
        q = db.query(models.RegistrationRequest)
        if args.get("faculty_id"): q = q.filter(models.RegistrationRequest.faculty_id == args["faculty_id"])
        if args.get("status"):     q = q.filter(models.RegistrationRequest.status == args["status"])
        rows = q.order_by(models.RegistrationRequest.created_at.desc()).limit(args.get("limit", 50)).all()
        return {"count": len(rows), "requests": [_row(r) for r in rows]}

    elif name == "update_registration_request":
        r = db.get(models.RegistrationRequest, args["request_id"])
        if not r: return {"error": "الطلب غير موجود"}
        r.status = args["status"]
        if args.get("admin_response"): r.admin_response = args["admin_response"]
        db.commit()
        return {"success": True, "request": _row(r)}

    # ── Announcements ─────────────────────────────────────────────────────────
    elif name == "list_announcements":
        q = db.query(models.Announcement).filter(models.Announcement.is_active == True)
        if args.get("faculty_id"): q = q.filter(models.Announcement.faculty_id == args["faculty_id"])
        rows = q.order_by(models.Announcement.created_at.desc()).limit(20).all()
        return {"count": len(rows), "announcements": [_row(a) for a in rows]}

    elif name == "create_announcement":
        a = models.Announcement(
            title=args["title"], body=args["body"],
            faculty_id=args.get("faculty_id"),
            priority=args.get("priority", "عادي"),
            is_active=True,
        )
        db.add(a); db.commit()
        return {"success": True, "id": str(a.id)}

    elif name == "update_announcement":
        a = db.get(models.Announcement, _uuid.UUID(args["announcement_id"]))
        if not a: return {"error": "الإعلان غير موجود"}
        for f in ("title","body","is_active"):
            if args.get(f) is not None: setattr(a, f, args[f])
        db.commit()
        return {"success": True, "announcement": _row(a)}

    elif name == "delete_announcement":
        a = db.get(models.Announcement, _uuid.UUID(args["announcement_id"]))
        if not a: return {"error": "الإعلان غير موجود"}
        db.delete(a); db.commit()
        return {"success": True}

    # ── Users & Staff ─────────────────────────────────────────────────────────
    elif name == "list_users":
        q = db.query(models.User)
        if args.get("faculty_id"): q = q.filter(models.User.faculty_id == args["faculty_id"])
        if args.get("role"):       q = q.filter(models.User.role == args["role"])
        rows = q.limit(50).all()
        # exclude hashed_password
        return {"count": len(rows), "users": [
            {k: v for k, v in _row(u).items() if k != "hashed_password"} for u in rows
        ]}

    elif name == "list_staff":
        q = db.query(models.Staff)
        if args.get("faculty_id"): q = q.filter(models.Staff.faculty_id == args["faculty_id"])
        rows = q.limit(50).all()
        return {"count": len(rows), "staff": [_row(s) for s in rows]}

    # ── Statistics & Logs ─────────────────────────────────────────────────────
    elif name == "get_statistics":
        q = db.query(models.Student)
        if args.get("faculty_id"): q = q.filter(models.Student.faculty_id == args["faculty_id"])
        total   = q.count()
        active  = q.filter(models.Student.status == "مقيد").count()
        paid    = q.filter(models.Student.fees_status == "مسدد").count()
        unpaid  = q.filter(models.Student.fees_status == "غير مسدد").count()
        return {"total": total, "active": active, "paid_fees": paid, "unpaid_fees": unpaid}

    elif name == "get_activity_logs":
        q = db.query(models.ActivityLog)
        if args.get("faculty_id"):  q = q.filter(models.ActivityLog.faculty_id == args["faculty_id"])
        if args.get("entity_type"): q = q.filter(models.ActivityLog.entity_type == args["entity_type"])
        rows = q.order_by(models.ActivityLog.performed_at.desc()).limit(args.get("limit", 20)).all()
        return {"count": len(rows), "logs": [_row(r) for r in rows]}

    # ── Student-scoped (own data, read-only) ──────────────────────────────────
    elif name in {"get_my_profile","get_my_grades","get_my_attendance",
                  "get_my_financial","get_my_schedule","get_my_enrollments"}:
        student = db.query(models.Student).filter(models.Student.user_id == user.id).first()
        if not student:
            return {"error": "لم يتم ربط حسابك بسجل طالب، تواصل مع إدارة الكلية."}
        sid = student.student_id

        if name == "get_my_profile":
            return _row(student)
        elif name == "get_my_grades":
            q = db.query(models.Grade).filter(models.Grade.student_id == sid)
            if args.get("semester"): q = q.filter(models.Grade.semester == args["semester"])
            return {"grades": [_row(g) for g in q.all()]}
        elif name == "get_my_attendance":
            q = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.student_id == sid)
            if args.get("course_id"): q = q.filter(models.AttendanceRecord.course_id == args["course_id"])
            rows = q.order_by(models.AttendanceRecord.attendance_date.desc()).limit(50).all()
            present = sum(1 for r in rows if r.status == "حاضر")
            return {"total": len(rows), "present": present, "absent": len(rows)-present, "records": [_row(r) for r in rows]}
        elif name == "get_my_financial":
            rows = db.query(models.FinancialRecord).filter(models.FinancialRecord.student_id == sid).all()
            total_due  = sum(float(r.amount or 0) for r in rows)
            total_paid = sum(float(r.paid_amount or 0) for r in rows)
            return {"total_due": total_due, "total_paid": total_paid, "remaining": total_due-total_paid, "records": [_row(r) for r in rows]}
        elif name == "get_my_schedule":
            q = db.query(models.CourseSchedule).join(
                models.Enrollment,
                (models.Enrollment.course_id == models.CourseSchedule.course_id) &
                (models.Enrollment.student_id == sid))
            if args.get("semester"): q = q.filter(models.CourseSchedule.semester == args["semester"])
            return {"schedule": [_row(s) for s in q.all()]}
        elif name == "get_my_enrollments":
            q = db.query(models.Enrollment).filter(models.Enrollment.student_id == sid)
            if args.get("semester"): q = q.filter(models.Enrollment.semester == args["semester"])
            return {"enrollments": [_row(e) for e in q.all()]}

    else:
        return {"error": f"أداة غير معروفة: {name}"}


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    is_admin = current_user.role in ADMIN_ROLES
    tools    = ADMIN_TOOLS if is_admin else STUDENT_TOOLS
    system   = ADMIN_SYSTEM if is_admin else STUDENT_SYSTEM

    messages = [{"role": "system", "content": system}]
    messages += [{"role": m.role, "content": m.content} for m in body.messages]

    # ── Try each provider in order ────────────────────────────────────────────
    last_error = "لا يوجد provider متاح"
    for provider in PROVIDERS:
        client = _get_client(provider)
        if client is None:
            continue  # key not configured, skip

        try:
            # ── Agentic loop for this provider ────────────────────────────────
            loop_messages = list(messages)
            for _ in range(10):
                resp = await client.chat.completions.create(
                    model=provider["model"], messages=loop_messages, tools=tools,
                    tool_choice="auto", max_tokens=2048, temperature=0.3,
                )
                choice = resp.choices[0]
                if choice.finish_reason != "tool_calls":
                    return ChatResponse(response=choice.message.content or "")

                loop_messages.append(choice.message)
                for tc in choice.message.tool_calls:
                    try:
                        result = await run_tool(tc.function.name, json.loads(tc.function.arguments), current_user, db)
                    except Exception as e:
                        result = {"error": str(e)}
                    loop_messages.append({"role": "tool", "tool_call_id": tc.id,
                                         "content": json.dumps(result, ensure_ascii=False, default=str)})

            return ChatResponse(response="عذراً، حدث خطأ. حاول مرة أخرى.")

        except Exception as e:
            if _should_skip_provider(e):
                last_error = f"{provider['name']}: {str(e)[:120]}"
                continue  # try next provider
            raise HTTPException(status_code=502, detail=f"خطأ من {provider['name']}: {type(e).__name__}: {e}")

    raise HTTPException(status_code=503, detail=f"كل الـproviders وصلوا للحد المسموح، حاول بعد قليل. آخر خطأ: {last_error}")
