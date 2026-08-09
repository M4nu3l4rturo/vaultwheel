import sys
import os
import subprocess

# Log startup
print("Zerops uvicorn proxy entrypoint active.")

# Search paths
for p in [
    '/home/zerops/.local/lib/python3.12/site-packages',
    os.path.expanduser('~/.local/lib/python3.12/site-packages'),
    '/usr/local/lib/python3.12/dist-packages',
]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

# Check if real uvicorn is available outside of this proxy
real_uvicorn_found = False
try:
    # Temporarily remove current directory from path to test for real uvicorn package
    sys_path_backup = sys.path[:]
    sys.path = [p for p in sys.path if p not in ['', '.', '/var/www', os.getcwd()]]
    import uvicorn.main
    real_uvicorn_found = True
except (ImportError, ModuleNotFoundError):
    real_uvicorn_found = False
finally:
    sys.path = sys_path_backup

if not real_uvicorn_found:
    print("Installing requirements.txt in Zerops runtime container...")
    req_path = '/var/www/backend/requirements.txt' if os.path.exists('/var/www/backend/requirements.txt') else 'backend/requirements.txt'
    if not os.path.exists(req_path):
        req_path = 'requirements.txt'
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', req_path])
    
    # Re-insert site packages
    for p in [
        '/home/zerops/.local/lib/python3.12/site-packages',
        os.path.expanduser('~/.local/lib/python3.12/site-packages')
    ]:
        if os.path.exists(p) and p not in sys.path:
            sys.path.insert(0, p)

# Now remove local proxy from sys.path and run real uvicorn
sys.path = [p for p in sys.path if p not in ['', '.', '/var/www', os.getcwd()]]
import uvicorn.main
uvicorn.main.main()
