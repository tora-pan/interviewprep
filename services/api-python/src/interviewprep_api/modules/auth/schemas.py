from pydantic import EmailStr
from typing import Union
from pydantic import BaseModel


class AuthCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UpdateUser(BaseModel):
    first_name: Union[str, None] = None
    last_name: Union[str, None] = None
    email: Union[EmailStr, None] = None
    password: Union[str, None] = None


class TokenData(BaseModel):
    email: Union[EmailStr, None] = None


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr

    class Config:
        orm_mode = True


class AuthLogin(BaseModel):
    email: EmailStr
    password: str
