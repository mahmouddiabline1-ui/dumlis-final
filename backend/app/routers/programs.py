from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter(tags=["Academic Programs"])

from sqlalchemy import select

@router.get("/")
def list_programs(
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id)
):
    """List all programs, scoped by faculty_id."""
    q = db.query(models.AcademicProgram)
    if scoped_faculty_id:
        q = q.filter(models.AcademicProgram.faculty_id == scoped_faculty_id)

    programs = q.all()
    return [
        {
            'id': p.id,
            'faculty_id': p.faculty_id,
            'name': p.name,
            'degree_level': p.degree,
            'duration_years': p.total_hours,
            'description': p.name,
        }
        for p in programs
    ]

@router.get("/{program_id}")
def get_program(
    program_id: str, 
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id)
):
    """Get a single program by ID, ensuring it belongs to user's faculty."""
    query = db.query(models.AcademicProgram).filter(models.AcademicProgram.id == program_id)
    if scoped_faculty_id:
        query = query.filter(models.AcademicProgram.faculty_id == scoped_faculty_id)
        
    program = query.first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found or access denied")
    return program

@router.post("/", response_model=schemas.AcademicProgramResponse, status_code=status.HTTP_201_CREATED)
def create_program(
    data: schemas.AcademicProgramCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Create a new program within the user's faculty."""
    # Ensure current user has permission for this faculty if they specify one, or force theirs
    target_faculty = scoped_faculty_id if scoped_faculty_id else data.faculty_id

    if db.query(models.AcademicProgram).filter(models.AcademicProgram.id == data.id).first():
        raise HTTPException(status_code=409, detail="Program with this ID already exists")

    program = models.AcademicProgram(**data.model_dump())
    if scoped_faculty_id:
        program.faculty_id = scoped_faculty_id

    db.add(program)
    db.commit()
    db.refresh(program)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="academic_program",
            entity_id=str(program.id),
            action="create",
            description=f"Created academic program: {data.name}"
        )
    except Exception:
        pass

    return program

@router.put("/{program_id}", response_model=schemas.AcademicProgramResponse)
def update_program(
    program_id: str,
    data: schemas.AcademicProgramUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Update a program within the user's faculty."""
    query = db.query(models.AcademicProgram).filter(models.AcademicProgram.id == program_id)
    if scoped_faculty_id:
        query = query.filter(models.AcademicProgram.faculty_id == scoped_faculty_id)

    program = query.first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found or access denied")

    for key, value in data.model_dump(exclude_none=True).items():
        setattr(program, key, value)
    db.commit()
    db.refresh(program)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="academic_program",
            entity_id=str(program_id),
            action="update",
            description="Updated academic program"
        )
    except Exception:
        pass

    return program

@router.delete("/{program_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_program(
    program_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Delete a program within the user's faculty."""
    query = db.query(models.AcademicProgram).filter(models.AcademicProgram.id == program_id)
    if scoped_faculty_id:
        query = query.filter(models.AcademicProgram.faculty_id == scoped_faculty_id)

    program = query.first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found or access denied")
    db.delete(program)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="academic_program",
            entity_id=str(program_id),
            action="delete",
            description="Deleted academic program"
        )
    except Exception:
        pass
