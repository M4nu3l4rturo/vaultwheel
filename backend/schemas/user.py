from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from decimal import Decimal
from datetime import datetime
from ..models.user import UserRole, KYCStatus

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    country: Optional[str] = None
    role: Optional[UserRole] = UserRole.BUYER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    kyc_status: KYCStatus
    fiat_balance: Decimal
    country: Optional[str] = None
    wallet_address: Optional[str] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserUpdate(BaseModel):
    wallet_address: Optional[str] = None
    country: Optional[str] = None
