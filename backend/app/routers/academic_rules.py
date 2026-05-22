from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity
from typing import Optional

router = APIRouter()

from sqlalchemy import select

@router.get("/")
def list_academic_rules(
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
):
    """List all academic rules, scoped by faculty."""
    q = db.query(models.AcademicRule)
    if scoped_faculty_id:
        q = q.filter(models.AcademicRule.faculty_id == scoped_faculty_id)

    rules = q.all()
    return [
        {
            'id': r.id,
            'faculty_id': r.faculty_id,
            'rule_name': r.rule_name,
            'description': r.description,
        }
        for r in rules
    ]

@router.get("/by-faculty/{faculty_id}")
def get_academic_rule_by_faculty(
    faculty_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id)
):
    """Get academic rules for a specific faculty, enforced by scoping."""
    if scoped_faculty_id and faculty_id != scoped_faculty_id:
         raise HTTPException(status_code=403, detail="Access denied to this faculty's rules")

    rule = db.query(models.AcademicRule).filter(models.AcademicRule.faculty_id == faculty_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Academic Rule not found for this faculty")
    return rule

@router.get("/{rule_id}")
def get_academic_rule(
    rule_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """Get a single academic rule by ID."""
    q = db.query(models.AcademicRule).filter(models.AcademicRule.id == rule_id)
    if scoped_faculty_id:
        q = q.filter(models.AcademicRule.faculty_id == scoped_faculty_id)

    rule = q.first()
    if not rule:
        raise HTTPException(status_code=404, detail="Academic Rule not found or access denied")
    return rule

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_academic_rule(
    data: schemas.AcademicRuleCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    # Enforce faculty_id from token if not super_admin
    if scoped_faculty_id:
        data.faculty_id = scoped_faculty_id

    """Create or update an academic rule for a faculty (upsert)."""
    # Check if rule with this ID already exists
    existing_rule = db.query(models.AcademicRule).filter(models.AcademicRule.id == data.id).first()

    if existing_rule:
        # Update existing rule
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(existing_rule, key, value)
        db.commit()
        db.refresh(existing_rule)

        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="academic_rule",
            entity_id=str(existing_rule.id),
            action="update",
            description="Updated academic rule"
        )

        return existing_rule

    # Check if faculty already has a rule (if no ID specified, use default ID)
    if not data.id:
        data.id = f"RULE_{data.faculty_id}"

    existing_by_faculty = db.query(models.AcademicRule).filter(
        models.AcademicRule.faculty_id == data.faculty_id
    ).first()

    if existing_by_faculty:
        # Update the existing rule for this faculty
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(existing_by_faculty, key, value)
        db.commit()
        db.refresh(existing_by_faculty)

        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="academic_rule",
            entity_id=str(existing_by_faculty.id),
            action="update",
            description="Updated academic rule"
        )

        return existing_by_faculty

    # Create new rule
    rule = models.AcademicRule(**data.model_dump())
    db.add(rule)
    db.commit()
    db.refresh(rule)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="academic_rule",
        entity_id=str(rule.id),
        action="create",
        description="Created academic rule"
    )

    return rule

@router.put("/{rule_id}")
def update_academic_rule(
    rule_id: str,
    data: schemas.AcademicRuleUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Update an academic rule, enforced by scoping."""
    query = db.query(models.AcademicRule).filter(models.AcademicRule.id == rule_id)
    if scoped_faculty_id:
        query = query.filter(models.AcademicRule.faculty_id == scoped_faculty_id)

    rule = query.first()
    if not rule:
        raise HTTPException(status_code=404, detail="Academic Rule not found or access denied")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(rule, key, value)
    db.commit()
    db.refresh(rule)

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="academic_rule",
        entity_id=str(rule_id),
        action="update",
        description="Updated academic rule"
    )

    return rule

@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_academic_rule(
    rule_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    """Delete an academic rule, enforced by scoping."""
    query = db.query(models.AcademicRule).filter(models.AcademicRule.id == rule_id)
    if scoped_faculty_id:
        query = query.filter(models.AcademicRule.faculty_id == scoped_faculty_id)

    rule = query.first()
    if not rule:
        raise HTTPException(status_code=404, detail="Academic Rule not found or access denied")
    db.delete(rule)
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="academic_rule",
        entity_id=str(rule_id),
        action="delete",
        description="Deleted academic rule"
    )
