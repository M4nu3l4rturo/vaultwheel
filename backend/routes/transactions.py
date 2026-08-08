from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.user import User, KYCStatus
from ..models.token import VehicleToken
from ..models.transaction import Transaction, TransactionStatus
from ..models.holding import UserHolding
from ..schemas.transaction import BuyRequest, TransactionResponse
from ..services.web3_service import mint_vehicle_tokens
from .auth import get_current_user
import asyncio

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

def process_minting(to_address: str, vehicle_token_id: int, quantity: int, user_id: int, token_id: int, tx_id: int, db: Session):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    tx_hash, nft_id = loop.run_until_complete(mint_vehicle_tokens(to_address, vehicle_token_id, quantity, user_id, token_id))
    
    # Update transaction
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if tx:
        tx.tx_hash = tx_hash
        tx.nft_token_id = nft_id
        tx.status = TransactionStatus.CONFIRMED
        db.commit()
    loop.close()

@router.post("/buy", response_model=TransactionResponse)
def buy_tokens(
    req: BuyRequest, 
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.kyc_status != KYCStatus.APPROVED:
        raise HTTPException(status_code=403, detail="KYC must be APPROVED to buy tokens")
        
    token = db.query(VehicleToken).filter(VehicleToken.id == req.token_id).with_for_update().first()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
        
    if token.available_supply < req.quantity:
        raise HTTPException(status_code=400, detail="Insufficient token supply")
        
    total_cost = token.price_per_token * req.quantity
    
    if current_user.fiat_balance < total_cost:
        raise HTTPException(status_code=400, detail="Insufficient fiat balance")
        
    # Create transaction
    tx = Transaction(
        buyer_id=current_user.id,
        token_id=token.id,
        quantity=req.quantity,
        price_at_purchase=token.price_per_token,
        total_amount=total_cost,
        status=TransactionStatus.PENDING
    )
    db.add(tx)
    
    # Update token supply
    token.available_supply -= req.quantity
    
    # Update user balance
    current_user.fiat_balance -= total_cost
    
    # Update or create holding
    holding = db.query(UserHolding).filter(
        UserHolding.user_id == current_user.id,
        UserHolding.token_id == token.id
    ).first()
    
    if holding:
        total_value = (holding.quantity_held * holding.avg_purchase_price) + total_cost
        holding.quantity_held += req.quantity
        holding.avg_purchase_price = total_value / holding.quantity_held
    else:
        holding = UserHolding(
            user_id=current_user.id,
            token_id=token.id,
            quantity_held=req.quantity,
            avg_purchase_price=token.price_per_token
        )
        db.add(holding)
        
    db.commit()
    db.refresh(tx)
    
    # Trigger background mint
    to_address = current_user.wallet_address or ""
    background_tasks.add_task(
        process_minting, 
        to_address, 
        token.erc1155_token_id, 
        req.quantity, 
        current_user.id, 
        token.id, 
        tx.id, 
        Session(db.get_bind())
    )
    
    return tx

@router.get("/me", response_model=List[TransactionResponse])
def get_my_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.buyer_id == current_user.id).all()
