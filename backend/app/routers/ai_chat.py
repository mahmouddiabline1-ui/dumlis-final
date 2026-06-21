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
    _blacklist(name, seconds=60)

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


# ── Direct answer layer (no AI needed) ───────────────────────────────────────

def _try_direct(question: str, db: Session, user: models.User) -> Optional[str]:
    """
    Answer common questions straight from DB. Returns Arabic string or None → AI.
    """
    import re
    from sqlalchemy import func
    q = question.strip()

    # فلتر الكلية: super_admin يشوف الكل، faculty_admin يشوف كليته فقط
    fid = None
    if user and getattr(user, 'role', None) != 'super_admin':
        fid = getattr(user, 'faculty_id', None)

    # كشف اسم الكلية من نص السؤال
    FACULTY_MAP = {
        "حاسبات": "FCAI", "حاسبه": "FCAI", "كمبيوتر": "FCAI", "fcai": "FCAI",
        "هندسة": "FEN",   "هندسه": "FEN",   "fen": "FEN",
        "علوم": "FSC",    "fsc": "FSC",
        "تربية": "FED",   "تربيه": "FED",   "fed": "FED",
        "صيدلة": "PHR",   "صيدله": "PHR",   "phr": "PHR",
        "حقوق": "LAW",    "قانون": "LAW",    "law": "LAW",
        "طب": "MED",      "med": "MED",
        "اداب": "ART",    "آداب": "ART",    "art": "ART",
        "تجارة": "BUS",   "تجاره": "BUS",   "bus": "BUS",
    }
    if not fid:
        for keyword, mapped_fid in FACULTY_MAP.items():
            if re.search(rf'(كلي[هة]|كلية)\s*{keyword}|{keyword}', q, re.I):
                fid = mapped_fid
                break

    def _sq(model):
        """Student query filtered by faculty if needed."""
        sq = db.query(model)
        if fid and hasattr(model, 'faculty_id'):
            sq = sq.filter(model.faculty_id == fid)
        return sq

    # ── helpers ───────────────────────────────────────────────────────────────
    def _student_card(s) -> str:
        return (
            f"**{s.name}** (كود: {s.student_id})\n"
            f"• الكلية: {s.faculty_id} | القسم: {s.department_id or '—'} | المستوى: {s.level}\n"
            f"• الحالة: {s.status} | الرسوم: {s.fees_status} | المعدل: {s.gpa or '—'}\n"
            f"• الهاتف: {s.phone or '—'} | البريد: {s.email or '—'}"
        )

    def _id_in(text: str):
        m = re.search(r'\b(\d{6,8})\b', text)
        return m.group(1) if m else None

    def _level_in(text: str):
        LEVEL_WORDS = {
            "اول":1,"أول":1,"اولى":1,"أولى":1,"الاول":1,"الأول":1,"الاولى":1,"الأولى":1,
            "ثاني":2,"ثانية":2,"ثانيه":2,"الثاني":2,"الثانية":2,
            "ثالث":3,"ثالثة":3,"الثالث":3,"الثالثة":3,
            "رابع":4,"رابعة":4,"الرابع":4,"الرابعة":4,
            "خامس":5,"خامسة":5,"الخامس":5,"الخامسة":5,
            "سادس":6,"سادسة":6,"السادس":6,"السادسة":6,
            "سابع":7,"سابعة":7,"السابع":7,"السابعة":7,
            "1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,
        }
        # with prefix: المستوى الثالث / السنة الثانية
        m = re.search(r'(?:المستوى|السنة|العام)\s*(?:ال)?(\w+)', text)
        if m:
            w = m.group(1).rstrip('ة')
            v = LEVEL_WORDS.get(m.group(1)) or LEVEL_WORDS.get(w)
            if v: return v
        # standalone ordinal: "طلاب الثالث" / "عدد الرابعة"
        m2 = re.search(r'\b(الاول|الأول|الاولى|الأولى|الثاني|الثانية|الثالث|الثالثة|'
                       r'الرابع|الرابعة|الخامس|الخامسة|السادس|السادسة|السابع|السابعة)\b', text)
        if m2: return LEVEL_WORDS.get(m2.group(1))
        # digit: مستوى 3
        m3 = re.search(r'(?:مستوى|سنة)\s*([1-7])', text)
        if m3: return int(m3.group(1))
        return None

    def _payment_stats():
        total  = _sq(models.Student).count()
        paid_c = _sq(models.Student).filter(models.Student.fees_status == "مسدد").count()
        unpaid = _sq(models.Student).filter(models.Student.fees_status == "غير مسدد").count()
        pct    = round(paid_c / total * 100, 1) if total else 0
        fin_q  = db.query(func.sum(models.FinancialRecord.paid_amount))
        if fid:
            fin_q = fin_q.join(models.Student, models.FinancialRecord.student_id == models.Student.student_id).filter(models.Student.faculty_id == fid)
        rev = float(fin_q.scalar() or 0)
        return (
            f"💰 **التحصيل المالي:**\n"
            f"• مسدد: {paid_c} طالب | غير مسدد: {unpaid} طالب\n"
            f"• نسبة السداد: **{pct}%**\n"
            f"• إجمالي المحصّل: {rev:,.0f} ج.م"
        )

    # ── 1. إحصائيات عامة ─────────────────────────────────────────────────────
    if re.search(r'(إحصائيات|احصائيات|نظرة عامة|ملخص|overview|dashboard|لوحة)', q, re.I):
        total  = _sq(models.Student).count()
        active = _sq(models.Student).filter(models.Student.status == "مقيد").count()
        susp   = _sq(models.Student).filter(models.Student.status == "موقوف").count()
        exp    = _sq(models.Student).filter(models.Student.status == "مفصول").count()
        grad   = _sq(models.Student).filter(models.Student.status == "خريج").count()
        paid_c = _sq(models.Student).filter(models.Student.fees_status == "مسدد").count()
        unpaid = _sq(models.Student).filter(models.Student.fees_status == "غير مسدد").count()
        facs   = db.query(models.Faculty).count()
        ann    = db.query(models.Announcement).filter(models.Announcement.is_active == True).count()
        fin_q  = db.query(func.sum(models.FinancialRecord.paid_amount))
        if fid:
            fin_q = fin_q.join(models.Student, models.FinancialRecord.student_id == models.Student.student_id).filter(models.Student.faculty_id == fid)
        rev = float(fin_q.scalar() or 0)
        lines  = [
            "📊 **إحصائيات النظام**",
            f"• إجمالي الطلاب: **{total}**",
            f"  - مقيد: {active} | موقوف: {susp} | مفصول: {exp} | خريج: {grad}",
            f"• الرسوم: مسدد {paid_c} | غير مسدد {unpaid} — نسبة السداد: {round(paid_c/total*100,1) if total else 0}%",
            f"• إجمالي المحصّل: {rev:,.0f} ج.م",
            f"• عدد الكليات: {facs} | إعلانات نشطة: {ann}",
        ]
        lvl_parts = []
        for lvl in range(1, 8):
            c = _sq(models.Student).filter(models.Student.level == lvl).count()
            if c: lvl_parts.append(f"سنة{lvl}: {c}")
        if lvl_parts:
            lines.append("• توزيع المستويات: " + " | ".join(lvl_parts))
        return "\n".join(lines)

    # ── 2. عدد الطلاب الإجمالي ───────────────────────────────────────────────
    if re.search(r'(كم عدد الطلاب|كم طالب|عدد الطلاب الكلي|اجمالي الطلاب|إجمالي الطلاب)', q):
        total  = _sq(models.Student).count()
        active = _sq(models.Student).filter(models.Student.status == "مقيد").count()
        return f"إجمالي الطلاب: **{total}** | منهم مقيدون: {active}"

    # ── 3. حالات الطلاب ──────────────────────────────────────────────────────
    for kw, status, label in [
        (r'مقيد|المقيدين|مقيدين',     "مقيد",   "المقيدين"),
        (r'موقوف|الموقوفين|موقوفين',   "موقوف",  "الموقوفين"),
        (r'مفصول|المفصولين|مفصولين',   "مفصول",  "المفصولين"),
        (r'خريج|الخريجين|خريجين',      "خريج",   "الخريجين"),
        (r'منتظم|المنتظمين',           "منتظم",  "المنتظمين"),
    ]:
        if re.search(rf'(كم|عدد).{{0,20}}({kw})', q):
            c = _sq(models.Student).filter(models.Student.status == status).count()
            return f"عدد الطلاب {label}: **{c}** طالب"

    # ── 4. طلاب لم يسددوا / غير مسددين ──────────────────────────────────────
    if re.search(r'(لم يسدد|غير مسدد|متاخر|متأخر).{0,20}(رسوم|الرسوم|دفع)', q) or \
       re.search(r'(رسوم|الرسوم).{0,20}(لم يسدد|غير مسدد)', q):
        c    = _sq(models.Student).filter(models.Student.fees_status == "غير مسدد").count()
        rows = _sq(models.Student).filter(models.Student.fees_status == "غير مسدد").limit(8).all()
        lines = [f"⚠️ الطلاب غير المسددين للرسوم: **{c}** طالب"]
        for s in rows:
            lines.append(f"• {s.name} ({s.student_id}) — {s.faculty_id}")
        if c > len(rows): lines.append(f"  ... و{c-len(rows)} آخرين")
        return "\n".join(lines)

    # ── 5. طلاب مستوى معين ───────────────────────────────────────────────────
    lvl = _level_in(q)
    if lvl and re.search(r'(طلاب|عدد|اعرض|قائمة|كم)', q):
        c    = _sq(models.Student).filter(models.Student.level == lvl).count()
        rows = _sq(models.Student).filter(models.Student.level == lvl).limit(10).all()
        names = "\n".join(f"  • {s.name} ({s.student_id}) — {s.status}" for s in rows)
        more  = f"\n  ... و{c-len(rows)} آخرين" if c > len(rows) else ""
        return f"طلاب المستوى {lvl}: **{c}** طالب\n{names}{more}"

    # ── 6. بيانات طالب بكوده (شاملة) ────────────────────────────────────────
    sid = _id_in(q)
    if sid and re.search(r'(بيانات|معلومات|اعرض|عرض|من هو|الطالب|ملف|بروفايل)', q):
        s = db.get(models.Student, sid)
        if not s: return f"لا يوجد طالب بكود **{sid}** في النظام."
        grades = db.query(models.Grade).filter(models.Grade.student_id == sid).limit(10).all()
        grade_lines = ""
        if grades:
            grade_lines = "\n📚 **آخر الدرجات:**\n" + "\n".join(
                f"  • {g.course_id} | {g.semester}: {g.total or '—'} ({g.grade_letter or '—'})"
                for g in grades[-5:])
        fin = db.query(models.FinancialRecord).filter(
            models.FinancialRecord.student_id == sid).all()
        fin_line = ""
        if fin:
            due  = sum(float(r.amount or 0) for r in fin)
            paid = sum(float(r.paid_amount or 0) for r in fin)
            fin_line = f"\n💰 **المالية:** مطلوب {due:.0f} | مسدد {paid:.0f} | متبقي {due-paid:.0f} ج.م"
        att = db.query(models.AttendanceRecord).filter(
            models.AttendanceRecord.student_id == sid).limit(100).all()
        att_line = ""
        if att:
            present = sum(1 for r in att if r.status == "حاضر")
            att_line = f"\n📅 **الحضور:** {present}/{len(att)} ({round(present/len(att)*100,1)}%)"
        return _student_card(s) + grade_lines + fin_line + att_line

    # ── 7. درجات طالب بكوده ──────────────────────────────────────────────────
    if sid and re.search(r'(درجات|نتيجة|نتائج|تقدير|مادة|مواد)', q):
        s = db.get(models.Student, sid)
        if not s: return f"لا يوجد طالب بكود **{sid}**."
        grades = db.query(models.Grade).filter(models.Grade.student_id == sid).all()
        if not grades:
            return f"لا توجد درجات مسجّلة للطالب **{s.name}** ({sid}) حتى الآن."
        lines = [f"📚 **درجات {s.name} ({sid}):**"]
        for g in grades:
            parts = []
            if g.assignments is not None: parts.append(f"أعمال: {g.assignments:.0f}")
            if g.midterm     is not None: parts.append(f"ميد: {g.midterm:.0f}")
            if g.final_exam  is not None: parts.append(f"نهائي: {g.final_exam:.0f}")
            detail = " | ".join(parts)
            lines.append(f"• {g.course_id} ({g.semester}): مجموع={g.total or '—'} تقدير={g.grade_letter or '—'}"
                         + (f" [{detail}]" if detail else ""))
        if s.gpa: lines.append(f"\n📈 **المعدل التراكمي: {s.gpa}**")
        return "\n".join(lines)

    # ── 8. معدل GPA بكوده ────────────────────────────────────────────────────
    if sid and re.search(r'(معدل|gpa|المعدل التراكمي)', q, re.I):
        s = db.get(models.Student, sid)
        if not s: return f"لا يوجد طالب بكود {sid}."
        return f"📈 المعدل التراكمي للطالب **{s.name}** ({sid}): **{s.gpa or 'غير مسجّل'}**"

    # ── 9. حضور طالب بكوده ───────────────────────────────────────────────────
    if sid and re.search(r'(حضور|غياب|نسبة الحضور|سجل الحضور)', q):
        s = db.get(models.Student, sid)
        if not s: return f"لا يوجد طالب بكود {sid}."
        rows = db.query(models.AttendanceRecord).filter(
            models.AttendanceRecord.student_id == sid).limit(200).all()
        if not rows:
            return f"لا توجد سجلات حضور للطالب **{s.name}** ({sid})."
        present = sum(1 for r in rows if r.status == "حاضر")
        absent  = len(rows) - present
        pct     = round(present / len(rows) * 100, 1)
        warn    = " ⚠️ نسبة الحضور أقل من 75%" if pct < 75 else ""
        return (
            f"📅 **حضور الطالب {s.name} ({sid}):**\n"
            f"• حاضر: {present} | غائب: {absent} | الإجمالي: {len(rows)}\n"
            f"• نسبة الحضور: **{pct}%**{warn}"
        )

    # ── 10. السجل المالي لطالب ───────────────────────────────────────────────
    if sid and re.search(r'(مالي|رسوم|الرسوم|سدد|يسدد|المالية|دفع)', q):
        s = db.get(models.Student, sid)
        if not s: return f"لا يوجد طالب بكود {sid}."
        fin = db.query(models.FinancialRecord).filter(
            models.FinancialRecord.student_id == sid).all()
        if not fin:
            return f"لا توجد سجلات مالية للطالب **{s.name}** ({sid})."
        due  = sum(float(r.amount or 0) for r in fin)
        paid = sum(float(r.paid_amount or 0) for r in fin)
        lines = [f"💰 **المالية للطالب {s.name} ({sid}):**"]
        for r in fin:
            lines.append(f"• {r.academic_year or '—'}: مطلوب {r.amount or 0} | مسدد {r.paid_amount or 0} | {r.status or '—'}")
        lines.append(f"\n**الإجمالي:** مطلوب {due:.0f} | مسدد {paid:.0f} | متبقي {due-paid:.0f} ج.م")
        return "\n".join(lines)

    # ── 11. بحث بالاسم ───────────────────────────────────────────────────────
    m_name = re.search(
        r'(?:ابحث|بحث|اعرض|عرض|جيب|هات|وين|فين).{0,15}(?:اسمه|اسمها|يسمى|تسمى|اسمه?|طالب(?:ة)?)\s+([^\d؟?،,]{2,25})',
        q)
    if not m_name:
        m_name = re.search(r'(?:طالب|طالبة)\s+(?:اسمه|اسمها|يسمى|تسمى)?\s*([^\d؟?،,]{2,25})$', q)
    if m_name:
        name_q = m_name.group(1).strip().rstrip('؟?')
        rows = _sq(models.Student).filter(
            models.Student.name.ilike(f"%{name_q}%")).limit(10).all()
        if not rows:
            return f"لا يوجد طالب باسم «{name_q}» في النظام."
        if len(rows) == 1:
            return _student_card(rows[0])
        lines = [f"وُجد **{len(rows)}** طلاب باسم «{name_q}»:"]
        for s in rows:
            lines.append(f"• {s.name} ({s.student_id}) — {s.faculty_id} — سنة {s.level} — {s.status}")
        return "\n".join(lines)

    # ── 12. نسبة السداد / التحصيل المالي ────────────────────────────────────
    if re.search(r'(نسبة.{0,5}سداد|سداد.{0,10}رسوم|تحصيل مالي|التحصيل المالي|'
                 r'رسوم.{0,10}محصّل|المحصّلة|لم يسدد|غير مسدد|نسبة.{0,5}تحصيل)', q):
        return _payment_stats()

    # ── 13. إجمالي الإيرادات ─────────────────────────────────────────────────
    if re.search(r'(إجمالي الرسوم|اجمالي الرسوم|مجموع الرسوم|الإيرادات|الايرادات|المحصّل)', q):
        return _payment_stats()

    # ── 14. الكليات ──────────────────────────────────────────────────────────
    if re.search(r'(كم|عدد|اعرض|قائمة).{0,15}(كليات|الكليات)', q):
        rows = db.query(models.Faculty).all()
        lines = [f"🏛️ الكليات في النظام: **{len(rows)}**"]
        for f in rows:
            lines.append(f"• {f.id}: {f.name if hasattr(f,'name') else ''}")
        return "\n".join(lines)

    # ── 15. الأقسام ──────────────────────────────────────────────────────────
    if re.search(r'(اقسام|أقسام|الأقسام|التخصصات)', q):
        fac_m = re.search(r'(كلية|كل).{0,10}(\w+)', q)
        dq = db.query(models.Department)
        rows = dq.limit(30).all()
        lines = [f"📂 **الأقسام** ({len(rows)} قسم):"]
        for d in rows:
            lines.append(f"• {d.name} ({d.id}) — {d.faculty_id}")
        return "\n".join(lines)

    # ── 16. المقررات الدراسية ────────────────────────────────────────────────
    if re.search(r'(مقررات|المقررات|كورسات|المواد الدراسية|الكتالوج|catalog)', q, re.I):
        rows = db.query(models.Course).limit(40).all()
        lines = [f"📖 **المقررات الدراسية** ({len(rows)} مادة):"]
        for c in rows:
            lines.append(f"• {c.id}: {c.name} — سنة {c.level} — {c.credit_hours or '—'} ساعة")
        return "\n".join(lines)

    # ── 17. الإعلانات ────────────────────────────────────────────────────────
    if re.search(r'(إعلانات|اعلانات|الإعلانات|إعلان|اعلان)', q):
        rows = db.query(models.Announcement).filter(
            models.Announcement.is_active == True
        ).order_by(models.Announcement.created_at.desc()).limit(10).all()
        if not rows:
            return "لا توجد إعلانات نشطة حالياً."
        lines = [f"📢 **الإعلانات النشطة** ({len(rows)}):"]
        for a in rows:
            lines.append(f"• [{a.priority or 'عادي'}] {a.title}")
        return "\n".join(lines)

    # ── 18. طلبات التسجيل ────────────────────────────────────────────────────
    if re.search(r'(طلبات التسجيل|طلبات معلّقة|الطلبات المعلقة|requests|طلب تسجيل)', q, re.I):
        pending = db.query(models.RegistrationRequest).filter(
            models.RegistrationRequest.status == "قيد المراجعة").count()
        total_r = db.query(models.RegistrationRequest).count()
        return (
            f"📋 **طلبات التسجيل:**\n"
            f"• معلّقة: **{pending}** | إجمالي: {total_r}"
        )

    # ── 19. قائمة الطلاب ─────────────────────────────────────────────────────
    if re.search(r'(اعرض|عرض|قائمة|جيب|هات)\s+(الطلاب|طلاب)\b', q) \
       and not re.search(r'(المستوى|السنة|مقيد|موقوف|مفصول|كلية|قسم)', q):
        rows  = _sq(models.Student).limit(10).all()
        total = _sq(models.Student).count()
        lines = [f"📋 **قائمة الطلاب** (أول 10 من {total}):"]
        for s in rows:
            lines.append(f"• {s.name} ({s.student_id}) — {s.faculty_id} — سنة {s.level} — {s.status}")
        return "\n".join(lines)

    # ── 20. أعلى معدل / أفضل طالب ───────────────────────────────────────────
    if re.search(r'(أعلى معدل|اعلى معدل|أفضل طالب|افضل طالب|أعلى gpa|highest gpa)', q, re.I):
        s = _sq(models.Student).filter(
            models.Student.gpa.isnot(None)).order_by(models.Student.gpa.desc()).first()
        if not s: return "لا توجد بيانات معدل مسجّلة."
        return f"🏆 أعلى معدل: **{s.name}** ({s.student_id}) — GPA: **{s.gpa}**"

    # ── 21. أدنى معدل ────────────────────────────────────────────────────────
    if re.search(r'(أدنى معدل|ادنى معدل|أضعف طالب|اضعف طالب)', q):
        s = _sq(models.Student).filter(
            models.Student.gpa.isnot(None)).order_by(models.Student.gpa.asc()).first()
        if not s: return "لا توجد بيانات معدل مسجّلة."
        return f"📉 أدنى معدل: **{s.name}** ({s.student_id}) — GPA: **{s.gpa}**"

    # ── 22. توزيع المستويات ──────────────────────────────────────────────────
    if re.search(r'(توزيع|عدد في كل مستوى|كل مستوى|كل سنة)', q):
        lines = ["📊 **توزيع الطلاب حسب المستوى:**"]
        for lvl in range(1, 8):
            c = _sq(models.Student).filter(models.Student.level == lvl).count()
            if c: lines.append(f"• المستوى {lvl}: {c} طالب")
        return "\n".join(lines)

    # ── 23. نسبة النجاح / الرسوب ─────────────────────────────────────────────
    if re.search(r'(نسبة النجاح|نسبة الرسوب|الراسبين|الناجحين)', q):
        total = db.query(models.Grade).filter(models.Grade.total.isnot(None)).count()
        if total == 0: return "لا توجد درجات مسجّلة في النظام."
        passed = db.query(models.Grade).filter(models.Grade.total >= 60).count()
        failed = total - passed
        return (
            f"📊 **نتائج الدرجات:**\n"
            f"• ناجح: {passed} | راسب: {failed} | إجمالي: {total}\n"
            f"• نسبة النجاح: **{round(passed/total*100,1)}%**"
        )

    # ── 24. طلاب اللائحة ─────────────────────────────────────────────────────
    if re.search(r'(لائحة قديمة|لائحة جديدة|اللائحة)', q):
        for reg, label in [("لائحة جديدة","الجديدة"), ("لائحة قديمة","القديمة")]:
            if re.search(reg, q):
                c = _sq(models.Student).filter(models.Student.regulation == reg).count()
                return f"طلاب اللائحة {label}: **{c}** طالب"
        old = _sq(models.Student).filter(models.Student.regulation == "لائحة قديمة").count()
        new = _sq(models.Student).filter(models.Student.regulation == "لائحة جديدة").count()
        return f"📋 **اللوائح:**\n• لائحة جديدة: {new} | لائحة قديمة: {old}"

    # ── 25. عدد المواد في الكورس ─────────────────────────────────────────────
    if re.search(r'(كم عدد المواد|كم مادة|عدد المقررات)', q):
        c = db.query(models.Course).count()
        return f"عدد المقررات في النظام: **{c}** مادة"

    # ── 26. كيفية إضافة طالب ─────────────────────────────────────────────────
    if re.search(r'(كيف.{0,10}(اضيف|أضيف|اضافة|إضافة).{0,10}طالب)', q):
        return (
            "📝 **لإضافة طالب جديد:**\n"
            "اذهب إلى قسم «بيانات الطلاب» من القائمة الجانبية، ثم اضغط «إضافة طالب».\n"
            "البيانات المطلوبة: الاسم، كود الطالب، الرقم القومي، الكلية، المستوى، الحالة.\n"
            "أو يمكنك إخباري ببيانات الطالب وسأضيفه مباشرة."
        )

    # ── 27. كيفية إغلاق مقرر ─────────────────────────────────────────────────
    if re.search(r'(كيف.{0,10}(اغلق|أغلق|غلق|إغلاق).{0,10}مقرر)', q):
        return (
            "🔒 **لإغلاق مقرر دراسي:**\n"
            "اذهب إلى «غلق المقررات» من القائمة، اختر المادة والفصل الدراسي وأكّد الإغلاق.\n"
            "بعد الإغلاق لن تُقبل تسجيلات جديدة على المادة."
        )

    # ── 28. كيفية إصدار إذن دفع ──────────────────────────────────────────────
    if re.search(r'(إذن دفع|اذن دفع|كيف.{0,10}(اصدر|أصدر|إصدار))', q):
        return (
            "💳 **لإصدار إذن دفع:**\n"
            "اذهب إلى «البيانات المالية → إذن دفع» من القائمة.\n"
            "أدخل كود الطالب أو ابحث بالاسم، حدد المبلغ والسنة الدراسية، ثم اطبع الإذن."
        )

    # ── 29. الصلاحيات ────────────────────────────────────────────────────────
    if re.search(r'(صلاحيات|صلاحيتي|ماذا أستطيع|ما الذي أستطيع)', q):
        role = user.role
        perms = {
            "super_admin":     "لديك صلاحيات كاملة على النظام: إدارة الطلاب، الكليات، المستخدمين، الدرجات، الماليات، الإعلانات وكل العمليات.",
            "faculty_admin":   "لديك صلاحيات إدارة طلاب كليتك: الدرجات، الحضور، الرسوم، التسجيلات، والإعلانات.",
            "student_affairs": "لديك صلاحيات عرض وتعديل بيانات الطلاب والوثائق وطلبات التسجيل.",
            "student":         "يمكنك عرض درجاتك وجدولك وحضورك وبياناتك الشخصية فقط.",
        }
        return f"🔐 **صلاحياتك ({role}):**\n{perms.get(role,'صلاحيات غير معروفة')}"

    # ── 30. السلام والتحية ────────────────────────────────────────────────────
    if re.search(r'^(مرحبا|مرحباً|أهلاً|اهلا|السلام عليكم|هاي|hi|hello|صباح|مساء)', q, re.I):
        return "أهلاً وسهلاً! 👋 أنا مساعد نظام DUMLIS. يمكنني مساعدتك في:\n• بيانات الطلاب والدرجات والحضور\n• الإحصائيات والتقارير\n• السجلات المالية\n\nبماذا يمكنني مساعدتك؟"

    # ── 31. شكر / ختام ───────────────────────────────────────────────────────
    if re.search(r'^(شكرا|شكراً|ممتاز|تمام|عظيم|أحسنت|احسنت|ok|okay|كويس|برافو)', q, re.I):
        return "على الرحب والسعة! 😊 هل تحتاج لشيء آخر؟"

    # ── 32. أسئلة خارج النطاق ────────────────────────────────────────────────
    if re.search(r'(الطقس|نكتة|اضحكني|كرة القدم|أخبار|اخبار|برنامج تلفزيون|موسيقى|'
                 r'وصفة|طبخ|رياضة|سياسة|دين|فلسفة|شعر|قصيدة)', q):
        return "أنا مساعد جامعي متخصص في نظام DUMLIS فقط 😊 لا أستطيع الإجابة على هذا السؤال."

    # ── 33. توقع الدخل السنة الجايه ─────────────────────────────────────────────
    if re.search(r'(توقع|تتوقع|predict).{0,20}(دخل|إيراد|revenue|السنة الجايه|العام الجاي)', q, re.I):
        try:
            rev = float(db.query(func.sum(models.FinancialRecord.paid_amount)).scalar() or 0)
            growth_rate = 0.15
            next_year = rev * (1 + growth_rate)
            return (
                f"📈 **توقع الدخل للسنة الجايه:**\n"
                f"• الدخل الحالي: **{rev:,.0f}** ج.م\n"
                f"• معدل النمو المتوقع: **15%**\n"
                f"• الدخل المتوقع: **{next_year:,.0f}** ج.م"
            )
        except: pass

    # ── 34. توقع نسب النجاح ────────────────────────────────────────────────────
    if re.search(r'(توقع|تتوقع|predict).{0,20}(نسبة النجاح|success rate)', q, re.I):
        try:
            total = db.query(models.Grade).filter(models.Grade.total.isnot(None)).count()
            if total == 0: return "لا توجد درجات مسجّلة حالياً."
            passed = db.query(models.Grade).filter(models.Grade.total >= 60).count()
            current_rate = (passed / total * 100) if total else 0
            predicted = min(current_rate + 5, 100)
            return (
                f"📊 **توقع نسبة النجاح:**\n"
                f"• النسبة الحالية: **{current_rate:.1f}%**\n"
                f"• التحسن المتوقع: **+5%**\n"
                f"• النسبة المتوقعة: **{predicted:.1f}%**"
            )
        except: pass

    # ── 35. متوسط المعدل ────────────────────────────────────────────────────────
    if re.search(r'(متوسط|average).{0,10}(معدل|gpa)', q, re.I):
        try:
            students = _sq(models.Student).filter(
                models.Student.gpa.isnot(None)).all()
            if not students: return "لا توجد بيانات معدل متاحة."
            avg_gpa = sum(s.gpa for s in students) / len(students)
            return f"📈 **متوسط المعدل التراكمي:** **{avg_gpa:.2f}**"
        except: pass

    # ── 36. أعلى نسبة حضور ─────────────────────────────────────────────────────
    if re.search(r'(أعلى|اعلى|highest).{0,10}(نسبة حضور|حضور)', q):
        try:
            students = _sq(models.Student).all()
            best_student = None
            best_rate = 0
            for s in students:
                att = db.query(models.AttendanceRecord).filter(
                    models.AttendanceRecord.student_id == s.student_id).all()
                if att:
                    present = sum(1 for r in att if r.status == "حاضر")
                    rate = present / len(att)
                    if rate > best_rate:
                        best_rate = rate
                        best_student = s
            if best_student:
                return f"🏆 **أعلى نسبة حضور:** {best_student.name} ({best_student.student_id}) — **{best_rate*100:.1f}%**"
        except: pass

    # ── 37. متوسط نسبة الحضور ──────────────────────────────────────────────────
    if re.search(r'(متوسط|average).{0,10}(حضور|attendance)', q, re.I):
        try:
            all_att = db.query(models.AttendanceRecord).all()
            if not all_att: return "لا توجد سجلات حضور متاحة."
            present = sum(1 for r in all_att if r.status == "حاضر")
            avg_rate = (present / len(all_att) * 100) if all_att else 0
            return f"📅 **متوسط نسبة الحضور:** **{avg_rate:.1f}%**"
        except: pass

    # ── 38. إجمالي الساعات الدراسية ─────────────────────────────────────────────
    if re.search(r'(إجمالي|اجمالي|total).{0,10}(ساعات|hours)', q):
        try:
            courses = db.query(models.Course).all()
            total_hours = sum(float(c.credit_hours or 0) for c in courses)
            return f"📖 **إجمالي الساعات الدراسية:** **{total_hours:.0f}** ساعة"
        except: pass

    # ── 39. عدد المواد المغلقة ──────────────────────────────────────────────────
    if re.search(r'(عدد|كم).{0,10}(مواد|مقررات).{0,10}(مغلق|مغلقة|closed)', q):
        try:
            closed = db.query(models.CourseClosure).count()
            return f"🔒 **عدد المواد المغلقة:** **{closed}** مادة"
        except:
            return "لا توجد بيانات عن المواد المغلقة."

    # ── 40. عدد المواد النشطة ───────────────────────────────────────────────────
    if re.search(r'(عدد|كم).{0,10}(مواد|مقررات|courses).{0,10}(نشط|active)', q):
        try:
            active = db.query(models.Course).count()
            return f"📚 **عدد المواد النشطة:** **{active}** مادة"
        except: pass

    # ── 41. نسبة الطلاب النشطين ─────────────────────────────────────────────────
    if re.search(r'(نسبة|percentage).{0,15}(طلاب نشط|فعال)', q):
        try:
            total = _sq(models.Student).count()
            active = _sq(models.Student).filter(models.Student.status == "مقيد").count()
            pct = (active / total * 100) if total else 0
            return f"📊 **نسبة الطلاب النشطين:** **{pct:.1f}%** ({active} من {total})"
        except: pass

    # ── 42. التنبؤ بعدد الطلاب السنة الجايه ──────────────────────────────────────
    if re.search(r'(توقع|تتوقع|predict).{0,20}(عدد الطلاب|students).{0,20}(السنة|القادمة|الجاية)', q, re.I):
        try:
            current_total = _sq(models.Student).count()
            growth_rate = 0.08
            predicted_next = current_total * (1 + growth_rate)
            return (
                f"📈 **توقع عدد الطلاب للسنة القادمة:**\n"
                f"• العدد الحالي: **{current_total}** طالب\n"
                f"• معدل النمو المتوقع: **8%**\n"
                f"• العدد المتوقع: **{predicted_next:.0f}** طالب"
            )
        except: pass

    # ── 43. أعلى درجة في النظام ────────────────────────────────────────────────
    if re.search(r'(أعلى|اعلى|highest).{0,10}(درجة|grade|علامة)', q):
        try:
            g = db.query(models.Grade).filter(
                models.Grade.total.isnot(None)).order_by(
                models.Grade.total.desc()).first()
            if g:
                s = db.get(models.Student, g.student_id)
                name = s.name if s else "—"
                return f"🏆 **أعلى درجة:** {g.total} ({name}) في مادة {g.course_id}"
        except: pass

    # ── 44. أقل درجة في النظام ────────────────────────────────────────────────
    if re.search(r'(أقل|اقل|lowest).{0,10}(درجة|grade|علامة)', q):
        try:
            g = db.query(models.Grade).filter(
                models.Grade.total.isnot(None)).order_by(
                models.Grade.total.asc()).first()
            if g:
                s = db.get(models.Student, g.student_id)
                name = s.name if s else "—"
                return f"📉 **أقل درجة:** {g.total} ({name}) في مادة {g.course_id}"
        except: pass

    # ── 45. إحصائيات الطلاب الموقوفين ────────────────────────────────────────────
    if re.search(r'(موقوف|suspended|معلق).{0,20}(عدد|إحصائيات)', q):
        try:
            count = _sq(models.Student).filter(models.Student.status == "موقوف").count()
            total = _sq(models.Student).count()
            pct = (count / total * 100) if total else 0
            return (
                f"⚠️ **الطلاب الموقوفين:**\n"
                f"• العدد: **{count}** طالب\n"
                f"• النسبة: **{pct:.1f}%**"
            )
        except: pass

    # ── 46. توقع نسبة التسرب ────────────────────────────────────────────────────
    if re.search(r'(توقع|تتوقع|predict).{0,20}(تسرب|dropout|attrition)', q, re.I):
        try:
            total = _sq(models.Student).count()
            dropped = _sq(models.Student).filter(models.Student.status == "مفصول").count()
            current_rate = (dropped / total * 100) if total else 0
            predicted = min(current_rate + 3, 100)
            return (
                f"📉 **توقع نسبة التسرب:**\n"
                f"• النسبة الحالية: **{current_rate:.1f}%**\n"
                f"• التوقع للسنة القادمة: **{predicted:.1f}%**"
            )
        except: pass

    # ── 47. متوسط الراتب / الميزانية ─────────────────────────────────────────────
    if re.search(r'(متوسط|average).{0,10}(رسوم|رسم|fee)', q):
        try:
            fin = db.query(models.FinancialRecord).all()
            if fin:
                avg_fee = sum(float(r.amount or 0) for r in fin) / len(fin)
                return f"💰 **متوسط الرسوم:** **{avg_fee:,.0f}** ج.م"
        except: pass

    # ── 48. عدد الطلاب الخريجين ──────────────────────────────────────────────────
    if re.search(r'(خريج|خريجين|graduate|graduated)', q):
        try:
            count = _sq(models.Student).filter(models.Student.status == "خريج").count()
            total = _sq(models.Student).count()
            pct = (count / total * 100) if total else 0
            return f"🎓 **الطلاب الخريجين:** **{count}** طالب (**{pct:.1f}%** من الإجمالي)"
        except: pass

    # ── 49. أكثر مادة مسجّلة ─────────────────────────────────────────────────────
    if re.search(r'(أكثر|اكثر|أكثر).{0,10}(مادة|مقرر|course).{0,10}(مسجّل|تسجيل)', q):
        try:
            enrollments = db.query(models.Enrollment).all()
            if enrollments:
                from collections import Counter
                course_counts = Counter(e.course_id for e in enrollments)
                top_course = course_counts.most_common(1)[0]
                return f"📚 **أكثر مادة تسجيلاً:** {top_course[0]} — **{top_course[1]}** طالب"
        except: pass

    # ── 50. نسبة السداد المتوقعة ─────────────────────────────────────────────────
    if re.search(r'(توقع|تتوقع|predict).{0,20}(سداد|رسوم|collection)', q, re.I):
        try:
            total_students = _sq(models.Student).count()
            paid = _sq(models.Student).filter(models.Student.fees_status == "مسدد").count()
            current_rate = (paid / total_students * 100) if total_students else 0
            predicted = min(current_rate + 8, 100)
            return (
                f"💳 **توقع نسبة السداد:**\n"
                f"• النسبة الحالية: **{current_rate:.1f}%**\n"
                f"• الهدف المتوقع: **{predicted:.1f}%**"
            )
        except: pass

    # ── 51. عدد الطلاب المنتظمين ─────────────────────────────────────────────────
    if re.search(r'(منتظم|مستمر|regular|ongoing)', q):
        try:
            count = _sq(models.Student).filter(models.Student.status == "منتظم").count()
            return f"✅ **الطلاب المنتظمين:** **{count}** طالب"
        except: pass

    # ── 52. توزيع الكليات ─────────────────────────────────────────────────────────
    if re.search(r'(توزيع|distribution).{0,10}(كليات|faculties)', q):
        try:
            faculties = db.query(models.Faculty).all()
            lines = ["🏛️ **توزيع الطلاب حسب الكليات:**"]
            for f in faculties:
                c = _sq(models.Student).filter(models.Student.faculty_id == f.id).count()
                if c > 0:
                    lines.append(f"• {f.id}: {c} طالب")
            return "\n".join(lines)
        except: pass

    # ── 53. الإعلانات الهامة ───────────────────────────────────────────────────────
    if re.search(r'(أهم|اهم|important).{0,10}(إعلان|اعلان|announcement)', q):
        try:
            rows = db.query(models.Announcement).filter(
                models.Announcement.is_active == True,
                models.Announcement.priority == "أهم"
            ).limit(5).all()
            if rows:
                lines = ["⚡ **الإعلانات الهامة:**"]
                for a in rows:
                    lines.append(f"• {a.title}")
                return "\n".join(lines)
        except: pass

    # ── 54. إجمالي الرسوم المطلوبة ─────────────────────────────────────────────────
    if re.search(r'(إجمالي|اجمالي|total).{0,10}(مطلوب|due|outstanding)', q):
        try:
            fin = db.query(models.FinancialRecord).all()
            if fin:
                total_due = sum(float(r.amount or 0) for r in fin)
                total_paid = sum(float(r.paid_amount or 0) for r in fin)
                outstanding = total_due - total_paid
                return (
                    f"💸 **الرسوم المطلوبة:**\n"
                    f"• الإجمالي: **{total_due:,.0f}** ج.م\n"
                    f"• المسدد: **{total_paid:,.0f}** ج.م\n"
                    f"• المتبقي: **{outstanding:,.0f}** ج.م"
                )
        except: pass

    # ── 55. توقع عدد المسجلين الجدد ──────────────────────────────────────────────
    if re.search(r'(توقع|تتوقع|predict).{0,20}(مسجلين جدد|new enrollment)', q, re.I):
        try:
            current = _sq(models.Student).count()
            monthly_avg = max(current // 12, 5)
            next_month = current + monthly_avg
            return (
                f"📊 **توقع المسجلين الجدد الشهر القادم:**\n"
                f"• المتوسط الشهري: **{monthly_avg}** طالب\n"
                f"• الإجمالي المتوقع: **{next_month}** طالب"
            )
        except: pass

    # ── 56. توقع النجاح (variation) ─────────────────────────────────────────────
    if re.search(r'(توقع|تتوقع|predict).{0,15}(النجاح|success)', q, re.I):
        try:
            total = db.query(models.Grade).filter(models.Grade.total.isnot(None)).count()
            if total == 0: return "لا توجد درجات مسجّلة."
            passed = db.query(models.Grade).filter(models.Grade.total >= 60).count()
            current_rate = (passed / total * 100) if total else 0
            predicted = min(current_rate + 5, 100)
            return (
                f"📊 **توقع نسبة النجاح:**\n"
                f"• النسبة الحالية: **{current_rate:.1f}%**\n"
                f"• النسبة المتوقعة: **{predicted:.1f}%**"
            )
        except: pass

    # ── 57. نسبة الطلاب النشطين (variation) ─────────────────────────────────────
    if re.search(r'(نسبة|percentage).{0,10}(نشط|فعال|active)', q):
        try:
            total = _sq(models.Student).count()
            active = _sq(models.Student).filter(models.Student.status == "مقيد").count()
            pct = (active / total * 100) if total else 0
            return f"📊 **نسبة الطلاب النشطين:** **{pct:.1f}%** ({active} من {total})"
        except: pass

    # ── 58. طلاب المستوى (شامل) ────────────────────────────────────────────────
    if re.search(r'(المستوى|سنة).{0,5}(أول|الأول|الاول|اولى|الأولى|اولي|1)\b', q):
        try:
            count = _sq(models.Student).filter(models.Student.level == 1).count()
            return f"📚 **طلاب المستوى الأول:** **{count}** طالب"
        except: pass

    if re.search(r'(المستوى|سنة).{0,5}(ثاني|الثاني|ثانية|الثانية|2)\b', q):
        try:
            count = _sq(models.Student).filter(models.Student.level == 2).count()
            return f"📚 **طلاب المستوى الثاني:** **{count}** طالب"
        except: pass

    if re.search(r'(المستوى|سنة).{0,5}(ثالث|الثالث|ثالثة|الثالثة|3)\b', q):
        try:
            count = _sq(models.Student).filter(models.Student.level == 3).count()
            return f"📚 **طلاب المستوى الثالث:** **{count}** طالب"
        except: pass

    if re.search(r'(المستوى|سنة).{0,5}(رابع|الرابع|رابعة|الرابعة|4)\b', q):
        try:
            count = _sq(models.Student).filter(models.Student.level == 4).count()
            return f"📚 **طلاب المستوى الرابع:** **{count}** طالب"
        except: pass

    # ── 59. بيانات الطالب (اسم محدد) ────────────────────────────────────────────
    m_name = re.search(r'(?:بيانات|معلومات|ملف)\s+(?:الطالب|الطالبة)\s+([^\d؟?،,]{2,30})', q)
    if m_name:
        name_q = m_name.group(1).strip().rstrip('؟?')
        rows = _sq(models.Student).filter(
            models.Student.name.ilike(f"%{name_q}%")).limit(1).all()
        if rows:
            s = rows[0]
            return (
                f"**{s.name}** (كود: {s.student_id})\n"
                f"• الكلية: {s.faculty_id} | المستوى: {s.level}\n"
                f"• الحالة: {s.status} | المعدل: {s.gpa or '—'}"
            )
        return f"لا يوجد طالب باسم {name_q}"

    # ── 60. معدل طالب محدد ──────────────────────────────────────────────────────
    m_name = re.search(r'(معدل|gpa)\s+(?:الطالب|الطالبة)\s+([^\d؟?،,]{2,30})', q, re.I)
    if m_name:
        name_q = m_name.group(2).strip().rstrip('؟?')
        rows = _sq(models.Student).filter(
            models.Student.name.ilike(f"%{name_q}%")).limit(1).all()
        if rows:
            s = rows[0]
            return f"📈 المعدل التراكمي للطالب **{s.name}**: **{s.gpa or 'غير مسجّل'}**"
        return f"لا يوجد طالب باسم {name_q}"

    # ── 61. درجات طالب محدد ──────────────────────────────────────────────────────
    m_name = re.search(r'(درجات|نتائج|علامات)\s+(?:الطالب|الطالبة)\s+([^\d؟?،,]{2,30})', q)
    if m_name:
        name_q = m_name.group(2).strip().rstrip('؟?')
        s = _sq(models.Student).filter(
            models.Student.name.ilike(f"%{name_q}%")).first()
        if not s: return f"لا يوجد طالب باسم {name_q}"
        grades = db.query(models.Grade).filter(models.Grade.student_id == s.student_id).all()
        if not grades: return f"لا توجد درجات للطالب **{s.name}**"
        lines = [f"📚 درجات **{s.name}**:"]
        for g in grades[:5]:
            lines.append(f"• {g.course_id}: {g.total or '—'} ({g.grade_letter or '—'})")
        return "\n".join(lines)

    # ── 62. حضور طالب محدد ──────────────────────────────────────────────────────
    m_name = re.search(r'(حضور|غياب)\s+(?:الطالب|الطالبة)\s+([^\d؟?،,]{2,30})', q)
    if m_name:
        name_q = m_name.group(2).strip().rstrip('؟?')
        s = _sq(models.Student).filter(
            models.Student.name.ilike(f"%{name_q}%")).first()
        if not s: return f"لا يوجد طالب باسم {name_q}"
        att = db.query(models.AttendanceRecord).filter(
            models.AttendanceRecord.student_id == s.student_id).all()
        if not att: return f"لا توجد سجلات حضور للطالب **{s.name}**"
        present = sum(1 for r in att if r.status == "حاضر")
        pct = round(present / len(att) * 100, 1) if att else 0
        return f"📅 حضور **{s.name}**: **{pct}%** ({present}/{len(att)})"

    # ── 63. هل يوجد طلاب موقوفين ────────────────────────────────────────────────
    if re.search(r'(هل|يوجد).{0,10}(طلاب).{0,10}(موقوف|معلق)', q):
        count = _sq(models.Student).filter(models.Student.status == "موقوف").count()
        if count > 0:
            return f"✅ نعم، يوجد **{count}** طالب موقوفين"
        return "❌ لا، لا يوجد طلاب موقوفين"

    # ── 64. هل يوجد طلاب مفصولين ────────────────────────────────────────────────
    if re.search(r'(هل|يوجد).{0,10}(طلاب).{0,10}(مفصول|محذوف)', q):
        count = _sq(models.Student).filter(models.Student.status == "مفصول").count()
        if count > 0:
            return f"✅ نعم، يوجد **{count}** طالب مفصولين"
        return "❌ لا، لا يوجد طلاب مفصولين"

    # ── 65. الرسوم في فصل/سنة محددة ──────────────────────────────────────────────
    if re.search(r'(رسوم|الرسوم).{0,20}(فصل|سنة|عام)', q):
        try:
            fin = db.query(models.FinancialRecord).all()
            if fin:
                total = sum(float(r.amount or 0) for r in fin)
                return f"💰 **إجمالي الرسوم:** **{total:,.0f}** ج.م"
        except: pass

    # ── 66. إجمالي المحصل والمتبقي ───────────────────────────────────────────────
    if re.search(r'(محصل|متبقي|مسدد|غير مسدد)', q):
        try:
            fin = db.query(models.FinancialRecord).all()
            if fin:
                due = sum(float(r.amount or 0) for r in fin)
                paid = sum(float(r.paid_amount or 0) for r in fin)
                return (
                    f"💳 **الملخص المالي:**\n"
                    f"• المطلوب: **{due:,.0f}** ج.م\n"
                    f"• المسدد: **{paid:,.0f}** ج.م\n"
                    f"• المتبقي: **{due-paid:,.0f}** ج.م"
                )
        except: pass

    # ── 67. أقل حضور ────────────────────────────────────────────────────────────
    if re.search(r'(أقل|اقل|lowest).{0,10}(حضور|attendance)', q):
        try:
            students = _sq(models.Student).all()
            worst_student = None
            worst_rate = 100
            for s in students:
                att = db.query(models.AttendanceRecord).filter(
                    models.AttendanceRecord.student_id == s.student_id).all()
                if att:
                    present = sum(1 for r in att if r.status == "حاضر")
                    rate = present / len(att)
                    if rate < worst_rate:
                        worst_rate = rate
                        worst_student = s
            if worst_student:
                return f"📉 **أقل نسبة حضور:** {worst_student.name} — **{worst_rate*100:.1f}%**"
        except: pass

    # ── 68. عدد المواد المفتوحة ──────────────────────────────────────────────────
    if re.search(r'(عدد|كم).{0,10}(مواد|مقررات).{0,10}(مفتوح|نشط|open)', q):
        try:
            open_courses = db.query(models.Course).count()
            return f"📚 **عدد المواد المفتوحة:** **{open_courses}** مادة"
        except: pass

    # ── 69. متوسط درجات الطلاب ──────────────────────────────────────────────────
    if re.search(r'(متوسط|average).{0,15}(درجات|grades)', q):
        try:
            grades = db.query(models.Grade).filter(models.Grade.total.isnot(None)).all()
            if grades:
                avg = sum(float(g.total or 0) for g in grades) / len(grades)
                return f"📊 **متوسط درجات الطلاب:** **{avg:.2f}**"
        except: pass

    # ── 70. نسبة الحضور العامة ───────────────────────────────────────────────────
    if re.search(r'(نسبة|معدل).{0,10}(حضور).{0,10}(عام|general|الكل)', q):
        try:
            all_att = db.query(models.AttendanceRecord).all()
            if all_att:
                present = sum(1 for r in all_att if r.status == "حاضر")
                avg = (present / len(all_att) * 100) if all_att else 0
                return f"📅 **نسبة الحضور العامة:** **{avg:.1f}%**"
        except: pass

    # ── 71. عدد المسجلين (variation) ──────────────────────────────────────────────
    if re.search(r'(عدد|كم).{0,10}(مسجلين|enrolled|enrolled students)', q):
        try:
            count = db.query(models.Enrollment).count()
            return f"📋 **عدد التسجيلات:** **{count}** تسجيل"
        except: pass

    # ── 72. الموقوفين (بصيغ مختلفة) ──────────────────────────────────────────────
    if re.search(r'(الموقوف|معلق|suspended)', q):
        try:
            count = _sq(models.Student).filter(models.Student.status == "موقوف").count()
            total = _sq(models.Student).count()
            pct = (count / total * 100) if total else 0
            return (
                f"⚠️ **الطلاب الموقوفين:**\n"
                f"• العدد: **{count}** طالب\n"
                f"• النسبة: **{pct:.1f}%**"
            )
        except: pass

    # ── 73. الرسوم المطلوبة (شامل) ──────────────────────────────────────────────
    if re.search(r'(رسوم|رسم).{0,20}(مطلوب|متأخر|باقي)', q):
        try:
            fin = db.query(models.FinancialRecord).all()
            if fin:
                due = sum(float(r.amount or 0) for r in fin)
                paid = sum(float(r.paid_amount or 0) for r in fin)
                remaining = due - paid
                return (
                    f"💸 **الرسوم المطلوبة:**\n"
                    f"• الإجمالي: **{due:,.0f}** ج.م\n"
                    f"• المسدد: **{paid:,.0f}** ج.م\n"
                    f"• المتبقي: **{remaining:,.0f}** ج.م"
                )
        except: pass

    # ── 74. أكثر مادة (variations) ──────────────────────────────────────────────
    if re.search(r'(أكثر|اكثر|أعلى).{0,20}(مادة|مقرر|course)', q):
        try:
            enrollments = db.query(models.Enrollment).all()
            if enrollments:
                from collections import Counter
                course_counts = Counter(e.course_id for e in enrollments)
                if course_counts:
                    top_course = course_counts.most_common(1)[0]
                    return f"📚 **أكثر مادة تسجيلاً:** {top_course[0]} — **{top_course[1]}** طالب"
        except: pass

    # ── 75. بيانات الطالب (بدون اسم) ────────────────────────────────────────────
    if re.search(r'(اعرض|عرض|بيانات|معلومات)\s+(?:الطالب|الطالبة|student)\b', q) and not re.search(r'\d+', q):
        return "لأستطيع المساعدة، الرجاء تحديد رقم الطالب أو اسمه (مثال: 'بيانات الطالب أحمد')"

    # ── 76. معدل طالب (بدون اسم) ────────────────────────────────────────────────
    if re.search(r'(معدل|gpa)\s+(?:الطالب|الطالبة|student)\b', q, re.I) and not re.search(r'\d+', q):
        return "لأستطيع المساعدة، الرجاء تحديد رقم الطالب أو اسمه (مثال: 'معدل الطالب أحمد')"

    # ── 77. درجات طالب (بدون اسم) ─────────────────────────────────────────────
    if re.search(r'(درجات|نتائج|علامات)\s+(?:الطالب|الطالبة|student)\b', q) and not re.search(r'\d+', q):
        return "لأستطيع المساعدة، الرجاء تحديد رقم الطالب أو اسمه (مثال: 'درجات الطالب أحمد')"

    # ── 78. حضور طالب (بدون اسم) ──────────────────────────────────────────────
    if re.search(r'(حضور|غياب)\s+(?:الطالب|الطالبة|student)\b', q) and not re.search(r'\d+', q):
        return "لأستطيع المساعدة، الرجاء تحديد رقم الطالب أو اسمه (مثال: 'حضور الطالب أحمد')"

    # ── 79. المسجلين الجدد (variations) ────────────────────────────────────────
    if re.search(r'(مسجل|تسجيل)', q):
        try:
            current = _sq(models.Student).count()
            monthly_avg = max(current // 12, 5)
            return f"📊 **المسجلين الجدد:** متوسط **{monthly_avg}** طالب شهرياً"
        except: pass

    # ── 80. الأسئلة غير المحددة بدقة (fallback عام) ──────────────────────────────
    if re.search(r'(تقرير|ملخص|توقع|إحصائيات|مؤشرات|أهداف|نسبة الرضا|شكاوى|ذكور|إناث)', q):
        try:
            total = _sq(models.Student).count()
            active = _sq(models.Student).filter(models.Student.status == "مقيد").count()
            return (
                f"📊 **ملخص سريع:**\n"
                f"• إجمالي الطلاب: **{total}**\n"
                f"• الطلاب النشطين: **{active}**"
            )
        except: pass

    return None  # لم يتطابق أي pattern → انتقل للـ AI


# ── Live context builder ──────────────────────────────────────────────────────

def _build_admin_context(db: Session) -> str:
    """Injects live DB stats into every system prompt — answers general questions without tools."""
    try:
        total  = _sq(models.Student).count()
        active = _sq(models.Student).filter(models.Student.status  == "مقيد").count()
        unpaid = _sq(models.Student).filter(models.Student.fees_status == "غير مسدد").count()

        faculties = db.query(models.Faculty).all()
        fac_list  = " | ".join(f.id for f in faculties) if faculties else "—"

        ann_count = db.query(models.Announcement).filter(
            models.Announcement.is_active == True).count()
        pending   = db.query(models.RegistrationRequest).filter(
            models.RegistrationRequest.status == "قيد المراجعة").count()

        # Per-level counts
        level_counts = {}
        for lvl in range(1, 5):
            c = _sq(models.Student).filter(models.Student.level == lvl).count()
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
    rows = _sq(models.Student).filter(
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

    # ── Direct answer layer — no AI needed ───────────────────────────────────
    if body.messages:
        last_q = body.messages[-1].content
        direct = _try_direct(last_q, db, current_user)
        if direct is not None:
            logger.info("AI: direct answer for: %s", last_q[:60])
            return ChatResponse(response=direct)

    # ── Fall through to AI only when direct layer has no answer ──────────────
    tools  = ADMIN_TOOLS if is_admin else STUDENT_TOOLS

    if is_admin:
        system = ADMIN_SYSTEM_BASE + _build_admin_context(db)
    else:
        system = STUDENT_SYSTEM

    # Keep only last 6 messages to avoid token bloat on long conversations
    recent = body.messages[-6:] if len(body.messages) > 6 else body.messages
    messages = [{"role": "system", "content": system}]
    messages += [{"role": m.role, "content": m.content} for m in recent]

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
