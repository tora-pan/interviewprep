from interviewprep_api.modules.auth.schemas import AuthCreate, AuthLogin
from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/login")
def login(login_details: AuthLogin):
    return {"message": "auth working"}


@router.post("/signup")
def signup(user_details: AuthCreate):
    return {"message": "signup working"}