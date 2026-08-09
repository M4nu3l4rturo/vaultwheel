from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.user import User
from ..models.holding import UserHolding
from ..models.listing import TokenListing, ListingStatus
from ..models.transaction import Transaction, TransactionStatus, TransactionType
from ..schemas.listing import ListingCreate, ListingResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/market", tags=["market"])

@router.post("/list", response_model=ListingResponse)
def create_listing(
    req: ListingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")
    if req.price_per_token <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than 0")

    holding = db.query(UserHolding).filter(
        UserHolding.user_id == current_user.id,
        UserHolding.token_id == req.token_id
    ).with_for_update().first()

    if not holding:
        raise HTTPException(status_code=404, detail="You do not own any tokens of this asset")

    available_to_list = holding.quantity_held - holding.locked_quantity
    if req.quantity > available_to_list:
        raise HTTPException(status_code=400, detail=f"Insufficient available tokens. You have {available_to_list} available.")

    # Lock the tokens
    holding.locked_quantity += req.quantity

    listing = TokenListing(
        seller_id=current_user.id,
        token_id=req.token_id,
        quantity=req.quantity,
        price_per_token=req.price_per_token,
        status=ListingStatus.ACTIVE
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)

    return listing

@router.get("")
def get_active_listings(db: Session = Depends(get_db)):
    listings = db.query(TokenListing).filter(TokenListing.status == ListingStatus.ACTIVE).all()
    result = []
    for l in listings:
        if l.token and l.token.vehicle:
            result.append({
                "id": l.id,
                "seller_id": l.seller_id,
                "seller_name": l.seller.full_name if l.seller else "Unknown",
                "token_id": l.token_id,
                "quantity": l.quantity,
                "price_per_token": float(l.price_per_token),
                "created_at": l.created_at.isoformat() if l.created_at else None,
                "vehicle": {
                    "make": l.token.vehicle.make,
                    "model": l.token.vehicle.model,
                    "year": l.token.vehicle.year,
                    "images": l.token.vehicle.images,
                    "token_symbol": l.token.token_symbol
                }
            })
    return result

@router.get("/my-listings")
def get_my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listings = db.query(TokenListing).filter(
        TokenListing.seller_id == current_user.id,
        TokenListing.status == ListingStatus.ACTIVE
    ).all()
    
    result = []
    for l in listings:
        if l.token and l.token.vehicle:
            result.append({
                "id": l.id,
                "token_id": l.token_id,
                "quantity": l.quantity,
                "price_per_token": float(l.price_per_token),
                "status": l.status,
                "created_at": l.created_at.isoformat() if l.created_at else None,
                "vehicle": {
                    "make": l.token.vehicle.make,
                    "model": l.token.vehicle.model,
                    "year": l.token.vehicle.year,
                    "images": l.token.vehicle.images,
                    "token_symbol": l.token.token_symbol
                }
            })
    return result

@router.delete("/{listing_id}")
def cancel_listing(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(TokenListing).filter(TokenListing.id == listing_id).with_for_update().first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only cancel your own listings")
    if listing.status != ListingStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Listing is no longer active")
    
    # Unlock the tokens back to the seller's holding
    holding = db.query(UserHolding).filter(
        UserHolding.user_id == current_user.id,
        UserHolding.token_id == listing.token_id
    ).first()
    
    if holding:
        holding.locked_quantity -= listing.quantity
        if holding.locked_quantity < 0:
            holding.locked_quantity = 0
    
    listing.status = ListingStatus.CANCELLED
    db.commit()
    
    return {"status": "success", "message": "Listing cancelled successfully"}

@router.post("/buy/{listing_id}")
def buy_listing(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(TokenListing).filter(TokenListing.id == listing_id).with_for_update().first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.status != ListingStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Listing is no longer active")
    if listing.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot buy your own listing")
        
    total_cost = listing.price_per_token * listing.quantity
    
    if current_user.fiat_balance < total_cost:
        raise HTTPException(status_code=400, detail="Insufficient fiat balance")
        
    seller = db.query(User).filter(User.id == listing.seller_id).with_for_update().first()
    seller_holding = db.query(UserHolding).filter(UserHolding.user_id == seller.id, UserHolding.token_id == listing.token_id).first()
    
    # 1. Transfer Fiat
    current_user.fiat_balance -= total_cost
    seller.fiat_balance += total_cost
    
    # 2. Transfer Tokens
    seller_holding.quantity_held -= listing.quantity
    seller_holding.locked_quantity -= listing.quantity
    if seller_holding.locked_quantity < 0:
        seller_holding.locked_quantity = 0
    if seller_holding.quantity_held <= 0:
        db.delete(seller_holding)
        
    buyer_holding = db.query(UserHolding).filter(UserHolding.user_id == current_user.id, UserHolding.token_id == listing.token_id).first()
    if buyer_holding:
        total_value = (buyer_holding.quantity_held * buyer_holding.avg_purchase_price) + total_cost
        buyer_holding.quantity_held += listing.quantity
        buyer_holding.avg_purchase_price = total_value / buyer_holding.quantity_held
    else:
        buyer_holding = UserHolding(
            user_id=current_user.id,
            token_id=listing.token_id,
            quantity_held=listing.quantity,
            avg_purchase_price=listing.price_per_token
        )
        db.add(buyer_holding)
        
    # 3. Mark Listing as SOLD
    listing.status = ListingStatus.SOLD
    
    # 4. Create Transaction for history
    tx_buyer = Transaction(
        buyer_id=current_user.id,
        seller_id=seller.id,
        token_id=listing.token_id,
        quantity=listing.quantity,
        price_at_purchase=listing.price_per_token,
        total_amount=total_cost,
        status=TransactionStatus.CONFIRMED,
        transaction_type=TransactionType.SECONDARY_BUY
    )
    db.add(tx_buyer)
    
    db.commit()
    
    return {"status": "success", "message": "Tokens successfully purchased"}
