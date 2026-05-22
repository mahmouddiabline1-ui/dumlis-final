from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter()

@router.get("/")
def list_staff(
    faculty_id: Optional[str] = Query(None),
    department_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List staff members."""
    q = db.query(models.Staff)
    if scoped_faculty_id:
        q = q.filter(models.Staff.faculty_id == scoped_faculty_id)
    if faculty_id:
        q = q.filter(models.Staff.faculty_id == faculty_id)
    if department_id:
        q = q.filter(models.Staff.department_id == department_id)
    return q.all()

@router.get("/{staff_id}")
def get_staff(
    staff_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get staff member by ID."""
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    return staff

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_staff(
    data: schemas.StaffCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Create a new staff member."""
    staff = models.Staff(**data.model_dump())
    db.add(staff)
    db.commit()
    db.refresh(staff)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="staff",
        entity_id=staff.id,
        action="create",
        description=f"Created staff member {staff.id}"
    )

    return staff

@router.put("/{staff_id}")
def update_staff(
    staff_id: str,
    data: schemas.StaffUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Update staff member."""
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    update_data = data.model_dump(exclude_none=True)
    for k, v in update_data.items():
        setattr(staff, k, v)
    db.commit()
    db.refresh(staff)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="staff",
        entity_id=staff_id,
        action="update",
        description=f"Updated staff member {staff_id}"
    )

    return staff

@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff(
    staff_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Delete staff member."""
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    db.delete(staff)
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="staff",
        entity_id=staff_id,
        action="delete",
        description=f"Deleted staff member {staff_id}"
    )
