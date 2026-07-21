from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from interviewprep_api.db.session import get_db
from interviewprep_api.db.user import User
from interviewprep_api.modules.auth.dependencies import get_current_user
from interviewprep_api.modules.leetcode.repository import LeetcodeRepository
from interviewprep_api.modules.leetcode.schemas import (
    LeetcodeCreate,
    LeetcodeResponse,
    LeetcodeUpdate,
)
from interviewprep_api.modules.leetcode.service import LeetcodeService

router = APIRouter(prefix="/leetcode", tags=["leetcode"])


@router.get("/", response_model=list[LeetcodeResponse])
def list_problems(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[LeetcodeResponse]:
    return LeetcodeService(LeetcodeRepository(db)).list_by_user(current_user.id)  # type: ignore[return-value]


@router.post("/", response_model=LeetcodeResponse, status_code=status.HTTP_201_CREATED)
def create_problem(
    data: LeetcodeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LeetcodeResponse:
    return LeetcodeService(LeetcodeRepository(db)).create(current_user.id, data)  # type: ignore[return-value]


@router.patch("/{id}", response_model=LeetcodeResponse)
def update_problem(
    id: int,
    data: LeetcodeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LeetcodeResponse:
    try:
        return LeetcodeService(LeetcodeRepository(db)).update(id, current_user.id, data)  # type: ignore[return-value]
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_problem(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    deleted = LeetcodeService(LeetcodeRepository(db)).delete(id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
