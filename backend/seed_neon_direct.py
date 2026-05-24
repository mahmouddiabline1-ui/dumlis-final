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
    return psycopg2.connect(DB_URL, connect_timeout=30)

ARABIC_NAMES = ["محمد", "أحمد", "علي", "عمر", "يوسف", "خالد", "حسن", "إبراهيم", "عبدالله", "مصطفى",
                "فاطمة", "مريم", "نور", "سارة", "آية", "هدى", "رانيا", "دينا", "إيمان", "أسماء"]
FAMILY_NAMES = ["محمود", "أحمد", "السيد", "عبدالرحمن", "حسين", "عبدالله", "سليمان", "علي", "إبراهيم", "خالد"]

def fresh_conn():
    """Always return a brand-new connection (Neon drops idle connections quickly)."""
    c = connect()
    return c, c.cursor()

def seed_all():
    conn, cur = fresh_conn()
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
        "committees", "rooms", "staff", "fee_setup",
        "academic_calendar", "announcements", "system_settings",
        "course_prerequisites",
    ]
    for t in tables_to_clear:
        cur.execute(f"DELETE FROM {t}")
    # Delete non-admin users (keep existing admins if any)
    cur.execute("DELETE FROM users")
    # Update faculties (don't delete them)
    conn.commit()
    cur.close()
    conn.close()
    print("[CLEAR] Done.")

    # Fresh connection after the heavy DELETE work
    conn, cur = fresh_conn()
    print("Reconnected.")

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
        ("FED", "كلية التربية", "Faculty of Education", "📚", 0, 95, "#9933cc"),
        ("PHR", "كلية الصيدلة", "Faculty of Pharmacy", "💊", 0, 85, "#cc3300"),
        ("LAW", "كلية الحقوق", "Faculty of Law", "⚖️", 0, 70, "#996600"),
    ])
    conn.commit()
    cur.close(); conn.close(); conn, cur = fresh_conn()
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
        ("EDSC", "FED", "العلوم الأساسية", "Basic Sciences Education", "EDSC"),
        ("EDAR", "FED", "اللغة العربية", "Arabic Language Education", "EDAR"),
        ("PHAR", "PHR", "الصيدلة الإكلينيكية", "Clinical Pharmacy", "PHAR"),
        ("PHRB", "PHR", "الكيمياء الصيدلانية", "Pharmaceutical Chemistry", "PHRB"),
        ("LAWP", "LAW", "القانون العام", "Public Law", "LAWP"),
        ("LAWV", "LAW", "القانون الخاص", "Private Law", "LAWV"),
    ])
    conn.commit()
    cur.close(); conn.close(); conn, cur = fresh_conn()
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
        ("EDSB001", "بكالوريوس تربية علوم", "Education Science BSc", "EDSB", "بكالوريوس", "EDSC", "FED", 132, 100, 20, 12),
        ("EDARB001", "بكالوريوس تربية لغة عربية", "Education Arabic BSc", "EDARB", "بكالوريوس", "EDAR", "FED", 132, 100, 20, 12),
        ("PHARB001", "بكالوريوس صيدلة", "Pharmacy BSc", "PHARB", "بكالوريوس", "PHAR", "PHR", 150, 120, 18, 12),
        ("LAWB001", "بكالوريوس حقوق", "Law LLB", "LAWB", "بكالوريوس", "LAWP", "LAW", 132, 100, 20, 12),
    ])
    conn.commit()
    cur.close(); conn.close(); conn, cur = fresh_conn()
    print("[PROGRAMS] Done.")

    # ── 5. Rooms ───────────────────────────────────────────────────────────────
    print("\n[ROOMS] Creating rooms...")
    rooms_data = []
    all_faculty_ids = ["FCAI", "FSC", "FEN", "FED", "PHR", "LAW"]
    room_types = ["lecture_hall", "lab", "lecture_hall"]
    for i in range(1, 31):
        rooms_data.append((
            f"R{i:03d}", f"R{i:03d}", f"قاعة {i}",
            room_types[i % 3], 50 + (i % 3) * 25,
            "available", all_faculty_ids[i % 6]
        ))
    execute_values(cur, """
        INSERT INTO rooms (id, code, name, room_type, capacity, status, faculty_id)
        VALUES %s ON CONFLICT DO NOTHING
    """, rooms_data)
    conn.commit()
    cur.close(); conn.close(); conn, cur = fresh_conn()
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
        # FED courses
        ("ED101", "مقدمة في التربية", "Introduction to Education", 1, "EDSC", "FED", 3, "إجباري"),
        ("ED201", "علم النفس التربوي", "Educational Psychology", 2, "EDSC", "FED", 3, "إجباري"),
        ("ED301", "مناهج وطرق تدريس", "Curriculum and Teaching Methods", 3, "EDSC", "FED", 3, "إجباري"),
        ("AR101", "النحو والصرف", "Arabic Grammar", 1, "EDAR", "FED", 3, "إجباري"),
        ("AR201", "الأدب العربي", "Arabic Literature", 2, "EDAR", "FED", 3, "إجباري"),
        # PHR courses
        ("PH101", "الكيمياء العضوية الصيدلانية", "Pharmaceutical Organic Chemistry", 1, "PHAR", "PHR", 3, "إجباري"),
        ("PH201", "فارماكولوجي", "Pharmacology", 2, "PHAR", "PHR", 4, "إجباري"),
        ("PH301", "التكنولوجيا الصيدلانية", "Pharmaceutics Technology", 3, "PHAR", "PHR", 3, "إجباري"),
        # LAW courses
        ("LW101", "مقدمة في القانون", "Introduction to Law", 1, "LAWP", "LAW", 3, "إجباري"),
        ("LW201", "القانون المدني", "Civil Law", 2, "LAWP", "LAW", 3, "إجباري"),
        ("LW301", "القانون الدستوري", "Constitutional Law", 3, "LAWP", "LAW", 3, "إجباري"),
        ("LW401", "قانون الأعمال", "Business Law", 4, "LAWV", "LAW", 3, "اختياري"),
    ]
    execute_values(cur, """
        INSERT INTO courses (id, name, name_en, level, department_id, faculty_id, credit_hours, course_type)
        VALUES %s ON CONFLICT DO NOTHING
    """, courses_data)
    conn.commit()
    cur.close(); conn.close(); conn, cur = fresh_conn()
    print(f"[COURSES] Created {len(courses_data)} courses.")

    # ── 7. Students ────────────────────────────────────────────────────────────
    print("\n[STUDENTS] Creating students...")
    faculty_dept_map = {
        "FCAI": [("CS", "CSB001"), ("IS", "ISB001"), ("AI", "AIB001")],
        "FSC": [("MATH", "MATHB001"), ("PHYS", "MATHB001"), ("CHEM", "MATHB001")],
        "FEN": [("MECH", "MECHB001"), ("ELEC", "ELECB001"), ("CIVIL", "MECHB001")],
        "FED": [("EDSC", "EDSB001"), ("EDAR", "EDARB001")],
        "PHR": [("PHAR", "PHARB001"), ("PHRB", "PHARB001")],
        "LAW": [("LAWP", "LAWB001"), ("LAWV", "LAWB001")],
    }
    students_data = []
    student_ids = []
    counter = 2024001
    levels = [1, 2, 3, 4]
    statuses = ["نشط", "نشط", "نشط", "منقطع", "منسحب"]
    cities = ["دمياط", "القاهرة", "الإسكندرية", "المنصورة", "طنطا", "الزقازيق", "بورسعيد", "السويس", "أسيوط", "سوهاج"]

    faculties = [("FCAI", 450), ("FSC", 300), ("FEN", 300), ("FED", 250), ("PHR", 200), ("LAW", 200)]
    for fac_id, count in faculties:
        for i in range(count):
            sid = str(counter)
            name = f"{random.choice(ARABIC_NAMES)} {random.choice(FAMILY_NAMES)}"
            dept_prog = random.choice(faculty_dept_map[fac_id])
            level = random.choice(levels)
            gpa = round(random.uniform(1.5, 4.0), 2)
            students_data.append((
                sid, name, f"{random.randint(10000000000000, 99999999999999)}",
                fac_id, dept_prog[0], level, random.choice(["لائحة جديدة", "لائحة جديدة", "لائحة جديدة", "لائحة قديمة"]), gpa,
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
    cur.close(); conn.close(); conn, cur = fresh_conn()
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
        (str(uuid.uuid4()), "admin_fed", "fed@du.edu.eg", HASH_TEST1234, "faculty_admin", "FED"),
        (str(uuid.uuid4()), "admin_phr", "phr@du.edu.eg", HASH_TEST1234, "faculty_admin", "PHR"),
        (str(uuid.uuid4()), "admin_law", "law@du.edu.eg", HASH_TEST1234, "faculty_admin", "LAW"),
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
        "FSC": ["MATH101", "MATH201", "PHYS101", "CHEM101", "PHYS201"],
        "FEN": ["MECH101", "MECH201", "ELEC101", "ELEC201", "CIVIL101"],
        "FED": ["ED101", "ED201", "ED301", "AR101", "AR201"],
        "PHR": ["PH101", "PH201", "PH301"],
        "LAW": ["LW101", "LW201", "LW301", "LW401"],
    }
    semester = "2024-2025 خريف"
    enrollments = []
    grades = []
    enroll_id = 1
    grade_statuses = ["ناجح", "ناجح", "ناجح", "راسب", "قيد المراجعة"]

    for sid, fac_id, dept_id in student_ids:
        courses = faculty_courses.get(fac_id, [])
        chosen = random.sample(courses, min(4, len(courses)))
        for course_id in chosen:
            enrollments.append((sid, course_id, fac_id, semester, "مسجل", datetime.now()))
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
    for sid, fac_id, dept_id in student_ids[:600]:  # First 600 students
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

    seed_supplemental(conn)

    cur.close()
    conn.close()
    print("\nSeeding complete!")

def seed_supplemental(conn):
    """Seed all 22 tables left empty by seed_all(). Idempotent - checks before inserting."""
    cur = conn.cursor()

    def table_empty(t):
        cur.execute(f"SELECT COUNT(*) FROM {t}")
        return cur.fetchone()[0] == 0

    # ── 1. student_profiles ───────────────────────────────────────────────────
    if table_empty("student_profiles"):
        print("[SUPPLEMENTAL] student_profiles...")
        cur.execute("SELECT student_id FROM students ORDER BY student_id")
        sids = [r[0] for r in cur.fetchall()]
        genders = ["ذكر", "أنثى"]
        profiles = []
        for i, sid in enumerate(sids):
            birth_year = 2000 + (i % 6)
            profiles.append((
                str(uuid.uuid4()), sid,
                f"Student {sid}", f"{birth_year}-0{(i%9)+1}-15",
                random.choice(genders), "مصري"
            ))
        execute_values(cur, """
            INSERT INTO student_profiles (id, student_id, name_en, birth_date, gender, nationality)
            VALUES %s ON CONFLICT DO NOTHING
        """, profiles)
        conn.commit()
        print(f"  -> {len(profiles)} profiles")

    # ── 2. study_regulations ──────────────────────────────────────────────────
    if table_empty("study_regulations"):
        print("[SUPPLEMENTAL] study_regulations...")
        cur.execute("SELECT id FROM programs")
        prog_ids = [r[0] for r in cur.fetchall()]
        regs = [(f"REG{pid}", f"لائحة برنامج {pid}", pid, 100, 20, 12) for pid in prog_ids]
        execute_values(cur, """
            INSERT INTO study_regulations (id, name, program_id, mandatory_hours, elective_hours, university_requirements)
            VALUES %s ON CONFLICT DO NOTHING
        """, regs)
        conn.commit()
        print(f"  -> {len(regs)} regulations")

    # ── 3. academic_rules ─────────────────────────────────────────────────────
    if table_empty("academic_rules"):
        print("[SUPPLEMENTAL] academic_rules...")
        import json
        cur.execute("SELECT id FROM faculties")
        fac_ids = [r[0] for r in cur.fetchall()]
        rules = []
        for fid in fac_ids:
            rules_data = {"pass_gpa": 2.0, "max_absences_pct": 25, "probation_gpa": 1.5, "fail_threshold": 1.0}
            rules.append((f"RULE_{fid}", fid, f"قواعد كلية {fid}", json.dumps(rules_data)))
        execute_values(cur, """
            INSERT INTO academic_rules (id, faculty_id, rule_name, rules_data)
            VALUES %s ON CONFLICT DO NOTHING
        """, rules)
        conn.commit()
        print(f"  -> {len(rules)} rules")

    # ── 4. fee_setup ──────────────────────────────────────────────────────────
    if table_empty("fee_setup"):
        print("[SUPPLEMENTAL] fee_setup...")
        cur.execute("SELECT id FROM faculties")
        fac_ids = [r[0] for r in cur.fetchall()]
        fee_rows = []
        for fid in fac_ids:
            for level in ["الأول", "الثاني", "الثالث", "الرابع"]:
                for sem in ["خريف", "ربيع"]:
                    fee_rows.append((fid, "رسوم دراسية", level, 2500.00, sem, "2024/2025", "نشط"))
                    fee_rows.append((fid, "رسوم تقديم", level, 200.00, sem, "2024/2025", "نشط"))
        execute_values(cur, """
            INSERT INTO fee_setup (faculty_id, fee_type, level, amount, semester, academic_year, status)
            VALUES %s ON CONFLICT DO NOTHING
        """, fee_rows)
        conn.commit()
        print(f"  -> {len(fee_rows)} fee rows")

    # ── 5. system_settings ────────────────────────────────────────────────────
    if table_empty("system_settings"):
        print("[SUPPLEMENTAL] system_settings...")
        settings = [
            ("academic_year", "العام الدراسي", "2024/2025", "General", "العام الدراسي الحالي", "Active"),
            ("current_semester", "الفصل الدراسي الحالي", "خريف 2024", "General", "الفصل الدراسي الحالي", "Active"),
            ("registration_open", "حالة التسجيل", "true", "Registration", "هل التسجيل مفتوح", "Active"),
            ("max_courses_per_student", "الحد الأقصى للمقررات", "6", "Academic", "الحد الأقصى لعدد المقررات", "Active"),
            ("min_gpa_for_registration", "الحد الأدنى للمعدل", "1.5", "Academic", "الحد الأدنى للمعدل التراكمي", "Active"),
            ("absence_limit_pct", "نسبة الحضور المطلوبة", "75", "Academic", "النسبة المطلوبة للحضور", "Active"),
            ("exam_period_start", "بداية فترة الامتحانات", "2025-01-15", "Calendar", "تاريخ بداية الامتحانات", "Active"),
            ("exam_period_end", "نهاية فترة الامتحانات", "2025-02-15", "Calendar", "تاريخ نهاية الامتحانات", "Active"),
            ("university_name_ar", "اسم الجامعة بالعربية", "جامعة دمليس", "General", "اسم الجامعة بالعربية", "Active"),
            ("support_email", "البريد الإلكتروني للدعم", "support@dumlis.edu", "General", "بريد الدعم الفني", "Active"),
        ]
        execute_values(cur, """
            INSERT INTO system_settings (id, name, value, category, description, status)
            VALUES %s ON CONFLICT DO NOTHING
        """, settings)
        conn.commit()
        print(f"  -> {len(settings)} settings")

    # ── 6. academic_calendar ─────────────────────────────────────────────────
    if table_empty("academic_calendar"):
        print("[SUPPLEMENTAL] academic_calendar...")
        events = [
            (str(uuid.uuid4()), "بداية الفصل الدراسي الأول", "semester_start", "2024-09-01", "2024-09-01", "2024/2025"),
            (str(uuid.uuid4()), "آخر يوم لإضافة/حذف المقررات", "deadline", "2024-09-14", "2024-09-14", "2024/2025"),
            (str(uuid.uuid4()), "إجازة منتصف الفصل", "holiday", "2024-11-01", "2024-11-07", "2024/2025"),
            (str(uuid.uuid4()), "نهاية الفصل الدراسي الأول", "semester_end", "2024-12-31", "2024-12-31", "2024/2025"),
            (str(uuid.uuid4()), "امتحانات الفصل الدراسي الأول", "exam_period", "2025-01-10", "2025-01-30", "2024/2025"),
            (str(uuid.uuid4()), "بداية الفصل الدراسي الثاني", "semester_start", "2025-02-15", "2025-02-15", "2024/2025"),
            (str(uuid.uuid4()), "الإجازة الربيعية", "holiday", "2025-04-01", "2025-04-07", "2024/2025"),
            (str(uuid.uuid4()), "نهاية الفصل الدراسي الثاني", "semester_end", "2025-06-30", "2025-06-30", "2024/2025"),
            (str(uuid.uuid4()), "امتحانات الفصل الدراسي الثاني", "exam_period", "2025-07-10", "2025-07-30", "2024/2025"),
        ]
        execute_values(cur, """
            INSERT INTO academic_calendar (id, event_name, event_type, start_date, end_date, academic_year)
            VALUES %s ON CONFLICT DO NOTHING
        """, events)
        conn.commit()
        print(f"  -> {len(events)} calendar events")

    # ── 7. announcements ─────────────────────────────────────────────────────
    if table_empty("announcements"):
        print("[SUPPLEMENTAL] announcements...")
        announcements = [
            (str(uuid.uuid4()), "بدء التسجيل الأكاديمي للفصل الثاني", "يُعلن مكتب شؤون الطلاب عن فتح باب التسجيل الأكاديمي للفصل الدراسي الثاني 2024/2025 اعتباراً من 15 فبراير 2025.", None, "مهم", True),
            (str(uuid.uuid4()), "جدول امتحانات الفصل الأول", "تم نشر جدول امتحانات الفصل الدراسي الأول. يرجى مراجعة الجدول على البوابة الإلكترونية.", None, "عادي", True),
            (str(uuid.uuid4()), "تحديث بيانات الطلاب", "يرجى من جميع الطلاب تحديث بياناتهم الشخصية وبيانات ولي الأمر قبل نهاية الفصل الدراسي.", None, "عاجل", True),
            (str(uuid.uuid4()), "إغلاق البوابة للصيانة", "ستكون البوابة الإلكترونية متوقفة عن العمل يوم الجمعة من 12 ليلاً حتى 6 صباحاً لأعمال الصيانة.", None, "عادي", True),
            (str(uuid.uuid4()), "نتائج الفصل الدراسي الأول", "تم رفع نتائج الفصل الدراسي الأول على البوابة الإلكترونية. يمكن للطلاب مراجعة نتائجهم الآن.", None, "مهم", True),
        ]
        execute_values(cur, """
            INSERT INTO announcements (id, title, body, faculty_id, priority, is_active)
            VALUES %s ON CONFLICT DO NOTHING
        """, announcements)
        conn.commit()
        print(f"  -> {len(announcements)} announcements")

    # ── 8. staff ─────────────────────────────────────────────────────────────
    if table_empty("staff"):
        print("[SUPPLEMENTAL] staff...")
        cur.execute("SELECT id, id FROM faculties")
        faculties = cur.fetchall()
        cur.execute("SELECT id, faculty_id FROM departments ORDER BY faculty_id")
        dept_rows = cur.fetchall()
        dept_by_fac = {}
        for did, fid in dept_rows:
            dept_by_fac.setdefault(fid, []).append(did)

        titles = ["أستاذ دكتور", "أستاذ مساعد", "مدرس", "معيد", "محاضر"]
        first_names = ["محمد", "أحمد", "علي", "خالد", "عمر", "سارة", "نور", "هدى", "رانيا", "دينا"]
        last_names = ["السيد", "محمود", "عبدالله", "حسين", "إبراهيم", "علي", "خالد", "أحمد"]
        staff_rows = []
        staff_idx = 1
        for fid, _ in faculties:
            depts = dept_by_fac.get(fid, [None])
            for dept in depts[:3]:
                for j in range(2):
                    name = f"{random.choice(first_names)} {random.choice(last_names)}"
                    staff_id = f"STF{staff_idx:04d}"
                    staff_rows.append((
                        staff_id, name, f"staff{staff_idx}@dumlis.edu",
                        f"01{random.randint(0,2)}{random.randint(10000000,99999999)}",
                        fid, dept, random.choice(["علوم الحاسب", "الرياضيات", "الفيزياء", "الهندسة"]),
                        random.choice(titles), f"مبنى {random.randint(1,5)} - مكتب {random.randint(100,999)}", "فعال"
                    ))
                    staff_idx += 1
        execute_values(cur, """
            INSERT INTO staff (id, name, email, phone, faculty_id, department_id, specialization, title, office_location, status)
            VALUES %s ON CONFLICT DO NOTHING
        """, staff_rows)
        conn.commit()
        print(f"  -> {len(staff_rows)} staff")

    # ── 9. survey_rules ──────────────────────────────────────────────────────
    if table_empty("survey_rules"):
        print("[SUPPLEMENTAL] survey_rules...")
        cur.execute("SELECT id FROM faculties")
        fac_ids = [r[0] for r in cur.fetchall()]
        survey_rows = []
        for fid in fac_ids:
            survey_rows.append((
                str(uuid.uuid4()), f"SRV_{fid}_{uuid.uuid4().hex[:6]}",
                f"استبيان تقييم الخدمات الأكاديمية - كلية {fid}",
                fid, "طلاب", "2024-09-01", "2025-06-30", "نشط"
            ))
        execute_values(cur, """
            INSERT INTO survey_rules (id, code, name, faculty_id, target, start_date, end_date, status)
            VALUES %s ON CONFLICT DO NOTHING
        """, survey_rows)
        conn.commit()
        print(f"  -> {len(survey_rows)} survey rules")

    # ── 10. report_signatures ────────────────────────────────────────────────
    if table_empty("report_signatures"):
        print("[SUPPLEMENTAL] report_signatures...")
        sigs = [
            ("SIG001", None, "كشوف الدرجات", "د. أحمد محمود", "رئيس مجلس القسم", 1, True),
            ("SIG002", None, "كشوف الدرجات", "أ.د. محمد السيد", "وكيل الكلية لشؤون التعليم والطلاب", 2, True),
            ("SIG003", None, "تقرير الحضور والغياب", "د. علي حسين", "رئيس قسم شؤون الطلاب", 1, True),
            ("SIG004", None, "تقرير الحضور والغياب", "أ.د. محمد السيد", "وكيل الكلية لشؤون التعليم والطلاب", 2, True),
            ("SIG005", None, "قوائم الطلاب", "أ.د. خالد عبدالله", "عميد الكلية", 3, True),
        ]
        execute_values(cur, """
            INSERT INTO report_signatures (id, faculty_id, report_name, signatory_name, title, "order", is_active)
            VALUES %s ON CONFLICT DO NOTHING
        """, sigs)
        conn.commit()
        print(f"  -> {len(sigs)} report signatures")

    # ── 11. course_schedules ─────────────────────────────────────────────────
    if table_empty("course_schedules"):
        print("[SUPPLEMENTAL] course_schedules...")
        cur.execute("SELECT id, faculty_id FROM courses")
        courses = cur.fetchall()
        cur.execute("SELECT id FROM rooms LIMIT 10")
        room_ids = [r[0] for r in cur.fetchall()]
        days = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء"]
        times = [("08:00", "10:00"), ("10:00", "12:00"), ("12:00", "14:00"), ("14:00", "16:00")]
        schedule_rows = []
        for cid, fid in courses:
            t = random.choice(times)
            schedule_rows.append((
                fid, cid, random.choice(room_ids) if room_ids else None,
                "محاضرة", random.choice(days),
                t[0], t[1], random.choice(["د. محمد أحمد", "د. علي حسن", "أ.د. خالد محمود"]),
                "خريف 2024"
            ))
            t2 = random.choice(times)
            schedule_rows.append((
                fid, cid, random.choice(room_ids) if room_ids else None,
                "تطبيقي", random.choice(days),
                t2[0], t2[1], random.choice(["م. أحمد السيد", "م. سارة علي"]),
                "خريف 2024"
            ))
        execute_values(cur, """
            INSERT INTO course_schedules (faculty_id, course_id, room_id, session_type, day, time_start, time_end, instructor, semester, enrolled_count)
            VALUES %s ON CONFLICT DO NOTHING
        """, [(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], 0) for r in schedule_rows])
        conn.commit()
        print(f"  -> {len(schedule_rows)} schedule rows")

    # ── 12. committees ────────────────────────────────────────────────────────
    if table_empty("committees"):
        print("[SUPPLEMENTAL] committees...")
        cur.execute("SELECT id FROM rooms LIMIT 6")
        room_ids = [r[0] for r in cur.fetchall()]
        if not room_ids:
            print("  -> skipped (no rooms)")
        else:
            cur.execute("SELECT id FROM faculties")
            fac_ids = [r[0] for r in cur.fetchall()]
            committees = []
            idx = 1
            for fid in fac_ids:
                for i in range(2):
                    rid = room_ids[(idx - 1) % len(room_ids)]
                    committees.append((
                        fid, f"لجنة امتحانات {idx}", rid, 30,
                        "2025-01-20", "09:00", f"د. {random.choice(['محمد','أحمد','علي'])} {random.choice(['السيد','محمود','حسين'])}",
                        "active", "خريف 2024"
                    ))
                    idx += 1
            execute_values(cur, """
                INSERT INTO committees (faculty_id, name, room_id, capacity, assigned_students, exam_date, exam_time, supervisor, status, semester)
                VALUES %s ON CONFLICT DO NOTHING
            """, [(r[0], r[1], r[2], r[3], 0, r[4], r[5], r[6], r[7], r[8]) for r in committees])
            conn.commit()
            print(f"  -> {len(committees)} committees")

    # ── 13. student_committee_assignments ─────────────────────────────────────
    if table_empty("student_committee_assignments"):
        print("[SUPPLEMENTAL] student_committee_assignments...")
        cur.execute("SELECT id FROM committees ORDER BY id")
        comm_ids = [r[0] for r in cur.fetchall()]
        if comm_ids:
            cur.execute("SELECT student_id FROM students ORDER BY student_id LIMIT 60")
            sids = [r[0] for r in cur.fetchall()]
            assignments = []
            for i, sid in enumerate(sids):
                cid = comm_ids[i % len(comm_ids)]
                assignments.append((sid, cid, f"A{i+1:03d}"))
            execute_values(cur, """
                INSERT INTO student_committee_assignments (student_id, committee_id, seat_number)
                VALUES %s ON CONFLICT DO NOTHING
            """, assignments)
            conn.commit()
            print(f"  -> {len(assignments)} assignments")

    # ── 14. attendance_records ────────────────────────────────────────────────
    if table_empty("attendance_records"):
        print("[SUPPLEMENTAL] attendance_records (sample)...")
        cur.execute("SELECT student_id, course_id, faculty_id FROM enrollments LIMIT 500")
        enrolls = cur.fetchall()
        statuses = ["حاضر", "حاضر", "حاضر", "غائب", "متأخر"]
        base_date = date(2024, 10, 1)
        att_rows = []
        for sid, cid, fid in enrolls:
            att_rows.append((fid, sid, cid, str(base_date + timedelta(days=random.randint(0, 60))), random.choice(statuses), "محاضرة"))
        execute_values(cur, """
            INSERT INTO attendance_records (faculty_id, student_id, course_id, attendance_date, status, session_type)
            VALUES %s ON CONFLICT DO NOTHING
        """, att_rows)
        conn.commit()
        print(f"  -> {len(att_rows)} attendance records")

    # ── 15. registration_requests ────────────────────────────────────────────
    if table_empty("registration_requests"):
        print("[SUPPLEMENTAL] registration_requests...")
        cur.execute("SELECT student_id, faculty_id FROM students ORDER BY student_id LIMIT 8")
        students = cur.fetchall()
        statuses = ["قيد المراجعة", "مقبول", "مرفوض"]
        req_rows = []
        for i, (sid, fid) in enumerate(students):
            req_rows.append((f"REQ{i+1:04d}", fid, sid, random.choice(statuses), "طلب تسجيل إضافي"))
        execute_values(cur, """
            INSERT INTO registration_requests (id, faculty_id, student_id, status, comment)
            VALUES %s ON CONFLICT DO NOTHING
        """, req_rows)
        conn.commit()
        print(f"  -> {len(req_rows)} registration requests")

    # ── 16. course_closures ──────────────────────────────────────────────────
    if table_empty("course_closures"):
        print("[SUPPLEMENTAL] course_closures...")
        cur.execute("SELECT id, faculty_id FROM courses LIMIT 5")
        courses = cur.fetchall()
        closures = []
        for cid, fid in courses:
            closures.append((fid, cid, "2024/2025", "خريف 2024", "2024-12-31", "مكتمل"))
        execute_values(cur, """
            INSERT INTO course_closures (faculty_id, course_code, academic_year, semester, closure_date, status)
            VALUES %s ON CONFLICT DO NOTHING
        """, closures)
        conn.commit()
        print(f"  -> {len(closures)} course closures")

    # ── 17. course_equivalences ──────────────────────────────────────────────
    if table_empty("course_equivalences"):
        print("[SUPPLEMENTAL] course_equivalences...")
        cur.execute("SELECT id FROM courses ORDER BY id LIMIT 4")
        cids = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT student_id FROM students ORDER BY student_id LIMIT 3")
        sids = [r[0] for r in cur.fetchall()]
        if len(cids) >= 2:
            equivs = [(sids[i % len(sids)], cids[i % len(cids)], cids[(i+1) % len(cids)], "قيد المراجعة") for i in range(3)]
            execute_values(cur, """
                INSERT INTO course_equivalences (student_id, original_course_id, equivalent_course_id, status)
                VALUES %s ON CONFLICT DO NOTHING
            """, equivs)
            conn.commit()
            print(f"  -> {len(equivs)} course equivalences")

    # ── 18. course_prerequisites ─────────────────────────────────────────────
    if table_empty("course_prerequisites"):
        print("[SUPPLEMENTAL] course_prerequisites...")
        cur.execute("SELECT id FROM courses WHERE id LIKE 'CS%' ORDER BY id LIMIT 4")
        cs_courses = [r[0] for r in cur.fetchall()]
        prereqs = []
        for i in range(1, len(cs_courses)):
            prereqs.append((cs_courses[i], cs_courses[i-1]))
        if prereqs:
            execute_values(cur, """
                INSERT INTO course_prerequisites (course_id, prerequisite_id) VALUES %s ON CONFLICT DO NOTHING
            """, prereqs)
            conn.commit()
            print(f"  -> {len(prereqs)} prerequisites")

    # ── 19. activity_log ──────────────────────────────────────────────────────
    if table_empty("activity_log"):
        print("[SUPPLEMENTAL] activity_log...")
        cur.execute("SELECT id FROM faculties")
        fac_ids = [r[0] for r in cur.fetchall()]
        logs = [
            (fac_ids[0] if fac_ids else None, "student", "CREATE", "تسجيل طالب جديد"),
            (fac_ids[0] if fac_ids else None, "enrollment", "CREATE", "تسجيل مقرر دراسي"),
            (fac_ids[0] if fac_ids else None, "grade", "UPDATE", "تعديل درجة طالب"),
            (fac_ids[0] if fac_ids else None, "financial", "CREATE", "إضافة سجل مالي"),
            (fac_ids[1] if len(fac_ids) > 1 else None, "student", "UPDATE", "تعديل بيانات طالب"),
            (fac_ids[1] if len(fac_ids) > 1 else None, "course", "CREATE", "إضافة مقرر جديد"),
            (fac_ids[2] if len(fac_ids) > 2 else None, "attendance", "CREATE", "تسجيل حضور طلاب"),
            (fac_ids[2] if len(fac_ids) > 2 else None, "registration", "APPROVE", "قبول طلب تسجيل"),
            (None, "system", "LOGIN", "تسجيل دخول مسؤول النظام"),
            (None, "system", "EXPORT", "تصدير تقرير الطلاب"),
            (None, "student", "DELETE", "حذف بيانات طالب قديم"),
            (None, "fee", "CREATE", "إعداد رسوم الفصل الدراسي"),
        ]
        execute_values(cur, """
            INSERT INTO activity_log (faculty_id, entity_type, action, description)
            VALUES %s ON CONFLICT DO NOTHING
        """, logs)
        conn.commit()
        print(f"  -> {len(logs)} activity log entries")

    # ── 20. student_requirements ─────────────────────────────────────────────
    if table_empty("student_requirements"):
        print("[SUPPLEMENTAL] student_requirements...")
        cur.execute("SELECT student_id FROM students ORDER BY student_id LIMIT 30")
        sids = [r[0] for r in cur.fetchall()]
        req_keys = ["photo", "national_id_copy", "birth_certificate", "high_school_cert", "military_status"]
        req_statuses = ["pending", "submitted", "verified"]
        req_rows = []
        for sid in sids:
            for key in req_keys:
                req_rows.append((sid, key, random.choice(req_statuses)))
        execute_values(cur, """
            INSERT INTO student_requirements (student_id, requirement_key, status)
            VALUES %s ON CONFLICT DO NOTHING
        """, req_rows)
        conn.commit()
        print(f"  -> {len(req_rows)} student requirements")

    # ── 21. student_blocks (a few sample blocks) ──────────────────────────────
    if table_empty("student_blocks"):
        print("[SUPPLEMENTAL] student_blocks...")
        cur.execute("SELECT student_id, faculty_id FROM students ORDER BY student_id LIMIT 3")
        students = cur.fetchall()
        blocks = [(fid, sid, "رسوم دراسية غير مسددة", "2024-10-01", "محجوب") for sid, fid in students]
        execute_values(cur, """
            INSERT INTO student_blocks (faculty_id, student_id, reason, block_date, status)
            VALUES %s ON CONFLICT DO NOTHING
        """, blocks)
        conn.commit()
        print(f"  -> {len(blocks)} student blocks")

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n[SUPPLEMENTAL] Final table counts:")
    supplemental_tables = [
        "student_profiles", "study_regulations", "academic_rules", "fee_setup",
        "system_settings", "academic_calendar", "announcements", "staff",
        "survey_rules", "report_signatures", "course_schedules", "committees",
        "student_committee_assignments", "attendance_records", "registration_requests",
        "course_closures", "course_equivalences", "course_prerequisites",
        "activity_log", "student_requirements", "student_blocks"
    ]
    for t in supplemental_tables:
        cur.execute(f"SELECT COUNT(*) FROM {t}")
        print(f"  {t}: {cur.fetchone()[0]}")

    cur.close()

if __name__ == "__main__":
    seed_all()
