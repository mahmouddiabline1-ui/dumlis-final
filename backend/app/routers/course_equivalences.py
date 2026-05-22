from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter()


@router.get("/")
def list_course_equivalences(
    student_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List course equivalences, optionally filtered by student (faculty-scoped)."""
    q = db.query(models.CourseEquivalence).join(
        models.Student, models.CourseEquivalence.student_id == models.Student.student_id
    )

    if scoped_faculty_id:
        q = q.filter(models.Student.faculty_id == scoped_faculty_id)

    if student_id:
        q = q.filter(models.CourseEquivalence.student_id == student_id)

    return q.all()


@router.get("/{equivalence_id}")
def get_course_equivalence(
    equivalence_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """Get a single course equivalence by ID (faculty-scoped)."""
    q = db.query(models.CourseEquivalence).join(
        models.Student, models.CourseEquivalence.student_id == models.Student.student_id
    ).filter(models.CourseEquivalence.id == equivalence_id)

    if scoped_faculty_id:
        q = q.filter(models.Student.faculty_id == scoped_faculty_id)

    equivalence = q.first()

    if not equivalence:
        raise HTTPException(status_code=404, detail="Course equivalence not found or access denied")
    return equivalence


@router.post("/")
def create_course_equivalence(
    data: schemas.CourseEquivalenceCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Create a new course equivalence record (faculty-scoped)."""
    # Verify student exists and belongs to scoped faculty
    student = db.query(models.Student).filter(
        models.Student.student_id == data.student_id
    ).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if scoped_faculty_id and student.faculty_id != scoped_faculty_id:
        raise HTTPException(status_code=403, detail="Access denied - student not in your faculty")

    # Verify both courses exist
    original_course = db.query(models.Course).filter(
        models.Course.id == data.original_course_id
    ).first()

    equivalent_course = db.query(models.Course).filter(
        models.Course.id == data.equivalent_course_id
    ).first()

    if not original_course:
        raise HTTPException(status_code=404, detail="Original course not found")
    if not equivalent_course:
        raise HTTPException(status_code=404, detail="Equivalent course not found")

    equivalence = models.CourseEquivalence(**data.model_dump())
    db.add(equivalence)
    db.commit()
    db.refresh(equivalence)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="course_equivalence",
        entity_id=str(equivalence.id),
        action="create",
        description=f"Created course equivalence for student {data.student_id}"
    )

    return equivalence


@router.put("/{equivalence_id}")
def update_course_equivalence(
    equivalence_id: int,
    data: schemas.CourseEquivalenceCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Update a course equivalence record (faculty-scoped)."""
    q = db.query(models.CourseEquivalence).join(
        models.Student, models.CourseEquivalence.student_id == models.Student.student_id
    ).filter(models.CourseEquivalence.id == equivalence_id)

    if scoped_faculty_id:
        q = q.filter(models.Student.faculty_id == scoped_faculty_id)

    equivalence = q.first()

    if not equivalence:
        raise HTTPException(status_code=404, detail="Course equivalence not found or access denied")

    for key, value in data.model_dump(exclude_none=True).items():
        setattr(equivalence, key, value)

    db.commit()
    db.refresh(equivalence)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="course_equivalence",
        entity_id=str(equivalence_id),
        action="update",
        description="Updated course equivalence"
    )

    return equivalence


@router.delete("/{equivalence_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course_equivalence(
    equivalence_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Delete a course equivalence record (faculty-scoped)."""
    q = db.query(models.CourseEquivalence).join(
        models.Student, models.CourseEquivalence.student_id == models.Student.student_id
    ).filter(models.CourseEquivalence.id == equivalence_id)

    if scoped_faculty_id:
        q = q.filter(models.Student.faculty_id == scoped_faculty_id)

    equivalence = q.first()

    if not equivalence:
        raise HTTPException(status_code=404, detail="Course equivalence not found or access denied")

    db.delete(equivalence)
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="course_equivalence",
        entity_id=str(equivalence_id),
        action="delete",
        description="Deleted course equivalence"
    )
