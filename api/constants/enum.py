from pyparsing import Enum

class JourneyEnum(str, Enum):
    """Enum cho các hành trình người dùng."""
    LOCKED = "locked"
    COMPLETED = "completed"
    CURRENT = "current"
