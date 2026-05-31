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
def list_requests(
    student_id : Optional[str] = Query(None),
    status     : Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List registration requests — auth required, scoped to faculty."""
    q = db.query(models.RegistrationRequest)
    if scoped_faculty_id:
        q = q.filter(models.RegistrationRequest.faculty_id == scoped_faculty_id)
    if student_id:
        q = q.filter(models.RegistrationRequest.student_id == student_id)
    if status:
        q = q.filter(models.RegistrationRequest.status == status)
    return q.order_by(models.RegistrationRequest.created_at.desc()).all()


# ── Student Blocks ──────────────────────────────────────────────────
@router.get("/blocks/")
def list_blocks(
    student_id : Optional[str] = Query(None),
    status     : Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List student registration blocks — scoped to faculty."""
    q = db.query(models.StudentBlock)
    if scoped_faculty_id:
        q = q.filter(models.StudentBlock.faculty_id == scoped_faculty_id)
    if student_id:
        q = q.filter(models.StudentBlock.student_id == student_id)
    if status:
        q = q.filter(models.StudentBlock.status == status)
    return q.all()


@router.post("/blocks/", response_model=schemas.StudentBlockResponse, status_code=status.HTTP_201_CREATED)
def create_block(
    data: schemas.StudentBlockCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """
    Block a student's registration.

    Example request:
    ```json
    {
      "student_id": "20210001",
      "reason": "عدم سداد الرسوم",
      "notes": "مطلوب سداد الرسوم قبل التسجيل"
    }
    ```
    """
    block_data = data.model_dump()
    if scoped_faculty_id:
        block_data['faculty_id'] = scoped_faculty_id
    block_data['blocked_by'] = current_user.id

    block = models.StudentBlock(**block_data)
    db.add(block)
    db.commit()
    db.refresh(block)

    try:
        log_activity(
            db=db,
            user_id=current_user.id,
            faculty_id=scoped_faculty_id,
            entity_type="student_block",
            entity_id=str(block.id),
            action="create",
            description=f"Created student block for {data.student_id}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return block


@router.put("/blocks/{block_id}", response_model=schemas.StudentBlockResponse)
def update_block(
    block_id: int,
    data: schemas.StudentBlockUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Lift or update a student block."""
    q = db.query(models.StudentBlock).filter(models.StudentBlock.id == block_id)
    if scoped_faculty_id:
        q = q.filter(models.StudentBlock.faculty_id == scoped_faculty_id)
    b = q.first()
    if not b:
        raise HTTPException(status_code=404, detail="Block not found or access denied")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(b, k, v)
    db.commit()
    db.refresh(b)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="student_block",
            entity_id=str(block_id),
            action="update",
            description="Updated student block"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return b


@router.get("/{request_id}")
def get_request(
    request_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.RegistrationRequest).filter(models.RegistrationRequest.id == request_id)
    if scoped_faculty_id:
        q = q.filter(models.RegistrationRequest.faculty_id == scoped_faculty_id)
    r = q.first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found or access denied")
    return r


@router.post("/", response_model=schemas.RegistrationRequestResponse, status_code=status.HTTP_201_CREATED)
def create_request(
    data: schemas.RegistrationRequestCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """
    Submit a new registration issue request.

    Example request:
    ```json
    {
      "id": "REQ-2024-001",
      "student_id": "20240001",
      "comment": "لا يمكنني تسجيل مقرر CS305 بسبب المتطلب السابق رغم نجاحي فيه."
    }
    ```
    """
    if db.query(models.RegistrationRequest).filter(models.RegistrationRequest.id == data.id).first():
        raise HTTPException(status_code=409, detail="Request ID already exists")

    req_data = data.model_dump()
    if scoped_faculty_id:
        req_data['faculty_id'] = scoped_faculty_id

    req = models.RegistrationRequest(**req_data)
    db.add(req)
    db.commit()
    db.refresh(req)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="registration_request",
            entity_id=str(req.id),
            action="create",
            description=f"Created registration request for student {data.student_id}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return req


@router.put("/{request_id}", response_model=schemas.RegistrationRequestResponse)
def update_request(
    request_id: str,
    data: schemas.RegistrationRequestUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Admin approves or rejects a registration request and provides a response."""
    from datetime import datetime
    q = db.query(models.RegistrationRequest).filter(models.RegistrationRequest.id == request_id)
    if scoped_faculty_id:
        q = q.filter(models.RegistrationRequest.faculty_id == scoped_faculty_id)
    r = q.first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found or access denied")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(r, k, v)
    if data.status in ("مقبول", "مرفوض"):
        r.reviewed_at = datetime.now()
    db.commit()
    db.refresh(r)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="registration_request",
            entity_id=str(request_id),
            action="update",
            description="Updated registration request"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return r


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_request(
    request_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.RegistrationRequest).filter(models.RegistrationRequest.id == request_id)
    if scoped_faculty_id:
        q = q.filter(models.RegistrationRequest.faculty_id == scoped_faculty_id)
    r = q.first()
    if not r:
        raise HTTPException(status_code=404, detail="Request not found or access denied")
    db.delete(r)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="registration_request",
            entity_id=str(request_id),
            action="delete",
            description="Deleted registration request"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)
