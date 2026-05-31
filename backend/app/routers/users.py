import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from app.routers.auth import pwd_context, get_current_user
from app.activity_helper import log_activity
import uuid

router = APIRouter()
logger = logging.getLogger(__name__)


def _require_super_admin(current_user: models.User):
    """Raise 403 if the caller is not a super_admin."""
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="هذه العملية متاحة للمدير العام فقط"
        )


@router.get("/")
def list_users(
    faculty_id: Optional[str] = None,
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """List users. Faculty admins can only see users in their own faculty."""
    query = db.query(models.User)
    if current_user.role != "super_admin":
        # Faculty admins can only view their own faculty's users
        query = query.filter(models.User.faculty_id == current_user.faculty_id)
    else:
        if faculty_id:
            query = query.filter(models.User.faculty_id == faculty_id)
    if role:
        query = query.filter(models.User.role == role)
    return query.all()


@router.post("/", response_model=schemas.UserResponse, status_code=201)
def create_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a new user. Only super_admin can create users or assign super_admin role."""
    # Only super_admin can create users
    _require_super_admin(current_user)

    db_user = db.query(models.User).filter(models.User.username == user_in.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="اسم المستخدم موجود بالفعل")

    hashed_password = pwd_context.hash(user_in.password)
    db_user = models.User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_password,
        role=user_in.role,
        faculty_id=user_in.faculty_id,
        is_active=user_in.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            faculty_id=None,
            entity_type="user",
            entity_id=str(db_user.id),
            action="create",
            description=f"Created user: {user_in.username}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return db_user


@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: uuid.UUID,
    user_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update a user. Only super_admin can modify users."""
    _require_super_admin(current_user)

    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")

    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)

    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            faculty_id=None,
            entity_type="user",
            entity_id=str(user_id),
            action="update",
            description="Updated user"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return db_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a user. Only super_admin can delete users."""
    _require_super_admin(current_user)

    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")
    db.delete(db_user)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            faculty_id=None,
            entity_type="user",
            entity_id=str(user_id),
            action="delete",
            description="Deleted user"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return None
