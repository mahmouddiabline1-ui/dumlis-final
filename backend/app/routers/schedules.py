from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity
from datetime import time as dt_time
from typing import List, Optional, Dict, Tuple

router = APIRouter()

# ── Configuration ────────────────────────────────────────────────────────────
TIME_SLOTS = [
    (dt_time(8, 0), dt_time(10, 0), "08:00 - 10:00"),
    (dt_time(10, 0), dt_time(12, 0), "10:00 - 12:00"),
    (dt_time(12, 0), dt_time(14, 0), "12:00 - 14:00"),
    (dt_time(14, 0), dt_time(16, 0), "14:00 - 16:00"),
]

DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"]


# ── Helper Functions ─────────────────────────────────────────────────────────
def _get_sessions_for_course(course: models.Course) -> List[str]:
    """Determine session types needed for a course."""
    sessions = ["محاضرة"]
    if course.name and "معمل" in course.name:
        sessions.append("معمل")
    return sessions


def _find_free_slot(
    rooms: List[models.Room],
    booking_grid: Dict[Tuple[str, str, str], bool],
    enrolled_count: int,
    room_type_needed: str,
    days: List[str],
    time_slots: List[Tuple[dt_time, dt_time, str]],
) -> Optional[Dict]:
    """Find first available room+day+time slot."""
    for day in days:
        for time_start, time_end, time_label in time_slots:
            for room in rooms:
                if room.room_type != room_type_needed:
                    continue
                if (room.capacity or 0) < enrolled_count:
                    continue
                grid_key = (room.id, day, time_label)
                if grid_key in booking_grid:
                    continue
                return {
                    "room_id": room.id,
                    "day": day,
                    "time_start": time_start,
                    "time_end": time_end,
                    "time_label": time_label,
                }
    return None

