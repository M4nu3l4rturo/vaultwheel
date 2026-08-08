from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.vehicle import Vehicle, VehicleStatus, VerificationStatus
from ..models.user import UserRole, User
from ..schemas.vehicle import VehicleCreate
from ..schemas.token import VehicleWithToken, TokenResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])

@router.get("", response_model=List[VehicleWithToken])
def list_vehicles(db: Session = Depends(get_db)):
    vehicles = db.query(Vehicle).filter(
        Vehicle.is_active == True,
        Vehicle.verification_status == VerificationStatus.APPROVED
    ).all()
    
    result = []
    for v in vehicles:
        token = v.tokens[0] if v.tokens else None
        token_resp = TokenResponse.model_validate(token) if token else None
        result.append(VehicleWithToken(vehicle=v, token=token_resp))
    return result

@router.get("/{vehicle_id}", response_model=VehicleWithToken)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    token = v.tokens[0] if v.tokens else None
    token_resp = TokenResponse.model_validate(token) if token else None
    return VehicleWithToken(vehicle=v, token=token_resp)

@router.post("", response_model=VehicleWithToken)
def create_vehicle(
    vehicle_in: VehicleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.SELLER:
        raise HTTPException(status_code=403, detail="Only sellers can submit vehicles")
    if current_user.kyc_status != "APPROVED":
        raise HTTPException(status_code=403, detail="KYC must be approved")
        
    v = Vehicle(
        seller_id=current_user.id,
        make=vehicle_in.make,
        model=vehicle_in.model,
        year=vehicle_in.year,
        vin=vehicle_in.vin,
        description=vehicle_in.description,
        total_valuation=vehicle_in.total_valuation,
        custom_features=vehicle_in.custom_features,
        verification_status=VerificationStatus.PENDING,
        status=VehicleStatus.PENDING_REVIEW
    )
    db.add(v)
    db.commit()
    db.refresh(v)
    
    return VehicleWithToken(vehicle=v, token=None)
