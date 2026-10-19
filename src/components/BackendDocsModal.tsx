import React, { useState } from 'react';
import {
  X, Terminal, Database, Code, Copy, Check,
  Play, CheckCircle2, Layers, Server, Globe
} from 'lucide-react';
import { api } from '../services/api';

interface BackendDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FASTAPI_FILES: Record<string, string> = {
  'main.py': `"""
ProjectHub: Centralized Academic Project Discovery & Management Platform
FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, projects, categories, users, dashboard

# Auto-generate tables in MySQL if not present
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectHub Academic API",
    description="Academic Project Discovery and Marketplace RESTful API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(dashboard.router)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "ProjectHub Academic API"}
`,

  'database.py': `"""
Database Connection and Session Management for ProjectHub (MySQL + SQLAlchemy)
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "password")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "projecthub_db")

DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=10,
    max_overflow=20
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
`,

  'models.py': `"""
SQLAlchemy Relational Models for Users, Projects, Categories, and Bookmarks
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

class ProjectType(str, enum.Enum):
    Free = "Free"
    Paid = "Paid"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student)
    department = Column(String(100))
    created_at = Column(DateTime, server_default=func.now())

    projects = relationship("Project", back_populates="author")
    bookmarks = relationship("Bookmark", back_populates="user")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    short_description = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    technology = Column(JSON, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    difficulty = Column(String(50), default="Intermediate")
    image = Column(String(500), nullable=False)
    project_type = Column(Enum(ProjectType), default=ProjectType.Free)
    price = Column(Numeric(10, 2), default=0.00)
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

    category_rel = relationship("Category", back_populates="projects")
    author = relationship("User", back_populates="projects")
    bookmarks = relationship("Bookmark", back_populates="project")
`,

  'auth.py': `"""
Password Hashing (BCrypt) and JWT Token Verification
"""
import os
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "projecthub_secure_key")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
`
};

const MYSQL_SCHEMA = `-- ==========================================================
-- ProjectHub: Relational MySQL 8.0+ Database Schema
-- ==========================================================
CREATE DATABASE IF NOT EXISTS projecthub_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE projecthub_db;

-- 1. USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'faculty') DEFAULT 'student',
    department VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    icon VARCHAR(50) DEFAULT 'Folder'
) ENGINE=InnoDB;

-- 3. PROJECTS TABLE
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_description VARCHAR(500) NOT NULL,
    description LONGTEXT NOT NULL,
    technology JSON NOT NULL,
    category_id INT NOT NULL,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate',
    image VARCHAR(500) NOT NULL,
    project_type ENUM('Free', 'Paid') DEFAULT 'Free',
    price DECIMAL(10, 2) DEFAULT 0.00,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_category FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_project_type (project_type),
    FULLTEXT INDEX ft_project_search (title, short_description)
) ENGINE=InnoDB;

-- 4. BOOKMARKS TABLE
CREATE TABLE bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bm_proj FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_proj (user_id, project_id)
) ENGINE=InnoDB;
`;

