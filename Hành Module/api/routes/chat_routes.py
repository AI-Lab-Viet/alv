"""
Routes for chat history endpoints
"""
from fastapi import APIRouter, Header, Query, HTTPException
from fastapi.responses import JSONResponse

from api.config import dispatcher, supabase
from api.dependencies import validate_user_id
from utils.chat_utils import parse_chat_history_to_messages

router = APIRouter()

@router.get("/api/history", summary="Xem lịch sử chat theo session_id")
async def get_chat_history_by_session(
    session_id: str = Query(..., description="ID của session (project)"),
    user_id: str = Header(..., description="ID của user")
):
    """
    Lấy lịch sử chat của một session (project) theo session_id. Chỉ user sở hữu mới được truy cập.
    """
    try:
        # Validate user_id
        user_id = validate_user_id(user_id)
        
        # Truy vấn trực tiếp bảng chat_history với user_id và session_id
        mission_id = None

        chat_history = ""
        if supabase:
            resp = supabase.table("chat_history").select("*").eq("user_id", user_id).eq("session_id", session_id).execute()
            if resp.data and len(resp.data) > 0:
                mission_id = resp.data[0].get("mission_id")
                chat_history = resp.data[0].get("chat_history", "")
                
        mission_agent = dispatcher.mission_agent
        mission = mission_agent.get_mission_details(mission_id)     
        
        if not chat_history:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Session not found or access denied"})
        
        # Chuyển đổi context string thành danh sách messages
        messages = parse_chat_history_to_messages(chat_history)
        
        return {
            "session_id": session_id,
            "user_id": user_id,
            "mission_id": mission_id,
            "mission_detail": mission,
            "chat_history": messages,
            "context_string": chat_history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving chat history: {str(e)}")
    
@router.delete("/api/delete-history/{session_id}", summary="Xoá lịch sử chat theo session_id")
async def delete_chat_history_by_session(
    session_id: str,
    user_id: str = Header(..., description="ID của user")
):
    """
    Xoá lịch sử chat của một session (project) theo session_id. Chỉ user sở hữu mới được xoá.
    """
    try:
        # Validate user_id
        user_id = validate_user_id(user_id)
        
        # Truy vấn project để verify ownership
        mission_id = None
        if supabase:
            resp = supabase.table("projects").select("mission_id").eq("id", session_id).eq("user_id", user_id).execute()
            if resp.data and len(resp.data) > 0:
                mission_id = resp.data[0].get("mission_id")
        
        if not mission_id:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Session not found or access denied"})
        
        # Xoá lịch sử chat trong Supabase với session_id
        if supabase:
            supabase.table("chat_history").delete().eq("user_id", user_id).eq("session_id", session_id).execute()
        
        return {
            "status": "success",
            "message": f"Đã xoá lịch sử chat cho session_id {session_id}",
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting chat history: {str(e)}")
