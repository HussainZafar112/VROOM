from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None   # optional name field

class UserLogin(BaseModel):
    email: EmailStr
    password: str

