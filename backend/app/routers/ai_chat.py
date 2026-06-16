"""
DUMLIS - AI Chat Router
Agentic chat powered by Groq (OpenAI-compatible API).
Admins get full read/write access; students get read-only access to their own data only.
Uses direct DB queries — no internal HTTP self-calls.
"""
import os
import json
import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from openai import AsyncOpenAI
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.routers.auth import get_current_user
from app import models

router = APIRouter()

MODEL = "llama-3.3-70b-versatile"

_groq_client: Optional[AsyncOpenAI] = None

def get_groq_client() -> AsyncOpenAI:
    global _groq_client
    if _groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise HTTPException(status_code=503, detail="GROQ_API_KEY غير مضبوط على الخادم")
        _groq_client = AsyncOpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
    return _groq_client

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

ADMIN_ROLES = {"super_admin", "faculty_admin", "student_affairs"}


# ── Request / Response ────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

class ChatResponse(BaseModel):
    response: str


# ── System Prompts ─────────────────────────────────────────────────────────────

ADMIN_SYSTEM = """أنت مساعد ذكي لإدارة الجامعة في نظام DUMLIS لجامعة دمياط.
تساعد أدمن الكلية على:
- البحث عن الطلاب وعرض بياناتهم وتحديثها
- قبول أو رفض طلبات التسجيل
- عرض وتعديل الدرجات والحضور والوضع المالي
- إنشاء إعلانات للطلاب
- عرض الإحصائيات والتقارير
- إدارة المواد والقاعات واللجان

تتحدث باللغة العربية دائماً وتكون موجزاً ومفيداً.
عند تنفيذ أي إجراء يعدّل البيانات، اذكر بوضوح ما تم تغييره.
إذا لم تجد بيانات، أخبر المستخدم بذلك بوضوح.
"""

STUDENT_SYSTEM = """أنت مساعد ذكي للطلاب في نظام DUMLIS لجامعة دمياط.
يمكنك مساعدة الطالب في الاطلاع على:
- بياناته الشخصية
- درجاته في المواد
- سجل حضوره
- جدوله الدراسي
- وضعه المالي والرسوم
- الإعلانات الجامعية

تتحدث باللغة العربية دائماً وتكون مفيداً وودوداً.
لا يمكنك الوصول لبيانات طلاب آخرين أو تعديل أي بيانات.
"""


# ── Tool Definitions ───────────────────────────────────────────────────────────

