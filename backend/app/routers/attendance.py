from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user

router = APIRouter()


@router.get("/")
def list_attendance(
    student_id  : Optional[str]  = Query(None),
    course_id   : Optional[str]  = Query(None),
    status      : Optional[str]  = Query(None),
    date_from   : Optional[date] = Query(None),
    date_to     : Optional[date] = Query(None),
    skip        : int            = Query(0, ge=0),
    limit       : int            = Query(200, ge=1, le=2000),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    _: models.User = Depends(get_current_user),
):
    """List attendance records with comprehensive filters — auth required, scoped to faculty."""
    q = db.query(models.AttendanceRecord)
    if scoped_faculty_id:
        q = q.filter(models.AttendanceRecord.faculty_id == scoped_faculty_id)
    if student_id:
        q = q.filter(models.AttendanceRecord.student_id == student_id)
    if course_id:
        q = q.filter(models.AttendanceRecord.course_id == course_id)
    if status:
        q = q.filter(models.AttendanceRecord.status == status)
    if date_from:
        q = q.filter(models.AttendanceRecord.attendance_date >= date_from)
    if date_to:
        q = q.filter(models.AttendanceRecord.attendance_date <= date_to)

    records = q.order_by(models.AttendanceRecord.attendance_date.desc()).offset(skip).limit(limit).all()
    return [
        {
            'id': r.id,
            'student_id': r.student_id,
            'course_id': r.course_id,
            'status': r.status,
            'attendance_date': r.attendance_date.isoformat() if r.attendance_date else None,
            'session_type': r.session_type or 'محاضرة',
            'week_number': r.week_number or 1,
            'faculty_id': r.faculty_id,
        }
        for r in records
    ]


@router.get("/summary/{student_id}/{course_id}")
def get_attendance_summary(
    student_id: str,
    course_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    _: models.User = Depends(get_current_user),
):
    """
    Get attendance summary (present/absent/rate) for a student in a course.

    Example response:
    ```json
    {
      "student_id": "20240001",
      "course_id": "CS101",
      "total_sessions": 24,
      "present": 21,
      "absent": 3,
      "attendance_rate": 87.5
    }
    ```
    """
    q = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.student_id == student_id,
        models.AttendanceRecord.course_id  == course_id
    )
    if scoped_faculty_id:
        q = q.filter(models.AttendanceRecord.faculty_id == scoped_faculty_id)
    records = q.all()
    total   = len(records)
    present = sum(1 for r in records if r.status == "حاضر")
    absent  = total - present
    rate    = round((present / total * 100), 2) if total > 0 else 0
    return {"student_id": student_id, "course_id": course_id,
            "total_sessions": total, "present": present, "absent": absent, "attendance_rate": rate}


@router.get("/{record_id}")
def get_attendance(
    record_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    _: models.User = Depends(get_current_user),
):
    q = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.id == record_id)
    if scoped_faculty_id:
        q = q.filter(models.AttendanceRecord.faculty_id == scoped_faculty_id)
    r = q.first()
    if not r:
        raise HTTPException(status_code=404, detail="Attendance record not found or access denied")
    return {
        'id': r.id,
        'student_id': r.student_id,
        'course_id': r.course_id,
        'status': r.status,
        'attendance_date': r.attendance_date.isoformat() if r.attendance_date else None,
        'session_type': r.session_type or 'محاضرة',
        'week_number': r.week_number or 1,
        'faculty_id': r.faculty_id,
        'notes': r.notes,
    }


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_attendance(
    data: schemas.AttendanceCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """
    Record a single attendance entry.

    Example request:
    ```json
    {
      "student_id": "20240001",
      "course_id": "CS101",
      "session_type": "محاضرة",
      "week_number": 3,
      "attendance_date": "2024-10-07",
      "status": "حاضر"
    }
    ```
    """
    existing = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.student_id      == data.student_id,
        models.AttendanceRecord.course_id       == data.course_id,
        models.AttendanceRecord.attendance_date == data.attendance_date,
        models.AttendanceRecord.session_type    == data.session_type
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Attendance record already exists")

    record_data = data.model_dump()
    if scoped_faculty_id:
        record_data['faculty_id'] = scoped_faculty_id

    record = models.AttendanceRecord(**record_data)
    db.add(record)
    db.commit()
    db.refresh(record)

    activity = models.ActivityLog(
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="attendance",
        entity_id=str(record.id),
        action="create",
        description=f"Created attendance record for {data.student_id}"
    )
    db.add(activity)
    db.commit()

    return record


@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def bulk_create_attendance(
    data: schemas.AttendanceBulkCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Bulk-insert multiple attendance records (for a whole class session)."""
    records = []
    for r in data.records:
        record_data = r.model_dump()
        if scoped_faculty_id:
            record_data['faculty_id'] = scoped_faculty_id
        records.append(models.AttendanceRecord(**record_data))
    db.bulk_save_objects(records)
    db.commit()

    activity = models.ActivityLog(
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="attendance",
        entity_id=None,
        action="bulk_create",
        description=f"Bulk created {len(records)} attendance records"
    )
    db.add(activity)
    db.commit()

    return {"created": len(records)}


@router.put("/{record_id}")
def update_attendance(
    record_id: int,
    data: schemas.AttendanceUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.id == record_id)
    if scoped_faculty_id:
        q = q.filter(models.AttendanceRecord.faculty_id == scoped_faculty_id)
    r = q.first()
    if not r:
        raise HTTPException(status_code=404, detail="Attendance record not found or access denied")
    r.status = data.status
    if data.notes is not None:
        r.notes = data.notes
    db.commit()
    db.refresh(r)

    activity = models.ActivityLog(
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="attendance",
        entity_id=str(record_id),
        action="update",
        description=f"Updated attendance record: status={data.status}"
    )
    db.add(activity)
    db.commit()

    return r


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance(
    record_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.id == record_id)
    if scoped_faculty_id:
        q = q.filter(models.AttendanceRecord.faculty_id == scoped_faculty_id)
    r = q.first()
    if not r:
        raise HTTPException(status_code=404, detail="Attendance record not found or access denied")
    db.delete(r)
    db.commit()

    activity = models.ActivityLog(
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="attendance",
        entity_id=str(record_id),
        action="delete",
        description="Deleted attendance record"
    )
    db.add(activity)
    db.commit()
