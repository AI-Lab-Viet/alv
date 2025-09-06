# models/schemas.py
"""
Pydantic models cho request/response schemas của AI Lab Việt API.
Định nghĩa các data structures được sử dụng trong FastAPI endpoints.
"""

from datetime import date
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from constants.enum import DifficultyEnum, ModeEnum

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
    query: str = Field(..., description="Câu hỏi hoặc yêu cầu học tập cụ thể")
    current_state: int = Field(1, description="Trạng thái hiện tại của quá trình học tập")
    user_id: str = Field(..., description="ID người dùng")
    chapter_id: str = Field(..., description="ID chương học")
    session_id: str = Field(..., description="ID phiên làm việc")
    
    class Config:
        json_schema_extra = {
            "example": {
                "topic": "Nghệ thuật nhận định là gì?",
                "query": "Nghệ thuật nhận định",
                "user_id": "18645595-da81-43f7-b9ce-1834bec4d6d4",
                "chapter_id": "622f8ec2-0c4c-4874-81e7-912e1e4f4522",
                "session_id": "",
                "current_state": 1,
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

class UserJourney(BaseModel):
    """Schema cho hành trình người dùng."""
    id: Optional[int] = None
    world: int
    world_name: str
    name: str
    chapter: int
    description: str
    status: str
    user_id: str

class SkillProgress(BaseModel):
    """Schema cho tiến độ kỹ năng của người dùng."""
    id: Optional[str] = None
    user_id: str
    mastered_skill_num: Optional[int] = 0
    skills_completed: Optional[int] = 0
    total_skills: Optional[int] = 0
    last_accessed: Optional[str] = None
    
class KnowledgeVault(BaseModel):
    """Schema cho kho tri thức của người dùng."""
    id: Optional[str] = None
    user_id: str
    chapter: int
    title: str
    skill: str
    definition: str
    explanation: str
    status: str
    examples: list[str]
    tags: list[str]

class UpdateJourneyDto(BaseModel):
    """Schema cho dữ liệu cập nhật hành trình người dùng."""
    id: int
    status: str

class ContentBlock(BaseModel):
    """Schema cho một khối nội dung."""
    id: Optional[str] = None
    chapter: int
    block_type: str
    content: str
    display_order: int
    section: str
    
class LearningActivity(BaseModel):
    """Schema cho hoạt động học tập."""
    id: Optional[str] = None
    chapter_id: str
    activity_type: str
    content: Dict[str, Any]
    
class LearningChatHistory(BaseModel):
    """Schema cho lịch sử chat học tập."""
    id: Optional[str] = None
    chapter_id: str
    user_id: str
    activity_id: Optional[str] = None
    role: str
    content: str
    session_id: str
    created_at: Optional[str] = None

class JobData(BaseModel):
    """Schema cho dữ liệu job."""
    id: Optional[str] = None
    user_id: str
    state: int
    context: Dict[str, Any]
