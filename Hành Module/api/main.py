"""
AI Lab Việt - Multi-Agent System API
Main application file with modular architecture
"""
import uvicorn
from datetime import datetime
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.config import APP_CONFIG, CORS_CONFIG
from api.middleware import add_process_time_header
from api.routes import (
    system_routes,
    agent_routes, 
    mission_routes,
    project_routes,
    portfolio_routes,
    chat_routes
)
from models.schemas import ErrorResponse

# Khởi tạo FastAPI app
app = FastAPI(**APP_CONFIG)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    **CORS_CONFIG
)

# Process time middleware
app.middleware("http")(add_process_time_header)

# Include routers
app.include_router(system_routes.router, tags=["System"])
app.include_router(agent_routes.router, tags=["Agents"])
app.include_router(mission_routes.router, tags=["Missions"])
app.include_router(project_routes.router, tags=["Projects"])
app.include_router(portfolio_routes.router, tags=["Portfolio"])
app.include_router(chat_routes.router, tags=["Chat History"])

# Exception handlers
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    """Custom exception handler cho ValueError."""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=ErrorResponse(
            error_code="INVALID_INPUT",
            error_message=str(exc),
            timestamp=datetime.now().isoformat()
        ).dict()
    )

@app.exception_handler(500)
async def internal_server_error_handler(request, exc):
    """Custom exception handler cho internal server errors."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error_code="INTERNAL_ERROR",
            error_message="Đã có lỗi nội bộ xảy ra",
            details={"exception": str(exc)},
            timestamp=datetime.now().isoformat()
        ).dict()
    )

if __name__ == "__main__":
    print("🚀 Starting AI Lab Việt Multi-Agent System API...")
    print("📚 Documentation will be available at: http://localhost:8000/docs")
    print("🔍 Health check available at: http://localhost:8000/health")
    print("📊 System status available at: http://localhost:8000/status")
    
    uvicorn.run(
        "api.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    )
