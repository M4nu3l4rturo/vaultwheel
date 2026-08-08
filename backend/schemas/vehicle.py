from pydantic import BaseModel
from typing import Optional, Any, List
from decimal import Decimal
from datetime import datetime
from ..models.vehicle import VehicleStatus, VerificationStatus

class VehicleResponse(BaseModel):
    id: int
    make: str
    model: str
    year: int
    description: str
    total_valuation: Decimal
    custom_features: Optional[Any] = None
    rarity_score: float
    verification_status: VerificationStatus
    status: VehicleStatus
    passport_data: Optional[Any] = None
    images: Optional[Any] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class VehicleCreate(BaseModel):
    make: str
    model: str
    year: int
    vin: Optional[str] = None
    description: str
    total_valuation: Decimal
    custom_features: Optional[dict] = None
