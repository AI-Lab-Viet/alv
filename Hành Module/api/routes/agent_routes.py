"""
Routes for agent-related endpoints
"""
import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Header, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any
import asyncio
from api.config import dispatcher, supabase
from api.dependencies import validate_user_id
from utils.chat_utils import (
    load_chat_history, 
    save_chat_history, 
    build_context_string,
    get_current_progress,
    convert_context_to_chat_history
)

router = APIRouter()

async def check_or_create_session(user_id: str, session_id: str, mission_id: str, mission_agent):
    """
    Improved session check logic với atomic create để tránh race condition.
    
    Returns:
        dict: Session info with chat_history, context_string, etc.
    """
    print(f"[DEBUG] Checking session: user_id={user_id}, session_id={session_id}")
    
    try:
        # 1. Check if session exists
        if supabase and session_id:
            resp = supabase.table("chat_history")\
                .select("*")\
                .eq("user_id", user_id)\
                .eq("session_id", session_id)\
                .limit(1)\
                .execute()
            
            if resp.data and len(resp.data) > 0:
                # Session exists → load full history
                print(f"[DEBUG] Session exists, loading history...")
                context_string = await load_chat_history(user_id, mission_id, session_id)
                chat_history = convert_context_to_chat_history(context_string)
                
                # Get mission info for progress
                mission = {}
                if mission_id:
                    mission_details = mission_agent.get_mission_details(mission_id)
                    if "error" not in mission_details:
                        mission = mission_details
                
                current_progress = get_current_progress(chat_history, mission)
                
                return {
                    "session_exists": True,
                    "chat_history": chat_history,
                    "context_string": context_string,
                    "current_progress": current_progress
                }
        
        # 2. Session doesn't exist → create new session with greeting
        print(f"[DEBUG] New session, creating greeting...")
        
        # Get mission info first
        mission = {}
        if mission_id:
            mission_details = mission_agent.get_mission_details(mission_id)
            if "error" not in mission_details:
                mission = mission_details
        
        greeting_message = f"Chào bạn! Minh là ALVA, AI Mentor của bạn đây. Rất vui được đồng hành cùng bạn trong nhiệm vụ đầy thú thách: {mission.get('title', '')}. Đây là một chủ đề rất hay! Để có một khởi đầu thuận lợi, chúng ta có thể bắt đầu bằng việc lập một dàn ý chi tiết. Bạn thấy sao?"
        
        # Create initial context
        initial_context = build_context_string("", new_response=greeting_message)
        
        # Try to save greeting atomically
        try:
            await save_chat_history(user_id, initial_context, mission_id, session_id)
            print(f"[DEBUG] Successfully saved greeting message")
        except Exception as save_error:
            print(f"[DEBUG] Error saving greeting (possible race condition): {str(save_error)}")
            # Fallback: try to load existing history if someone else created it
            try:
                context_string = await load_chat_history(user_id, mission_id, session_id)
                if context_string:
                    chat_history = convert_context_to_chat_history(context_string)
                    current_progress = get_current_progress(chat_history, mission)
                    return {
                        "session_exists": True,
                        "chat_history": chat_history,
                        "context_string": context_string,
                        "current_progress": current_progress,
                        "note": "Race condition handled"
                    }
            except:
                pass
        
        # Create chat history from initial context
        initial_chat_history = convert_context_to_chat_history(initial_context)
        current_progress = get_current_progress(initial_chat_history, mission)
        
        return {
            "session_exists": False,
            "chat_history": initial_chat_history,
            "context_string": initial_context,
            "current_progress": current_progress,
            "greeting_message": greeting_message,
            "prompt_starters": mission.get("prompt_starters", [])
        }
        
    except Exception as e:
        print(f"[ERROR] Error in check_or_create_session: {str(e)}")
        # Fallback to basic new session
        return {
            "session_exists": False,
            "chat_history": [],
            "context_string": "",
            "current_progress": {
                "step": 0,
                "step_name": "Ý tưởng",
                "progress_percent": 0,
                "phases": ["Ý tưởng", "Lập Kế hoạch", "Soạn thảo", "Hoàn thành"],
                "total_phases": 4
            },
            "greeting_message": "Chào bạn! Minh là ALVA, sẵn sàng hỗ trợ bạn!",
            "prompt_starters": []
        }

class AnalysisAgentRequest(BaseModel):
    chat_history: str = Field(..., description="Lịch sử chat")
    mission_detail: str = Field(..., description="Thông tin mission")
    user_reflection: str = Field("", description="Phản tư của người dùng")

class PortfolioAgentRequest(BaseModel):
    analysis: dict
    final_product: dict
    user_info: dict
    mission_info: dict

@router.post("/analysis_agent", summary="Phân tích chat history", description="Gọi AnalysisAgent để phân tích chat history và trích xuất kỹ năng, prompt")
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

@router.post("/portfolio_agent", summary="Tạo portfolio card", description="Gọi PortfolioAgent để tạo portfolio card từ kết quả phân tích và sản phẩm cuối cùng")
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

