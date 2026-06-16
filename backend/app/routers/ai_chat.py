"""
DUMLIS - AI Chat Router
4-tool agentic architecture:
  get_student_data / search_students / get_system_info / modify_data
Pre-loads live system stats into every request — common questions need 0 tool calls.
"""
import os
import json
import uuid as _uuid
import logging
from typing import Any, Optional
from datetime import date

logger = logging.getLogger(__name__)

from fastapi import APIRouter, Depends, HTTPException
from openai import AsyncOpenAI
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.routers.auth import get_current_user
from app import models

router = APIRouter()
ADMIN_ROLES = {"super_admin", "faculty_admin", "student_affairs"}

# ── Provider registry ─────────────────────────────────────────────────────────
PROVIDERS = [
    {"env": "GEMINI_API_KEY",    "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
     "model": "gemini-2.0-flash",            "name": "Gemini-2.0-Flash"},
    {"env": "GEMINI_API_KEY",    "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
     "model": "gemini-1.5-flash",            "name": "Gemini-1.5-Flash"},
    {"env": "CEREBRAS_API_KEY",  "base_url": "https://api.cerebras.ai/v1",
     "model": "llama3.3-70b",                "name": "Cerebras-70B"},
    {"env": "GROQ_API_KEY",      "base_url": "https://api.groq.com/openai/v1",
     "model": "llama-3.3-70b-versatile",    "name": "Groq-3.3-70B"},
    {"env": "GROQ_API_KEY",      "base_url": "https://api.groq.com/openai/v1",
     "model": "llama-3.1-70b-versatile",    "name": "Groq-3.1-70B"},
    {"env": "SAMBANOVA_API_KEY", "base_url": "https://api.sambanova.ai/v1",
     "model": "Meta-Llama-3.3-70B-Instruct","name": "SambaNova-70B"},
    {"env": "GROQ_API_KEY",      "base_url": "https://api.groq.com/openai/v1",
     "model": "llama-3.1-8b-instant",        "name": "Groq-8B"},
]

_provider_clients: dict[str, AsyncOpenAI] = {}
_blacklisted_until: dict[str, float] = {}


def _blacklist(name: str, seconds: int = 30) -> None:
    import time
    _blacklisted_until[name] = time.time() + seconds

def _blacklist_long(name: str) -> None:
    _blacklist(name, seconds=120)

def _is_blacklisted(name: str) -> bool:
    import time
    return time.time() < _blacklisted_until.get(name, 0)

def _get_client(provider: dict) -> Optional[AsyncOpenAI]:
    key = os.getenv(provider["env"])
    if not key:
        return None
    cache_key = f"{provider['env']}:{provider['base_url']}"
    if cache_key not in _provider_clients:
        _provider_clients[cache_key] = AsyncOpenAI(
            api_key=key, base_url=provider["base_url"], timeout=25.0)
    return _provider_clients[cache_key]

def _should_skip_provider(e: Exception) -> bool:
    from openai import APITimeoutError, APIConnectionError
    if isinstance(e, (APITimeoutError, APIConnectionError)):
        return True
    s = str(e).lower()
    return any(x in s for x in [
        "429", "rate_limit", "quota",
        "401", "403", "404",
        "invalid_api_key", "invalid api key", "please pass a valid", "api key",
        "authentication", "decommissioned", "not_found", "notfound",
        "does not exist", "model_not_found", "no access",
        "tool_use_failed", "tool call validation", "parameters for tool",
        "did not match schema", "aierror", "bad input", "onematch", "oneof",
        "type mismatch", "required properties", "timeout", "timed out", "connection",
    ])


# ── Schemas ───────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

class ChatResponse(BaseModel):
    response: str


# ── Helpers ───────────────────────────────────────────────────────────────────

STUDENT_KEYS = ["student_id","name","faculty_id","department_id","level",
                "status","fees_status","phone","email","gpa"]

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

def _fn(name, desc, props, required=None):
    return {"type": "function", "function": {
        "name": name, "description": desc,
        "parameters": {"type": "object", "properties": props,
                       **({"required": required} if required else {})}}}

def _s(t): return {"type": t}
def _si():  return {"type": "integer"}
def _sn():  return {"type": "number"}
def _sb():  return {"type": "boolean"}

def _int(v, default=None):
    try: return int(v)
    except (TypeError, ValueError): return default

def _float(v, default=None):
    try: return float(v)
    except (TypeError, ValueError): return default


