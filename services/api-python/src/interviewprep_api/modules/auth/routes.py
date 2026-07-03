from interviewprep_api.modules.auth.schemas import AuthCreate, AuthLogin
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from interviewprep_api.db.session import get_db
from interviewprep_api.modules.auth.repository import AuthRepository
from interviewprep_api.modules.auth.schemas import AuthResponse
from interviewprep_api.modules.auth.service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/login")
def login(login_details: AuthLogin, db: Session = Depends(get_db)) -> AuthResponse:
    service = AuthService(AuthRepository(db))
    try:
        return service.login(login_details.email, login_details.password)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc


@router.post("/signup")
def signup(user_details: AuthCreate, db: Session = Depends(get_db)) -> AuthResponse:
    service = AuthService(AuthRepository(db))
    try:
        return service.signup(user_details)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
