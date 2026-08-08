import enum
from sqlalchemy import Column, Integer, String, Enum, Numeric, DateTime, JSON, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class VehicleStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SOLD_OUT = "SOLD_OUT"
    COMING_SOON = "COMING_SOON"
    PENDING_REVIEW = "PENDING_REVIEW"

class VerificationStatus(str, enum.Enum):
    PENDING = "PENDING"
    DOCS_REVIEW = "DOCS_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    vin = Column(String(17), nullable=True)
    description = Column(Text, nullable=False)
    total_valuation = Column(Numeric(18, 2), nullable=False)
    custom_features = Column(JSON, nullable=True)
    rarity_score = Column(Float, default=0.0)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.APPROVED)
    status = Column(Enum(VehicleStatus), default=VehicleStatus.ACTIVE)
    passport_data = Column(JSON, nullable=True)
    images = Column(JSON, nullable=True)
    ownership_docs = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    seller = relationship("User", back_populates="vehicles")
    tokens = relationship("VehicleToken", back_populates="vehicle")
