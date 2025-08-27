# agents/execution/portfolio_agent.py
"""
PortfolioAgent - Agent thực thi việc quản lý portfolio và deliverables.
Phiên bản nâng cấp với logic tạo portfolio card từ analysis data.
"""

from typing import Dict, Any, List
from datetime import datetime
from agents.base import ExecutionAgent


class PortfolioAgent(ExecutionAgent):
    """
    Agent chuyên về quản lý portfolio và deliverables.
    
    Nhiệm vụ:
    - Tạo portfolio card từ analysis data
    - Tổ chức và catalog các project deliverables
    - Quản lý version control cho artifacts
    - Tạo documentation và showcase materials
    - Lưu trữ thông tin vào "database" (hiện tại là mock)
    """
    
    def __init__(self):
        """Khởi tạo PortfolioAgent với mock database."""
        # Mock portfolio database - Trong thực tế sẽ kết nối với database thực
        self.portfolio_storage = []
        self.card_templates = {
            "project_completion": {
                "type": "Project Completion Card",
                "sections": ["overview", "featured_prompts", "skills_demonstrated", "final_product", "learning_outcomes"]
            },
            "learning_journey": {
                "type": "Learning Journey Card", 
                "sections": ["topics_covered", "progress_metrics", "achievements", "next_steps"]
            },
            "skill_showcase": {
                "type": "Skill Showcase Card",
                "sections": ["skill_category", "demonstrations", "evidence", "peer_feedback"]
            }
        }
        
        print(f"[{self.name}] Initialized portfolio management system")
        print(f"[{self.name}] Available templates: {list(self.card_templates.keys())}")
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Thực thi việc tạo portfolio card từ analysis data.
        
        Args:
            params: Chứa analysis data, final_product, user_info, etc.
            
        Returns:
            Dict chứa portfolio card đã được tạo
        """
        print(f"[{self.name}] Creating portfolio card...")
        print(f"[{self.name}] Input data keys: {list(params.keys())}")
        
        try:
            # Lấy dữ liệu đầu vào
            analysis_data = params.get("analysis", {})
            final_product = params.get("final_product", "Không có sản phẩm được nộp")
            user_info = params.get("user_info", {})
            mission_info = params.get("mission_info", {})
            
            # Tạo portfolio card
            portfolio_card = self._create_project_completion_card(
                analysis_data, final_product, user_info, mission_info
            )
            
            # "Lưu" vào database (mock)
            self._save_to_database(portfolio_card)
            
            print(f"[{self.name}] Successfully created portfolio card: {portfolio_card['card_id']}")
            
            return {
                "status": "created",
                "card_data": portfolio_card,
                "storage_location": "mock_database",
                "card_id": portfolio_card["card_id"]
            }
            
        except Exception as e:
            print(f"[{self.name}] Error creating portfolio card: {str(e)}")
            return {
                "status": "error",
                "error_message": str(e),
                "fallback_data": params
            }
    
    def _create_project_completion_card(self, analysis_data: Dict[str, Any], 
                                      final_product: str, user_info: Dict[str, Any],
                                      mission_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Tạo project completion card từ analysis data.
        
        Args:
            analysis_data: Dữ liệu phân tích từ AnalysisAgent
            final_product: Sản phẩm cuối cùng của người dùng
            user_info: Thông tin người dùng
            mission_info: Thông tin mission
            
        Returns:
            Portfolio card hoàn chỉnh
        """
        card_id = f"card_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Trích xuất featured prompts và skills từ analysis
        featured_prompts = analysis_data.get("featured_prompts", ["Không có prompt nổi bật"])
        skills = analysis_data.get("skills", ["#HọcHỏi"])
        
        # Tạo learning outcomes dựa trên mission
        learning_outcomes = mission_info.get("learning_objectives", [
            "Hoàn thành project theo yêu cầu",
            "Phát triển kỹ năng làm việc độc lập",
            "Thực hành tư duy giải quyết vấn đề"
        ])
        
        portfolio_card = {
            "card_id": card_id,
            "card_type": "project_completion",
            "created_at": datetime.now().isoformat(),
            "user_info": {
                "user_id": user_info.get("user_id", "unknown"),
                "user_name": user_info.get("user_name", "Học viên AI Lab Việt")
            },
            "project_overview": {
                "mission_id": mission_info.get("id", "unknown"),
                "title": mission_info.get("title", "Dự án chưa xác định"),
                "category": mission_info.get("category", "General"),
                "difficulty": mission_info.get("difficulty", "Unknown"),
                "completion_status": "completed"
            },
            "featured_prompts": {
                "description": "Những câu hỏi/yêu cầu tiêu biểu thể hiện tư duy của học viên",
                "prompts": featured_prompts[:3],  # Lấy tối đa 3 prompts
                "total_analyzed": len(featured_prompts)
            },
            "skills_demonstrated": {
                "description": "Kỹ năng được thể hiện qua quá trình làm việc",
                "primary_skills": skills[:5],  # Lấy tối đa 5 skills chính
                "skill_evidence": self._generate_skill_evidence(skills, featured_prompts),
                "total_skills": len(skills)
            },
            "final_product": {
                "description": "Sản phẩm cuối cùng được nộp",
                "content": final_product,
                "word_count": len(final_product.split()) if isinstance(final_product, str) else 0,
                "submission_time": datetime.now().isoformat()
            },
            "learning_outcomes": {
                "achieved_objectives": learning_outcomes,
                "personal_reflection": self._generate_reflection(analysis_data, mission_info),
                "next_steps": self._suggest_next_steps(skills, mission_info)
            },
            "metadata": {
                "analysis_source": analysis_data.get("source", "unknown"),
                "analysis_quality": analysis_data.get("status", "unknown"),
                "chat_length": analysis_data.get("chat_length", 0),
                "template_version": "1.0"
            },
            "showcase_ready": True,
            "visibility": "public"
        }
        
        return portfolio_card
    
    def _generate_skill_evidence(self, skills: List[str], featured_prompts: List[str]) -> Dict[str, List[str]]:
        """Tạo evidence cho các skills được thể hiện."""
        evidence = {}
        
        for skill in skills[:5]:  # Limit to top 5 skills
            skill_clean = skill.replace("#", "").lower()
            
            # Tìm prompts liên quan đến skill này
            related_prompts = []
            for prompt in featured_prompts:
                if any(keyword in prompt.lower() for keyword in self._get_skill_keywords(skill_clean)):
                    related_prompts.append(prompt[:80] + "..." if len(prompt) > 80 else prompt)
            
            evidence[skill] = related_prompts or ["Được thể hiện qua quá trình tương tác"]
        
        return evidence
    
    def _get_skill_keywords(self, skill: str) -> List[str]:
        """Lấy keywords liên quan đến skill để tìm evidence."""
        skill_keywords = {
            "sángtạo": ["brainstorm", "ý tưởng", "sáng tạo", "innovation", "creative"],
            "lậpkếhoạch": ["kế hoạch", "plan", "schedule", "timeline", "organize"],
            "phântích": ["phân tích", "analyze", "research", "investigate", "study"],
            "giaoqiếtvấnđề": ["giải quyết", "solution", "problem", "solve", "fix"],
            "giaotiếp": ["giao tiếp", "communicate", "explain", "discuss", "present"],
            "họchỏi": ["học", "learn", "study", "understand", "knowledge"]
        }
        
        return skill_keywords.get(skill, [skill])
    
    def _generate_reflection(self, analysis_data: Dict[str, Any], mission_info: Dict[str, Any]) -> str:
        """Tạo personal reflection cho portfolio card."""
        mission_title = mission_info.get("title", "dự án này")
        skills_count = len(analysis_data.get("skills", []))
        
        return f"Qua quá trình thực hiện '{mission_title}', tôi đã phát triển {skills_count} kỹ năng quan trọng và học được cách tiếp cận vấn đề một cách có hệ thống. Đây là một trải nghiệm học tập quý giá giúp tôi tự tin hơn trong việc xử lý các thách thức tương lai."
    
    def _suggest_next_steps(self, skills: List[str], mission_info: Dict[str, Any]) -> List[str]:
        """Đề xuất các bước tiếp theo cho học viên."""
        category = mission_info.get("category", "General")
        
        next_steps = [
            "Áp dụng kiến thức đã học vào dự án thực tế",
            "Chia sẻ kinh nghiệm với cộng đồng AI Lab Việt"
        ]
        
        # Đề xuất dựa trên category
        if "Marketing" in category:
            next_steps.extend([
                "Thực hiện campaign marketing thực tế",
                "Học về digital marketing analytics"
            ])
        elif "Technology" in category:
            next_steps.extend([
                "Phát triển ứng dụng thực tế",
                "Tham gia hackathon hoặc competition"
            ])
        elif "Business" in category:
            next_steps.extend([
                "Nghiên cứu thêm về business strategy",
                "Tham gia startup competition"
            ])
        else:
            next_steps.extend([
                "Chọn chuyên môn sâu để phát triển",
                "Tìm mentor trong lĩnh vực quan tâm"
            ])
        
        return next_steps
    
    def _save_to_database(self, portfolio_card: Dict[str, Any]) -> bool:
        """
        Mock function để "lưu" portfolio card vào database.
        
        Args:
            portfolio_card: Portfolio card cần lưu
            
        Returns:
            Boolean indicating success
        """
        print(f"[{self.name}] 💾 SAVING TO DATABASE:")
        print(f"[{self.name}] Card ID: {portfolio_card['card_id']}")
        print(f"[{self.name}] Project: {portfolio_card['project_overview']['title']}")
        print(f"[{self.name}] User: {portfolio_card['user_info']['user_name']}")
        print(f"[{self.name}] Skills: {portfolio_card['skills_demonstrated']['primary_skills']}")
        print(f"[{self.name}] Prompts: {len(portfolio_card['featured_prompts']['prompts'])} featured prompts")
        
        # Mock database save
        self.portfolio_storage.append(portfolio_card)
        
        print(f"[{self.name}] ✅ Successfully saved to database!")
        print(f"[{self.name}] Total cards in storage: {len(self.portfolio_storage)}")
        
        return True
    
    def get_portfolio_summary(self, user_id: str = None) -> Dict[str, Any]:
        """
        Lấy tóm tắt portfolio của user hoặc tất cả.
        
        Args:
            user_id: ID của user (None để lấy tất cả)
            
        Returns:
            Portfolio summary
        """
        if user_id:
            user_cards = [card for card in self.portfolio_storage 
                         if card['user_info']['user_id'] == user_id]
        else:
            user_cards = self.portfolio_storage
        
        return {
            "total_cards": len(user_cards),
            "cards_summary": [
                {
                    "card_id": card["card_id"],
                    "project_title": card["project_overview"]["title"],
                    "created_at": card["created_at"],
                    "skills_count": len(card["skills_demonstrated"]["primary_skills"])
                }
                for card in user_cards
            ]
        }