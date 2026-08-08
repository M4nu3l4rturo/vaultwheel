from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class VehicleToken(Base):
    __tablename__ = "tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    total_supply = Column(Integer, nullable=False)
    available_supply = Column(Integer, nullable=False)
    price_per_token = Column(Numeric(18, 2), nullable=False)
    token_symbol = Column(String(10), nullable=False)
    contract_address = Column(String(42), nullable=True)
    erc1155_token_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    vehicle = relationship("Vehicle", back_populates="tokens")
    transactions = relationship("Transaction", back_populates="token")
    holdings = relationship("UserHolding", back_populates="token")
