import logging
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_user, get_scoped_faculty_id
from app.activity_helper import log_activity

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/")
def list_requirements(
    student_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    q = db.query(models.StudentRequirement)
    if student_id:
        q = q.filter(models.StudentRequirement.student_id == student_id)
    return q.all()

@router.post("/", response_model=schemas.StudentRequirementResponse, status_code=status.HTTP_201_CREATED)
def create_requirement(
    data: schemas.StudentRequirementCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id)
):
    # Check if student exists
    student = db.query(models.Student).filter(models.Student.student_id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Reuse or create
    existing = db.query(models.StudentRequirement).filter(
        models.StudentRequirement.student_id == data.student_id,
        models.StudentRequirement.requirement_key == data.requirement_key
    ).first()

    if existing:
        for k, v in data.model_dump(exclude_none=True).items():
            setattr(existing, k, v)
        db.commit()
        db.refresh(existing)

        try:
            log_activity(
                db=db,
                user_id=current_user.id,
                faculty_id=scoped_faculty_id,
                entity_type="student_requirement",
                entity_id=str(existing.id),
                action="update",
                description=f"Updated student requirement for {data.student_id}"
            )
        except Exception as _e:
            logger.warning("Activity log failed: %s", _e)

        return existing

    requirement = models.StudentRequirement(**data.model_dump())
    db.add(requirement)
    db.commit()
    db.refresh(requirement)

    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            faculty_id=scoped_faculty_id,
            entity_type="student_requirement",
            entity_id=str(requirement.id),
            action="create",
            description=f"Created student requirement for {data.student_id}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return requirement

@router.put("/{req_id}", response_model=schemas.StudentRequirementResponse)
def update_requirement(
    req_id: int,
    data: schemas.StudentRequirementUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id)
):
    requirement = db.query(models.StudentRequirement).filter(models.StudentRequirement.id == req_id).first()
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")

    for k, v in data.model_dump(exclude_none=True).items():
        setattr(requirement, k, v)

    db.commit()
    db.refresh(requirement)

    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            faculty_id=scoped_faculty_id,
            entity_type="student_requirement",
            entity_id=str(req_id),
            action="update",
            description="Updated student requirement"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return requirement

@router.post("/bulk", response_model=List[schemas.StudentRequirementResponse])
def bulk_create_requirements(
    data: List[schemas.StudentRequirementCreate],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id)
):
    results = []
    for item in data:
        existing = db.query(models.StudentRequirement).filter(
            models.StudentRequirement.student_id == item.student_id,
            models.StudentRequirement.requirement_key == item.requirement_key
        ).first()

        if existing:
            for k, v in item.model_dump(exclude_none=True).items():
                setattr(existing, k, v)
        else:
            existing = models.StudentRequirement(**item.model_dump())
            db.add(existing)
        results.append(existing)

    db.commit()
    for res in results:
        db.refresh(res)

    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            faculty_id=scoped_faculty_id,
            entity_type="student_requirement",
            entity_id=None,
            action="bulk_create",
            description=f"Bulk created {len(results)} student requirements"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return results
