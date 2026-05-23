"""
Direct Neon Database Seeder
Uses psycopg2 directly with bulk inserts to avoid SQLAlchemy lazy loading timeout issues.
"""
import os
import uuid
import random
from datetime import datetime, date, timedelta
import psycopg2
from psycopg2.extras import execute_values
import bcrypt

DB_URL = os.getenv("DATABASE_URL", "postgresql://dumlis_user:dumlis_pass@localhost:5432/dumlis_db")
print(f"Connecting to: {DB_URL[:50]}...")

# Pre-compute hashes once before connecting (bcrypt is slow)
print("Pre-computing password hashes...")
HASH_TEST1234 = bcrypt.hashpw(b"test1234", bcrypt.gensalt()).decode()
HASH_ADMIN = bcrypt.hashpw(b"admin", bcrypt.gensalt()).decode()
HASH_AFFAIRS = bcrypt.hashpw(b"affairs", bcrypt.gensalt()).decode()
print("Hashes ready.")

def connect():
    return psycopg2.connect(DB_URL)

ARABIC_NAMES = ["محمد", "أحمد", "علي", "عمر", "يوسف", "خالد", "حسن", "إبراهيم", "عبدالله", "مصطفى",
                "فاطمة", "مريم", "نور", "سارة", "آية", "هدى", "رانيا", "دينا", "إيمان", "أسماء"]
FAMILY_NAMES = ["محمود", "أحمد", "السيد", "عبدالرحمن", "حسين", "عبدالله", "سليمان", "علي", "إبراهيم", "خالد"]

