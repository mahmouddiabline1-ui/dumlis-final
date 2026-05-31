import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[schemas.SystemSetting])
def list_settings(
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id)
):
    query = db.query(models.SystemSetting)
    if scoped_faculty_id:
        query = query.filter(
            (models.SystemSetting.faculty_id == scoped_faculty_id) |
            (models.SystemSetting.faculty_id == None)
        )
    return query.all()

@router.post("/", response_model=schemas.SystemSetting, status_code=status.HTTP_201_CREATED)
def create_setting(
    data: schemas.SystemSettingCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    if scoped_faculty_id:
        data.faculty_id = scoped_faculty_id

    db_setting = models.SystemSetting(**data.model_dump())
    db.add(db_setting)
    db.commit()
    db.refresh(db_setting)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="system_setting",
            entity_id=str(db_setting.id),
            action="create",
            description=f"Created system setting: {data.key}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return db_setting

@router.put("/{setting_id}", response_model=schemas.SystemSetting)
def update_setting(
    setting_id: str,
    data: schemas.SystemSettingUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    query = db.query(models.SystemSetting).filter(models.SystemSetting.id == setting_id)
    if scoped_faculty_id:
        query = query.filter(
            (models.SystemSetting.faculty_id == scoped_faculty_id) |
            (models.SystemSetting.faculty_id == None)
        )

    setting = query.first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")

    for key, value in data.model_dump(exclude_none=True).items():
        setattr(setting, key, value)

    db.commit()
    db.refresh(setting)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="system_setting",
            entity_id=str(setting_id),
            action="update",
            description="Updated system setting"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return setting


@router.delete("/{setting_id}", status_code=204)
def delete_setting(
    setting_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    query = db.query(models.SystemSetting).filter(models.SystemSetting.id == setting_id)
    if scoped_faculty_id:
        query = query.filter(
            (models.SystemSetting.faculty_id == scoped_faculty_id) |
            (models.SystemSetting.faculty_id == None)
        )
    setting = query.first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    db.delete(setting)
    db.commit()
