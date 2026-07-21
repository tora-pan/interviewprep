from __future__ import annotations

from sqlalchemy.orm import Session

from interviewprep_api.db.leetcode import LeetcodeProblem
from interviewprep_api.modules.leetcode.schemas import LeetcodeCreate, LeetcodeUpdate


class LeetcodeRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_by_user(self, user_id: int) -> list[LeetcodeProblem]:
        return (
            self.db.query(LeetcodeProblem)
            .filter(LeetcodeProblem.user_id == user_id)
            .order_by(LeetcodeProblem.created_at.desc())
            .all()
        )

    def create(self, user_id: int, data: LeetcodeCreate) -> LeetcodeProblem:
        problem = LeetcodeProblem(
            user_id=user_id,
            problem_number=data.problem_number,
            title=data.title,
            url=data.url,
            difficulty=data.difficulty,
            status=data.status,
            last_attempted=data.last_attempted,
            notes=data.notes,
        )
        self.db.add(problem)
        self.db.commit()
        self.db.refresh(problem)
        return problem

    def get_one(self, id: int, user_id: int) -> LeetcodeProblem | None:
        return (
            self.db.query(LeetcodeProblem)
            .filter(LeetcodeProblem.id == id, LeetcodeProblem.user_id == user_id)
            .first()
        )

    def update(self, id: int, user_id: int, data: LeetcodeUpdate) -> LeetcodeProblem | None:
        problem = self.get_one(id, user_id)
        if problem is None:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(problem, key, value)
        self.db.commit()
        self.db.refresh(problem)
        return problem

    def delete(self, id: int, user_id: int) -> bool:
        problem = self.get_one(id, user_id)
        if problem is None:
            return False
        self.db.delete(problem)
        self.db.commit()
        return True
