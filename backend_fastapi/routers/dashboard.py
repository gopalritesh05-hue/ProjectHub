"""
Dashboard Metrics Router: Statistical summaries for Admin and User insights
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import models
import schemas
from auth import get_current_admin

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=schemas.AdminStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Computes high-level platform statistics for project discovery and administration."""
    total_users = db.query(func.count(models.User.id)).scalar() or 0
    total_projects = db.query(func.count(models.Project.id)).scalar() or 0
    free_projects = db.query(func.count(models.Project.id)).filter(models.Project.project_type == models.ProjectType.Free).scalar() or 0
    paid_projects = db.query(func.count(models.Project.id)).filter(models.Project.project_type == models.ProjectType.Paid).scalar() or 0
    categories_count = db.query(func.count(models.Category.id)).scalar() or 0
    total_bookmarks = db.query(func.count(models.Bookmark.id)).scalar() or 0

    return {
        "total_users": total_users,
        "total_projects": total_projects,
        "free_projects": free_projects,
        "paid_projects": paid_projects,
        "categories_count": categories_count,
        "total_bookmarks": total_bookmarks
    }
