# agents/execution/quiz_agent.py
"""
QuizAgent - Agent thực thi việc tạo và quản lý quiz đánh giá.
Phiên bản nâng cấp với AI integration để tạo quiz động.
"""

import json
from typing import Dict, Any
from agents.base import ExecutionAgent


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
        print(f"[{self.name}] Initialized for AI-powered quiz generation")
        print(f"[{self.name}] InteractionAgent: {'✓ Connected' if interaction_agent else '✗ Not provided'}")
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Thực thi việc tạo quiz với AI.
        
        Args:
            params: Tham số bao gồm topic, difficulty_level, question_count, quiz_type, etc.
            
        Returns:
            Dict chứa quiz được AI tạo
        """
        print(f"[{self.name}] 📝 Generating AI-powered quiz...")
        print(f"[{self.name}] Parameters: {params}")
        
        topic = params.get('topic', 'Chủ đề tổng quát')
        difficulty_level = params.get('difficulty_level', 'beginner')
        question_count = params.get('question_count', 10)
        question_types = params.get('question_types', ['multiple_choice', 'true_false'])
        time_limit = params.get('time_limit', 15)
        
        if not self.interaction_agent:
            print(f"[{self.name}] No InteractionAgent available, using fallback...")
            return self._create_fallback_quiz(topic, difficulty_level, question_count, question_types, time_limit)
        
        try:
            # Tạo quiz với AI
            ai_quiz = self._generate_ai_quiz(topic, difficulty_level, question_count, question_types, time_limit)
            
            # Enhance với metadata
            quiz_id = f"quiz_{topic.lower().replace(' ', '_')}_{difficulty_level}_{question_count}q"
            
            result = {
                "quiz_id": quiz_id,
                "generated_by": "AI",
                "ai_quiz": ai_quiz,
                "metadata": {
                    "topic": topic,
                    "difficulty_level": difficulty_level,
                    "question_count": question_count,
                    "question_types": question_types,
                    "time_limit": time_limit,
                    "generated_at": "2024-01-01T12:00:00Z"  # Placeholder
                }
            }
            
            print(f"[{self.name}] ✅ Successfully generated AI quiz for topic: {topic}")
            return result
            
        except Exception as e:
            print(f"[{self.name}] ❌ Error generating AI quiz: {str(e)}")
            print(f"[{self.name}] Falling back to structured quiz...")
            return self._create_fallback_quiz(topic, difficulty_level, question_count, question_types, time_limit)
    
    def _generate_ai_quiz(self, topic: str, difficulty_level: str, question_count: int, 
                         question_types: list, time_limit: int) -> Dict[str, Any]:
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
Bạn là một chuyên gia thiết kế quiz đánh giá của AI Lab Việt. Nhiệm vụ của bạn là tạo ra quiz chất lượng cao, công bằng và có tính phân biệt tốt.

=== THÔNG TIN QUIZ ===
Chủ đề: {topic}
Độ khó: {difficulty_level}
Số câu hỏi: {question_count}
Loại câu hỏi: {', '.join(question_types)}
Thời gian: {time_limit} phút

=== YÊU CẦU TẠO QUIZ ===
1. Tạo {question_count} câu hỏi chất lượng cao về {topic}
2. Câu hỏi phải phù hợp với độ khó {difficulty_level}
3. Sử dụng các loại câu hỏi: {', '.join(question_types)}
4. Mỗi câu hỏi phải có explanation chi tiết
5. Đảm bảo tính công bằng và không bias
6. Kết nối với thực tế doanh nghiệp Việt Nam
7. Tạo distractors (đáp án sai) hợp lý cho multiple choice

=== ĐỊNH DẠNG PHẢN HỒI ===
Hãy trả lời dưới dạng JSON với cấu trúc sau:
{{
    "title": "Tiêu đề quiz",
    "description": "Mô tả mục đích và phạm vi quiz",
    "instructions": ["Hướng dẫn làm bài 1", "Hướng dẫn làm bài 2"],
    "questions": [
        {{
            "id": 1,
            "type": "multiple_choice",
            "question": "Câu hỏi cụ thể",
            "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
            "correct_answer": "A",
            "explanation": "Giải thích tại sao đáp án này đúng và các đáp án khác sai",
            "points": 1,
            "difficulty": "beginner/intermediate/advanced",
            "learning_objective": "Mục tiêu học tập mà câu hỏi này đánh giá"
        }}
    ],
    "scoring": {{
        "total_points": {question_count},
        "passing_score": 0.7,
        "grading_scale": {{
            "excellent": 0.9,
            "good": 0.8,
            "satisfactory": 0.7,
            "needs_improvement": 0.6
        }}
    }},
    "estimated_time": {time_limit},
    "learning_objectives": ["Mục tiêu đánh giá 1", "Mục tiêu đánh giá 2"]
}}

Hãy tạo quiz ngay bây giờ!
"""
        
        # Gọi AI
        context = {
            "user_input": f"Tạo quiz đánh giá về {topic}",
            "quiz_requirements": {
                "topic": topic,
                "difficulty": difficulty_level,
                "count": question_count,
                "types": question_types,
                "time": time_limit
            }
        }
        
        ai_response = self.interaction_agent.communicate(
            persona=persona_prompt,
            context=context,
            chat_history=[]
        )
        
        # Parse JSON response
        try:
            quiz_data = json.loads(ai_response)
            return quiz_data
        except json.JSONDecodeError:
            print(f"[{self.name}] Failed to parse AI response as JSON")
            print(f"[{self.name}] Raw AI response: {ai_response[:200]}...")
            
            # Fallback: tạo structured response từ text
            return {
                "title": f"Quiz đánh giá: {topic}",
                "description": ai_response[:300] + "..." if len(ai_response) > 300 else ai_response,
                "questions": self._extract_questions_from_text(ai_response, question_count),
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
    
    def _create_fallback_quiz(self, topic: str, difficulty_level: str, question_count: int,
                            question_types: list, time_limit: int) -> Dict[str, Any]:
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
        quiz_id = f"quiz_{topic.lower().replace(' ', '_')}_{difficulty_level}_{question_count}q"
        
        # Tạo sample questions
        sample_questions = []
        for i in range(question_count):
            question_type = question_types[i % len(question_types)]
            
            if question_type == "multiple_choice":
                question = {
                    "id": i + 1,
                    "type": "multiple_choice",
                    "question": f"Câu hỏi {i + 1} về {topic} (mức độ {difficulty_level})",
                    "options": [
                        f"Đáp án A cho câu {i + 1}",
                        f"Đáp án B cho câu {i + 1}",
                        f"Đáp án C cho câu {i + 1}",
                        f"Đáp án D cho câu {i + 1}"
                    ],
                    "correct_answer": "A",
                    "explanation": f"Giải thích cho câu {i + 1}",
                    "points": 1
                }
            elif question_type == "true_false":
                question = {
                    "id": i + 1,
                    "type": "true_false",
                    "question": f"Câu hỏi đúng/sai {i + 1} về {topic}",
                    "options": ["Đúng", "Sai"],
                    "correct_answer": "Đúng",
                    "explanation": f"Giải thích cho câu đúng/sai {i + 1}",
                    "points": 1
                }
            else:
                question = {
                    "id": i + 1,
                    "type": question_type,
                    "question": f"Câu hỏi {question_type} {i + 1} về {topic}",
                    "explanation": f"Hướng dẫn trả lời câu {i + 1}",
                    "points": 1
                }
            
            sample_questions.append(question)
        
        return {
            "quiz_id": quiz_id,
            "generated_by": "fallback",
            "title": f"Quiz đánh giá: {topic}",
            "description": f"Quiz đánh giá kiến thức về {topic} ở mức độ {difficulty_level}",
            "difficulty_level": difficulty_level,
            "question_count": question_count,
            "time_limit": time_limit,
            "question_types": question_types,
            "questions": sample_questions,
            "scoring": {
                "total_points": question_count,
                "passing_score": 0.7,
                "grading_scale": {
                    "excellent": 0.9,
                    "good": 0.8,
                    "satisfactory": 0.7,
                    "needs_improvement": 0.6
                }
            },
            "instructions": [
                "Đọc kỹ từng câu hỏi trước khi trả lời",
                "Chọn đáp án chính xác nhất",
                "Quản lý thời gian hợp lý",
                "Kiểm tra lại trước khi nộp bài"
            ],
            "note": "Đây là quiz fallback được tạo tự động"
        }
