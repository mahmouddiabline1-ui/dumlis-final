"""
Seed all missing data tables in the DUMLIS database.
Run: python seed_missing_data.py
"""
import sys, uuid
from datetime import date, datetime, timedelta
sys.path.insert(0, str(__file__).rsplit('\\', 1)[0])

from app.database import SessionLocal
from app import models

db = SessionLocal()

# ─── helpers ────────────────────────────────────────────────────────────────

def insert_if_empty(table_name, items, label):
    from sqlalchemy import text
    count = db.execute(text(f"SELECT COUNT(*) FROM {table_name}")).scalar()
    if count > 0:
        print(f"  SKIP {label} ({count} already exist)")
        return
    for item in items:
        db.add(item)
    db.flush()
    print(f"  OK   {label} -> {len(items)} records")

# ─── 1. STAFF ────────────────────────────────────────────────────────────────

staff_data = [
    # FCAI
    ("STAFF-CS-001", "أ.د. محمد أحمد السيد",       "m.ahmed@fcai.du.edu.eg",   "01001234567", "FCAI", "CS",    "علوم الحاسب",           "أستاذ",           "B101"),
    ("STAFF-CS-002", "د. سارة محمود علي",           "s.mahmoud@fcai.du.edu.eg", "01001234568", "FCAI", "CS",    "هندسة البرمجيات",       "أستاذ مساعد",     "B102"),
    ("STAFF-CS-003", "م. خالد حسن إبراهيم",         "k.hassan@fcai.du.edu.eg",  "01001234569", "FCAI", "CS",    "قواعد البيانات",        "مدرس مساعد",      "B103"),
    ("STAFF-IS-001", "أ.د. فاطمة عبدالله محمد",    "f.abdallah@fcai.du.edu.eg","01001234570", "FCAI", "IS",    "نظم المعلومات",         "أستاذ",           "B201"),
    ("STAFF-IS-002", "د. عمر يوسف الجمال",          "o.yousef@fcai.du.edu.eg",  "01001234571", "FCAI", "IS",    "أمن المعلومات",         "أستاذ مساعد",     "B202"),
    ("STAFF-AI-001", "أ.د. نور الدين عبدالرحمن",   "n.abdelrahman@fcai.du.edu.eg","01001234572","FCAI","AI",   "الذكاء الاصطناعي",      "أستاذ",           "B301"),
    ("STAFF-AI-002", "د. ريم محمد طاهر",             "r.mohamed@fcai.du.edu.eg", "01001234573", "FCAI", "AI",    "تعلم الآلة",            "أستاذ مساعد",     "B302"),
    # FSC
    ("STAFF-MATH-001","أ.د. حسام الدين فاروق",     "h.farouk@fsc.du.edu.eg",   "01001234580", "FSC",  "MATH",  "الرياضيات البحتة",      "أستاذ",           "C101"),
    ("STAFF-MATH-002","د. منى عادل رزق",             "m.adel@fsc.du.edu.eg",     "01001234581", "FSC",  "MATH",  "الإحصاء التطبيقي",      "أستاذ مساعد",     "C102"),
    ("STAFF-PHYS-001","أ.د. أحمد كمال شوقي",        "a.kamal@fsc.du.edu.eg",    "01001234582", "FSC",  "PHYS",  "الفيزياء النظرية",      "أستاذ",           "C201"),
    ("STAFF-CHEM-001","د. سمر صالح عوض",             "s.saleh@fsc.du.edu.eg",    "01001234583", "FSC",  "CHEM",  "الكيمياء العضوية",      "أستاذ مساعد",     "C301"),
    # FEN
    ("STAFF-MECH-001","أ.د. طارق علي مصطفى",        "t.ali@fen.du.edu.eg",      "01001234590", "FEN",  "MECH",  "الميكانيكا التطبيقية",  "أستاذ",           "D101"),
    ("STAFF-ELEC-001","أ.د. نادية حمدي عثمان",      "n.hamdi@fen.du.edu.eg",    "01001234591", "FEN",  "ELEC",  "الهندسة الكهربائية",    "أستاذ",           "D201"),
    ("STAFF-CIVIL-001","د. رامي سعيد الشيخ",         "r.saeed@fen.du.edu.eg",    "01001234592", "FEN",  "CIVIL", "الهندسة الإنشائية",     "أستاذ مساعد",     "D301"),
]