# WebSocket endpoint cho InteractionAgent (project mode, realtime)
@router.websocket("/interaction_agent")
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

        # Improved session check and greeting logic
        session_result = await check_or_create_session(user_id, session_id, mission_id, mission_agent)
        
        if session_result["session_exists"]:
            # Session exists → load existing history
            print(f"[DEBUG] Session exists: loaded {len(session_result['chat_history'])} messages")
            await websocket.send_text(json.dumps({
                "type": "refresh",
                "user_id": user_id,
                "mission_id": mission_id,
                "session_id": session_id,
                "status": "connected",
                "chat_history": session_result["chat_history"],
                "context_string": session_result["context_string"],
                "current_progress": session_result["current_progress"]
            }))
        else:
            # New session → send greeting
            print(f"[DEBUG] New session: sending greeting message")
            await websocket.send_text(json.dumps({
                "type": "user_authenticated",
                "user_id": user_id,
                "mission_id": mission_id,
                "session_id": session_id,
                "message": session_result["greeting_message"],
                "status": "connected",
                "chat_history": session_result["chat_history"],
                "context_string": session_result["context_string"],
                "current_progress": session_result["current_progress"]
            }))
            
            # Send prompt starters for new sessions
            if "prompt_starters" in session_result:
                await websocket.send_text(json.dumps({
                    "type": "prompt_starters",
                    "prompts": session_result["prompt_starters"],
                    "mission_id": mission_id,
                    "session_id": session_id
                }))
        
        websocket.script_index = 0

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
                # Kịch bản cố định cho user_id và mission_id đặc biệt
                if str(user_id) == "ee451465-8419-4e16-8d1b-15c18c930523" and str(mission_id) == "9":
                    # Kịch bản mẫu: mapping user_input -> response
                    print(f"[DEBUG] Special script mode activated for user_id {user_id} and mission_id {mission_id}")
                    script = [
                        {
                            "ai": "Chào Minh, chắc chắn rồi! Dưới đây là dàn ý gợi ý với 3 luận điểm chính: Dưới đây là một dàn ý gợi ý gồm 3 luận điểm chính:\n\n1. **AI là Động lực Tạo ra Việc làm Mới.**\n2. **AI là Thách thức Chuyển đổi Lao động.**\n3. **Định hướng Tương lai & Vai trò của Con người.**\n\nChúng ta bắt đầu với luận điểm đầu tiên nhé?",
                            "current_progress": "Phân rã một chủ đề phức tạp thành một dàn ý có cấu trúc."
                        },
                        {
                            "ai": "Tuyệt vời, một yêu cầu rất rõ ràng. Với vai trò là một nhà kinh tế học, tôi xin trình bày:\n\n\"Trái với lo ngại ban đầu, AI đang là động lực kiến tạo việc làm mới. Tại Việt Nam, nhu cầu cho các vị trí như Kỹ sư Prompt hay chuyên gia AI đang tăng cao. Theo báo cáo năm 2024 của 'Viện Nghiên cứu Kinh tế Việt Nam', AI đã tạo ra hơn 50,000 việc làm trong lĩnh vực này.\""
                        },
                        {
                            "ai": "Cảm ơn Minh đã chỉ ra. Bạn đã áp dụng kỹ năng Nhận định rất tốt! Tôi đã cập nhật lại đoạn văn:\n\n\"Trái với lo ngại ban đầu, AI đang là động lực kiến tạo việc làm mới. Tại Việt Nam, sự phát triển của các ngành công nghiệp số đã chứng kiến sự gia tăng đáng kể nhu cầu cho các vị trí như Kỹ sư Prompt và chuyên gia phân tích dữ liệu.\"",
                            "current_progress": "Phát hiện và sửa lỗi 'ảo giác' trong nội dung do AI tạo ra."
                        },
                        {
                            "ai": "Một góp ý rất sâu sắc. Dưới đây là câu kết luận được bổ sung:\n\n\"Tóm lại, dù AI đặt ra những thách thức, chìa khóa thành công là chủ động học hỏi và rèn luyện kỹ năng hợp tác sáng tạo.\""
                        },
                        {
                            "ai": "Một bản thảo cuối cùng xuất sắc, Minh. Lời mở đầu và kết luận bạn viết đã thực sự thêm chiều sâu vào bài thuyết trình. Dòng chảy rất mạch lạc và thuyết phục. Bạn đã thể hiện hoàn hảo vai trò của một 'Nhà Kiến tạo'!",
                            "current_progress": "Tổng hợp các nguyên liệu từ AI thành một sản phẩm hoàn chỉnh mang dấu ấn cá nhân."
                        }
                    ]
                    
                    # FIX: Build context như chat bình thường TRƯỚC KHI gửi response
                    # 1. Load context cũ
                    context_string = await load_chat_history(user_id, mission_id, session_id)
                    print(f"[DEBUG] Script mode - Loaded context: {len(context_string)} chars")

                    # 2. Nối thêm user_input
                    context_string = build_context_string(context_string, new_message=user_input)
                    print(f"[DEBUG] Script mode - After adding user input: {len(context_string)} chars")
                    
                    # 3. Lấy response từ script
                    matched = None
                    current_progress = "Script mode progress"
                    
                    if websocket.script_index < len(script):
                        turn = script[websocket.script_index]
                        websocket.script_index += 1
                        matched = turn["ai"]
                        if "current_progress" in turn:
                            current_progress = turn["current_progress"]
                        
                        # 4. Nối thêm assistant response
                        context_string = build_context_string(context_string, new_response=matched)
                        print(f"[DEBUG] Script mode - Final context before save: {len(context_string)} chars")
                        
                        # 5. Lưu lại context mới (đã có cả user_input và assistant response)
                        await save_chat_history(user_id, context_string, mission_id, session_id)
                        print(f"[DEBUG] Script mode - Chat history saved successfully")
                        
                        # 6. Gửi response với delay
                        await asyncio.sleep(4)
                        await websocket.send_text(json.dumps({
                            "type": "chat",
                            "status": "success",
                            "response": matched,
                            "user_id": user_id,
                            "mission_id": mission_id,
                            "session_id": session_id,
                            "current_progress": current_progress
                        }))
                        continue
                    else:
                        # Hết script, chuyển sang mode bình thường
                        print(f"[DEBUG] Script completed, switching to normal mode")
                        # Không continue, để code chạy xuống phần xử lý bình thường

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
                    "type": "chat",
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
