# agents/communication/interaction_agent.py
"""
InteractionAgent - Agent giao tiếp với Gemini AI API.
Đây là agent thực sự kết nối với AI để tạo ra trải nghiệm ALVA.
"""

import os
from typing import Dict, Any, List
from dotenv import load_dotenv
import google.generativeai as genai
from agents.base import CommunicationAgent

# Load environment variables
load_dotenv()


class InteractionAgent(CommunicationAgent):
    """
    Agent chuyên về giao tiếp với Gemini AI API.
    
    Nhiệm vụ:
    - Kết nối với Gemini AI thông qua API key
    - Duy trì conversation context và personality
    - Xử lý natural language understanding và generation
    - Tạo personalized responses theo persona được giao
    """
    
    def __init__(self):
        """Khởi tạo InteractionAgent và kết nối với Gemini AI."""
        print(f"[{self.name}] Initializing connection to Gemini AI...")
        
        # Lấy API key từ environment variable
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "YOUR_API_KEY_HERE":
            print(f"[{self.name}] WARNING: GEMINI_API_KEY not found or not configured properly!")
            print(f"[{self.name}] Please set your Gemini API key in .env file")
            print(f"[{self.name}] Falling back to mock responses...")
            self.model = None
        else:
            try:
                # Cấu hình Gemini AI
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                print(f"[{self.name}] Successfully connected to Gemini Pro!")
            except Exception as e:
                print(f"[{self.name}] Error connecting to Gemini: {str(e)}")
                print(f"[{self.name}] Falling back to mock responses...")
                self.model = None
    
    def communicate(self, persona: str, context: Dict[str, Any], chat_history: List[Dict[str, Any]]) -> str:
        """
        Giao tiếp với Gemini AI, mang "nhân cách" được giao.
        
        Args:
            persona: System prompt chi tiết định nghĩa personality
            context: Ngữ cảnh hiện tại của cuộc trò chuyện
            chat_history: Lịch sử chat theo format Gemini
            
        Returns:
            Phản hồi từ Gemini AI hoặc mock response
        """
        print(f"[{self.name}] Communicating with Gemini AI...")
        print(f"[{self.name}] Context: {context.get('current_lesson', 'No lesson')}")
        print(f"[{self.name}] User input: {context.get('user_input', 'No input')}")
        
        if self.model is None:
            # Mock response khi không có API key
            return self._generate_mock_response(persona, context, chat_history)
        
        try:
            # Xây dựng lại lịch sử chat theo định dạng của Gemini
            gemini_history = self._convert_chat_history(chat_history)
            
            # Bắt đầu một phiên chat mới với lịch sử
            chat_session = self.model.start_chat(history=gemini_history)
            
            # Tạo prompt đầy đủ với persona và context
            full_prompt = self._build_full_prompt(persona, context)
            
            # Gửi tin nhắn và nhận phản hồi
            response = chat_session.send_message(full_prompt)
            
            print(f"[{self.name}] Received response from Gemini AI")
            return response.text
            
        except Exception as e:
            print(f"[{self.name}] Error calling Gemini API: {str(e)}")
            print(f"[{self.name}] Falling back to mock response...")
            return self._generate_mock_response(persona, context, chat_history)
    
    def _convert_chat_history(self, chat_history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Chuyển đổi chat history sang format của Gemini.
        
        Args:
            chat_history: Lịch sử chat trong format internal
            
        Returns:
            Lịch sử chat trong format Gemini
        """
        gemini_history = []
        
        for message in chat_history:
            # Đảm bảo format đúng cho Gemini
            if isinstance(message.get("parts"), list):
                parts = message["parts"]
            else:
                parts = [str(message.get("parts", ""))]
            
            gemini_history.append({
                "role": message.get("role", "user"),
                "parts": parts
            })
        
        return gemini_history
    
    def _build_full_prompt(self, persona: str, context: Dict[str, Any]) -> str:
        """
        Xây dựng prompt đầy đủ với persona và context.
        
        Args:
            persona: System prompt định nghĩa personality
            context: Context hiện tại
            
        Returns:
            Full prompt để gửi đến Gemini
        """
        user_input = context.get('user_input', '')
        current_lesson = context.get('current_lesson', 'Không có bài học cụ thể')
        
        full_prompt = f"""
{persona}

===== NGỮ CẢNH HIỆN TẠI =====
Bài học: {current_lesson}
Ngữ cảnh bổ sung: {str(context)}

===== YÊU CẦU =====
Hãy trả lời câu hỏi sau của học viên một cách thân thiện, chuyên nghiệp và hữu ích:

"{user_input}"

Lưu ý: Hãy luôn giữ vai trò là ALVA - gia sư AI của AI Lab Việt, và tập trung vào bài học hiện tại.
"""
        
        return full_prompt
    
    def _generate_mock_response(self, persona: str, context: Dict[str, Any], chat_history: List[Dict[str, Any]]) -> str:
        """
        Tạo mock response khi không thể kết nối Gemini API.
        
        Args:
            persona: System prompt (không sử dụng trong mock)
            context: Context hiện tại
            chat_history: Lịch sử chat (không sử dụng trong mock)
            
        Returns:
            Mock response
        """
        user_input = context.get('user_input', '').lower()
        current_lesson = context.get('current_lesson', 'bài học hiện tại')
        
        # Simple rule-based responses for demo
        if any(greeting in user_input for greeting in ['chào', 'hello', 'hi', 'xin chào']):
            return f"Chào bạn! Tôi là ALVA, gia sư AI của AI Lab Việt. Hôm nay chúng ta sẽ cùng học về '{current_lesson}'. Bạn có câu hỏi gì về bài học này không?"
        
        elif any(question in user_input for question in ['gì', 'là', 'what', 'how', 'tại sao', 'như thế nào']):
            return f"Đây là một câu hỏi rất hay về '{current_lesson}'! Theo kinh nghiệm của tôi, đây là một khái niệm quan trọng trong lãnh đạo và quản lý. Hãy để tôi giải thích chi tiết hơn..."
        
        elif any(thanks in user_input for thanks in ['cảm ơn', 'thanks', 'thank you']):
            return "Rất vui được giúp bạn! Hãy tiếp tục đặt câu hỏi nếu bạn muốn hiểu sâu hơn về bài học này. Tôi luôn sẵn sàng hỗ trợ bạn!"
        
        else:
            return f"Tôi hiểu bạn đang quan tâm đến '{current_lesson}'. Đây thực sự là một chủ đề thú vị! Bạn có muốn tôi giải thích chi tiết hơn về khái niệm này không? Hoặc bạn có câu hỏi cụ thể nào khác?"
    
    def analyze_intent(self, user_input: str) -> Dict[str, Any]:
        """
        Phân tích intent từ user input (enhanced version).
        
        Args:
            user_input: Input từ người dùng
            
        Returns:
            Dict chứa intent analysis
        """
        print(f"[{self.name}] Analyzing user intent for: {user_input}")
        
        user_input_lower = user_input.lower()
        
        # Enhanced intent detection
        intent_patterns = {
            'greeting': ['chào', 'hello', 'hi', 'xin chào', 'good morning', 'good afternoon'],
            'question': ['gì', 'là', 'what', 'how', 'tại sao', 'như thế nào', 'có thể', 'được không'],
            'learning': ['học', 'hiểu', 'giải thích', 'ví dụ', 'learn', 'understand', 'example'],
            'practice': ['bài tập', 'thực hành', 'practice', 'exercise', 'làm', 'áp dụng'],
            'thanks': ['cảm ơn', 'thanks', 'thank you', 'thanks you'],
            'help': ['giúp', 'help', 'hỗ trợ', 'support', 'assistance']
        }
        
        detected_intent = 'general'
        confidence = 0.5
        
        for intent, patterns in intent_patterns.items():
            if any(pattern in user_input_lower for pattern in patterns):
                detected_intent = intent
                confidence = 0.8
                break
        
        return {
            "intent": detected_intent,
            "confidence": confidence,
            "entities": self._extract_entities(user_input),
            "user_input": user_input,
            "analysis_method": "gemini_enhanced" if self.model else "rule_based"
        }
    
    def _extract_entities(self, user_input: str) -> List[str]:
        """
        Trích xuất entities từ user input.
        
        Args:
            user_input: Input từ người dùng
            
        Returns:
            List các entities được tìm thấy
        """
        # Simple entity extraction for demo
        entities = []
        
        business_terms = ['delegation', 'ủy thác', 'lãnh đạo', 'leadership', 'quản lý', 'management', 'team', 'nhóm']
        
        for term in business_terms:
            if term.lower() in user_input.lower():
                entities.append(term)
        
        return entities