# agents/orchestration/project_agent.py
"""
ProjectAgent - Agent điều phối cho quá trình thực hiện dự án.
Chịu trách nhiệm điều phối MissionAgent, AnalysisAgent, và PortfolioAgent.
"""

from typing import Dict, Any
from agents.base import OrchestrationAgent
from core.rag_engine import DualSourceRAGEngine


class ProjectAgent(OrchestrationAgent):
    """
    Agent điều phối quá trình thực hiện dự án - "Nhạc trưởng" của luồng HÀNH.
    
    Nhiệm vụ:
    - Điều phối toàn bộ lifecycle của dự án từ start -> complete
    - Quản lý các sub-tasks: start_project, continue_session, complete_project
    - Kết nối và điều phối MissionAgent, AnalysisAgent, PortfolioAgent
    - Tạo experience liền mạch cho người dùng trong quá trình thực hiện dự án
    """
    
    def __init__(self, interaction_agent=None, mission_agent=None, analysis_agent=None, portfolio_agent=None):
        """
        Khởi tạo ProjectAgent với dependency injection cho tất cả agents cần thiết.
        
        Args:
            interaction_agent: InteractionAgent để giao tiếp với AI
            mission_agent: MissionAgent để quản lý mission data
            analysis_agent: AnalysisAgent để phân tích quá trình làm việc
            portfolio_agent: PortfolioAgent để tạo portfolio card
        """
        self.interaction_agent = interaction_agent
        self.mission_agent = mission_agent
        self.analysis_agent = analysis_agent
        self.portfolio_agent = portfolio_agent
        self.rag_engine = DualSourceRAGEngine()
        
        print(f"[{self.name}] Initialized as Project Orchestration Conductor")
        print(f"[{self.name}] 🎵 InteractionAgent: {'✓' if interaction_agent else '✗'}")
        print(f"[{self.name}] 🎯 MissionAgent: {'✓' if mission_agent else '✗'}")
        print(f"[{self.name}] 📊 AnalysisAgent: {'✓' if analysis_agent else '✗'}")
        print(f"[{self.name}] 📁 PortfolioAgent: {'✓' if portfolio_agent else '✗'}")
        print(f"[{self.name}] 🧠 RAG Engine: ✓ Dual-source strategy enabled")
    
    def handle_request(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Điều phối request dựa trên sub_task trong session_context.
        
        Args:
            user_input: Input từ người dùng
            session_context: Context chứa sub_task và metadata
            
        Returns:
            Dict chứa kết quả xử lý tương ứng với sub_task
        """
        print(f"[{self.name}] 🎼 Orchestrating project request...")
        print(f"[{self.name}] User input: {user_input}")
        
        sub_task = session_context.get("sub_task", "continue_session")
        print(f"[{self.name}] Sub-task: {sub_task}")
        
        try:
            if sub_task == "start_project":
                return self._start_project_session(user_input, session_context)
            elif sub_task == "complete_project":
                return self._complete_project_session(user_input, session_context)
            else:
                # Mặc định là đang chat trong quá trình làm dự án
                return self._continue_project_session(user_input, session_context)
                
        except Exception as e:
            print(f"[{self.name}] Error in orchestration: {str(e)}")
            return {
                "response_text": f"Xin lỗi, đã có lỗi xảy ra trong quá trình xử lý dự án: {str(e)}",
                "status": "error",
                "error_details": str(e)
            }
    
    def _create_project_alva_persona(self, session_context: Dict[str, Any]) -> str:
        """
        Tạo Project ALVA persona - Cộng sự Sáng tạo theo đặc tả.
        
        Args:
            session_context: Ngữ cảnh dự án hiện tại
            
        Returns:
            System prompt hoàn chỉnh cho Project ALVA
        """
        mission_id = session_context.get("mission_id", "Dự án chung")
        project_phase = session_context.get("project_phase", "Đang thực hiện")
        user_name = session_context.get("user_name", "bạn")
        
        project_alva_persona = f"""
Bạn là ALVA trong vai trò **Cộng sự Sáng tạo** - Project ALVA của AI Lab Việt.

=== NHÂN CÁCH & VAI TRÒ ===
• **Vai trò**: Cộng sự Sáng tạo, không phải gia sư
• **Tính cách**: Năng động, khích lệ, chủ động, linh hoạt, sáng tạo
• **Nhiệm vụ**: Hợp tác với {user_name} để hoàn thành dự án thực tế

=== NGỮ CẢNH DỰ ÁN ===
• Dự án hiện tại: {mission_id}
• Giai đoạn: {project_phase}
• Đối tác: {user_name}

=== PHẠM VI KIẾN THỨC ===
• **Rộng & Thực tế**: Sử dụng kiến thức chung của LLM
• **Kết hợp ngữ cảnh**: Dựa trên lịch sử cuộc trò chuyện của dự án
• **Không giới hạn**: Không bị ràng buộc bởi giáo trình cụ thể

=== PHONG CÁCH TƯƠNG TÁC ===
• "Tuyệt vời! Đó là một ý tưởng rất tiềm năng. Chúng ta có thể phát triển nó theo 3 hướng sau..."
• "Wow, {user_name} thật sáng tạo! Ý tưởng này có thể tạo ra impact lớn nếu..."
• "Hãy cùng brainstorm thêm! Tôi thấy có thể kết hợp với..."

=== 4 QUY TẮC VÀNG ===
1. **Không bao giờ đưa ra câu trả lời cuối cùng**: Luôn cung cấp lựa chọn, dàn ý, bản nháp và kết thúc bằng câu hỏi
2. **Thúc đẩy Tư duy Phản biện**: Đặt câu hỏi "Tại sao bạn nghĩ vậy?", "Góc độ khác thì sao?"
3. **Tông giọc Tích cực & Khích lệ**: Là người bạn đồng hành, không phải máy phán xét
4. **Minh bạch Giới hạn**: Nhắc nhở kiểm chứng thông tin từ nguồn đáng tin cậy

=== CƠ CHẾ TƯƠNG TÁC THÔNG MINH ===
• **Phá băng & Gợi ý**: Chủ động đưa ra ý tưởng để bắt đầu
• **Can thiệp Gợi mở**: Khi phát hiện {user_name} bị "kẹt", đặt câu hỏi mở đường
• **Ghi nhận & Khích lệ**: "Tuyệt vời!", "Ý tưởng rất hay!", công nhận nỗ lực
• **Tóm tắt & Tổng kết**: Nhắc lại thành tựu và kỹ năng đã thể hiện

=== KIẾN THỨC RAG ===
Bạn được cung cấp kiến thức từ hai nguồn:
1. **LỊCH SỬ DỰ ÁN** (Nguồn chính): Toàn bộ ngữ cảnh, ý tưởng, quyết định của dự án
2. **GIÁO TRÌNH HỖ TRỢ** (Khi cần): Kiến thức nền tảng khi người dùng nhắc đến concepts đã học

**Chiến lược sử dụng RAG:**
- Luôn tham khảo lịch sử dự án để đảm bảo tính nhất quán
- Khi người dùng nhắc đến "Delegation", "R.C.T.C", v.v. → Kết hợp với kiến thức giáo trình
- Tạo ra vòng lặp HỌC → HÀNH hoàn hảo

=== MỤC TIÊU THÀNH CÔNG ===
{user_name} tạo ra sản phẩm cuối cùng chất lượng cao và học được kỹ năng trong quá trình đó.

=== NGUYÊN TẮC HOẠT ĐỘNG ===
• Luôn duy trì tinh thần hợp tác, không áp đặt
• Khuyến khích thử nghiệm và sáng tạo
• Cung cấp feedback xây dựng và cụ thể
• Giúp {user_name} tự tin và chủ động trong dự án
• Kết nối kiến thức với ứng dụng thực tế ở Việt Nam

Hãy bắt đầu cuộc trò chuyện với tinh thần của một cộng sự sáng tạo đích thực!
"""
        
        return project_alva_persona
    
    def _prepare_project_context(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Chuẩn bị context cho Project ALVA với RAG trên lịch sử cuộc trò chuyện.
        
        Args:
            user_input: Input từ người dùng
            session_context: Ngữ cảnh phiên làm việc
            
        Returns:
            Context đã được chuẩn bị
        """
        # RAG trên lịch sử cuộc trò chuyện của dự án
        chat_history = session_context.get("chat_history", [])
        project_summary = self._extract_project_summary(chat_history)
        
        context = {
            "user_input": user_input,
            "project_context": {
                "mission_id": session_context.get("mission_id", "unknown"),
                "project_phase": session_context.get("project_phase", "in_progress"),
                "user_name": session_context.get("user_name", "bạn"),
                "project_summary": project_summary,
                "conversation_length": len(chat_history)
            },
            "interaction_mode": "project_collaboration"
        }
        
        return context
    
    def _prepare_project_context_with_rag(self, user_input: str, session_context: Dict[str, Any], rag_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Chuẩn bị context với RAG knowledge cho Project ALVA.
        
        Args:
            user_input: Input từ người dùng
            session_context: Ngữ cảnh phiên dự án
            rag_results: Kết quả RAG search
            
        Returns:
            Context đã được enriched với RAG knowledge
        """
        # Base context
        context = {
            "user_input": user_input,
            "mission_id": session_context.get("mission_id", "general_project"),
            "project_phase": session_context.get("project_phase", "brainstorming"),
            "user_name": session_context.get("user_name", "bạn")
        }
        
        # Add RAG knowledge
        context["rag_knowledge"] = rag_results.get("rag_summary", "")
        context["project_context_sources"] = len(rag_results.get("project_context", []))
        context["curriculum_support_available"] = len(rag_results.get("curriculum_support", [])) > 0
        
        # RAG strategy info
        context["rag_strategy"] = {
            "primary_source": "chat_history",
            "secondary_source": "curriculum",
            "project_mode": True
        }
        
        print(f"[{self.name}] Project RAG Context prepared:")
        print(f"   • Project context sources: {context['project_context_sources']}")
        print(f"   • Curriculum support: {'✓' if context['curriculum_support_available'] else '✗'}")
        
        return context
    
    def _extract_project_summary(self, chat_history: list) -> str:
        """
        Trích xuất tóm tắt dự án từ lịch sử chat (RAG đơn giản).
        
        Args:
            chat_history: Lịch sử cuộc trò chuyện
            
        Returns:
            Tóm tắt dự án
        """
        if not chat_history:
            return "Dự án mới bắt đầu, chưa có lịch sử tương tác."
        
        # Lấy 3 tin nhắn gần nhất để tóm tắt ngữ cảnh
        recent_messages = chat_history[-3:] if len(chat_history) >= 3 else chat_history
        
        summary_parts = []
        for msg in recent_messages:
            role = msg.get("role", "unknown")
            content = msg.get("parts", [""])[0] if isinstance(msg.get("parts"), list) else str(msg.get("parts", ""))
            
            if role == "user":
                summary_parts.append(f"Người dùng: {content[:100]}...")
            elif role == "model":
                summary_parts.append(f"ALVA: {content[:100]}...")
        
        if summary_parts:
            return "Ngữ cảnh gần đây: " + " | ".join(summary_parts)
        else:
            return "Đang trong quá trình thảo luận dự án."
    
    def _start_project_session(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """Bắt đầu một dự án mới."""
        print(f"[{self.name}] 🚀 Starting new project session...")
        
        mission_id = session_context.get("mission_id", "mission_01")
        
        if not self.mission_agent:
            return {"response_text": "Hệ thống mission không khả dụng.", "status": "error"}
        
        mission_details = self.mission_agent.get_mission_details(mission_id)
        
        if "error" in mission_details:
            return {"response_text": f"Không tìm thấy mission '{mission_id}'", "status": "error"}
        
        # Tạo Project ALVA persona cho việc bắt đầu dự án
        if self.interaction_agent:
            # Cập nhật session context với thông tin mission
            updated_context = session_context.copy()
            updated_context["mission_id"] = mission_details.get("title", mission_id)
            updated_context["project_phase"] = "Khởi động"
            
            project_alva_persona = self._create_project_alva_persona(updated_context)
            
            # Context đặc biệt cho việc bắt đầu dự án
            start_context = {
                "user_input": user_input,
                "mission_details": mission_details,
                "project_context": {
                    "phase": "project_kickoff",
                    "mission_id": mission_id,
                    "mission_title": mission_details.get("title", "Dự án"),
                    "mission_description": mission_details.get("description", ""),
                    "learning_objectives": mission_details.get("learning_objectives", [])
                },
                "interaction_mode": "project_kickoff"
            }
            
            print(f"[{self.name}] Calling Project ALVA for project kickoff...")
            response_text = self.interaction_agent.communicate(
                project_alva_persona, 
                start_context, 
                []  # Lịch sử trống cho dự án mới
            )
        else:
            response_text = f"Chào bạn! Chúng ta sẽ thực hiện dự án '{mission_details['title']}'. Hãy bắt đầu!"
        
        return {
            "response_from": "Project ALVA",
            "response_text": response_text,
            "status": "success", 
            "mission_info": mission_details,
            "persona_type": "project_companion",
            "project_phase": "kickoff"
        }
    
    def _continue_project_session(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """Tiếp tục conversation trong dự án với Project ALVA persona."""
        print(f"[{self.name}] 💬 Continuing project conversation with Project ALVA...")
        
        if not self.interaction_agent:
            return {
                "response_text": "Tôi đang nghe bạn! Hãy chia sẻ thêm về dự án bạn đang làm.",
                "status": "fallback"
            }
        
        try:
            # Thực hiện RAG search (Primary: Chat History, Secondary: Curriculum)
            chat_history = session_context.get("chat_history", [])
            rag_results = self.rag_engine.search_for_project(user_input, chat_history)
            
            # Tạo Project ALVA persona theo đặc tả
            project_alva_persona = self._create_project_alva_persona(session_context)
            
            # Chuẩn bị context với RAG knowledge
            context = self._prepare_project_context_with_rag(user_input, session_context, rag_results)
            
            # Gọi InteractionAgent với Project ALVA persona
            print(f"[{self.name}] Calling InteractionAgent with Project ALVA persona...")
            response_text = self.interaction_agent.communicate(project_alva_persona, context, chat_history)
            
            return {
                "response_from": "Project ALVA",
                "response_text": response_text,
                "status": "success",
                "persona_type": "project_companion"
            }
            
        except Exception as e:
            print(f"[{self.name}] Error in project conversation: {str(e)}")
            return {
                "response_text": "Xin lỗi, tôi gặp chút vấn đề. Nhưng tôi vẫn ở đây để hỗ trợ dự án của bạn! Hãy thử lại nhé.",
                "status": "error",
                "error_details": str(e)
            }
    
    def _complete_project_session(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """Hoàn thành dự án và tạo portfolio."""
        print(f"[{self.name}] 🎯 Completing project and creating portfolio...")
        
        chat_history = session_context.get("chat_history", [])
        final_product = session_context.get("final_product", "Sản phẩm chưa được nộp")
        
        # 1. Phân tích với AnalysisAgent
        if self.analysis_agent:
            analysis_result = self.analysis_agent.execute({
                "analysis_type": "chat_analysis",
                "chat_history": chat_history
            })
        else:
            analysis_result = {"featured_prompts": ["Mock analysis"], "skills": ["#HọcHỏi"]}
        
        # 2. Lấy mission info
        mission_info = {}
        if self.mission_agent:
            mission_id = session_context.get("mission_id", "mission_01")
            mission_info = self.mission_agent.get_mission_details(mission_id)
        
        # 3. Tạo portfolio với PortfolioAgent
        if self.portfolio_agent:
            portfolio_data = {
                "analysis": analysis_result,
                "final_product": final_product,
                "user_info": {"user_id": session_context.get("user_id", "user")},
                "mission_info": mission_info
            }
            portfolio_card = self.portfolio_agent.execute(portfolio_data)
        else:
            portfolio_card = {"status": "mock", "analysis": analysis_result}
        
        return {
            "final_portfolio_card": portfolio_card,
            "analysis_summary": analysis_result,
            "status": "completed_successfully"
        }
