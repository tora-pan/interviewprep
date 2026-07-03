from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from interviewprep_api.core.config import settings
from interviewprep_api.modules.auth.repository import AuthRepository
from interviewprep_api.modules.auth.schemas import AuthCreate, AuthResponse


class AuthService:
    def __init__(self, repository: AuthRepository) -> None:
        self.repository = repository
        self.secret_key = settings.AUTH_SECRET_KEY
        self.algorithm = settings.AUTH_ALGORITHM
        self.access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        self.password_hasher = PasswordHash.recommended()

    def hash_password(self, plain_password: str) -> str:
        return self.password_hasher.hash(plain_password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.password_hasher.verify(plain_password, hashed_password)

    def create_access_token(self, subject: str) -> str:
        expires_delta = timedelta(minutes=self.access_token_expire_minutes)
        expire = datetime.now(timezone.utc) + expires_delta
        payload = {"sub": subject, "exp": expire}
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def signup(self, user_details: AuthCreate) -> AuthResponse:
        existing_user = self.repository.get_user_by_email(user_details.email)
        if existing_user:
            raise ValueError("User already exists")

        hashed_password = self.hash_password(user_details.password)
        user = self.repository.create_user(
            first_name=user_details.first_name,
            last_name=user_details.last_name,
            email=user_details.email,
            hashed_password=hashed_password,
        )

        token = self.create_access_token(user.email)
        return AuthResponse(access_token=token)

    def login(self, email: str, password: str) -> AuthResponse:
        user = self.repository.get_user_by_email(email)
        if not user or not self.verify_password(password, user.hashed_password):
            raise ValueError("Invalid credentials")

        token = self.create_access_token(user.email)
        return AuthResponse(access_token=token)
