from pyparsing import Enum

class JourneyEnum(str, Enum):
    """Enum cho các hành trình người dùng."""
    LOCKED = "locked"
    COMPLETED = "completed"
    CURRENT = "current"
    
class TutorAgentStateEnum(str, Enum):
    """Enum cho trạng thái của TutorAgent."""
    GREETING = 0
    EXPLAINING_WHAT = 1
    PRACTICING_WHAT = 2
    FEEDBACK_WHAT = 3
    EXPLAINING_WHY = 4
    PRACTICING_WHY = 5
    FEEDBACK_WHY = 6
    EXPLAINING_HOW = 7
    QUIZ = 8
    COMPLETION = 9
