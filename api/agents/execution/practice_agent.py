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
    
    async def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
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
        lesson_content = params.get('lesson_content', 'Nội dung bài học')

        if not self.interaction_agent:
            print(f"[{self.name}] No InteractionAgent available, using fallback...")
            return self._create_fallback_exercise(topic, difficulty_level, exercise_type, lesson_content)
        
        try:
            # Tạo exercise với AI
            ai_exercise = await self._generate_ai_exercise(topic, difficulty_level, exercise_type, lesson_content)

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
                    "lesson_content": lesson_content,
                    "generated_at": "2024-01-01T12:00:00Z"  # Placeholder
                }
            }
            
            print(f"[{self.name}] ✅ Successfully generated AI exercise for topic: {topic}")
            return result
            
        except Exception as e:
            print(f"[{self.name}] ❌ Error generating AI exercise: {str(e)}")
            print(f"[{self.name}] Falling back to structured exercise...")
            return self._create_fallback_exercise(topic, difficulty_level, exercise_type, lesson_content)

    async def _generate_ai_exercise(self, topic: str, difficulty_level: str,
                                     exercise_type: str, lesson_content: str) -> Dict[str, Any]:
        """
        Sử dụng AI để tạo bài tập thực hành.
        
        Args:
            topic: Chủ đề bài tập
            difficulty_level: Độ khó (beginner, intermediate, advanced)
            exercise_type: Loại bài tập (coding, design, analysis, etc.)
            lesson_content: Nội dung bài học

        Returns:
            Bài tập được AI tạo
        """
        print(f"[{self.name}] 🤖 Calling AI to generate exercise...")
        
        # Tạo persona cho AI Practice Generator
        persona_prompt = f"""
Bạn là chuyên gia thiết kế bài tập tương tác cho AI Lab Việt. 
Nhiệm vụ của bạn là tạo ra bài tập thực hành chất lượng cao, 
có tính ứng dụng, và theo đúng định dạng JSON để hệ thống có thể hiển thị cho học viên.

=== NGỮ CẢNH BÀI HỌC ===
{lesson_content}

=== THÔNG TIN BÀI TẬP ===
Chủ đề: {topic}
Độ khó: {difficulty_level}
Loại bài tập: {exercise_type}   # Một trong các loại: identify_error, free_text_response, categorize_error
Yêu cầu về nội dung: Phù hợp với ngữ cảnh bài học, không quá dễ hoặc quá khó.

=== YÊU CẦU TẠO BÀI TẬP ===
1. Sinh ra **một** bài tập tương ứng với loại {exercise_type}.
2. Nội dung bài tập phải **dựa trực tiếp vào ngữ cảnh bài học ở trên**, tránh bịa đặt.
3. Đảm bảo JSON output **đúng schema** tương ứng (không thêm bớt field).
4. Không giải thích gì thêm ngoài JSON.

=== ĐỊNH DẠNG JSON THEO LOẠI ===

Nếu exercise_type = "identify_error":
{{
  "type": "identify_error",
  "text": "Một đoạn văn bản (có 1 chỗ sai được đánh dấu bằng <error>...</error>).",
  "correct_answer": "Chuỗi text sai"
}}

Nếu exercise_type = "free_text_response":
{{
  "type": "free_text_response",
  "question": "Một câu hỏi mở liên quan trực tiếp đến bài học",
  "validation_keywords": ["Từ khóa kiểm tra đáp án"]
}}

Nếu exercise_type = "categorize_error":
{{
  "type": "categorize_error",
  "question": "Một câu hỏi yêu cầu phân loại lỗi",
  "options": ["Danh mục 1", "Danh mục 2", "Danh mục 3"],
  "correct_answer": "Danh mục đúng"
}}

=== OUTPUT ===
Chỉ trả lời bằng JSON hợp lệ cho loại {exercise_type}.
"""

        
        # Gọi AI
        context = {
            "user_input": f"Tạo bài tập thực hành về {topic}",
            "exercise_requirements": {
                "topic": topic,
                "difficulty": difficulty_level,
                "type": exercise_type,
                "content": lesson_content
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
                                exercise_type: str, lesson_content: str) -> Dict[str, Any]:
        """
        Tạo bài tập fallback khi không có AI.
        
        Args:
            topic: Chủ đề bài tập
            difficulty_level: Độ khó
            exercise_type: Loại bài tập
            lesson_content: Nội dung bài học

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
            "lesson_content": lesson_content,
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
