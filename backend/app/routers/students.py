from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_user, get_scoped_faculty_id
from app.activity_helper import log_activity

router = APIRouter()

@router.get("/")
def list_students(
    faculty_id   : Optional[str]  = Query(None),
    department_id: Optional[str]  = Query(None),
    level        : Optional[int]  = Query(None, ge=1, le=7),
    status       : Optional[str]  = Query(None),
    regulation   : Optional[str]  = Query(None),
    fees_status  : Optional[str]  = Query(None),
    search       : Optional[str]  = Query(None, description="Search by name or student_id"),
    skip         : int            = Query(0, ge=0),
    limit        : int            = Query(50, ge=1, le=500),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List students with optional filters."""
    q = db.query(models.Student).outerjoin(models.Faculty).outerjoin(models.Department)
    effective_faculty_id = scoped_faculty_id or faculty_id

    if effective_faculty_id:
        q = q.filter(models.Student.faculty_id == effective_faculty_id)
    if department_id:
        q = q.filter(models.Student.department_id == department_id)
    if level:
        q = q.filter(models.Student.level == level)
    if status:
        q = q.filter(models.Student.status == status)
    if regulation:
        q = q.filter(models.Student.regulation == regulation)
    if fees_status:
        q = q.filter(models.Student.fees_status == fees_status)
    if search:
        q = q.filter(
            or_(
                models.Student.name.ilike(f'%{search}%'),
                models.Student.student_id.ilike(f'%{search}%'),
            )
        )

    students = q.offset(skip).limit(limit).all()
    return [
        {
            'student_id': s.student_id,
            'name': s.name,
            'national_id': s.national_id,
            'faculty_id': s.faculty_id,
            'faculty': s.faculty.name if s.faculty else s.faculty_id,
            'department_id': s.department_id,
            'department': s.department.name if s.department else s.department_id,
            'level': s.level,
            'regulation': s.regulation,
            'gpa': s.gpa,
            'phone': s.phone,
            'email': s.email,
            'city': s.city,
            'status': s.status,
            'fees_status': s.fees_status,
        }
        for s in students
    ]

@router.get("/count")
def count_students(
    faculty_id: Optional[str] = Query(None),
    level     : Optional[int] = Query(None, ge=1, le=7),
    status    : Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """Total student count with optional filters."""
    q = db.query(models.Student)
    effective_faculty_id = scoped_faculty_id or faculty_id
    if effective_faculty_id:
        q = q.filter(models.Student.faculty_id == effective_faculty_id)
    if level:
        q = q.filter(models.Student.level == level)
    if status:
        q = q.filter(models.Student.status == status)
    return {"count": q.count()}

@router.get("/statistics")
def get_student_statistics(
    faculty_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """Get aggregate student statistics for the dashboard."""
    from sqlalchemy import func
    
    # Resolve the effective faculty_id for statistics
    target_faculty_id = scoped_faculty_id or faculty_id

    base_q = db.query(models.Student)
    if target_faculty_id:
        base_q = base_q.filter(models.Student.faculty_id == target_faculty_id)
    
    total_students = base_q.count()
    
    # Levels (1-4)
    level_counts = db.query(
        models.Student.level, 
        func.count(models.Student.student_id)
    ).group_by(models.Student.level)
    if target_faculty_id:
        level_counts = level_counts.filter(models.Student.faculty_id == target_faculty_id)
    level_stats = {l: c for l, c in level_counts.all()}
    
    # Status
    status_counts = db.query(
        models.Student.status, 
        func.count(models.Student.student_id)
    ).group_by(models.Student.status)
    if target_faculty_id:
        status_counts = status_counts.filter(models.Student.faculty_id == target_faculty_id)
    status_stats = {s: c for s, c in status_counts.all()}
    
    # Fees
    fees_counts = db.query(
        models.Student.fees_status,
        func.count(models.Student.student_id)
    ).group_by(models.Student.fees_status)
    if target_faculty_id:
        fees_counts = fees_counts.filter(models.Student.faculty_id == target_faculty_id)
    fees_stats = {s: c for s, c in fees_counts.all()}

    # Total Revenue from paid amounts
    revenue_query = db.query(func.sum(models.FinancialRecord.paid_amount))
    if target_faculty_id:
        revenue_query = revenue_query.join(
            models.Student,
            models.FinancialRecord.student_id == models.Student.student_id
        ).filter(models.Student.faculty_id == target_faculty_id)
    total_revenue = float(revenue_query.scalar() or 0)

    return {
        "totalStudents": total_students,
        "levelStats": [
            {"name": "المستوى الأول", "students": level_stats.get(1, 0)},
            {"name": "المستوى الثاني", "students": level_stats.get(2, 0)},
            {"name": "المستوى الثالث", "students": level_stats.get(3, 0)},
            {"name": "المستوى الرابع", "students": level_stats.get(4, 0)},
            {"name": "المستوى الخامس", "students": level_stats.get(5, 0)},
            {"name": "المستوى السادس", "students": level_stats.get(6, 0)},
            {"name": "المستوى السابع", "students": level_stats.get(7, 0)},
        ],
        "feesStats": [
            {"name": "مسدد", "value": fees_stats.get("مسدد", 0)},
            {"name": "غير مسدد", "value": fees_stats.get("غير مسدد", 0)},
        ],
        "activeStudents": status_stats.get("مقيد", 0),
        "graduatedStudents": status_stats.get("خريج", 0),
        "suspendedStudents": status_stats.get("موقوف", 0),
        "expelledStudents": status_stats.get("مفصول", 0),
        "totalRevenue": total_revenue,
        "paymentRate": round((fees_stats.get("مسدد", 0) / total_students * 100), 1) if total_students > 0 else 0
    }

@router.get("/{student_id}")
def get_student(
    student_id: str, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """Get a student with their detailed profile."""
    q = db.query(models.Student).options(joinedload(models.Student.profile))
    if scoped_faculty_id:
        q = q.filter(models.Student.faculty_id == scoped_faculty_id)
    
    student = q.filter(models.Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found or access denied")
    return student

@router.post("/")
def create_student(
    data: schemas.StudentCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    # Enforce faculty_id from token if not super_admin
    if scoped_faculty_id:
        data.faculty_id = scoped_faculty_id

    if db.query(models.Student).filter(models.Student.student_id == data.student_id).first():
        raise HTTPException(status_code=409, detail="Student ID already exists")
    student = models.Student(**data.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="student",
        entity_id=student.student_id,
        action="create",
        description=f"Created student: {student.name} ({student.student_id})"
    )

    return student

@router.put("/{student_id}")
def update_student(
    student_id: str,
    data: schemas.StudentUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Update student fields (status, GPA, fees, department, etc.)."""
    q = db.query(models.Student).filter(models.Student.student_id == student_id)
    if scoped_faculty_id:
        q = q.filter(models.Student.faculty_id == scoped_faculty_id)

    student = q.first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found or access denied")

    # Prevent changing faculty_id if not super_admin
    update_data = data.model_dump(exclude_none=True)
    if scoped_faculty_id and "faculty_id" in update_data:
        del update_data["faculty_id"]

    for k, v in update_data.items():
        setattr(student, k, v)
    db.commit()
    db.refresh(student)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="student",
        entity_id=student_id,
        action="update",
        description=f"Updated student: {list(update_data.keys())}"
    )

    return student

