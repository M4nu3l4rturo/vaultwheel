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
                "token_id": h.token_id,
                "quantity": h.quantity_held,
                "locked_quantity": h.locked_quantity or 0,
                "avg_purchase_price": float(h.avg_purchase_price),
                "vehicle": {
                    "id": v.id,
                    "make": v.make,
                    "model": v.model,
                    "year": v.year,
                    "images": v.images,
                    "rarity_score": v.rarity_score,
                    "token": {
                        "id": h.token.id,
                        "token_symbol": h.token.token_symbol,
                        "price_per_token": float(h.token.price_per_token)
                    }
                }
            })
            
    return result