insert_if_empty("staff", [
    models.Staff(id=s[0], name=s[1], email=s[2], phone=s[3],
                 faculty_id=s[4], department_id=s[5], specialization=s[6],
                 title=s[7], office_location=s[8], status="فعال")
    for s in staff_data
], "Staff")

# ─── 2. FEE SETUP ────────────────────────────────────────────────────────────

fee_rows = []
for fac in ["FCAI", "FSC", "FEN"]:
    for level in ["الاول", "الثاني", "الثالث", "الرابع"]:
        fee_rows.append(models.FeeSetup(
            faculty_id=fac, fee_type="رسوم دراسية", level=level,
            amount=3500.00, semester="الأول", academic_year="2024/2025", status="نشط"))
        fee_rows.append(models.FeeSetup(
            faculty_id=fac, fee_type="رسوم دراسية", level=level,
            amount=3500.00, semester="الثاني", academic_year="2024/2025", status="نشط"))
    fee_rows.append(models.FeeSetup(
        faculty_id=fac, fee_type="رسوم تأمين", level=None,
        amount=200.00, semester=None, academic_year="2024/2025", status="نشط"))
    fee_rows.append(models.FeeSetup(
        faculty_id=fac, fee_type="رسوم نشاط", level=None,
        amount=150.00, semester=None, academic_year="2024/2025", status="نشط"))

insert_if_empty("fee_setup", fee_rows, "FeeSetup")

# ─── 3. SYSTEM SETTINGS ──────────────────────────────────────────────────────

settings = [
    models.SystemSetting(id="ACADEMIC_YEAR",    faculty_id=None, name="العام الدراسي الحالي",   value="2024/2025",        category="Academic",  description="العام الدراسي الحالي للنظام"),
    models.SystemSetting(id="CURRENT_SEMESTER", faculty_id=None, name="الفصل الدراسي الحالي",   value="الثاني",           category="Academic",  description="الفصل الدراسي الحالي"),
    models.SystemSetting(id="MAX_ABSENCE",      faculty_id=None, name="الحد الأقصى للغياب",      value="25",               category="Academic",  description="النسبة المئوية القصوى للغياب"),
    models.SystemSetting(id="MIN_PASS_GRADE",   faculty_id=None, name="درجة النجاح الدنيا",       value="60",               category="Academic",  description="أدنى درجة للنجاح"),
    models.SystemSetting(id="UNIV_NAME_AR",     faculty_id=None, name="اسم الجامعة (عربي)",       value="جامعة دمياط",      category="General",   description="اسم الجامعة بالعربية"),
    models.SystemSetting(id="UNIV_NAME_EN",     faculty_id=None, name="اسم الجامعة (إنجليزي)",    value="Damietta University", category="General", description="University name in English"),
    models.SystemSetting(id="FCAI_NAME",        faculty_id="FCAI", name="اسم الكلية",              value="كلية الحاسبات والذكاء الاصطناعي", category="Faculty", description="الاسم الرسمي للكلية"),
    models.SystemSetting(id="FSC_NAME",         faculty_id="FSC",  name="اسم الكلية",              value="كلية العلوم",      category="Faculty",   description="الاسم الرسمي للكلية"),
    models.SystemSetting(id="FEN_NAME",         faculty_id="FEN",  name="اسم الكلية",              value="كلية الهندسة",     category="Faculty",   description="الاسم الرسمي للكلية"),
    models.SystemSetting(id="REG_OPEN",         faculty_id=None, name="حالة التسجيل",              value="مفتوح",            category="Academic",  description="هل التسجيل مفتوح حاليا"),
]

