"""
SQLAlchemy ORM Models with Relational Integrity and Constraints for ProjectHub
"""

import enum
from sqlalchemy import (
    Column, Integer, String, Text, Numeric, Boolean, DateTime,
    ForeignKey, Enum, JSON, func
)
from sqlalchemy.orm import relationship
from database import Base

class UserRole(str, enum.Enum):
    student = "student"
    admin = "admin"
    faculty = "faculty"

class ProjectDifficulty(str, enum.Enum):
    Beginner = "Beginner"
    Intermediate = "Intermediate"
    Advanced = "Advanced"

class ProjectType(str, enum.Enum):
    Free = "Free"
    Paid = "Paid"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)
    department = Column(String(100), nullable=True)
    institution = Column(String(150), nullable=True)
    avatar = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    projects = relationship("Project", back_populates="author", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="Folder")
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    projects = relationship("Project", back_populates="category_rel")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False, index=True)
    short_description = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    technology = Column(JSON, nullable=False)  # list of strings e.g. ["Python", "FastAPI"]
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    difficulty = Column(Enum(ProjectDifficulty), default=ProjectDifficulty.Intermediate, nullable=False)
    image = Column(String(500), nullable=False)
    screenshots = Column(JSON, nullable=True)
    project_type = Column(Enum(ProjectType), default=ProjectType.Free, nullable=False)
    price = Column(Numeric(10, 2), default=0.00, nullable=False)
    features = Column(JSON, nullable=True)
    github_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    views_count = Column(Integer, default=0)
    featured = Column(Boolean, default=False)
    trending = Column(Boolean, default=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    category_rel = relationship("Category", back_populates="projects")
    author = relationship("User", back_populates="projects")
    bookmarks = relationship("Bookmark", back_populates="project", cascade="all, delete-orphan")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="bookmarks")
    project = relationship("Project", back_populates="bookmarks")


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_name = Column(String(100), nullable=False)
    user_email = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="pending")
    created_at = Column(DateTime, server_default=func.now())
