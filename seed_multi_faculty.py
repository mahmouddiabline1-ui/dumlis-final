import random
import uuid
from datetime import date, datetime, timedelta
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

# Load .env
load_dotenv('backend/.env')
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    # fallback for local dev if not in .env
    DATABASE_URL = "postgresql://dumlis_user:dumlis_pass@localhost:5432/dumlis_db"

from app.models import (
    Base, Faculty, Department, AcademicProgram, Course, Student,
    Enrollment, Grade, AttendanceRecord, FinancialRecord, CourseSchedule, User
)

# ─────────────────────────────────────────────────────────────────────────────
# DATA DEFINITIONS
# ─────────────────────────────────────────────────────────────────────────────

FACULTIES_DATA = [
    {"id": "FCAI", "name": "كلية الحاسبات والذكاء الاصطناعي", "student_count": 2000, "staff_count": 120, "color": "bg-blue-600", "icon": "💻"},
    {"id": "SCI",  "name": "كلية العلوم", "student_count": 375, "staff_count": 250, "color": "bg-green-600", "icon": "🔬"},
    {"id": "COM",  "name": "كلية التجارة", "student_count": 375, "staff_count": 300, "color": "bg-yellow-600", "icon": "📊"},
    {"id": "EDU",  "name": "كلية التربية", "student_count": 375, "staff_count": 200, "color": "bg-red-600", "icon": "📚"},
    {"id": "ENG",  "name": "كلية الهندسة", "student_count": 375, "staff_count": 180, "color": "bg-purple-600", "icon": "⚙️"},
    {"id": "MED",  "name": "كلية الطب", "student_count": 1500, "staff_count": 150, "color": "bg-pink-600", "icon": "🏥"},
    {"id": "PHR",  "name": "كلية الصيدلة", "student_count": 1200, "staff_count": 100, "color": "bg-indigo-600", "icon": "💊"},
    {"id": "LAW",  "name": "كلية الحقوق", "student_count": 3000, "staff_count": 120, "color": "bg-gray-600", "icon": "⚖️"},
    {"id": "ART",  "name": "كلية الآداب", "student_count": 4500, "staff_count": 180, "color": "bg-orange-600", "icon": "📖"},
    {"id": "AGR",  "name": "كلية الزراعة", "student_count": 2800, "staff_count": 140, "color": "bg-lime-600", "icon": "🌾"},
    {"id": "NRS",  "name": "كلية التمريض", "student_count": 2000, "staff_count": 110, "color": "bg-teal-600", "icon": "🏥"},
]

FACULTY_MAP = {
    "FCAI": {
        "depts": [
            {"id": "CS", "name": "علوم الحاسب", "code": "CS"},
            {"id": "IS", "name": "نظم المعلومات", "code": "IS"},
            {"id": "AI", "name": "الذكاء الاصطناعي", "code": "AI"},
        ],
        "courses": [
            ("CS101", "مقدمة في البرمجة", 1), ("CS102", "مبادئ الحاسبات", 1),
            ("CS201", "هياكل البيانات", 2), ("CS202", "الخوارزميات", 2),
            ("CS301", "قواعد البيانات", 3), ("CS302", "نظم التشغيل", 3),
            ("CS401", "مشروع التخرج", 4),
        ]
    },
    "SCI": {
        "depts": [
            {"id": "PHYS", "name": "الفيزياء", "code": "PHYS"},
            {"id": "CHEM", "name": "الكيمياء", "code": "CHEM"},
        ],
        "courses": [
            ("PHYS101", "فيزياء عامة 1", 1), ("PHYS102", "فيزياء عامة 2", 1),
            ("CHEM101", "كيمياء عامة 1", 1), ("CHEM201", "كيمياء عضوية", 2),
            ("PHYS301", "فيزياء نووية", 3), ("SCI401", "بحث التخرج", 4),
        ]
    },
    "COM": {
        "depts": [
            {"id": "ACC", "name": "المحاسبة", "code": "ACC"},
            {"id": "MAN", "name": "إدارة الأعمال", "code": "MAN"},
        ],
        "courses": [
            ("ACC101", "مبادئ المحاسبة 1", 1), ("MAN101", "مبادئ الإدارة", 1),
            ("ACC201", "محاسبة شركات", 2), ("MAN201", "تسويق", 2),
            ("ACC301", "مراجعة", 3), ("COM401", "دراسات جدوى", 4),
        ]
    },
    "MED": {
        "depts": [
            {"id": "ANAT", "name": "التشريح", "code": "ANAT"},
            {"id": "SURG", "name": "الجراحة", "code": "SURG"},
        ],
        "courses": [
            ("MED101", "مقدمة في الطب", 1), ("ANAT101", "تشريح 1", 1),
            ("ANAT201", "تشريح 2", 2), ("PATH201", "علم الأمراض", 2),
            ("SURG301", "مبادئ الجراحة", 3), ("MED401", "تدريب إكلينيكي", 4),
        ]
    },
    "LAW": {
        "depts": [
            {"id": "PLAW", "name": "القانون العام", "code": "PLAW"},
            {"id": "CLAW", "name": "القانون الجنائي", "code": "CLAW"},
        ],
        "courses": [
            ("LAW101", "مدخل للعلوم القانونية", 1), ("LAW102", "تاريخ القانون", 1),
            ("PLAW201", "قانون دستوري", 2), ("CLAW201", "قانون عقوبات", 2),
            ("LAW301", "قانون مدني", 3), ("LAW401", "قانون دولي", 4),
        ]
    }
}

