"""
Authentication Router: Registration, Login, Logout, Forgot & Reset Password
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory dictionary to store simulation tokens for Forgot Password
RESET_TOKENS = {}

@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    """Registers a new student, faculty, or user with hashed credentials."""
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    hashed_pw = get_password_hash(user_in.password)
    new_user = models.User(
        name=user_in.name,
        email=user_in.email,
        password=hashed_pw,
        role=user_in.role,
        department=user_in.department,
        institution=user_in.institution,
        avatar=f"https://api.dicebear.com/7.x/bottts/svg?seed={user_in.name}"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email, "role": new_user.role.value})
    return {"access_token": token, "token_type": "bearer", "user": new_user}


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Authenticates credentials and returns a secure JWT bearer token."""
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = create_access_token({"sub": user.email, "role": user.role.value})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/logout")
def logout():
    """Client-side token invalidation confirmation."""
    return {"message": "Successfully logged out of ProjectHub"}


@router.post("/forgot-password")
def forgot_password(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Simulates sending a password reset email with a secure verification token."""
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        # Return generic success to prevent email enumeration
        return {
            "message": "If an account exists with this email, a password reset token has been dispatched.",
            "simulated_token": None
        }

    token = str(uuid.uuid4())[:8].upper()
    RESET_TOKENS[req.email] = token

    return {
        "message": f"Password reset instructions and token dispatched to {req.email}",
        "simulated_token": token,
        "note": "In production, this token is securely emailed. For development and testing, use the token shown above."
    }


@router.post("/reset-password")
def reset_password(req: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    """Validates the reset token and securely updates user password."""
    stored_token = RESET_TOKENS.get(req.email)
    if not stored_token or stored_token != req.reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.password = get_password_hash(req.new_password)
    db.commit()

    del RESET_TOKENS[req.email]
    return {"message": "Password successfully reset. You may now log in with your new password."}


@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    """Returns the authenticated user profile."""
    return current_user
