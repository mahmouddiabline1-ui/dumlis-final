import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user
from app.activity_helper import log_activity

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/")
def list_survey_rules(
    db: Session = Depends(get_db),
    faculty_id: Optional[str] = None,
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List all survey rules, scoped by faculty."""
    q = db.query(models.SurveyRule)

    # Apply faculty filter
    if scoped_faculty_id:
        q = q.filter(models.SurveyRule.faculty_id == scoped_faculty_id)
    elif faculty_id:
        q = q.filter(models.SurveyRule.faculty_id == faculty_id)

    rules = q.all()
    return [
        {
            'id': str(r.id),
            'code': r.code,
            'name': r.name,
            'target': r.target,
            'start_date': r.start_date.isoformat() if r.start_date else None,
            'end_date': r.end_date.isoformat() if r.end_date else None,
            'status': r.status,
            'faculty_id': r.faculty_id,
        }
        for r in rules
    ]


@router.get("/{rule_id}")
def get_survey_rule(
    rule_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """Get a single survey rule by ID."""
    q = db.query(models.SurveyRule).filter(models.SurveyRule.id == rule_id)
    if scoped_faculty_id:
        q = q.filter(models.SurveyRule.faculty_id == scoped_faculty_id)

    rule = q.first()
    if not rule:
        raise HTTPException(status_code=404, detail="Survey Rule not found or access denied")

    return {
        'id': str(rule.id),
        'code': rule.code,
        'name': rule.name,
        'target': rule.target,
        'start_date': rule.start_date.isoformat() if rule.start_date else None,
        'end_date': rule.end_date.isoformat() if rule.end_date else None,
        'status': rule.status,
        'faculty_id': rule.faculty_id,
    }


@router.post("/", response_model=schemas.SurveyRuleResponse, status_code=status.HTTP_201_CREATED)
def create_survey_rule(
    data: schemas.SurveyRuleCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Create a new survey rule."""
    if db.query(models.SurveyRule).filter(models.SurveyRule.code == data.code).first():
        raise HTTPException(status_code=409, detail="Survey Rule with this code already exists")

    rule = models.SurveyRule(
        code=data.code,
        name=data.name,
        target=data.target,
        start_date=data.start_date,
        end_date=data.end_date,
        status=data.status,
        faculty_id=scoped_faculty_id,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="survey_rule",
            entity_id=str(rule.id),
            action="create",
            description=f"Created survey rule: {data.name}"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return rule


@router.put("/{rule_id}", response_model=schemas.SurveyRuleResponse)
def update_survey_rule(
    rule_id: str,
    data: schemas.SurveyRuleUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Update a survey rule."""
    q = db.query(models.SurveyRule).filter(models.SurveyRule.id == rule_id)
    if scoped_faculty_id:
        q = q.filter(models.SurveyRule.faculty_id == scoped_faculty_id)

    rule = q.first()
    if not rule:
        raise HTTPException(status_code=404, detail="Survey Rule not found or access denied")

    for k, v in data.model_dump(exclude_none=True).items():
        setattr(rule, k, v)

    db.commit()
    db.refresh(rule)

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="survey_rule",
            entity_id=str(rule_id),
            action="update",
            description="Updated survey rule"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)

    return rule


@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_survey_rule(
    rule_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Delete a survey rule."""
    q = db.query(models.SurveyRule).filter(models.SurveyRule.id == rule_id)
    if scoped_faculty_id:
        q = q.filter(models.SurveyRule.faculty_id == scoped_faculty_id)

    rule = q.first()
    if not rule:
        raise HTTPException(status_code=404, detail="Survey Rule not found or access denied")

    db.delete(rule)
    db.commit()

    try:
        log_activity(
            db=db,
            user_id=user.id,
            faculty_id=scoped_faculty_id,
            entity_type="survey_rule",
            entity_id=str(rule_id),
            action="delete",
            description="Deleted survey rule"
        )
    except Exception as _e:
        logger.warning("Activity log failed: %s", _e)