insert_if_empty("system_settings", settings, "SystemSettings")

# ─── 4. ACADEMIC CALENDAR ────────────────────────────────────────────────────

today = date.today()
year = today.year

calendar_events = [
    models.AcademicCalendar(event_name="بداية الفصل الدراسي الثاني", event_type="بداية الفصل",
        start_date=date(year, 2, 1), end_date=date(year, 2, 1), faculty_id=None,
        academic_year="2024/2025", description="بداية الدراسة للفصل الثاني"),
    models.AcademicCalendar(event_name="أسبوع المراجعة والامتحانات", event_type="امتحانات",
        start_date=date(year, 5, 15), end_date=date(year, 6, 15), faculty_id=None,
        academic_year="2024/2025", description="فترة امتحانات نهاية الفصل الثاني"),
    models.AcademicCalendar(event_name="إعلان نتائج الفصل الثاني", event_type="نتائج",
        start_date=date(year, 7, 1), end_date=date(year, 7, 1), faculty_id=None,
        academic_year="2024/2025", description="إعلان نتائج امتحانات الفصل الثاني"),
    models.AcademicCalendar(event_name="إجازة نهاية العام الدراسي", event_type="إجازة",
        start_date=date(year, 7, 2), end_date=date(year, 9, 30), faculty_id=None,
        academic_year="2024/2025", description="الإجازة الصيفية"),
    models.AcademicCalendar(event_name="بداية العام الدراسي الجديد", event_type="بداية الفصل",
        start_date=date(year, 10, 1), end_date=date(year, 10, 1), faculty_id=None,
        academic_year="2025/2026", description="بداية الفصل الأول للعام الجديد"),
    models.AcademicCalendar(event_name="تسجيل المقررات - FCAI", event_type="تسجيل",
        start_date=date(year, 9, 15), end_date=date(year, 9, 25), faculty_id="FCAI",
        academic_year="2025/2026", description="فترة تسجيل المقررات لكلية الحاسبات"),
    models.AcademicCalendar(event_name="تسجيل المقررات - FSC", event_type="تسجيل",
        start_date=date(year, 9, 15), end_date=date(year, 9, 25), faculty_id="FSC",
        academic_year="2025/2026", description="فترة تسجيل المقررات لكلية العلوم"),
    models.AcademicCalendar(event_name="تسجيل المقررات - FEN", event_type="تسجيل",
        start_date=date(year, 9, 15), end_date=date(year, 9, 25), faculty_id="FEN",
        academic_year="2025/2026", description="فترة تسجيل المقررات لكلية الهندسة"),
    models.AcademicCalendar(event_name="امتحانات منتصف الفصل", event_type="امتحانات",
        start_date=date(year, 3, 20), end_date=date(year, 3, 30), faculty_id=None,
        academic_year="2024/2025", description="امتحانات نصف الفصل الثاني"),
]

insert_if_empty("academic_calendar", calendar_events, "AcademicCalendar")

# ─── 5. ANNOUNCEMENTS ────────────────────────────────────────────────────────

