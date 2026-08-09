import sys
import os
import builtins
from contextlib import asynccontextmanager

builtins.asynccontextmanager = asynccontextmanager

base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, 'backend')

if base_dir not in sys.path:
    sys.path.insert(0, base_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from backend.main import app
import uvicorn

if __name__ == '__main__':
    print("Starting VaultWheel Backend on 0.0.0.0:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