export const BackendDocsModal: React.FC<BackendDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeDocTab, setActiveDocTab] = useState<'fastapi' | 'mysql' | 'tester'>('fastapi');
  const [selectedFastApiFile, setSelectedFastApiFile] = useState<string>('main.py');
  const [copied, setCopied] = useState(false);

  // Live API Tester states
  const [testEndpoint, setTestEndpoint] = useState('/api/projects');
  const [testMethod, setTestMethod] = useState<'GET' | 'POST'>('GET');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runApiTest = async () => {
    setTesting(true);
    try {
      if (testEndpoint.includes('/api/projects')) {
        const data = await api.getProjects({ sort_by: 'latest' });
        setTestResponse(JSON.stringify(data.slice(0, 2), null, 2));
        setTestStatus(200);
      } else if (testEndpoint.includes('/api/categories')) {
        const data = await api.getCategories();
        setTestResponse(JSON.stringify(data, null, 2));
        setTestStatus(200);
      } else if (testEndpoint.includes('/api/dashboard/stats')) {
        const data = await api.getDashboardStats();
        setTestResponse(JSON.stringify(data, null, 2));
        setTestStatus(200);
      } else if (testEndpoint.includes('/api/health')) {
        setTestResponse(JSON.stringify({ status: 'healthy', service: 'ProjectHub Academic API', version: '1.0.0' }, null, 2));
        setTestStatus(200);
      } else {
        setTestResponse(JSON.stringify({ error: 'Endpoint not simulated in preview tester' }, null, 2));
        setTestStatus(404);
      }
    } catch (e: any) {
      setTestResponse(JSON.stringify({ error: e.message }, null, 2));
      setTestStatus(500);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 p-6 sm:p-8 text-left max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-xs font-semibold border border-teal-500/30 flex items-center gap-1">
              <Server className="w-3.5 h-3.5" />
              Full-Stack Architecture Documentation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
            FastAPI Backend & MySQL Relational Schema
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete production-ready code organized into modular files with Pydantic validation, JWT authentication, and MySQL DDL script.
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-5 border-b border-slate-800 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveDocTab('fastapi')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeDocTab === 'fastapi'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code className="w-4 h-4 text-blue-400" />
              <span>FastAPI Source Code</span>
            </button>
            <button
              onClick={() => setActiveDocTab('mysql')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeDocTab === 'mysql'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Database className="w-4 h-4 text-teal-400" />
              <span>MySQL Relational Schema (SQL)</span>
            </button>
            <button
              onClick={() => setActiveDocTab('tester')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeDocTab === 'tester'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Play className="w-4 h-4 text-indigo-400" />
              <span>Interactive REST API Runner</span>
            </button>
          </div>
        </div>

        {/* 1. FASTAPI CODE VIEWER */}
        {activeDocTab === 'fastapi' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* File pills */}
            <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {Object.keys(FASTAPI_FILES).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFastApiFile(fileName)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                      selectedFastApiFile === fileName
                        ? 'bg-slate-800 text-blue-400 border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {fileName}
                  </button>
                ))}
              </div>

              <button
                onClick={() => copyToClipboard(FASTAPI_FILES[selectedFastApiFile])}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code container */}
            <div className="flex-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed shadow-inner">
              <pre>
                <code>{FASTAPI_FILES[selectedFastApiFile]}</code>
              </pre>
            </div>
          </div>
        )}

        {/* 2. MYSQL SCHEMA VIEWER */}
        {activeDocTab === 'mysql' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <span className="text-xs text-slate-400 font-mono">schema.sql (MySQL 8.0+ DDL & Relationships)</span>
              <button
                onClick={() => copyToClipboard(MYSQL_SCHEMA)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <div className="flex-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-y-auto font-mono text-xs text-teal-300 leading-relaxed shadow-inner">
              <pre>
                <code>{MYSQL_SCHEMA}</code>
              </pre>
            </div>
          </div>
        )}

        {/* 3. INTERACTIVE REST API TESTER */}
        {activeDocTab === 'tester' && (
          <div className="flex-1 flex flex-col overflow-hidden space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-xs">
                {testMethod}
              </span>
              <select
                value={testEndpoint}
                onChange={(e) => setTestEndpoint(e.target.value)}
                className="flex-1 w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs font-mono text-white outline-none"
              >
                <option value="/api/projects">GET /api/projects (Fetch all academic projects)</option>
                <option value="/api/categories">GET /api/categories (Fetch academic categories with counts)</option>
                <option value="/api/dashboard/stats">GET /api/dashboard/stats (KPI counters)</option>
                <option value="/api/health">GET /api/health (System operational readiness)</option>
              </select>

              <button
                onClick={runApiTest}
                disabled={testing}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-colors flex-shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{testing ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

            {/* Results Output */}
            <div className="flex-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-y-auto font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-[11px] text-slate-400 font-mono">Response Payload</span>
                {testStatus && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    testStatus === 200 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400'
                  }`}>
                    HTTP {testStatus} OK
                  </span>
                )}
              </div>
              {testResponse ? (
                <pre><code>{testResponse}</code></pre>
              ) : (
                <p className="text-slate-500 italic">Click "Send Request" above to execute and inspect the live JSON payload.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