ADMIN_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_students",
            "description": "البحث عن طلاب في النظام",
            "parameters": {
                "type": "object",
                "properties": {
                    "search":        {"type": "string",  "description": "اسم أو رقم الطالب"},
                    "faculty_id":    {"type": "string"},
                    "level":         {"type": "integer", "description": "المستوى 1-4"},
                    "status":        {"type": "string"},
                    "fees_status":   {"type": "string"},
                    "limit":         {"type": "integer", "default": 20},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_student",
            "description": "جلب بيانات طالب محدد",
            "parameters": {
                "type": "object",
                "properties": {"student_id": {"type": "string"}},
                "required": ["student_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "update_student",
            "description": "تحديث بيانات طالب (الحالة، الرسوم، التليفون، الإيميل، المستوى)",
            "parameters": {
                "type": "object",
                "properties": {
                    "student_id":  {"type": "string"},
                    "status":      {"type": "string"},
                    "fees_status": {"type": "string"},
                    "phone":       {"type": "string"},
                    "email":       {"type": "string"},
                    "level":       {"type": "integer"},
                },
                "required": ["student_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_student_grades",
            "description": "عرض درجات طالب",
            "parameters": {
                "type": "object",
                "properties": {
                    "student_id": {"type": "string"},
                    "semester":   {"type": "string"},
                },
                "required": ["student_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "update_grade",
            "description": "تعديل درجة طالب في مادة محددة",
            "parameters": {
                "type": "object",
                "properties": {
                    "grade_id":    {"type": "integer", "description": "رقم الدرجة من get_student_grades"},
                    "midterm":     {"type": "number"},
                    "final_exam":  {"type": "number"},
                    "assignments": {"type": "number"},
                    "oral":        {"type": "number"},
                    "practical":   {"type": "number"},
                    "total":       {"type": "number"},
                    "grade_letter":{"type": "string"},
                },
                "required": ["grade_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_student_attendance",
            "description": "عرض سجل حضور طالب",
            "parameters": {
                "type": "object",
                "properties": {
                    "student_id": {"type": "string"},
                    "course_id":  {"type": "string"},
                },
                "required": ["student_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_student_financial",
            "description": "عرض الوضع المالي لطالب",
            "parameters": {
                "type": "object",
                "properties": {"student_id": {"type": "string"}},
                "required": ["student_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_registration_requests",
            "description": "عرض طلبات التسجيل",
            "parameters": {
                "type": "object",
                "properties": {
                    "status":     {"type": "string"},
                    "faculty_id": {"type": "string"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "update_registration_request",
            "description": "قبول أو رفض طلب تسجيل",
            "parameters": {
                "type": "object",
                "properties": {
                    "request_id":     {"type": "string"},
                    "status":         {"type": "string", "description": "مقبول أو مرفوض"},
                    "admin_response": {"type": "string"},
                },
                "required": ["request_id", "status"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "create_announcement",
            "description": "إنشاء إعلان جديد",
            "parameters": {
                "type": "object",
                "properties": {
                    "title":      {"type": "string"},
                    "body":       {"type": "string"},
                    "faculty_id": {"type": "string"},
                },
                "required": ["title", "body"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_statistics",
            "description": "إحصائيات عامة عن الطلاب",
            "parameters": {
                "type": "object",
                "properties": {"faculty_id": {"type": "string"}},
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_courses",
            "description": "عرض المواد الدراسية",
            "parameters": {
                "type": "object",
                "properties": {
                    "faculty_id": {"type": "string"},
                    "level":      {"type": "integer"},
                    "semester":   {"type": "string"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_rooms",
            "description": "عرض القاعات",
            "parameters": {
                "type": "object",
                "properties": {
                    "room_type": {"type": "string"},
                    "status":    {"type": "string"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_committees",
            "description": "عرض لجان الامتحانات",
            "parameters": {
                "type": "object",
                "properties": {
                    "faculty_id": {"type": "string"},
                    "semester":   {"type": "string"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_announcements",
            "description": "عرض الإعلانات",
            "parameters": {
                "type": "object",
                "properties": {"faculty_id": {"type": "string"}},
            },
        },
    },
]

STUDENT_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_my_profile",
            "description": "جلب بياناتي الشخصية",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_grades",
            "description": "جلب درجاتي",
            "parameters": {
                "type": "object",
                "properties": {"semester": {"type": "string"}},
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_attendance",
            "description": "جلب سجل حضوري",
            "parameters": {
                "type": "object",
                "properties": {"course_id": {"type": "string"}},
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_financial",
            "description": "جلب وضعي المالي",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_schedule",
            "description": "جلب جدول محاضراتي",
            "parameters": {
                "type": "object",
                "properties": {"semester": {"type": "string"}},
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_my_enrollments",
            "description": "جلب المواد المسجل فيها",
            "parameters": {
                "type": "object",
                "properties": {"semester": {"type": "string"}},
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_announcements",
            "description": "عرض الإعلانات الجامعية",
            "parameters": {
                "type": "object",
                "properties": {"faculty_id": {"type": "string"}},
            },
        },
    },
]


# ── Helpers ────────────────────────────────────────────────────────────────────

def _s(obj) -> dict:
    """Convert SQLAlchemy model to plain dict, skipping relationship proxies."""
    d = {}
    for c in obj.__table__.columns:
        val = getattr(obj, c.name)
        if hasattr(val, 'isoformat'):
            val = val.isoformat()
        elif hasattr(val, '__str__') and not isinstance(val, (str, int, float, bool, type(None))):
            val = str(val)
        d[c.name] = val
    return d


# ── Tool Execution (direct DB) ─────────────────────────────────────────────────

async def run_tool(name: str, args: dict, user: models.User, db: Session) -> Any:

    # ── Admin tools ───────────────────────────────────────────────────────────

    if name == "search_students":
        q = db.query(models.Student)
        if args.get("search"):
            term = f"%{args['search']}%"
            q = q.filter(
                models.Student.name.ilike(term) |
                models.Student.student_id.ilike(term)
            )
        if args.get("faculty_id"):
            q = q.filter(models.Student.faculty_id == args["faculty_id"])
        if args.get("level"):
            q = q.filter(models.Student.level == args["level"])
        if args.get("status"):
            q = q.filter(models.Student.status == args["status"])
        if args.get("fees_status"):
            q = q.filter(models.Student.fees_status == args["fees_status"])
        students = q.limit(args.get("limit", 20)).all()
        return {"count": len(students), "students": [_s(s) for s in students]}

    elif name == "get_student":
        s = db.query(models.Student).filter(models.Student.student_id == args["student_id"]).first()
        return _s(s) if s else {"error": "الطالب غير موجود"}

    elif name == "update_student":
        sid = args["student_id"]
        s = db.query(models.Student).filter(models.Student.student_id == sid).first()
        if not s:
            return {"error": "الطالب غير موجود"}
        for field in ("status", "fees_status", "phone", "email", "level"):
            if args.get(field) is not None:
                setattr(s, field, args[field])
        db.commit()
        return {"success": True, "student": _s(s)}

    elif name == "get_student_grades":
        q = db.query(models.Grade).filter(models.Grade.student_id == args["student_id"])
        if args.get("semester"):
            q = q.filter(models.Grade.semester == args["semester"])
        grades = q.all()
        return {"count": len(grades), "grades": [_s(g) for g in grades]}

    elif name == "update_grade":
        grade = db.query(models.Grade).filter(models.Grade.id == args["grade_id"]).first()
        if not grade:
            return {"error": "الدرجة غير موجودة"}
        for field in ("midterm", "final_exam", "assignments", "oral", "practical", "total", "grade_letter"):
            if args.get(field) is not None:
                setattr(grade, field, args[field])
        db.commit()
        return {"success": True, "grade": _s(grade)}

    elif name == "get_student_attendance":
        q = db.query(models.AttendanceRecord).filter(
            models.AttendanceRecord.student_id == args["student_id"]
        )
        if args.get("course_id"):
            q = q.filter(models.AttendanceRecord.course_id == args["course_id"])
        records = q.order_by(models.AttendanceRecord.attendance_date.desc()).limit(100).all()
        present = sum(1 for r in records if r.status == "حاضر")
        absent  = sum(1 for r in records if r.status == "غائب")
        return {
            "total": len(records),
            "present": present,
            "absent": absent,
            "rate": round(present / len(records) * 100, 1) if records else 0,
            "records": [_s(r) for r in records[:20]],
        }

    elif name == "get_student_financial":
        records = db.query(models.FinancialRecord).filter(
            models.FinancialRecord.student_id == args["student_id"]
        ).all()
        total_due  = sum(float(r.amount or 0) for r in records)
        total_paid = sum(float(r.paid_amount or 0) for r in records)
        return {
            "total_due":  total_due,
            "total_paid": total_paid,
            "remaining":  total_due - total_paid,
            "records": [_s(r) for r in records],
        }

    elif name == "list_registration_requests":
        q = db.query(models.RegistrationRequest)
        if args.get("faculty_id"):
            q = q.filter(models.RegistrationRequest.faculty_id == args["faculty_id"])
        if args.get("status"):
            q = q.filter(models.RegistrationRequest.status == args["status"])
        items = q.order_by(models.RegistrationRequest.created_at.desc()).limit(50).all()
        return {"count": len(items), "requests": [_s(r) for r in items]}

    elif name == "update_registration_request":
        req = db.query(models.RegistrationRequest).filter(
            models.RegistrationRequest.id == args["request_id"]
        ).first()
        if not req:
            return {"error": "الطلب غير موجود"}
        req.status = args["status"]
        if args.get("admin_response"):
            req.admin_response = args["admin_response"]
        db.commit()
        return {"success": True, "request": _s(req)}

    elif name == "create_announcement":
        ann = models.Announcement(
            title=args["title"],
            body=args["body"],
            faculty_id=args.get("faculty_id"),
            is_active=True,
        )
        db.add(ann)
        db.commit()
        return {"success": True, "id": str(ann.id), "title": ann.title}

    elif name == "get_statistics":
        q = db.query(models.Student)
        if args.get("faculty_id"):
            q = q.filter(models.Student.faculty_id == args["faculty_id"])
        total   = q.count()
        active  = q.filter(models.Student.status == "مقيد").count()
        paid    = q.filter(models.Student.fees_status == "مسدد").count()
        unpaid  = q.filter(models.Student.fees_status == "غير مسدد").count()
        return {"total": total, "active": active, "paid_fees": paid, "unpaid_fees": unpaid}

    elif name == "list_courses":
        q = db.query(models.Course)
        if args.get("faculty_id"):
            q = q.filter(models.Course.faculty_id == args["faculty_id"])
        if args.get("level"):
            q = q.filter(models.Course.level == args["level"])
        if args.get("semester"):
            q = q.filter(models.Course.semester == args["semester"])
        courses = q.limit(50).all()
        return {"count": len(courses), "courses": [_s(c) for c in courses]}

    elif name == "list_rooms":
        q = db.query(models.Room)
        if args.get("room_type"):
            q = q.filter(models.Room.room_type == args["room_type"])
        if args.get("status"):
            q = q.filter(models.Room.status == args["status"])
        rooms = q.limit(50).all()
        return {"count": len(rooms), "rooms": [_s(r) for r in rooms]}

    elif name == "list_committees":
        q = db.query(models.Committee)
        if args.get("faculty_id"):
            q = q.filter(models.Committee.faculty_id == args["faculty_id"])
        if args.get("semester"):
            q = q.filter(models.Committee.semester == args["semester"])
        committees = q.limit(50).all()
        return {"count": len(committees), "committees": [_s(c) for c in committees]}

    elif name == "list_announcements":
        q = db.query(models.Announcement).filter(models.Announcement.is_active == True)
        if args.get("faculty_id"):
            q = q.filter(models.Announcement.faculty_id == args["faculty_id"])
        items = q.order_by(models.Announcement.created_at.desc()).limit(20).all()
        return {"count": len(items), "announcements": [_s(a) for a in items]}

    # ── Student-scoped tools (own data only) ──────────────────────────────────

    elif name in {"get_my_profile","get_my_grades","get_my_attendance","get_my_financial","get_my_schedule","get_my_enrollments"}:
        student = db.query(models.Student).filter(models.Student.user_id == user.id).first()
        if not student:
            return {"error": "لم يتم ربط حسابك بسجل طالب، تواصل مع إدارة الكلية."}
        sid = student.student_id

        if name == "get_my_profile":
            return _s(student)

        elif name == "get_my_grades":
            q = db.query(models.Grade).filter(models.Grade.student_id == sid)
            if args.get("semester"):
                q = q.filter(models.Grade.semester == args["semester"])
            return {"grades": [_s(g) for g in q.all()]}

        elif name == "get_my_attendance":
            q = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.student_id == sid)
            if args.get("course_id"):
                q = q.filter(models.AttendanceRecord.course_id == args["course_id"])
            records = q.order_by(models.AttendanceRecord.attendance_date.desc()).limit(50).all()
            present = sum(1 for r in records if r.status == "حاضر")
            return {"total": len(records), "present": present, "absent": len(records)-present, "records": [_s(r) for r in records]}

        elif name == "get_my_financial":
            records = db.query(models.FinancialRecord).filter(models.FinancialRecord.student_id == sid).all()
            total_due  = sum(float(r.amount or 0) for r in records)
            total_paid = sum(float(r.paid_amount or 0) for r in records)
            return {"total_due": total_due, "total_paid": total_paid, "remaining": total_due - total_paid, "records": [_s(r) for r in records]}

        elif name == "get_my_schedule":
            q = db.query(models.CourseSchedule).join(
                models.Enrollment,
                (models.Enrollment.course_id == models.CourseSchedule.course_id) &
                (models.Enrollment.student_id == sid)
            )
            if args.get("semester"):
                q = q.filter(models.CourseSchedule.semester == args["semester"])
            return {"schedule": [_s(s) for s in q.all()]}

        elif name == "get_my_enrollments":
            q = db.query(models.Enrollment).filter(models.Enrollment.student_id == sid)
            if args.get("semester"):
                q = q.filter(models.Enrollment.semester == args["semester"])
            return {"enrollments": [_s(e) for e in q.all()]}

    else:
        return {"error": f"أداة غير معروفة: {name}"}


# ── Chat Endpoint ──────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    groq = get_groq_client()

    is_admin = current_user.role in ADMIN_ROLES
    system_prompt = ADMIN_SYSTEM if is_admin else STUDENT_SYSTEM
    tools = ADMIN_TOOLS if is_admin else STUDENT_TOOLS

    messages = [{"role": "system", "content": system_prompt}]
    messages += [{"role": m.role, "content": m.content} for m in body.messages]

    for _ in range(10):
        response = await groq.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=tools,
            tool_choice="auto",
            max_tokens=2048,
            temperature=0.3,
        )

        choice = response.choices[0]

        if choice.finish_reason != "tool_calls":
            return ChatResponse(response=choice.message.content or "")

        messages.append(choice.message)

        for tc in choice.message.tool_calls:
            try:
                args = json.loads(tc.function.arguments)
                result = await run_tool(tc.function.name, args, current_user, db)
            except Exception as e:
                result = {"error": str(e)}

            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": json.dumps(result, ensure_ascii=False, default=str),
            })

    return ChatResponse(response="عذراً، حدث خطأ أثناء معالجة طلبك. حاول مرة أخرى.")
