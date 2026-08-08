from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import Optional
from ..models.transaction import TransactionStatus

class BuyRequest(BaseModel):
    token_id: int
    quantity: int

class TransactionResponse(BaseModel):
    id: int
    buyer_id: int
    token_id: int
    quantity: int
    price_at_purchase: Decimal
    total_amount: Decimal
    tx_hash: Optional[str] = None
    nft_token_id: Optional[int] = None
    status: TransactionStatus
    created_at: datetime
    
    model_config = {"from_attributes": True}
