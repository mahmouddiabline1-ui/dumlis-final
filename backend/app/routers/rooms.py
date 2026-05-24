from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_scoped_faculty_id

router = APIRouter()

@router.get("/")
def list_rooms(
    room_type : Optional[str] = Query(None, pattern="^(classroom|lab)$"),
    status    : Optional[str] = Query(None),
    building  : Optional[str] = Query(None),
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    """List all rooms (classrooms and labs) with optional filters."""
    q = db.query(models.Room)
    if scoped_faculty_id:
        q = q.filter(models.Room.faculty_id == scoped_faculty_id)
    if room_type:
        q = q.filter(models.Room.room_type == room_type)
    if status:
        q = q.filter(models.Room.status == status)
    if building:
        q = q.filter(models.Room.building == building)

    rooms = q.order_by(models.Room.room_type, models.Room.code).all()
    return [
        {
            'id': r.id,
            'code': r.code,
            'building': r.building,
            'floor': r.floor,
            'capacity': r.capacity,
            'room_type': r.room_type,
            'faculty_id': r.faculty_id,
            'status': r.status,
        }
        for r in rooms
    ]

@router.get("/{room_id}")
def get_room(
    room_id: str, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.Room).filter(models.Room.id == room_id)
    if scoped_faculty_id:
        q = q.filter(models.Room.faculty_id == scoped_faculty_id)
    
    room = q.first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or access denied")
    return room

@router.post("/", response_model=schemas.RoomResponse, status_code=201)
def create_room(
    data: schemas.RoomCreate, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    # Enforce faculty_id from token if not super_admin
    if scoped_faculty_id:
        data.faculty_id = scoped_faculty_id

    if db.query(models.Room).filter(models.Room.id == data.id).first():
        raise HTTPException(status_code=409, detail="Room ID already exists")

    """
    Create a room (classroom or lab).

    Example request:
    ```json
    {
      "id": "room_101b",
      "code": "101 B",
      "name": "قاعة 101 B",
      "room_type": "classroom",
      "capacity": 150,
      "building": "B",
      "floor": 1,
      "description": "قاعة امتحانات - الدور الأول",
      "equipment": [],
      "status": "available"
    }
    ```
    """
    if db.query(models.Room).filter(models.Room.id == data.id).first():
        raise HTTPException(status_code=409, detail="Room ID already exists")
    room = models.Room(**data.model_dump())
    db.add(room)
    db.commit()
    db.refresh(room)
    return room

@router.put("/{room_id}", response_model=schemas.RoomResponse)
def update_room(
    room_id: str, 
    data: schemas.RoomUpdate, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.Room).filter(models.Room.id == room_id)
    if scoped_faculty_id:
        q = q.filter(models.Room.faculty_id == scoped_faculty_id)
    
    room = q.first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or access denied")
    
    # Resolve update data, prevent changing faculty_id if scoped
    update_data = data.model_dump(exclude_none=True)
    if scoped_faculty_id and "faculty_id" in update_data:
        del update_data["faculty_id"]

    for k, v in update_data.items():
        setattr(room, k, v)
    db.commit()
    db.refresh(room)
    return room

@router.delete("/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(
    room_id: str, 
    db: Session = Depends(get_db),
    scoped_faculty_id: Optional[str] = Depends(get_scoped_faculty_id),
):
    q = db.query(models.Room).filter(models.Room.id == room_id)
    if scoped_faculty_id:
        q = q.filter(models.Room.faculty_id == scoped_faculty_id)
    
    room = q.first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or access denied")
    db.delete(room)
    db.commit()
