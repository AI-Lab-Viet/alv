from fastapi import Body, Header
from fastapi import FastAPI, HTTPException, status, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel, Field
import json
import time
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import uvicorn
from typing import Dict, Any
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid

from models.schemas import (
    InteractionRequest, 
    InteractionResponse, 
    SystemHealth,
    ErrorResponse,
    DetailedProject,
    MissionsListResponse
)
from core.dispatcher import SmartDispatcher


# Load environment variables
load_dotenv()

# Hàm helper để validate user_id
def validate_user_id(user_id: str) -> str:
    """Validate user_id từ header"""
    if not user_id or user_id.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid user_id in header"
        )
    return user_id.strip()

# Khởi tạo Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Khởi tạo FastAPI app
app = FastAPI(
    title="AI Lab Việt - Multi-Agent System API",
    description="""
    API cho hệ thống đa tác tử thông minh của AI Lab Việt.
    
    Hệ thống bao gồm:
    - **Orchestration Agents**: Điều phối workflow (TutorAgent, ProjectAgent)
    - **Execution Agents**: Thực thi tác vụ cụ thể (PracticeAgent, QuizAgent, MissionAgent, AnalysisAgent, PortfolioAgent)
    - **Communication Agents**: Giao tiếp với dịch vụ bên ngoài (InteractionAgent)
    
    Sử dụng SmartDispatcher để định tuyến request đến đúng agents.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware để cho phép frontend tương tác
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên chỉ định specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khởi tạo SmartDispatcher
dispatcher = SmartDispatcher()

# Inject Supabase client vào các agents cần thiết
if supabase:
    dispatcher.set_supabase_client(supabase)

# Biến global để theo dõi thống kê
app_stats = {
    "start_time": datetime.now(),
    "total_requests": 0,
    "successful_requests": 0,
    "failed_requests": 0
}

# Hàm quản lý lịch sử chat với Supabase
async def load_chat_history(user_id: str, mission_id: str = None, session_id: str = None) -> str:
    """Tải lịch sử chat từ Supabase dưới dạng chuỗi."""
    if not supabase:
        print("Supabase not configured, returning empty chat history")
        return ""
    try:
        query = supabase.table("chat_history").select("*").eq("user_id", user_id)
        if session_id:
            # Ưu tiên session_id nếu có
            query = query.eq("session_id", session_id)
        elif mission_id:
            query = query.eq("mission_id", mission_id)
        
        response = query.execute()
        print(f"Loaded chat doc for user_id {user_id}, mission_id {mission_id}, session_id {session_id}: {response.data}")
        
        if response.data and len(response.data) > 0:
            record = response.data[0]
            if isinstance(record, dict):
                chat_history = record.get("chat_history", "")
            else:
                print(f"Warning: Expected dict but got {type(record)}: {record}")
                chat_history = str(record) if record else ""
            print(f"Loaded chat history string: {chat_history}")
            return chat_history
        return ""
    except Exception as e:
        print(f"Error loading chat history: {str(e)}")
        return ""

async def save_chat_history(user_id: str, chat_history: str, mission_id: str = None, session_id: str = None):
    """Lưu lịch sử chat vào Supabase dưới dạng chuỗi."""
    if not supabase:
        print("Supabase not configured, skipping save")
        return
    try:
        # Kiểm tra xem đã có record chưa
        query = supabase.table("chat_history").select("*").eq("user_id", user_id)
        if session_id:
            # Ưu tiên session_id nếu có
            query = query.eq("session_id", session_id)
        elif mission_id:
            query = query.eq("mission_id", mission_id)
        
        existing = query.execute()
        
        data = {
            "user_id": user_id,
            "mission_id": mission_id,
            "session_id": session_id,
            "chat_history": chat_history,
            "updated_at": datetime.now().isoformat()
        }
        
        if existing.data and len(existing.data) > 0:
            # Update existing record
            result = supabase.table("chat_history").update(data).eq("user_id", user_id)
            if session_id:
                result = result.eq("session_id", session_id)
            elif mission_id:
                result = result.eq("mission_id", mission_id)
            result = result.execute()
        else:
            # Insert new record
            data["created_at"] = datetime.now().isoformat()
            result = supabase.table("chat_history").insert(data).execute()
            
        print(f"[DEBUG] Saved chat history for user_id {user_id}, session_id {session_id}")
        print(f"[DEBUG] Saved content: {chat_history[:200]}...")  # Show first 200 chars
    except Exception as e:
        print(f"Error saving chat history: {str(e)}")

def build_context_string(chat_history: str, new_message: str = None, new_response: str = None) -> str:
    """Xây dựng chuỗi ngữ cảnh từ lịch sử chat và tin nhắn/phản hồi mới."""
    context = chat_history.strip()
    if new_message:
        context = f"{context}\nuser: {new_message}" if context else f"user: {new_message}"
    if new_response:
        context = f"{context}\nai: {new_response}"
    print(f"Built context string: {context}")
    return context.strip()

def get_current_progress(chat_history: list, mission: dict) -> dict:
    """
    Xác định tiến trình hiện tại dựa trên chat_history và các phase của mission.
    """
    # Định nghĩa các bước logic cho dự án
    phases = [
        {"name": "Ý tưởng", "keywords": ["ý tưởng", "brainstorm", "sáng tạo", "khởi phát", "tư duy"]},
        {"name": "Lập Kế hoạch", "keywords": ["kế hoạch", "timeline", "phân công", "lập kế", "chiến lược"]},
        {"name": "Soạn thảo", "keywords": ["viết", "soạn thảo", "triển khai", "thực hiện", "phát triển"]},
        {"name": "Hoàn thành", "keywords": ["hoàn thành", "nộp bài", "kết thúc", "hoàn tất", "submit"]}
    ]
    
    current_step = 0
    
    # Phân tích chat_history để xác định bước hiện tại
    for msg in chat_history:
        content = ""
        if isinstance(msg, dict) and "parts" in msg:
            content = msg["parts"][0] if isinstance(msg["parts"], list) and msg["parts"] else ""
        elif isinstance(msg, dict) and "content" in msg:
            content = msg["content"]
        
        content_lower = content.lower()
        
        # Kiểm tra từ khóa cho từng phase
        for i, phase in enumerate(phases):
            if any(keyword in content_lower for keyword in phase["keywords"]):
                current_step = max(current_step, i)
    
    # Tính phần trăm tiến độ
    progress_percent = int((current_step / (len(phases) - 1)) * 100) if len(phases) > 1 else 0
    
    return phases[current_step]["name"] if current_step < len(phases) else phases[-1]["name"]

def convert_context_to_chat_history(context_string: str) -> list:
    """Chuyển đổi context string thành chat_history format cho Gemini."""
    chat_history = []
    if not context_string:
        return chat_history
    
    # Xử lý từng đoạn chat bằng cách tách theo patterns "user: " và "ai: "
    # Sử dụng regex để tìm vị trí chính xác của các prefix
    import re
    
    # Tìm tất cả vị trí bắt đầu của user hoặc ai messages
    pattern = r'^(user: |ai: )'
    lines = context_string.split('\n')
    
    current_message = ""
    current_role = None
    
    for line in lines:
        # Kiểm tra xem dòng này có bắt đầu bằng user: hoặc ai: không
        if line.startswith('user: '):
            # Lưu message trước đó nếu có (với filtering)
            if current_role and current_message.strip():
                cleaned_message = current_message.strip()
                if cleaned_message and cleaned_message not in ["No response", "no response", "", "..."]:
                    chat_history.append({
                        "role": current_role,
                        "parts": [cleaned_message]
                    })
            
            # Bắt đầu message mới của user
            current_role = "user"
            current_message = line[6:]  # Bỏ "user: "
            
        elif line.startswith('ai: '):
            # Lưu message trước đó nếu có (với filtering)
            if current_role and current_message.strip():
                cleaned_message = current_message.strip()
                if cleaned_message and cleaned_message not in ["No response", "no response", "", "..."]:
                    chat_history.append({
                        "role": current_role,
                        "parts": [cleaned_message]
                    })
            
            # Bắt đầu message mới của ai
            current_role = "model"  # Gemini sử dụng "model" thay vì "ai"
            current_message = line[4:]  # Bỏ "ai: "
            
        else:
            # Nếu không phải dòng bắt đầu mới, nối vào message hiện tại
            if current_role is not None:
                # Giữ nguyên các dòng trống và xuống dòng trong message
                if current_message:
                    current_message += "\n" + line
                else:
                    current_message = line
    
    # Lưu message cuối cùng (với filtering)
    if current_role and current_message.strip():
        cleaned_message = current_message.strip()
        if cleaned_message and cleaned_message not in ["No response", "no response", "", "..."]:
            chat_history.append({
                "role": current_role,
                "parts": [cleaned_message]
            })
    
    print(f"[DEBUG] Converted context to {len(chat_history)} chat messages")
    for i, msg in enumerate(chat_history):
        print(f"[DEBUG] Message {i+1} ({msg['role']}): {msg['parts'][0][:100]}...")
    
    return chat_history


@app.middleware("http")
async def add_process_time_header(request, call_next):
    """Middleware để đo thời gian xử lý request."""
    import time
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


@app.get("/", 
         summary="Welcome endpoint",
         description="Endpoint chào mừng và thông tin cơ bản về API")
def read_root():
    """Endpoint gốc với thông tin chào mừng."""
    return {
        "message": "Chào mừng đến với AI Lab Việt Multi-Agent System API",
        "version": "1.0.0",
        "documentation": "/docs",
        "health_check": "/health",
        "available_endpoints": {
            "interact": "/interact",
            "project_flow_test": "/test_project_flow",
            "system_status": "/status"
        }
    }


@app.get("/mission_agent", 
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


class AnalysisAgentRequest(BaseModel):
    chat_history: str = Field(..., description="Lịch sử chat")
    mission_detail: str = Field(..., description="Thông tin mission")
    user_reflection: str = Field("", description="Phản tư của người dùng")
    

@app.post("/analysis_agent", summary="Phân tích chat history", description="Gọi AnalysisAgent để phân tích chat history và trích xuất kỹ năng, prompt")
def analysis_agent_api(
    request: AnalysisAgentRequest,
    user_id: str = Header(..., description="ID của user")
):
    try:
        # Validate user_id
        user_id = validate_user_id(user_id)
        
        analysis_agent = dispatcher.analysis_agent
        result = analysis_agent.execute(request.dict())
        return {"status": "success", "analysis": result, "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class PortfolioAgentRequest(BaseModel):
    analysis: dict
    final_product: dict
    user_info: dict
    mission_info: dict

@app.post("/portfolio_agent", summary="Tạo portfolio card", description="Gọi PortfolioAgent để tạo portfolio card từ kết quả phân tích và sản phẩm cuối cùng")
def portfolio_agent_api(
    request: PortfolioAgentRequest,
    user_id: str = Header(..., description="ID của user")
):
    try:
        # Validate user_id
        user_id = validate_user_id(user_id)
        
        portfolio_agent = dispatcher.portfolio_agent
        result = portfolio_agent.execute(request.dict())
        if result.get("status") == "created":
            return {
                "status": "success",
                "card_id": result["card_id"],
                "card_data": result["card_data"],
                "storage_location": result["storage_location"],
                "user_id": user_id
            }
        else:
            return {
                "status": "error",
                "error_message": result.get("error_message", "Unknown error"),
                "fallback_data": result.get("fallback_data", request.dict()),
                "user_id": user_id
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/portfolio", summary="Lấy portfolio của user", description="Truy xuất tất cả completed projects của user từ database")
def get_portfolio(
    user_id: str = Header(..., description="ID của user")
):
    """
    Lấy portfolio của user từ database completed_projects.
    
    Args:
        user_id: ID của user từ header
        
    Returns:
        Dictionary chứa danh sách projects của user
    """
    try:
        # Validate user_id
        user_id = validate_user_id(user_id)
        
        portfolio_agent = dispatcher.portfolio_agent
        result = portfolio_agent.get_portfolio_by_user_id(user_id)
        
        if result.get("status") == "success":
            return {
                "status": "success",
                "user_id": user_id,
                "total_projects": result["total_projects"],
                "projects": result["projects"],
                "source": result.get("source", "supabase"),
                "message": result.get("message", f"Found {result['total_projects']} projects")
            }
        else:
            return {
                "status": "error",
                "user_id": user_id,
                "error_message": result.get("error_message", "Unknown error")
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# WebSocket endpoint cho InteractionAgent (project mode, realtime)
@app.websocket("/interaction_agent")
async def websocket_interact(websocket: WebSocket):
    await websocket.accept()
    mission_agent = dispatcher.mission_agent

    try:
        # Nhận init message ngay sau khi connect
        init_data = await websocket.receive_text()
        try:
            payload = json.loads(init_data)
            user_id = payload.get("user_id")
            session_id = payload.get("session_id")
            mission_id = payload.get("mission_id")
            message_type = payload.get("type")
        except json.JSONDecodeError:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Invalid JSON format. Vui lòng gửi JSON hợp lệ với user_id.",
                "status": "error"
            }))
            await websocket.close()
            return

        # Check init hợp lệ
        if message_type != "chat" or payload.get("message") != "init" or not user_id:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Init message không hợp lệ. Cần có {type:'chat', message:'init', user_id,...}",
                "status": "error"
            }))
            await websocket.close()
            return

        # Lưu state vào websocket
        websocket.user_id = user_id
        websocket.current_mission_id = mission_id
        websocket.session_id = session_id

        # --- SỬA ĐOẠN NÀY ---
        # Kiểm tra session_id đã tồn tại chưa và load lịch sử
        context_string = ""
        chat_history = []
        session_exists = False
        
        if supabase and session_id:
            resp = supabase.table("chat_history").select("session_id").eq("user_id", user_id).eq("session_id", session_id).execute()
            if resp.data and len(resp.data) > 0:
                session_exists = True
                # Load lịch sử chat đầy đủ
                context_string = await load_chat_history(user_id, mission_id, session_id)
                chat_history = convert_context_to_chat_history(context_string)
                print(f"[DEBUG] Loaded existing chat history: {len(chat_history)} messages")

        # Get mission info for progress calculation
        mission = {}
        if mission_id:
            mission_details = mission_agent.get_mission_details(mission_id)
            if "error" not in mission_details:
                mission = mission_details

        current_progress = get_current_progress(chat_history, mission)

        if session_exists:
            # Nếu đã có session, gửi kèm lịch sử chat đầy đủ (không có thông báo)
            await websocket.send_text(json.dumps({
                "type": "refresh",
                "user_id": user_id,
                "mission_id": mission_id,
                "session_id": session_id,
                "status": "connected",
                "chat_history": chat_history,
                "context_string": context_string,
                "current_progress": current_progress
            }))
        else:
            # Nếu chưa có session, tạo greeting message và lưu vào database
            greeting_message = f"Chào mừng user {user_id} đến với hệ thống đa tác tử của AI Lab Việt! Hãy bắt đầu cuộc trò chuyện."
            
            # Tạo context string với greeting message
            initial_context = build_context_string("", new_response=greeting_message)
            
            # Lưu greeting message vào database
            await save_chat_history(user_id, initial_context, mission_id, session_id)
            
            # Tạo chat history từ context string
            initial_chat_history = convert_context_to_chat_history(initial_context)
            
            await websocket.send_text(json.dumps({
                "type": "user_authenticated",
                "user_id": user_id,
                "mission_id": mission_id,
                "session_id": session_id,
                "message": greeting_message,
                "status": "connected",
                "chat_history": initial_chat_history,
                "context_string": initial_context,
                "current_progress": current_progress
            }))

        # Vòng lặp xử lý các message tiếp theo
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)

                # Lấy thông tin từ payload
                user_input = payload.get("user_input", "")
                mission_id = payload.get("mission_id") or websocket.current_mission_id
                session_id = payload.get("session_id") or websocket.session_id

                websocket.current_mission_id = mission_id

                if user_input.lower() == "refresh":
                    await save_chat_history(user_id, "", mission_id, session_id)
                    await websocket.send_text(json.dumps({
                        "type": "refresh_success",
                        "status": "success",
                        "message": "Chat history refreshed",
                        "user_id": user_id,
                        "mission_id": mission_id,
                        "session_id": session_id,
                        "chat_history": [],  # Gửi chat history rỗng
                        "context_string": "",  # Context string rỗng
                        "current_progress": {
                            "step": 0,
                            "step_name": "Ý tưởng",
                            "progress_percent": 0,
                            "phases": ["Ý tưởng", "Lập Kế hoạch", "Soạn thảo", "Hoàn thành"],
                            "total_phases": 4
                        }
                    }))
                    continue
                
                if mission_id:
                    mission = mission_agent.get_mission_details(mission_id)
                    if isinstance(mission, dict) and "error" not in mission:
                        mission_detail = mission.get("description") or str(mission)
                    elif isinstance(mission, str):
                        mission_detail = mission

                # 1. Load context cũ
                context_string = await load_chat_history(user_id, mission_id, session_id)
                print(f"[DEBUG] Loaded context: {context_string}")

                # 2. Nối thêm user_input
                context_string = build_context_string(context_string, new_message=user_input)
                print(f"[DEBUG] After adding user input: {context_string}")

                from agents.communication.interaction_agent import InteractionAgent
                interaction_agent = InteractionAgent(mission_detail=mission_detail)

                chat_history = convert_context_to_chat_history(context_string)

                mission = {}
                if mission_id:
                    mission_details = mission_agent.get_mission_details(mission_id)
                    if "error" not in mission_details:
                        mission = mission_details
                current_progress = get_current_progress(chat_history, mission)

                # 3. Gọi agent để lấy response
                response = interaction_agent.communicate(mission_detail, user_input, chat_history)
                print(f"[DEBUG] Agent response: {response}")

                # 4. Nối thêm assistant response
                context_string = build_context_string(context_string, new_response=response)
                print(f"[DEBUG] Final context before save: {context_string}")

                # 5. Lưu lại context mới (đã có cả user_input và assistant response)
                await save_chat_history(user_id, context_string, mission_id, session_id)

                await websocket.send_text(json.dumps({
                    "type": "response",
                    "status": "success",
                    "response": response,
                    "user_id": user_id,
                    "mission_id": mission_id,
                    "session_id": session_id,
                    "current_progress": current_progress
                }))

            except Exception as e:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "status": "error",
                    "message": str(e),
                    "user_id": getattr(websocket, 'user_id', 'unknown')
                }))

    except WebSocketDisconnect:
        print(f"[WebSocket] Client disconnected from /interaction_agent - user_id: {getattr(websocket, 'user_id', 'unknown')}")
    except Exception as e:
        print(f"[WebSocket] Error: {str(e)}")
        await websocket.close()

# Project orchestration endpoints
from pydantic import BaseModel

class StartProjectRequest(BaseModel):
    mission_id: str

@app.post("/api/start", summary="Bắt đầu một dự án mới", description="Khởi tạo session cho dự án mới và trả về system_prompt")
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

@app.post("/api/end", summary="Hoàn thành dự án", description="Kết thúc session và trả về kết quả đánh giá")
async def end_project_api(
    # payload: dict = Body(...),
    user_id: str = Header(..., description="ID của user"),
    session_id: str = Query(..., description="ID của session/project")
):
    try:
        # Validate user_id
        user_id = validate_user_id(user_id)
        
        # session_id = payload.get("session_id")
        session_id = session_id 
        # user_reflection = payload.get("user_reflection", "")
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
                import json
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
            # "user_reflection": user_reflection
        })
        
        # Lưu trực tiếp vào completed_projects table
        portfolio_saved = False
        if supabase and isinstance(analysis_result, dict):
            try:
                # Extract thông tin từ analysis result
                summary = analysis_result.get("summary", "Không có tóm tắt")
                skills = analysis_result.get("skills", [])
                featured_prompts = analysis_result.get("featured_prompts", [])
                
                # Chuẩn bị data để insert
                portfolio_data = {
                    "id": str(uuid.uuid4()),  # Tạo ID mới cho portfolio
                    "user_id": user_id,
                    "final_product": summary,  # summary → final_product
                    "key_prompts": featured_prompts,  # featured_prompts → key_prompts
                    "skills_applied": skills,  # skills → skills_applied
                    "total_messages": len(chat_history_list),  # Số lượng messages
                    "created_at": datetime.now().isoformat(),
                    "completed_at": datetime.now().isoformat(),
                    "mission_id": mission_id,
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
        
        # Cập nhật trạng thái project
        try:
            if supabase:
                supabase.table("projects").update({
                    "status": "completed", 
                    "completed_at": datetime.now().isoformat()
                }).eq("id", session_id).eq("user_id", user_id).execute()
                print(f"✅ Project {session_id} marked as completed")
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
            "analysis": analysis_data,
            "portfolio": {
                "saved_to_database": portfolio_saved,
                "portfolio_agent_result": portfolio_result,
                "data_saved": {
                    "final_product": analysis_result.get("summary", "N/A"),
                    "skills_applied": analysis_result.get("skills", []),
                    "key_prompts": analysis_result.get("featured_prompts", [])
                } if isinstance(analysis_result, dict) else {}
            },
            "message": f"Project completed. Portfolio {'saved to completed_projects table' if portfolio_saved else 'processed via PortfolioAgent'} with {len(analysis_result.get('featured_prompts', []))} featured prompts"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/missions", 
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


@app.get("/missions/category", summary="Danh sách nhiệm vụ theo category", description="Lọc danh sách missions theo category", response_model=MissionsListResponse)
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
        
@app.get("/missions/featured", summary="Danh sách nhiệm vụ nổi bật", description="Lọc danh sách missions theo trường featured true/false", response_model=MissionsListResponse)
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

@app.get("/api/history", summary="Xem lịch sử chat theo session_id")
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
        
        # Chuyển đổi context string thành danh sách messages với xử lý đúng các message nhiều dòng
        messages = []
        if chat_history:
            current_message = ""
            current_sender = None
            
            lines = chat_history.split('\n')
            for line in lines:
                if line.startswith('user: '):
                    # Lưu message trước đó nếu có
                    if current_sender and current_message.strip():
                        # Filter out empty or placeholder messages
                        cleaned_message = current_message.strip()
                        if cleaned_message and cleaned_message not in ["No response", "no response", "", "..."]:
                            messages.append({"sender": current_sender, "message": cleaned_message})
                    
                    # Bắt đầu message mới của user
                    current_sender = "user"
                    current_message = line[6:]  # Bỏ "user: "
                    
                elif line.startswith('ai: '):
                    # Lưu message trước đó nếu có
                    if current_sender and current_message.strip():
                        # Filter out empty or placeholder messages
                        cleaned_message = current_message.strip()
                        if cleaned_message and cleaned_message not in ["No response", "no response", "", "..."]:
                            messages.append({"sender": current_sender, "message": cleaned_message})
                    
                    # Bắt đầu message mới của ai
                    current_sender = "ai"
                    current_message = line[4:]  # Bỏ "ai: "
                    
                else:
                    # Nếu không phải dòng bắt đầu mới, nối vào message hiện tại
                    if current_sender is not None:
                        if current_message:
                            current_message += "\n" + line
                        else:
                            current_message = line
            
            # Lưu message cuối cùng với filtering
            if current_sender and current_message.strip():
                cleaned_message = current_message.strip()
                if cleaned_message and cleaned_message not in ["No response", "no response", "", "..."]:
                    messages.append({"sender": current_sender, "message": cleaned_message})
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
    
@app.delete("/api/delete-history/{session_id}", summary="Xoá lịch sử chat theo session_id")
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
    
@app.get("/health",
         response_model=SystemHealth,
         summary="Health check endpoint",
         description="Kiểm tra trạng thái sức khỏe của hệ thống")
def health_check():
    """
    Health check endpoint để monitor trạng thái hệ thống.
    """
    try:
        # Lấy system status từ dispatcher
        system_status = dispatcher.get_system_status()
        
        # Tính uptime
        uptime = datetime.now() - app_stats["start_time"]
        uptime_seconds = int(uptime.total_seconds())
        
        # Tạo agent status list
        agent_statuses = []
        
        # Thêm orchestration agents
        for agent_name, status in system_status["orchestration_agents"].items():
            agent_statuses.append({
                "agent_name": f"{agent_name.title()}Agent",
                "status": status["status"] if isinstance(status, dict) else status,
                "last_activity": datetime.now().isoformat(),
                "tasks_completed": 0,
                "current_task": None
            })
        
        # Thêm execution agents  
        for agent_name, status in system_status["execution_agents"].items():
            agent_statuses.append({
                "agent_name": f"{agent_name.title()}Agent",
                "status": status["status"] if isinstance(status, dict) else status,
                "last_activity": datetime.now().isoformat(),
                "tasks_completed": 0,
                "current_task": None
            })
        
        # Thêm communication agents
        for agent_name, status in system_status["communication_agents"].items():
            agent_statuses.append({
                "agent_name": f"{agent_name.title()}Agent", 
                "status": status["status"] if isinstance(status, dict) else status,
                "last_activity": datetime.now().isoformat(),
                "tasks_completed": 0,
                "current_task": None
            })
        
        health = SystemHealth(
            status="healthy",
            timestamp=datetime.now().isoformat(),
            agents=agent_statuses,
            version="1.0.0",
            uptime_seconds=uptime_seconds
        )
        
        return health
        
    except Exception as e:
        print(f"[FastAPI] Health check failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service temporarily unavailable"
        )


@app.get("/status",
         summary="System status endpoint",
         description="Thông tin chi tiết về trạng thái và thống kê hệ thống")
def get_system_status():
    """
    Endpoint để lấy thông tin chi tiết về hệ thống.
    """
    uptime = datetime.now() - app_stats["start_time"]
    
    return {
        "system_info": {
            "status": "running",
            "version": "1.0.0",
            "start_time": app_stats["start_time"].isoformat(),
            "uptime_seconds": int(uptime.total_seconds()),
            "uptime_human": str(uptime)
        },
        "statistics": {
            "total_requests": app_stats["total_requests"],
            "successful_requests": app_stats["successful_requests"],
            "failed_requests": app_stats["failed_requests"],
            "success_rate": (app_stats["successful_requests"] / max(app_stats["total_requests"], 1)) * 100
        },
        "agents": dispatcher.get_system_status()
    }



@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    """Custom exception handler cho ValueError."""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=ErrorResponse(
            error_code="INVALID_INPUT",
            error_message=str(exc),
            timestamp=datetime.now().isoformat()
        ).dict()
    )


@app.exception_handler(500)
async def internal_server_error_handler(request, exc):
    """Custom exception handler cho internal server errors."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error_code="INTERNAL_ERROR",
            error_message="Đã có lỗi nội bộ xảy ra",
            details={"exception": str(exc)},
            timestamp=datetime.now().isoformat()
        ).dict()
    )


if __name__ == "__main__":
    print("🚀 Starting AI Lab Việt Multi-Agent System API...")
    print("📚 Documentation will be available at: http://localhost:8000/docs")
    print("🔍 Health check available at: http://localhost:8000/health")
    print("📊 System status available at: http://localhost:8000/status")
    
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    )
