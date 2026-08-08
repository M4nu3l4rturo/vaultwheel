from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import Optional

class TokenResponse(BaseModel):
    id: int
    vehicle_id: int
    total_supply: int
    available_supply: int
    price_per_token: Decimal
    token_symbol: str
    contract_address: Optional[str] = None
    erc1155_token_id: Optional[int] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class VehicleWithToken(BaseModel):
    vehicle: dict
    token: Optional[TokenResponse] = None
