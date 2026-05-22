from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_user, get_scoped_faculty_id
from app.activity_helper import log_activity

router = APIRouter()

@router.get("/")
def list_documents(
    student_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    q = db.query(models.StudentDocument)
    if student_id:
        q = q.filter(models.StudentDocument.student_id == student_id)
    return q.all()

@router.post("/")
def create_document(
    data: schemas.StudentDocumentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id)
):
    # Check if student exists
    student = db.query(models.Student).filter(models.Student.student_id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    document = models.StudentDocument(**data.model_dump())
    db.add(document)
    db.commit()
    db.refresh(document)

    log_activity(
        db=db,
        user_id=current_user.id,
        faculty_id=scoped_faculty_id,
        entity_type="student_document",
        entity_id=str(document.id),
        action="create",
        description=f"Created student document for {data.student_id}"
    )

    return document

@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id)
):
    doc = db.query(models.StudentDocument).filter(models.StudentDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()

    log_activity(
        db=db,
        user_id=current_user.id,
        faculty_id=scoped_faculty_id,
        entity_type="student_document",
        entity_id=str(doc_id),
        action="delete",
        description="Deleted student document"
    )
