from pydantic import BaseModel
from decimal import Decimal

class DepositRequest(BaseModel):
    amount: Decimal
    card_number: str
    expiry_date: str
    cvv: str
