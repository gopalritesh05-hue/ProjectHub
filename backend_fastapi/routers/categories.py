"""
Categories Router: Category listing with project counts, creation, updates, and deletion
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import models
import schemas
from auth import get_current_admin

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("", response_model=List[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Fetches all project categories with associated project counts."""
    categories = db.query(models.Category).all()
    results = []
    for cat in categories:
        count = db.query(func.count(models.Project.id)).filter(models.Project.category_id == cat.id).scalar() or 0
        resp = schemas.CategoryResponse.from_orm(cat)
        resp.project_count = count
        results.append(resp)
    return results


@router.post("", response_model=schemas.CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: schemas.CategoryCreate,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Creates a new academic category (Admin only)."""
    existing = db.query(models.Category).filter(
        models.Category.category_name.ilike(cat_in.category_name)
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists")

    new_cat = models.Category(
        category_name=cat_in.category_name,
        description=cat_in.description,
        icon=cat_in.icon or "Folder"
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)

    resp = schemas.CategoryResponse.from_orm(new_cat)
    resp.project_count = 0
    return resp


@router.put("/{category_id}", response_model=schemas.CategoryResponse)
def update_category(
    category_id: int,
    cat_in: schemas.CategoryCreate,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Updates category details (Admin only)."""
    cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    cat.category_name = cat_in.category_name
    cat.description = cat_in.description
    if cat_in.icon:
        cat.icon = cat_in.icon

    db.commit()
    db.refresh(cat)

    count = db.query(func.count(models.Project.id)).filter(models.Project.category_id == cat.id).scalar() or 0
    resp = schemas.CategoryResponse.from_orm(cat)
    resp.project_count = count
    return resp


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Deletes a category if it has no associated projects (Admin only)."""
    cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    project_count = db.query(func.count(models.Project.id)).filter(models.Project.category_id == cat.id).scalar() or 0
    if project_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete category: {project_count} projects are currently assigned to it. Reassign or delete them first."
        )

    db.delete(cat)
    db.commit()
    return {"message": "Category deleted successfully", "id": category_id}
