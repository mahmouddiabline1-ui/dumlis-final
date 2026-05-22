"""
DUMLIS Database Seed Script — MULTITENANT EDITION
=============================================
Enforces strict faculty isolation by prefixing IDs and 
generating distinct data silos for all 11 faculties.

Usage:
    python seed.py --clear
"""
import argparse
import random
import sys
import uuid
from datetime import date, datetime, timedelta

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Load .env so DATABASE_URL is available
load_dotenv()

from app.database import DATABASE_URL
from app.models import (
    Base, Faculty, Department, Course, Room, Student,
    Enrollment, Grade, AttendanceRecord, FinancialRecord, CourseSchedule,
    AcademicProgram, AcademicRule, User, CourseClose
)

# ─────────────────────────────────────────────────────────────────────────────
# REFERENCE DATA
# ─────────────────────────────────────────────────────────────────────────────

FACULTIES_DATA = [
    {"id": "FCAI", "name": "كلية الحاسبات والذكاء الاصطناعي", "name_en": "Faculty of Computers and AI",         "icon": "💻", "student_count": 2800, "staff_count": 120, "color": "bg-blue-600"},
    {"id": "SCI",  "name": "كلية العلوم",                        "name_en": "Faculty of Science",                "icon": "🔬", "student_count": 1200, "staff_count": 80,  "color": "bg-green-600"},
    {"id": "COM",  "name": "كلية التجارة",                       "name_en": "Faculty of Commerce",               "icon": "📊", "student_count": 2500, "staff_count": 95,  "color": "bg-yellow-600"},
    {"id": "EDU",  "name": "كلية التربية",                       "name_en": "Faculty of Education",              "icon": "📚", "student_count": 1800, "staff_count": 75,  "color": "bg-red-600"},
    {"id": "ENG",  "name": "كلية الهندسة",                       "name_en": "Faculty of Engineering",            "icon": "⚙️", "student_count": 900,  "staff_count": 110, "color": "bg-purple-600"},
    {"id": "LAW",  "name": "كلية الحقوق",                        "name_en": "Faculty of Law",                    "icon": "⚖️", "student_count": 1600, "staff_count": 60,  "color": "bg-gray-600"},
    {"id": "MED",  "name": "كلية الطب",                          "name_en": "Faculty of Medicine",               "icon": "🏥", "student_count": 1300, "staff_count": 200, "color": "bg-pink-600"},
    {"id": "NRS",  "name": "كلية التمريض",                       "name_en": "Faculty of Nursing",                "icon": "💉", "student_count": 800,  "staff_count": 50,  "color": "bg-teal-600"},
    {"id": "PHR",  "name": "كلية الصيدلة",                       "name_en": "Faculty of Pharmacy",               "icon": "💊", "student_count": 750,  "staff_count": 65,  "color": "bg-indigo-600"},
    {"id": "AGR",  "name": "كلية الزراعة",                       "name_en": "Faculty of Agriculture",            "icon": "🌾", "student_count": 600,  "staff_count": 45,  "color": "bg-lime-600"},
    {"id": "ART",  "name": "كلية الآداب",                        "name_en": "Faculty of Arts",                   "icon": "🎭", "student_count": 2000, "staff_count": 90,  "color": "bg-orange-600"},
]

