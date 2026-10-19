"""
Database Connection and Session Management for ProjectHub (SQLite / MySQL)
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Default to SQLite for easy deployment on Render
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

# Handle SQLite vs MySQL specific arguments
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600,
        pool_size=10,
        max_overflow=20,
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    FastAPI dependency that provides a transactional database session per request,
    ensuring proper closure upon response completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()