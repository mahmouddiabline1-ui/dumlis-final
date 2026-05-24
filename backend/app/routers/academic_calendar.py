from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter()

@router.get("/")
def list_events(
    faculty_id: Optional[str] = Query(None),
    academic_year: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List academic calendar events."""
    q = db.query(models.AcademicCalendar)
    if scoped_faculty_id:
        q = q.filter((models.AcademicCalendar.faculty_id == scoped_faculty_id) | (models.AcademicCalendar.faculty_id == None))
    elif faculty_id:
        q = q.filter((models.AcademicCalendar.faculty_id == faculty_id) | (models.AcademicCalendar.faculty_id == None))
    if academic_year:
        q = q.filter(models.AcademicCalendar.academic_year == academic_year)
    if event_type:
        q = q.filter(models.AcademicCalendar.event_type == event_type)
    return q.order_by(models.AcademicCalendar.start_date).all()

@router.get("/{event_id}")
def get_event(
    event_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get calendar event by ID."""
    event = db.query(models.AcademicCalendar).filter(models.AcademicCalendar.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.AcademicCalendarResponse)
def create_event(
    data: schemas.AcademicCalendarCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Create a new calendar event."""
    event = models.AcademicCalendar(**data.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="academic_event",
        entity_id=event.id,
        action="create",
        description=f"Created {data.event_type} event for {data.academic_year}"
    )

    return event

@router.put("/{event_id}", response_model=schemas.AcademicCalendarResponse)
def update_event(
    event_id: str,
    data: schemas.AcademicCalendarUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Update calendar event."""
    event = db.query(models.AcademicCalendar).filter(models.AcademicCalendar.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(event, k, v)
    db.commit()
    db.refresh(event)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="academic_event",
        entity_id=event_id,
        action="update",
        description=f"Updated {event.event_type} event"
    )

    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Delete calendar event."""
    event = db.query(models.AcademicCalendar).filter(models.AcademicCalendar.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="academic_event",
        entity_id=event_id,
        action="delete",
        description=f"Deleted {event.event_type} event"
    )
