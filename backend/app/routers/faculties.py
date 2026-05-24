from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_user
from app.activity_helper import log_activity

router = APIRouter()


def _require_super_admin(current_user: models.User):
    """Raise 403 if the caller is not a super_admin."""
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="إدارة الكليات متاحة للمدير العام فقط"
        )


@router.get("/")
def list_faculties(db: Session = Depends(get_db)):
    """List all faculties — public read access."""
    faculties = db.query(models.Faculty).all()
    return [
        {
            'id': f.id,
            'name': f.name,
            'name_en': f.name_en,
            'icon': f.icon,
            'student_count': f.student_count,
            'staff_count': f.staff_count,
            'color': f.color,
        }
        for f in faculties
    ]


@router.get("/{faculty_id}")
def get_faculty(faculty_id: str, db: Session = Depends(get_db)):
    """Get a single faculty by ID — public read access."""
    faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return faculty


@router.post("/", response_model=schemas.FacultyResponse, status_code=status.HTTP_201_CREATED)
def create_faculty(
    data: schemas.FacultyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Create a new faculty. Only super_admin can create faculties.

    Example request:
    ```json
    {
      "id": "FCAI",
      "name": "كلية الحاسبات والذكاء الاصطناعي",
      "name_en": "Faculty of Computers and AI",
      "icon": "💻",
      "student_count": 2000,
      "staff_count": 120,
      "color": "bg-primary-600"
    }
    ```
    """
    _require_super_admin(current_user)
    if db.query(models.Faculty).filter(models.Faculty.id == data.id).first():
        raise HTTPException(status_code=409, detail="Faculty with this ID already exists")
    faculty = models.Faculty(**data.model_dump())
    db.add(faculty)
    db.commit()
    db.refresh(faculty)

    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            faculty_id=None,
            entity_type="faculty",
            entity_id=str(faculty.id),
            action="create",
            description=f"Created faculty: {data.name}"
        )
    except Exception:
        pass

    return faculty


@router.put("/{faculty_id}", response_model=schemas.FacultyResponse)
def update_faculty(
    faculty_id: str,
    data: schemas.FacultyUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update a faculty's metadata. Only super_admin can update faculties."""
    _require_super_admin(current_user)
    faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(faculty, key, value)
    db.commit()
    db.refresh(faculty)

    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            faculty_id=None,
            entity_type="faculty",
            entity_id=str(faculty_id),
            action="update",
            description="Updated faculty"
        )
    except Exception:
        pass

    return faculty


@router.delete("/{faculty_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faculty(
    faculty_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a faculty (cascades to departments and students). Only super_admin."""
    _require_super_admin(current_user)
    faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    db.delete(faculty)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            faculty_id=None,
            entity_type="faculty",
            entity_id=str(faculty_id),
            action="delete",
            description="Deleted faculty"
        )
    except Exception:
        pass