announcements = [
    models.Announcement(title="مرحباً بكم في نظام DUMLIS",
        body="يسعدنا إطلاق نظام إدارة شؤون الطلاب الجديد. يمكنكم متابعة درجاتكم وحضوركم وجداولكم من خلال هذه المنصة.",
        faculty_id=None, role_target=None, priority="عالي", is_active=True,
        expires_at=datetime(year+1, 12, 31)),
    models.Announcement(title="جدول امتحانات الفصل الثاني 2024/2025",
        body="يُعلن عن صدور جداول امتحانات الفصل الدراسي الثاني للعام الجامعي 2024/2025. يرجى مراجعة الجدول والتواجد قبل موعد الامتحان بنصف ساعة.",
        faculty_id=None, role_target=None, priority="عالي", is_active=True,
        expires_at=datetime(year, 6, 30)),
    models.Announcement(title="تعليمات التسجيل للعام الدراسي 2025/2026 - FCAI",
        body="يبدأ تسجيل مقررات العام الدراسي الجديد في 15 سبتمبر. يُرجى التواصل مع مستشارك الأكاديمي لمراجعة خطتك الدراسية قبل التسجيل.",
        faculty_id="FCAI", role_target="student", priority="عادي", is_active=True,
        expires_at=datetime(year, 9, 26)),
    models.Announcement(title="تنبيه: آخر موعد لسداد الرسوم",
        body="يُذكَّر الطلاب بأن آخر موعد لسداد رسوم الفصل الدراسي الثاني هو 28 فبراير 2025. الطلاب الذين لم يسددوا لن يُسمح لهم بالتقدم للامتحانات.",
        faculty_id=None, role_target="student", priority="عاجل", is_active=True,
        expires_at=datetime(year, 2, 28)),
    models.Announcement(title="ورشة عمل: مهارات البحث العلمي",
        body="تُعلن كلية الحاسبات والذكاء الاصطناعي عن تنظيم ورشة عمل حول مهارات البحث العلمي وكتابة الأوراق البحثية بتاريخ 10 مارس 2025.",
        faculty_id="FCAI", role_target=None, priority="عادي", is_active=True,
        expires_at=datetime(year, 3, 11)),
]

insert_if_empty("announcements", announcements, "Announcements")

# ─── 6. COURSE PREREQUISITES ─────────────────────────────────────────────────

from app.database import SessionLocal as SL
from sqlalchemy import text as t2
all_courses = [r[0] for r in db.execute(t2("SELECT id FROM courses ORDER BY id")).fetchall()]
fcai_courses = [c for c in all_courses if c.startswith("CS") or c.startswith("IS") or c.startswith("AI")]

prereqs = []
# CS102 requires CS101
if "CS101" in fcai_courses and "CS102" in fcai_courses:
    prereqs.append(models.CoursePrerequisite(course_id="CS102", prerequisite_id="CS101"))
if "CS201" in fcai_courses and "CS102" in fcai_courses:
    prereqs.append(models.CoursePrerequisite(course_id="CS201", prerequisite_id="CS102"))
if "CS202" in fcai_courses and "CS201" in fcai_courses:
    prereqs.append(models.CoursePrerequisite(course_id="CS202", prerequisite_id="CS201"))
if "CS301" in fcai_courses and "CS202" in fcai_courses:
    prereqs.append(models.CoursePrerequisite(course_id="CS301", prerequisite_id="CS202"))

if prereqs:
    insert_if_empty("course_prerequisites", prereqs, "CoursePrerequisites")
else:
    print("  SKIP CoursePrerequisites (no matching courses)")

# ─── 7. STUDENT REQUIREMENTS (sample for first 30 students) ──────────────────

from sqlalchemy import text as tsql
student_ids = [r[0] for r in db.execute(tsql("SELECT student_id FROM students LIMIT 30")).fetchall()]
req_keys = ["national_id", "photo", "birth_certificate", "military_form", "secondary_cert"]

from sqlalchemy import text as tx
existing_reqs = db.execute(tx("SELECT COUNT(*) FROM student_requirements")).scalar()
if existing_reqs == 0:
    reqs = []
    import random
    random.seed(42)
    statuses = ["verified", "submitted", "pending"]
    for sid in student_ids:
        for key in req_keys:
            reqs.append(models.StudentRequirement(
                student_id=sid,
                requirement_key=key,
                status=random.choice(statuses),
                notes=None
            ))
    for r in reqs:
        db.add(r)
    db.flush()
    print(f"  OK   StudentRequirements -> {len(reqs)} records")
else:
    print(f"  SKIP StudentRequirements ({existing_reqs} already exist)")

# ─── COMMIT ──────────────────────────────────────────────────────────────────

try:
    db.commit()
    print("\nAll missing data seeded successfully!")
except Exception as e:
    db.rollback()
    print(f"\nERROR: {e}")
    raise
finally:
    db.close()
