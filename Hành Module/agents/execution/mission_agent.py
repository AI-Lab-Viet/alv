# agents/execution/mission_agent.py
"""
MissionAgent - Agent thực thi việc quản lý và phân chia nhiệm vụ dự án.
"""

from typing import Dict, Any
from agents.base import ExecutionAgent


class MissionAgent(ExecutionAgent):
    """
    Agent chuyên về quản lý và phân chia nhiệm vụ dự án.
    
    Nhiệm vụ:
    - Phân tích và breakdown project requirements
    - Tạo task hierarchy và dependencies
    - Phân công nhiệm vụ cho team members
    - Theo dõi tiến độ và milestone
    - Cung cấp chi tiết nhiệm vụ từ database
    """
    
    def __init__(self, supabase_client=None):
        """Khởi tạo MissionAgent với kết nối database thực."""
        # Kết nối Supabase client
        if supabase_client:
            self.supabase = supabase_client
        else:
            try:
                from supabase import create_client
                import os
                supabase_url = os.getenv("SUPABASE_URL")
                supabase_key = os.getenv("SUPABASE_ANON_KEY")
                self.supabase = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None
            except Exception as e:
                print(f"[MissionAgent] Supabase client init error: {str(e)}")
                self.supabase = None
        # Mapping kỹ năng cốt lõi 4D+S cho từng mission
        self.core_skills_map = {
            "mission_01": ["#Description", "#Diligence"],
            "mission_02": ["#Delegation", "#Synthesis"],
            "mission_03": ["#Discernment", "#Description"]
        }
        print(f"[{self.name}] Initialized with Supabase client: {self.supabase is not None}")
    
    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Thực thi việc quản lý nhiệm vụ dự án.
        
        Args:
            params: Tham số bao gồm project_scope, team_info, timeline, etc.
            
        Returns:
            Dict chứa mission plan và task breakdown
        """
        print(f"[{self.name}] Executing mission planning...")
        print(f"[{self.name}] Parameters: {params}")
        
        # TODO: Implement logic chi tiết
        # - Phân tích project scope và requirements
        # - Tạo Work Breakdown Structure (WBS)
        # - Xác định dependencies giữa các tasks
        # - Estimate effort và timeline
        # - Phân công tasks dựa trên skills và availability
        
        result = {
            "mission_id": f"mission_{params.get('project_name', 'project')}",
            "project_name": params.get('project_name', 'Dự án mới'),
            "mission_scope": params.get('project_scope', 'Mô tả dự án'),
            "timeline": {
                "start_date": params.get('start_date'),
                "end_date": params.get('end_date'),
                "duration_weeks": params.get('duration_weeks', 4)
            },
            "phases": [
                {
                    "phase_id": "planning",
                    "name": "Lập kế hoạch",
                    "duration_days": 3,
                    "tasks": [
                        "Phân tích requirements",
                        "Thiết kế architecture",
                        "Lập timeline chi tiết"
                    ]
                },
                {
                    "phase_id": "development",
                    "name": "Phát triển",
                    "duration_days": 14,
                    "tasks": [
                        "Setup development environment",
                        "Implement core features",
                        "Unit testing"
                    ]
                },
                {
                    "phase_id": "testing",
                    "name": "Kiểm thử",
                    "duration_days": 5,
                    "tasks": [
                        "Integration testing",
                        "User acceptance testing",
                        "Bug fixing"
                    ]
                },
                {
                    "phase_id": "deployment",
                    "name": "Triển khai",
                    "duration_days": 2,
                    "tasks": [
                        "Production deployment",
                        "Performance monitoring",
                        "Documentation"
                    ]
                }
            ],
            "resources": {
                "team_size": params.get('team_size', 1),
                "domain_skills": params.get('domain_skills', []),
                "alv_skills": params.get('alv_skills', []),
                "budget": params.get('budget'),
                "tools": params.get('tools', [])
            },
            "deliverables": [
                "Technical documentation",
                "Source code",
                "Test reports",
                "Deployment guide"
            ]
        }
        
        return result
    
    def get_mission_details(self, mission_id: str) -> Dict[str, Any]:
        """
        Lấy chi tiết một mission dựa trên ID.
        
        Args:
            mission_id: ID của mission cần lấy chi tiết
            
        Returns:
            Dict chứa chi tiết mission hoặc error message
        """
        print(f"[{self.name}] Getting details for mission: {mission_id}")
        if not self.supabase:
            print(f"[{self.name}] Supabase client not configured!")
            return {"error": "Supabase client not configured"}
        try:
            response = self.supabase.table("missions").select("*").eq("id", mission_id).execute()
            if response.data and len(response.data) > 0:
                mission_data = response.data[0]
                print(f"[{self.name}] Found mission in DB: {mission_data.get('title')}")
                
                # Chuẩn hóa output theo DetailedProject interface
                detailed_mission = {
                    "id": int(mission_data.get("id")),
                    "title": mission_data.get("title"),
                    "description": mission_data.get("description"),
                    "category": mission_data.get("category"),
                    "difficulty": mission_data.get("difficulty"),
                    "estimated_hours": mission_data.get("estimated_hours"),
                    "context": mission_data.get("context"),
                    "learning_objectives": mission_data.get("learning_objectives", []),
                    "deliverables": mission_data.get("deliverables", []),
                    "tips": mission_data.get("tips", []),
                    "prompt_starters": mission_data.get("prompt_starters", []),
                    "participants": mission_data.get("participants", 0),
                    "rating": mission_data.get("rating", 0.0),
                    "domain_skills": mission_data.get("domain_skills", []),
                    "alv_skills": mission_data.get("alv_skills", []),
                    "thumbnail": mission_data.get("thumbnail", ""),
                    "featured": bool(mission_data.get("featured", False)),
                    # Thêm các trường bổ sung từ DB nếu có
                    "created_at": mission_data.get("created_at"),
                    "updated_at": mission_data.get("updated_at")
                }
                
                return detailed_mission
            else:
                print(f"[{self.name}] Mission not found in DB: {mission_id}")
                return {
                    "error": "Mission not found in database",
                    "available_missions": []
                }
        except Exception as e:
            print(f"[{self.name}] DB error: {str(e)}")
            return {"error": f"Database error: {str(e)}"}
    
    def list_all_missions(self) -> dict:
        """
        Lấy danh sách tất cả missions có sẵn theo định dạng DetailedProject.
        Returns:
            Dict chứa danh sách missions
        """
        print(f"[{self.name}] Listing all available missions")
        missions_summary = []
        # Nếu có supabase, lấy từ DB
        if self.supabase:
            try:
                resp = self.supabase.table("missions").select("*").execute()
                for mission_data in resp.data:
                    # Chuẩn hóa output theo DetailedProject interface
                    detailed_mission = {
                        "id": str(mission_data.get("id")),
                        "title": mission_data.get("title"),
                        "description": mission_data.get("description"),
                        "category": mission_data.get("category"),
                        "difficulty": mission_data.get("difficulty"),
                        "estimated_hours": mission_data.get("estimated_hours"),
                        "context": mission_data.get("context"),
                        "learning_objectives": mission_data.get("learning_objectives", []),
                        "deliverables": mission_data.get("deliverables", []),
                        "tips": mission_data.get("tips", []),
                        "prompt_starters": mission_data.get("prompt_starters", []),
                        "participants": mission_data.get("participants", 0),
                        "rating": mission_data.get("rating", 0.0),
                        "domain_skills": mission_data.get("domain_skills", []),
                        "alv_skills": mission_data.get("alv_skills", []),
                        "thumbnail": mission_data.get("thumbnail", ""),
                        "featured": bool(mission_data.get("featured", False)),
                        # Thêm các trường bổ sung nếu cần
                        "created_at": mission_data.get("created_at"),
                        "updated_at": mission_data.get("updated_at")
                    }
                    missions_summary.append(detailed_mission)
            except Exception as e:
                print(f"[{self.name}] Error loading missions from DB: {str(e)}")
        # Nếu không có supabase, trả về rỗng hoặc mock nếu muốn
        return {
            "total_missions": len(missions_summary),
            "missions": missions_summary
        }
