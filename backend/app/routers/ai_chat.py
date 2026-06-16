"""
DUMLIS - AI Chat Router
Agentic chat powered by Groq (OpenAI-compatible API).
Admins get full read/write access; students get read-only access to their own data only.
"""
import os
import json
import uuid
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from openai import AsyncOpenAI
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.routers.auth import get_current_user
from app import models

router = APIRouter()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL = "llama-3.3-70b-versatile"
PORT = os.getenv("PORT", "8000")
INTERNAL_BASE = f"http://127.0.0.1:{PORT}"

groq = AsyncOpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

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
- عرض الدرجات والحضور والوضع المالي للطلاب
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
            "description": "البحث عن طلاب في النظام بفلاتر متعددة",
            "parameters": {
                "type": "object",
                "properties": {
                    "search":        {"type": "string",  "description": "اسم أو رقم الطالب"},
                    "faculty_id":    {"type": "string"},
                    "department_id": {"type": "string"},
                    "level":         {"type": "integer", "description": "المستوى 1-4"},
                    "status":        {"type": "string",  "enum": ["active","inactive","graduated","suspended"]},
                    "fees_status":   {"type": "string",  "enum": ["paid","unpaid","partial"]},
                    "limit":         {"type": "integer", "default": 20},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_student",
            "description": "جلب بيانات طالب محدد بالـ ID",
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
            "description": "عرض درجات طالب محدد",
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
            "name": "get_student_attendance",
            "description": "عرض سجل حضور طالب محدد",
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
            "description": "عرض الوضع المالي والرسوم لطالب محدد",
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
                    "status":     {"type": "string", "enum": ["pending","approved","rejected"]},
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
                    "status":         {"type": "string", "enum": ["approved","rejected"]},
                    "admin_response": {"type": "string", "description": "رد الأدمن على الطلب"},
                },
                "required": ["request_id", "status"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "create_announcement",
            "description": "إنشاء إعلان جديد للطلاب",
            "parameters": {
                "type": "object",
                "properties": {
                    "title":      {"type": "string"},
                    "content":    {"type": "string"},
                    "faculty_id": {"type": "string"},
                    "status":     {"type": "string", "enum": ["active","inactive"], "default": "active"},
                },
                "required": ["title", "content"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_statistics",
            "description": "إحصائيات عامة عن الطلاب في الكلية",
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
                    "faculty_id":    {"type": "string"},
                    "department_id": {"type": "string"},
                    "level":         {"type": "integer"},
                    "semester":      {"type": "string"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_rooms",
            "description": "عرض القاعات والمدرجات",
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
                    "status":   {"type": "string"},
                    "semester": {"type": "string"},
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
                "properties": {
                    "faculty_id": {"type": "string"},
                    "status":     {"type": "string"},
                },
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
            "description": "جلب درجاتي في المواد",
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
            "description": "جلب وضعي المالي والرسوم المستحقة",
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


# ── Tool Execution ─────────────────────────────────────────────────────────────

def _params(**kwargs) -> dict:
    return {k: v for k, v in kwargs.items() if v is not None}


async def run_tool(
    name: str,
    args: dict,
    user: models.User,
    token: str,
    db: Session,
) -> Any:
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient(base_url=INTERNAL_BASE, headers=headers, timeout=30) as client:

        # ── Admin tools ───────────────────────────────────────────────────────
        if name == "search_students":
            r = await client.get("/students/", params=_params(**args))
            return r.json()

        elif name == "get_student":
            r = await client.get(f"/students/{args['student_id']}")
            return r.json()

        elif name == "update_student":
            sid = args.pop("student_id")
            update_data = {k: v for k, v in args.items() if v is not None}
            r = await client.put(f"/students/{sid}", json=update_data)
            return r.json()

        elif name == "get_student_grades":
            r = await client.get("/student-grades/", params=_params(**args))
            return r.json()

        elif name == "get_student_attendance":
            r = await client.get("/attendance/", params=_params(**args))
            return r.json()

        elif name == "get_student_financial":
            r = await client.get(f"/financial/student/{args['student_id']}/summary")
            return r.json()

        elif name == "list_registration_requests":
            r = await client.get("/registration-requests/", params=_params(**args))
            return r.json()

        elif name == "update_registration_request":
            rid = args.pop("request_id")
            r = await client.put(f"/registration-requests/{rid}", json=args)
            return r.json()

        elif name == "create_announcement":
            r = await client.post("/announcements/", json=args)
            return r.json()

        elif name == "get_statistics":
            r = await client.get("/students/statistics", params=_params(**args))
            return r.json()

        elif name == "list_courses":
            r = await client.get("/courses/", params=_params(**args))
            return r.json()

        elif name == "list_rooms":
            r = await client.get("/rooms/", params=_params(**args))
            return r.json()

        elif name == "list_committees":
            r = await client.get("/committees/", params=_params(**args))
            return r.json()

        elif name == "list_announcements":
            r = await client.get("/announcements/", params=_params(**args))
            return r.json()

        # ── Student-scoped tools (read-only, own data) ────────────────────────
        elif name in {"get_my_profile","get_my_grades","get_my_attendance","get_my_financial","get_my_schedule","get_my_enrollments"}:
            student = db.query(models.Student).filter(models.Student.user_id == user.id).first()
            if not student:
                return {"error": "لم يتم ربط حسابك بسجل طالب، تواصل مع إدارة الكلية."}

            sid = student.student_id

            if name == "get_my_profile":
                r = await client.get(f"/students/{sid}")
                return r.json()

            elif name == "get_my_grades":
                params = {"student_id": sid}
                if args.get("semester"):
                    params["semester"] = args["semester"]
                r = await client.get("/student-grades/", params=params)
                return r.json()

            elif name == "get_my_attendance":
                params = {"student_id": sid}
                if args.get("course_id"):
                    params["course_id"] = args["course_id"]
                r = await client.get("/attendance/", params=params)
                return r.json()

            elif name == "get_my_financial":
                r = await client.get(f"/financial/student/{sid}/summary")
                return r.json()

            elif name == "get_my_schedule":
                params = {}
                if args.get("semester"):
                    params["semester"] = args["semester"]
                r = await client.get(f"/schedules/student/{sid}", params=params)
                return r.json()

            elif name == "get_my_enrollments":
                params = {"student_id": sid}
                if args.get("semester"):
                    params["semester"] = args["semester"]
                r = await client.get("/enrollments/", params=params)
                return r.json()

        else:
            return {"error": f"أداة غير معروفة: {name}"}


# ── Chat Endpoint ──────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    token: str = Depends(oauth2_scheme),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=503, detail="GROQ_API_KEY غير مضبوط على الخادم")

    is_admin = current_user.role in ADMIN_ROLES
    system_prompt = ADMIN_SYSTEM if is_admin else STUDENT_SYSTEM
    tools = ADMIN_TOOLS if is_admin else STUDENT_TOOLS

    messages = [{"role": "system", "content": system_prompt}]
    messages += [{"role": m.role, "content": m.content} for m in body.messages]

    # Agentic loop: keep calling until no more tool calls
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

        # Execute all requested tool calls
        messages.append(choice.message)

        for tc in choice.message.tool_calls:
            try:
                args = json.loads(tc.function.arguments)
                result = await run_tool(tc.function.name, args, current_user, token, db)
            except Exception as e:
                result = {"error": str(e)}

            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": json.dumps(result, ensure_ascii=False, default=str),
            })

    return ChatResponse(response="عذراً، حدث خطأ أثناء معالجة طلبك. حاول مرة أخرى.")
