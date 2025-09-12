# Execution Agents Package
"""
Các agent thực thi các tác vụ cụ thể
- PracticeAgent: Thực hiện bài tập thực hành
- QuizAgent: Tạo và quản lý quiz
- MissionAgent: Xử lý các nhiệm vụ dự án
- AnalysisAgent: Phân tích và đánh giá
- PortfolioAgent: Quản lý portfolio
"""

from .practice_agent import PracticeAgent
from .quiz_agent import QuizAgent
from .mission_agent import MissionAgent
from .analysis_agent import AnalysisAgent
from .portfolio_agent import PortfolioAgent

__all__ = [
    "PracticeAgent", 
    "QuizAgent", 
    "MissionAgent", 
    "AnalysisAgent", 
    "PortfolioAgent"
]