# Generic data for others if not in map
DEFAULT_DEPTS = [{"id": "GEN_{fac}", "name": "قسم عام", "code": "GEN"}]
DEFAULT_COURSES = [("G101", "ثقافة عامة", 1), ("G201", "مهارات تواصل", 2), ("G301", "أخلاقيات مهنة", 3), ("G401", "مشروع بحثي", 4)]

FIRST_NAMES = ['محمد', 'أحمد', 'محمود', 'علي', 'عمر', 'يوسف', 'سارة', 'مريم', 'نور']
LAST_NAMES = ['السيد', 'إبراهيم', 'عبدالله', 'محمود', 'عثمان', 'سليم']

def seed_everything():
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)
    
    with Session(engine) as session:
        print("Clearing old data (Students, Enrollments, Grades, Attendance, Financial, Programs, Courses, Depts)...")
        session.execute(text('TRUNCATE TABLE financial_records, attendance_records, grades, enrollments, students, programs, courses, departments RESTART IDENTITY CASCADE'))
        session.commit()

        print("Seeding Faculties, Depts, Programs, and Courses...")
        for f_data in FACULTIES_DATA:
            fac_id = f_data["id"]
            # Faculty
            fac = session.query(Faculty).get(fac_id)
            if not fac:
                fac = Faculty(**f_data)
                session.add(fac)
            
            # Depts & Programs
            f_map = FACULTY_MAP.get(fac_id, {"depts": [{"id": f"{fac_id}_GEN", "name": "قسم عام", "code": "GEN"}], "courses": DEFAULT_COURSES})
            
            created_depts = []
            for d_info in f_map["depts"]:
                d_id = f"{fac_id}_{d_info['id']}" if "_" not in d_info['id'] else d_info['id']
                dept = Department(id=d_id, faculty_id=fac_id, name=d_info["name"], code=d_info["code"])
                session.add(dept)
                created_depts.append(dept)
                
                # Create one program for each department
                prog_id = f"PROG_{d_id}"
                prog = AcademicProgram(id=prog_id, name=f"برنامج {d_info['name']}", code=d_info["code"], department_id=d_id, faculty_id=fac_id)
                session.add(prog)
            
            # Courses
            for c_info in f_map["courses"]:
                c_id_base, c_name, c_level = c_info
                # Make course ID unique per faculty if it's a generic one
                c_id = f"{fac_id}_{c_id_base}" if c_id_base.startswith('G') else c_id_base
                # Map to first dept for simplicity
                target_dept = created_depts[0].id
                course = Course(
                    id=c_id, 
                    name=c_name, 
                    level=c_level, 
                    department_id=target_dept, 
                    faculty_id=fac_id, 
                    credit_hours=3,
                    course_type="إجباري",
                    theoretical_hours=2,
                    practical_hours=1
                )
                session.add(course)
        
        session.commit()
        
        print("Generating Students (50 per faculty)...")
        all_students = []
        all_courses = session.query(Course).all()
        
        for f_data in FACULTIES_DATA:
            fac_id = f_data["id"]
            depts = session.query(Department).filter_by(faculty_id=fac_id).all()
            for i in range(50):
                dept = random.choice(depts)
                level = random.randint(1, 4)
                s_id = f"{fac_id}{20240000 + i}"
                s_name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
                
                student = Student(
                    student_id=s_id,
                    name=s_name,
                    faculty_id=fac_id,
                    department_id=dept.id,
                    level=level,
                    gpa=round(random.uniform(2.0, 4.0), 2),
                    status="مقيد",
                    fees_status="مسدد" if random.random() > 0.2 else "غير مسدد"
                )
                session.add(student)
                all_students.append(student)
                
                # Enroll in 2 courses of their level and faculty
                f_courses = [c for c in all_courses if c.faculty_id == fac_id and c.level == level]
                if f_courses:
                    for c in random.sample(f_courses, min(len(f_courses), 2)):
                        enrollment = Enrollment(student_id=s_id, course_id=c.id, semester="2024-2025 خريف")
                        session.add(enrollment)
                        
                        # Grade
                        grade = Grade(student_id=s_id, course_id=c.id, total=random.randint(60, 100), semester="2024-2025 خريف")
                        session.add(grade)
                        
                        # Attendance (2 records)
                        for w in range(1, 3):
                            att = AttendanceRecord(
                                student_id=s_id, 
                                course_id=c.id, 
                                week_number=w, 
                                attendance_date=date(2024, 10, w*7),
                                status=random.choice(['حاضر', 'حاضر', 'غائب'])
                            )
                            session.add(att)
                
                # Financial
                fin = FinancialRecord(
                    student_id=s_id,
                    fee_type="رسوم دراسية",
                    amount=5000,
                    paid_amount=5000 if student.fees_status == "مسدد" else 0,
                    status=student.fees_status,
                    academic_year="2024-2025",
                    semester="2024-2025 خريف"
                )
                session.add(fin)
                
        session.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_everything()
