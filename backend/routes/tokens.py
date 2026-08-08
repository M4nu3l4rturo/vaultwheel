from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.token import VehicleToken
from ..schemas.token import TokenResponse

router = APIRouter(prefix="/api/tokens", tags=["tokens"])

@router.get("", response_model=List[TokenResponse])
def list_tokens(db: Session = Depends(get_db)):
    return db.query(VehicleToken).all()

@router.get("/{token_id}", response_model=TokenResponse)
def get_token(token_id: int, db: Session = Depends(get_db)):
    t = db.query(VehicleToken).filter(VehicleToken.id == token_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Token not found")
    return t

@router.get("/vehicle/{vehicle_id}", response_model=TokenResponse)
def get_vehicle_token(vehicle_id: int, db: Session = Depends(get_db)):
    t = db.query(VehicleToken).filter(VehicleToken.vehicle_id == vehicle_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Token not found for this vehicle")
    return t
