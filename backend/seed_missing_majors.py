from sqlalchemy import select

from app.database import SessionLocal
from app.models import AcademicProgram, Department


MAJOR_BLUEPRINTS = [
    # faculty_id, preferred_department_id, program_id, code, name
    ("FCAI", "CS", "PROG_FCAI_CS", "CS", "Computer Science"),
    ("COM", "COM_GEN", "PROG_COM_BA", "BA", "Business Administration"),
    ("ENG", "ENG_GEN", "PROG_ENG_CIV", "CIV", "Civil Engineering"),
    ("MED", "MED_GEN", "PROG_MED_GM", "MBBCH", "General Medicine"),
    ("PHR", "PHR_GEN", "PROG_PHR_PHARMD", "PHARMD", "PharmD Clinical Pharmacy"),
    ("SCI", "SCI_GEN", "PROG_SCI_CHEM", "CHEM", "Chemistry"),
    ("LAW", "LAW_GEN", "PROG_LAW_GEN", "LAW", "General Law"),
    ("EDU", "EDU_GEN", "PROG_EDU_BASIC", "BED", "Basic Education"),
    ("NRS", "NRS_GEN", "PROG_NRS_GEN", "NRS", "General Nursing"),
    ("AGR", "AGR_GEN", "PROG_AGR_FST", "FST", "Food Science and Technology"),
    ("ART", "ART_GEN", "PROG_ART_ENG", "ENG-LIT", "English Literature"),
]


def resolve_department_id(db, faculty_id: str, preferred_department_id: str) -> str | None:
    preferred = db.scalar(
        select(Department).where(
            Department.id == preferred_department_id,
            Department.faculty_id == faculty_id,
        )
    )
    if preferred:
        return preferred.id

    fallback = db.scalar(
        select(Department).where(Department.faculty_id == faculty_id).order_by(Department.id)
    )
    return fallback.id if fallback else None


def main() -> None:
    db = SessionLocal()
    created = 0
    skipped = 0
    try:
        for faculty_id, preferred_dept, program_id, code, name in MAJOR_BLUEPRINTS:
            existing_program = db.scalar(select(AcademicProgram).where(AcademicProgram.id == program_id))
            if existing_program:
                skipped += 1
                print(f"SKIP existing: {program_id}")
                continue

            department_id = resolve_department_id(db, faculty_id, preferred_dept)
            if not department_id:
                skipped += 1
                print(f"SKIP no department for faculty: {faculty_id}")
                continue

            program = AcademicProgram(
                id=program_id,
                name=name,
                name_en=name,
                code=code,
                degree="Bachelor",
                department_id=department_id,
                faculty_id=faculty_id,
                total_hours=140,
                mandatory_hours=112,
                elective_hours=20,
                university_requirements=8,
                tracks=None,
            )
            db.add(program)
            created += 1
            print(f"ADD {program_id} -> faculty={faculty_id}, department={department_id}")

        db.commit()
        print(f"DONE created={created} skipped={skipped}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
