"""
Pydantic Validation Schemas for FastAPI Request/Response serialization
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from models import UserRole, ProjectDifficulty, ProjectType

# User Schemas
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: UserRole = UserRole.student
    department: Optional[str] = None
    institution: Optional[str] = None

class UserRegister(UserBase):
    password: str = Field(..., min_length=6, max_length=50)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    avatar: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    reset_token: str
    new_password: str = Field(..., min_length=6)

# Category Schemas
class CategoryBase(BaseModel):
    category_name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = "Folder"

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    project_count: Optional[int] = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    short_description: str = Field(..., min_length=10, max_length=500)
    description: str = Field(..., min_length=20)
    technology: List[str] = Field(..., min_items=1)
    category_id: int
    difficulty: ProjectDifficulty = ProjectDifficulty.Intermediate
    image: str
    screenshots: Optional[List[str]] = []
    project_type: ProjectType = ProjectType.Free
    price: float = Field(default=0.0, ge=0.0)
    features: Optional[List[str]] = []
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: Optional[bool] = False
    trending: Optional[bool] = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    technology: Optional[List[str]] = None
    category_id: Optional[int] = None
    difficulty: Optional[ProjectDifficulty] = None
    image: Optional[str] = None
    screenshots: Optional[List[str]] = None
    project_type: Optional[ProjectType] = None
    price: Optional[float] = None
    features: Optional[List[str]] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: Optional[bool] = None
    trending: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int
    category_name: Optional[str] = None
    views_count: int = 0
    author_id: Optional[int] = None
    author_name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Bookmark Schemas
class BookmarkCreate(BaseModel):
    project_id: int

class BookmarkResponse(BaseModel):
    id: int
    user_id: int
    project_id: int
    created_at: Optional[datetime] = None
    project: Optional[ProjectResponse] = None

    class Config:
        from_attributes = True

# Inquiry Schema (For Buy Now / Contact Admin)
class InquiryCreate(BaseModel):
    project_id: int
    user_name: str
    user_email: EmailStr
    message: str

class InquiryResponse(InquiryCreate):
    id: int
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Admin Stats Schema
class AdminStatsResponse(BaseModel):
    total_users: int
    total_projects: int
    free_projects: int
    paid_projects: int
    categories_count: int
    total_bookmarks: int
