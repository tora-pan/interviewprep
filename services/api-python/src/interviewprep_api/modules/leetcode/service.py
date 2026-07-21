from __future__ import annotations

from interviewprep_api.db.leetcode import LeetcodeProblem
from interviewprep_api.modules.leetcode.repository import LeetcodeRepository
from interviewprep_api.modules.leetcode.schemas import LeetcodeCreate, LeetcodeUpdate


class LeetcodeService:
    def __init__(self, repository: LeetcodeRepository) -> None:
        self.repository = repository

    def list_by_user(self, user_id: int) -> list[LeetcodeProblem]:
        return self.repository.list_by_user(user_id)

    def create(self, user_id: int, data: LeetcodeCreate) -> LeetcodeProblem:
        return self.repository.create(user_id, data)

    def update(self, id: int, user_id: int, data: LeetcodeUpdate) -> LeetcodeProblem:
        result = self.repository.update(id, user_id, data)
        if result is None:
            raise ValueError("not found")
        return result

    def delete(self, id: int, user_id: int) -> bool:
        return self.repository.delete(id, user_id)
