import enum
from sqlalchemy import Column, Integer, String, Enum, Numeric, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class UserRole(str, enum.Enum):
    BUYER = "BUYER"
    SELLER = "SELLER"
    ADMIN = "ADMIN"

class KYCStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.BUYER)
    kyc_status = Column(Enum(KYCStatus), default=KYCStatus.PENDING)
    kyc_docs = Column(JSON, nullable=True)
    fiat_balance = Column(Numeric(18, 2), default=250000.00)
    country = Column(String(2), nullable=True)
    wallet_address = Column(String(42), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    transactions = relationship("Transaction", back_populates="buyer")
    holdings = relationship("UserHolding", back_populates="user")
    vehicles = relationship("Vehicle", back_populates="seller")