@router.post("/auto-generate")
def auto_generate_schedules(
    request: schemas.ScheduleAutoGenerateRequest,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Auto-generate course schedules for one or all faculties."""
    # Use scoped_faculty_id if present (enforce faculty-admin isolation)
    faculty_id = scoped_faculty_id or request.faculty_id
    semester = request.semester or "الفصل الأول 2024/2025"
    academic_year = request.academic_year or semester
    dry_run = request.dry_run

    # Step 1: Determine which faculties to process
    if faculty_id:
        faculties = [faculty_id]
    else:
        faculties_rows = db.query(models.Faculty.id).all()
        faculties = [f[0] for f in faculties_rows]

    # Step 2: Fetch all available rooms
    rooms = db.query(models.Room).filter(models.Room.status == "available").order_by(models.Room.capacity).all()
    if not rooms:
        return {"generated": 0, "preview": [], "message": "No available rooms found"}

    # Step 3: Build booking grid
    existing = db.query(models.CourseSchedule).filter(models.CourseSchedule.semester == semester).all()
    booking_grid: Dict[Tuple[str, str, str], bool] = {}
    for s in existing:
        key = (s.room_id, s.day, s.time_label or f"{s.time_start} - {s.time_end}")
        booking_grid[key] = True

    # Step 4: Generate schedules
    generated_list = []
    for fac_id in faculties:
        courses = db.query(models.Course).filter(models.Course.faculty_id == fac_id).all()
        for course in courses:
            sessions_needed = _get_sessions_for_course(course)
            for session_type in sessions_needed:
                room_type_needed = "lab" if session_type == "معمل" else "classroom"
                # Calculate actual enrolled count from Enrollment table
                enrolled = db.query(func.count(models.Enrollment.id)).filter(
                    models.Enrollment.course_id == course.id,
                    models.Enrollment.status == "مسجل"
                ).scalar() or 30
                slot = _find_free_slot(rooms, booking_grid, enrolled, room_type_needed, DAYS, TIME_SLOTS)
                if slot:
                    booking_grid[(slot["room_id"], slot["day"], slot["time_label"])] = True
                    schedule = models.CourseSchedule(
                        faculty_id=fac_id, course_id=course.id, room_id=slot["room_id"],
                        day=slot["day"], time_start=slot["time_start"], time_end=slot["time_end"],
                        time_label=slot["time_label"], session_type=session_type,
                        semester=semester, enrolled_count=enrolled,
                    )
                    generated_list.append(schedule)

    # Step 5: Save if not dry_run
    if not dry_run and generated_list:
        db.add_all(generated_list)
        db.commit()
        for schedule in generated_list:
            db.refresh(schedule)

        try:
            log_activity(
                db=db,
                user_id=user.id,
                faculty_id=scoped_faculty_id,
                entity_type="course_schedule",
                entity_id=None,
                action="bulk_create",
                description=f"Auto-generated {len(generated_list)} course schedules"
            )
        except Exception:
            pass

    return {"generated": len(generated_list), "preview": generated_list, "dry_run": dry_run}

@router.get("/availability-grid")
def room_availability_grid(
    faculty_id: Optional[str] = Query(None),
    semester: str = Query("الفصل الأول 2024/2025"),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """Get availability grid for all rooms across days/times."""
    fac_id = scoped_faculty_id or faculty_id
    rooms = db.query(models.Room).filter(models.Room.status == "available").all()
    q = db.query(models.CourseSchedule).filter(models.CourseSchedule.semester == semester)
    if fac_id:
        q = q.filter(models.CourseSchedule.faculty_id == fac_id)
    bookings = q.all()

    return {
        "rooms": [{"id": r.id, "name": r.name, "capacity": r.capacity, "room_type": r.room_type, "faculty_id": r.faculty_id} for r in rooms],
        "bookings": [{"room_id": b.room_id, "day": b.day, "time_label": b.time_label, "course_id": b.course_id, "faculty_id": b.faculty_id} for b in bookings],
        "time_slots": [label for _, _, label in TIME_SLOTS],
        "days": DAYS,
    }

@router.get("/room-availability", response_model=List[dict])
def room_availability(
    room_id: Optional[str] = Query(None),
    day: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """
    Get list of booked time slots for a room.
    Useful for building availability grid.
    """
    q = db.query(
        models.CourseSchedule.room_id,
        models.CourseSchedule.day,
        models.CourseSchedule.time_start,
        models.CourseSchedule.time_end,
        models.CourseSchedule.course_id,
        models.CourseSchedule.faculty_id,
        models.CourseSchedule.time_label,
    )

    if room_id:
        q = q.filter(models.CourseSchedule.room_id == room_id)
    if day:
        q = q.filter(models.CourseSchedule.day == day)

    bookings = q.all()
    return [
        {
            "room_id": b[0],
            "day": b[1],
            "time_start": str(b[2]) if b[2] else None,
            "time_end": str(b[3]) if b[3] else None,
            "course_id": b[4],
            "faculty_id": b[5],
            "time_label": b[6],
        }
        for b in bookings
    ]

@router.get("/")
def list_schedules(
    course_id    : Optional[str] = Query(None),
    room_id      : Optional[str] = Query(None),
    day          : Optional[str] = Query(None),
    session_type : Optional[str] = Query(None),
    semester     : Optional[str] = Query(None),
    instructor   : Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List schedules with optional filters."""
    q = db.query(models.CourseSchedule)
    if scoped_faculty_id:
        q = q.filter(models.CourseSchedule.faculty_id == scoped_faculty_id)
    if course_id:
        q = q.filter(models.CourseSchedule.course_id == course_id)
    if room_id:
        q = q.filter(models.CourseSchedule.room_id == room_id)
    if day:
        q = q.filter(models.CourseSchedule.day == day)
    if session_type:
        q = q.filter(models.CourseSchedule.session_type == session_type)
    if semester:
        q = q.filter(models.CourseSchedule.semester == semester)
    if instructor:
        q = q.filter(models.CourseSchedule.instructor.ilike(f"%{instructor}%"))

    schedules = q.order_by(models.CourseSchedule.day, models.CourseSchedule.time_start).all()
    return [
        {
            'id': s.id,
            'course_id': s.course_id,
            'room_id': s.room_id,
            'faculty_id': s.faculty_id,
            'day': s.day,
            'time_start': s.time_start,
            'time_end': s.time_end,
            'instructor': s.instructor,
            'session_type': s.session_type,
            'semester': s.semester,
        }
        for s in schedules
    ]

@router.get("/student/{student_id}")
def get_student_schedule(
    student_id: str, 
    semester: Optional[str] = Query(None), 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """
    Return the personal schedule for a student based on their enrollments.
    """
    # Verify student belongs to this faculty if scoped
    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    if scoped_faculty_id and student.faculty_id != scoped_faculty_id:
        raise HTTPException(status_code=403, detail="Access denied to this student's schedule")

    enrolled_query = db.query(models.Enrollment.course_id).filter(
        models.Enrollment.student_id == student_id,
        models.Enrollment.status == "مسجل"
    )
    if semester:
        enrolled_query = enrolled_query.filter(models.Enrollment.semester == semester)
    course_ids = [r[0] for r in enrolled_query.all()]
    return db.query(models.CourseSchedule).filter(models.CourseSchedule.course_id.in_(course_ids)).all()

@router.get("/{schedule_id}")
def get_schedule(
    schedule_id: int, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.CourseSchedule).filter(models.CourseSchedule.id == schedule_id)
    if scoped_faculty_id:
        q = q.filter(models.CourseSchedule.faculty_id == scoped_faculty_id)
    
    s = q.first()
    if not s:
        raise HTTPException(status_code=404, detail="Schedule not found or access denied")
    return s

@router.post("/", response_model=schemas.CourseScheduleResponse)
def create_schedule(
    data: schemas.CourseScheduleCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    # Enforce faculty_id from token if not super_admin
    if scoped_faculty_id:
        data.faculty_id = scoped_faculty_id

    """
    Create a course schedule entry.

    Example request:
    ```json
    {
      "course_id": "CS101",
      "room_id": "lab_201",
      "session_type": "معمل",
      "day": "الإثنين",
      "time_label": "10:00 - 12:00",
      "instructor": "د. أحمد محمد السيد",
      "semester": "2024-2025 خريف",
      "group_label": "A"
    }
    ```
    """
    schedule = models.CourseSchedule(**data.model_dump())
    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="course_schedule",
            entity_id=str(schedule.id),
            action="create",
            description=f"Created course schedule for {data.course_id}"
        )
    except Exception:
        pass

    return schedule

@router.put("/{schedule_id}", response_model=schemas.CourseScheduleResponse)
def update_schedule(
    schedule_id: int,
    data: schemas.CourseScheduleUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.CourseSchedule).filter(models.CourseSchedule.id == schedule_id)
    if scoped_faculty_id:
        q = q.filter(models.CourseSchedule.faculty_id == scoped_faculty_id)

    s = q.first()
    if not s:
        raise HTTPException(status_code=404, detail="Schedule not found or access denied")

    # Resolve update data, prevent changing faculty_id if scoped
    update_data = data.model_dump(exclude_none=True)
    if scoped_faculty_id and "faculty_id" in update_data:
        del update_data["faculty_id"]

    for k, v in update_data.items():
        setattr(s, k, v)
    db.commit()
    db.refresh(s)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="course_schedule",
            entity_id=str(schedule_id),
            action="update",
            description="Updated course schedule"
        )
    except Exception:
        pass

    return s

@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.CourseSchedule).filter(models.CourseSchedule.id == schedule_id)
    if scoped_faculty_id:
        q = q.filter(models.CourseSchedule.faculty_id == scoped_faculty_id)

    s = q.first()
    if not s:
        raise HTTPException(status_code=404, detail="Schedule not found or access denied")
    db.delete(s)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="course_schedule",
            entity_id=str(schedule_id),
            action="delete",
            description="Deleted course schedule"
        )
    except Exception:
        pass

