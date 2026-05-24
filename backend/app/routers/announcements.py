from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter()

@router.get("/")
def list_announcements(
    faculty_id: Optional[str] = Query(None),
    role_target: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List announcements (only active and non-expired)."""
    q = db.query(models.Announcement).filter(models.Announcement.is_active == True)

    if scoped_faculty_id:
        q = q.filter((models.Announcement.faculty_id == scoped_faculty_id) | (models.Announcement.faculty_id == None))
    elif faculty_id:
        q = q.filter((models.Announcement.faculty_id == faculty_id) | (models.Announcement.faculty_id == None))

    if role_target:
        q = q.filter((models.Announcement.role_target == role_target) | (models.Announcement.role_target == None))

    now = datetime.now()
    q = q.filter((models.Announcement.expires_at == None) | (models.Announcement.expires_at > now))

    return q.order_by(models.Announcement.created_at.desc()).all()

@router.get("/{announcement_id}")
def get_announcement(
    announcement_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get announcement by ID (only active and non-expired)."""
    now = datetime.now()
    announcement = db.query(models.Announcement).filter(
        models.Announcement.id == announcement_id,
        models.Announcement.is_active == True,
        (models.Announcement.expires_at == None) | (models.Announcement.expires_at > now)
    ).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found or expired")
    return announcement

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.AnnouncementResponse)
def create_announcement(
    data: schemas.AnnouncementCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Create a new announcement."""
    announcement = models.Announcement(**data.model_dump())
    db.add(announcement)
    db.commit()
    db.refresh(announcement)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="announcement",
        entity_id=str(announcement.id),
        action="create",
        description=f"Created announcement: {data.title}"
    )

    return announcement

@router.put("/{announcement_id}", response_model=schemas.AnnouncementResponse)
def update_announcement(
    announcement_id: str,
    data: schemas.AnnouncementUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Update announcement."""
    announcement = db.query(models.Announcement).filter(models.Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(announcement, k, v)
    db.commit()
    db.refresh(announcement)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="announcement",
        entity_id=str(announcement_id),
        action="update",
        description="Updated announcement"
    )

    return announcement

@router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(
    announcement_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Delete announcement (soft delete - mark as inactive)."""
    announcement = db.query(models.Announcement).filter(models.Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    announcement.is_active = False
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="announcement",
        entity_id=str(announcement_id),
        action="delete",
        description="Deleted announcement"
    )
