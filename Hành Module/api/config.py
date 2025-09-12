"""
Configuration module for AI Lab Việt Multi-Agent System API
"""
import os
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv
from core.dispatcher import SmartDispatcher

# Load environment variables
load_dotenv()

# App statistics tracking
app_stats = {
    "start_time": datetime.now(),
    "total_requests": 0,
    "successful_requests": 0,
    "failed_requests": 0
}

# Supabase configuration
def get_supabase_client() -> Client:
    """Initialize and return Supabase client"""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    return create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Initialize global instances
supabase = get_supabase_client()
dispatcher = SmartDispatcher()

# Inject Supabase client into agents
if supabase:
    dispatcher.set_supabase_client(supabase)

# FastAPI app configuration
APP_CONFIG = {
    "title": "AI Lab Việt - Multi-Agent System API",
    "description": """
    API cho hệ thống đa tác tử thông minh của AI Lab Việt.
    
    Hệ thống bao gồm:
    - **Orchestration Agents**: Điều phối workflow (TutorAgent, ProjectAgent)
    - **Execution Agents**: Thực thi tác vụ cụ thể (PracticeAgent, QuizAgent, MissionAgent, AnalysisAgent, PortfolioAgent)
    - **Communication Agents**: Giao tiếp với dịch vụ bên ngoài (InteractionAgent)
    
    Sử dụng SmartDispatcher để định tuyến request đến đúng agents.
    """,
    "version": "1.0.0",
    "docs_url": "/docs",
    "redoc_url": "/redoc"
}

# CORS configuration
CORS_CONFIG = {
    "allow_origins": ["*"],  # Trong production nên chỉ định specific origins
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}
