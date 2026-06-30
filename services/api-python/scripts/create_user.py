from interviewprep_api.db.session import SessionLocal
from interviewprep_api.db.user import User

db = SessionLocal()

user = User(
    email="test@example.com",
    hashed_password="password123",
)

db.add(user)
db.commit()

print("User created!")