@router.post("/check-conflict", response_model=schemas.ConflictCheckResponse)
def check_schedule_conflict(
    data: schemas.ConflictCheckRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """
    Check if a room has any scheduling conflicts at a given day/time.
    Returns list of conflicting schedules if any.
    """
    q = db.query(models.CourseSchedule).filter(
        models.CourseSchedule.room_id == data.room_id,
        models.CourseSchedule.day == data.day,
    )

    if data.exclude_id:
        q = q.filter(models.CourseSchedule.id != data.exclude_id)

    if data.time_start and data.time_end:
        from datetime import time as dt_time
        try:
            start = dt_time.fromisoformat(data.time_start)
            end = dt_time.fromisoformat(data.time_end)
            q = q.filter(
                models.CourseSchedule.time_start < end,
                models.CourseSchedule.time_end > start,
            )
        except ValueError:
            pass

    conflicts = q.all()
    return schemas.ConflictCheckResponse(
        has_conflict=len(conflicts) > 0,
        conflicts=[
            schemas.ScheduleConflict(
                schedule_id=c.id,
                course_id=c.course_id,
                faculty_id=c.faculty_id,
                day=c.day,
                time_label=c.time_label,
            )
            for c in conflicts
        ],
    )

@router.post("/bulk-create", response_model=schemas.BulkScheduleCreateResponse)
def bulk_create_schedules(
    data: schemas.BulkScheduleCreateRequest,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """
    Create multiple course schedule entries in a single transaction.
    """
    schedules = []
    for schedule_data in data.schedules:
        if scoped_faculty_id:
            schedule_data.faculty_id = scoped_faculty_id
        schedule = models.CourseSchedule(**schedule_data.model_dump())
        schedules.append(schedule)

    db.add_all(schedules)
    db.commit()

    for schedule in schedules:
        db.refresh(schedule)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="course_schedule",
            entity_id=None,
            action="bulk_create",
            description=f"Bulk created {len(schedules)} course schedules"
        )
    except Exception:
        pass

    return schemas.BulkScheduleCreateResponse(
        created=len(schedules),
        rows=schedules,
    )
