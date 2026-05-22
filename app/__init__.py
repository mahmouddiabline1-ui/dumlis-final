import os, sys
# Extend the package path so that submodules (database, models, routers, etc.)
# are resolved from the actual backend implementation located at
# <project_root>/backend/app
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend', 'app'))
if BASE_DIR not in __path__:
    __path__.insert(0, BASE_DIR)
