from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.user import User, UserRole, KYCStatus
from ..models.vehicle import Vehicle, VerificationStatus
from ..models.transaction import Transaction
from .auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])

def check_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/vehicles/pending")
def list_pending_vehicles(db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    return db.query(Vehicle).filter(Vehicle.verification_status == VerificationStatus.PENDING).all()

@router.put("/vehicles/{id}/approve")
def approve_vehicle(id: int, db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    v = db.query(Vehicle).filter(Vehicle.id == id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    v.verification_status = VerificationStatus.APPROVED
    db.commit()
    return {"status": "approved"}

@router.put("/vehicles/{id}/reject")
def reject_vehicle(id: int, db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    v = db.query(Vehicle).filter(Vehicle.id == id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    v.verification_status = VerificationStatus.REJECTED
    db.commit()
    return {"status": "rejected"}

@router.get("/users")
def list_users(db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    return db.query(User).all()

@router.put("/kyc/{user_id}/approve")
def approve_kyc(user_id: int, db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    u.kyc_status = KYCStatus.APPROVED
    db.commit()
    return {"status": "approved"}

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    vehicles_count = db.query(Vehicle).count()
    tx_count = db.query(Transaction).count()
    total_volume = sum([tx.total_amount for tx in db.query(Transaction).all()]) if tx_count > 0 else 0
    return {
        "total_vehicles": vehicles_count,
        "total_transactions": tx_count,
        "total_volume": total_volume
    }
