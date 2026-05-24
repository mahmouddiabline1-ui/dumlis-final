from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id

router = APIRouter()


@router.get("/")
def list_departments(
    faculty_id: Optional[str] = Query(None, description="Filter by faculty"),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id)
):
    """List departments, strictly scoped by faculty for faculty admins."""
    q = db.query(models.Department)

    # Enforce isolation: scoped_faculty_id takes precedence over query param
    effective_faculty_id = scoped_faculty_id or faculty_id
    if effective_faculty_id:
        q = q.filter(models.Department.faculty_id == effective_faculty_id)

    depts = q.all()
    return [
        {
            'id': d.id,
            'faculty_id': d.faculty_id,
            'name': d.name,
            'code': d.code,
            'head_name': d.head_name,
        }
        for d in depts
    ]


@router.get("/{department_id}")
def get_department(
    department_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.Department).options(
        joinedload(models.Department.students),
        joinedload(models.Department.courses),
        joinedload(models.Department.programs)
    ).filter(models.Department.id == department_id)

    if scoped_faculty_id:
        q = q.filter(models.Department.faculty_id == scoped_faculty_id)

    dept = q.first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found or access denied")
    return dept


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.DepartmentResponse)
def create_department(
    data: schemas.DepartmentCreate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    if db.query(models.Department).filter(models.Department.id == data.id).first():
        raise HTTPException(status_code=409, detail="Department ID already exists")

    dept_data = data.model_dump()
    # Force faculty_id from token for non-super-admins
    if scoped_faculty_id:
        dept_data['faculty_id'] = scoped_faculty_id

    dept = models.Department(**dept_data)
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept


@router.put("/{department_id}", response_model=schemas.DepartmentResponse)
def update_department(
    department_id: str,
    data: schemas.DepartmentUpdate,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.Department).filter(models.Department.id == department_id)
    if scoped_faculty_id:
        q = q.filter(models.Department.faculty_id == scoped_faculty_id)
    dept = q.first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found or access denied")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(dept, k, v)
    db.commit()
    db.refresh(dept)
    return dept


@router.delete("/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(
    department_id: str,
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.Department).filter(models.Department.id == department_id)
    if scoped_faculty_id:
        q = q.filter(models.Department.faculty_id == scoped_faculty_id)
    dept = q.first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found or access denied")
    db.delete(dept)
    db.commit()
