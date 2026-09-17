from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import create_access_token, get_current_user, verify_password
from app.models import Guest, User, UserRole
from app.schemas import LoginRequest, LoginResponse, UserOut

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


def authenticate(credentials: LoginRequest, role: UserRole, db: Session) -> User:
    username = credentials.username.strip()
    # 1. Direct username match
    user = db.scalar(
        select(User).where(
            User.role == role,
            User.is_active.is_(True),
            User.username == username,
        )
    )
    # 2. Case-insensitive match
    if user is None:
        user = db.scalar(
            select(User).where(
                User.role == role,
                User.is_active.is_(True),
                User.username.ilike(username),
            )
        )
    # 3. Guest lookup by email
    if user is None and role == UserRole.guest:
        guest = db.scalar(select(Guest).where(Guest.email.ilike(username)))
        if guest:
            user = db.scalar(select(User).where(User.guest_id == guest.id, User.role == UserRole.guest))
            if user is None:
                user = User(
                    username=guest.email,
                    password_hash=hash_password("guest123"),
                    role=UserRole.guest,
                    guest_id=guest.id,
                )
                db.add(user)
                db.commit()
                db.refresh(user)

    if user is None or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return user


def login_response(user: User) -> LoginResponse:
    return LoginResponse(access_token=create_access_token(user), user=UserOut.model_validate(user))


@router.post("/login", response_model=LoginResponse)
def staff_login(credentials: LoginRequest, db: Session = Depends(get_db)):
    return login_response(authenticate(credentials, UserRole.staff, db))


@router.post("/guest/login", response_model=LoginResponse)
def guest_login(credentials: LoginRequest, db: Session = Depends(get_db)):
    return login_response(authenticate(credentials, UserRole.guest, db))


@router.get("/me", response_model=UserOut)
def current_user(user: User = Depends(get_current_user)):
    return user


@router.post("/logout")
def logout(user: User = Depends(get_current_user)):
    return {"success": True, "data": {"logged_out": True, "user_id": user.id}}