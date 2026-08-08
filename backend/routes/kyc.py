from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.config import settings
from ..models.user import User, KYCStatus
from .auth import get_current_user

router = APIRouter(prefix="/api/kyc", tags=["kyc"])

@router.post("/submit")
def submit_kyc(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if settings.DEMO_MODE:
        current_user.kyc_status = KYCStatus.APPROVED
    else:
        current_user.kyc_status = KYCStatus.PENDING
    db.commit()
    return {"status": current_user.kyc_status}

@router.get("/status")
def get_kyc_status(current_user: User = Depends(get_current_user)):
    return {"kyc_status": current_user.kyc_status}
