from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class LeetcodeCreate(BaseModel):
    problem_number: Optional[int] = None
    title: str
    url: Optional[str] = None
    difficulty: str
    status: str = "practiced"
    last_attempted: Optional[date] = None
    notes: Optional[str] = None


class LeetcodeUpdate(BaseModel):
    problem_number: Optional[int] = None
    title: Optional[str] = None
    url: Optional[str] = None
    difficulty: Optional[str] = None
    status: Optional[str] = None
    last_attempted: Optional[date] = None
    notes: Optional[str] = None


class LeetcodeResponse(BaseModel):
    id: int
    problem_number: Optional[int]
    title: str
    url: Optional[str]
    difficulty: str
    status: str
    last_attempted: Optional[date]
    notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
