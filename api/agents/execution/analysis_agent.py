# agents/execution/analysis_agent.py
"""
AnalysisAgent - Agent thực thi việc phân tích và đánh giá hiệu suất.
Phiên bản nâng cấp với AI integration để phân tích chat history và tạo insights.
"""

import json
from typing import Dict, Any, List
from agents.base import ExecutionAgent


class AnalysisAgent(ExecutionAgent):
    """
    Agent chuyên về phân tích và đánh giá hiệu suất với AI integration.
    
    Nhiệm vụ:
    - Phân tích chat history để trích xuất insights
    - Sử dụng AI để tạo meta-analysis của quá trình làm việc
    - Tạo featured prompts và skill tags từ conversation
    - Đánh giá learning progress và performance
    """
    
    def __init__(self, interaction_agent=None):
        """
        Khởi tạo AnalysisAgent với dependency injection.
        
        Args:
            interaction_agent: InteractionAgent để giao tiếp với AI
        """
        self.interaction_agent = interaction_agent
        print(f"[{self.name}] Initialized for AI-powered analysis")
        print(f"[{self.name}] InteractionAgent: {'✓ Connected' if interaction_agent else '✗ Not provided'}")
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Thực thi việc phân tích với AI support.
        
        Args:
            params: Tham số bao gồm analysis_type, chat_history, etc.
            
        Returns:
            Dict chứa analysis results và insights
        """
        print(f"[{self.name}] Executing AI-powered analysis...")
        print(f"[{self.name}] Parameters: {list(params.keys())}")
        
        analysis_type = params.get('analysis_type', 'chat_analysis')
        
        if analysis_type == 'chat_analysis':
            return self._analyze_chat_history(params)
        elif analysis_type == 'learning_progress':
            return self._analyze_learning_progress(params)
        elif analysis_type == 'project_performance':
            return self._analyze_project_performance(params)
        elif analysis_type == 'skill_assessment':
            return self._analyze_skill_assessment(params)
        else:
            return self._general_analysis(params)
    
    def _analyze_chat_history(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Phân tích chat history để trích xuất featured prompts và skills.
        
        Args:
            params: Chứa chat_history và metadata
            
        Returns:
            Dict chứa featured prompts và skill tags
        """
        print(f"[{self.name}] Analyzing chat history with AI...")
        
        chat_history = params.get("chat_history", [])
        
        if not chat_history:
            print(f"[{self.name}] No chat history provided, returning empty analysis")
            return {
                "analysis_type": "chat_analysis",
                "featured_prompts": [],
                "skills": [],
                "status": "no_data",
                "message": "Không có dữ liệu chat history để phân tích"
            }
        
        if not self.interaction_agent:
            print(f"[{self.name}] No AI agent available, using fallback analysis")
            return self._fallback_chat_analysis(chat_history)
        
        try:
            # Tạo chuỗi history để phân tích
            history_str = self._format_chat_history(chat_history)
            
            # Tạo meta-prompt cho AI analysis
            meta_prompt = self._create_analysis_meta_prompt(history_str)
            
            print(f"[{self.name}] Sending analysis request to AI...")
            
            # Gọi AI để phân tích
            analysis_result_str = self.interaction_agent.communicate(
                persona=meta_prompt,
                context={"user_input": "", "analysis_type": "chat_history"},
                chat_history=[]  # Gửi toàn bộ trong persona
            )
            
            print(f"[{self.name}] Received AI analysis response")
            
            # Parse JSON response
            try:
                analysis_result = json.loads(analysis_result_str)
                
                # Validate và enhance result
                return self._enhance_analysis_result(analysis_result, chat_history)
                
            except json.JSONDecodeError as e:
                print(f"[{self.name}] Failed to parse JSON from AI: {str(e)}")
                print(f"[{self.name}] Raw response: {analysis_result_str[:200]}...")
                return self._fallback_chat_analysis(chat_history)
        
        except Exception as e:
            print(f"[{self.name}] Error during AI analysis: {str(e)}")
            return self._fallback_chat_analysis(chat_history)
    
    def _format_chat_history(self, chat_history: List[Dict[str, Any]]) -> str:
        """Format chat history thành string để phân tích."""
        formatted_lines = []
        
        for i, message in enumerate(chat_history):
            role = message.get("role", "unknown")
            parts = message.get("parts", [])
            
            if isinstance(parts, list):
                content = " ".join(str(part) for part in parts)
            else:
                content = str(parts)
            
            formatted_lines.append(f"{i+1}. {role.upper()}: {content}")
        
        return "\n".join(formatted_lines)
    
    def _create_analysis_meta_prompt(self, history_str: str) -> str:
        """Tạo meta-prompt cho AI analysis."""
        return f"""
Bạn là một chuyên gia phân tích giáo dục AI của AI Lab Việt. Nhiệm vụ của bạn là phân tích lịch sử hội thoại để trích xuất insights về quá trình học tập và làm việc của học viên.

NHIỆM VỤ:
Dựa vào toàn bộ lịch sử hội thoại sau, hãy thực hiện 2 việc:

1. FEATURED PROMPTS: Trích xuất ra 2-3 câu lệnh/câu hỏi tiêu biểu NHẤT mà người dùng đã viết, thể hiện được:
   - Sự tư duy sáng tạo và critical thinking
   - Khả năng đặt câu hỏi chất lượng
   - Kỹ năng giao tiếp và diễn đạt

2. SKILL TAGS: Liệt kê 3-5 tag kỹ năng mà người dùng đã thể hiện qua cách họ tương tác:
   - Sử dụng format: #TênKỹNăng
   - Ví dụ: #SángTạo, #LậpKếHoạch, #PhânTích, #GiaiQuyếtVấnĐề, #GiaotiếpHiệuQuả

YÊU CẦU ĐỊNH DẠNG:
- Trả lời CHÍNH XÁC dưới dạng JSON hợp lệ
- KHÔNG có bất kỳ text giải thích nào khác ngoài JSON
- Định dạng bắt buộc:
{{"featured_prompts": ["prompt1", "prompt2"], "skills": ["#skill1", "#skill2", "#skill3"]}}

LỊCH SỬ HỘI THOẠI:
---
{history_str}
---

Hãy phân tích và trả về JSON:
"""
    
    def _enhance_analysis_result(self, analysis_result: Dict[str, Any], chat_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Enhance analysis result với metadata bổ sung."""
        enhanced_result = {
            "analysis_type": "chat_analysis",
            "status": "success",
            "source": "ai_powered",
            "chat_length": len(chat_history),
            "featured_prompts": analysis_result.get("featured_prompts", []),
            "skills": analysis_result.get("skills", []),
            "metadata": {
                "total_messages": len(chat_history),
                "user_messages": len([m for m in chat_history if m.get("role") == "user"]),
                "ai_messages": len([m for m in chat_history if m.get("role") == "model"]),
                "analysis_timestamp": "now"
            }
        }
        
        # Validate featured prompts
        if not enhanced_result["featured_prompts"]:
            enhanced_result["featured_prompts"] = ["Không tìm thấy prompt nổi bật"]
        
        # Validate skills
        if not enhanced_result["skills"]:
            enhanced_result["skills"] = ["#GiaoTiếp", "#HọcHỏi"]
        
        return enhanced_result
    
    def _fallback_chat_analysis(self, chat_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Fallback analysis khi không có AI."""
        print(f"[{self.name}] Using fallback rule-based analysis")
        
        user_messages = [m for m in chat_history if m.get("role") == "user"]
        
        # Simple rule-based analysis
        featured_prompts = []
        skills = ["#GiaoTiếp", "#HọcHỏi"]
        
        for message in user_messages[:3]:  # Lấy tối đa 3 tin nhắn đầu
            parts = message.get("parts", [])
            if isinstance(parts, list) and parts:
                content = str(parts[0])
                if len(content) > 20:  # Chỉ lấy message dài hơn 20 ký tự
                    featured_prompts.append(content[:100] + "..." if len(content) > 100 else content)
        
        # Phân tích skills đơn giản
        all_text = " ".join([str(m.get("parts", "")) for m in user_messages]).lower()
        
        if any(word in all_text for word in ["brainstorm", "ý tưởng", "sáng tạo"]):
            skills.append("#SángTạo")
        if any(word in all_text for word in ["kế hoạch", "lập", "plan"]):
            skills.append("#LậpKếHoạch")
        if any(word in all_text for word in ["phân tích", "analyze", "đánh giá"]):
            skills.append("#PhânTích")
        if any(word in all_text for word in ["giải quyết", "solution", "problem"]):
            skills.append("#GiaiQuyếtVấnĐề")
        
        return {
            "analysis_type": "chat_analysis",
            "status": "success",
            "source": "rule_based",
            "featured_prompts": featured_prompts or ["Người dùng đã tham gia tích cực vào cuộc trò chuyện"],
            "skills": list(set(skills)),  # Remove duplicates
            "metadata": {
                "total_messages": len(chat_history),
                "user_messages": len(user_messages),
                "analysis_method": "fallback"
            }
        }
    
    def _analyze_learning_progress(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Phân tích tiến độ học tập."""
        return {
            "analysis_id": f"learning_analysis_{params.get('user_id', 'user')}",
            "analysis_type": "learning_progress",
            "student_id": params.get('user_id'),
            "time_period": params.get('time_period', '1_month'),
            "metrics": {
                "completion_rate": 0.85,
                "average_score": 0.78,
                "time_spent_hours": 24,
                "exercises_completed": 15,
                "quizzes_passed": 8
            },
            "strengths": [
                "Consistent practice schedule",
                "Good problem-solving approach",
                "Strong theoretical understanding"
            ],
            "areas_for_improvement": [
                "Code optimization skills",
                "Time management in coding tasks",
                "Advanced algorithm implementation"
            ],
            "recommendations": [
                "Focus on algorithm complexity analysis",
                "Practice more coding challenges",
                "Join peer programming sessions"
            ]
        }
    
    def _analyze_project_performance(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Phân tích hiệu suất dự án."""
        return {
            "analysis_id": f"project_analysis_{params.get('project_id', 'project')}",
            "analysis_type": "project_performance",
            "project_id": params.get('project_id'),
            "metrics": {
                "schedule_adherence": 0.92,
                "budget_utilization": 0.78,
                "quality_score": 0.88,
                "team_productivity": 0.85,
                "milestone_completion": 0.9
            },
            "project_health": "Good",
            "risks": [
                "Potential delay in testing phase",
                "Resource constraint in final sprint"
            ],
            "achievements": [
                "Ahead of schedule in development",
                "High code quality maintained",
                "Strong team collaboration"
            ],
            "recommendations": [
                "Allocate additional testing resources",
                "Consider parallel testing approach",
                "Plan for potential scope adjustments"
            ]
        }
    
    def _analyze_skill_assessment(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Phân tích đánh giá kỹ năng."""
        return {
            "analysis_id": f"skill_analysis_{params.get('user_id', 'user')}",
            "analysis_type": "skill_assessment",
            "skill_categories": {
                "programming_fundamentals": 0.82,
                "problem_solving": 0.75,
                "system_design": 0.68,
                "collaboration": 0.88,
                "communication": 0.79
            },
            "overall_skill_level": "Intermediate",
            "learning_velocity": "Good",
            "recommendations": [
                "Focus on system design patterns",
                "Practice more complex algorithms",
                "Develop leadership skills"
            ]
        }
    
    def _general_analysis(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Phân tích tổng quát."""
        return {
            "analysis_id": f"general_analysis_{params.get('id', 'default')}",
            "analysis_type": "general",
            "summary": "Phân tích tổng quát đã được thực hiện",
            "data_points": params.get('data_points', []),
            "insights": [
                "Insight 1: Xu hướng tích cực được quan sát",
                "Insight 2: Cần cải thiện một số khía cạnh",
                "Insight 3: Tiềm năng phát triển cao"
            ]
        }