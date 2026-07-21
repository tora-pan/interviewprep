from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: str = "applied"
    date_applied: date
    notes: Optional[str] = None


class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    date_applied: Optional[date] = None
    notes: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    company: str
    role: str
    status: str
    date_applied: date
    notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
