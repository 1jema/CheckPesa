import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 't')

    # CORS settings
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:4200",
        "http://localhost:3000",
        "http://localhost:5173",
    ]