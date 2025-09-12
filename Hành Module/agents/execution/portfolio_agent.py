# agents/execution/portfolio_agent.py
"""
PortfolioAgent - Agent thực thi việc quản lý portfolio và deliverables.
Phiên bản nâng cấp với logic tạo portfolio card từ analysis data.
"""

from typing import Dict, Any, List
from datetime import datetime
from agents.base import ExecutionAgent
from supabase import Client
import uuid


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
    
    def __init__(self, supabase_client: Client = None):
        """Khởi tạo PortfolioAgent với Supabase database."""
        # Supabase client để kết nối với database thực
        self.supabase = supabase_client
        self.portfolio_storage = []  # Backup storage
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
        print(f"[{self.name}] Supabase: {'✓ Connected' if supabase_client else '✗ Not connected'}")
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
            
            # Debug analysis_data để kiểm tra nội dung
            print(f"[{self.name}] DEBUG analysis_data: {analysis_data}")
            print(f"[{self.name}] DEBUG analysis_data keys: {list(analysis_data.keys()) if isinstance(analysis_data, dict) else 'Not a dict'}")
            
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
        card_id = str(uuid.uuid4())  # Tạo UUID thật thay vì string tùy ý
        
        # Trích xuất featured prompts và skills từ analysis
        featured_prompts = analysis_data.get("featured_prompts", ["Không có prompt nổi bật"])
        skills = analysis_data.get("skills", ["#HọcHỏi"])
        
        # Debug để kiểm tra featured_prompts
        print(f"[{self.name}] DEBUG featured_prompts: {featured_prompts}")
        print(f"[{self.name}] DEBUG featured_prompts type: {type(featured_prompts)}")
        print(f"[{self.name}] DEBUG skills: {skills}")
        
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
    
    def _get_mission_name(self, mission_id: str) -> str:
        """
        Lấy tên mission từ bảng missions.
        
        Args:
            mission_id: ID của mission
            
        Returns:
            Tên mission hoặc fallback value
        """
        if self.supabase and mission_id:
            try:
                result = self.supabase.table("missions")\
                    .select("title")\
                    .eq("id", mission_id)\
                    .execute()
                
                if result.data and len(result.data) > 0:
                    return result.data[0]["title"]
                else:
                    print(f"[{self.name}] No mission found with ID: {mission_id}")
                    return "Mission không tìm thấy"
                    
            except Exception as e:
                print(f"[{self.name}] Error getting mission name: {str(e)}")
                return "Lỗi truy vấn mission"
        else:
            return "Không xác định"

    def _get_mission_detail(self, mission_id: str) -> Dict[str, Any]:
        """
        Lấy chi tiết mission từ bảng missions.
        
        Args:
            mission_id: ID của mission
            
        Returns:
            Dictionary chứa chi tiết mission
        """
        if self.supabase and mission_id:
            try:
                print(f"[{self.name}] DEBUG: Executing query for mission_id = '{mission_id}'")
                result = self.supabase.table("missions")\
                    .select("*")\
                    .eq("id", mission_id)\
                    .execute()
                
                print(f"[{self.name}] DEBUG: Query result.data = {result.data}")
                print(f"[{self.name}] DEBUG: Query result length = {len(result.data) if result.data else 0}")
                
                if result.data and len(result.data) > 0:
                    mission = result.data[0]
                    return {
                        "title": mission.get("title", ""),
                        "description": mission.get("description", ""),
                        "category": mission.get("category", ""),
                        "difficulty": mission.get("difficulty", ""),
                        "skills": mission.get("skills", []),
                        "prompt_starters": mission.get("prompt_starters", [])
                    }
                else:
                    print(f"[{self.name}] No mission found with ID: {mission_id}")
                    return {
                        "title": "Mission không tìm thấy",
                        "description": "",
                        "category": "",
                        "difficulty": "",
                        "skills": [],
                        "prompt_starters": []
                    }
                    
            except Exception as e:
                print(f"[{self.name}] Error getting mission detail: {str(e)}")
                return {
                    "title": "Lỗi truy vấn mission",
                    "description": "",
                    "category": "",
                    "difficulty": "",
                    "skills": [],
                    "prompt_starters": []
                }
        else:
            return {
                "title": "Không xác định",
                "description": "",
                "category": "",
                "difficulty": "",
                "skills": [],
                "prompt_starters": []
            }

    def _save_to_database(self, portfolio_card: Dict[str, Any]) -> bool:
        """
        Lưu portfolio card vào Supabase projects_ids table (update reflection và submission).
        
        Args:
            portfolio_card: Portfolio card cần lưu
            
        Returns:
            Boolean indicating success
        """
        print(f"[{self.name}] 💾 SAVING TO DATABASE:")
        print(f"[{self.name}] Card ID: {portfolio_card['card_id']}")
        print(f"[{self.name}] Project: {portfolio_card['project_overview']['title']}")
        print(f"[{self.name}] User: {portfolio_card['user_info']['user_name']}")
        print(f"[{self.name}] Final Product: {portfolio_card['final_product']['content'][:100]}...")
        
        # Lưu vào backup storage
        self.portfolio_storage.append(portfolio_card)
        
        # Lưu vào Supabase projects_ids nếu có kết nối
        if self.supabase:
            try:
                # Tìm project tương ứng và update reflection/submission
                user_id = portfolio_card['user_info']['user_id']
                mission_id = portfolio_card['project_overview']['mission_id']
                
                # Update reflection và submission vào projects_ids
                update_data = {
                    "reflection": f"Hoàn thành project: {portfolio_card['project_overview']['title']}",
                    "submission": portfolio_card['final_product']['content'],  # submission = final_product content
                }
                
                # Update record trong projects_ids theo user_id và mission_id
                result = self.supabase.table("projects_ids")\
                    .update(update_data)\
                    .eq("user_id", user_id)\
                    .eq("mission_id", mission_id)\
                    .eq("status", "in_progress")\
                    .execute()
                
                if result.data and len(result.data) > 0:
                    print(f"[{self.name}] ✅ Successfully updated projects_ids with reflection and submission!")
                    return True
                else:
                    print(f"[{self.name}] ⚠️ No matching project found to update in projects_ids")
                    return False
                    
            except Exception as e:
                print(f"[{self.name}] ❌ Error updating projects_ids: {str(e)}")
                return False
        else:
            print(f"[{self.name}] ✅ Saved to local storage (Supabase not available)")
            return True
    
    def get_portfolio_by_user_id(self, user_id: str) -> Dict[str, Any]:
        """
        Lấy tất cả portfolio projects của user từ Supabase projects_ids table.
        
        Args:
            user_id: ID của user
            
        Returns:
            Dictionary chứa danh sách projects của user với reflection và submission
        """
        print(f"[{self.name}] Getting portfolio for user_id: {user_id}")
        
        if self.supabase:
            try:
                # Query từ bảng projects_ids để lấy mapping session_id/status theo user
                all_ids = self.supabase.table("projects_ids")\
                    .select("*")\
                    .eq("user_id", user_id)\
                    .execute()
                
                # Tạo dictionary để map mission_id -> session_id/status
                mission_to_session = {}
                if all_ids.data:
                    for project_id_record in all_ids.data:
                        mission_id = project_id_record.get("mission_id")
                        session_id = project_id_record.get("session_id")
                        status = project_id_record.get("status")
                        
                        mission_to_session[mission_id] = {
                            "session_id": session_id,
                            "status": status
                        }
                    
                    print(f"[{self.name}] DEBUG: Mission to session mapping: {mission_to_session}")
                else:
                    print(f"[{self.name}] DEBUG: No projects_ids records found for user_id={user_id}")
                
                # Query từ bảng completed_projects
                result = self.supabase.table("completed_projects")\
                    .select("*")\
                    .eq("user_id", user_id)\
                    .order("created_at", desc=True)\
                    .execute()

                if result.data:
                    projects = result.data
                    print(f"[{self.name}] Found {len(projects)} completed projects for user {user_id}")
                    
                    # Ghép data từ 2 bảng cho từng project
                    enriched_projects = []
                    for project in projects:
                        mission_id = project.get("mission_id", "")
                        
                        # Lấy session_id và status tương ứng với mission_id này
                        session_info = mission_to_session.get(mission_id, {})
                        session_id = session_info.get("session_id", "unknown_session")
                        status = session_info.get("status", "unknown_status")
                        
                        print(f"[{self.name}] DEBUG: Mission {mission_id} -> session_id={session_id}, status={status}")
                        
                        mission_detail = self._get_mission_detail(mission_id)
                        enriched_project = {
                            "id": project.get("id", "unknown_session"),  # Session_id đúng cho project này
                            "final_product": project.get("final_product", "Chưa có sản phẩm nộp"),
                            "reflection": project.get("reflection", "Chưa có reflection"),
                            "mission_id": mission_id,
                            "skills": project.get("skills_applied", []),
                            "status": project.get("status", "unknown_status"),  # Status đúng cho project này
                            "featured_prompts": project.get("key_prompts", []),
                            "created_at": project["created_at"],
                            "mission_name": mission_detail["title"],
                            "mission_description": mission_detail["description"]
                        }
                        enriched_projects.append(enriched_project)
                    
                    return {
                        "status": "success",
                        "user_id": user_id,
                        "total_projects": len(projects),
                        "projects": enriched_projects
                    }
                else:
                    print(f"[{self.name}] No completed projects found for user {user_id}")
                    return {
                        "status": "success",
                        "user_id": user_id,
                        "total_projects": 0,
                        "projects": [],
                        "message": "Chưa có project nào được hoàn thành"
                    }
                    
            except Exception as e:
                print(f"[{self.name}] Error querying Supabase: {str(e)}")
                return {
                    "status": "error",
                    "error_message": f"Database error: {str(e)}",
                    "user_id": user_id
                }
        else:
            # Fallback to local storage
            print(f"[{self.name}] Using local storage (Supabase not available)")
            user_cards = [card for card in self.portfolio_storage 
                         if card.get('user_info', {}).get('user_id') == user_id]
            
            # Thêm mission_detail cho local storage
            enriched_cards = []
            for card in user_cards:
                mission_detail = self._get_mission_detail(card["project_overview"]["mission_id"])
                enriched_card = {
                    "id": card["card_id"],
                    "final_product": card["final_product"]["content"],
                    "reflection": "Local storage - no reflection data",
                    "mission_id": card["project_overview"]["mission_id"],
                    "created_at": card["created_at"],
                    "completed_at": card["metadata"].get("completed_at", ""),
                    "mission_name": mission_detail["title"],
                    "mission_description": mission_detail["description"],
                }
                enriched_cards.append(enriched_card)
            
            return {
                "status": "success", 
                "user_id": user_id,
                "total_projects": len(user_cards),
                "projects": enriched_cards,
                "source": "local_storage"
            }

    def get_project_by_criteria(self, user_id: str = None, session_id: str = None, mission_id: str = None) -> Dict[str, Any]:
        """
        Tìm project theo các tiêu chí kết hợp: user_id, session_id, mission_id.
        
        Args:
            user_id: ID của user (optional)
            session_id: ID của session (optional) 
            mission_id: ID của mission (optional)
            
        Returns:
            Dictionary chứa project matching criteria với reflection và submission
        """
        print(f"[{self.name}] Getting project by criteria:")
        print(f"   - user_id: {user_id}")
        print(f"   - session_id: {session_id}")
        print(f"   - mission_id: {mission_id}")
        
        if self.supabase:
            try:
                # Xây dựng query với các điều kiện
                query = self.supabase.table("projects_ids").select("*")
                
                if user_id:
                    query = query.eq("user_id", user_id)
                if session_id:
                    query = query.eq("session_id", session_id)
                if mission_id:
                    query = query.eq("mission_id", mission_id)
                
                # Thực thi query
                result = query.order("created_at", desc=True).execute()
                
                if result.data:
                    projects = result.data
                    print(f"[{self.name}] Found {len(projects)} projects matching criteria")
                    
                    # Thêm mission_detail cho từng project
                    enriched_projects = []
                    for project in projects:
                        mission_detail = self._get_mission_detail(project.get("mission_id", ""))
                        enriched_project = {
                            "id": project["session_id"],
                            "user_id": project["user_id"],
                            "mission_id": project.get("mission_id", ""),
                            "final_product": project.get("submission", "Chưa có sản phẩm nộp"),
                            "reflection": project.get("reflection", "Chưa có reflection"),
                            "status": project.get("status", "in_progress"),
                            "created_at": project["created_at"],
                            "mission_name": mission_detail["title"],
                            "mission_description": mission_detail["description"]
                        }
                        enriched_projects.append(enriched_project)
                    
                    return {
                        "status": "success",
                        "criteria": {
                            "user_id": user_id,
                            "session_id": session_id,
                            "mission_id": mission_id
                        },
                        "total_projects": len(projects),
                        "projects": enriched_projects
                    }
                else:
                    print(f"[{self.name}] No projects found matching criteria")
                    return {
                        "status": "success",
                        "criteria": {
                            "user_id": user_id,
                            "session_id": session_id,
                            "mission_id": mission_id
                        },
                        "total_projects": 0,
                        "projects": [],
                        "message": "Không tìm thấy project nào với tiêu chí này"
                    }
                    
            except Exception as e:
                print(f"[{self.name}] Error querying Supabase: {str(e)}")
                return {
                    "status": "error",
                    "error_message": f"Database error: {str(e)}",
                    "criteria": {
                        "user_id": user_id,
                        "session_id": session_id,
                        "mission_id": mission_id
                    }
                }
        else:
            print(f"[{self.name}] Using local storage (Supabase not available)")
            return {
                "status": "error",
                "error_message": "Supabase not available for criteria search",
                "criteria": {
                    "user_id": user_id,
                    "session_id": session_id,
                    "mission_id": mission_id
                }
            }
    
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