@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(
    student_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Delete a student and all related records (cascades)."""
    q = db.query(models.Student).filter(models.Student.student_id == student_id)
    if scoped_faculty_id:
        q = q.filter(models.Student.faculty_id == scoped_faculty_id)

    student = q.first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found or access denied")
    db.delete(student)
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="student",
        entity_id=student_id,
        action="delete",
        description=f"Deleted student: {student.name}"
    )

# ── Student Profile ────────────────────────────────────────────────
@router.get("/{student_id}/profile")
def get_student_profile(
    student_id: str, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.StudentProfile).join(models.Student).filter(models.StudentProfile.student_id == student_id)
    if scoped_faculty_id:
        q = q.filter(models.Student.faculty_id == scoped_faculty_id)
        
    profile = q.first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found or access denied")
    return profile

@router.post("/{student_id}/profile")
def create_or_update_profile(
    student_id: str,
    data: schemas.StudentProfileCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Create or fully replace a student's detailed profile."""
    # Verify student exists and belongs to faculty
    st_q = db.query(models.Student).filter(models.Student.student_id == student_id)
    if scoped_faculty_id:
        st_q = st_q.filter(models.Student.faculty_id == scoped_faculty_id)

    student = st_q.first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found or access denied")

    existing = db.query(models.StudentProfile).filter(models.StudentProfile.student_id == student_id).first()
    if existing:
        for k, v in data.model_dump(exclude={"student_id"}).items():
            setattr(existing, k, v)
        db.commit()
        db.refresh(existing)

        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="student_profile",
            entity_id=student_id,
            action="update",
            description="Updated student profile"
        )

        return existing
    profile = models.StudentProfile(**data.model_dump())
    profile.student_id = student_id
    db.add(profile)
    db.commit()
    db.refresh(profile)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="student_profile",
        entity_id=student_id,
        action="create",
        description="Created student profile"
    )

    return profile
