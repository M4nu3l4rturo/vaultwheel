import sys
import os

# Automatically add vendor and backend directories to sys.path
base_dir = os.path.dirname(os.path.abspath(__file__))
vendor_dir = os.path.join(base_dir, 'vendor')
backend_dir = os.path.join(base_dir, 'backend')

for path in [
    vendor_dir,
    backend_dir,
    '/var/www/vendor',
    '/var/www/backend',
    '/var/www',
    '/home/zerops/.local/lib/python3.12/site-packages'
]:
    if os.path.exists(path) and path not in sys.path:
        sys.path.insert(0, path)
