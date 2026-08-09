from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import Optional
from ..models.transaction import TransactionStatus, TransactionType

class BuyRequest(BaseModel):
    token_id: int
    quantity: int

class TransactionVehicleInfo(BaseModel):
    make: str
    model: str
    year: int
    
    model_config = {"from_attributes": True}

class TransactionTokenInfo(BaseModel):
    token_symbol: str
    
    model_config = {"from_attributes": True}

class TransactionResponse(BaseModel):
    id: int
    buyer_id: int
    seller_id: Optional[int] = None
    token_id: int
    quantity: int
    price_at_purchase: Decimal
    total_amount: Decimal
    tx_hash: Optional[str] = None
    nft_token_id: Optional[int] = None
    status: TransactionStatus
    transaction_type: TransactionType = TransactionType.PRIMARY_BUY
    created_at: datetime
    
    model_config = {"from_attributes": True}
