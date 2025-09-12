"""
Routes for portfolio-related endpoints
"""
from fastapi import APIRouter, Header, HTTPException

from api.config import dispatcher
from api.dependencies import validate_user_id

router = APIRouter()

@router.get("/portfolio", summary="Lấy portfolio của user", description="Truy xuất tất cả completed projects của user từ database")
def get_portfolio(
    user_id: str = Header(..., description="ID của user")
):
    """
    Lấy portfolio của user từ database completed_projects.
    
    Args:
        user_id: ID của user từ header
        
    Returns:
        Dictionary chứa danh sách projects của user
    """
    try:
        # Validate user_id
        user_id = validate_user_id(user_id)
        
        portfolio_agent = dispatcher.portfolio_agent
        result = portfolio_agent.get_portfolio_by_user_id(user_id)
        
        if result.get("status") == "success":
            return {
                "status": "success",
                "user_id": user_id,
                "total_projects": result["total_projects"],
                "projects": result["projects"],
                "source": result.get("source", "supabase"),
                "message": result.get("message", f"Found {result['total_projects']} projects")
            }
        else:
            return {
                "status": "error",
                "user_id": user_id,
                "error_message": result.get("error_message", "Unknown error")
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
