from __future__ import annotations

from sqlalchemy.orm import Session

from interviewprep_api.db.application import JobApplication
from interviewprep_api.modules.applications.schemas import ApplicationCreate, ApplicationUpdate


class ApplicationRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_by_user(self, user_id: int) -> list[JobApplication]:
        return (
            self.db.query(JobApplication)
            .filter(JobApplication.user_id == user_id)
            .order_by(JobApplication.date_applied.desc())
            .all()
        )

    def create(self, user_id: int, data: ApplicationCreate) -> JobApplication:
        application = JobApplication(
            user_id=user_id,
            company=data.company,
            role=data.role,
            status=data.status,
            date_applied=data.date_applied,
            notes=data.notes,
        )
        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)
        return application

    def get_one(self, id: int, user_id: int) -> JobApplication | None:
        return (
            self.db.query(JobApplication)
            .filter(JobApplication.id == id, JobApplication.user_id == user_id)
            .first()
        )

    def update(self, id: int, user_id: int, data: ApplicationUpdate) -> JobApplication | None:
        application = self.get_one(id, user_id)
        if application is None:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(application, key, value)
        self.db.commit()
        self.db.refresh(application)
        return application

    def delete(self, id: int, user_id: int) -> bool:
        application = self.get_one(id, user_id)
        if application is None:
            return False
        self.db.delete(application)
        self.db.commit()
        return True
