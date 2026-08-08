from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://vaultwheel:vaultwheel@localhost:5432/vaultwheel"
    SECRET_KEY: str = "vaultwheel-super-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    POLYGON_RPC_URL: str = "https://rpc-amoy.polygon.technology"
    CONTRACT_ADDRESS: str = ""
    PLATFORM_PRIVATE_KEY: str = ""
    PLATFORM_WALLET_ADDRESS: str = "0x0000000000000000000000000000000000000000"
    DEMO_MODE: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()
