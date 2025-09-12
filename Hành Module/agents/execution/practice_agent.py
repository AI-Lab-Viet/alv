# agents/execution/practice_agent.py
"""
PracticeAgent - Agent thực thi việc tạo và quản lý bài tập thực hành.
Phiên bản nâng cấp với AI integration để tạo bài tập động.
"""

import json
from typing import Dict, Any
from agents.base import ExecutionAgent


class PracticeAgent(ExecutionAgent):
    """
    Agent chuyên về tạo và quản lý bài tập thực hành với AI integration.
    
    Nhiệm vụ:
    - Sử dụng AI để tạo bài tập thực hành theo chủ đề và độ khó
    - Tạo hướng dẫn step-by-step động
    - Đánh giá kết quả bài tập với AI feedback
    - Tạo test cases và expected outputs tự động
    """
    
    def __init__(self, interaction_agent=None):
        """
        Khởi tạo PracticeAgent với dependency injection.
        
        Args:
            interaction_agent: InteractionAgent để giao tiếp với AI
        """
        self.interaction_agent = interaction_agent
        print(f"[{self.name}] Initialized for AI-powered practice exercise generation")
        print(f"[{self.name}] InteractionAgent: {'✓ Connected' if interaction_agent else '✗ Not provided'}")
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Thực thi việc tạo bài tập thực hành với AI.
        
        Args:
            params: Tham số bao gồm topic, difficulty_level, exercise_type, etc.
            
        Returns:
            Dict chứa bài tập thực hành được AI tạo
        """
        print(f"[{self.name}] 🎯 Generating AI-powered practice exercise...")
        print(f"[{self.name}] Parameters: {params}")
        
        topic = params.get('topic', 'Chủ đề tổng quát')
        difficulty_level = params.get('difficulty_level', 'beginner')
        exercise_type = params.get('exercise_type', 'coding')
        estimated_time = params.get('estimated_time', 30)
        
        if not self.interaction_agent:
            print(f"[{self.name}] No InteractionAgent available, using fallback...")
            return self._create_fallback_exercise(topic, difficulty_level, exercise_type, estimated_time)
        
        try:
            # Tạo exercise với AI
            ai_exercise = self._generate_ai_exercise(topic, difficulty_level, exercise_type, estimated_time)
            
            # Enhance với metadata
            exercise_id = f"practice_{topic.lower().replace(' ', '_')}_{difficulty_level}_{exercise_type}"
            
            result = {
                "exercise_id": exercise_id,
                "generated_by": "AI",
                "ai_exercise": ai_exercise,
                "metadata": {
                    "topic": topic,
                    "difficulty_level": difficulty_level,
                    "exercise_type": exercise_type,
                    "estimated_time": estimated_time,
                    "generated_at": "2024-01-01T12:00:00Z"  # Placeholder
                }
            }
            
            print(f"[{self.name}] ✅ Successfully generated AI exercise for topic: {topic}")
            return result
            
        except Exception as e:
            print(f"[{self.name}] ❌ Error generating AI exercise: {str(e)}")
            print(f"[{self.name}] Falling back to structured exercise...")
            return self._create_fallback_exercise(topic, difficulty_level, exercise_type, estimated_time)
    
    def _generate_ai_exercise(self, topic: str, difficulty_level: str, 
                            exercise_type: str, estimated_time: int) -> Dict[str, Any]:
        """
        Sử dụng AI để tạo bài tập thực hành.
        
        Args:
            topic: Chủ đề bài tập
            difficulty_level: Độ khó (beginner, intermediate, advanced)
            exercise_type: Loại bài tập (coding, design, analysis, etc.)
            estimated_time: Thời gian ước tính (phút)
            
        Returns:
            Bài tập được AI tạo
        """
        print(f"[{self.name}] 🤖 Calling AI to generate exercise...")
        
        # Tạo persona cho AI Practice Generator
        persona_prompt = f"""
Bạn là một chuyên gia thiết kế bài tập thực hành của AI Lab Việt. Nhiệm vụ của bạn là tạo ra bài tập thực hành chất lượng cao, thực tế và có tính ứng dụng.

=== THÔNG TIN BÀI TẬP ===
Chủ đề: {topic}
Độ khó: {difficulty_level}
Loại bài tập: {exercise_type}
Thời gian ước tính: {estimated_time} phút

