from __future__ import annotations

from interviewprep_api.db.application import JobApplication
from interviewprep_api.modules.applications.repository import ApplicationRepository
from interviewprep_api.modules.applications.schemas import ApplicationCreate, ApplicationUpdate


class ApplicationService:
    def __init__(self, repository: ApplicationRepository) -> None:
        self.repository = repository

    def list_by_user(self, user_id: int) -> list[JobApplication]:
        return self.repository.list_by_user(user_id)

    def create(self, user_id: int, data: ApplicationCreate) -> JobApplication:
        return self.repository.create(user_id, data)

    def update(self, id: int, user_id: int, data: ApplicationUpdate) -> JobApplication:
        result = self.repository.update(id, user_id, data)
        if result is None:
            raise ValueError("not found")
        return result

    def delete(self, id: int, user_id: int) -> bool:
        return self.repository.delete(id, user_id)
