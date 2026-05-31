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

@router.get("/")
def list_courses(
    faculty_id    : Optional[str] = Query(None),
    department_id : Optional[str] = Query(None),
    level         : Optional[int] = Query(None, ge=1, le=7),
    course_type   : Optional[str] = Query(None),
    semester      : Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List courses with optional filters."""
    q = db.query(models.Course)
    effective_faculty_id = scoped_faculty_id or faculty_id
    if effective_faculty_id:
        q = q.filter(models.Course.faculty_id == effective_faculty_id)
    if department_id:
        q = q.filter(models.Course.department_id == department_id)
    if level:
        q = q.filter(models.Course.level == level)
    if course_type:
        q = q.filter(models.Course.course_type == course_type)
    if semester:
        q = q.filter(models.Course.semester == semester)

    courses = q.all()
    return [
        {
            'id': c.id,
            'name': c.name,
            'level': c.level,
            'faculty_id': c.faculty_id,
            'department_id': c.department_id,
            'program_id': c.program_id,
            'credit_hours': c.credit_hours,
            'course_type': c.course_type,
            'semester': c.semester,
        }
        for c in courses
    ]

@router.get("/{course_id}")
def get_course(
    course_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.Course).filter(models.Course.id == course_id)
    if scoped_faculty_id:
        q = q.filter(models.Course.faculty_id == scoped_faculty_id)

    course = q.first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or access denied")

    return {
        'id': course.id,
        'name': course.name,
        'level': course.level,
        'faculty_id': course.faculty_id,
        'department_id': course.department_id,
        'program_id': course.program_id,
        'credit_hours': course.credit_hours,
        'course_type': course.course_type,
        'semester': course.semester,
    }

@router.post("/", response_model=schemas.CourseResponse)
def create_course(
    data: schemas.CourseCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    # Enforce faculty_id from token if not super_admin
    if scoped_faculty_id:
        data.faculty_id = scoped_faculty_id

    if db.query(models.Course).filter(models.Course.id == data.id).first():
        raise HTTPException(status_code=409, detail="Course ID already exists")

    """
    Create a course.

    Example request:
    ```json
    {
      "id": "CS101",
      "name": "مقدمة في البرمجة",
      "name_en": "Introduction to Programming",
      "level": 1,
      "department_id": "CS",
      "credit_hours": 3,
      "course_type": "إجباري",
      "semester": "خريف",
      "theoretical_hours": 2,
      "practical_hours": 2
    }
    ```
    """
    course = models.Course(**data.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="course",
            entity_id=course.id,
            action="create",
            description=f"Created course: {course.name}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return course

@router.put("/{course_id}", response_model=schemas.CourseResponse)
def update_course(
    course_id: str,
    data: schemas.CourseUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.Course).filter(models.Course.id == course_id)
    if scoped_faculty_id:
        q = q.filter(models.Course.faculty_id == scoped_faculty_id)

    course = q.first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or access denied")

    # Resolve update data, prevent changing faculty_id if scoped
    update_data = data.model_dump(exclude_none=True)
    if scoped_faculty_id and "faculty_id" in update_data:
        del update_data["faculty_id"]

    for k, v in update_data.items():
        setattr(course, k, v)
    db.commit()
    db.refresh(course)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="course",
            entity_id=course_id,
            action="update",
            description=f"Updated course: {list(update_data.keys())}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return course

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.Course).filter(models.Course.id == course_id)
    if scoped_faculty_id:
        q = q.filter(models.Course.faculty_id == scoped_faculty_id)

    course = q.first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or access denied")
    db.delete(course)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="course",
            entity_id=course_id,
            action="delete",
            description=f"Deleted course: {course.name}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

# ── Prerequisites ──────────────────────────────────────────────────
@router.get("/{course_id}/prerequisites")
def get_prerequisites(
    course_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(models.CoursePrerequisite).filter(models.CoursePrerequisite.course_id == course_id).all()

@router.post("/{course_id}/prerequisites", response_model=schemas.CoursePrerequisiteResponse)
def add_prerequisite(
    course_id: str,
    data: schemas.CoursePrerequisiteCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Add a prerequisite to a course."""
    prereq = models.CoursePrerequisite(course_id=course_id, prerequisite_id=data.prerequisite_id)
    db.add(prereq)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="course_prerequisite",
            entity_id=f"{course_id}-{data.prerequisite_id}",
            action="create",
            description=f"Added prerequisite {data.prerequisite_id} to course {course_id}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return prereq

@router.delete("/{course_id}/prerequisites/{prereq_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_prerequisite(
    course_id: str,
    prereq_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    prereq = db.query(models.CoursePrerequisite).filter(
        models.CoursePrerequisite.course_id == course_id,
        models.CoursePrerequisite.prerequisite_id == prereq_id
    ).first()
    if not prereq:
        raise HTTPException(status_code=404, detail="Prerequisite not found")
    db.delete(prereq)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="course_prerequisite",
            entity_id=f"{course_id}-{prereq_id}",
            action="delete",
            description=f"Removed prerequisite {prereq_id} from course {course_id}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)
