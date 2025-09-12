"""
Routes for project workflow endpoints
"""
import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Header, Query, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from api.config import dispatcher, supabase
from api.dependencies import validate_user_id
from utils.chat_utils import load_chat_history

router = APIRouter()

class StartProjectRequest(BaseModel):
    mission_id: str

class EndProjectRequest(BaseModel):
    reflection: str = None
    submission: str = None

@router.post("/api/start", summary="Bắt đầu một dự án mới", description="Khởi tạo session cho dự án mới và trả về system_prompt")
def start_project_api(
    payload: StartProjectRequest,
    user_id: str = Header(..., description="ID của user")
):
    try:
        # Validate user_id
        user_id = validate_user_id(user_id)
        
        mission_id = payload.mission_id
        # Lấy thông tin mission
        mission_agent = dispatcher.mission_agent
        mission = mission_agent.get_mission_details(mission_id)
        
        # Kiểm tra nếu mission là string hoặc có error
        if isinstance(mission, str) or (isinstance(mission, dict) and "error" in mission):
            error_msg = mission if isinstance(mission, str) else mission["error"]
            return JSONResponse(status_code=404, content={"status": "error", "message": error_msg})
        
        # Soạn system_prompt
        domain_skills = ', '.join(mission.get('domain_skills', []))
        alv_skills = ', '.join(mission.get('alv_skills', []))
        skills_text = f"Kỹ năng chuyên môn: {domain_skills}. Kỹ năng ALV: {alv_skills}" if domain_skills or alv_skills else ""
        system_prompt = f"Bạn là một Cộng sự Sáng tạo. Nhiệm vụ của bạn: {mission.get('description', '')} {skills_text}"
        
        # Tạo session_id (project_id)
        session_id = str(uuid.uuid4())
        
        # Lưu vào bảng projects
        try:
            if supabase:
                supabase.table("projects_ids").insert({
                    "session_id": session_id,
                    "user_id": user_id,
                    "mission_id": mission_id,
                    "status": "in_progress",
                    "created_at": datetime.now().isoformat()
                }).execute()
        except Exception as e:
            print(f"Error saving project: {str(e)}")
        
        return {
            "session_id": session_id,
            "user_id": user_id,
            "system_prompt": system_prompt,
            "mission": mission,
            "mission_id": mission_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/end", summary="Hoàn thành dự án", description="Kết thúc session và trả về kết quả đánh giá")
async def end_project_api(
    payload: EndProjectRequest,
    user_id: str = Header(..., description="ID của user"),
    session_id: str = Query(..., description="ID của session/project")
):
    try:
        # Validate user_id
        user_id = validate_user_id(user_id)
        
        if not session_id:
            raise HTTPException(status_code=400, detail="Missing session_id")
        
        # Truy vấn project và verify ownership
        project = None
        if supabase:
            try:
                resp = supabase.table("projects_ids").select("*").eq("session_id", session_id).eq("user_id", user_id).execute()
                if resp.data and len(resp.data) > 0:
                    project = resp.data[0]
            except Exception as e:
                print(f"Error loading project: {str(e)}")
        
        if not project or not isinstance(project, dict):
            return JSONResponse(status_code=404, content={"status": "error", "message": "Project not found or access denied"})
        
        mission_id = project.get("mission_id")
        
        # Lấy lịch sử chat với session_id
        chat_history_str = await load_chat_history(user_id, mission_id, session_id)
        
        # Convert chat history string thành list để phù hợp với AnalysisAgent
        chat_history_list = []
        if chat_history_str:
            try:
                # Nếu chat_history_str là JSON string được wrap trong quotes, decode nó trước
                if chat_history_str.startswith('"') and chat_history_str.endswith('"'):
                    chat_history_str = json.loads(chat_history_str)  # Loại bỏ quotes ngoài
                
                # Parse thành format [{role, parts}] cho AnalysisAgent
                if isinstance(chat_history_str, str):
                    # Split theo pattern "ai: " và "user: "
                    import re
                    messages = re.split(r'\n(ai|user): ', chat_history_str)
                    chat_history_list = []
                    
                    for i in range(1, len(messages), 2):
                        if i + 1 < len(messages):
                            role = messages[i]
                            content = messages[i + 1]
                            chat_history_list.append({
                                "role": "model" if role == "ai" else "user",
                                "parts": [content]
                            })
                
                # Fallback nếu đã là list
                elif isinstance(chat_history_str, list):
                    chat_history_list = chat_history_str
                    
            except Exception as e:
                print(f"[DEBUG] Error parsing chat history: {e}")
                # Nếu không parse được, tạo một message từ string
                chat_history_list = [{"role": "user", "parts": [chat_history_str]}]
        
        # Lấy thông tin chi tiết nhiệm vụ - truyền toàn bộ object
        mission_detail = {}
        if mission_id:
            mission_agent = dispatcher.mission_agent
            mission_info = mission_agent.get_mission_details(mission_id)
            if isinstance(mission_info, dict) and "error" not in mission_info:
                mission_detail = mission_info  # Truyền toàn bộ object
            elif isinstance(mission_info, str):
                mission_detail = {"description": mission_info, "mission_id": mission_id}
            else:
                mission_detail = {"mission_id": mission_id}
        
        # Gọi AnalysisAgent với mission_detail đầy đủ
        analysis_agent = dispatcher.analysis_agent
        analysis_result = analysis_agent.execute({
            "analysis_type": "chat_analysis",
            "chat_history": chat_history_list,
            "mission_detail": mission_detail,
        })
        
        # Lưu trực tiếp vào completed_projects table
        portfolio_saved = False
        if supabase and isinstance(analysis_result, dict):
            try:
                # DEBUG: Kiểm tra analysis_result
                print(f"[DEBUG] Analysis result keys: {list(analysis_result.keys())}")
                print(f"[DEBUG] Analysis result content: {analysis_result}")
                
                # Extract thông tin từ analysis result
                summary = analysis_result.get("summary", "Không có tóm tắt")
                skills = analysis_result.get("skills", [])
                featured_prompts = analysis_result.get("featured_prompts", [])
                
                # DEBUG: Kiểm tra featured_prompts
                print(f"[DEBUG] Featured prompts extracted: {featured_prompts}")
                print(f"[DEBUG] Featured prompts type: {type(featured_prompts)}")
                print(f"[DEBUG] Featured prompts length: {len(featured_prompts) if isinstance(featured_prompts, list) else 'Not a list'}")
                
                # Chuẩn bị data để insert
                portfolio_data = {
                    "id": session_id,  # Tạo ID mới cho portfolio
                    "user_id": user_id,
                    "final_product": payload.submission,
                    "reflection": payload.reflection,
                    "key_prompts": featured_prompts,  # featured_prompts → key_prompts
                    "skills_applied": skills,  # skills → skills_applied
                    "total_messages": len(chat_history_list),  # Số lượng messages
                    "created_at": datetime.now().isoformat(),
                    "completed_at": datetime.now().isoformat(),
                    "status": "completed",
                    "mission_id": mission_id,
                    "mission_name": mission_detail.get("title", "N/A"),
                    "mission_description": mission_detail.get("description", "N/A"),
                }
                
                # Insert vào Supabase
                result = supabase.table("completed_projects").insert(portfolio_data).execute()
                
                if result.data:
                    portfolio_saved = True
                    print(f"✅ Portfolio saved to completed_projects for user {user_id}")
                    print(f"   • Summary: {summary[:100]}...")
                    print(f"   • Skills: {skills}")
                    print(f"   • Featured prompts: {len(featured_prompts)} prompts")
                else:
                    print(f"❌ Failed to save portfolio to completed_projects")
                    
            except Exception as e:
                print(f"❌ Error saving to completed_projects: {str(e)}")
        
        # Fallback: Gọi PortfolioAgent nếu Supabase không hoạt động
        portfolio_result = {}
        if not portfolio_saved:
            try:
                portfolio_agent = dispatcher.portfolio_agent
                portfolio_result = portfolio_agent.execute({
                    "analysis": analysis_result,
                    "final_product": analysis_result.get("summary", "Project completed successfully"),
                    "user_info": {"user_id": user_id, "user_name": f"User {user_id}"},
                    "mission_info": mission_detail
                })
                print(f"✅ Portfolio saved via PortfolioAgent as fallback")
            except Exception as e:
                print(f"❌ Error with PortfolioAgent fallback: {str(e)}")
                portfolio_result = {"status": "error", "message": str(e)}
        
        # Cập nhật trạng thái project và lưu reflection/submission và key_prompts                        
        try:
            if supabase:
                update_data = {"status": "completed"}
                # Thêm reflection và submission nếu có
                if payload.reflection is not None:
                    update_data["reflection"] = payload.reflection
                if payload.submission is not None:
                    update_data["submission"] = payload.submission
                
                # Thêm key_prompts từ analysis_result
                # if isinstance(analysis_result, dict):
                #     featured_prompts = analysis_result.get("featured_prompts", [])
                #     update_data["key_prompts"] = featured_prompts
                #     print(f"[DEBUG] Adding key_prompts to projects_ids: {len(featured_prompts)} prompts")
                
                supabase.table("projects_ids").update(update_data).eq("session_id", session_id).eq("user_id", user_id).execute()
                print(f"✅ Project {session_id} marked as completed with reflection, submission, and key_prompts")
        except Exception as e:
            print(f"Error updating project status: {str(e)}")
        
        # Kiểm tra kiểu dữ liệu của analysis_result
        if isinstance(analysis_result, str):
            analysis_data = {"content": analysis_result, "type": "text"}
        elif isinstance(analysis_result, dict):
            analysis_data = analysis_result
        else:
            analysis_data = {"content": str(analysis_result), "type": "converted"}
            
        return {
            "status": "success",
            "session_id": session_id,
            "user_id": user_id,
            "mission": mission_detail,
            "analysis": {
                "analysis_data": analysis_data,
                "submission": payload.submission,
                "reflection": payload.reflection
            },
            "portfolio": {
                "saved_to_database": portfolio_saved,
                "portfolio_agent_result": portfolio_result,
                "data_saved": {
                    "final_product": analysis_result.get("summary", "N/A"),
                    "skills_applied": mission_detail.get("alv_skills", []),
                    "key_prompts": analysis_result.get("featured_prompts", [])
                } if isinstance(analysis_result, dict) else {}
            },
            "project_data": {
                "saved_to_projects_ids": True
            },
            "message": f"Project completed. Portfolio {'saved to completed_projects table' if portfolio_saved else 'processed via PortfolioAgent'} with {len(analysis_result.get('featured_prompts', []))} featured prompts. Reflection and submission saved to projects_ids."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
