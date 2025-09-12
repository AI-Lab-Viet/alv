# agents/base.py
"""
Định nghĩa các lớp cơ sở trừu tượng (Abstract Base Classes) cho tất cả các agent.
Đây là interface mà các agent phải tuân theo.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any


class BaseAgent(ABC):
    """
    Lớp cơ sở trừu tượng cho tất cả các agent trong hệ thống.
    Định nghĩa các phương thức và thuộc tính chung.
    """
    
    @property
    def name(self) -> str:
        """Trả về tên của agent, mặc định là tên class."""
        return self.__class__.__name__
    
    def __repr__(self) -> str:
        """Representation string cho debugging."""
        return f"<{self.name}>"


class OrchestrationAgent(BaseAgent):
    """
    Lớp cơ sở cho các agent điều phối.
    Các agent này chịu trách nhiệm điều phối và quản lý workflow.
    """
    
    @abstractmethod
    def handle_request(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Xử lý yêu cầu từ người dùng và điều phối các agent khác.
        
        Args:
            user_input: Input từ người dùng
            session_context: Ngữ cảnh phiên làm việc hiện tại
            
        Returns:
            Dict chứa thông tin về action cần thực hiện
        """
        pass


class ExecutionAgent(BaseAgent):
    """
    Lớp cơ sở cho các agent thực thi.
    Các agent này thực hiện các tác vụ cụ thể được giao bởi orchestration agents.
    """
    
    @abstractmethod
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Thực thi một nhiệm vụ cụ thể và trả về kết quả.
        
        Args:
            params: Tham số đầu vào cho việc thực thi
            
        Returns:
            Dict chứa kết quả thực thi
        """
        pass


class CommunicationAgent(BaseAgent):
    """
    Lớp cơ sở cho các agent giao tiếp.
    Các agent này chuyên xử lý giao tiếp với các dịch vụ bên ngoài.
    """
    
    @abstractmethod
    def communicate(self, persona: str, context: Dict[str, Any], chat_history: list) -> str:
        """
        Tương tác với các dịch vụ bên ngoài (VD: LLM API).
        
        Args:
            persona: Personality/role của agent trong cuộc trò chuyện
            context: Ngữ cảnh hiện tại
            chat_history: Lịch sử chat
            
        Returns:
            Phản hồi từ dịch vụ bên ngoài
        """
        pass
