import sys
import random
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()
from app.database import DATABASE_URL
from app.models import Department, Student

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def generate_random_student(faculty_id: str, index: int, level_index: int, regulation: str):
    FIRST_NAMES = ['أحمد','محمد','محمود','علي','عمر','إبراهيم','يوسف','خالد','حسن','حسين', 'سارة','مريم','نور','منى','هدى','فاطمة']
    MIDDLE_NAMES = ['محمد','أحمد','علي','حسن','إبراهيم','السيد','عبدالله','محمود','عثمان','سليم']
    LAST_NAMES = ['محمد','أحمد','علي','حسن','إبراهيم','السيد','عبدالله','النجار','الشريف','المصري']
    CITIES = ['دمياط','المنصورة','بورسعيد','القاهرة','الإسكندرية']
    
    rng = random.Random(index + 2000)
    first = rng.choice(FIRST_NAMES)
    middle = rng.choice(MIDDLE_NAMES)
    third = rng.choice(MIDDLE_NAMES)
    last = rng.choice(LAST_NAMES)
    fullName = f"{first} {middle} {third} {last}"

    admissionYear = 2021 - level_index if regulation == 'لائحة قديمة' else 2024 - level_index
    student_id = f"{admissionYear}{str(index).zfill(4)}"
    gpaBase = 2.0 + rng.random() * 1.8
    gpa = round(gpaBase + (rng.random() * 0.7 if rng.random() > 0.7 else 0), 2)
    
    status = 'مقيد'
    fees = 'مسدد' if rng.random() > 0.15 else 'غير مسدد'
    city = rng.choice(CITIES)

    birthYear = admissionYear - (18 + rng.randint(0, 4))
    nat_id = f"3{str(birthYear)[-2:]}{str(rng.randint(1,12)).zfill(2)}{str(rng.randint(1,28)).zfill(2)}{str(index).zfill(6)}"

    dept_id = f"{faculty_id}_GEN"
    phone = f"010{rng.randint(10000000, 99999999)}"
    email = f"s.{student_id}@stud.du.edu.eg"

    return {
        "student_id":    student_id,
        "name":          fullName,
        "national_id":   nat_id,
        "faculty_id":    faculty_id,
        "department_id": dept_id,
        "level":         level_index + 1,
        "regulation":    regulation,
        "gpa":           gpa,
        "phone":         phone,
        "email":         email,
        "city":          city,
        "status":        status,
        "fees_status":   fees,
    }

with SessionLocal() as session:
    print("Seeding missing departments and students...")
    missing_facs = [
        {"id": "MED_GEN", "faculty_id": "MED", "name": "قسم الطب العام", "code": "GEN"},
        {"id": "PHR_GEN", "faculty_id": "PHR", "name": "قسم الصيدلة العام", "code": "GEN"},
        {"id": "LAW_GEN", "faculty_id": "LAW", "name": "قسم الحقوق العام", "code": "GEN"},
        {"id": "ART_GEN", "faculty_id": "ART", "name": "قسم الآداب العام", "code": "GEN"},
        {"id": "AGR_GEN", "faculty_id": "AGR", "name": "قسم الزراعة العام", "code": "GEN"},
        {"id": "NRS_GEN", "faculty_id": "NRS", "name": "قسم التمريض العام", "code": "GEN"}
    ]

    for d in missing_facs:
        if not session.query(Department).filter_by(id=d["id"]).first():
            session.add(Department(**d))
            print(f"Added dept: {d['id']}")
    session.commit()

    students = []
    
    old_missing = [('MED', 50000), ('PHR', 51000), ('LAW', 52000), ('ART', 53000), ('AGR', 54000), ('NRS', 55000)]
    for fac_id, start_idx in old_missing:
        # Avoid creating duplicate students if they already exist
        exists = session.query(Student).filter_by(faculty_id=fac_id).count()
        if exists > 0:
            print(f"Students already exist for {fac_id}, skipping...")
            continue
            
        for i in range(175):
            students.append(generate_random_student(fac_id, start_idx + i, random.randint(0,3), 'لائحة قديمة'))

    new_missing = [('MED', 60000), ('PHR', 61000), ('LAW', 62000), ('ART', 63000), ('AGR', 64000), ('NRS', 65000)]
    for fac_id, start_idx in new_missing:
        exists = session.query(Student).filter_by(faculty_id=fac_id).count()
        if exists >= 250:
            continue
            
        for i in range(125):
            students.append(generate_random_student(fac_id, start_idx + i, 0, 'لائحة جديدة'))
        for i in range(125):
            students.append(generate_random_student(fac_id, start_idx + 125 + i, 1, 'لائحة جديدة'))

    if students:
        db_students = [Student(**s) for s in students]
        session.bulk_save_objects(db_students)
        session.commit()
        print(f"Successfully added {len(students)} missing students!")
    else:
        print("No students needed to be added.")
