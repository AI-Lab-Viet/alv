"""
Dependencies and validation functions for FastAPI
"""
from fastapi import HTTPException, status

def validate_user_id(user_id: str) -> str:
    """Validate user_id từ header"""
    if not user_id or user_id.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid user_id in header"
        )
    return user_id.strip()
