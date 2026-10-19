"""
ProjectHub: Centralized Academic Project Discovery & Management Platform
FastAPI Application Entry Point
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import auth, projects, categories, users, dashboard

# Automatically generate database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectHub Academic API",
    description=(
        "Centralized Academic Project Discovery and Management Platform API. "
        "Allows students to discover, search, bookmark, and upload academic projects, "
        "and explore the project marketplace with free and paid pricing tiers."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Cross-Origin Resource Sharing (CORS) setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(dashboard.router)

@app.get("/api/health", tags=["System"])
def health_check():
    """Health check endpoint to verify backend operational readiness."""
    return {
        "status": "healthy",
        "service": "ProjectHub Academic API",
        "version": "1.0.0",
        "database": "MySQL 8.0+ (SQLAlchemy ORM)"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
