"""
Routes for mission-related endpoints
"""
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, Any

from api.config import dispatcher
from models.schemas import MissionsListResponse

router = APIRouter()

@router.get("/mission_agent", 
         summary="Lấy thông tin mission", 
         description="Truy vấn thông tin nhiệm vụ từ MissionAgent qua query param mission_id",
         response_model=Dict[str, Any])
def mission_agent_api(mission_id: str = Query(..., description="ID của mission")):
    """
    API GET lấy chi tiết mission theo mission_id (query param), trả về định dạng DetailedProject.
    """
    try:
        mission_agent = dispatcher.mission_agent
        mission = mission_agent.get_mission_details(mission_id)
        
        # Kiểm tra nếu mission là string hoặc có error
        if isinstance(mission, str):
            return JSONResponse(
                status_code=404, 
                content={
                    "status": "error", 
                    "message": mission, 
                    "available_missions": []
                }
            )
        elif isinstance(mission, dict) and "error" in mission:
            return JSONResponse(
                status_code=404, 
                content={
                    "status": "error", 
                    "message": mission["error"], 
                    "available_missions": mission.get("available_missions", [])
                }
            )
        return {"status": "success", "mission": mission}
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"status": "error", "message": str(e)}
        )

@router.get("/missions", 
         summary="Danh sách nhiệm vụ", 
         description="Lấy danh sách tất cả nhiệm vụ, hỗ trợ phân trang",
         response_model=MissionsListResponse)
def list_missions(
    page: int = Query(1, ge=1, description="Trang hiện tại"),
    page_size: int = Query(10, ge=1, le=100, description="Số lượng mỗi trang")
):
    """
    API GET lấy danh sách tất cả missions, hỗ trợ phân trang.
    """
    try:
        mission_agent = dispatcher.mission_agent
        missions = []
        if hasattr(mission_agent, "list_all_missions"):
            all_missions = mission_agent.list_all_missions().get("missions", [])
            missions = all_missions
        else:
            return JSONResponse(
                status_code=500, 
                content={"status": "error", "message": "MissionAgent không hỗ trợ list_all_missions"}
            )
        total = len(missions)
        total_pages = (total + page_size - 1) // page_size
        start = (page - 1) * page_size
        end = start + page_size
        paged_missions = missions[start:end]
        return MissionsListResponse(
            total_missions=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            missions=paged_missions
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"status": "error", "message": str(e)}
        )

@router.get("/missions/category", summary="Danh sách nhiệm vụ theo category", description="Lọc danh sách missions theo category", response_model=MissionsListResponse)
def list_missions_by_category(
    category: str = Query(..., description="Tên category muốn lọc"),
    page: int = Query(1, ge=1, description="Trang hiện tại"),
    page_size: int = Query(10, ge=1, le=100, description="Số lượng mỗi trang")
):
    """
    API GET lấy danh sách missions theo category, hỗ trợ phân trang.
    """
    try:
        mission_agent = dispatcher.mission_agent
        missions = []
        if hasattr(mission_agent, "list_all_missions"):
            all_missions = mission_agent.list_all_missions().get("missions", [])
            missions = [m for m in all_missions if m.get("category") == category]
        else:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "MissionAgent không hỗ trợ list_all_missions"}
            )
        total = len(missions)
        total_pages = (total + page_size - 1) // page_size
        start = (page - 1) * page_size
        end = start + page_size
        paged_missions = missions[start:end]
        return MissionsListResponse(
            total_missions=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            missions=paged_missions
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )
        
