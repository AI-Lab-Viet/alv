"""
Routes for system status and health check endpoints
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from api.config import dispatcher, app_stats
from models.schemas import SystemHealth, ErrorResponse

router = APIRouter()

@router.get("/", 
         summary="Welcome endpoint",
         description="Endpoint chào mừng và thông tin cơ bản về API")
def read_root():
    """Endpoint gốc với thông tin chào mừng."""
    return {
        "message": "Chào mừng đến với AI Lab Việt Multi-Agent System API",
        "version": "1.0.0",
        "documentation": "/docs",
        "health_check": "/health",
        "available_endpoints": {
            "interact": "/interact",
            "project_flow_test": "/test_project_flow",
            "system_status": "/status"
        }
    }

@router.get("/health",
         response_model=SystemHealth,
         summary="Health check endpoint",
         description="Kiểm tra trạng thái sức khỏe của hệ thống")
def health_check():
    """
    Health check endpoint để monitor trạng thái hệ thống.
    """
    try:
        # Lấy system status từ dispatcher
        system_status = dispatcher.get_system_status()
        
        # Tính uptime
        uptime = datetime.now() - app_stats["start_time"]
        uptime_seconds = int(uptime.total_seconds())
        
        # Tạo agent status list
        agent_statuses = []
        
        # Thêm orchestration agents
        for agent_name, status in system_status["orchestration_agents"].items():
            agent_statuses.append({
                "agent_name": f"{agent_name.title()}Agent",
                "status": status["status"] if isinstance(status, dict) else status,
                "last_activity": datetime.now().isoformat(),
                "tasks_completed": 0,
                "current_task": None
            })
        
        # Thêm execution agents  
        for agent_name, status in system_status["execution_agents"].items():
            agent_statuses.append({
                "agent_name": f"{agent_name.title()}Agent",
                "status": status["status"] if isinstance(status, dict) else status,
                "last_activity": datetime.now().isoformat(),
                "tasks_completed": 0,
                "current_task": None
            })
        
        # Thêm communication agents
        for agent_name, status in system_status["communication_agents"].items():
            agent_statuses.append({
                "agent_name": f"{agent_name.title()}Agent", 
                "status": status["status"] if isinstance(status, dict) else status,
                "last_activity": datetime.now().isoformat(),
                "tasks_completed": 0,
                "current_task": None
            })
        
        health = SystemHealth(
            status="healthy",
            timestamp=datetime.now().isoformat(),
            agents=agent_statuses,
            version="1.0.0",
            uptime_seconds=uptime_seconds
        )
        
        return health
        
    except Exception as e:
        print(f"[FastAPI] Health check failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service temporarily unavailable"
        )

@router.get("/status",
         summary="System status endpoint",
         description="Thông tin chi tiết về trạng thái và thống kê hệ thống")
def get_system_status():
    """
    Endpoint để lấy thông tin chi tiết về hệ thống.
    """
    uptime = datetime.now() - app_stats["start_time"]
    
    return {
        "system_info": {
            "status": "running",
            "version": "1.0.0",
            "start_time": app_stats["start_time"].isoformat(),
            "uptime_seconds": int(uptime.total_seconds()),
            "uptime_human": str(uptime)
        },
        "statistics": {
            "total_requests": app_stats["total_requests"],
            "successful_requests": app_stats["successful_requests"],
            "failed_requests": app_stats["failed_requests"],
            "success_rate": (app_stats["successful_requests"] / max(app_stats["total_requests"], 1)) * 100
        },
        "agents": dispatcher.get_system_status()
    }

# Note: Exception handlers should be added to the main FastAPI app, not router
