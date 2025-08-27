# models/schemas.py
"""
Pydantic models cho request/response schemas của AI Lab Việt API.
Định nghĩa các data structures được sử dụng trong FastAPI endpoints.
"""

from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from enum import Enum


class ModeEnum(str, Enum):
    """Enum cho các mode hoạt động của hệ thống."""
    LEARNING = "learning"
    PROJECT = "project"


class DifficultyEnum(str, Enum):
    """Enum cho các mức độ khó."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class InteractionRequest(BaseModel):
    """Schema cho request tương tác với hệ thống."""
    user_input: str = Field(..., description="Input từ người dùng")
    session_context: Dict[str, Any] = Field(
        default_factory=dict,
        description="Ngữ cảnh phiên làm việc hiện tại"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_input": "Tôi muốn học về Machine Learning cơ bản",
                "session_context": {
                    "mode": "learning",
                    "user_id": "user123",
                    "difficulty_level": "beginner",
                    "topic": "machine_learning"
                }
            }
        }


class InteractionResponse(BaseModel):
    """Schema cho response từ hệ thống."""
    agent_name: str = Field(..., description="Tên agent đã xử lý request")
    action: Dict[str, Any] = Field(..., description="Action plan được tạo bởi agent")
    response_message: str = Field(..., description="Thông điệp phản hồi cho người dùng")
    
    class Config:
        json_schema_extra = {
            "example": {
                "agent_name": "TutorAgent",
                "action": {
                    "type": "learning_orchestration",
                    "steps": [
                        {"agent": "InteractionAgent", "action": "analyze_learning_intent"},
                        {"agent": "PracticeAgent", "action": "generate_practice_exercises"}
                    ]
                },
                "response_message": "Đã tạo kế hoạch học tập Machine Learning cho bạn!"
            }
        }


class LearningRequest(BaseModel):
    """Schema cho request học tập cụ thể."""
    topic: str = Field(..., description="Chủ đề học tập")
    difficulty_level: DifficultyEnum = Field(default=DifficultyEnum.BEGINNER)
    learning_goals: List[str] = Field(default_factory=list)
    time_budget_minutes: Optional[int] = Field(None, description="Thời gian học dự kiến (phút)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "topic": "Python Programming",
                "difficulty_level": "intermediate",
                "learning_goals": ["Học về OOP", "Thực hành với APIs"],
                "time_budget_minutes": 60
            }
        }


class ProjectRequest(BaseModel):
    """Schema cho request dự án."""
    project_name: str = Field(..., description="Tên dự án")
    project_description: str = Field(..., description="Mô tả dự án")
    team_size: int = Field(default=1, description="Số thành viên team")
    duration_weeks: int = Field(default=4, description="Thời gian dự án (tuần)")
    required_skills: List[str] = Field(default_factory=list)
    
    class Config:
        json_schema_extra = {
            "example": {
                "project_name": "AI Chatbot",
                "project_description": "Xây dựng chatbot AI cho customer service",
                "team_size": 3,
                "duration_weeks": 6,
                "required_skills": ["Python", "NLP", "FastAPI"]
            }
        }


class PracticeExerciseResponse(BaseModel):
    """Schema cho response bài tập thực hành."""
    exercise_id: str
    title: str
    description: str
    difficulty_level: DifficultyEnum
    estimated_time: int = Field(..., description="Thời gian ước tính (phút)")
    instructions: List[str]
    resources: List[str]
    evaluation_criteria: List[str]


class QuizResponse(BaseModel):
    """Schema cho response quiz."""
    quiz_id: str
    title: str
    description: str
    difficulty_level: DifficultyEnum
    question_count: int
    time_limit: int = Field(..., description="Thời gian làm bài (phút)")
    questions: List[Dict[str, Any]]
    scoring: Dict[str, Any]


class AnalysisResponse(BaseModel):
    """Schema cho response phân tích."""
    analysis_id: str
    analysis_type: str
    metrics: Dict[str, float]
    insights: List[str]
    recommendations: List[str]
    summary: Optional[str] = None


class PortfolioResponse(BaseModel):
    """Schema cho response portfolio."""
    portfolio_id: str
    portfolio_type: str
    title: str
    description: Optional[str] = None
    sections: Dict[str, Any]
    showcase_format: str
    last_updated: str


class SessionContext(BaseModel):
    """Schema cho session context."""
    user_id: str = Field(..., description="ID người dùng")
    mode: ModeEnum = Field(..., description="Mode hoạt động hiện tại")
    difficulty_level: DifficultyEnum = Field(default=DifficultyEnum.BEGINNER)
    topic: Optional[str] = Field(None, description="Chủ đề hiện tại")
    learning_mode: Optional[str] = Field("guided", description="Chế độ học")
    project_phase: Optional[str] = Field("planning", description="Phase dự án")
    preferences: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "mode": "learning",
                "difficulty_level": "intermediate",
                "topic": "machine_learning",
                "learning_mode": "self_paced",
                "preferences": {
                    "language": "vietnamese",
                    "learning_style": "hands_on"
                }
            }
        }


class AgentStatus(BaseModel):
    """Schema cho trạng thái agent."""
    agent_name: str
    status: str = Field(..., description="Trạng thái: active, idle, error")
    last_activity: str
    tasks_completed: int = Field(default=0)
    current_task: Optional[str] = None


class SystemHealth(BaseModel):
    """Schema cho health check của hệ thống."""
    status: str = Field(..., description="overall, healthy, degraded, down")
    timestamp: str
    agents: List[AgentStatus]
    version: str
    uptime_seconds: int


class ErrorResponse(BaseModel):
    """Schema cho error responses."""
    error_code: str
    error_message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "error_code": "INVALID_MODE",
                "error_message": "Mode không hợp lệ. Chỉ chấp nhận 'learning' hoặc 'project'",
                "details": {"provided_mode": "invalid_mode"},
                "timestamp": "2024-01-01T12:00:00Z"
            }
        }
