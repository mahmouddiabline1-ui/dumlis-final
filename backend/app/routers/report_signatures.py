from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.schemas import ReportSignatureCreate, ReportSignatureUpdate, ReportSignatureResponse
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter()

@router.get("/")
def get_report_signatures(
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id)
):
    """Retrieve all report signatures, scoped by faculty."""
    q = db.query(models.ReportSignature)
    if scoped_faculty_id:
        q = q.filter(models.ReportSignature.faculty_id == scoped_faculty_id)

    sigs = q.order_by(models.ReportSignature.report_name, models.ReportSignature.order).all()
    return [
        {
            'id': s.id,
            'faculty_id': s.faculty_id,
            'report_name': s.report_name,
            'signatory_name': s.signatory_name,
            'title': s.title,
            'order': s.order,
            'is_active': s.is_active
        }
        for s in sigs
    ]

@router.get("/{id}")
def get_report_signature(
    id: str, 
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id)
):
    """Get a specific report signature by ID, scoped by faculty."""
    q = db.query(models.ReportSignature).filter(models.ReportSignature.id == id)
    if scoped_faculty_id:
        q = q.filter(models.ReportSignature.faculty_id == scoped_faculty_id)
        
    db_signature = q.first()
    if not db_signature:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Signature not found or access denied")
    return db_signature

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ReportSignatureResponse)
def create_report_signature(
    signature: ReportSignatureCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Create a new report signature within the user's faculty."""
    if db.query(models.ReportSignature).filter(models.ReportSignature.id == signature.id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Signature ID already exists")

    new_signature = models.ReportSignature(**signature.model_dump())
    if scoped_faculty_id:
        new_signature.faculty_id = scoped_faculty_id

    db.add(new_signature)
    db.commit()
    db.refresh(new_signature)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="report_signature",
        entity_id=str(new_signature.id),
        action="create",
        description=f"Created report signature: {signature.signatory_name}"
    )

    return new_signature

@router.put("/{id}", response_model=ReportSignatureResponse)
def update_report_signature(
    id: str,
    signature_update: ReportSignatureUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Update an existing report signature, scoped by faculty."""
    q = db.query(models.ReportSignature).filter(models.ReportSignature.id == id)
    if scoped_faculty_id:
        q = q.filter(models.ReportSignature.faculty_id == scoped_faculty_id)

    db_signature = q.first()
    if not db_signature:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Signature not found or access denied")

    update_data = signature_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_signature, key, value)

    db.commit()
    db.refresh(db_signature)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="report_signature",
        entity_id=str(id),
        action="update",
        description="Updated report signature"
    )

    return db_signature

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report_signature(
    id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Delete a report signature, scoped by faculty."""
    q = db.query(models.ReportSignature).filter(models.ReportSignature.id == id)
    if scoped_faculty_id:
        q = q.filter(models.ReportSignature.faculty_id == scoped_faculty_id)

    db_signature = q.first()
    if not db_signature:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Signature not found or access denied")

    db.delete(db_signature)
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="report_signature",
        entity_id=str(id),
        action="delete",
        description="Deleted report signature"
    )

    return None
