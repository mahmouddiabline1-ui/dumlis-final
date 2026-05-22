from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id

router = APIRouter()


@router.get("/")
def list_activities(
    entity_type: Optional[str] = Query(None),
    limit: int = Query(200, ge=1, le=500),
    db: Session = Depends(get_db),
    # faculty_id is now ALWAYS derived from the JWT token, not accepted as raw query param
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List activity logs — faculty_id is enforced from the JWT token, not a raw query param."""
    q = db.query(models.ActivityLog).order_by(models.ActivityLog.performed_at.desc())
    if scoped_faculty_id:
        q = q.filter(models.ActivityLog.faculty_id == scoped_faculty_id)
    if entity_type:
        q = q.filter(models.ActivityLog.entity_type == entity_type)
    return q.limit(limit).all()


@router.post("/")
def create_activity(
    data: schemas.ActivityLogCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """Create an activity log entry — faculty_id is set from token."""
    activity_data = data.model_dump()
    if scoped_faculty_id:
        activity_data['faculty_id'] = scoped_faculty_id
    activity = models.ActivityLog(**activity_data)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity
