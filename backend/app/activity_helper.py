"""Helper functions for activity logging across all routers."""

from sqlalchemy.orm import Session
from app import models
from typing import Optional
import uuid


def log_activity(
    db: Session,
    user_id: Optional[uuid.UUID],
    faculty_id: Optional[str],
    entity_type: str,
    entity_id: Optional[str],
    action: str,
    description: Optional[str] = None,
) -> models.ActivityLog:
    """
    Create and save an activity log entry.

    Args:
        db: Database session
        user_id: UUID of the user performing the action
        faculty_id: Faculty ID (scoped from JWT)
        entity_type: Type of entity (e.g., "attendance", "student", "course")
        entity_id: ID of the entity being modified
        action: Action type ("create", "update", "delete", etc.)
        description: Optional detailed description of the change

    Returns:
        ActivityLog: The created activity log entry
    """
    activity = models.ActivityLog(
        user_id=user_id,
        faculty_id=faculty_id,
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        description=description,
    )
    db.add(activity)
    db.commit()
    return activity
