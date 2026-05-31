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

def list_committees(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
    status_filter: Optional[str] = Query(None, alias="status"),
    semester: Optional[str] = Query(None),
):
    """List examination committees — scoped to the authenticated user's faculty."""
    q = db.query(models.Committee)
    if current_user.role != "super_admin":
        q = q.filter(models.Committee.faculty_id == current_user.faculty_id)
    if status_filter:
        q = q.filter(models.Committee.status == status_filter)
    if semester:
        q = q.filter(models.Committee.semester == semester)
    return q.all()



@router.get("/assignments")
def list_assignments(
    student_id: Optional[str] = Query(None),
    committee_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    _: models.User = Depends(get_current_user),
):
    """List student assignments across committees — scoped to faculty."""
    q = db.query(models.StudentCommitteeAssignment)
    if scoped_faculty_id:
        # Join through committee to enforce faculty isolation
        q = q.join(models.Committee).filter(
            models.Committee.faculty_id == scoped_faculty_id
        )
    if student_id:
        q = q.filter(models.StudentCommitteeAssignment.student_id == student_id)
    if committee_id:
        q = q.filter(models.StudentCommitteeAssignment.committee_id == committee_id)
    return q.all()


@router.get("/{committee_id}")
def get_committee(
    committee_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    _: models.User = Depends(get_current_user),
):
    q = db.query(models.Committee).filter(models.Committee.id == committee_id)
    if scoped_faculty_id:
        q = q.filter(models.Committee.faculty_id == scoped_faculty_id)
    c = q.first()
    if not c:
        raise HTTPException(status_code=404, detail="Committee not found or access denied")
    return c


@router.post("/", response_model=schemas.CommitteeResponse)
def create_committee(
    data: schemas.CommitteeCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """
    Create an exam committee.

    Example request:
    ```json
    {
      "name": "لجنة CS101 - غرفة 101",
      "course_id": "CS101",
      "room_id": "room_101b",
      "capacity": 150,
      "exam_date": "2024-12-15",
      "exam_time": "09:00:00",
      "supervisor": "د. أحمد محمد السيد",
      "seating_rows": 10,
      "seating_cols": 15,
      "seating_layout": "standard",
      "semester": "2024-2025 خريف"
    }
    ```
    """
    committee_data = data.model_dump()
    # Enforce faculty_id from token for non-super-admins
    if scoped_faculty_id:
        committee_data['faculty_id'] = scoped_faculty_id
    committee = models.Committee(**committee_data)
    db.add(committee)
    db.commit()
    db.refresh(committee)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="committee",
            entity_id=str(committee.id),
            action="create",
            description=f"Created committee: {data.name}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return committee


@router.put("/{committee_id}", response_model=schemas.CommitteeResponse)
def update_committee(
    committee_id: int,
    data: schemas.CommitteeUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.Committee).filter(models.Committee.id == committee_id)
    if scoped_faculty_id:
        q = q.filter(models.Committee.faculty_id == scoped_faculty_id)
    c = q.first()
    if not c:
        raise HTTPException(status_code=404, detail="Committee not found or access denied")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="committee",
            entity_id=str(committee_id),
            action="update",
            description="Updated committee"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return c


@router.delete("/{committee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_committee(
    committee_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.Committee).filter(models.Committee.id == committee_id)
    if scoped_faculty_id:
        q = q.filter(models.Committee.faculty_id == scoped_faculty_id)
    c = q.first()
    if not c:
        raise HTTPException(status_code=404, detail="Committee not found or access denied")
    db.delete(c)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="committee",
            entity_id=str(committee_id),
            action="delete",
            description="Deleted committee"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)


# ── Student assignments ────────────────────────────────────────────
@router.get("/{committee_id}/students")
def list_committee_students(
    committee_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    _: models.User = Depends(get_current_user),
):
    """List all students assigned to a committee (with seat numbers)."""
    # Verify committee belongs to this faculty
    q = db.query(models.Committee).filter(models.Committee.id == committee_id)
    if scoped_faculty_id:
        q = q.filter(models.Committee.faculty_id == scoped_faculty_id)
    if not q.first():
        raise HTTPException(status_code=404, detail="Committee not found or access denied")
    return db.query(models.StudentCommitteeAssignment).filter(
        models.StudentCommitteeAssignment.committee_id == committee_id
    ).all()


@router.post("/{committee_id}/students", response_model=schemas.StudentCommitteeAssignmentResponse)
def assign_student_to_committee(
    committee_id: int,
    data: schemas.StudentCommitteeAssignmentCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """
    Assign a student to an exam committee with a seat.

    Example request:
    ```json
    {
      "student_id": "20240001",
      "committee_id": 1,
      "seat_number": "3-4",
      "seat_row": 3,
      "seat_column": 4
    }
    ```
    """
    # Verify committee belongs to this faculty
    q = db.query(models.Committee).filter(models.Committee.id == committee_id)
    if scoped_faculty_id:
        q = q.filter(models.Committee.faculty_id == scoped_faculty_id)
    committee = q.first()
    if not committee:
        raise HTTPException(status_code=404, detail="Committee not found or access denied")

    existing = db.query(models.StudentCommitteeAssignment).filter(
        models.StudentCommitteeAssignment.student_id == data.student_id,
        models.StudentCommitteeAssignment.committee_id == committee_id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Student already assigned to this committee")

    assignment = models.StudentCommitteeAssignment(**{**data.model_dump(), "committee_id": committee_id})
    db.add(assignment)
    committee.assigned_students += 1
    db.commit()
    db.refresh(assignment)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="student_assignment",
            entity_id=str(assignment.id),
            action="create",
            description=f"Assigned student {data.student_id} to committee {committee_id}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return assignment


@router.delete("/{committee_id}/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_student_from_committee(
    committee_id: int,
    student_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    # Verify committee belongs to this faculty
    q = db.query(models.Committee).filter(models.Committee.id == committee_id)
    if scoped_faculty_id:
        q = q.filter(models.Committee.faculty_id == scoped_faculty_id)
    committee = q.first()
    if not committee:
        raise HTTPException(status_code=404, detail="Committee not found or access denied")

    a = db.query(models.StudentCommitteeAssignment).filter(
        models.StudentCommitteeAssignment.committee_id == committee_id,
        models.StudentCommitteeAssignment.student_id == student_id
    ).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(a)
    if committee.assigned_students > 0:
        committee.assigned_students -= 1
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="student_assignment",
            entity_id=str(a.id),
            action="delete",
            description=f"Removed student {student_id} from committee {committee_id}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)
