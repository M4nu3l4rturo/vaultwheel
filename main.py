import sys
import os

# Add vendor directory and backend directory to sys.path
base_dir = os.path.dirname(os.path.abspath(__file__))
vendor_dir = os.path.join(base_dir, 'vendor')
backend_dir = os.path.join(base_dir, 'backend')

if os.path.exists(vendor_dir) and vendor_dir not in sys.path:
    sys.path.insert(0, vendor_dir)

if os.path.exists(backend_dir) and backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Fallback paths
for p in ['/var/www/vendor', '/var/www/backend', '/home/zerops/.local/lib/python3.12/site-packages']:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

import uvicorn

# Import FastAPI app instance
try:
    from backend.main import app
except (ImportError, ValueError):
    from main import app  # type: ignore

if __name__ == '__main__':
    print("Starting VaultWheel Backend via main.py entrypoint on 0.0.0.0:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