# Faculty-specific metadata for realistic seeding
FACULTY_METADATA = {
    "FCAI": {
        "depts": [
            {"code": "CS", "name": "علوم الحاسب", "name_en": "Computer Science"},
            {"code": "IS", "name": "نظم المعلومات", "name_en": "Information Systems"},
            {"code": "AI", "name": "الذكاء الاصطناعي", "name_en": "Artificial Intelligence"},
            {"code": "IT", "name": "تكنولوجيا المعلومات", "name_en": "Information Technology"},
            {"code": "MI", "name": "المعلوماتية الطبية", "name_en": "Medical Informatics"},
            {"code": "SEC", "name": "الأمن السيبراني", "name_en": "Cyber Security"},
        ],
        "courses": [
            {"code": "CS101", "name": "مقدمة في البرمجة", "level": 1, "dept": "CS"},
            {"code": "CS201", "name": "هياكل البيانات", "level": 2, "dept": "CS"},
            {"code": "AI301", "name": "أساسيات الذكاء الاصطناعي", "level": 3, "dept": "AI"},
            {"code": "IS201", "name": "تحليل نظم", "level": 2, "dept": "IS"},
            {"code": "GEN101", "name": "حقوق إنسان", "level": 1, "dept": "CS"},
        ]
    },
    "SCI": {
        "depts": [
            {"code": "PHYS", "name": "الفيزياء", "name_en": "Physics"},
            {"code": "CHEM", "name": "الكيمياء", "name_en": "Chemistry"},
            {"code": "MATH", "name": "الرياضيات", "name_en": "Mathematics"},
            {"code": "ZOO", "name": "علم الحيوان", "name_en": "Zoology"},
            {"code": "BOT", "name": "علم النبات", "name_en": "Botany"},
            {"code": "GEOL", "name": "الجيولوجيا", "name_en": "Geology"},
        ],
        "courses": [
            {"code": "PHYS101", "name": "فيزياء عامة 1", "level": 1, "dept": "PHYS"},
            {"code": "CHEM101", "name": "كيمياء غير عضوية", "level": 1, "dept": "CHEM"},
            {"code": "MATH101", "name": "تفاضل وتكامل 1", "level": 1, "dept": "MATH"},
            {"code": "ZOO201", "name": "بيولوجيا الخلية", "level": 2, "dept": "ZOO"},
            {"code": "GEN101", "name": "لغة إنجليزية", "level": 1, "dept": "MATH"},
        ]
    },
    "ENG": {
        "depts": [
            {"code": "CVL", "name": "هندسة مدنية", "name_en": "Civil Engineering"},
            {"code": "MECH", "name": "هندسة ميكانيكية", "name_en": "Mechanical Engineering"},
            {"code": "ELEC", "name": "هندسة كهربائية", "name_en": "Electrical Engineering"},
            {"code": "ARCH", "name": "هندسة معمارية", "name_en": "Architecture"},
            {"code": "CCE", "name": "هندسة الحاسبات والاتصالات", "name_en": "Computer and Communications Engineering"},
        ],
        "courses": [
            {"code": "ENG101", "name": "رسم هندسي", "level": 1, "dept": "CVL"},
            {"code": "MECH201", "name": "ديناميكا", "level": 2, "dept": "MECH"},
            {"code": "ELEC301", "name": "دوائر إلكترونية", "level": 3, "dept": "ELEC"},
            {"code": "GEN101", "name": "كيمياء هندسية", "level": 1, "dept": "CVL"},
        ]
    },
    "COM": {
        "depts": [
            {"code": "ACC", "name": "المحاسبة", "name_en": "Accounting"},
            {"code": "MGT", "name": "إدارة الأعمال", "name_en": "Management"},
            {"code": "ECO", "name": "الاقتصاد", "name_en": "Economics"},
            {"code": "BIS", "name": "نظم معلومات الأعمال", "name_en": "Business Information Systems"},
            {"code": "FMI", "name": "الأسواق والمنشآت المالية", "name_en": "Financial Markets"},
        ],
        "courses": [
            {"code": "ACC101", "name": "مبادئ محاسبة 1", "level": 1, "dept": "ACC"},
            {"code": "BIS201", "name": "برمجة الأعمال", "level": 2, "dept": "BIS"},
            {"code": "MGT101", "name": "أصول الإدارة", "level": 1, "dept": "MGT"},
            {"code": "GEN101", "name": "قانون تجاري", "level": 1, "dept": "ACC"},
        ]
    },
    "LAW": {
        "depts": [
            {"code": "LAW", "name": "القانون العام", "name_en": "Public Law"},
            {"code": "CRI", "name": "القانون الجنائي", "name_en": "Criminal Law"},
            {"code": "COM", "name": "القانون التجاري", "name_en": "Commercial Law"},
        ],
        "courses": [
            {"code": "LAW101", "name": "تاريخ القانون", "level": 1, "dept": "LAW"},
            {"code": "CRI201", "name": "قانون عقوبات", "level": 2, "dept": "CRI"},
            {"code": "GEN101", "name": "لغة فرنسية", "level": 1, "dept": "LAW"},
        ]
    },
    "MED": {
        "depts": [
            {"code": "ANAT", "name": "التشريح", "name_en": "Anatomy"},
            {"code": "SURG", "name": "الجراحة", "name_en": "Surgery"},
            {"code": "PED", "name": "طب الأطفال", "name_en": "Pediatrics"},
            {"code": "INT", "name": "الأمراض الباطنة", "name_en": "Internal Medicine"},
        ],
        "courses": [
            {"code": "ANAT101", "name": "تشريح 1", "level": 1, "dept": "ANAT"},
            {"code": "SURG301", "name": "جراحة عامة", "level": 3, "dept": "SURG"},
            {"code": "GEN101", "name": "لغة إنجليزية طبية", "level": 1, "dept": "ANAT"},
        ]
    }
}

