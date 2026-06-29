from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.get("/")
def root():
    return {"message": "auth working"}