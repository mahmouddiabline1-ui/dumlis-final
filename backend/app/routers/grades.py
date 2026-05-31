import logging
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter()
logger = logging.getLogger(__name__)

def _letter_grade(total: float) -> tuple[str, float]:
    """Return (letter, points) for a total score 0-100."""
    if total >= 90: return "A+", 4.0
    if total >= 85: return "A",  4.0
    if total >= 80: return "B+", 3.7
    if total >= 75: return "B",  3.3
    if total >= 70: return "C+", 3.0
    if total >= 65: return "C",  2.7
    if total >= 60: return "D+", 2.3
    if total >= 50: return "D",  2.0
    return "F", 0.0

def _auto_calc_grade(data):
    """Auto-calculate total, letter, and points from components if not explicitly set."""
    midterm    = data.midterm    or 0
    final_exam = data.final_exam or 0
    assignments= data.assignments or 0
    oral       = data.oral       or 0
    practical  = data.practical  or 0
    # Only auto-calc if at least midterm and final are provided
    if data.midterm is not None and data.final_exam is not None:
        computed = round(midterm + final_exam + assignments + oral + practical, 1)
        computed = min(100.0, max(0.0, computed))
        if data.total is None:
            data.total = computed
        letter, points = _letter_grade(data.total)
        if data.grade_letter is None:
            data.grade_letter = letter
        if data.grade_points is None:
            data.grade_points = points
    return data

@router.get("/")
def list_grades(
    student_id : Optional[str] = Query(None),
    course_id  : Optional[str] = Query(None),
    semester   : Optional[str] = Query(None),
    skip       : int           = Query(0, ge=0),
    limit      : int           = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List grades with optional filters."""
    q = db.query(models.Grade)
    if scoped_faculty_id:
        q = q.filter(models.Grade.faculty_id == scoped_faculty_id)
    if student_id:
        q = q.filter(models.Grade.student_id == student_id)
    if course_id:
        q = q.filter(models.Grade.course_id == course_id)
    if semester:
        q = q.filter(models.Grade.semester == semester)

    grades = q.offset(skip).limit(limit).all()
    return [
        {
            'id': g.id,
            'student_id': g.student_id,
            'course_id': g.course_id,
            'faculty_id': g.faculty_id,
            'semester': g.semester,
            'midterm': g.midterm,
            'final_exam': g.final_exam,
            'assignments': g.assignments,
            'oral': g.oral,
            'practical': g.practical,
            'total': g.total,
            'grade_letter': g.grade_letter,
            'grade_points': g.grade_points,
        }
        for g in grades
    ]

@router.get("/{grade_id}")
def get_grade(
    grade_id: int, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.Grade).filter(models.Grade.id == grade_id)
    if scoped_faculty_id:
        q = q.filter(models.Grade.faculty_id == scoped_faculty_id)
    
    g = q.first()
    if not g:
        raise HTTPException(status_code=404, detail="Grade record not found or access denied")
    return g

@router.post("/", response_model=schemas.GradeResponse, status_code=201)
def create_grade(
    data: schemas.GradeCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    # Enforce faculty_id from token if not super_admin
    if scoped_faculty_id:
        data.faculty_id = scoped_faculty_id

    """
    Create a grade record.

    Example request:
    ```json
    {
      "student_id": "20240001",
      "course_id": "CS101",
      "semester": "2023-2024 ربيع",
      "midterm": 28,
      "final_exam": 55,
      "assignments": 12,
      "oral": 8,
      "practical": 10,
      "total": 85,
      "grade_letter": "B+",
      "grade_points": 3.3
    }
    ```
    """
    existing = db.query(models.Grade).filter(
        models.Grade.student_id == data.student_id,
        models.Grade.course_id  == data.course_id,
        models.Grade.semester   == data.semester
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Grade record already exists for this student/course/semester")
    # Auto-calculate total and letter grade from components
    data = _auto_calc_grade(data)
    grade = models.Grade(**data.model_dump())
    db.add(grade)
    db.commit()
    db.refresh(grade)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="grade",
            entity_id=str(grade.id),
            action="create",
            description=f"Created grade for {data.student_id}: {data.course_id} - {data.total}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return grade

@router.put("/{grade_id}", response_model=schemas.GradeResponse)
def update_grade(
    grade_id: int,
    data: schemas.GradeUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Update grade components."""
    q = db.query(models.Grade).filter(models.Grade.id == grade_id)
    if scoped_faculty_id:
        q = q.filter(models.Grade.faculty_id == scoped_faculty_id)

    g = q.first()
    if not g:
        raise HTTPException(status_code=404, detail="Grade record not found or access denied")

    # Auto-calculate if components provided, then build update dict
    data = _auto_calc_grade(data)
    update_data = data.model_dump(exclude_none=True)
    if scoped_faculty_id and "faculty_id" in update_data:
        del update_data["faculty_id"]
    for k, v in update_data.items():
        setattr(g, k, v)
    db.commit()
    db.refresh(g)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="grade",
            entity_id=str(grade_id),
            action="update",
            description=f"Updated grade: {list(update_data.keys())}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return g

@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.Grade).filter(models.Grade.id == grade_id)
    if scoped_faculty_id:
        q = q.filter(models.Grade.faculty_id == scoped_faculty_id)

    g = q.first()
    if not g:
        raise HTTPException(status_code=404, detail="Grade record not found or access denied")
    db.delete(g)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="grade",
            entity_id=str(grade_id),
            action="delete",
            description="Deleted grade record"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)
