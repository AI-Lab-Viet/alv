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
    
    def __init__(self, mission_detail: str = "", system_prompt: str = None):
        """Khởi tạo InteractionAgent, thiết lập system prompt (có ghép mission_detail) và kết nối Gemini AI."""
        base_prompt = f"""
            Bạn là ALVA AI Mentor trong "AI Lab", một môi trường học tập dựa trên dự án (Project-Based Learning).
Nhiệm vụ của bạn là hỗ trợ học sinh thực hiện các nhiệm vụ (missions) được lấy từ Ngân hàng Nhiệm vụ.

Thông tin về nhiệm vụ hiện tại (Mission Detail):
{mission_detail}

Nguyên tắc hoạt động:
1. Luôn giữ vai trò người hướng dẫn, không chỉ đơn thuần giải đáp.
2. Khuyến khích học sinh tư duy, thử nghiệm, sáng tạo, thay vì chỉ đưa ra đáp án cuối cùng.
3. Khi học sinh hỏi về Toán hoặc các môn logic, hãy:
   - Hướng dẫn tư duy từng bước.
   - Gợi ý cách tiếp cận, đưa ra ví dụ minh họa.
   - Chỉ đưa ra đáp án khi học sinh đã thử suy luận hoặc yêu cầu rõ ràng.
4. Ghi nhớ rằng mục tiêu không phải là "cho đáp án", mà là giúp học sinh phát triển kỹ năng giải quyết vấn đề, giao tiếp, và tự học.
5. Khi học sinh làm dự án, hãy bám sát mô tả của nhiệm vụ (bối cảnh, yêu cầu, sản phẩm đầu ra, kỹ năng cần có).
6. Toàn bộ quá trình hội thoại sẽ được ghi lại để xây dựng Portfolio cho học sinh. Vì vậy, hãy giữ phong cách rõ ràng, sư phạm, và giàu tính khuyến khích.
7. Ngôn ngữ sử dụng: tiếng Việt, thân thiện, gần gũi, phù hợp với học sinh.

Vai trò của bạn: 
- Người thầy kiên nhẫn.
- Người đồng hành cùng học sinh trong quá trình khám phá và thực hành.
- Người phản biện nhẹ nhàng để khơi gợi tư duy.

Hướng dẫn khi bắt đầu phiên trò chuyện:
- Chào học sinh.
- Nhắc lại nhiệm vụ/project mà học sinh đang thực hiện dựa trên thông tin Mission Detail.
- Hỏi học sinh muốn bắt đầu từ đâu hoặc đã có ý tưởng gì.
- Định hướng hội thoại dựa trên mục tiêu học tập và sản phẩm đầu ra của Mission.

"""
        # Ghép thêm mission_detail vào system prompt nếu có
        self.system_prompt = (base_prompt).strip()
        print(f"[{self.name}] Initializing connection to Gemini AI...")
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "YOUR_API_KEY_HERE":
            print(f"[{self.name}] WARNING: GEMINI_API_KEY not found or not configured properly!")
            print(f"[{self.name}] Please set your Gemini API key in .env file")
            print(f"[{self.name}] Falling back to mock responses...")
            self.model = None
        else:
            try:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                print(f"[{self.name}] Successfully connected to Gemini Pro!")
            except Exception as e:
                print(f"[{self.name}] Error connecting to Gemini: {str(e)}")
                print(f"[{self.name}] Falling back to mock responses...")
                self.model = None
    
    def communicate(self, mission_detail: str, user_input: str, chat_history: List[Dict[str, Any]]) -> str:
        """
        Giao tiếp với Gemini AI, mang "nhân cách" được giao.
        Args:
            mission_detail: Thông tin nhiệm vụ hiện tại
            user_input: Câu hỏi hoặc yêu cầu của người dùng
            chat_history: Lịch sử chat theo format Gemini
        Returns:
            Phản hồi từ Gemini AI hoặc mock response
        """
        print(f"[{self.name}] Communicating with Gemini AI...")
        print(f"[{self.name}] Mission detail: {mission_detail}")
        print(f"[{self.name}] User input: {user_input}")

        persona = self.system_prompt

        if self.model is None:
            return self._generate_mock_response(persona, mission_detail, user_input, chat_history)

        try:
            gemini_history = self._convert_chat_history(chat_history)
            chat_session = self.model.start_chat(history=gemini_history)
            full_prompt = self._build_full_prompt(persona, mission_detail, user_input, chat_history)
            response = chat_session.send_message(full_prompt)
            print(f"[{self.name}] Received response from Gemini AI")
            return response.text
        except Exception as e:
            print(f"[{self.name}] Error calling Gemini API: {str(e)}")
            print(f"[{self.name}] Falling back to mock response...")
            return self._generate_mock_response(persona, mission_detail, user_input, chat_history)
    
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
    
    def _build_full_prompt(self, persona: str, mission_detail: str, user_input: str, chat_history: List[Dict[str, Any]]) -> str:
        """
        Xây dựng prompt đầy đủ với persona, mission_detail, user_input.
        Chat history đã được pass vào start_chat() rồi nên không cần include lại.
        Args:
            persona: System prompt định nghĩa personality
            mission_detail: Thông tin nhiệm vụ hiện tại
            user_input: Câu hỏi hoặc yêu cầu của người dùng
            chat_history: Lịch sử chat (đã được xử lý qua start_chat)
        Returns:
            Full prompt để gửi đến Gemini
        """
        # Chỉ truyền system prompt + mission detail + user input
        # Chat history đã được Gemini xử lý qua start_chat(history=...)
        full_prompt = f"""
{persona}

===== NHIỆM VỤ HIỆN TẠI =====
{mission_detail}

===== YÊU CẦU NGƯỜI DÙNG =====
"{user_input}"

Lưu ý: Dựa vào lịch sử hội thoại trước đó (nếu có), hãy tiếp tục cuộc trò chuyện một cách tự nhiên. Đừng chào hỏi lại nếu đã chào rồi. Hãy luôn giữ vai trò là ALVA - gia sư AI của AI Lab Việt, tập trung vào nhiệm vụ hiện tại và hỗ trợ người dùng một cách chuyên nghiệp, thân thiện.
"""
        return full_prompt
    
    def _generate_mock_response(self, persona: str, mission_detail: str, user_input: str, chat_history: List[Dict[str, Any]]) -> str:
        """
        Tạo mock response khi không thể kết nối Gemini API.
        Args:
            persona: System prompt (không sử dụng trong mock)
            mission_detail: Thông tin nhiệm vụ hiện tại
            user_input: Input từ người dùng
            chat_history: Lịch sử chat (không sử dụng trong mock)
        Returns:
            Mock response
        """
        user_input_lower = user_input.lower()
        # Simple rule-based responses for demo
        if any(greeting in user_input_lower for greeting in ['chào', 'hello', 'hi', 'xin chào']):
            return f"Chào bạn! Tôi là ALVA, gia sư AI của AI Lab Việt. Nhiệm vụ hiện tại của bạn là: '{mission_detail}'. Bạn có câu hỏi gì về nhiệm vụ này không?"
        elif any(question in user_input_lower for question in ['gì', 'là', 'what', 'how', 'tại sao', 'như thế nào']):
            return f"Đây là một câu hỏi rất hay về nhiệm vụ: '{mission_detail}'! Theo kinh nghiệm của tôi, đây là một chủ đề quan trọng. Hãy để tôi giải thích chi tiết hơn..."
        elif any(thanks in user_input_lower for thanks in ['cảm ơn', 'thanks', 'thank you']):
            return "Rất vui được giúp bạn! Hãy tiếp tục đặt câu hỏi nếu bạn muốn hiểu sâu hơn về nhiệm vụ này. Tôi luôn sẵn sàng hỗ trợ bạn!"
        else:
            return f"Tôi hiểu bạn đang quan tâm đến nhiệm vụ: '{mission_detail}'. Đây thực sự là một chủ đề thú vị! Bạn có muốn tôi giải thích chi tiết hơn về nhiệm vụ này không? Hoặc bạn có câu hỏi cụ thể nào khác?"
    
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