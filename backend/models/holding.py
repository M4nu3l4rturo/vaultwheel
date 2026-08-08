from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, UniqueConstraint, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class UserHolding(Base):
    __tablename__ = "user_holdings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=False)
    quantity_held = Column(Integer, default=0)
    avg_purchase_price = Column(Numeric(18, 2), nullable=False)
    nft_token_ids = Column(JSON, nullable=True, default=[])
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="holdings")
    token = relationship("VehicleToken", back_populates="holdings")
    
    __table_args__ = (UniqueConstraint('user_id', 'token_id', name='uq_user_token'),)
