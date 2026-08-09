from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.holding import UserHolding
from ..models.user import User
from .auth import get_current_user

router = APIRouter(prefix="/api/holdings", tags=["holdings"])

@router.get("/me")
def get_my_holdings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    holdings = db.query(UserHolding).filter(UserHolding.user_id == current_user.id).all()
    
    result = []
    for h in holdings:
        # Check if quantity held is greater than zero
        if h.quantity_held > 0 and h.token and h.token.vehicle:
            v = h.token.vehicle
            result.append({
                "quantity": h.quantity_held,
                "vehicle": {
                    "id": v.id,
                    "make": v.make,
                    "model": v.model,
                    "images": v.images,
                    "token": {
                        "token_symbol": h.token.token_symbol,
                        "price_per_token": float(h.token.price_per_token)
                    }
                }
            })
            
    return result
