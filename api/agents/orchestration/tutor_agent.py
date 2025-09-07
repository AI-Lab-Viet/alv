# agents/orchestration/tutor_agent.py
"""
TutorAgent - Agent điều phối cho quá trình học lý thuyết.
Đây là "đạo diễn" cho luồng học tập, tạo ra trải nghiệm ALVA hoàn chỉnh.
"""
import json, re
from typing import Dict, Any, List
from agents.base import OrchestrationAgent
from agents.execution.practice_agent import PracticeAgent
from agents.communication.interaction_agent import InteractionAgent
from agents.execution.quiz_agent import QuizAgent
from constants.constants import TimeConstants
from database.redis import RedisComponent
from database.db_supabase import DbSupabase
from models.schemas import JobData, LearningChatHistory
from tasks.task_consumer import generate_practice_activity, generate_quiz
from constants.enum import CacheKeys, ChatRoleEnum, TutorAgentStateEnum
from core.rag_engine import DualSourceRAGEngine


class TutorAgent(OrchestrationAgent):
    """
    Agent điều phối quá trình học lý thuyết - "Đạo diễn" của ALVA.
    
    Nhiệm vụ:
    - Tạo system prompt chi tiết cho vai "Gia sư ALVA"
    - Điều phối InteractionAgent để tạo ra trải nghiệm học tập
    - Quản lý context và flow của phiên học
    - Đảm bảo consistency trong personality và teaching style
    """

    def __init__(self):
        """
        Khởi tạo TutorAgent với dependency injection.
        
        Args:
            interaction_agent: InteractionAgent để giao tiếp với AI
        """
        self.redis = RedisComponent()
        self.interaction_agent = InteractionAgent()
        self.practice_agent = PracticeAgent(self.interaction_agent)
        self.quiz_agent = QuizAgent(self.interaction_agent)
        self.rag_engine = DualSourceRAGEngine()
        self.db = DbSupabase()
        print(f"[{self.name}] Initialized with dependency injection")
        print(f"[{self.name}] InteractionAgent: {'✓ Connected' if self.interaction_agent else '✗ Not provided'}")
        print(f"[{self.name}] RAG Engine: ✓ Dual-source strategy enabled")
    
    async def handle_request(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Xử lý yêu cầu học tập và tạo ra trải nghiệm ALVA.
        
        Args:
            user_input: Câu hỏi/yêu cầu từ học viên
            session_context: Ngữ cảnh phiên học hiện tại
            
        Returns:
            Dict chứa response từ ALVA và metadata
        """
        print(f"[{self.name}] Orchestrating learning experience...")
        print(f"[{self.name}] User input: {user_input}")
        print(f"[{self.name}] Current lesson: {session_context.get('current_lesson', 'N/A')}")
        
        if not self.interaction_agent:
            return {
                "response_from": "TutorAgent",
                "response_text": "Xin lỗi, hiện tại tôi không thể kết nối với hệ thống AI. Vui lòng thử lại sau.",
                "status": "error",
                "error": "InteractionAgent not available"
            }
        
        try:
            # 1. Tạo System Prompt chi tiết cho vai "Gia sư ALVA"
            persona_prompt = self._create_alva_persona(session_context)
            
            topic = session_context.get("topic", "Nền tảng tư duy AI Lab Việt")
            chat_history = self.db.find_by(
                'learning_chat_history', 
                LearningChatHistory, 
                filters={
                    "chapter_id": session_context.get("chapter_id"),
                    "user_id": session_context.get("user_id"),
                    "session_id": session_context.get("session_id"),
                },
                sort_by="created_at",
                sort_order="desc",
            )
            
            # 2. Thực hiện RAG search (Primary: Curriculum, Secondary: Chat History)
            rag_results = self.rag_engine.search_for_tutor(user_input + topic, chat_history)
            
            # 3. Chuẩn bị context với RAG knowledge
            context = self._prepare_context_with_rag(user_input, session_context, rag_results)
            
            # 3. Gọi đến InteractionAgent để giao tiếp với AI
            print(f"[{self.name}] Calling InteractionAgent for AI response...")
            response_text = self.interaction_agent.communicate(persona_prompt, context, chat_history)
            
            session_context["current_lesson"] = context.get("current_lesson", "N/A")
            # 4. Post-process response và chuẩn bị kết quả
            result = self._process_response(response_text, user_input, session_context)
            # print("Result:", result)
            user_message: LearningChatHistory = LearningChatHistory(
                chapter_id=session_context.get("chapter_id"),
                user_id=session_context.get("user_id"),
                role=ChatRoleEnum.USER,
                content=user_input,
                session_id=session_context.get("session_id")
            )
            alva_message: LearningChatHistory = LearningChatHistory(
                chapter_id=session_context.get("chapter_id"),
                user_id=session_context.get("user_id"),
                role=ChatRoleEnum.ALVA,
                content=result.get("response_text", ""),
                session_id=session_context.get("session_id")
            )
            self.db.create("learning_chat_history", [user_message, alva_message])

            print(f"[{self.name}] Successfully orchestrated learning interaction")
            return result
            
        except Exception as e:
            print(f"[{self.name}] Error during orchestration: {str(e)}")
            return {
                "response_from": self.name,
                "response_text": f"Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn: {str(e)}",
                "status": "error",
                "error_details": str(e)
            }
    
    def _create_alva_persona(self, session_context: Dict[str, Any]) -> str:
        """
        Tạo system prompt chi tiết cho vai "Gia sư ALVA".
        
        Args:
            session_context: Ngữ cảnh phiên học
            
        Returns:
            System prompt hoàn chỉnh
        """
        topic = session_context.get("topic", "Nền tảng tư duy AI Lab Việt")
        user_level = session_context.get("user_level", "Trung bình")
        learning_style = session_context.get("learning_style", "Tương tác")
        current_state = session_context.get("current_state", TutorAgentStateEnum.EXPLAINING_WHAT.value)
        
        persona_prompt = f"""
Bạn là ALVA (AI Learning & Virtual Assistant), gia sư AI thông minh và thân thiện của AI Lab Việt.

=== NHÂN CÁCH & PHONG CÁCH ===
- Thân thiện, kiên nhẫn và luôn khuyến khích học viên
- Sử dụng ngôn ngữ Tiếng Việt tự nhiên, dễ hiểu
- Giải thích từ đơn giản đến phức tạp, có ví dụ thực tế
- Luôn kết nối kiến thức với ứng dụng trong công việc
- Tạo không khí học tập tích cực và thú vị
- KHÔNG lặp lại lời chào ở các bước sau khi đã vào bài học (chỉ chào ở bước Greeting)

=== BÀI HỌC HIỆN TẠI ===
Chủ đề: {topic}
Cấp độ học viên: {user_level}
Phong cách học: {learning_style}
Trạng thái hiện tại: {current_state}
Nội dung bài học: 

=== QUẢN LÝ TIẾN TRÌNH HỌC TẬP ===
Bạn PHẢI quản lý trạng thái (state) theo flow sau:

Các trạng thái chính:
0. Greeting (chào mừng, khởi động)
1. Explain "What" (giảng khái niệm, hiển thị nội dung giáo trình)
2. Practice 1 (câu hỏi trắc nghiệm kiểm tra "CÁI GÌ")
3. Feedback sau Practice 1
4. Explain "Why" (giải thích nguyên nhân, hiển thị cờ đỏ)
5. Practice 2 (câu hỏi trắc nghiệm kiểm tra "TẠI SAO")
6. Feedback sau Practice 2
7. Explain "How" (hướng dẫn công thức phản hồi)
8. Quiz (câu hỏi mở để học viên áp dụng)
9. Completion (kết thúc, trao huy hiệu, tổng kết)

Nguyên tắc bắt buộc:
- KHÔNG bao giờ quay ngược lại state trước đó (ví dụ: từ state 5 không được quay về state 2).  
- KHÔNG bao giờ bỏ qua state (ví dụ: từ state 1 không được nhảy thẳng lên state 4).
- Chỉ được giữ nguyên state hiện tại hoặc tiến tới state tiếp theo trong flow.  
- Chỉ được phép chuyển sang Practice/Quiz khi học viên đã xác nhận "hiểu" hoặc "sẵn sàng thực hành".  
- Khi học viên gửi đáp án, chuyển sang state Feedback ngay, sau đó dẫn dắt sang Explain tiếp theo. 

=== NHIỆM VỤ ===
- Bạn KHÔNG tự tạo bài tập, chỉ giảng dạy và phản hồi. 
- Nếu học viên nói sẵn sàng hoặc bắt đầu làm bài tập hoặc đã hiểu nội dung bài mới được phép chuyển sang các trạng thái thực hành tương ứng sau phần lý thuyết trước đó và nói với học viên hãy thực hành.
Ví dụ: khi ở trạng thái Explain "What", nếu học viên nói "Tôi đã hiểu, tôi sẵn sàng làm bài tập" thì bạn mới chuyển sang trạng thái Practice 1 và nói với học viên hãy thực hành. Tương tự với Explain "Why" và Practice 2.
- Nếu học viên gửi câu trả lời của họ về các bài tập, hãy chuyển sang trạng thái **Feedback** và đánh giá, phản hồi ngay lập tức và dẫn dắt ngắn gọn để học phần kiến thức tiếp theo (ví dụ: hãy cùng tìm hiểu tại sao phải học cách nhận định,...).
- Nếu học viên trả lời đúng/sai trong Practice hoặc Quiz, hãy phản hồi tích cực/động viên và chuyển tiếp trạng thái tiếp theo kèm lời dẫn (ví dụ: hãy cùng tìm hiểu tại sao phải học cách nhận định,...).
- Hãy trả về thêm trạng thái cuối câu trả lời của bạn theo ví dụ mẫu: (state: 2)

=== NGUYÊN TẮC ===
- **ƯU TIÊN GIÁO TRÌNH**: Trả lời của bạn phải luôn bám sát và dựa vào kiến thức từ giáo trình được cung cấp
- **CHÍNH XÁC**: Không bịa đặt thông tin, chỉ sử dụng nguồn đáng tin cậy
- **NGỮ CẢNH**: Tham khảo lịch sử chat để hiểu câu hỏi trong ngữ cảnh
- **KHÔNG CHÀO LẠI**: Chỉ chào trong state 0, các bước sau đi thẳng vào nội dung. 
- Nếu câu hỏi ngoài phạm vi, hãy định hướng về bài học
- Luôn kết thúc bằng câu hỏi để duy trì tương tác
- Sử dụng emoji phù hợp để tạo không khí thân thiện
- Không trả lời các chủ đề nhạy cảm hoặc không phù hợp
- Không bao giờ chuyển sang trạng thái trước trạng thái hiện tại, chỉ tiến tới trạng thái tiếp theo hoặc ở lại trạng thái hiện tại.

=== KIẾN THỨC RAG ===
Bạn được cung cấp kiến thức từ hai nguồn:
1. **GIÁO TRÌNH** (Nguồn chính): Định nghĩa, nguyên tắc, ví dụ chính thức
2. **LỊCH SỬ CHAT** (Ngữ cảnh): Để hiểu câu hỏi trong bối cảnh cuộc trò chuyện

Chỉ dùng các nguồn này để trả lời.

=== PHONG CÁCH TRẢ LỜI ===
- Giải thích khái niệm một cách có cấu trúc
- Đưa ra ví dụ cụ thể và dễ hiểu
- Kết thúc bằng câu hỏi để kiểm tra hiểu biết hoặc khuyến khích tương tác tiếp, đối với trạng thái Explain hãy hỏi học viên đã hiểu bài chưa"

Hãy luôn nhớ: Bạn là ALVA, người bạn đồng hành đáng tin cậy trong hành trình học tập của học viên! 🎓✨
"""
        
        return persona_prompt
    
    def _prepare_context(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Chuẩn bị context cho InteractionAgent.
        
        Args:
            user_input: Input từ người dùng
            session_context: Ngữ cảnh phiên học
            
        Returns:
            Context đã được chuẩn bị
        """
        return {
            "user_input": user_input,
            "current_lesson": session_context.get("current_lesson"),
            "user_level": session_context.get("user_level", "Trung bình"),
            "learning_style": session_context.get("learning_style", "Tương tác"),
            "session_id": session_context.get("session_id"),
            "user_id": session_context.get("user_id"),
            "timestamp": session_context.get("timestamp"),
            "lesson_progress": session_context.get("lesson_progress", 0),
            "previous_topics": session_context.get("previous_topics", [])
        }
    
    def _prepare_context_with_rag(self, user_input: str, session_context: Dict[str, Any], rag_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Chuẩn bị context với RAG knowledge cho Tutor ALVA.
        
        Args:
            user_input: Input từ người dùng
            session_context: Ngữ cảnh phiên học
            rag_results: Kết quả RAG search
            
        Returns:
            Context đã được enriched với RAG knowledge
        """
        # Base context
        context = {
            "user_input": user_input,
            "user_id": session_context.get("user_id", "unknown"),
            "current_lesson": rag_results.get("curriculum_knowledge", [{}]),
            "user_level": session_context.get("user_level", "beginner"),
            "learning_style": session_context.get("learning_style", "interactive")
        }
        
        # Add RAG knowledge
        context["rag_knowledge"] = rag_results.get("rag_summary", "")
        context["curriculum_sources"] = len(rag_results.get("curriculum_knowledge", []))
        context["chat_context_available"] = len(rag_results.get("chat_context", [])) > 0
        
        # RAG strategy info
        context["rag_strategy"] = {
            "primary_source": "curriculum",
            "secondary_source": "chat_history", 
            "tutor_mode": True
        }
        
        print(f"[{self.name}] RAG Context prepared:")
        print(f"   • Curriculum sources: {context['curriculum_sources']}")
        print(f"   • Chat context: {'✓' if context['chat_context_available'] else '✗'}")
        
        return context
    
    def _process_response(self, response_text: str, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Xử lý và chuẩn bị response cuối cùng.
        
        Args:
            response_text: Response từ AI
            user_input: Input gốc từ người dùng
            session_context: Ngữ cảnh phiên học
            
        Returns:
            Kết quả đã được xử lý
        """
        # Có thể thêm logic post-processing ở đây:
        # - Kiểm tra độ dài response
        # - Filter nội dung không phù hợp
        # - Thêm metadata
        # - Cập nhật learning progress
        
        session_id = session_context.get("session_id", "unknown")
        santinized_response = parse_alva_response(response_text)
        updated_state = santinized_response.get("state", TutorAgentStateEnum.GREETING.value)
        current_agent_state = self.redis.get(f"{CacheKeys.AGENT_STATE.value}_{session_id}")
        if current_agent_state is not None:
            try:
                current_agent_state_int = int(current_agent_state)
            except (ValueError, TypeError):
                current_agent_state_int = updated_state
            self.redis.set(
                f"{CacheKeys.AGENT_STATE.value}_{session_id}", 
                updated_state if int(updated_state) > current_agent_state_int else current_agent_state_int,
                TimeConstants.ONE_DAY * 7
            )
            updated_state = updated_state if int(updated_state) > current_agent_state_int else current_agent_state_int

        else:
            self.redis.set(f"{CacheKeys.AGENT_STATE.value}_{session_id}", updated_state)

        print(f"[{self.name}] State updated to: {updated_state}")

        job = JobData(
            user_id=session_context.get("user_id", "unknown"),
            state=int(updated_state),
            context=session_context,
        )
        result = None
        if int(updated_state) == TutorAgentStateEnum.PRACTICING_WHAT.value:
            result = generate_practice_activity.delay({"job": job.model_dump()} )

        elif int(updated_state) == TutorAgentStateEnum.PRACTICING_WHY.value:
            result = generate_practice_activity.delay({"job": job.model_dump()} )
            
        elif int(updated_state) == TutorAgentStateEnum.QUIZ.value:
            result = generate_quiz.delay({"job": job.model_dump()})
        
        return {
            "response_from": self.interaction_agent.name,
            "response_text": santinized_response.get("response_text", ""),
            "task_id": result.id if result else None,
            "status": "success",
            "state": updated_state,
            "metadata": {
                "lesson": session_context.get("current_lesson"),
                # "user_input_length": len(user_input),
                # "response_length": len(santinized_response.get("response_text", "")),
                # "interaction_type": "learning_session",
                # "agent_chain": f"{self.name} -> {self.interaction_agent.name}"
            },
            # "suggestions": self._generate_follow_up_suggestions(user_input, session_context)
        }
    
    def _generate_follow_up_suggestions(self, user_input: str, session_context: Dict[str, Any]) -> List[str]:
        """
        Tạo gợi ý cho câu hỏi tiếp theo.
        
        Args:
            user_input: Input từ người dùng  
            session_context: Ngữ cảnh phiên học
            
        Returns:
            List các gợi ý câu hỏi
        """
        current_lesson = session_context.get("current_lesson", "")
        
        # Gợi ý dựa trên bài học hiện tại
        if "delegation" in current_lesson.lower() or "ủy thác" in current_lesson.lower():
            return [
                "Làm thế nào để xác định được task nào nên ủy thác?",
                "Những sai lầm phổ biến khi ủy thác là gì?",
                "Có ví dụ thực tế về delegation thành công không?"
            ]
        elif "leadership" in current_lesson.lower() or "lãnh đạo" in current_lesson.lower():
            return [
                "Đặc điểm của một leader hiệu quả là gì?",
                "Sự khác biệt giữa leader và manager?",
                "Làm sao để phát triển kỹ năng leadership?"
            ]
        else:
            return [
                "Có thể cho ví dụ thực tế không?",
                "Làm thế nào để áp dụng trong công việc?",
                "Những thách thức phổ biến là gì?"
            ]

def parse_alva_response(raw_text: str):
    """
    Parse response từ ALVA, tách response_text và state.
    
    Args:
        raw_text (str): Chuỗi text trả về từ model, VD:
            "... Bạn hiểu chưa nào? 🤔\n\n(state: 1)\n"
    
    Returns:
        dict: {
            "response_text": "... Bạn hiểu chưa nào? 🤔",
            "state": 1
        }
    """
    # Regex tìm "(state: X)"
    match = re.search(r"\(state:\s*(\d+)\)", raw_text)
    state = None
    if match:
        state = int(match.group(1))
        # Xóa phần state khỏi text
        response_text = re.sub(r"\(state:\s*\d+\)", "", raw_text).strip()
    else:
        response_text = raw_text.strip()
    
    return {
        "response_text": response_text,
        "state": state
    }