# General templates for faculties not in the map
DEFAULT_DEPTS = [
    {"code": "GEN", "name": "قسم عام", "name_en": "General"},
    {"code": "SPEC", "name": "قسم تخصصي", "name_en": "Specialized"},
]
DEFAULT_COURSES = [
    {"code": "G101", "name": "ثقافة عامة", "level": 1, "dept": "GEN"},
    {"code": "G201", "name": "مهارات تواصل", "level": 1, "dept": "GEN"},
    {"code": "G301", "name": "أخلاقيات المهنة", "level": 2, "dept": "GEN"},
    {"code": "G401", "name": "ريادة أعمال", "level": 2, "dept": "GEN"},
]

ROOMS_TEMPLATE = [
    {"code": "101", "name": "قاعة 101", "type": "classroom", "capacity": 100, "floor": 1},
    {"code": "102", "name": "قاعة 102", "type": "classroom", "capacity": 80, "floor": 1},
    {"code": "L201", "name": "معمل 201", "type": "lab", "capacity": 30, "floor": 2},
]

# ─────────────────────────────────────────────────────────────────────────────
# GENERATORS
# ─────────────────────────────────────────────────────────────────────────────

FIRST_NAMES = ['أحمد','محمد','علي','عمر','مريم','زينب','سلمى','يوسف','ليلى','خلود']
LAST_NAMES = ['السيد','إبراهيم','خالد','عامر','النجار','المصري','الخطيب','حسن']

def generate_student(fac_id: str, dept_id: str, index: int):
    year = 2024 - random.randint(0, 3)
    student_id = f"{year}{fac_id}{str(index).zfill(4)}"
    # Generate a more unique national ID
    nat_id = f"3{str(year)[-2:]}{str(random.randint(1,12)).zfill(2)}{str(random.randint(1,28)).zfill(2)}11{random.randint(10000, 99999)}"
    return {
        "student_id": student_id,
        "name": f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)} {random.choice(LAST_NAMES)}",
        "national_id": nat_id,
        "faculty_id": fac_id,
        "department_id": dept_id,
        "level": 2025 - year,
        "regulation": "لائحة 2023",
        "gpa": round(random.uniform(2.0, 4.0), 2),
        "phone": f"01{random.randint(100000000, 999999999)}",
        "email": f"s{student_id}@stud.du.edu.eg",
        "city": "دمياط",
        "status": "مقيد",
        "fees_status": "مسدد" if random.random() > 0.2 else "غير مسدد"
    }

# ─────────────────────────────────────────────────────────────────────────────
# MAIN SEED
# ─────────────────────────────────────────────────────────────────────────────

