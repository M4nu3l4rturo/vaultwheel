from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User
from ..schemas.payment import DepositRequest
from .auth import get_current_user

router = APIRouter(prefix="/api/payments", tags=["payments"])

@router.post("/deposit")
def deposit_funds(
    req: DepositRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Deposit amount must be greater than 0")
        
    # Simulate a successful payment and add funds to user's fiat balance
    current_user.fiat_balance += req.amount
    db.commit()
    
    return {"status": "success", "new_balance": float(current_user.fiat_balance)}
