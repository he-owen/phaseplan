import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://app:changeme@localhost:5432/appdb")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