def seed(clear: bool = False):
    print("\nDUMLIS Multitenant Seed Starting...")
    engine = create_engine(DATABASE_URL)
    
    if clear:
        print("  Dropping and recreating all tables...")
        Base.metadata.drop_all(engine)
    
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        # 1. Create Faculties
        print("  Creating 11 Faculties...")
        for f in FACULTIES_DATA:
            session.add(Faculty(**f))
        session.commit()

        # Create Users
        print("  Creating Users (President + 11 Faculty Admins)...")
        # Super Admin
        admin = User(
            username="president",
            email="president@du.edu.eg",
            role="super_admin",
            hashed_password=pwd_context.hash("admin")
        )
        session.add(admin)
        
        for f in FACULTIES_DATA:
            fid = f["id"]
            fac_admin = User(
                username=f"admin_{fid.lower()}",
                email=f"admin@{fid.lower()}.du.edu.eg",
                role="faculty_admin",
                faculty_id=fid,
                hashed_password=pwd_context.hash("admin")
            )
            session.add(fac_admin)
        session.commit()

        # 2. Iterate through each Faculty to build isolated silos
        for fac in FACULTIES_DATA:
            fid = fac["id"]
            print(f"  > Seeding Faculty: {fid}")

            # Get faculty-specific depts and courses or defaults
            f_meta = FACULTY_METADATA.get(fid, {"depts": DEFAULT_DEPTS, "courses": DEFAULT_COURSES})
            depts_to_seed = f_meta["depts"]
            courses_to_seed = f_meta["courses"]

            # Departments
            fac_depts = []
            for d in depts_to_seed:
                dept_id = f"{fid}_{d['code']}"
                dept = Department(id=dept_id, faculty_id=fid, name=d["name"], name_en=d.get("name_en", ""), code=d["code"])
                session.add(dept)
                fac_depts.append(dept_id)
            session.flush()

            # Rooms (Prefixed)
            for r in ROOMS_TEMPLATE:
                room_id = f"{fid}_{r['code']}"
                session.add(Room(
                    id=room_id, faculty_id=fid, code=r["code"], name=f"{fid} - {r['name']}",
                    room_type=r["type"], capacity=r["capacity"], floor=r["floor"], status="available",
                    building=fid # Simple building label
                ))

            # Courses (Prefixed)
            fac_courses = []
            for c in courses_to_seed:
                course_id = f"{fid}_{c['code']}"
                course = Course(
                    id=course_id, faculty_id=fid, name=c["name"], level=c["level"],
                    department_id=f"{fid}_{c['dept']}", credit_hours=c.get("hours", 3),
                    course_type=c.get("type", "إجباري"), semester=c.get("semester", "خريف")
                )
                session.add(course)
                fac_courses.append(course_id)
            session.flush()

            # Academic Programs - Create one for the main dept
            main_dept_id = fac_depts[0]
            prog_id = f"{fid}_PROG"
            session.add(AcademicProgram(
                id=prog_id, faculty_id=fid, name=f"برنامج {fac['name']}",
                code="PROG-BS", degree="بكالوريوس", department_id=main_dept_id
            ))
            session.flush()

            # Academic Rules
            session.add(AcademicRule(
                id=f"{fid}_RULES", faculty_id=fid,
                rules_data={
                    "min_hours": 12, 
                    "max_hours": 21, 
                    "probation_gpa": 2.0,
                    "rules": [
                        {"id": 1, "name": "الحد الأقصى للساعات", "value": "21 ساعة"},
                        {"id": 2, "name": "الحد الأدنى للساعات", "value": "12 ساعة"},
                        {"id": 3, "name": "معدل الإنذار الأكاديمي", "value": "2.0"}
                    ]
                }
            ))

            # Course Closures (Demo data)
            for cid in fac_courses[:2]: # Close the first two courses
                session.add(CourseClose(
                    faculty_id=fid,
                    course_code=cid,
                    academic_year="2024-2025",
                    semester="الخريف",
                    closure_date=date.today(),
                    status="مغلق"
                ))

            # Students (50 per faculty for demo)
            students = []
            for i in range(50):
                dept_id = random.choice(fac_depts)
                s_data = generate_student(fid, dept_id, i)
                student = Student(**s_data)
                session.add(student)
                students.append(student)
            session.flush()

            # Enrollments & Grades (linked to this faculty's courses)
            for s in students:
                # Enroll in 3 random faculty courses (or all if less than 3)
                num_to_enroll = min(len(fac_courses), 3)
                chosen = random.sample(fac_courses, num_to_enroll)
                for cid in chosen:
                    session.add(Enrollment(
                        student_id=s.student_id, course_id=cid, faculty_id=fid,
                        semester="خريف 2024", status="مسجل"
                    ))
                    session.add(Grade(
                        student_id=s.student_id, course_id=cid, faculty_id=fid,
                        semester="خريف 2024", total=random.randint(60, 100),
                        grade_letter="B", grade_points=3.0
                    ))
                
                # Financial
                session.add(FinancialRecord(
                    student_id=s.student_id, faculty_id=fid, fee_type="مصروفات",
                    amount=5000, paid_amount=5000 if s.fees_status == "مسدد" else 0,
                    status=s.fees_status, semester="خريف 2024"
                ))

        session.commit()
    print("\nSeed Complete! All 11 faculties isolated.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--clear", action="store_true")
    args = parser.parse_args()
    seed(clear=args.clear)
