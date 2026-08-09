"""
VaultWheel Backend - Root entrypoint for Zerops
This file is the run.start entrypoint: python3 main.py
It runs from /var/www/ and imports from /var/www/backend/
"""
import sys
import os

# Add /var/www/backend to path so imports work
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Now import and run the app
from app_server import app
import uvicorn

if __name__ == '__main__':
    print("VaultWheel API starting on 0.0.0.0:8000 ...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
