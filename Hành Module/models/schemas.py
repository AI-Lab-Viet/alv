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
    domain_skills: List[str] = Field(default_factory=list, description="Kỹ năng chuyên môn")
    alv_skills: List[str] = Field(default_factory=list, description="Kỹ năng ALV (4D+S)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "project_name": "AI Chatbot",
                "project_description": "Xây dựng chatbot AI cho customer service",
                "team_size": 3,
                "duration_weeks": 6,
                "domain_skills": ["Python", "NLP", "FastAPI"],
                "alv_skills": ["#Description", "#Diligence"]
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


class PromptStarter(BaseModel):
    """Schema cho prompt starter."""
    title: str = Field(..., description="Tiêu đề của prompt")
    prompt: str = Field(..., description="Nội dung prompt")

class DetailedProject(BaseModel):
    """Schema cho chi tiết dự án/mission theo interface frontend."""
    id: int = Field(..., description="ID của mission/project")
    title: str = Field(..., description="Tiêu đề mission")
    description: str = Field(..., description="Mô tả chi tiết mission")
    category: str = Field(..., description="Danh mục mission")
    difficulty: str = Field(..., description="Mức độ khó")
    estimated_hours: str = Field(..., description="Thời gian ước tính")
    context: str = Field(..., description="Bối cảnh mission")
    learning_objectives: List[str] = Field(default_factory=list, description="Mục tiêu học tập")
    deliverables: List[str] = Field(default_factory=list, description="Sản phẩm đầu ra")
    tips: List[str] = Field(default_factory=list, description="Gợi ý thực hiện")
    prompt_starters: List[PromptStarter] = Field(default_factory=list, description="Prompt khởi đầu gợi ý")
    participants: int = Field(default=0, description="Số lượng người tham gia")
    rating: float = Field(default=0.0, description="Đánh giá trung bình")
    domain_skills: List[str] = Field(default_factory=list, description="Kỹ năng chuyên môn yêu cầu")
    alv_skills: List[str] = Field(default_factory=list, description="Kỹ năng ALV (4D+S) yêu cầu")
    thumbnail: str = Field(default="", description="Ảnh thumbnail")
    featured: bool = Field(default=False, description="Nhiệm vụ nổi bật")
    # Thêm các trường bổ sung
    created_at: Optional[str] = Field(None, description="Thời gian tạo")
    updated_at: Optional[str] = Field(None, description="Thời gian cập nhật")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "mission_01",
                "title": "Xây dựng Chatbot AI",
                "description": "Tạo một chatbot thông minh sử dụng AI để hỗ trợ khách hàng",
                "category": "AI & Machine Learning",
                "difficulty": "intermediate",
                "estimated_hours": "40-60 giờ",
                "context": "Dự án phù hợp cho sinh viên có kiến thức cơ bản về Python và muốn tìm hiểu về AI",
                "learning_objectives": [
                    "Hiểu về xử lý ngôn ngữ tự nhiên",
                    "Tích hợp API AI",
                    "Xây dựng giao diện chat"
                ],
                "deliverables": [
                    "Source code chatbot",
                    "Tài liệu kỹ thuật",
                    "Demo video"
                ],
                "tips": [
                    "Bắt đầu với chatbot đơn giản",
                    "Tập trung vào UX/UI",
                    "Test kỹ trước khi deploy"
                ],
                "prompt_starters": [
                    {
                        "title": "Thiết kế cấu trúc chatbot",
                        "prompt": "Hãy giúp tôi thiết kế cấu trúc cơ bản cho một chatbot AI hỗ trợ khách hàng."
                    },
                    {
                        "title": "Chọn công nghệ phù hợp",
                        "prompt": "Gợi ý các thư viện và framework Python tốt nhất để xây dựng chatbot."
                    }
                ],
                "participants": 15,
                "rating": 4.5,
                "domain_skills": ["Python", "NLP", "API Integration"],
                "alv_skills": ["#Description", "#Diligence"],
                "thumbnail": "/images/chatbot-thumbnail.jpg"
            }
        }


class MissionsListResponse(BaseModel):
    """Schema cho response danh sách missions."""
    total_missions: int = Field(..., description="Tổng số missions")
    page: int = Field(default=1, description="Trang hiện tại")
    page_size: int = Field(default=10, description="Số lượng mỗi trang")
    total_pages: int = Field(..., description="Tổng số trang")
    missions: List[DetailedProject] = Field(..., description="Danh sách missions")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_missions": 25,
                "page": 1,
                "page_size": 10,
                "total_pages": 3,
                "missions": [
                    {
                        "id": "mission_01",
                        "title": "Xây dựng Chatbot AI",
                        "category": "AI & Machine Learning",
                        "difficulty": "intermediate",
                        "participants": 15,
                        "rating": 4.5
                    }
                ]
            }
        }


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
