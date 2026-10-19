"""
Projects Router: CRUD operations, filtering, sorting, search, bookmarks, and buy-now inquiries
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from database import get_db
import models
import schemas
from auth import get_current_user, get_current_admin

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.get("", response_model=List[schemas.ProjectResponse])
def get_projects(
    search: Optional[str] = Query(None, description="Search term in title or description"),
    category: Optional[str] = Query(None, description="Category name filter"),
    technology: Optional[str] = Query(None, description="Technology filter"),
    difficulty: Optional[str] = Query(None, description="Beginner, Intermediate, Advanced"),
    project_type: Optional[str] = Query(None, description="Free or Paid"),
    sort_by: Optional[str] = Query("latest", description="latest, price_asc, price_desc, popularity"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Fetches projects with comprehensive multi-criteria filtering, sorting, and pagination."""
    query = db.query(models.Project)

    # Search filter
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                models.Project.title.ilike(search_pattern),
                models.Project.short_description.ilike(search_pattern),
                models.Project.description.ilike(search_pattern)
            )
        )

    # Category filter
    if category and category.lower() != "all":
        query = query.join(models.Project.category_rel).filter(
            models.Category.category_name.ilike(category)
        )

    # Difficulty filter
    if difficulty and difficulty.lower() != "all":
        query = query.filter(models.Project.difficulty == difficulty)

    # Project Type filter (Free / Paid)
    if project_type and project_type.lower() != "all":
        query = query.filter(models.Project.project_type == project_type)

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(asc(models.Project.price))
    elif sort_by == "price_desc":
        query = query.order_by(desc(models.Project.price))
    elif sort_by == "popularity":
        query = query.order_by(desc(models.Project.views_count))
    else: # latest
        query = query.order_by(desc(models.Project.created_at))

    projects = query.offset(offset).limit(limit).all()

    # Enrich with category name
    results = []
    for p in projects:
        resp = schemas.ProjectResponse.from_orm(p)
        resp.category_name = p.category_rel.category_name if p.category_rel else None
        resp.author_name = p.author.name if p.author else "Academic Contributor"
        results.append(resp)
    return results


@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def get_project_by_id(project_id: int, db: Session = Depends(get_db)):
    """Retrieves full details for a project and increments its view counter."""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Increment views
    project.views_count += 1
    db.commit()

    resp = schemas.ProjectResponse.from_orm(project)
    resp.category_name = project.category_rel.category_name if project.category_rel else None
    resp.author_name = project.author.name if project.author else "Academic Contributor"
    return resp


@router.post("", response_model=schemas.ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: schemas.ProjectCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new academic project (Students can upload projects, Admins can directly publish)."""
    # Verify category exists
    cat = db.query(models.Category).filter(models.Category.id == project_in.category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID")

    new_project = models.Project(
        title=project_in.title,
        short_description=project_in.short_description,
        description=project_in.description,
        technology=project_in.technology,
        category_id=project_in.category_id,
        difficulty=project_in.difficulty,
        image=project_in.image,
        screenshots=project_in.screenshots or [],
        project_type=project_in.project_type,
        price=project_in.price if project_in.project_type == models.ProjectType.Paid else 0.0,
        features=project_in.features or [],
        github_url=project_in.github_url,
        demo_url=project_in.demo_url,
        featured=project_in.featured if current_user.role == models.UserRole.admin else False,
        trending=project_in.trending if current_user.role == models.UserRole.admin else False,
        author_id=current_user.id
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    resp = schemas.ProjectResponse.from_orm(new_project)
    resp.category_name = cat.category_name
    resp.author_name = current_user.name
    return resp


@router.put("/{project_id}", response_model=schemas.ProjectResponse)
def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates an existing project (Admin or project author only)."""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if current_user.role != models.UserRole.admin and project.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this project")

    update_data = project_update.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(project, field, val)

    # Sync price logic
    if project.project_type == models.ProjectType.Free:
        project.price = 0.0

    db.commit()
    db.refresh(project)

    resp = schemas.ProjectResponse.from_orm(project)
    resp.category_name = project.category_rel.category_name if project.category_rel else None
    resp.author_name = project.author.name if project.author else "Academic Contributor"
    return resp


@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
def delete_project(
    project_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a project (Admin or project author only)."""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if current_user.role != models.UserRole.admin and project.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this project")

    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully", "id": project_id}


# Inquiry Endpoint for Paid Projects (Notice: NO payment gateway)
@router.post("/inquire", response_model=schemas.InquiryResponse, status_code=status.HTTP_201_CREATED)
def create_project_inquiry(inquiry_in: schemas.InquiryCreate, db: Session = Depends(get_db)):
    """
    Submits a purchase inquiry/contact request for a paid project.
    Online purchasing is disabled in this version; requests are queued for administrative contact.
    """
    project = db.query(models.Project).filter(models.Project.id == inquiry_in.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    new_inquiry = models.Inquiry(
        project_id=inquiry_in.project_id,
        user_name=inquiry_in.user_name,
        user_email=inquiry_in.user_email,
        message=inquiry_in.message
    )
    db.add(new_inquiry)
    db.commit()
    db.refresh(new_inquiry)

    return new_inquiry
