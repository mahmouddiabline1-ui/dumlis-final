"""
Seed script: add ~4550 real students to FCAI in Neon DB (total ~5000)
Run: python seed_5000_students.py
"""
import random
import psycopg2
from psycopg2.extras import execute_values

DB_URL = "postgresql://neondb_owner:npg_jMl0twWXuK1L@ep-misty-lab-ap5n33mq.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"

FIRST_NAMES = [
    "أحمد","محمد","علي","عمر","يوسف","إبراهيم","خالد","طارق","سامي","وليد",
    "عبدالله","عبدالرحمن","مصطفى","حسين","حسن","ياسر","نادر","رامي","كريم","ماهر",
    "فاطمة","مريم","نور","سارة","دينا","رنا","هبة","ندى","أسماء","منى",
    "ياسمين","شيماء","إيمان","نجلاء","هناء","رشا","غادة","سمر","لمياء","أميرة",
    "زياد","فادي","نبيل","عادل","جمال","سعيد","صلاح","مجدي","هاني","أشرف",
    "ريم","دعاء","نهى","إسراء","ميرنا","روان","لارا","مايا","جنى","تسنيم",
    "باسم","وائل","أيمن","عصام","شريف","تامر","إسلام","مروان","إياد","عمرو",
    "هدى","نيفين","سوسن","إيناس","مها","زينب","نسرين","سلمى","آية","رحمة",
]

LAST_NAMES = [
    "محمد","أحمد","علي","حسن","حسين","إبراهيم","عبدالله","عبدالعزيز","سالم","عمر",
    "خليل","إسماعيل","مصطفى","يوسف","عثمان","نصر","فؤاد","رضا","شوقي","منصور",
    "جابر","زيدان","عيسى","موسى","سليمان","صالح","درويش","حمدان","طاهر","شاهين",
    "البسيوني","الشامي","المصري","الجندي","السيد","الحسيني","الصغير","الكبير","البرعي","زغلول",
    "عبدالحميد","عبدالغفار","عبدالرازق","عبدالستار","عبدالمجيد","عبدالعال","عبدالمنعم","عبدالقادر","عبدالوهاب","عبدالفتاح",
    "بدوي","سعد","حنفي","رشاد","سرحان","عسل","ثروت","مكاوي","جلال","لطفي",
    "المهندس","النجار","الحداد","الزيات","البيطار","العطار","الخطيب","الشيخ","الطويل","القصير",
]

DEPARTMENTS = ["CS", "IS", "AI"]
DEPT_WEIGHTS = [40, 35, 25]

CITIES = ["القاهرة","الإسكندرية","دمياط","المنصورة","طنطا","الزقازيق","الإسماعيلية","السويس","بورسعيد",
          "المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","الفيوم","بني سويف","كفر الشيخ","دمنهور","شبين الكوم"]

STATUSES = (["مقيد"] * 80) + (["منتظم"] * 10) + (["موقوف"] * 5) + (["مفصول"] * 3) + (["متخرج"] * 2)
FEES_STATUSES = (["مسدد"] * 55) + (["غير مسدد"] * 45)
REGULATIONS = (["لائحة جديدة"] * 75) + (["لائحة قديمة"] * 25)


def gen_name():
    return f"{random.choice(FIRST_NAMES)} {random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"


def gen_national_id(used: set):
    while True:
        nid = f"2{random.randint(0,9)}{random.randint(10,12):02d}{random.randint(1,28):02d}" \
              f"{random.randint(1,31):02d}{random.randint(100000,999999)}"
        nid = nid[:14]
        if nid not in used:
            used.add(nid)
            return nid


def gen_phone():
    prefix = random.choice(["010","011","012","015"])
    return f"{prefix}{random.randint(10000000,99999999)}"


def gen_email(student_id):
    domains = ["gmail.com","yahoo.com","outlook.com","du.edu.eg","hotmail.com"]
    return f"s{student_id}@{random.choice(domains)}"


def build_ids():
    """Build list of ~4550 new student IDs for FCAI"""
    ids = []
    # years 2020-2023: 001-999 each
    for year in range(2020, 2024):
        for n in range(1, 1000):
            ids.append(f"{year}{n:03d}")
    # year 2024: 451-999 (existing go up to 450)
    for n in range(451, 1000):
        ids.append(f"2024{n:03d}")
    # year 2025: 001-005 to hit exactly ~5000
    for n in range(1, 6):
        ids.append(f"2025{n:03d}")
    return ids


def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    # Get existing IDs to avoid duplicates
    cur.execute("SELECT student_id FROM students WHERE faculty_id='FCAI'")
    existing = {r[0] for r in cur.fetchall()}
    print(f"Existing FCAI students: {len(existing)}")

    # Get existing national IDs
    cur.execute("SELECT national_id FROM students WHERE national_id IS NOT NULL")
    used_nids = {r[0] for r in cur.fetchall()}

    new_ids = [sid for sid in build_ids() if sid not in existing]
    print(f"Will insert: {len(new_ids)} new students")

    rows = []
    for sid in new_ids:
        year = int(sid[:4])
        # Level based on year (2024=1, 2023=2, 2022=3, 2021=4, 2020=4)
        level = max(1, min(4, 2025 - year))
        dept = random.choices(DEPARTMENTS, weights=DEPT_WEIGHTS)[0]
        gpa = round(random.uniform(1.5, 4.0), 2)
        rows.append((
            sid,
            gen_name(),
            gen_national_id(used_nids),
            "FCAI",
            dept,
            level,
            random.choice(REGULATIONS),
            gpa,
            gen_phone(),
            gen_email(sid),
            random.choice(CITIES),
            random.choice(STATUSES),
            random.choice(FEES_STATUSES),
        ))

    # Insert in batches of 500
    batch_size = 500
    total_inserted = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i+batch_size]
        execute_values(cur, """
            INSERT INTO students
                (student_id, name, national_id, faculty_id, department_id, level,
                 regulation, gpa, phone, email, city, status, fees_status)
            VALUES %s
            ON CONFLICT (student_id) DO NOTHING
        """, batch)
        conn.commit()
        total_inserted += len(batch)
        print(f"  Inserted batch {i//batch_size + 1}: {total_inserted}/{len(rows)}")

    cur.execute("SELECT count(*) FROM students WHERE faculty_id='FCAI'")
    final = cur.fetchone()[0]
    print(f"\nDone! Total FCAI students now: {final}")
    conn.close()


if __name__ == "__main__":
    main()
