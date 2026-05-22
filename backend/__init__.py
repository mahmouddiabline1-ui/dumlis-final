import os, sys
# Expose backend/app for imports like `backend.app.xxx`
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "app"))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