# ── Live context builder ──────────────────────────────────────────────────────

def _build_admin_context(db: Session) -> str:
    """Injects live DB stats into every system prompt — answers general questions without tools."""
    try:
        total  = db.query(models.Student).count()
        active = db.query(models.Student).filter(models.Student.status  == "مقيد").count()
        unpaid = db.query(models.Student).filter(models.Student.fees_status == "غير مسدد").count()

        faculties = db.query(models.Faculty).all()
        fac_list  = " | ".join(f.id for f in faculties) if faculties else "—"

        ann_count = db.query(models.Announcement).filter(
            models.Announcement.is_active == True).count()
        pending   = db.query(models.RegistrationRequest).filter(
            models.RegistrationRequest.status == "قيد المراجعة").count()

        # Per-level counts
        level_counts = {}
        for lvl in range(1, 5):
            c = db.query(models.Student).filter(models.Student.level == lvl).count()
            if c > 0:
                level_counts[lvl] = c

        level_str = " | ".join(f"سنة {lvl}: {c}" for lvl, c in sorted(level_counts.items()))

        return (
            f"\n[إحصائيات النظام — مُحدَّثة الآن]\n"
            f"الطلاب: {total} إجمالي | {active} مقيد | {unpaid} غير مسدد الرسوم\n"
            f"توزيع المستويات: {level_str or '—'}\n"
            f"الكليات: {fac_list}\n"
            f"إعلانات نشطة: {ann_count} | طلبات تسجيل معلّقة: {pending}\n"
        )
    except Exception:
        return ""


# ── System Prompts ────────────────────────────────────────────────────────────

ADMIN_SYSTEM_BASE = """أنت مساعد إداري ذكي لنظام DUMLIS الجامعي. تتحدث بالعربية دائماً وبشكل ودود.

## أدواتك الأربع — استخدم الأقل منها:

**get_student_data(query)**
← اسم الطالب أو كوده → يُرجع كل شيء: ملف + تسجيلات + درجات + حضور + ماليات
← استخدم لأي سؤال عن طالب محدد (بالاسم أو الكود)

**search_students(search, faculty_id?, status?, fees_status?, level?, limit?)**
← لعرض قائمة بأكثر من طالب في نفس الوقت

**get_system_info(type, faculty_id?)**
← type: "announcements" | "courses" | "requests" | "rooms" | "committees" | "staff" | "users"
← للأسئلة عن القوائم العامة

**modify_data(entity, action, id?, fields?)**
← entity: student | grade | enrollment | financial | attendance | announcement | request | room | course | committee
← action: update | create | delete | block | unblock | approve | reject
← للتعديل والإضافة والحذف

## قواعد:
- الإحصائيات العامة (عدد الطلاب، الكليات...) موجودة في السياق أدناه — أجب مباشرة بدون أدوات
- سؤال عن طالب بالاسم أو الكود → get_student_data مرة واحدة فقط (تُرجع كل شيء)
- بعد الأداة الأخيرة → أجب فوراً بالعربية بشكل واضح ومختصر
- بعد أي تعديل → أكّد في جملة واحدة
- لو السؤال مش تقني → ارد بشكل طبيعي بدون أدوات

## ⚠️ قبل أي تعديل أو إضافة:
- لو المعلومة ناقصة (مادة غير محددة، درجة غير محددة، بيانات غير مكتملة...) → اسأل المستخدم أولاً
- لا تخترع بيانات أو تختار قيم من عندك — انتظر تأكيد المستخدم
- مثال: "سجله مادة" بدون تحديد المادة → اسأل: "أي مادة تريد تسجيله فيها؟"
- مثال: "عدل درجته" بدون تحديد الدرجة → اسأل: "كم الدرجة الجديدة؟"

## 📅 جداول الامتحانات (اللجان):
- اللجنة = قاعة امتحان لمادة معينة، بها: اسم، مادة، قاعة، تاريخ، وقت، مشرف، سعة
- لعرض الجداول: get_system_info("committees")
- لإنشاء جدول جديد: modify_data(entity="committee", action="create", fields={name, course_id, room_id, exam_date, exam_time, supervisor, capacity, semester})
  → لو room_id مش متوفر: اعرض get_system_info("rooms") أولاً واسأل المستخدم يختار
- لتعديل: modify_data(entity="committee", action="update", id=..., fields={...})
- لحذف: modify_data(entity="committee", action="delete", id=...)
- بعد الإنشاء/التعديل → أكد بتفاصيل اللجنة: الاسم، المادة، القاعة، التاريخ، الوقت

## 📝 إضافة درجات:
- لإضافة درجة: modify_data(entity="grade", action="create", fields={student_id, course_id, semester, midterm, final_exam, total, grade_letter})
- لتعديل درجة موجودة: modify_data(entity="grade", action="update", id=grade_id, fields={...})
  → الـgrade_id موجود في نتيجة get_student_data
- بعد الإضافة/التعديل → أكد: اسم الطالب (لو معروف)، المادة، الدرجة، التقدير

## 🚫 لا تخترع بيانات أبداً:
- لو الأداة ما رجعتش بيانات كافية → قل بصراحة "لا توجد بيانات متاحة"
- لو مفيش أداة للموضوع المطلوب → قل "هذه البيانات غير متوفرة في النظام حالياً"
- الأرقام والأسماء اللي بتقولها لازم تيجي من نتيجة أداة حقيقية أو من السياق المحمّل أعلاه — مش من مخيلتك
- لو مش متأكد → اسأل أو قل "لا أعلم"
"""

