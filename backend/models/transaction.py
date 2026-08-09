import enum
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class TransactionStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    FAILED = "FAILED"

class TransactionType(str, enum.Enum):
    PRIMARY_BUY = "PRIMARY_BUY"
    SECONDARY_BUY = "SECONDARY_BUY"
    SECONDARY_SELL = "SECONDARY_SELL"

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Numeric(18, 2), nullable=False)
    total_amount = Column(Numeric(18, 2), nullable=False)
    tx_hash = Column(String(66), nullable=True)
    nft_token_id = Column(Integer, nullable=True)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    transaction_type = Column(Enum(TransactionType), default=TransactionType.PRIMARY_BUY)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # Append-only: never update or delete rows
    
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="transactions")
    seller = relationship("User", foreign_keys=[seller_id])
    token = relationship("VehicleToken", back_populates="transactions")
