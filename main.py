import sys
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, 'backend')

if os.path.exists(backend_dir) and backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import uvicorn
from backend.main import app

if __name__ == '__main__':
    print("Starting VaultWheel Backend via main.py on 0.0.0.0:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
