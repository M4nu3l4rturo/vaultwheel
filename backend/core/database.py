from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import logging

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL
engine = None

try:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10
    )
    with engine.connect() as conn:
        pass
    logger.info(f"Connected to PostgreSQL database at {db_url}")
except Exception as e:
    logger.warning(f"PostgreSQL connection failed ({e}) — falling back to SQLite database")
    sqlite_url = "sqlite:///./vaultwheel.db"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