STUDENT_SYSTEM = """أنت مساعد للطلاب في نظام DUMLIS — تعرض بيانات الطالب المسجّل فقط (قراءة فقط).
تتحدث بالعربية دائماً. لا يمكنك تعديل أي بيانات أو الوصول لبيانات طلاب آخرين.
"""


# ── Tool Definitions ──────────────────────────────────────────────────────────

ADMIN_TOOLS = [
    _fn("get_student_data",
        "جلب كل بيانات طالب دفعة واحدة: ملف + تسجيلات + درجات + حضور + ماليات. يقبل اسم الطالب أو كوده.",
        {"query": _s("string"), "faculty_id": _s("string")},
        ["query"]),

    _fn("search_students",
        "بحث وعرض قائمة بأكثر من طالب. للطالب الواحد استخدم get_student_data.",
        {"search": _s("string"), "faculty_id": _s("string"), "level": _si(),
         "status": _s("string"), "fees_status": _s("string"), "limit": _si()}),

    _fn("get_system_info",
        "جلب قوائم النظام. type: announcements|courses|requests|rooms|committees|staff|users",
        {"type": _s("string"), "faculty_id": _s("string")},
        ["type"]),

    _fn("modify_data",
        ("تعديل أي بيانات في النظام.\n"
         "entity: student|grade|enrollment|financial|attendance|announcement|request|room|course|committee\n"
         "action: update|create|delete|block|unblock|approve|reject\n"
         "id: معرّف العنصر المراد تعديله\n"
         "fields: كائن يحتوي البيانات المراد تعديلها أو إضافتها"),
        {"entity":  _s("string"),
         "action":  _s("string"),
         "id":      _s("string"),
         "fields":  {"type": "object", "additionalProperties": True}},
        ["entity", "action"]),
]

STUDENT_TOOLS = [
    _fn("get_my_profile",    "بياناتي الشخصية", {}),
    _fn("get_my_grades",     "درجاتي",           {"semester": _s("string")}),
    _fn("get_my_attendance", "حضوري",            {"course_id": _s("string")}),
    _fn("get_my_financial",  "ماليتي",           {}),
    _fn("get_my_schedule",   "جدولي الدراسي",    {"semester": _s("string")}),
    _fn("get_my_enrollments","موادي المسجّلة",   {"semester": _s("string")}),
    _fn("list_announcements","الإعلانات",        {"faculty_id": _s("string")}),
]


# ── Tool Execution ────────────────────────────────────────────────────────────

def _resolve_student(query: str, db: Session):
    """Resolve name or student_id → (student_obj, error_dict). One is None."""
    s = db.get(models.Student, query)
    if s:
        return s, None
    rows = db.query(models.Student).filter(
        models.Student.name.ilike(f"%{query}%")
    ).limit(5).all()
    if not rows:
        return None, {"error": f"لا يوجد طالب باسم أو كود '{query}'"}
    if len(rows) > 1:
        return None, {
            "multiple_found": True,
            "count": len(rows),
            "students": [_row(s, STUDENT_KEYS) for s in rows],
            "note": "وُجد أكثر من طالب — حدد الكود أو الاسم الكامل"
        }
    return rows[0], None


