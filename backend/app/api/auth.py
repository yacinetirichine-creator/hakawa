"""
Authentication routes
"""

from fastapi import APIRouter, HTTPException, Depends
from app.utils.supabase import supabase

router = APIRouter()


@router.post("/register")
async def register(email: str, password: str, full_name: str = None):
    """Register a new user"""
    try:
        result = supabase.auth.sign_up(
            {
                "email": email,
                "password": password,
                "options": {"data": {"full_name": full_name}},
            }
        )
        return {"message": "User registered successfully", "user": result.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(email: str, password: str):
    """Login user"""
    try:
        result = supabase.auth.sign_in_with_password(
            {"email": email, "password": password}
        )
        return {
            "access_token": result.session.access_token,
            "refresh_token": result.session.refresh_token,
            "user": result.user,
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/logout")
async def logout():
    """Logout user"""
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me")
async def get_current_user(token: str):
    """Get current user profile"""
    try:
        user = supabase.auth.get_user(token)
        profile = (
            supabase.table("profiles").select("*").eq("id", user.user.id).execute()
        )
        return profile.data[0] if profile.data else None
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
