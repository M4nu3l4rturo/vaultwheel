"""
VaultWheel Backend - Root entrypoint for Zerops
Runs from /var/www/ with: python3 main.py
"""
import sys
import os

# Add /var/www to sys.path so 'backend' is importable as a package
# This preserves relative imports inside backend (e.g. 'from ..core.database import Base')
www_dir = os.path.dirname(os.path.abspath(__file__))  # /var/www
if www_dir not in sys.path:
    sys.path.insert(0, www_dir)

from backend.app_server import app
import uvicorn

if __name__ == '__main__':
    print("VaultWheel API starting on 0.0.0.0:8000 ...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
