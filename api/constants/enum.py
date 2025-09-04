from pyparsing import Enum

class ModeEnum(str, Enum):
    """Enum cho các mode hoạt động của hệ thống."""
    LEARNING = "learning"
    PROJECT = "project"

class DifficultyEnum(str, Enum):
    """Enum cho các mức độ khó."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    
class JourneyEnum(str, Enum):
    """Enum cho các hành trình người dùng."""
    LOCKED = "locked"
    COMPLETED = "completed"
    CURRENT = "current"
    
class TutorAgentStateEnum(int, Enum):
    """Enum cho trạng thái của TutorAgent."""
    EXPLAINING_WHAT = 1
    PRACTICING_WHAT = 2
    FEEDBACK_WHAT = 3
    EXPLAINING_WHY = 4
    PRACTICING_WHY = 5
    FEEDBACK_WHY = 6
    EXPLAINING_HOW = 7
    QUIZ = 8
    COMPLETION = 9

class CacheKeys(str, Enum):
    """Enum cho các khóa cache."""
    CURRICULUM_DATA = "CURRICULUM_DATA"
    LESSON_DATA = "LESSON_DATA"
    
class InteractionTypeEnum(str, Enum):
    """Enum cho các loại tương tác."""
    IDENTIFY_ERROR = "identify_error"
    FREE_TEXT_RESPONSE = "free_text_response"
    CATEGORIZE_ERROR = "categorize_error"
    
class ChatRoleEnum(str, Enum):
    """Enum cho các vai trò trong chat."""
    ALVA = "model"
    USER = "user"
