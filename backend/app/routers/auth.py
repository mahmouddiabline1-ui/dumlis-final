"""
DUMLIS - Authentication Router
Provides JWT-based login and current-user lookup.
"""
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from types import SimpleNamespace
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter()

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "INSECURE_DEV_KEY_change_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


# ── Helpers ───────────────────────────────────────────────────────────────────
def verify_password(plain: str, hashed: str) -> bool:
    # Verify using bcrypt via passlib context
    plain_truncated = plain[:72] if len(plain) > 72 else plain
    try:
        return pwd_context.verify(plain_truncated, hashed)
    except Exception:
        # CRITICAL: Never fall back to plain-text comparison
        # If bcrypt fails, password is invalid
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode["exp"] = expire
    to_encode["iat"] = datetime.now(timezone.utc)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    """Validate JWT and return the associated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user



def get_scoped_faculty_id(
    faculty_id: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
) -> Optional[str]:
    """
    Dependency to enforce faculty isolation based on user role.
    Super admins can access any faculty; other users see only their assigned faculty.
    """
    if current_user.role == "super_admin":
        return faculty_id

    # Force faculty isolation for non-super admins
    return current_user.faculty_id


# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate with username + password, return JWT access token.
    Response includes user_role and student_id (if student role).
    """
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="اسم المستخدم أو كلمة المرور غير صحيحة",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="الحساب غير مفعّل")

    token = create_access_token({
        "sub": user.username,
        "role": user.role,
        "faculty_id": user.faculty_id,
    })

    # Resolve student_id if this user is linked to a student record
    student_id: Optional[str] = None
    if user.role == "student":
        student = db.query(models.Student).filter(models.Student.user_id == user.id).first()
        if student:
            student_id = student.student_id

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_role": user.role,
        "username": user.username,
        "faculty_id": user.faculty_id,
        "student_id": student_id,
    }


@router.get("/me")
def me(current_user: models.User = Depends(get_current_user)):
    """Return current authenticated user info."""
    return {
        "id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "faculty_id": current_user.faculty_id,
        "is_active": current_user.is_active,
    }
