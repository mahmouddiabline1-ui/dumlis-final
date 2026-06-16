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
MODEL = "llama-3.3-70b-versatile"
_groq_client: Optional[AsyncOpenAI] = None

ADMIN_ROLES = {"super_admin", "faculty_admin", "student_affairs"}


def get_groq_client() -> AsyncOpenAI:
    global _groq_client
    if _groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise HTTPException(status_code=503, detail="GROQ_API_KEY غير مضبوط على الخادم")
        _groq_client = AsyncOpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
    return _groq_client


# ── Schemas ───────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

class ChatResponse(BaseModel):
    response: str


# ── Prompts ───────────────────────────────────────────────────────────────────

ADMIN_SYSTEM = """أنت مساعد ذكي لإدارة الجامعة في نظام DUMLIS — لديك صلاحية قراءة وتعديل كل شيء.
تستطيع:
- عرض وتعديل بيانات الطلاب والدرجات والحضور والرسوم
- إدارة التسجيل والمواد والجداول
- قبول/رفض طلبات التسجيل وحجب الطلاب
- إدارة الكليات والأقسام والمستخدمين والموظفين
- إنشاء وتعديل الإعلانات واللجان والقاعات
تتحدث بالعربية دائماً. بعد أي تعديل اذكر ما تم بوضوح.
"""

STUDENT_SYSTEM = """أنت مساعد للطلاب في نظام DUMLIS — تعرض بيانات الطالب المسجّل فقط (قراءة فقط).
تتحدث بالعربية دائماً. لا يمكنك تعديل أي بيانات أو الوصول لبيانات طلاب آخرين.
"""


# ── Tool helper ───────────────────────────────────────────────────────────────

def _row(obj) -> dict:
    d = {}
    for c in obj.__table__.columns:
        val = getattr(obj, c.name)
        if hasattr(val, 'isoformat'):
            val = val.isoformat()
        elif not isinstance(val, (str, int, float, bool, type(None))):
            val = str(val)
        d[c.name] = val
    return d

def _fn(name: str, desc: str, props: dict, required: list = None) -> dict:
    return {"type": "function", "function": {
        "name": name, "description": desc,
        "parameters": {"type": "object", "properties": props,
                       **({"required": required} if required else {})}}}


# ── Tool Definitions ──────────────────────────────────────────────────────────

