from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id, get_current_user

router = APIRouter()

@router.get("/")
def list_financial(
    student_id    : Optional[str] = Query(None),
    status        : Optional[str] = Query(None),
    fee_type      : Optional[str] = Query(None),
    academic_year : Optional[str] = Query(None),
    skip          : int           = Query(0, ge=0),
    limit         : int           = Query(200, ge=1, le=2000),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List financial records."""
    q = db.query(models.FinancialRecord)
    if scoped_faculty_id:
        q = q.filter(models.FinancialRecord.faculty_id == scoped_faculty_id)
    if student_id:
        q = q.filter(models.FinancialRecord.student_id == student_id)
    if status:
        q = q.filter(models.FinancialRecord.status == status)
    if fee_type:
        q = q.filter(models.FinancialRecord.fee_type == fee_type)
    if academic_year:
        q = q.filter(models.FinancialRecord.academic_year == academic_year)

    records = q.offset(skip).limit(limit).all()
    return [
        {
            'id': r.id,
            'student_id': r.student_id,
            'faculty_id': r.faculty_id,
            'fee_type': r.fee_type or '',
            'description': r.description or '',
            'amount': r.amount,
            'paid_amount': r.paid_amount,
            'status': r.status,
            'academic_year': r.academic_year or '',
            'semester': r.semester or '',
            'due_date': r.due_date.isoformat() if r.due_date else None,
            'payment_date': r.payment_date.isoformat() if r.payment_date else None,
            'receipt_no': r.receipt_no or '',
        }
        for r in records
    ]


@router.get("/student/{student_id}/summary")
def financial_summary(
    student_id: str, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """
    Financial summary for a student.

    Example response:
    ```json
    {
      "student_id": "20240001",
      "total_due": 6800,
      "total_paid": 6000,
      "remaining": 800,
      "status": "مسدد جزئياً"
    }
    ```
    """
    q = db.query(models.FinancialRecord).filter(models.FinancialRecord.student_id == student_id)
    if scoped_faculty_id:
        q = q.filter(models.FinancialRecord.faculty_id == scoped_faculty_id)
    
    records = q.all()
    total_due  = sum(r.amount for r in records)
    total_paid = sum(r.paid_amount for r in records)
    remaining  = total_due - total_paid
    fin_status = "مسدد" if remaining <= 0 else ("مسدد جزئياً" if total_paid > 0 else "غير مسدد")
    return {"student_id": student_id, "total_due": total_due, "total_paid": total_paid,
            "remaining": remaining, "status": fin_status}

# ── Fee Setup ──────────────────────────────────────────────────────
@router.get("/fee-setup/")
def list_fee_setup(
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List fee setup records — scoped to faculty."""
    q = db.query(models.FeeSetup)
    if scoped_faculty_id:
        # Show faculty-specific AND global (null faculty_id) setups
        q = q.filter(
            (models.FeeSetup.faculty_id == scoped_faculty_id) |
            (models.FeeSetup.faculty_id == None)
        )
    return q.all()


@router.post("/fee-setup/", status_code=status.HTTP_201_CREATED, response_model=schemas.FeeSetupResponse)
def create_fee_setup(
    data: schemas.FeeSetupCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """
    Define fee type and amount for a faculty/level.

    Example request:
    ```json
    {
      "faculty_id": "FCAI",
      "fee_type": "رسوم الفصل الدراسي",
      "level": "المستوى الأول",
      "amount": 5500,
      "semester": "خريف",
      "academic_year": "2024-2025",
      "status": "نشط"
    }
    ```
    """
    setup_data = data.model_dump()
    if scoped_faculty_id:
        setup_data['faculty_id'] = scoped_faculty_id
    setup = models.FeeSetup(**setup_data)
    db.add(setup)
    db.commit()
    db.refresh(setup)
    return setup

@router.get("/{record_id}")
def get_financial_record(
    record_id: int, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.FinancialRecord).filter(models.FinancialRecord.id == record_id)
    if scoped_faculty_id:
        q = q.filter(models.FinancialRecord.faculty_id == scoped_faculty_id)
    
    r = q.first()
    if not r:
        raise HTTPException(status_code=404, detail="Financial record not found or access denied")
    return r

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.FinancialRecordResponse)
def create_financial_record(
    data: schemas.FinancialRecordCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    # Enforce faculty_id from token if not super_admin
    if scoped_faculty_id:
        data.faculty_id = scoped_faculty_id

    """
    Create a fee record for a student.

    Example request:
    ```json
    {
      "student_id": "20240001",
      "fee_type": "رسوم دراسية",
      "description": "رسوم الفصل الدراسي خريف 2024",
      "semester": "2024-2025 خريف",
      "academic_year": "2024-2025",
      "amount": 6000,
      "paid_amount": 0,
      "due_date": "2024-10-15",
      "status": "غير مسدد"
    }
    ```
    """
    record = models.FinancialRecord(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)

    activity = models.ActivityLog(
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="financial_record",
        entity_id=str(record.id),
        action="create",
        description=f"Created financial record for {data.student_id}"
    )
    db.add(activity)
    db.commit()

    return record

@router.put("/{record_id}", response_model=schemas.FinancialRecordResponse)
def update_financial_record(
    record_id: int,
    data: schemas.FinancialRecordUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    """Record or update a payment."""
    q = db.query(models.FinancialRecord).filter(models.FinancialRecord.id == record_id)
    if scoped_faculty_id:
        q = q.filter(models.FinancialRecord.faculty_id == scoped_faculty_id)

    r = q.first()
    if not r:
        raise HTTPException(status_code=404, detail="Financial record not found or access denied")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(r, k, v)
    # Auto-update status
    if r.paid_amount >= r.amount:
        r.status = "مسدد"
    elif r.paid_amount > 0:
        r.status = "مسدد جزئياً"
    db.commit()
    db.refresh(r)

    activity = models.ActivityLog(
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="financial_record",
        entity_id=str(record_id),
        action="update",
        description=f"Updated financial record: paid_amount={r.paid_amount}, status={r.status}"
    )
    db.add(activity)
    db.commit()

    return r

@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_financial_record(
    record_id: int,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
    user: models.User = Depends(get_current_user),
):
    q = db.query(models.FinancialRecord).filter(models.FinancialRecord.id == record_id)
    if scoped_faculty_id:
        q = q.filter(models.FinancialRecord.faculty_id == scoped_faculty_id)

    r = q.first()
    if not r:
        raise HTTPException(status_code=404, detail="Financial record not found or access denied")
    db.delete(r)
    db.commit()

    activity = models.ActivityLog(
        user_id=user.id,
        faculty_id=scoped_faculty_id,
        entity_type="financial_record",
        entity_id=str(record_id),
        action="delete",
        description="Deleted financial record"
    )
    db.add(activity)
    db.commit()
