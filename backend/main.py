import sys
import os
import builtins
from contextlib import asynccontextmanager

builtins.asynccontextmanager = asynccontextmanager

base_dir = os.path.dirname(os.path.abspath(__file__))
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

try:
    from backend.app_server import app
except ImportError:
    from app_server import app
