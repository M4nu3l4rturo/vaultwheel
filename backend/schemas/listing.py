from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import Optional
from ..models.listing import ListingStatus

class ListingCreate(BaseModel):
    token_id: int
    quantity: int
    price_per_token: Decimal

class ListingResponse(BaseModel):
    id: int
    seller_id: int
    token_id: int
    quantity: int
    price_per_token: Decimal
    status: ListingStatus
    created_at: datetime
    
    # We can optionally include vehicle or token details if needed later
    
    model_config = {"from_attributes": True}