ADMIN_TOOLS = [
    # ── Students ──────────────────────────────────────────────────────────────
    _fn("search_students", "البحث عن طلاب", {
        "search":      {"type": "string",  "description": "اسم أو رقم الطالب"},
        "faculty_id":  {"type": "string"},
        "level":       {"type": "integer"},
        "status":      {"type": "string"},
        "fees_status": {"type": "string"},
        "limit":       {"type": "integer"},
    }),
    _fn("get_student", "جلب بيانات طالب", {"student_id": {"type": "string"}}, ["student_id"]),
    _fn("create_student", "إنشاء طالب جديد", {
        "student_id":  {"type": "string", "description": "الرقم الجامعي"},
        "name":        {"type": "string"},
        "faculty_id":  {"type": "string"},
        "level":       {"type": "integer"},
        "regulation":  {"type": "string"},
        "national_id": {"type": "string"},
        "phone":       {"type": "string"},
        "email":       {"type": "string"},
    }, ["student_id", "name", "faculty_id", "level", "regulation"]),
    _fn("update_student", "تحديث بيانات طالب", {
        "student_id":  {"type": "string"},
        "name":        {"type": "string"},
        "status":      {"type": "string"},
        "fees_status": {"type": "string"},
        "phone":       {"type": "string"},
        "email":       {"type": "string"},
        "level":       {"type": "integer"},
        "gpa":         {"type": "number"},
        "city":        {"type": "string"},
    }, ["student_id"]),
    _fn("delete_student", "حذف طالب نهائياً", {"student_id": {"type": "string"}}, ["student_id"]),
    _fn("block_student", "حجب طالب", {
        "student_id": {"type": "string"},
        "reason":     {"type": "string"},
        "notes":      {"type": "string"},
    }, ["student_id", "reason"]),
    _fn("unblock_student", "رفع الحجب عن طالب", {"student_id": {"type": "string"}}, ["student_id"]),
    _fn("list_student_blocks", "عرض الطلاب المحجوبين", {
        "faculty_id": {"type": "string"},
        "status":     {"type": "string"},
    }),

    # ── Grades ────────────────────────────────────────────────────────────────
    _fn("get_student_grades", "عرض درجات طالب", {
        "student_id": {"type": "string"},
        "semester":   {"type": "string"},
    }, ["student_id"]),
    _fn("update_grade", "تعديل درجة طالب", {
        "grade_id":    {"type": "integer", "description": "id الدرجة من get_student_grades"},
        "midterm":     {"type": "number"},
        "final_exam":  {"type": "number"},
        "assignments": {"type": "number"},
        "oral":        {"type": "number"},
        "practical":   {"type": "number"},
        "total":       {"type": "number"},
        "grade_letter":{"type": "string"},
        "grade_points":{"type": "number"},
    }, ["grade_id"]),
    _fn("create_grade", "إضافة درجة جديدة لطالب", {
        "student_id":  {"type": "string"},
        "course_id":   {"type": "string"},
        "semester":    {"type": "string"},
        "midterm":     {"type": "number"},
        "final_exam":  {"type": "number"},
        "total":       {"type": "number"},
        "grade_letter":{"type": "string"},
    }, ["student_id", "course_id", "semester"]),

    # ── Attendance ────────────────────────────────────────────────────────────
    _fn("get_student_attendance", "عرض سجل حضور طالب", {
        "student_id": {"type": "string"},
        "course_id":  {"type": "string"},
    }, ["student_id"]),
    _fn("update_attendance", "تعديل حضور طالب (حاضر/غائب)", {
        "attendance_id": {"type": "integer", "description": "id السجل من get_student_attendance"},
        "status":        {"type": "string", "description": "حاضر أو غائب"},
        "notes":         {"type": "string"},
    }, ["attendance_id", "status"]),

    # ── Financial ─────────────────────────────────────────────────────────────
    _fn("get_student_financial", "عرض الوضع المالي لطالب", {
        "student_id": {"type": "string"}
    }, ["student_id"]),
    _fn("update_financial_record", "تحديث سجل مالي (تسديد رسوم مثلاً)", {
        "record_id":   {"type": "integer"},
        "paid_amount": {"type": "number"},
        "status":      {"type": "string", "description": "مسدد أو غير مسدد أو جزئي"},
        "receipt_no":  {"type": "string"},
    }, ["record_id"]),
    _fn("list_financial_records", "عرض السجلات المالية", {
        "faculty_id":    {"type": "string"},
        "student_id":    {"type": "string"},
        "status":        {"type": "string"},
        "academic_year": {"type": "string"},
        "limit":         {"type": "integer"},
    }),

    # ── Enrollments ───────────────────────────────────────────────────────────
    _fn("list_enrollments", "عرض تسجيلات الطلاب في المواد", {
        "student_id": {"type": "string"},
        "course_id":  {"type": "string"},
        "semester":   {"type": "string"},
        "faculty_id": {"type": "string"},
        "limit":      {"type": "integer"},
    }),
    _fn("create_enrollment", "تسجيل طالب في مادة", {
        "student_id": {"type": "string"},
        "course_id":  {"type": "string"},
        "semester":   {"type": "string"},
        "faculty_id": {"type": "string"},
    }, ["student_id", "course_id", "semester"]),
    _fn("update_enrollment", "تحديث حالة تسجيل", {
        "enrollment_id": {"type": "integer"},
        "status":        {"type": "string"},
    }, ["enrollment_id", "status"]),
    _fn("delete_enrollment", "حذف تسجيل طالب من مادة", {
        "enrollment_id": {"type": "integer"}
    }, ["enrollment_id"]),

    # ── Courses ───────────────────────────────────────────────────────────────
    _fn("list_courses", "عرض المواد الدراسية", {
        "faculty_id": {"type": "string"},
        "level":      {"type": "integer"},
        "semester":   {"type": "string"},
        "limit":      {"type": "integer"},
    }),
    _fn("create_course", "إنشاء مادة دراسية جديدة", {
        "id":           {"type": "string", "description": "كود المادة"},
        "name":         {"type": "string"},
        "level":        {"type": "integer"},
        "faculty_id":   {"type": "string"},
        "credit_hours": {"type": "integer"},
        "course_type":  {"type": "string"},
        "semester":     {"type": "string"},
    }, ["id", "name", "level", "faculty_id"]),
    _fn("update_course", "تعديل مادة دراسية", {
        "course_id":    {"type": "string"},
        "name":         {"type": "string"},
        "level":        {"type": "integer"},
        "credit_hours": {"type": "integer"},
        "semester":     {"type": "string"},
        "course_type":  {"type": "string"},
    }, ["course_id"]),
    _fn("delete_course", "حذف مادة دراسية", {"course_id": {"type": "string"}}, ["course_id"]),

    # ── Departments & Faculties ────────────────────────────────────────────────
    _fn("list_faculties", "عرض الكليات", {}),
    _fn("list_departments", "عرض الأقسام", {"faculty_id": {"type": "string"}}),

    # ── Rooms & Committees ────────────────────────────────────────────────────
    _fn("list_rooms", "عرض القاعات", {
        "room_type": {"type": "string"},
        "status":    {"type": "string"},
    }),
    _fn("update_room", "تحديث قاعة", {
        "room_id":  {"type": "string"},
        "name":     {"type": "string"},
        "capacity": {"type": "integer"},
        "status":   {"type": "string"},
    }, ["room_id"]),
    _fn("list_committees", "عرض لجان الامتحانات", {
        "faculty_id": {"type": "string"},
        "semester":   {"type": "string"},
    }),
    _fn("update_committee", "تحديث لجنة امتحانات", {
        "committee_id": {"type": "integer"},
        "supervisor":   {"type": "string"},
        "exam_date":    {"type": "string", "description": "YYYY-MM-DD"},
        "status":       {"type": "string"},
    }, ["committee_id"]),

    # ── Registration Requests ─────────────────────────────────────────────────
    _fn("list_registration_requests", "عرض طلبات التسجيل", {
        "faculty_id": {"type": "string"},
        "status":     {"type": "string"},
        "limit":      {"type": "integer"},
    }),
    _fn("update_registration_request", "قبول أو رفض طلب تسجيل", {
        "request_id":     {"type": "string"},
        "status":         {"type": "string"},
        "admin_response": {"type": "string"},
    }, ["request_id", "status"]),

    # ── Announcements ─────────────────────────────────────────────────────────
    _fn("list_announcements", "عرض الإعلانات", {
        "faculty_id": {"type": "string"},
    }),
    _fn("create_announcement", "إنشاء إعلان", {
        "title":      {"type": "string"},
        "body":       {"type": "string"},
        "faculty_id": {"type": "string"},
        "priority":   {"type": "string"},
    }, ["title", "body"]),
    _fn("update_announcement", "تعديل إعلان", {
        "announcement_id": {"type": "string"},
        "title":           {"type": "string"},
        "body":            {"type": "string"},
        "is_active":       {"type": "boolean"},
    }, ["announcement_id"]),
    _fn("delete_announcement", "حذف إعلان", {
        "announcement_id": {"type": "string"}
    }, ["announcement_id"]),

    # ── Users & Staff ─────────────────────────────────────────────────────────
    _fn("list_users", "عرض مستخدمي النظام", {
        "faculty_id": {"type": "string"},
        "role":       {"type": "string"},
    }),
    _fn("list_staff", "عرض أعضاء هيئة التدريس", {
        "faculty_id": {"type": "string"},
    }),

    # ── Statistics & Logs ─────────────────────────────────────────────────────
    _fn("get_statistics", "إحصائيات شاملة عن الطلاب", {
        "faculty_id": {"type": "string"},
    }),
    _fn("get_activity_logs", "عرض سجل النشاطات الأخيرة", {
        "faculty_id":  {"type": "string"},
        "entity_type": {"type": "string"},
        "limit":       {"type": "integer"},
    }),
]

