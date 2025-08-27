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
    
    def __init__(self):
        """Khởi tạo MissionAgent với mock mission database."""
        # Mock mission database - Trong thực tế sẽ kết nối với database thực
        self.missions = {
            "mission_01": {
                "id": "mission_01",
                "title": "Chiến dịch truyền thông cho CLB Sách",
                "description": "Xây dựng một kế hoạch truyền thông 3 tháng để thu hút thành viên mới cho Câu lạc bộ Sách của trường đại học",
                "category": "Marketing & Communications",
                "difficulty": "Intermediate",
                "estimated_hours": 40,
                "skills_required": ["Marketing", "Content Creation", "Social Media", "Event Planning"],
                "deliverables": [
                    "Kế hoạch truyền thông chi tiết 3 tháng",
                    "3 slogan sáng tạo cho campaign",
                    "Timeline thực hiện cụ thể",
                    "Budget estimate"
                ],
                "learning_objectives": [
                    "Hiểu về chiến lược truyền thông tích hợp",
                    "Thực hành tư duy sáng tạo trong marketing", 
                    "Phát triển kỹ năng lập kế hoạch chi tiết"
                ]
            },
            "mission_02": {
                "id": "mission_02", 
                "title": "Thiết kế chatbot hỗ trợ khách hàng",
                "description": "Phát triển một chatbot AI để hỗ trợ khách hàng trả lời câu hỏi thường gặp cho một cửa hàng online",
                "category": "Technology & AI",
                "difficulty": "Advanced",
                "estimated_hours": 60,
                "skills_required": ["AI/ML", "Python", "NLP", "User Experience"],
                "deliverables": [
                    "Chatbot prototype hoạt động",
                    "Dataset câu hỏi-trả lời",
                    "Tài liệu kỹ thuật",
                    "User testing report"
                ],
                "learning_objectives": [
                    "Hiểu về NLP và conversational AI",
                    "Thực hành thiết kế user experience",
                    "Phát triển kỹ năng lập trình AI"
                ]
            },
            "mission_03": {
                "id": "mission_03",
                "title": "Phân tích xu hướng thị trường startup Việt Nam",
                "description": "Nghiên cứu và phân tích xu hướng đầu tư startup tại Việt Nam trong 2 năm gần đây",
                "category": "Business Analysis",
                "difficulty": "Intermediate", 
                "estimated_hours": 35,
                "skills_required": ["Data Analysis", "Research", "Business Intelligence", "Presentation"],
                "deliverables": [
                    "Báo cáo phân tích 15-20 trang",
                    "Infographic tóm tắt xu hướng",
                    "Presentation slides",
                    "Dataset phân tích"
                ],
                "learning_objectives": [
                    "Phát triển kỹ năng nghiên cứu thị trường",
                    "Thực hành phân tích dữ liệu business",
                    "Học cách trình bày insight hiệu quả"
                ]
            }
        }
        
        print(f"[{self.name}] Initialized with {len(self.missions)} mock missions")
        print(f"[{self.name}] Available missions: {list(self.missions.keys())}")
    
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
                "required_skills": params.get('required_skills', []),
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
        
        if mission_id in self.missions:
            mission = self.missions[mission_id]
            print(f"[{self.name}] Found mission: {mission['title']}")
            return mission
        else:
            print(f"[{self.name}] Mission not found: {mission_id}")
            return {
                "error": "Mission not found",
                "available_missions": list(self.missions.keys())
            }
    
    def list_all_missions(self) -> Dict[str, Any]:
        """
        Lấy danh sách tất cả missions có sẵn.
        
        Returns:
            Dict chứa danh sách missions
        """
        print(f"[{self.name}] Listing all available missions")
        
        missions_summary = []
        for mission_id, mission in self.missions.items():
            missions_summary.append({
                "id": mission_id,
                "title": mission["title"],
                "category": mission["category"],
                "difficulty": mission["difficulty"],
                "estimated_hours": mission["estimated_hours"]
            })
        
        return {
            "total_missions": len(self.missions),
            "missions": missions_summary
        }