async def run_tool(name: str, args: dict, user: models.User, db: Session) -> Any:

    # ── get_student_data ──────────────────────────────────────────────────────
    if name == "get_student_data":
        student, err = _resolve_student(args["query"], db)
        if err:
            return err
        sid = student.student_id

        enrollments = db.query(models.Enrollment).filter(
            models.Enrollment.student_id == sid).all()

        grades = db.query(models.Grade).filter(
            models.Grade.student_id == sid).all()

        att_rows = db.query(models.AttendanceRecord).filter(
            models.AttendanceRecord.student_id == sid).limit(200).all()
        present = sum(1 for r in att_rows if r.status == "حاضر")

        fin_rows = db.query(models.FinancialRecord).filter(
            models.FinancialRecord.student_id == sid).all()
        total_due  = sum(float(r.amount or 0)      for r in fin_rows)
        total_paid = sum(float(r.paid_amount or 0) for r in fin_rows)

        logger.info("AI: get_student_data(%s) → enrollments=%d grades=%d",
                    sid, len(enrollments), len(grades))
        return {
            "student": _row(student, STUDENT_KEYS),
            "enrollments": {
                "count": len(enrollments),
                "courses": [{"course_id": e.course_id, "semester": e.semester,
                              "status": e.status} for e in enrollments]
            },
            "grades": {
                "count": len(grades),
                "list": [{"id": g.id, "course_id": g.course_id, "semester": g.semester,
                           "total": g.total, "letter": g.grade_letter} for g in grades]
            },
            "attendance": {
                "total": len(att_rows), "present": present,
                "absent": len(att_rows) - present,
                "rate_pct": round(present / len(att_rows) * 100, 1) if att_rows else 0
            },
            "financial": {
                "total_due": total_due, "total_paid": total_paid,
                "remaining": round(total_due - total_paid, 2),
                "status": student.fees_status
            }
        }

    # ── search_students ───────────────────────────────────────────────────────
    elif name == "search_students":
        q = db.query(models.Student)
        if args.get("search"):
            t = f"%{args['search']}%"
            q = q.filter(models.Student.name.ilike(t) | models.Student.student_id.ilike(t))
        if args.get("faculty_id"):  q = q.filter(models.Student.faculty_id  == args["faculty_id"])
        if args.get("level"):       q = q.filter(models.Student.level        == _int(args["level"]))
        if args.get("status"):      q = q.filter(models.Student.status       == args["status"])
        if args.get("fees_status"): q = q.filter(models.Student.fees_status  == args["fees_status"])
        rows = q.limit(min(_int(args.get("limit"), 10), 15)).all()
        return {"count": len(rows), "students": [_row(s, STUDENT_KEYS) for s in rows]}

    # ── get_system_info ───────────────────────────────────────────────────────
    elif name == "get_system_info":
        t   = (args.get("type") or "").lower()
        fid = args.get("faculty_id")
        result: dict = {}

        if t == "announcements":
            q = db.query(models.Announcement).filter(models.Announcement.is_active == True)
            if fid: q = q.filter(models.Announcement.faculty_id == fid)
            rows = q.order_by(models.Announcement.created_at.desc()).limit(15).all()
            ANN_KEYS = ["id","title","body","priority","created_at","faculty_id"]
            result = {"count": len(rows), "announcements": [_row(a, ANN_KEYS) for a in rows]}

        elif t == "courses":
            q = db.query(models.Course)
            if fid: q = q.filter(models.Course.faculty_id == fid)
            rows = q.limit(60).all()
            COURSE_KEYS = ["id","name","level","credit_hours","semester","course_type"]
            result = {"count": len(rows), "courses": [_row(c, COURSE_KEYS) for c in rows]}

        elif t == "requests":
            q = db.query(models.RegistrationRequest)
            if fid: q = q.filter(models.RegistrationRequest.faculty_id == fid)
            rows = q.order_by(models.RegistrationRequest.created_at.desc()).limit(30).all()
            REQ_KEYS = ["id","student_id","request_type","status","created_at","admin_response"]
            result = {"count": len(rows), "requests": [_row(r, REQ_KEYS) for r in rows]}

        elif t == "rooms":
            rows = db.query(models.Room).limit(50).all()
            ROOM_KEYS = ["id","name","capacity","room_type","status"]
            result = {"count": len(rows), "rooms": [_row(r, ROOM_KEYS) for r in rows]}

        elif t == "committees":
            q = db.query(models.Committee)
            if fid: q = q.filter(models.Committee.faculty_id == fid)
            rows = q.limit(30).all()
            COM_KEYS = ["id","faculty_id","semester","supervisor","status","exam_date"]
            result = {"count": len(rows), "committees": [_row(c, COM_KEYS) for c in rows]}

        elif t == "staff":
            q = db.query(models.Staff)
            if fid: q = q.filter(models.Staff.faculty_id == fid)
            rows = q.limit(50).all()
            STAFF_KEYS = ["id","name","faculty_id","department_id","position","email"]
            result = {"count": len(rows), "staff": [_row(s, STAFF_KEYS) for s in rows]}

        elif t == "users":
            q = db.query(models.User)
            if fid: q = q.filter(models.User.faculty_id == fid)
            rows = q.limit(50).all()
            USER_KEYS = ["id","username","role","faculty_id","is_active"]
            result = {"count": len(rows), "users": [_row(u, USER_KEYS) for u in rows]}

        else:
            result = {"error": f"type غير معروف: {t}. استخدم: announcements|courses|requests|rooms|committees|staff|users"}

        return result

    # ── modify_data ───────────────────────────────────────────────────────────
    elif name == "modify_data":
        entity = (args.get("entity") or "").lower()
        action = (args.get("action") or "update").lower()
        eid    = args.get("id")
        fields = args.get("fields") or {}

        # Coerce numeric types
        for k in ("level", "capacity"):
            if k in fields: fields[k] = _int(fields[k])
        for k in ("midterm","final_exam","assignments","oral","practical",
                  "total","grade_points","paid_amount","gpa"):
            if k in fields: fields[k] = _float(fields[k])

        # ── student ───────────────────────────────────────────────────────────
        if entity == "student":
            if action == "create":
                sid = eid or fields.get("student_id")
                s = models.Student(**{k: v for k, v in fields.items() if v is not None})
                if sid and not getattr(s, "student_id", None):
                    s.student_id = sid
                db.add(s); db.commit()
                return {"success": True, "student_id": s.student_id}

            elif action == "delete":
                s = db.get(models.Student, eid)
                if not s: return {"error": "الطالب غير موجود"}
                db.delete(s); db.commit()
                return {"success": True, "deleted": eid}

            elif action == "block":
                b = models.StudentBlock(
                    student_id=eid,
                    reason=fields.get("reason", ""),
                    notes=fields.get("notes"),
                    faculty_id=user.faculty_id,
                    blocked_by=user.id,
                )
                db.add(b); db.commit()
                return {"success": True, "block_id": b.id}

            elif action == "unblock":
                b = db.query(models.StudentBlock).filter(
                    models.StudentBlock.student_id == eid,
                    models.StudentBlock.status == "محجوب"
                ).first()
                if not b: return {"error": "لا يوجد حجب نشط لهذا الطالب"}
                b.status = "مرفوع"; db.commit()
                return {"success": True}

            else:  # update
                s = db.get(models.Student, eid)
                if not s: return {"error": "الطالب غير موجود"}
                for f in ("name","status","fees_status","phone","email","level","gpa","city"):
                    if fields.get(f) is not None: setattr(s, f, fields[f])
                db.commit()
                return {"success": True, "student_id": s.student_id,
                        "gpa": s.gpa, "status": s.status}

        # ── grade ─────────────────────────────────────────────────────────────
        elif entity == "grade":
            GRADE_SUMMARY_KEYS = ["id","student_id","course_id","semester",
                                   "midterm","final_exam","total","grade_letter","grade_points"]
            if action == "create":
                g = models.Grade(
                    student_id=fields.get("student_id", eid),
                    course_id=fields["course_id"],
                    semester=fields.get("semester", ""),
                    **{k: fields[k] for k in
                       ("midterm","final_exam","assignments","oral","practical",
                        "total","grade_letter","grade_points") if k in fields}
                )
                db.add(g); db.commit(); db.refresh(g)
                return {"success": True, "action": "created", "grade": _row(g, GRADE_SUMMARY_KEYS)}
            else:
                g = db.get(models.Grade, _int(eid))
                if not g: return {"error": f"الدرجة {eid} غير موجودة"}
                for f in ("midterm","final_exam","assignments","oral","practical",
                          "total","grade_letter","grade_points"):
                    if fields.get(f) is not None: setattr(g, f, fields[f])
                db.commit()
                return {"success": True, "action": "updated", "grade": _row(g, GRADE_SUMMARY_KEYS)}

        # ── enrollment ────────────────────────────────────────────────────────
        elif entity == "enrollment":
            if action == "create":
                e = models.Enrollment(
                    student_id=fields.get("student_id", eid),
                    course_id=fields["course_id"],
                    semester=fields.get("semester", ""),
                    faculty_id=fields.get("faculty_id"),
                    status="مسجل",
                )
                db.add(e); db.commit()
                return {"success": True, "enrollment_id": e.id}
            elif action == "delete":
                e = db.get(models.Enrollment, _int(eid))
                if not e: return {"error": "التسجيل غير موجود"}
                db.delete(e); db.commit()
                return {"success": True}
            else:
                e = db.get(models.Enrollment, _int(eid))
                if not e: return {"error": "التسجيل غير موجود"}
                if fields.get("status"): e.status = fields["status"]
                db.commit()
                return {"success": True}

        # ── financial ─────────────────────────────────────────────────────────
        elif entity == "financial":
            r = db.get(models.FinancialRecord, _int(eid))
            if not r: return {"error": "السجل المالي غير موجود"}
            for f in ("paid_amount","status","receipt_no"):
                if fields.get(f) is not None: setattr(r, f, fields[f])
            db.commit()
            return {"success": True}

        # ── attendance ────────────────────────────────────────────────────────
        elif entity == "attendance":
            r = db.get(models.AttendanceRecord, _int(eid))
            if not r: return {"error": "سجل الحضور غير موجود"}
            if fields.get("status"): r.status = fields["status"]
            if fields.get("notes"):  r.notes  = fields["notes"]
            db.commit()
            return {"success": True}

        # ── announcement ──────────────────────────────────────────────────────
        elif entity == "announcement":
            if action == "create":
                a = models.Announcement(
                    title=fields["title"],
                    body=fields.get("body", ""),
                    faculty_id=fields.get("faculty_id"),
                    priority=fields.get("priority", "عادي"),
                    is_active=True,
                )
                db.add(a); db.commit()
                return {"success": True, "id": str(a.id)}
            elif action == "delete":
                try:
                    a = db.get(models.Announcement, _uuid.UUID(eid))
                except Exception:
                    return {"error": "معرّف الإعلان غير صحيح"}
                if not a: return {"error": "الإعلان غير موجود"}
                db.delete(a); db.commit()
                return {"success": True}
            else:
                try:
                    a = db.get(models.Announcement, _uuid.UUID(eid))
                except Exception:
                    return {"error": "معرّف الإعلان غير صحيح"}
                if not a: return {"error": "الإعلان غير موجود"}
                for f in ("title","body","is_active"):
                    if fields.get(f) is not None: setattr(a, f, fields[f])
                db.commit()
                return {"success": True}

        # ── registration request ──────────────────────────────────────────────
        elif entity == "request":
            r = db.get(models.RegistrationRequest, eid)
            if not r: return {"error": "الطلب غير موجود"}
            if action == "approve":
                r.status = "مقبول"
            elif action == "reject":
                r.status = "مرفوض"
            elif fields.get("status"):
                r.status = fields["status"]
            if fields.get("admin_response"): r.admin_response = fields["admin_response"]
            db.commit()
            return {"success": True, "status": r.status}

        # ── room ──────────────────────────────────────────────────────────────
        elif entity == "room":
            r = db.get(models.Room, eid)
            if not r: return {"error": "القاعة غير موجودة"}
            for f in ("name","capacity","status"):
                if fields.get(f) is not None: setattr(r, f, fields[f])
            db.commit()
            return {"success": True}

        # ── course ────────────────────────────────────────────────────────────
        elif entity == "course":
            if action == "create":
                c = models.Course(**{k: v for k, v in fields.items() if v is not None})
                if eid and not fields.get("id"): c.id = eid
                db.add(c); db.commit()
                return {"success": True, "course_id": c.id}
            elif action == "delete":
                c = db.get(models.Course, eid)
                if not c: return {"error": "المادة غير موجودة"}
                db.delete(c); db.commit()
                return {"success": True}
            else:
                c = db.get(models.Course, eid)
                if not c: return {"error": "المادة غير موجودة"}
                for f in ("name","level","credit_hours","semester","course_type"):
                    if fields.get(f) is not None: setattr(c, f, fields[f])
                db.commit()
                return {"success": True}

        # ── committee ─────────────────────────────────────────────────────────
        elif entity == "committee":
            if action == "create":
                room_id = fields.get("room_id")
                if not room_id:
                    return {"error": "يجب تحديد room_id (القاعة). استخدم get_system_info('rooms') لعرض القاعات المتاحة."}
                c = models.Committee(
                    faculty_id=fields.get("faculty_id", user.faculty_id),
                    name=fields.get("name", ""),
                    course_id=fields.get("course_id"),
                    room_id=room_id,
                    capacity=_int(fields.get("capacity"), 30),
                    supervisor=fields.get("supervisor"),
                    semester=fields.get("semester"),
                    status=fields.get("status", "active"),
                )
                if fields.get("exam_date"):
                    try: c.exam_date = date.fromisoformat(fields["exam_date"])
                    except ValueError: pass
                if fields.get("exam_time"):
                    try:
                        from datetime import time as dtime
                        parts = fields["exam_time"].split(":")
                        c.exam_time = dtime(int(parts[0]), int(parts[1]))
                    except Exception: pass
                db.add(c); db.commit()
                return {
                    "success": True, "committee_id": c.id,
                    "name": c.name, "course_id": c.course_id,
                    "room_id": c.room_id, "capacity": c.capacity,
                    "exam_date": str(c.exam_date) if c.exam_date else None,
                    "exam_time": str(c.exam_time) if c.exam_time else None,
                    "supervisor": c.supervisor, "semester": c.semester,
                }
            elif action == "delete":
                c = db.get(models.Committee, _int(eid))
                if not c: return {"error": "اللجنة غير موجودة"}
                db.delete(c); db.commit()
                return {"success": True, "deleted_committee_id": eid}
            else:
                c = db.get(models.Committee, _int(eid))
                if not c: return {"error": "اللجنة غير موجودة"}
                if fields.get("name"):       c.name       = fields["name"]
                if fields.get("supervisor"): c.supervisor = fields["supervisor"]
                if fields.get("status"):     c.status     = fields["status"]
                if fields.get("capacity"):   c.capacity   = _int(fields["capacity"])
                if fields.get("course_id"):  c.course_id  = fields["course_id"]
                if fields.get("room_id"):    c.room_id    = fields["room_id"]
                if fields.get("semester"):   c.semester   = fields["semester"]
                if fields.get("exam_date"):
                    try: c.exam_date = date.fromisoformat(fields["exam_date"])
                    except ValueError: pass
                if fields.get("exam_time"):
                    try:
                        from datetime import time as dtime
                        parts = fields["exam_time"].split(":")
                        c.exam_time = dtime(int(parts[0]), int(parts[1]))
                    except Exception: pass
                db.commit()
                return {
                    "success": True, "committee_id": c.id,
                    "name": c.name, "course_id": c.course_id,
                    "exam_date": str(c.exam_date) if c.exam_date else None,
                    "exam_time": str(c.exam_time) if c.exam_time else None,
                    "supervisor": c.supervisor,
                }

        return {"error": f"entity غير معروف: '{entity}'. الخيارات: student|grade|enrollment|financial|attendance|announcement|request|room|course|committee"}

    # ── Student self-service ──────────────────────────────────────────────────
    elif name in {"get_my_profile","get_my_grades","get_my_attendance",
                  "get_my_financial","get_my_schedule","get_my_enrollments",
                  "list_announcements"}:
        if name == "list_announcements":
            q = db.query(models.Announcement).filter(models.Announcement.is_active == True)
            if args.get("faculty_id"): q = q.filter(models.Announcement.faculty_id == args["faculty_id"])
            rows = q.order_by(models.Announcement.created_at.desc()).limit(20).all()
            return {"count": len(rows),
                    "announcements": [_row(a, ["id","title","priority","created_at"]) for a in rows]}

        student = db.query(models.Student).filter(models.Student.user_id == user.id).first()
        if not student:
            return {"error": "لم يتم ربط حسابك بسجل طالب. تواصل مع إدارة الكلية."}
        sid = student.student_id

        if name == "get_my_profile":
            return _row(student, STUDENT_KEYS)

        elif name == "get_my_grades":
            q = db.query(models.Grade).filter(models.Grade.student_id == sid)
            if args.get("semester"): q = q.filter(models.Grade.semester == args["semester"])
            rows = q.all()
            return {"count": len(rows),
                    "grades": [_row(g, ["id","course_id","semester","midterm","final_exam",
                                        "total","grade_letter","grade_points"]) for g in rows]}

        elif name == "get_my_attendance":
            q = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.student_id == sid)
            if args.get("course_id"): q = q.filter(models.AttendanceRecord.course_id == args["course_id"])
            rows = q.limit(100).all()
            present = sum(1 for r in rows if r.status == "حاضر")
            return {"total": len(rows), "present": present, "absent": len(rows)-present,
                    "rate_pct": round(present/len(rows)*100, 1) if rows else 0}

        elif name == "get_my_financial":
            rows = db.query(models.FinancialRecord).filter(
                models.FinancialRecord.student_id == sid).all()
            total_due  = sum(float(r.amount or 0)      for r in rows)
            total_paid = sum(float(r.paid_amount or 0) for r in rows)
            return {"count": len(rows), "total_due": total_due, "total_paid": total_paid,
                    "remaining": round(total_due - total_paid, 2),
                    "records": [_row(r, ["id","academic_year","amount","paid_amount","status"])
                                for r in rows]}

        elif name == "get_my_schedule":
            q = db.query(models.CourseSchedule).join(
                models.Enrollment,
                (models.Enrollment.course_id == models.CourseSchedule.course_id) &
                (models.Enrollment.student_id == sid))
            if args.get("semester"): q = q.filter(models.CourseSchedule.semester == args["semester"])
            return {"schedule": [_row(s, ["course_id","day","start_time","end_time","room_id"])
                                 for s in q.all()]}

        elif name == "get_my_enrollments":
            q = db.query(models.Enrollment).filter(models.Enrollment.student_id == sid)
            if args.get("semester"): q = q.filter(models.Enrollment.semester == args["semester"])
            rows = q.all()
            return {"count": len(rows),
                    "enrollments": [_row(e, ["course_id","semester","status"]) for e in rows]}

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

    if is_admin:
        system = ADMIN_SYSTEM_BASE + _build_admin_context(db)
    else:
        system = STUDENT_SYSTEM

    messages = [{"role": "system", "content": system}]
    messages += [{"role": m.role, "content": m.content} for m in body.messages]

    last_error = "لا يوجد provider متاح"
    for provider in PROVIDERS:
        if _is_blacklisted(provider["name"]):
            continue

        client = _get_client(provider)
        if client is None:
            logger.warning("AI: %s — key not set, skipping", provider["name"])
            continue

        logger.info("AI: trying %s", provider["name"])
        try:
            loop_messages = list(messages)
            for iteration in range(10):
                resp = await client.chat.completions.create(
                    model=provider["model"], messages=loop_messages, tools=tools,
                    tool_choice="auto", max_tokens=700, temperature=0.3,
                )
                choice = resp.choices[0]
                if choice.finish_reason != "tool_calls":
                    logger.info("AI: %s answered after %d tool call(s)",
                                provider["name"], iteration)
                    return ChatResponse(response=choice.message.content or "")

                loop_messages.append(choice.message)
                for tc in choice.message.tool_calls:
                    logger.info("AI: tool=%s args=%s",
                                tc.function.name, tc.function.arguments[:100])
                    try:
                        result = await run_tool(
                            tc.function.name,
                            json.loads(tc.function.arguments),
                            current_user, db)
                    except Exception as e:
                        result = {"error": str(e)}
                    loop_messages.append({
                        "role": "tool", "tool_call_id": tc.id,
                        "content": json.dumps(result, ensure_ascii=False, default=str)
                    })

            return ChatResponse(response="عذراً، حدث خطأ داخلي. حاول مرة أخرى.")

        except Exception as e:
            if _should_skip_provider(e):
                last_error = f"{provider['name']}: {str(e)[:120]}"
                logger.warning("AI: skip %s — %s", provider["name"], str(e)[:80])
                err = str(e).lower()
                if any(x in err for x in ["429", "rate_limit", "quota"]):
                    _blacklist_long(provider["name"])
                else:
                    _blacklist(provider["name"])
                continue
            raise HTTPException(
                status_code=502,
                detail=f"خطأ من {provider['name']}: {type(e).__name__}: {e}")

    return ChatResponse(response="عذراً، الخدمة مشغولة حالياً (جميع مزودي الذكاء الاصطناعي وصلوا للحد المسموح). انتظر 30 ثانية وحاول مرة أخرى.")
