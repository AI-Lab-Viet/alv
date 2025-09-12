"""
AI Lab Việt - Multi-Agent System API
Main application entry point (redirects to modular structure)
"""
import uvicorn

# Import the new modular app
from api.main import app

if __name__ == "__main__":
    print("🚀 Starting AI Lab Việt Multi-Agent System API...")
    print("📚 Documentation will be available at: http://localhost:8000/docs")
    print("🔍 Health check available at: http://localhost:8000/health")
    print("📊 System status available at: http://localhost:8000/status")
    
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    )