def seed_all():
    conn = connect()
    cur = conn.cursor()
    print("Connected to database.")

    # ── 1. Clear existing data ─────────────────────────────────────────────────
    print("\n[CLEAR] Clearing old data...")
    tables_to_clear = [
        "attendance_records", "grades", "enrollments", "financial_records",
        "course_schedules", "student_profiles", "student_requirements",
        "student_documents", "student_committee_assignments",
        "registration_requests", "report_signatures", "activity_log",
        "course_equivalences", "course_closures", "survey_rules",
        "student_blocks", "courses", "students", "programs",
        "academic_rules", "study_regulations", "departments",
        "rooms", "committees", "staff", "fee_setup",
        "academic_calendar", "announcements", "system_settings",
        "course_prerequisites",
    ]
    for t in tables_to_clear:
        cur.execute(f"DELETE FROM {t}")
    # Delete non-admin users (keep existing admins if any)
    cur.execute("DELETE FROM users")
    # Update faculties (don't delete them)
    conn.commit()
    print("[CLEAR] Done.")

    # ── 2. Update faculties ────────────────────────────────────────────────────
    print("\n[FACULTIES] Updating faculties...")
    execute_values(cur, """
        INSERT INTO faculties (id, name, name_en, icon, student_count, staff_count, color)
        VALUES %s
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            name_en = EXCLUDED.name_en,
            icon = EXCLUDED.icon,
            student_count = EXCLUDED.student_count,
            staff_count = EXCLUDED.staff_count,
            color = EXCLUDED.color
    """, [
        ("FCAI", "كلية الحاسبات والمعلومات", "Faculty of Computers and Information", "💻", 0, 120, "#0066cc"),
        ("FSC", "كلية العلوم", "Faculty of Science", "🔬", 0, 80, "#009900"),
        ("FEN", "كلية الهندسة", "Faculty of Engineering", "⚙️", 0, 110, "#ff6600"),
    ])
    conn.commit()
    print("[FACULTIES] Done.")

    # ── 3. Departments ─────────────────────────────────────────────────────────
    print("\n[DEPTS] Creating departments...")
    execute_values(cur, """
        INSERT INTO departments (id, faculty_id, name, name_en, code)
        VALUES %s ON CONFLICT DO NOTHING
    """, [
        ("CS", "FCAI", "علوم الحاسب", "Computer Science", "CS"),
        ("IS", "FCAI", "نظم المعلومات", "Information Systems", "IS"),
        ("AI", "FCAI", "الذكاء الاصطناعي", "Artificial Intelligence", "AI"),
        ("MATH", "FSC", "الرياضيات", "Mathematics", "MATH"),
        ("PHYS", "FSC", "الفيزياء", "Physics", "PHYS"),
        ("CHEM", "FSC", "الكيمياء", "Chemistry", "CHEM"),
        ("MECH", "FEN", "الهندسة الميكانيكية", "Mechanical Engineering", "MECH"),
        ("ELEC", "FEN", "الهندسة الكهربائية", "Electrical Engineering", "ELEC"),
        ("CIVIL", "FEN", "الهندسة المدنية", "Civil Engineering", "CIVIL"),
    ])
    conn.commit()
    print("[DEPTS] Done.")

    # ── 4. Programs ────────────────────────────────────────────────────────────
    print("\n[PROGRAMS] Creating programs...")
    execute_values(cur, """
        INSERT INTO programs (id, name, name_en, code, degree, department_id, faculty_id, total_hours, mandatory_hours, elective_hours, university_requirements)
        VALUES %s ON CONFLICT DO NOTHING
    """, [
        ("CSB001", "بكالوريوس علوم الحاسب", "Computer Science BSc", "CSB", "بكالوريوس", "CS", "FCAI", 132, 100, 20, 12),
        ("ISB001", "بكالوريوس نظم المعلومات", "Information Systems BSc", "ISB", "بكالوريوس", "IS", "FCAI", 132, 100, 20, 12),
        ("AIB001", "بكالوريوس الذكاء الاصطناعي", "Artificial Intelligence BSc", "AIB", "بكالوريوس", "AI", "FCAI", 132, 100, 20, 12),
        ("MATHB001", "بكالوريوس الرياضيات", "Mathematics BSc", "MATHB", "بكالوريوس", "MATH", "FSC", 132, 100, 20, 12),
        ("MECHB001", "بكالوريوس الهندسة الميكانيكية", "Mechanical Engineering BSc", "MECHB", "بكالوريوس", "MECH", "FEN", 150, 120, 18, 12),
        ("ELECB001", "بكالوريوس الهندسة الكهربائية", "Electrical Engineering BSc", "ELECB", "بكالوريوس", "ELEC", "FEN", 150, 120, 18, 12),
    ])
    conn.commit()
    print("[PROGRAMS] Done.")

    # ── 5. Rooms ───────────────────────────────────────────────────────────────
    print("\n[ROOMS] Creating rooms...")
    rooms_data = []
    faculty_ids = ["FCAI", "FSC", "FEN"]
    room_types = ["lecture_hall", "lab", "lecture_hall"]
    for i in range(1, 16):
        rooms_data.append((
            f"R{i:03d}", f"R{i:03d}", f"قاعة {i}",
            room_types[i % 3], 50 + (i % 3) * 25,
            "available", faculty_ids[i % 3]
        ))
    execute_values(cur, """
        INSERT INTO rooms (id, code, name, room_type, capacity, status, faculty_id)
        VALUES %s ON CONFLICT DO NOTHING
    """, rooms_data)
    conn.commit()
    print(f"[ROOMS] Created {len(rooms_data)} rooms.")

    # ── 6. Courses ─────────────────────────────────────────────────────────────
    print("\n[COURSES] Creating courses...")
    # (id, name, name_en, level, dept, faculty_id, credit_hours, course_type)
    courses_data = [
        ("CS101", "مقدمة في البرمجة", "Introduction to Programming", 1, "CS", "FCAI", 3, "إجباري"),
        ("CS201", "هياكل البيانات", "Data Structures", 2, "CS", "FCAI", 3, "إجباري"),
        ("CS301", "قواعد البيانات", "Databases", 3, "CS", "FCAI", 3, "إجباري"),
        ("CS401", "شبكات الحاسب", "Computer Networks", 4, "CS", "FCAI", 3, "إجباري"),
        ("AI301", "أساسيات الذكاء الاصطناعي", "AI Fundamentals", 3, "AI", "FCAI", 3, "إجباري"),
        ("IS201", "تحليل نظم", "System Analysis", 2, "IS", "FCAI", 3, "إجباري"),
        ("IS301", "قواعد بيانات متقدمة", "Advanced Databases", 3, "IS", "FCAI", 3, "اختياري"),
        ("MATH101", "تفاضل وتكامل 1", "Calculus I", 1, "MATH", "FSC", 4, "إجباري"),
        ("MATH201", "جبر خطي", "Linear Algebra", 2, "MATH", "FSC", 3, "إجباري"),
        ("PHYS101", "فيزياء عامة 1", "General Physics I", 1, "PHYS", "FSC", 4, "إجباري"),
        ("PHYS201", "فيزياء كهرومغناطيسية", "Electromagnetic Physics", 2, "PHYS", "FSC", 3, "إجباري"),
        ("CHEM101", "كيمياء عامة", "General Chemistry", 1, "CHEM", "FSC", 4, "إجباري"),
        ("MECH101", "ميكانيكا هندسية", "Engineering Mechanics", 1, "MECH", "FEN", 3, "إجباري"),
        ("MECH201", "مقاومة المواد", "Strength of Materials", 2, "MECH", "FEN", 3, "إجباري"),
        ("ELEC101", "كهرباء أساسية", "Basic Electricity", 1, "ELEC", "FEN", 3, "إجباري"),
        ("ELEC201", "إلكترونيات", "Electronics", 2, "ELEC", "FEN", 3, "إجباري"),
        ("CIVIL101", "رسم هندسي", "Engineering Drawing", 1, "CIVIL", "FEN", 3, "إجباري"),
        ("CIVIL201", "ميكانيكا تربة", "Soil Mechanics", 3, "CIVIL", "FEN", 3, "إجباري"),
        ("GEN101", "اللغة الإنجليزية", "English Language", 1, "CS", "FCAI", 2, "متطلب جامعة"),
        ("GEN201", "حقوق إنسان", "Human Rights", 2, "CS", "FCAI", 2, "متطلب جامعة"),
    ]
    execute_values(cur, """
        INSERT INTO courses (id, name, name_en, level, department_id, faculty_id, credit_hours, course_type)
        VALUES %s ON CONFLICT DO NOTHING
    """, courses_data)
    conn.commit()
    print(f"[COURSES] Created {len(courses_data)} courses.")

    # ── 7. Students ────────────────────────────────────────────────────────────
    print("\n[STUDENTS] Creating students...")
    faculty_dept_map = {
        "FCAI": [("CS", "CSB001"), ("IS", "ISB001"), ("AI", "AIB001")],
        "FSC": [("MATH", "MATHB001"), ("PHYS", "MATHB001"), ("CHEM", "MATHB001")],
        "FEN": [("MECH", "MECHB001"), ("ELEC", "ELECB001"), ("CIVIL", "MECHB001")],
    }
    students_data = []
    student_ids = []
    counter = 2024001
    levels = [1, 2, 3, 4]
    statuses = ["نشط", "نشط", "نشط", "منقطع", "منسحب"]
    cities = ["دمياط", "القاهرة", "الإسكندرية", "المنصورة", "طنطا", "الزقازيق"]

    faculties = [("FCAI", 150), ("FSC", 100), ("FEN", 100)]
    for fac_id, count in faculties:
        for i in range(count):
            sid = str(counter)
            name = f"{random.choice(ARABIC_NAMES)} {random.choice(FAMILY_NAMES)}"
            dept_prog = random.choice(faculty_dept_map[fac_id])
            level = random.choice(levels)
            gpa = round(random.uniform(1.5, 4.0), 2)
            students_data.append((
                sid, name, f"{random.randint(10000000000000, 99999999999999)}",
                fac_id, dept_prog[0], level, "لائحة 2020", gpa,
                f"01{random.randint(0,2)}{random.randint(10000000, 99999999)}",
                f"{sid}@stud.du.edu.eg", random.choice(cities),
                random.choice(statuses), "مدفوع", None, None, "لم يتقدم", "نشط"
            ))
            student_ids.append((sid, fac_id, dept_prog[0]))
            counter += 1

    execute_values(cur, """
        INSERT INTO students (
            student_id, name, national_id, faculty_id, department_id, level,
            regulation, gpa, phone, email, city, status, fees_status,
            graduation_year, level_change_date, survey_status, id_card_status
        ) VALUES %s ON CONFLICT DO NOTHING
    """, students_data, page_size=100)
    conn.commit()
    print(f"[STUDENTS] Created {len(students_data)} students.")

    # ── 8. Users ───────────────────────────────────────────────────────────────
    print("\n[USERS] Creating users...")
    # Admin users first
    admin_users = [
        (str(uuid.uuid4()), "president", "president@du.edu.eg", HASH_ADMIN, "super_admin", None),
        (str(uuid.uuid4()), "affairs", "affairs@du.edu.eg", HASH_AFFAIRS, "student_affairs", None),
        (str(uuid.uuid4()), "super_admin", "superadmin@du.edu.eg", HASH_TEST1234, "super_admin", None),
        (str(uuid.uuid4()), "admin_fcai", "fcai@du.edu.eg", HASH_ADMIN, "faculty_admin", "FCAI"),
        (str(uuid.uuid4()), "admin_fsc", "fsc@du.edu.eg", HASH_TEST1234, "faculty_admin", "FSC"),
        (str(uuid.uuid4()), "admin_fen", "fen@du.edu.eg", HASH_TEST1234, "faculty_admin", "FEN"),
    ]
    execute_values(cur, """
        INSERT INTO users (id, username, email, hashed_password, role, faculty_id, is_active)
        VALUES %s ON CONFLICT (username) DO UPDATE SET
            hashed_password = EXCLUDED.hashed_password,
            role = EXCLUDED.role
    """, [(u[0], u[1], u[2], u[3], u[4], u[5], True) for u in admin_users])
    conn.commit()
    print(f"[USERS] Created {len(admin_users)} admin users.")

    # Student users in batches
    print("[USERS] Creating student users...")
    batch_size = 50
    total_student_users = 0
    for i in range(0, len(student_ids), batch_size):
        batch = student_ids[i:i+batch_size]
        user_rows = [(
            str(uuid.uuid4()),
            sid,
            f"{sid}@stud.du.edu.eg",
            HASH_TEST1234,
            "student",
            fac_id,
            True
        ) for sid, fac_id, dept_id in batch]
        execute_values(cur, """
            INSERT INTO users (id, username, email, hashed_password, role, faculty_id, is_active)
            VALUES %s ON CONFLICT (username) DO NOTHING
        """, user_rows)
        conn.commit()
        total_student_users += len(user_rows)
        print(f"  Batch {i//batch_size + 1}: {total_student_users}/{len(student_ids)} users created")
    print(f"[USERS] Created {total_student_users} student users.")

    # ── 9. Enrollments & Grades ────────────────────────────────────────────────
    print("\n[ENROLLMENTS] Creating enrollments and grades...")
    faculty_courses = {
        "FCAI": ["CS101", "CS201", "CS301", "AI301", "IS201", "GEN101", "GEN201"],
        "FSC": ["MATH101", "MATH201", "PHYS101", "CHEM101"],
        "FEN": ["MECH101", "MECH201", "ELEC101", "CIVIL101"],
    }
    semester = "خريف 2024"
    enrollments = []
    grades = []
    enroll_id = 1
    grade_statuses = ["ناجح", "ناجح", "ناجح", "راسب", "قيد المراجعة"]

    for sid, fac_id, dept_id in student_ids:
        courses = faculty_courses.get(fac_id, [])
        chosen = random.sample(courses, min(4, len(courses)))
        for course_id in chosen:
            enrollments.append((sid, course_id, fac_id, semester, "مقيد", datetime.now()))
            # Add grade for ~70% of enrollments
            if random.random() < 0.7:
                midterm = round(random.uniform(10, 30), 1)
                final_exam = round(random.uniform(30, 70), 1)
                total = midterm + final_exam
                status = "ناجح" if total >= 50 else "راسب"
                grades.append((
                    sid, course_id, semester, midterm, final_exam, total,
                    status, fac_id, round(random.uniform(5, 15), 1), round(random.uniform(5, 15), 1)
                ))

    # Insert in batches
    for i in range(0, len(enrollments), 100):
        batch = enrollments[i:i+100]
        execute_values(cur, """
            INSERT INTO enrollments (student_id, course_id, faculty_id, semester, status)
            VALUES %s ON CONFLICT DO NOTHING
        """, [(e[0], e[1], e[2], e[3], e[4]) for e in batch])
        conn.commit()
    print(f"[ENROLLMENTS] Created {len(enrollments)} enrollments.")

    for i in range(0, len(grades), 100):
        batch = grades[i:i+100]
        # grades tuple: (sid, course_id, semester, midterm, final_exam, total, status, fac_id, practical, oral)
        execute_values(cur, """
            INSERT INTO grades (
                student_id, course_id, semester, midterm, final_exam,
                total, grade_letter, faculty_id, practical, oral
            ) VALUES %s ON CONFLICT DO NOTHING
        """, [(g[0], g[1], g[2], g[3], g[4], g[5],
               'A' if g[5] >= 85 else ('B' if g[5] >= 75 else ('C' if g[5] >= 65 else ('D' if g[5] >= 50 else 'F'))),
               g[7], g[8], g[9]) for g in batch])
        conn.commit()
    print(f"[GRADES] Created {len(grades)} grades.")

    # ── 10. Financial Records ──────────────────────────────────────────────────
    print("\n[FINANCIAL] Creating financial records...")
    fee_types = ["رسوم دراسية", "رسوم تقديم", "غرامة تأخير", "رسوم رياضة"]
    financial_data = []
    for sid, fac_id, dept_id in student_ids[:200]:  # Only for first 200 students
        fee_type = random.choice(fee_types)
        amount = random.choice([500, 750, 1000, 1500, 2000])
        paid = random.choice([True, False])
        financial_data.append((
            sid, fac_id, fee_type, f"رسوم الفصل الدراسي الأول",
            amount, "مدفوع" if paid else "غير مدفوع", "2024-01-01"
        ))
    for i in range(0, len(financial_data), 100):
        execute_values(cur, """
            INSERT INTO financial_records (student_id, faculty_id, fee_type, description, amount, paid_amount, status, due_date, semester, academic_year)
            VALUES %s ON CONFLICT DO NOTHING
        """, [(f[0], f[1], f[2], f[3], f[4],
               f[4] if f[5] == "مدفوع" else 0,
               f[5], f[6], "خريف 2024", "2024/2025") for f in financial_data[i:i+100]])
        conn.commit()
    print(f"[FINANCIAL] Created {len(financial_data)} records.")

    # ── 11. Update faculty student counts ──────────────────────────────────────
    print("\n[UPDATE] Updating faculty student counts...")
    cur.execute("""
        UPDATE faculties SET student_count = (
            SELECT COUNT(*) FROM students WHERE students.faculty_id = faculties.id
        )
    """)
    conn.commit()

    # ── 12. Summary ────────────────────────────────────────────────────────────
    print("\n" + "="*50)
    for table in ["faculties", "departments", "courses", "students", "users", "enrollments", "grades", "financial_records"]:
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        print(f"{table}: {cur.fetchone()[0]}")
    print("="*50)

    cur.close()
    conn.close()
    print("\n✅ Seeding complete!")

if __name__ == "__main__":
    seed_all()
