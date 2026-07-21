from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from interviewprep_api.db.session import get_db
from interviewprep_api.db.user import User
from interviewprep_api.modules.applications.repository import ApplicationRepository
from interviewprep_api.modules.applications.schemas import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationUpdate,
)
from interviewprep_api.modules.applications.service import ApplicationService
from interviewprep_api.modules.auth.dependencies import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("/", response_model=list[ApplicationResponse])
def list_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ApplicationResponse]:
    return ApplicationService(ApplicationRepository(db)).list_by_user(current_user.id)  # type: ignore[return-value]


@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    return ApplicationService(ApplicationRepository(db)).create(current_user.id, data)  # type: ignore[return-value]


@router.patch("/{id}", response_model=ApplicationResponse)
def update_application(
    id: int,
    data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationResponse:
    try:
        return ApplicationService(ApplicationRepository(db)).update(id, current_user.id, data)  # type: ignore[return-value]
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    deleted = ApplicationService(ApplicationRepository(db)).delete(id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
