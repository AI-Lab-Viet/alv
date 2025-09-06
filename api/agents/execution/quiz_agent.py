# agents/execution/quiz_agent.py
"""
QuizAgent - Agent thực thi việc tạo và quản lý quiz đánh giá.
Phiên bản nâng cấp với AI integration để tạo quiz động.
"""

import json
import re
from typing import Dict, Any, Optional
from agents.base import ExecutionAgent
from database.db_supabase import DbSupabase
from models.schemas import LearningActivity


class QuizAgent(ExecutionAgent):
    """
    Agent chuyên về tạo và quản lý quiz đánh giá với AI integration.
    
    Nhiệm vụ:
    - Sử dụng AI để tạo câu hỏi quiz theo chủ đề và độ khó
    - Tạo nhiều dạng câu hỏi động (multiple choice, true/false, coding, essay)
    - Tính điểm và phân tích kết quả với AI feedback
    - Tạo adaptive questioning logic
    """
    
    def __init__(self, interaction_agent=None):
        """
        Khởi tạo QuizAgent với dependency injection.
        
        Args:
            interaction_agent: InteractionAgent để giao tiếp với AI
        """
        self.interaction_agent = interaction_agent
        self.db = DbSupabase()
        print(f"[{self.name}] Initialized for AI-powered quiz generation")
        print(f"[{self.name}] InteractionAgent: {'✓ Connected' if interaction_agent else '✗ Not provided'}")
    
    def execute(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Thực thi việc tạo quiz với AI.
        
        Args:
            params: Tham số bao gồm topic, difficulty_level, question_count, quiz_type, etc.
            
        Returns:
            Dict chứa quiz được AI tạo
        """
        print(f"[{self.name}] 📝 Generating AI-powered quiz...")
        print(f"[{self.name}] Parameters: {data}")
        
        topic = 'Chủ đề tổng quát'
        chapter_id = data.get('context').get('chapter_id', 'Chủ đề chung')
        
        if not self.interaction_agent:
            print(f"[{self.name}] No InteractionAgent available, using fallback...")
            return self._create_fallback_quiz(topic, chapter_id)

        try:
            # Tạo quiz với AI
            ai_quiz = self._generate_ai_quiz(topic)
            
            activity = LearningActivity(
                chapter_id=chapter_id,
                activity_type='quiz',
                content=ai_quiz
            )
            
            self.db.create('activities', [activity])
            
            print(f"[{self.name}] ✅ Successfully generated AI quiz for topic: {topic}")
            return ai_quiz
            
        except Exception as e:
            print(f"[{self.name}] ❌ Error generating AI quiz: {str(e)}")
            print(f"[{self.name}] Falling back to structured quiz...")
            return self._create_fallback_quiz(topic, chapter_id)

    def _generate_ai_quiz(self, topic: str) -> Dict[str, Any]:
        """
        Sử dụng AI để tạo quiz.
        
        Args:
            topic: Chủ đề quiz
            difficulty_level: Độ khó (beginner, intermediate, advanced)
            question_count: Số lượng câu hỏi
            question_types: Loại câu hỏi (multiple_choice, true_false, essay, coding)
            time_limit: Thời gian giới hạn (phút)
            
        Returns:
            Quiz được AI tạo
        """
        print(f"[{self.name}] 🤖 Calling AI to generate quiz...")
        
        # Tạo persona cho AI Quiz Generator
        persona_prompt = f"""
Bạn là một chuyên gia thiết kế quiz đánh giá của AI Lab Việt. 
Nhiệm vụ của bạn là tạo ra quiz chất lượng cao, công bằng và có tính phân biệt tốt.

=== THÔNG TIN QUIZ ===
Chủ đề: {topic}
Loại câu hỏi: Open-ended (tình huống yêu cầu học viên áp dụng 'Công thức Phản hồi' 4 bước)

=== YÊU CẦU TẠO QUIZ ===
1. Tạo 1 câu hỏi mở dưới dạng tình huống giả lập.
2. Mỗi câu hỏi đưa ra một đoạn hội thoại hoặc câu trả lời sai/mơ hồ.
3. Yêu cầu học viên áp dụng "Công thức Phản hồi 4 bước" để viết phản hồi chi tiết.
4. Cung cấp evaluation criteria rõ ràng dựa trên 4 bước:
   - Bước 1: Lời mở đầu tích cực
   - Bước 2: Chỉ ra điểm cần chỉnh sửa
   - Bước 3: Giải thích lý do
   - Bước 4: Đưa ra gợi ý chỉnh sửa cụ thể
5. Kết nối tình huống với bối cảnh học tập hoặc doanh nghiệp Việt Nam.

=== ĐỊNH DẠNG PHẢN HỒI ===
Hãy trả lời dưới dạng JSON với cấu trúc sau:
{{
    "title": "Quiz Tình huống Phản hồi",
    "description": "Bài quiz kiểm tra khả năng áp dụng Công thức Phản hồi 4 bước trong các tình huống thực tế.",
    "instructions": ["Đọc tình huống", "Viết phản hồi chi tiết theo 4 bước", "Gửi câu trả lời vào ô chat"],
    "questions": [
        {{
            "type": "open_ended",
            "scenario": "ALVA đã viết: 'Nhà thơ Tố Hữu là một trong những gương mặt tiêu biểu của phong trào Thơ mới.'",
            "task": "Hãy áp dụng Công thức Phản hồi 4 bước để viết phản hồi giúp ALVA chỉnh sửa câu trả lời này.",
            "evaluation_criteria": [
                "Có lời mở đầu tích cực",
                "Chỉ ra điểm chưa chính xác trong câu trả lời",
                "Giải thích rõ lý do vì sao sai",
                "Đưa ra gợi ý sửa chữa đúng"
            ],
            "points": 2,
            "difficulty": "intermediate",
            "learning_objective": "Đánh giá khả năng áp dụng Công thức Phản hồi 4 bước vào tình huống thực tế",
            "hints": [
                "Bước 1: Bắt đầu bằng một lời khen hoặc cảm ơn",
                "Bước 2: Nêu chính xác chỗ sai",
                "Bước 3: Giải thích tại sao sai",
                "Bước 4: Đưa ra cách viết đúng"
            ]
        }}
    ],
    "scoring": {{
        "total_points": 10,
        "passing_score": 7,
        "grading_scale": {{
            "excellent": 9,
            "good": 8,
            "satisfactory": 7,
            "needs_improvement": 6
        }}
    }},
    "learning_objectives": ["Đánh giá khả năng phản hồi", "Đánh giá kỹ năng áp dụng kiến thức"]
}}


=== OUTPUT ===
Chỉ trả lời bằng JSON hợp lệ.
"""
        
        # Gọi AI
        context = {
            "user_input": f"Tạo quiz đánh giá về {topic}",
            "quiz_requirements": {
                "topic": "Chủ đề mở rộng",
                "types": "open_ended",
            }
        }
        
        ai_response = self.interaction_agent.communicate(
            persona=persona_prompt,
            context=context,
            chat_history=[]
        )
        
        # Parse JSON response
        try:
            match = re.search(r"```json\s*(.*?)\s*```", ai_response, re.DOTALL)
            if match:
                ai_response = match.group(1).strip()

            quiz_data = json.loads(ai_response)
            return quiz_data
        except json.JSONDecodeError:
            print(f"[{self.name}] Failed to parse AI response as JSON")
            print(f"[{self.name}] Raw AI response: {ai_response[:200]}...")
            
            # Fallback: tạo structured response từ text
            return {
                "title": f"Quiz đánh giá: {topic}",
                "description": ai_response[:300] + "..." if len(ai_response) > 300 else ai_response,
                "questions": self._extract_questions_from_text(ai_response, 5),
                "ai_generated_content": ai_response,
                "note": "Nội dung được AI tạo nhưng không parse được JSON"
            }
    
    def _extract_questions_from_text(self, ai_response: str, question_count: int) -> list:
        """
        Cố gắng extract câu hỏi từ text response của AI.
        
        Args:
            ai_response: Response text từ AI
            question_count: Số câu hỏi mong muốn
            
        Returns:
            List câu hỏi được extract
        """
        # Simple extraction logic - có thể cải thiện
        questions = []
        lines = ai_response.split('\n')
        
        current_question = None
        for line in lines:
            line = line.strip()
            if line.startswith(('1.', '2.', '3.', '4.', '5.', 'Câu', 'Question')):
                if current_question:
                    questions.append(current_question)
                current_question = {
                    "id": len(questions) + 1,
                    "type": "multiple_choice",
                    "question": line,
                    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
                    "correct_answer": "A",
                    "explanation": "Được AI tạo nhưng không parse được cấu trúc",
                    "points": 1
                }
        
        if current_question:
            questions.append(current_question)
        
        # Đảm bảo có đủ số câu hỏi
        while len(questions) < question_count:
            questions.append({
                "id": len(questions) + 1,
                "type": "multiple_choice",
                "question": f"Câu hỏi {len(questions) + 1} được tạo tự động",
                "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
                "correct_answer": "A",
                "explanation": "Câu hỏi fallback",
                "points": 1
            })
        
        return questions[:question_count]

    def _create_fallback_quiz(self, chapter_id: str) -> Dict[str, Any]:
        """
        Tạo quiz fallback khi không có AI.
        
        Args:
            topic: Chủ đề quiz
            difficulty_level: Độ khó
            question_count: Số câu hỏi
            question_types: Loại câu hỏi
            time_limit: Thời gian giới hạn
            
        Returns:
            Quiz fallback có cấu trúc
        """

        quiz: list[LearningActivity] = self.db.find_by(
            'activities',
            LearningActivity,
            filters={
                "activity_type": "open_ended",
                "chapter_id": chapter_id
            },
            limit=1,
        )
        
        if quiz:
            return json.loads(quiz[0].content)
