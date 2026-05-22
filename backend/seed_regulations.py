"""
Seed StudyRegulations for all programs
"""
import uuid
from app.database import SessionLocal
from app import models

db = SessionLocal()

print("Creating StudyRegulations for all Programs...")

programs = db.query(models.AcademicProgram).all()
created = 0

for prog in programs:
    # Check if regulation already exists
    existing = db.query(models.StudyRegulation).filter(
        models.StudyRegulation.program_id == prog.id
    ).first()

    if not existing:
        regulation = models.StudyRegulation(
            id=f"{prog.id}_REG_{uuid.uuid4().hex[:8]}",
            name=f"Regulation for {prog.name}",
            program_id=prog.id,
            registration_rules="Standard registration rules apply",
            pass_fail_rules="Grades >= 60% are passing",
            absence_policy="Maximum 25% absence allowed",
            mandatory_hours=120,
            elective_hours=20,
            university_requirements=0
        )
        db.add(regulation)
        created += 1

db.commit()
print(f"Created {created} StudyRegulations")

# Verify
total_regs = db.query(models.StudyRegulation).count()
print(f"Total StudyRegulations in DB: {total_regs}")

db.close()
