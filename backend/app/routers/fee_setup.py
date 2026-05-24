from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Union
from app.database import get_db
from app import models
from app.routers.auth import get_scoped_faculty_id, get_current_user
from pydantic import BaseModel, field_validator
from decimal import Decimal

router = APIRouter()

class FeeSetupOut(BaseModel):
    id: int
    faculty_id: Optional[str] = None
    fee_type: str
    level: Optional[str] = None
    amount: float
    semester: Optional[str] = None
    academic_year: Optional[str] = None
    status: str = "نشط"
    class Config:
        from_attributes = True

class FeeSetupCreate(BaseModel):
    fee_type: str
    level: Optional[str] = None
    amount: float
    semester: Optional[str] = None
    academic_year: Optional[str] = None
    faculty_id: Optional[str] = None
    status: str = "نشط"

class FeeSetupUpdate(BaseModel):
    fee_type: Optional[str] = None
    level: Optional[Union[str, int]] = None
    amount: Optional[float] = None
    semester: Optional[str] = None
    academic_year: Optional[str] = None
    status: Optional[str] = None

    @field_validator('level', mode='before')
    @classmethod
    def coerce_level_to_str(cls, v):
        return str(v) if v is not None else v

@router.get("/", response_model=List[FeeSetupOut])
def list_fee_setups(
    faculty_id: Optional[str] = None,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id)
):
    q = db.query(models.FeeSetup)
    fid = scoped_faculty_id or faculty_id
    if fid:
        q = q.filter(models.FeeSetup.faculty_id == fid)
    return q.order_by(models.FeeSetup.id).all()

@router.post("/", response_model=FeeSetupOut, status_code=status.HTTP_201_CREATED)
def create_fee_setup(
    data: FeeSetupCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    if scoped_faculty_id:
        data.faculty_id = scoped_faculty_id
    obj = models.FeeSetup(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{fee_id}", response_model=FeeSetupOut)
def update_fee_setup(
    fee_id: int,
    data: FeeSetupUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    q = db.query(models.FeeSetup).filter(models.FeeSetup.id == fee_id)
    if scoped_faculty_id:
        q = q.filter(models.FeeSetup.faculty_id == scoped_faculty_id)
    obj = q.first()
    if not obj:
        raise HTTPException(status_code=404, detail="Fee setup not found")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{fee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_fee_setup(
    fee_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: str = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user)
):
    q = db.query(models.FeeSetup).filter(models.FeeSetup.id == fee_id)
    if scoped_faculty_id:
        q = q.filter(models.FeeSetup.faculty_id == scoped_faculty_id)
    obj = q.first()
    if not obj:
        raise HTTPException(status_code=404, detail="Fee setup not found")
    db.delete(obj)
    db.commit()
