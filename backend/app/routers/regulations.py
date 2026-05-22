from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter(tags=["Study Regulations"])

@router.get("/")
def list_regulations(
    program_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    _: models.User = Depends(get_current_user),
):
    """List study regulations with program details."""
    q = db.query(models.StudyRegulation, models.AcademicProgram).join(
        models.AcademicProgram, models.StudyRegulation.program_id == models.AcademicProgram.id
    )

    if scoped_faculty_id:
        q = q.filter(models.AcademicProgram.faculty_id == scoped_faculty_id)

    if program_id:
        q = q.filter(models.StudyRegulation.program_id == program_id)

    rows = q.all()

    return [
        {
            'id': reg.id,
            'name': reg.name,
            'program_id': reg.program_id,
            'program_name': prog.name if prog else reg.program_id,
            'faculty_id': prog.faculty_id if prog else None,
            'registration_rules': reg.registration_rules or '',
            'pass_fail_rules': reg.pass_fail_rules or '',
            'absence_policy': reg.absence_policy or '',
            'mandatory_hours': reg.mandatory_hours or 0,
            'elective_hours': reg.elective_hours or 0,
            'university_requirements': reg.university_requirements or 0,
            'created_at': reg.created_at.isoformat() if reg.created_at else None,
        }
        for reg, prog in rows
    ]

@router.get("/{regulation_id}")
def get_regulation(
    regulation_id: str, 
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id)
):
    """Get a single regulation by ID, ensuring it belongs to user's faculty."""
    q = db.query(models.StudyRegulation).filter(models.StudyRegulation.id == regulation_id)
    if scoped_faculty_id:
        q = q.join(models.StudyRegulation.program).filter(models.AcademicProgram.faculty_id == scoped_faculty_id)
        
    regulation = q.first()
    if not regulation:
        raise HTTPException(status_code=404, detail="Regulation not found or access denied")
    return regulation

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_regulation(
    data: schemas.StudyRegulationCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Create a new regulation within the user's faculty."""
    # Verify program belongs to faculty
    program = db.query(models.AcademicProgram).filter(models.AcademicProgram.id == data.program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Academic program not found")

    if scoped_faculty_id and program.faculty_id != scoped_faculty_id:
        raise HTTPException(status_code=403, detail="Access denied to this program's faculty")

    if db.query(models.StudyRegulation).filter(models.StudyRegulation.id == data.id).first():
        raise HTTPException(status_code=409, detail="Regulation with this ID already exists")

    regulation = models.StudyRegulation(**data.model_dump())
    db.add(regulation)
    db.commit()
    db.refresh(regulation)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="study_regulation",
        entity_id=str(regulation.id),
        action="create",
        description=f"Created study regulation: {data.name}"
    )

    return regulation

@router.put("/{regulation_id}")
def update_regulation(
    regulation_id: str,
    data: schemas.StudyRegulationUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Update a regulation within the user's faculty."""
    q = db.query(models.StudyRegulation).filter(models.StudyRegulation.id == regulation_id)
    if scoped_faculty_id:
        q = q.join(models.StudyRegulation.program).filter(models.AcademicProgram.faculty_id == scoped_faculty_id)

    regulation = q.first()
    if not regulation:
        raise HTTPException(status_code=404, detail="Regulation not found or access denied")

    for key, value in data.model_dump(exclude_none=True).items():
        setattr(regulation, key, value)
    db.commit()
    db.refresh(regulation)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="study_regulation",
        entity_id=str(regulation_id),
        action="update",
        description="Updated study regulation"
    )

    return regulation

@router.delete("/{regulation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_regulation(
    regulation_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Delete a regulation within the user's faculty."""
    q = db.query(models.StudyRegulation).filter(models.StudyRegulation.id == regulation_id)
    if scoped_faculty_id:
        q = q.join(models.StudyRegulation.program).filter(models.AcademicProgram.faculty_id == scoped_faculty_id)

    regulation = q.first()
    if not regulation:
        raise HTTPException(status_code=404, detail="Regulation not found or access denied")
    db.delete(regulation)
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="study_regulation",
        entity_id=str(regulation_id),
        action="delete",
        description="Deleted study regulation"
    )
