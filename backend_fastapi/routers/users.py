"""
Users & Bookmarks Router: Profile management, Bookmarking projects, and Admin User management
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_user, get_current_admin

router = APIRouter(prefix="/api/users", tags=["Users & Bookmarks"])

# ----------------- Bookmarks -----------------

@router.get("/bookmarks", response_model=List[schemas.ProjectResponse])
def get_user_bookmarks(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves all projects bookmarked by the currently authenticated user."""
    bookmarks = db.query(models.Bookmark).filter(models.Bookmark.user_id == current_user.id).all()
    project_ids = [b.project_id for b in bookmarks]

    projects = db.query(models.Project).filter(models.Project.id.in_(project_ids)).all()
    results = []
    for p in projects:
        resp = schemas.ProjectResponse.from_orm(p)
        resp.category_name = p.category_rel.category_name if p.category_rel else None
        resp.author_name = p.author.name if p.author else "Academic Contributor"
        results.append(resp)
    return results


@router.post("/bookmarks/toggle/{project_id}")
def toggle_bookmark(
    project_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggles bookmark status for a project (Adds if not bookmarked, removes if already present)."""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    existing = db.query(models.Bookmark).filter(
        models.Bookmark.user_id == current_user.id,
        models.Bookmark.project_id == project_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"bookmarked": False, "message": "Project removed from saved bookmarks"}
    else:
        new_bm = models.Bookmark(user_id=current_user.id, project_id=project_id)
        db.add(new_bm)
        db.commit()
        return {"bookmarked": True, "message": "Project saved to bookmarks"}


@router.get("/my-projects", response_model=List[schemas.ProjectResponse])
def get_my_uploaded_projects(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves all academic projects uploaded by the current user."""
    projects = db.query(models.Project).filter(models.Project.author_id == current_user.id).all()
    results = []
    for p in projects:
        resp = schemas.ProjectResponse.from_orm(p)
        resp.category_name = p.category_rel.category_name if p.category_rel else None
        resp.author_name = current_user.name
        results.append(resp)
    return results


# ----------------- Admin User Management -----------------

@router.get("", response_model=List[schemas.UserResponse])
def get_all_users(
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Lists all registered platform users (Admin only)."""
    return db.query(models.User).all()


@router.put("/{user_id}/role")
def update_user_role(
    user_id: int,
    role: models.UserRole,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Updates user privilege role (Admin only)."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id == current_admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot alter your own role")

    user.role = role
    db.commit()
    return {"message": f"User role updated to {role.value}", "user_id": user.id}


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Removes a user account (Admin only)."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id == current_admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete your own admin account")

    db.delete(user)
    db.commit()
    return {"message": "User account removed", "user_id": user_id}