@router.get("/missions/featured", summary="Danh sách nhiệm vụ nổi bật", description="Lọc danh sách missions theo trường featured true/false", response_model=MissionsListResponse)
def list_featured_missions(
    featured: bool = Query(True, description="Chỉ lấy missions featured (true/false)"),
    page: int = Query(1, ge=1, description="Trang hiện tại"),
    page_size: int = Query(10, ge=1, le=100, description="Số lượng mỗi trang")
):
    """
    API GET lấy danh sách missions theo trường featured true/false, hỗ trợ phân trang.
    """
    try:
        mission_agent = dispatcher.mission_agent
        missions = []
        if hasattr(mission_agent, "list_all_missions"):
            all_missions = mission_agent.list_all_missions().get("missions", [])
            missions = [m for m in all_missions if m.get("featured", False) == featured]
        else:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "MissionAgent không hỗ trợ list_all_missions"}
            )
        total = len(missions)
        total_pages = (total + page_size - 1) // page_size
        start = (page - 1) * page_size
        end = start + page_size
        paged_missions = missions[start:end]
        return MissionsListResponse(
            total_missions=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            missions=paged_missions
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

@router.get("/missions/search", summary="Tìm kiếm nhiệm vụ theo tên", description="Tìm kiếm missions theo tên (title) với hỗ trợ phân trang và tìm kiếm fuzzy", response_model=MissionsListResponse)
def search_missions_by_name(
    name: str = Query(..., description="Tên mission muốn tìm kiếm (hỗ trợ tìm kiếm theo ký tự)"),
    search_mode: str = Query("fuzzy", description="Chế độ tìm kiếm: 'exact' (chính xác), 'fuzzy' (gần giống), 'regex' (biểu thức chính quy)"),
    page: int = Query(1, ge=1, description="Trang hiện tại"),
    page_size: int = Query(10, ge=1, le=100, description="Số lượng mỗi trang")
):
    """
    API GET tìm kiếm missions theo tên với nhiều chế độ tìm kiếm:
    - exact: Tìm kiếm chính xác (chứa chuỗi con)
    - fuzzy: Tìm kiếm gần giống theo từng ký tự
    - regex: Tìm kiếm bằng biểu thức chính quy
    """
    try:
        import re
        from difflib import SequenceMatcher
        
        def similarity(a, b):
            """Tính độ tương tự giữa 2 chuỗi"""
            return SequenceMatcher(None, a.lower(), b.lower()).ratio()
        
        def fuzzy_search(search_term, text):
            """Tìm kiếm fuzzy - chỉ tìm trong title và phải chứa các ký tự đó"""
            if not search_term or not text:
                return False
            
            search_term = search_term.lower().strip()
            text = text.lower()
            
            # Kiểm tra chứa chuỗi con trực tiếp
            if search_term in text:
                return True
            
            # Kiểm tra tất cả ký tự trong search_term có xuất hiện trong text không
            return all(char in text for char in search_term)
        
        def regex_search(pattern, text):
            """Tìm kiếm bằng regex"""
            try:
                return bool(re.search(pattern, text, re.IGNORECASE))
            except re.error:
                return False
        
        def exact_search(search_term, text):
            """Tìm kiếm chính xác"""
            return search_term.lower() in text.lower()
        
        mission_agent = dispatcher.mission_agent
        missions = []
        if hasattr(mission_agent, "list_all_missions"):
            all_missions = mission_agent.list_all_missions().get("missions", [])
            search_term = name.strip()
            
            # Chỉ tìm kiếm trong title (tên) thôi
            for mission in all_missions:
                title = mission.get("title", "")
                
                found = False
                
                if search_mode == "exact":
                    found = exact_search(search_term, title)
                
                elif search_mode == "fuzzy":
                    found = fuzzy_search(search_term, title)
                
                elif search_mode == "regex":
                    found = regex_search(search_term, title)
                
                if found:
                    missions.append(mission)
        else:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "MissionAgent không hỗ trợ list_all_missions"}
            )
        
        total = len(missions)
        total_pages = (total + page_size - 1) // page_size
        start = (page - 1) * page_size
        end = start + page_size
        paged_missions = missions[start:end]
        
        return MissionsListResponse(
            total_missions=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            missions=paged_missions
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )
