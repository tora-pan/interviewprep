from sqlalchemy.orm import Session
from interviewprep_api.db.user import User
class AuthRepository:
    def __init__(self, session: Session) -> None:
        self.db = session

    def create_user(self, email: str, hashed_password: str):

        user = User(email=email, hashed_password=hashed_password)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user


    def get_user_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()


    def get_user_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()