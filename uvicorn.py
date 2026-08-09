import sys
import os

# Remove current directory from sys.path to prevent self-import recursion
base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path = [p for p in sys.path if p not in (base_dir, '', os.getcwd(), '/var/www')]

# Add site-packages paths
for site_pkg in [
    '/home/zerops/.local/lib/python3.12/site-packages',
    '/usr/local/lib/python3.12/dist-packages',
    '/usr/lib/python3.12/site-packages'
]:
    if os.path.exists(site_pkg) and site_pkg not in sys.path:
        sys.path.insert(0, site_pkg)

# Import real uvicorn module
import importlib
_real_uvicorn = importlib.import_module('uvicorn')

# Export all attributes of real uvicorn module
for attr in dir(_real_uvicorn):
    if not attr.startswith('__'):
        globals()[attr] = getattr(_real_uvicorn, attr)

if __name__ == '__main__':
    from uvicorn.main import main
    main()