STUDENT_TOOLS = [
    _fn("get_my_profile",    "بياناتي الشخصية",    {}),
    _fn("get_my_grades",     "درجاتي",              {"semester": {"type": "string"}}),
    _fn("get_my_attendance", "سجل حضوري",           {"course_id": {"type": "string"}}),
    _fn("get_my_financial",  "وضعي المالي",         {}),
    _fn("get_my_schedule",   "جدول محاضراتي",       {"semester": {"type": "string"}}),
    _fn("get_my_enrollments","موادي المسجلة",       {"semester": {"type": "string"}}),
    _fn("list_announcements","الإعلانات الجامعية",  {"faculty_id": {"type": "string"}}),
]


# ── Tool Execution ────────────────────────────────────────────────────────────

async def run_tool(name: str, args: dict, user: models.User, db: Session) -> Any:

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
        rows = q.limit(args.get("limit", 20)).all()
        return {"count": len(rows), "students": [_row(s) for s in rows]}

    elif name == "get_student":
        s = db.get(models.Student, args["student_id"])
        return _row(s) if s else {"error": "الطالب غير موجود"}

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
        return {"count": len(rows), "grades": [_row(g) for g in rows]}

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
    groq = get_groq_client()
    is_admin = current_user.role in ADMIN_ROLES
    tools    = ADMIN_TOOLS if is_admin else STUDENT_TOOLS
    system   = ADMIN_SYSTEM if is_admin else STUDENT_SYSTEM

    messages = [{"role": "system", "content": system}]
    messages += [{"role": m.role, "content": m.content} for m in body.messages]

    for _ in range(10):
        resp = await groq.chat.completions.create(
            model=MODEL, messages=messages, tools=tools,
            tool_choice="auto", max_tokens=2048, temperature=0.3,
        )
        choice = resp.choices[0]
        if choice.finish_reason != "tool_calls":
            return ChatResponse(response=choice.message.content or "")

        messages.append(choice.message)
        for tc in choice.message.tool_calls:
            try:
                result = await run_tool(tc.function.name, json.loads(tc.function.arguments), current_user, db)
            except Exception as e:
                result = {"error": str(e)}
            messages.append({"role": "tool", "tool_call_id": tc.id,
                             "content": json.dumps(result, ensure_ascii=False, default=str)})

    return ChatResponse(response="عذراً، حدث خطأ. حاول مرة أخرى.")
