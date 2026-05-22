"""
Comprehensive Multi-Faculty Database Seeding Script
====================================================
Populates DUMLIS with realistic data for 3+ faculties (Engineering, Science, Computers)
with unique departments, rooms, courses, and students.
"""

import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
from app.models import (
    Faculty, Department, Student, Course, Room, AcademicProgram,
    StudyRegulation, Enrollment, Grade, AttendanceRecord, Committee,
    StudentProfile, FinancialRecord, CourseSchedule, SurveyRule,
    CourseClose, CourseEquivalence, RegistrationRequest, ReportSignature, ActivityLog, User, AcademicRule
)
from app.database import DATABASE_URL
from app.models import Base

# Database setup
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

def seed_database():
    session = Session()

    try:
        # Clear existing data
        print("[CLEAR]  Clearing existing data...")
        session.query(AttendanceRecord).delete()
        session.query(Grade).delete()
        session.query(Enrollment).delete()
        session.query(Committee).delete()
        session.query(CourseSchedule).delete()
        session.query(FinancialRecord).delete()
        session.query(SurveyRule).delete()
        session.query(CourseClose).delete()
        session.query(CourseEquivalence).delete()
        session.query(RegistrationRequest).delete()
        session.query(ReportSignature).delete()
        session.query(ActivityLog).delete()
        session.query(Course).delete()
        session.query(StudentProfile).delete()
        session.query(User).delete()
        session.query(Student).delete()
        session.query(Room).delete()
        session.query(AcademicProgram).delete()
        session.query(StudyRegulation).delete()
        session.query(AcademicRule).delete()
        session.query(Department).delete()
        session.query(Faculty).delete()
        session.commit()

        # ========================================
        # 1. CREATE FACULTIES
        # ========================================
        print("[FACULTIES] Creating faculties...")
        faculties = [
            Faculty(id="FCAI", name="كلية الحاسبات والمعلومات", color="#0066cc"),
            Faculty(id="FSC", name="كلية العلوم", color="#009900"),
            Faculty(id="FEN", name="كلية الهندسة", color="#ff6600"),
        ]
        session.add_all(faculties)
        session.commit()
        print(f"[OK] Created {len(faculties)} faculties")

        # ========================================
        # 2. CREATE DEPARTMENTS
        # ========================================
        print("[DEPTS] Creating departments...")
        departments = [
            # FCAI departments
            Department(id="CS", faculty_id="FCAI", name="علوم الحاسب", code="CS"),
            Department(id="IS", faculty_id="FCAI", name="نظم المعلومات", code="IS"),
            Department(id="AI", faculty_id="FCAI", name="الذكاء الاصطناعي", code="AI"),
            # FSC departments
            Department(id="MATH", faculty_id="FSC", name="الرياضيات", code="MATH"),
            Department(id="PHYS", faculty_id="FSC", name="الفيزياء", code="PHYS"),
            Department(id="CHEM", faculty_id="FSC", name="الكيمياء", code="CHEM"),
            # FEN departments
            Department(id="MECH", faculty_id="FEN", name="الهندسة الميكانيكية", code="MECH"),
            Department(id="ELEC", faculty_id="FEN", name="الهندسة الكهربائية", code="ELEC"),
            Department(id="CIVIL", faculty_id="FEN", name="الهندسة المدنية", code="CIVIL"),
        ]
        session.add_all(departments)
        session.commit()
        print(f"[OK] Created {len(departments)} departments")

        # ========================================
        # 4. CREATE PROGRAMS
        # ========================================
        print("[PROGRAMS] Creating programs...")
        programs = [
            # FCAI Programs
            AcademicProgram(id="CSB001", name="بكالوريوس علوم الحاسب", code="CSB", degree="بكالوريوس",
                   department_id="CS", faculty_id="FCAI", total_hours=132),
            AcademicProgram(id="ISB001", name="بكالوريوس نظم المعلومات", code="ISB", degree="بكالوريوس",
                   department_id="IS", faculty_id="FCAI", total_hours=132),
            AcademicProgram(id="AIB001", name="بكالوريوس الذكاء الاصطناعي", code="AIB", degree="بكالوريوس",
                   department_id="AI", faculty_id="FCAI", total_hours=132),
            # FSC Programs
            AcademicProgram(id="MATHB001", name="بكالوريوس الرياضيات", code="MATHB", degree="بكالوريوس",
                   department_id="MATH", faculty_id="FSC", total_hours=132),
            AcademicProgram(id="PHYSB001", name="بكالوريوس الفيزياء", code="PHYSB", degree="بكالوريوس",
                   department_id="PHYS", faculty_id="FSC", total_hours=132),
            # FEN Programs
            AcademicProgram(id="MECHB001", name="بكالوريوس الهندسة الميكانيكية", code="MECHB", degree="بكالوريوس",
                   department_id="MECH", faculty_id="FEN", total_hours=150),
        ]
        session.add_all(programs)
        session.commit()
        print(f"[OK] Created {len(programs)} programs")

        # ========================================
        # 3.5 CREATE STUDY REGULATIONS (per program)
        # ========================================
        print("[REGS] Creating study regulations...")
        regulations = []
        all_programs = session.query(AcademicProgram).all()

        for program in all_programs:
            regulations.append(StudyRegulation(
                id=f"REG_{program.id}",
                name="لائحة جديدة",
                program_id=program.id,
                mandatory_hours=90,
                elective_hours=42,
                university_requirements=program.total_hours - 90 - 42
            ))

        session.add_all(regulations)
        session.commit()
        print(f"[OK] Created {len(regulations)} study regulations")

        # ========================================
        # 3.6 CREATE ACADEMIC RULES (per faculty)
        # ========================================
        print("[RULES] Creating academic rules...")
        academic_rules = []
        all_faculties = session.query(Faculty).all()

        for faculty in all_faculties:
            # FCAI specific rules from internal regulation
            if faculty.id == "FCAI":
                rules_data = {
                    "max_credit_hours": 18,
                    "min_credit_hours": 12,
                    "pass_grade": 50,
                    "gpa_pass": 2.0,
                    "graduation_requirements": {
                        "total_credit_hours": 140,
                        "minimum_gpa": 2.0,
                        "minimum_years": 3
                    },
                    "level_progression": {
                        "level_2": {"required_hours": 30, "name": "السنة الثانية"},
                        "level_3": {"required_hours": 66, "name": "السنة الثالثة"},
                        "level_4": {"required_hours": 102, "name": "السنة الرابعة"}
                    },
                    "practical_training": {
                        "credit_hours": 3,
                        "required_completed_hours": 70,
                        "semester": "صيفي"
                    },
                    "graduation_project": {
                        "credit_hours": 4,
                        "required_completed_hours": 102,
                        "duration": "سنة جامعية"
                    },
                    "grading_system": {
                        "max_score": 100,
                        "passing_score": 50,
                        "theoretical_and_practical": {
                            "midterm": 20,
                            "oral": 15,
                            "practical": 15,
                            "final_exam": 50
                        },
                        "theoretical_only": {
                            "midterm": 10,
                            "assignments": 10,
                            "oral": 20,
                            "final_exam": 60
                        }
                    },
                    "academic_standing": {
                        "good_standing_gpa": 2.0,
                        "probation_gpa": 1.5,
                        "dismissal_gpa": 1.0
                    },
                    "repetition_policy": {
                        "failure": {
                            "allowed": True,
                            "max_grade_on_pass": 83,
                            "max_grade_letter": "B"
                        },
                        "improvement": {
                            "max_courses": 3,
                            "max_grade_on_pass": 83,
                            "max_grade_letter": "B"
                        }
                    },
                    "attendance_policy": {
                        "min_percentage": 75,
                        "allowed_absences": 10,
                        "excused_absences": 3
                    },
                    "specialization": {
                        "programs": ["علوم الحاسب (CS)", "تكنولوجيا المعلومات (IT)", "نظم المعلومات (IS)"],
                        "start_level": 3,
                        "shared_levels": [1, 2]
                    },
                    "academic_advising": True,
                    "prerequisites_enforced": True,
                    "credit_hour_system": {
                        "definition": "ساعة معتمدة واحدة = محاضرة نظرية ساعة واحدة أو 2-3 ساعات تمارين/عملي أسبوعياً",
                        "semesters": {
                            "fall": "الفصل الدراسي الأول",
                            "spring": "الفصل الدراسي الثاني",
                            "summer": "فصل صيفي اختياري"
                        },
                        "course_load": {
                            "max_hours_per_semester": 18,
                            "min_hours_per_semester": 12,
                            "determined_by": "مجلس الكلية"
                        }
                    },
                    "add_drop_policy": {
                        "allowed": True,
                        "period": "فترة زمنية محددة يعلنها مجلس الكلية",
                        "description": "يجوز للطالب حذف أو إضافة مقرر أو أكثر بعد التسجيل"
                    },
                    "semester_gpa": {
                        "definition": "متوسط النقاط في الفصل الدراسي الواحد",
                        "calculation": "(مجموع نقاط كل مقرر × عدد ساعاته) / مجموع الساعات المسجلة",
                        "used_for": ["تقييم الأداء الأكاديمي", "منح الرتب والتقديرات"]
                    },
                    "honor_ranking": {
                        "minimum_cgpa": 3.0,
                        "minimum_semester_gpa": 3.0,
                        "no_failures_allowed": True,
                        "max_graduation_years": 4,
                        "based_on": "ترتيب الطلاب حسب المجموع التراكمي للدرجات"
                    },
                    "honor_conditions": {
                        "cgpa_requirement": "الحد الأدنى 3.0 عند التخرج",
                        "continuity_requirement": "لا يقل المعدل الفصلي عن 3.0 في أي فصل",
                        "failure_restriction": "عدم الرسوب في أي مقرر طوال فترة الدراسة",
                        "duration_limit": "عدم تجاوز 4 سنوات دراسية (مع استبعاد فترات إيقاف القيد)",
                        "ranking_criteria": "ترتيب الخريجين حسب المجموع التراكمي"
                    },
                    "graduation_project_details": {
                        "supervision": "إشراف عضو هيئة تدريس من القسم العلمي",
                        "grading_distribution": {
                            "supervisor_evaluation": 40,
                            "supervisor_oral": 20,
                            "supervisor_periodic_follow_up": 20,
                            "committee_evaluation": 60
                        },
                        "committee_members": 3,
                        "committee_type": "لجنة حكم ثلاثية"
                    },
                    "practical_training_details": {
                        "minimum_duration": "ثلاثة أسابيع على الأقل",
                        "timing": "العطلة الصيفية",
                        "group_supervision": "تقسيم الطلاب إلى مجموعات يشرف عليها أعضاء هيئة التدريس",
                        "conflict_rule": "لا يسمح التسجيل في الفصل الصيفي إذا تعارض مع موعد التدريب",
                        "project_implementation": "تنفيذ مشاريع عملية فعلية ميدانية"
                    },
                    # أحكام عامة وإدارية (4 بنود)
                    "course_content": {
                        "instructor_compliance": "التزام أعضاء هيئة التدريس بالمحتوى العلمي المعتمد",
                        "periodic_review": "مراجعة وتحديث التوصيفات دورياً",
                        "approval_required": True
                    },
                    "course_modification": {
                        "allowed": True,
                        "approvals_required": [
                            "موافقة مجلس الكلية",
                            "موافقة مجلس الجامعة",
                            "موافقة لجنة القطاع",
                            "موافقة المجلس الأعلى للجامعات"
                        ],
                        "authority": "مجلس الكلية"
                    },
                    "scientific_trips": {
                        "allowed": True,
                        "purpose": "ربط الدراسة الأكاديمية بالجانب التطبيقي",
                        "maximum_duration": "5 أيام",
                        "organized_by": "القسم العلمي"
                    },
                    "trip_evaluation": {
                        "report_required": True,
                        "presentation_required": True,
                        "credit_hours": 0,
                        "requirements": ["تقرير مكتوب", "عرض تقديمي"],
                        "note": "لا تحتسب لها ساعات معتمدة"
                    },
                    "supplementary_rules": {
                        "governing": "قانون تنظيم الجامعات ولائحته التنفيذية",
                        "application": "تطبق في كل الحالات غير المنصوص عليها في هذه اللائحة"
                    }
                }
            else:
                # Default for other faculties
                rules_data = {
                    "max_credit_hours": 18,
                    "min_credit_hours": 12,
                    "pass_grade": 50,
                    "gpa_pass": 1.5,
                    "graduation_requirements": {
                        "total_credit_hours": 120,
                        "minimum_gpa": 1.5,
                        "minimum_years": 3
                    }
                }

            academic_rules.append(AcademicRule(
                id=f"RULE_{faculty.id}",
                faculty_id=faculty.id,
                rule_name="اللائحة الأكاديمية",
                description=f"القواعد الأكاديمية لـ {faculty.name}",
                rules_data=rules_data
            ))

        session.add_all(academic_rules)
        session.commit()
        print(f"[OK] Created {len(academic_rules)} academic rules")

        # ========================================
        # 5. CREATE ROOMS
        # ========================================
        print("[ROOMS]  Creating rooms and labs...")
        rooms = []

        # Classrooms (distributed across faculties)
        faculty_ids = ["FCAI", "FSC", "FEN"]
        room_idx = 0
        for i in range(1, 11):
            rooms.append(Room(
                id=f"ROOM_{i:03d}",
                code=f"{100+i}",
                name=f"قاعة المحاضرات {100+i}",
                room_type="classroom",
                capacity=150 + (i * 10),
                building="B",
                floor=(i // 3) + 1,
                status="available",
                faculty_id=faculty_ids[room_idx % 3]
            ))
            room_idx += 1

        # Labs (distributed across faculties)
        for i in range(1, 16):
            rooms.append(Room(
                id=f"LAB_{i:03d}",
                code=f"{200+i}",
                name=f"معمل {200+i}",
                room_type="lab",
                capacity=30 + (i * 2),
                building="B",
                floor=(i // 5) + 2,
                status="available",
                faculty_id=faculty_ids[room_idx % 3]
            ))
            room_idx += 1

        session.add_all(rooms)
        session.commit()
        print(f"[OK] Created {len(rooms)} rooms and labs")

        # ========================================
        # 6. CREATE COURSES
        # ========================================
        print("[COURSES] Creating courses...")
        courses = []

        # FCAI Courses
        fcai_courses = [
            ("CS101", "مقدمة في علوم الحاسب", "CS", "FCAI", 1, 3, "إجباري"),
            ("CS102", "البرمجة 1", "CS", "FCAI", 1, 4, "إجباري"),
            ("CS201", "هياكل البيانات", "CS", "FCAI", 2, 3, "إجباري"),
            ("CS202", "قواعد البيانات", "CS", "FCAI", 2, 4, "إجباري"),
            ("CS301", "نظم التشغيل", "CS", "FCAI", 3, 3, "إجباري"),
            ("CS302", "شبكات الحاسب", "CS", "FCAI", 3, 4, "إجباري"),
            ("IS101", "مقدمة في نظم المعلومات", "IS", "FCAI", 1, 3, "إجباري"),
            ("IS201", "تحليل وتصميم النظم", "IS", "FCAI", 2, 4, "إجباري"),
            ("AI301", "الذكاء الاصطناعي", "AI", "FCAI", 3, 3, "إجباري"),
            ("AI401", "تعلم الآلة", "AI", "FCAI", 4, 4, "إجباري"),
        ]

        for code, name, dept, fac, level, hours, ctype in fcai_courses:
            courses.append(Course(
                id=code,
                name=name,
                department_id=dept,
                faculty_id=fac,
                level=level,
                credit_hours=hours,
                course_type=ctype,
                semester="خريف 2024"
            ))

        # FSC Courses
        fsc_courses = [
            ("MATH101", "رياضيات متقطعة", "MATH", "FSC", 1, 3, "إجباري"),
            ("MATH201", "حساب التفاضل والتكامل", "MATH", "FSC", 2, 4, "إجباري"),
            ("MATH301", "الإحصاء والاحتمالات", "MATH", "FSC", 3, 3, "إجباري"),
            ("PHYS101", "فيزياء عامة 1", "PHYS", "FSC", 1, 4, "إجباري"),
            ("PHYS201", "فيزياء عامة 2", "PHYS", "FSC", 2, 4, "إجباري"),
            ("CHEM101", "كيمياء عامة", "CHEM", "FSC", 1, 3, "إجباري"),
        ]

        for code, name, dept, fac, level, hours, ctype in fsc_courses:
            courses.append(Course(
                id=code,
                name=name,
                department_id=dept,
                faculty_id=fac,
                level=level,
                credit_hours=hours,
                course_type=ctype,
                semester="خريف 2024"
            ))

        # FEN Courses
        fen_courses = [
            ("MECH101", "الرسم الهندسي", "MECH", "FEN", 1, 2, "إجباري"),
            ("MECH201", "الميكانيكا الثابتة", "MECH", "FEN", 2, 3, "إجباري"),
            ("ELEC101", "كهربائية هندسية", "ELEC", "FEN", 1, 3, "إجباري"),
            ("CIVIL101", "مواد هندسية", "CIVIL", "FEN", 1, 3, "إجباري"),
        ]

        for code, name, dept, fac, level, hours, ctype in fen_courses:
            courses.append(Course(
                id=code,
                name=name,
                department_id=dept,
                faculty_id=fac,
                level=level,
                credit_hours=hours,
                course_type=ctype,
                semester="خريف 2024"
            ))

        session.add_all(courses)
        session.commit()
        print(f"[OK] Created {len(courses)} courses")

        # ========================================
        # 7. CREATE STUDENTS
        # ========================================
        print("[STUDENTS] Creating students...")
        students = []
        student_id_counter = 1001

        faculties_list = ["FCAI", "FSC", "FEN"]
        departments_map = {
            "FCAI": ["CS", "IS", "AI"],
            "FSC": ["MATH", "PHYS", "CHEM"],
            "FEN": ["MECH", "ELEC", "CIVIL"]
        }

        # Create 500 students
        names_ar = [
            "أحمد", "محمد", "علي", "حسن", "إبراهيم",
            "فاطمة", "عائشة", "زينب", "ليلى", "مريم",
            "سارة", "هناء", "دعاء", "نور", "ريم"
        ]

        family_names = [
            "محمد", "علي", "حسن", "إبراهيم", "عبدالله",
            "أحمد", "محمود", "خالد", "سعيد", "نصر"
        ]

        cities = [
            "دمياط", "المنصورة", "بورسعيد", "القاهرة", "الإسكندرية",
            "الجيزة", "أسوان", "الأقصر", "سوهاج", "المنيا"
        ]

        for i in range(500):
            faculty = random.choice(faculties_list)
            department = random.choice(departments_map[faculty])
            level = random.randint(1, 4)

            students.append(Student(
                student_id=f"{student_id_counter + i}",
                name=f"{random.choice(names_ar)} {random.choice(family_names)}",
                national_id=f"{random.randint(10000000000000, 99999999999999)}",
                faculty_id=faculty,
                department_id=department,
                level=level,
                regulation=random.choice(["لائحة جديدة", "لائحة قديمة"]),
                gpa=round(random.uniform(1.5, 4.0), 2),
                phone=f"010{random.randint(10000000, 99999999)}",
                email=f"student{i}@university.edu.eg",
                city=random.choice(cities),
                status=random.choice(["مقيد", "موقوف", "خريج"]),
                fees_status=random.choice(["مسدد", "غير مسدد", "مسدد جزئياً"]),
                graduation_year=2024 + (4 - level),
                survey_status=random.choice(["مكتمل", "بانتظار", "غير مسجل"]),
                id_card_status=random.choice(["مطبوع", "مطبوع", "لم يُطبع"]),
                level_change_date=None
            ))

        session.add_all(students)
        session.commit()
        print(f"[OK] Created {len(students)} students")

        # ========================================
        # 7.2 CREATE USER ACCOUNTS FOR STUDENTS
        # ========================================
        print("[USERS] Creating user accounts for students...")
        users = []
        for student in students:
            user = User(
                username=student.student_id,
                email=student.email,
                hashed_password=pwd_context.hash("test1234"),
                role="student",
                faculty_id=student.faculty_id,
                is_active=True
            )
            users.append(user)

        # Add faculty admin users
        for faculty in faculties:
            user = User(
                username=f"admin_{faculty.id.lower()}",
                email=f"admin@{faculty.id.lower()}.edu.eg",
                hashed_password=pwd_context.hash("test1234"),
                role="faculty_admin",
                faculty_id=faculty.id,
                is_active=True
            )
            users.append(user)

        # Add super admin user
        users.append(User(
            username="super_admin",
            email="admin@university.edu.eg",
            hashed_password=pwd_context.hash("test1234"),
            role="super_admin",
            faculty_id=None,
            is_active=True
        ))

        session.add_all(users)
        session.commit()
        print(f"[OK] Created {len(users)} user accounts")

        # ========================================
        # 7.5 CREATE STUDENT PROFILES
        # ========================================
        print("[PROFILES] Creating student profiles...")
        student_profiles = []
        all_students = session.query(Student).all()

        for student in all_students:
            profile = StudentProfile(
                student_id=student.student_id,
                name_en=f"{student.name} (EN)",
                birth_date=datetime.now().date() - timedelta(days=random.randint(7000, 9000)),
                birth_place=random.choice(["دمياط", "القاهرة", "الإسكندرية", "الجيزة"]),
                nationality="مصري",
                religion=random.choice(["مسلم", "مسيحي"]),
                gender=random.choice(["ذكر", "أنثى"]),
                guardian_name=f"ولي أمر {student.name}",
                guardian_relation=random.choice(["الأب", "الأم", "الجد", "الجدة"]),
                guardian_phone=f"01{random.randint(100000000, 999999999)}",
                guardian_job=random.choice(["موظف", "معلم", "مهندس", "طبيب", "تاجر"]),
                guardian_national_id=f"{random.randint(20000000000000, 29999999999999)}",
                military_status=random.choice(["مؤجل", "معاف", "مجند", "لم يحل الدور"]),
                military_notes="",
                blood_type=random.choice(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
                medical_status=random.choice(["لائق", "لائق", "لائق", "ذوي احتياجات خاصة"])
            )
            student_profiles.append(profile)

        session.add_all(student_profiles)
        session.commit()
        print(f"[OK] Created {len(student_profiles)} student profiles")

        # ========================================
        # 8. CREATE ENROLLMENTS
        # ========================================
        print("[ENROLLMENTS] Creating enrollments...")
        enrollments = []

        all_students = session.query(Student).all()
        all_courses = session.query(Course).all()

        for student in all_students[:300]:  # Enroll first 300 students
            # Each student enrolls in 4-6 courses
            student_courses = random.sample(all_courses, random.randint(4, 6))

            for course in student_courses:
                # Only enroll if course is in the same faculty
                if course.faculty_id == student.faculty_id:
                    enrollments.append(Enrollment(
                        student_id=student.student_id,
                        course_id=course.id,
                        faculty_id=student.faculty_id,
                        semester="خريف 2024",
                        status=random.choice(["مسجل", "منسحب", "معلق"])
                    ))

        session.add_all(enrollments)
        session.commit()
        print(f"[OK] Created {len(enrollments)} enrollments")

        # ========================================
        # 9. CREATE GRADES
        # ========================================
        print("[GRADES] Creating grades...")
        grades = []

        all_enrollments = session.query(Enrollment).filter_by(status="مسجل").all()

        for enrollment in all_enrollments[:200]:
            total = random.randint(40, 100)

            grades.append(Grade(
                student_id=enrollment.student_id,
                course_id=enrollment.course_id,
                semester="خريف 2024",
                midterm=random.randint(10, 25),
                final_exam=random.randint(15, 35),
                assignments=random.randint(5, 10),
                total=total,
                grade_letter=chr(65 + max(0, min(4, (100-total)//20))) if total >= 60 else "F",
                grade_points=round((100-total)/20 * 4, 2) if total >= 60 else 0.0
            ))

        session.add_all(grades)
        session.commit()
        print(f"[OK] Created {len(grades)} grades")

        # ========================================
        # 10. CREATE COMMITTEES
        # ========================================
        print("[REGS] Creating exam committees...")
        committees = []

        all_rooms = session.query(Room).all()

        for i, course in enumerate(all_courses[:10]):
            committee = Committee(
                name=f"لجنة امتحان {course.name}",
                course_id=course.id,
                room_id=random.choice(all_rooms).id,
                capacity=random.randint(30, 150),
                assigned_students=0,
                exam_date=f"2024-12-{15+i:02d}",
                exam_time="09:00",
                status="نشط",
                seating_rows=5,
                seating_cols=6,
                semester="خريف 2024",
                faculty_id=course.faculty_id
            )
            committees.append(committee)

        session.add_all(committees)
        session.commit()
        print(f"[OK] Created {len(committees)} exam committees")

        # ========================================
        # 11. CREATE FINANCIAL RECORDS
        # ========================================
        print("[FINANCIAL] Creating financial records...")
        financial_records = []
        all_students_for_fin = session.query(Student).all()
        fee_types = ["رسوم دراسية", "رسوم مكتبة", "رسوم أنشطة"]

        for student in all_students_for_fin:
            for fee_type in fee_types:
                amount = random.choice([2000, 3000, 4000, 5000])
                paid_amount = random.choice([0, amount//2, amount])
                payment_date = None

                if paid_amount > 0:
                    payment_date = datetime.now() - timedelta(days=random.randint(1, 180))

                record = FinancialRecord(
                    student_id=student.student_id,
                    faculty_id=student.faculty_id,
                    fee_type=fee_type,
                    description=f"{fee_type} - {student.name}",
                    amount=amount,
                    paid_amount=paid_amount,
                    status="مسدد" if paid_amount >= amount else ("مسدد جزئياً" if paid_amount > 0 else "غير مسدد"),
                    payment_date=payment_date,
                    academic_year="2024/2025",
                    semester=random.choice(["الأول", "الثاني"]),
                    due_date=datetime.now() + timedelta(days=30),
                )
                financial_records.append(record)

        session.add_all(financial_records)
        session.commit()
        print(f"[OK] Created {len(financial_records)} financial records")

        # ========================================
        # 12. CREATE COURSE SCHEDULES
        # ========================================
        print("[SCHEDULES] Creating course schedules...")
        schedules = []
        all_courses_for_sched = session.query(Course).all()
        all_rooms_for_sched = session.query(Room).all()
        days = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء"]
        instructors_ar = ["د. أحمد محمد", "د. سارة علي", "د. محمود حسن", "م. ياسمين خالد", "م. عمر سعيد"]

        for course in all_courses_for_sched:
            # Create lecture schedule
            schedule = CourseSchedule(
                course_id=course.id,
                faculty_id=course.faculty_id,
                room_id=random.choice(all_rooms_for_sched).id if all_rooms_for_sched else None,
                session_type="محاضرة",
                day=random.choice(days),
                time_start="09:00",
                time_end="11:00",
                time_label="9 ص - 11 ص",
                instructor=random.choice(instructors_ar),
                semester="الأول",
                group_label="أ",
                enrolled_count=random.randint(20, 60),
            )
            schedules.append(schedule)

            # Create lab schedule if course type includes practical
            if "عملي" in course.course_type or random.random() > 0.5:
                lab_schedule = CourseSchedule(
                    course_id=course.id,
                    faculty_id=course.faculty_id,
                    room_id=random.choice(all_rooms_for_sched).id if all_rooms_for_sched else None,
                    session_type="معمل",
                    day=random.choice(days),
                    time_start="11:00",
                    time_end="13:00",
                    time_label="11 ص - 1 م",
                    instructor=random.choice(instructors_ar),
                    semester="الأول",
                    group_label="أ",
                    enrolled_count=random.randint(15, 30),
                )
                schedules.append(lab_schedule)

        session.add_all(schedules)
        session.commit()
        print(f"[OK] Created {len(schedules)} course schedules")

        # ========================================
        # 10. CREATE ATTENDANCE RECORDS
        # ========================================
        print("\n[ATTENDANCE] Creating attendance records...")
        attendance_records = []
        all_enrollments = session.query(Enrollment).all()
        statuses = ["حاضر", "غائب", "متأخر"]

        for idx, enrollment in enumerate(all_enrollments[:300]):  # Create attendance for 300 enrollments
            for week in range(1, 5):  # 4 weeks of attendance
                session_types = ["محاضرة", "سكشن", "معمل"]
                for day, session_type in enumerate(session_types):  # 3 sessions per week
                    # Use deterministic dates to avoid duplicates
                    att_date = datetime.now() - timedelta(days=60 - (week * 15) - day)
                    record = AttendanceRecord(
                        student_id=enrollment.student_id,
                        course_id=enrollment.course_id,
                        faculty_id=enrollment.faculty_id,
                        attendance_date=att_date.date(),
                        session_type=session_type,
                        status=random.choice(statuses),
                        week_number=week,
                    )
                    attendance_records.append(record)

        session.add_all(attendance_records)
        session.commit()
        print(f"[OK] Created {len(attendance_records)} attendance records")

        # ========================================
        # 11. CREATE SURVEY RULES
        # ========================================
        print("\n[SURVEY RULES] Creating survey rules...")
        survey_rules_data = [
            ('SUR-001', 'استبيان المقررات الدراسية', 'طلاب المستوى 3 و4'),
            ('SUR-002', 'استبيان تقييم أعضاء هيئة التدريس', 'جميع الطلاب'),
            ('SUR-003', 'استبيان رضا الطلاب', 'طلاب السنة الأولى'),
            ('SUR-004', 'استبيان البنية التحتية', 'مندوبو الفصول'),
            ('SUR-005', 'استبيان التدريب والأنشطة', 'جميع الطلاب'),
        ]
        survey_rules = []
        for faculty_id, (code, name, target) in zip(
            ['FCAI', 'FSC', 'FEN'],
            survey_rules_data[:3]
        ):
            rule = SurveyRule(
                code=f"{faculty_id}-{code}",
                name=name,
                target=target,
                faculty_id=faculty_id,
                status='نشط',
                start_date=datetime.now(),
                end_date=datetime.now() + timedelta(days=30),
            )
            survey_rules.append(rule)

        session.add_all(survey_rules)
        session.commit()
        print(f"[OK] Created {len(survey_rules)} survey rules")

        # ========================================
        # 13. CREATE COURSE CLOSURES
        # ========================================
        print("[CLOSURES] Creating course closures...")
        closures = []
        courses_for_closure = session.query(Course).limit(5).all()

        if courses_for_closure:
            closure_data = [
                ("2024/2025", "الفصل الأول", "2024-01-15"),
                ("2024/2025", "الفصل الثاني", "2024-05-20"),
                ("2024/2025", "الفصل الأول", "2024-02-10"),
                ("2024/2025", "الفصل الأول", "2024-01-30"),
                ("2024/2025", "الفصل الثاني", "2024-06-05"),
            ]
            for i, course in enumerate(courses_for_closure):
                academic_year, semester, closure_date_str = closure_data[i]
                closure = CourseClose(
                    course_code=course.id,
                    faculty_id=course.faculty_id or "FCAI",
                    academic_year=academic_year,
                    semester=semester,
                    closure_date=datetime.strptime(closure_date_str, "%Y-%m-%d").date(),
                    status="مغلق",
                )
                closures.append(closure)

        session.add_all(closures)
        session.commit()
        print(f"[OK] Created {len(closures)} course closures")

        # ========================================
        # 14. CREATE COURSE EQUIVALENCES
        # ========================================
        print("[EQUIV] Creating course equivalences...")
        equivalences = []
        students = session.query(Student).limit(5).all()
        courses = session.query(Course).limit(10).all()

        if students and courses and len(courses) >= 2:
            equivalence_data = [
                (students[0].student_id, courses[0].id, courses[1].id, "معتمد"),
                (students[1].student_id, courses[2].id, courses[3].id, "قيد المراجعة"),
                (students[2].student_id, courses[4].id, courses[5].id, "معتمد"),
            ]
            for student_id, original_course_id, equivalent_course_id, status in equivalence_data:
                equiv = CourseEquivalence(
                    student_id=student_id,
                    original_course_id=original_course_id,
                    equivalent_course_id=equivalent_course_id,
                    status=status,
                )
                equivalences.append(equiv)

        session.add_all(equivalences)
        session.commit()
        print(f"[OK] Created {len(equivalences)} course equivalences")

        # ========================================
        # 15. CREATE REGISTRATION REQUESTS
        # ========================================
        print("[REQS] Creating registration requests...")
        registration_reqs = []
        students_for_reqs = session.query(Student).limit(8).all()

        request_statuses = ["قيد المراجعة", "موافق عليه", "مرفوض", "بانتظار المستندات"]

        for i, student in enumerate(students_for_reqs):
            req = RegistrationRequest(
                id=f"REQ_{student.student_id}_{i:03d}",
                student_id=student.student_id,
                status=request_statuses[i % len(request_statuses)],
                comment=f"طلب من {student.name} - {['تسجيل مقرر', 'حذف مقرر', 'تغيير برنامج', 'طلب تأجيل'][i % 4]}",
                admin_response="تم المراجعة" if i % 2 == 0 else None,
                faculty_id=student.faculty_id,
                request_date=(datetime.now() - timedelta(days=random.randint(1, 30))).date(),
            )
            registration_reqs.append(req)

        session.add_all(registration_reqs)
        session.commit()
        print(f"[OK] Created {len(registration_reqs)} registration requests")

        # ========================================
        # 16. CREATE REPORT SIGNATURES
        # ========================================
        print("[SIGS] Creating report signatures...")
        signatures = []
        signature_config = [
            ("تقرير الدرجات", "د. أحمد محمد علي", "رئيس القسم", 1, "FCAI"),
            ("تقرير الغياب", "أ. فاطمة إبراهيم", "منسق العملي", 2, "FCAI"),
            ("تقرير المشاريع", "د. محمود السيد", "المشرف الأكاديمي", 3, "FCAI"),
            ("تقرير النتائج النهائية", "أ.د. سارة حسن", "عميد الكلية", 1, "FSC"),
            ("تقرير الأداء", "د. علي أحمد", "رئيس القسم", 2, "FSC"),
        ]

        for i, (report_name, signatory_name, title, order, faculty_id) in enumerate(signature_config):
            sig = ReportSignature(
                id=f"SIG_{faculty_id}_{i:03d}",
                report_name=report_name,
                signatory_name=signatory_name,
                title=title,
                order=order,
                is_active=True,
                faculty_id=faculty_id,
            )
            signatures.append(sig)

        session.add_all(signatures)
        session.commit()
        print(f"[OK] Created {len(signatures)} report signatures")

        # ========================================
        # 17. CREATE ACTIVITY LOGS
        # ========================================
        print("[LOGS] Creating activity logs...")
        activity_logs = []
        activity_actions = ["تسجيل دخول", "تعديل درجات", "إضافة طالب", "حذف مقرر", "تحديث الملف الشخصي"]
        entity_types = ["student", "course", "grade", "enrollment", "user"]

        # Get some sample students and courses
        sample_students = session.query(Student).limit(5).all()
        sample_courses = session.query(Course).limit(5).all()

        # Create logs for various entities
        for i in range(12):
            entity_id = None
            entity_type = entity_types[i % len(entity_types)]

            if entity_type == "student" and sample_students:
                entity_id = sample_students[i % len(sample_students)].student_id
            elif entity_type == "course" and sample_courses:
                entity_id = sample_courses[i % len(sample_courses)].id

            log = ActivityLog(
                user_id=None,  # Will be set by the admin/user who makes the action
                faculty_id=['FCAI', 'FSC', 'FEN'][i % 3],
                action=activity_actions[i % len(activity_actions)],
                entity_type=entity_type,
                entity_id=entity_id,
                description=f"عملية {activity_actions[i % len(activity_actions)]} - التفاصيل متوفرة",
                performed_at=datetime.now() - timedelta(hours=random.randint(1, 72)),
            )
            activity_logs.append(log)

        session.add_all(activity_logs)
        session.commit()
        print(f"[OK] Created {len(activity_logs)} activity logs")

        # ========================================
        # FINAL SUMMARY
        # ========================================
        print("\n" + "="*50)
        print("[OK] DATABASE SEEDING COMPLETE!")
        print("="*50)
        print(f"[FACULTIES] Faculties: {session.query(Faculty).count()}")
        print(f"[DEPTS] Departments: {session.query(Department).count()}")
        print(f"[STUDENTS] Students: {session.query(Student).count()}")
        print(f"[PROFILES] Student Profiles: {session.query(StudentProfile).count()}")
        print(f"[COURSES] Courses: {session.query(Course).count()}")
        print(f"[ROOMS]  Rooms/Labs: {session.query(Room).count()}")
        print(f"[ENROLLMENTS] Enrollments: {session.query(Enrollment).count()}")
        print(f"[GRADES] Grades: {session.query(Grade).count()}")
        print(f"[REGS] Exam Committees: {session.query(Committee).count()}")
        print(f"[FINANCIAL] Financial Records: {session.query(FinancialRecord).count()}")
        print(f"[SCHEDULES] Course Schedules: {session.query(CourseSchedule).count()}")
        print(f"[ATTENDANCE] Attendance Records: {session.query(AttendanceRecord).count()}")
        print(f"[SURVEYS] Survey Rules: {session.query(SurveyRule).count()}")
        print(f"[CLOSURES] Course Closures: {session.query(CourseClose).count()}")
        print(f"[EQUIV] Course Equivalences: {session.query(CourseEquivalence).count()}")
        print(f"[REQS] Registration Requests: {session.query(RegistrationRequest).count()}")
        print(f"[SIGS] Report Signatures: {session.query(ReportSignature).count()}")
        print(f"[LOGS] Activity Logs: {session.query(ActivityLog).count()}")
        print("="*50)
        print("\n[DONE] System ready for use!\n")

    except Exception as e:
        session.rollback()
        print(f"[ERROR] Error during seeding: {str(e)}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    print("Starting DUMLIS Database Seeding...\n")
    seed_database()
    print("Seeding completed successfully!")
