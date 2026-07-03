from sqlalchemy.orm import Session
from interviewprep_api.db.user import User


class AuthRepository:
    def __init__(self, session: Session) -> None:
        self.db = session

    def create_user(
        self,
        first_name: str,
        last_name: str,
        email: str,
        hashed_password: str,
    ) -> User:
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            hashed_password=hashed_password,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_user_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()
