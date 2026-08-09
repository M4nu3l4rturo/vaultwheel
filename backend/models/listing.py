import enum
from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class ListingStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SOLD = "SOLD"
    CANCELLED = "CANCELLED"

class TokenListing(Base):
    __tablename__ = "token_listings"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_per_token = Column(Numeric(18, 2), nullable=False)
    status = Column(Enum(ListingStatus), default=ListingStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    seller = relationship("User", foreign_keys=[seller_id])
    token = relationship("VehicleToken")
