from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter()

@router.get("/")
def list_enrollments(
    student_id : Optional[str] = Query(None),
    course_id  : Optional[str] = Query(None),
    semester   : Optional[str] = Query(None),
    status     : Optional[str] = Query(None),
    skip       : int           = Query(0, ge=0),
    limit      : int           = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List enrollments with optional filters."""
    q = db.query(models.Enrollment)
    if scoped_faculty_id:
        q = q.filter(models.Enrollment.faculty_id == scoped_faculty_id)
    if student_id:
        q = q.filter(models.Enrollment.student_id == student_id)
    if course_id:
        q = q.filter(models.Enrollment.course_id == course_id)
    if semester:
        q = q.filter(models.Enrollment.semester == semester)
    if status:
        q = q.filter(models.Enrollment.status == status)

    enrollments = q.offset(skip).limit(limit).all()
    return [
        {
            'id': e.id,
            'student_id': e.student_id,
            'course_id': e.course_id,
            'faculty_id': e.faculty_id,
            'semester': e.semester,
            'status': e.status,
            'enrollment_date': e.enrolled_at.isoformat() if e.enrolled_at else None,
        }
        for e in enrollments
    ]


@router.get("/{enrollment_id}")
def get_enrollment(
    enrollment_id: int, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id)
    if scoped_faculty_id:
        q = q.filter(models.Enrollment.faculty_id == scoped_faculty_id)
    
    e = q.first()
    if not e:
        raise HTTPException(status_code=404, detail="Enrollment not found or access denied")
    return e

@router.post("/")
def create_enrollment(
    data: schemas.EnrollmentCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    # Enforce faculty_id from token if not super_admin
    if scoped_faculty_id:
        data.faculty_id = scoped_faculty_id

    """
    Enroll a student in a course.

    Example request:
    ```json
    {
      "student_id": "20240001",
      "course_id": "CS101",
      "semester": "2024-2025 خريف",
      "status": "مسجل"
    }
    ```
    """
    existing = db.query(models.Enrollment).filter(
        models.Enrollment.student_id == data.student_id,
        models.Enrollment.course_id  == data.course_id,
        models.Enrollment.semester   == data.semester
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Student already enrolled in this course for this semester")
    enrollment = models.Enrollment(**data.model_dump())
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="enrollment",
        entity_id=str(enrollment.id),
        action="create",
        description=f"Enrolled {data.student_id} in {data.course_id}"
    )

    return enrollment

@router.put("/{enrollment_id}")
def update_enrollment(
    enrollment_id: int,
    data: schemas.EnrollmentUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Update enrollment status (e.g. withdraw)."""
    q = db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id)
    if scoped_faculty_id:
        q = q.filter(models.Enrollment.faculty_id == scoped_faculty_id)

    e = q.first()
    if not e:
        raise HTTPException(status_code=404, detail="Enrollment not found or access denied")
    e.status = data.status
    db.commit()
    db.refresh(e)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="enrollment",
        entity_id=str(enrollment_id),
        action="update",
        description=f"Updated enrollment status to {data.status}"
    )

    return e

@router.delete("/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id)
    if scoped_faculty_id:
        q = q.filter(models.Enrollment.faculty_id == scoped_faculty_id)

    e = q.first()
    if not e:
        raise HTTPException(status_code=404, detail="Enrollment not found or access denied")
    db.delete(e)
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="enrollment",
        entity_id=str(enrollment_id),
        action="delete",
        description=f"Deleted enrollment for {e.student_id}"
    )
