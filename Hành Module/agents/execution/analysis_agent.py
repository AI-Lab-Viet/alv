# agents/execution/analysis_agent.py
"""
AnalysisAgent - Agent thực thi việc phân tích và đánh giá hiệu suất.
Phiên bản nâng cấp với AI integration để phân tích chat history và tạo insights.
"""

import json
import re
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
    
    def __init__(self, interaction_agent=None, llm_client=None):
        """
        Khởi tạo AnalysisAgent với dependency injection.
        
        Args:
            interaction_agent: InteractionAgent để giao tiếp với AI
            llm_client: LLM client (Gemini/GPT) để gọi trực tiếp
        """
        self.interaction_agent = interaction_agent
        self.llm_client = llm_client
        print(f"[{self.name}] Initialized for AI-powered analysis")
        print(f"[{self.name}] InteractionAgent: {'✓ Connected' if interaction_agent else '✗ Not provided'}")
        print(f"[{self.name}] LLM Client: {'✓ Connected' if llm_client else '✗ Not provided'}")
    
    def _extract_json_from_markdown(self, text: str) -> str:
        """
        Trích xuất JSON từ markdown code block.
        
        Args:
            text: Text có thể chứa ```json ... ``` hoặc JSON thuần
            
        Returns:
            str: JSON string đã được làm sạch
        """
        # Tìm và trích xuất nội dung trong code block
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text.strip())
        if match:
            return match.group(1).strip()
        
        # Nếu không có code block, trả về nguyên văn
        return text.strip()
    
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
            # Few-shot prompt cho LLM nhận diện kỹ năng cốt lõi
            few_shot_examples = [
                {
                    "user": "Tôi đã chia nhỏ công việc cho các thành viên trong nhóm.",
                    "skill": "#Delegation"
                },
                {
                    "user": "Tôi đã mô tả chi tiết kế hoạch truyền thông.",
                    "skill": "#Description"
                },
                {
                    "user": "Tôi nhận ra điểm mạnh và điểm yếu của từng ý tưởng.",
                    "skill": "#Discernment"
                },
                {
                    "user": "Tôi kiên trì hoàn thành các nhiệm vụ dù gặp khó khăn.",
                    "skill": "#Diligence"
                },
                {
                    "user": "Tôi tổng hợp các ý kiến để đưa ra giải pháp chung.",
                    "skill": "#Synthesis"
                }
            ]
            # System prompt cho LLM
            system_prompt = f"Bạn là một chuyên gia phân tích kỹ năng 4D+S. Dựa trên lịch sử chat và phản tư, hãy nhận diện các kỹ năng cốt lõi mà người dùng đã thể hiện.\nVí dụ:\n" + "\n".join([f'User: {ex["user"]} => Skill: {ex["skill"]}' for ex in few_shot_examples]) + f"\nNhiệm vụ: {mission_detail}\nPhản tư: {user_reflection}"
    
    def _analyze_chat_history(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Phân tích chat history để trích xuất featured prompts và skills.
        Args:
            params: Chứa chat_history, mission_detail và metadata
        Returns:
            Dict chứa featured_prompts, summary, skills
        """
        print(f"[{self.name}] Analyzing chat history with AI...")

        chat_history = params.get("chat_history", [])
        mission_detail = params.get("mission_detail", "")
        llm_model = "gemini-2.5-pro"

        # Xử lý mission_detail - hỗ trợ cả string và object
        if isinstance(mission_detail, dict):
            # Nếu là object, convert thành string có cấu trúc
            mission_parts = []
            mission_parts.append(f"Mission ID: {mission_detail.get('id', 'N/A')}")
            mission_parts.append(f"Title: {mission_detail.get('title', 'N/A')}")
            mission_parts.append(f"Description: {mission_detail.get('description', 'N/A')}")
            mission_parts.append(f"Category: {mission_detail.get('category', 'N/A')}")
            mission_parts.append(f"Difficulty: {mission_detail.get('difficulty', 'N/A')}")
            mission_parts.append(f"Deliverables: {mission_detail.get('deliverables', 'N/A')}")
            domain_skills = ', '.join(mission_detail.get('domain_skills', []))
            alv_skills = ', '.join(mission_detail.get('alv_skills', []))
            if domain_skills:
                mission_parts.append(f"Domain Skills: {domain_skills}")
            if alv_skills:
                mission_parts.append(f"ALV Skills: {alv_skills}")
            mission_parts.append(f"Tips: {', '.join(mission_detail.get('tips', []))}")
            mission_parts.append(f"Estimated Duration: {mission_detail.get('estimated_hours', 'N/A')}")
            if mission_detail.get('learning_objectives'):
                mission_parts.append(f"Objectives: {', '.join(mission_detail.get('learning_objectives', []))}")
            mission_detail_str = "\n".join(mission_parts)
        else:
            # Nếu là string, giữ nguyên
            mission_detail_str = str(mission_detail) if mission_detail else ""

        if not chat_history:
            print(f"[{self.name}] No chat history provided, returning empty analysis")
            return {
                "analysis_type": "chat_analysis",
                "featured_prompts": [],
                "skills": [],
                "summary": "Không có dữ liệu chat history để phân tích",
                "status": "no_data",
                "message": "Không có dữ liệu chat history để phân tích"
            }

        # Lấy riêng toàn bộ tin nhắn của user để LLM chọn featured_prompts
        user_messages = [m for m in chat_history if m.get("role") == "user"]
        user_history_str = self._format_chat_history(user_messages)
        # Còn các phần khác vẫn dùng toàn bộ chat_history
        history_str = self._format_chat_history(chat_history)
        
        print(f"[{self.name}] Found {len(user_messages)} user messages out of {len(chat_history)} total messages")
        
        # Fixed: Extract content from 'parts' instead of 'content'
        user_contents = []
        for m in user_messages:
            parts = m.get('parts', [])
            if isinstance(parts, list):
                content = " ".join(str(part) for part in parts)
            else:
                content = str(parts)
            user_contents.append(content[:50] + "..." if len(content) > 50 else content)
        
        print(f"[{self.name}] User messages: {user_contents}")
        print(f"[{self.name}] User history string length: {len(user_history_str)}")
        
        # Kiểm tra nếu không có user messages
        if not user_messages:
            print(f"[{self.name}] No user messages found! Chat history roles: {[m.get('role') for m in chat_history]}")
            return {
                "analysis_type": "chat_analysis",
                "featured_prompts": [],
                "skills": [],
                "summary": "Không có tin nhắn từ user để phân tích",
                "status": "no_user_messages",
                "message": "Không có tin nhắn từ user để phân tích"
            }

        # Nếu có llm_client thì gọi trực tiếp LLM
        if self.llm_client:
            try:
                # Prompt cho LLM chỉ chứa lịch sử user để chọn featured_prompts
                prompt_featured = self._create_analysis_meta_prompt(user_history_str, mission_detail_str)
                print(f"[{self.name}] Sending featured_prompts request to LLM client...")
                llm_response_featured = self.llm_client.generate_content(prompt_featured)
                print(f"[{self.name}] Received LLM response for featured_prompts")
                
                featured_prompts = []
                try:
                    print(f"[{self.name}] LLM Raw Response for featured_prompts (first 300 chars): {llm_response_featured.text[:300]}...")
                    # Trích xuất JSON từ markdown code block
                    cleaned_response = self._extract_json_from_markdown(llm_response_featured.text)
                    print(f"[{self.name}] Cleaned JSON response length: {len(cleaned_response)}")
                    analysis_result_featured = json.loads(cleaned_response)
                    print(f"[{self.name}] Successfully parsed JSON from LLM response")
                    featured_prompts = analysis_result_featured.get("featured_prompts", [])
                    print(f"[{self.name}] Extracted {len(featured_prompts)} featured_prompts: {featured_prompts}")
                except Exception as e:
                    print(f"[{self.name}] ❌ LLM response for featured_prompts not valid JSON: {str(e)}")
                    print(f"[{self.name}] Raw response sample: {llm_response_featured.text[:200]}...")
                    featured_prompts = []

                # Prompt cho LLM phân tích toàn bộ chat_history để lấy skills, summary
                prompt_full = self._create_analysis_meta_prompt(history_str, mission_detail_str)
                print(f"[{self.name}] Sending skills/summary request to LLM client...")
                llm_response_full = self.llm_client.generate_content(prompt_full)
                print(f"[{self.name}] Received LLM response for skills/summary")
                
                analysis_result_full = {}
                try:
                    print(f"[{self.name}] LLM Raw Response for skills/summary (first 300 chars): {llm_response_full.text[:300]}...")
                    # Trích xuất JSON từ markdown code block
                    cleaned_response = self._extract_json_from_markdown(llm_response_full.text)
                    analysis_result_full = json.loads(cleaned_response)
                    print(f"[{self.name}] Successfully parsed skills/summary JSON")
                    print(f"[{self.name}] Extracted {len(analysis_result_full.get('skills', []))} skills")
                    print(f"[{self.name}] Summary length: {len(analysis_result_full.get('summary', ''))}")
                except Exception as e:
                    print(f"[{self.name}] ❌ LLM response for skills/summary not valid JSON: {str(e)}")
                    print(f"[{self.name}] Raw response sample: {llm_response_full.text[:200]}...")
                    analysis_result_full = {}

                # Gộp kết quả: featured_prompts từ user, còn lại từ full
                analysis_result = {
                    "featured_prompts": featured_prompts,
                    "skills": analysis_result_full.get("skills", []),
                    "summary": analysis_result_full.get("summary", "")
                }
                return self._enhance_analysis_result(analysis_result, chat_history, mission_detail_str)
            except Exception as e:
                print(f"[{self.name}] Error during LLM analysis: {str(e)}")
                return self._fallback_chat_analysis(chat_history, mission_detail_str)

        # Nếu không có llm_client thì dùng interaction_agent như cũ
        if not self.interaction_agent:
            print(f"[{self.name}] No AI agent available, using fallback analysis")
            return self._fallback_chat_analysis(chat_history, mission_detail_str)

        try:
            # Phân tích riêng từng phần với LLM để có kết quả tốt nhất
            
            # 1. Lấy featured_prompts từ user messages
            prompt_featured = self._create_analysis_meta_prompt(user_history_str, mission_detail_str)
            print(f"[{self.name}] Sending featured_prompts request to AI...")
            analysis_result_featured_str = self.interaction_agent.communicate(
                mission_detail=mission_detail_str,
                user_input=prompt_featured,
                chat_history=[]
            )
            try:
                cleaned_response = self._extract_json_from_markdown(analysis_result_featured_str)
                analysis_result_featured = json.loads(cleaned_response)
                featured_prompts = analysis_result_featured.get("featured_prompts", [])
            except:
                featured_prompts = []

            # 2. Phân tích skills và summary từ toàn bộ cuộc hội thoại
            prompt_full = self._create_analysis_meta_prompt(history_str, mission_detail_str)
            print(f"[{self.name}] Sending skills/summary request to AI...")
            analysis_result_full_str = self.interaction_agent.communicate(
                mission_detail=mission_detail_str,
                user_input=prompt_full,
                chat_history=[]
            )

            print(f"[{self.name}] Received AI analysis response")

            # Parse JSON response
            try:
                cleaned_response = self._extract_json_from_markdown(analysis_result_full_str)
                analysis_result_full = json.loads(cleaned_response)
                # Gộp kết quả từ 2 lần phân tích
                analysis_result = {
                    "featured_prompts": featured_prompts,
                    "skills": analysis_result_full.get("skills", []),
                    "summary": analysis_result_full.get("summary", "")
                }
                return self._enhance_analysis_result(analysis_result, chat_history, mission_detail_str)
            except json.JSONDecodeError as e:
                print(f"[{self.name}] Failed to parse JSON from AI: {str(e)}")
                print(f"[{self.name}] Raw response: {analysis_result_full_str[:200]}...")
                return self._fallback_chat_analysis(chat_history, mission_detail_str)

        except Exception as e:
            print(f"[{self.name}] Error during AI analysis: {str(e)}")
            return self._fallback_chat_analysis(chat_history, mission_detail_str)
    
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
    
    def _create_analysis_meta_prompt(self, history_str: str, mission_detail: str = "") -> str:
        """Tạo meta-prompt cho AI analysis, bổ sung mission_detail."""
        return f"""
Bạn là một chuyên gia phân tích giáo dục AI của AI Lab Việt. Nhiệm vụ của bạn là phân tích lịch sử hội thoại để trích xuất insights về quá trình học tập và làm việc của học viên.

CHI TIẾT NHIỆM VỤ:
{mission_detail}

NHIỆM VỤ:
Dựa vào toàn bộ lịch sử hội thoại sau, hãy thực hiện 3 việc:

1. FEATURED PROMPTS: Trích xuất ra 2-3 câu lệnh/câu hỏi tiêu biểu NHẤT mà người dùng đã viết, thể hiện được:
    - Sự tư duy sáng tạo và critical thinking
    - Khả năng đặt câu hỏi chất lượng  
    - Kỹ năng giao tiếp và diễn đạt hiệu quả
    - Tính logic và khả năng phân tích sâu sắc
    - Sự chủ động và tính sáng tạo trong cách tiếp cận vấn đề
    
    CHÚ Ý: Chỉ chọn những câu nói/câu hỏi thực sự nổi bật, thể hiện rõ tư duy của học viên, không chọn những câu ngắn gọn hay đơn giản.

2. SKILL TAGS: Liệt kê 3-5 tag kỹ năng mà người dùng đã thể hiện qua cách họ tương tác:
    - Sử dụng format: #TênKỹNăng
    - Ví dụ: #SángTạo, #LậpKếHoạch, #PhânTích, #GiaiQuyếtVấnĐề, #GiaotiếpHiệuQuả, #TưDuyPhảnBiện, #ĐặtCâuHỏi

3. SUMMARY: Tóm tắt quá trình trao đổi và những điểm nổi bật của học viên trong project này.

YÊU CẦU ĐỊNH DẠNG:
- Trả lời CHÍNH XÁC dưới dạng JSON hợp lệ
- KHÔNG có bất kỳ text giải thích nào khác ngoài JSON
- Định dạng bắt buộc:
{{"featured_prompts": ["prompt1", "prompt2"], "skills": ["#skill1", "#skill2", "#skill3"], "summary": "..."}}

LỊCH SỬ HỘI THOẠI:
---
{history_str}
---

Hãy phân tích và trả về JSON:
"""
    
    def _enhance_analysis_result(self, analysis_result: Dict[str, Any], chat_history: List[Dict[str, Any]], mission_detail: str = "") -> Dict[str, Any]:
        """Enhance analysis result với metadata bổ sung, bổ sung summary."""
        enhanced_result = {
            "analysis_type": "chat_analysis",
            "status": "success",
            "source": "ai_powered",
            "chat_length": len(chat_history),
            "featured_prompts": analysis_result.get("featured_prompts", []),
            "skills": analysis_result.get("skills", []),
            "summary": analysis_result.get("summary", "Không có tóm tắt"),
            "mission_detail": mission_detail,
            "metadata": {
                "total_messages": len(chat_history),
                "user_messages": len([m for m in chat_history if m.get("role") == "user"]),
                "ai_messages": len([m for m in chat_history if m.get("role") == "model"]),
                "analysis_timestamp": "now"
            }
        }
        # Validate featured prompts
        if not enhanced_result["featured_prompts"]:
            enhanced_result["featured_prompts"] = ["Phiên chat không đủ dữ liệu để AI phân tích"]
        # Validate skills
        if not enhanced_result["skills"]:
            enhanced_result["skills"] = ["#GiaoTiếp", "#HọcHỏi"]
        # Validate summary
        if not enhanced_result["summary"]:
            enhanced_result["summary"] = "Không có tóm tắt"
        return enhanced_result
    
    def _fallback_chat_analysis(self, chat_history: List[Dict[str, Any]], mission_detail: str = "") -> Dict[str, Any]:
        """Fallback analysis khi không có AI, bổ sung summary, mission_detail."""
        print(f"[{self.name}] Using fallback rule-based analysis")
        user_messages = [m for m in chat_history if m.get("role") == "user"]
        # Chỉ lấy nội dung tin nhắn của user cho featured_prompts
        featured_prompts = []
        skills = ["#GiaoTiếp", "#HọcHỏi"]
        for message in user_messages[:3]:  # Lấy tối đa 3 tin nhắn đầu của user
            parts = message.get("parts", [])
            # Lấy toàn bộ nội dung parts nếu là list, nối lại thành 1 câu
            if isinstance(parts, list) and parts:
                content = " ".join(str(part) for part in parts)
                if len(content.strip()) > 20:
                    featured_prompts.append(content[:100] + "..." if len(content) > 100 else content)
            elif isinstance(parts, str) and len(parts.strip()) > 20:
                featured_prompts.append(parts[:100] + "..." if len(parts) > 100 else parts)
        all_text = " ".join([" ".join(str(part) for part in m.get("parts", [])) if isinstance(m.get("parts", []), list) else str(m.get("parts", "")) for m in user_messages]).lower()
        if any(word in all_text for word in ["brainstorm", "ý tưởng", "sáng tạo"]):
            skills.append("#SángTạo")
        if any(word in all_text for word in ["kế hoạch", "lập", "plan"]):
            skills.append("#LậpKếHoạch")
        if any(word in all_text for word in ["phân tích", "analyze", "đánh giá"]):
            skills.append("#PhânTích")
        if any(word in all_text for word in ["giải quyết", "solution", "problem"]):
            skills.append("#GiaiQuyếtVấnĐề")
        # Tạo summary đầy đủ hơn dựa trên số lượng tin nhắn và tương tác
        if mission_detail:
            mission_title = mission_detail.split('\n')[1].replace('Title: ', '') if '\n' in mission_detail else "nhiệm vụ"
            summary = f"Học viên đã tham gia tích cực vào cuộc hội thoại về {mission_title}. "
            summary += f"Tổng cộng có {len(user_messages)} tin nhắn từ học viên, "
            summary += f"thể hiện sự tương tác tốt và quan tâm đến dự án. "
            if len(user_messages) >= 3:
                summary += "Học viên đã đặt nhiều câu hỏi và tham gia thảo luận sâu."
            elif len(user_messages) >= 1:
                summary += "Học viên đã có những trao đổi cơ bản về nhiệm vụ."
        else:
            summary = f"Học viên đã tham gia với {len(user_messages)} tin nhắn trong phiên làm việc này."
        
        return {
            "analysis_type": "chat_analysis",
            "status": "success",
            "source": "rule_based",
            "featured_prompts": featured_prompts or ["Người dùng đã tham gia tích cực vào cuộc trò chuyện"],
            "skills": list(set(skills)),
            "summary": summary,
            "mission_detail": mission_detail,
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