=== YÊU CẦU TẠO BÀI TẬP ===
1. Tạo một bài tập thực hành cụ thể, rõ ràng và có thể thực hiện được
2. Bài tập phải phù hợp với độ khó và thời gian đã cho
3. Cung cấp hướng dẫn step-by-step chi tiết
4. Tạo test cases và expected outputs (nếu là coding exercise)
5. Đưa ra evaluation criteria rõ ràng
6. Kết nối với tình huống thực tế trong doanh nghiệp Việt Nam

=== ĐỊNH DẠNG PHẢN HỒI ===
Hãy trả lời dưới dạng JSON với cấu trúc sau:
{{
    "title": "Tiêu đề bài tập",
    "description": "Mô tả chi tiết bài tập và context",
    "learning_objectives": ["Mục tiêu học tập 1", "Mục tiêu học tập 2"],
    "instructions": ["Bước 1", "Bước 2", "Bước 3"],
    "requirements": ["Yêu cầu 1", "Yêu cầu 2"],
    "test_cases": [
        {{"input": "Input mẫu", "expected_output": "Output mong đợi", "explanation": "Giải thích"}}
    ],
    "evaluation_criteria": ["Tiêu chí 1", "Tiêu chí 2"],
    "resources": ["Tài liệu tham khảo", "Link hữu ích"],
    "bonus_challenges": ["Thử thách nâng cao 1", "Thử thách nâng cao 2"]
}}

Hãy tạo bài tập ngay bây giờ!
"""
        
        # Gọi AI
        context = {
            "user_input": f"Tạo bài tập thực hành về {topic}",
            "exercise_requirements": {
                "topic": topic,
                "difficulty": difficulty_level,
                "type": exercise_type,
                "time": estimated_time
            }
        }
        
        ai_response = self.interaction_agent.communicate(
            persona=persona_prompt,
            context=context,
            chat_history=[]
        )
        
        # Parse JSON response
        try:
            exercise_data = json.loads(ai_response)
            return exercise_data
        except json.JSONDecodeError:
            print(f"[{self.name}] Failed to parse AI response as JSON")
            print(f"[{self.name}] Raw AI response: {ai_response[:200]}...")
            
            # Fallback: tạo structured response từ text
            return {
                "title": f"Bài tập thực hành: {topic}",
                "description": ai_response[:500] + "..." if len(ai_response) > 500 else ai_response,
                "learning_objectives": [f"Thực hành {topic}", f"Áp dụng kiến thức vào thực tế"],
                "instructions": ["Đọc mô tả bài tập", "Phân tích yêu cầu", "Thực hiện giải pháp", "Kiểm tra kết quả"],
                "ai_generated_content": ai_response,
                "note": "Nội dung được AI tạo nhưng không parse được JSON"
            }
    
    def _create_fallback_exercise(self, topic: str, difficulty_level: str, 
                                exercise_type: str, estimated_time: int) -> Dict[str, Any]:
        """
        Tạo bài tập fallback khi không có AI.
        
        Args:
            topic: Chủ đề bài tập
            difficulty_level: Độ khó
            exercise_type: Loại bài tập
            estimated_time: Thời gian ước tính
            
        Returns:
            Bài tập fallback có cấu trúc
        """
        exercise_id = f"practice_{topic.lower().replace(' ', '_')}_{difficulty_level}_{exercise_type}"
        
        return {
            "exercise_id": exercise_id,
            "generated_by": "fallback",
            "title": f"Bài tập thực hành: {topic}",
            "description": f"Bài tập thực hành về {topic} ở mức độ {difficulty_level}",
            "difficulty_level": difficulty_level,
            "exercise_type": exercise_type,
            "estimated_time": estimated_time,
            "instructions": [
                "Bước 1: Đọc hiểu yêu cầu bài tập",
                "Bước 2: Phân tích bài toán và xác định approach",
                "Bước 3: Thiết kế giải pháp chi tiết",
                "Bước 4: Implement và test giải pháp"
            ],
            "learning_objectives": [
                f"Hiểu sâu về {topic}",
                "Phát triển kỹ năng giải quyết vấn đề",
                "Thực hành coding/design skills"
            ],
            "evaluation_criteria": [
                "Tính chính xác của giải pháp",
                "Chất lượng code/design",
                "Hiệu suất và optimization",
                "Tính đọc hiểu và maintainability"
            ],
            "resources": [
                "Tài liệu tham khảo chính thức",
                "Best practices và coding standards",
                "Ví dụ và case studies"
            ],
            "note": "Đây là bài tập fallback được tạo tự động"
        }
