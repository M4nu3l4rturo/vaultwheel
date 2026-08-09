import sys
import os
import subprocess

# Ensure home local site-packages and /var/www are in sys.path
local_site = os.path.expanduser('~/.local/lib/python3.12/site-packages')
if os.path.exists(local_site) and local_site not in sys.path:
    sys.path.insert(0, local_site)

# Also check python3.12/site-packages
for p in [
    '/home/zerops/.local/lib/python3.12/site-packages',
    '/usr/local/lib/python3.12/dist-packages',
    '/var/www',
    '/var/www/backend'
]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

try:
    import uvicorn.main
    if __name__ == '__main__':
        uvicorn.main.main()
except ImportError:
    # Auto-install requirements if missing in runtime
    print("Installing requirements in runtime container...")
    req_path = '/var/www/backend/requirements.txt' if os.path.exists('/var/www/backend/requirements.txt') else 'backend/requirements.txt'
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', req_path])
    import uvicorn.main
    if __name__ == '__main__':
        uvicorn.main.main()
