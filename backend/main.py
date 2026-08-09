import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from .core.database import engine, SessionLocal, Base
    from .models import *
    from .routes import auth, vehicles, tokens, transactions, kyc, admin, holdings, payments, market
    from .services.seed import seed_database
except (ImportError, ValueError):
    from core.database import engine, SessionLocal, Base
    from models import *
    from routes import auth, vehicles, tokens, transactions, kyc, admin, holdings, payments, market
    from services.seed import seed_database
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    
    yield
    logger.info("Shutdown")

app = FastAPI(
    title="VaultWheel API",
    description="Global Vehicle Tokenization Marketplace — RWA Platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(tokens.router)
app.include_router(transactions.router)
app.include_router(kyc.router)
app.include_router(admin.router)
app.include_router(holdings.router)
app.include_router(payments.router)
app.include_router(market.router)

@app.get("/health")
def health():
    return {"status": "ok", "service": "VaultWheel API v1.0.0"}
