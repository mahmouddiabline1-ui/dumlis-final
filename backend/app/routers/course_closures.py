from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter(tags=["Course Closures"])

@router.get("/")
def get_course_closures(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    course_code: str = None,
    academic_year: str = None,
    semester: str = None,
    scoped_faculty_id: str = Depends(get_scoped_faculty_id)
):
    q = db.query(models.CourseClose)

    if scoped_faculty_id:
        q = q.filter(models.CourseClose.faculty_id == scoped_faculty_id)

    if course_code:
        q = q.filter(models.CourseClose.course_code == course_code)
    if academic_year:
        q = q.filter(models.CourseClose.academic_year == academic_year)
    if semester:
        q = q.filter(models.CourseClose.semester == semester)

    closures = q.offset(skip).limit(limit).all()

    results = []
    for c in closures:
        course = db.query(models.Course).filter(models.Course.id == c.course_code).first()
        results.append({
            'id': c.id,
            'course_code': c.course_code,
            'course_name': course.name if course else 'غير معروف',
            'faculty_id': c.faculty_id,
            'academic_year': c.academic_year,
            'semester': c.semester,
            'closure_date': c.closure_date.isoformat() if c.closure_date else None,
            'status': c.status,
            'created_at': c.created_at.isoformat() if c.created_at else None,
        })
    return results


@router.post("/")
def create_course_close(
    closure: schemas.CourseCloseCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    # Verify course exists and belongs to faculty (unless super admin)
    course_query = select(models.Course).where(models.Course.id == closure.course_code)
    if scoped_faculty_id:
        course_query = course_query.where(models.Course.faculty_id == scoped_faculty_id)

    course = db.execute(course_query).scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail=f"Course '{closure.course_code}' not found or not in your faculty")

    # Check if already closed for this semester/year
    existing_query = select(models.CourseClose).where(
        models.CourseClose.course_code == closure.course_code,
        models.CourseClose.academic_year == closure.academic_year,
        models.CourseClose.semester == closure.semester
    )
    if scoped_faculty_id:
        existing_query = existing_query.where(models.CourseClose.faculty_id == scoped_faculty_id)

    existing = db.execute(existing_query).scalar_one_or_none()

    if existing:
        raise HTTPException(status_code=400, detail="Course is already closed for this semester and academic year.")

    db_closure = models.CourseClose(**closure.model_dump(), faculty_id=scoped_faculty_id)
    db.add(db_closure)
    db.commit()
    db.refresh(db_closure)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="course_closure",
        entity_id=str(db_closure.id),
        action="create",
        description=f"Created course closure for {closure.course_code}"
    )

    db_closure.course_name = course.name
    return db_closure

@router.put("/{closure_id}")
def update_course_close(
    closure_id: int,
    closure_update: schemas.CourseCloseUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    query = select(models.CourseClose).where(models.CourseClose.id == closure_id)
    if scoped_faculty_id:
        query = query.where(models.CourseClose.faculty_id == scoped_faculty_id)

    db_closure = db.execute(query).scalar_one_or_none()

    if not db_closure:
        raise HTTPException(status_code=404, detail="Course closure record not found or access denied")

    update_data = closure_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_closure, key, value)

    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="course_closure",
        entity_id=str(closure_id),
        action="update",
        description="Updated course closure"
    )

    db_closure.course_name = db_closure.course.name if db_closure.course else "غير محدد"
    return db_closure

@router.delete("/{closure_id}")
def delete_course_close(
    closure_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    query = select(models.CourseClose).where(models.CourseClose.id == closure_id)
    if scoped_faculty_id:
        query = query.where(models.CourseClose.faculty_id == scoped_faculty_id)

    db_closure = db.execute(query).scalar_one_or_none()

    if not db_closure:
        raise HTTPException(status_code=404, detail="Course closure record not found or access denied")

    db.delete(db_closure)
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="course_closure",
        entity_id=str(closure_id),
        action="delete",
        description="Deleted course closure"
    )

    return {"message": "Successfully deleted"}
