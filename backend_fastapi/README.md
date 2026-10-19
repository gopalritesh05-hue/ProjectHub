# ProjectHub FastAPI & MySQL Backend

A production-ready academic project discovery and marketplace backend built with **FastAPI**, **SQLAlchemy ORM**, and **MySQL 8.0+**.

## Features
- **JWT Authentication**: Secure user registration, password hashing (bcrypt), login, token issuance, and simulated password reset tokens.
- **Relational MySQL Database**: Comprehensive schema with `users`, `categories`, `projects`, `bookmarks`, and `inquiries`.
- **Project Marketplace**: Support for Free and Paid projects with pricing metadata.
- **Full-Text & Multi-filter Search**: Search by project name, filter by category, technology, difficulty, and sort by latest, price, or popularity.
- **Role-Based Access Control**: Student, Faculty, and Admin roles with guarded CRUD endpoints.
- **Strict Scope**: Display project prices without payment gateway integration, providing contact inquiry hooks.

## Project Structure
```text
backend_fastapi/
├── main.py               # FastAPI entry point & CORS configuration
├── database.py           # SQLAlchemy MySQL engine & session dependency
├── models.py             # Relational ORM models with foreign keys & relationships
├── schemas.py            # Pydantic validation schemas
├── auth.py               # BCrypt password hashing & JWT token verification
├── requirements.txt      # Python dependencies
├── schema.sql            # Complete MySQL DDL table schema & seed data
├── README.md             # Documentation
└── routers/
    ├── __init__.py
    ├── auth.py           # Register, Login, Forgot & Reset Password
    ├── projects.py       # Projects CRUD, Search, Filters, Inquiries
    ├── categories.py     # Category management
    ├── users.py          # User management, bookmarks, my-projects
    └── dashboard.py      # Statistical KPI counters for admin & users
```

## Setup & Execution Instructions

### 1. Database Setup (MySQL)
Make sure MySQL server is running, then execute the schema script:
```bash
mysql -u root -p < schema.sql
```
This creates the `projecthub_db` database and seeds it with default users, categories, and academic projects.

### 2. Python Environment & Dependencies
Create a virtual environment and install dependencies:
```bash
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in `backend_fastapi/`:
```env
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=projecthub_db
JWT_SECRET_KEY=projecthub_secure_jwt_secret_key_2026_academic
```

### 4. Start the FastAPI Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive Swagger documentation will be available at:
`http://localhost:8000/docs`
ReDoc documentation will be at:
`http://localhost:8000/redoc`

## Default Seed Credentials
- **Admin**: `admin@projecthub.edu` / `admin123`
- **Student**: `student@projecthub.edu` / `student123`
