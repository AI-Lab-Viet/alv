# main.py
"""
FastAPI application chính cho AI Lab Việt Multi-Agent System.
Cung cấp RESTful API endpoints để tương tác với hệ thống đa tác tử.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import uvicorn
from typing import Dict, Any

from models.schemas import (
    InteractionRequest, 
    InteractionResponse, 
    SystemHealth,
    ErrorResponse,
    LearningRequest,
    ProjectRequest,
    SessionContext
)
from core.dispatcher import SmartDispatcher


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

# Biến global để theo dõi thống kê
app_stats = {
    "start_time": datetime.now(),
    "total_requests": 0,
    "successful_requests": 0,
    "failed_requests": 0
}


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
            "learning": "/learning",
            "project": "/project",
            "system_status": "/status"
        }
    }


@app.post("/interact", 
          response_model=InteractionResponse,
          summary="Tương tác chính với hệ thống",
          description="Endpoint chính để người dùng tương tác với hệ thống đa tác tử")
async def interact(request: InteractionRequest):
    """
    Endpoint chính để người dùng tương tác với hệ thống.
    
    Hệ thống sẽ:
    1. Phân tích request và session context
    2. Định tuyến đến orchestration agent phù hợp
    3. Thực thi action plan thông qua execution agents
    4. Trả về response với kết quả xử lý
    """
    global app_stats
    app_stats["total_requests"] += 1
    
    try:
        print(f"\n{'='*50}")
        print(f"[FastAPI] New interaction request received")
        print(f"[FastAPI] User input: {request.user_input}")
        print(f"[FastAPI] Session context: {request.session_context}")
        
        # Validate session context
        if "mode" not in request.session_context:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Session context phải chứa 'mode' (learning hoặc project)"
            )
        
        # Gọi SmartDispatcher để xử lý
        result = dispatcher.dispatch(request.user_input, request.session_context)
        
        if result.get("status") == "error":
            app_stats["failed_requests"] += 1
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error_details", "Internal server error")
            )
        
        app_stats["successful_requests"] += 1
        
        # Tạo response
        response = InteractionResponse(
            agent_name=result["agent_name"],
            action=result["action"],
            response_message=result["response_message"]
        )
        
        print(f"[FastAPI] Successfully processed request")
        print(f"[FastAPI] Response: {response.response_message}")
        print(f"{'='*50}\n")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        app_stats["failed_requests"] += 1
        print(f"[FastAPI] Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã có lỗi không mong muốn xảy ra: {str(e)}"
        )


@app.post("/learning",
          summary="Endpoint đặc biệt cho learning mode",
          description="Endpoint tối ưu hóa cho các request học tập")
async def learning_interaction(request: LearningRequest):
    """
    Endpoint đặc biệt cho learning mode.
    Tự động tạo session context phù hợp cho học tập.
    """
    # Tạo session context cho learning mode
    session_context = {
        "mode": "learning",
        "topic": request.topic,
        "difficulty_level": request.difficulty_level.value,
        "learning_goals": request.learning_goals,
        "time_budget_minutes": request.time_budget_minutes,
        "user_id": "learning_user"  # Placeholder user ID
    }
    
    # Tạo InteractionRequest và gọi interact endpoint
    interaction_request = InteractionRequest(
        user_input=f"Tôi muốn học về {request.topic} ở mức {request.difficulty_level.value}",
        session_context=session_context
    )
    
    return await interact(interaction_request)


@app.post("/project",
          summary="Endpoint đặc biệt cho project mode", 
          description="Endpoint tối ưu hóa cho các request dự án")
async def project_interaction(request: ProjectRequest):
    """
    Endpoint đặc biệt cho project mode.
    Tự động tạo session context phù hợp cho quản lý dự án.
    """
    # Tạo session context cho project mode
    session_context = {
        "mode": "project",
        "project_name": request.project_name,
        "project_description": request.project_description,
        "team_size": request.team_size,
        "duration_weeks": request.duration_weeks,
        "required_skills": request.required_skills,
        "user_id": "project_user"  # Placeholder user ID
    }
    
    # Tạo InteractionRequest và gọi interact endpoint
    interaction_request = InteractionRequest(
        user_input=f"Tôi muốn bắt đầu dự án: {request.project_name}",
        session_context=session_context
    )
    
    return await interact(interaction_request)


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
                "status": status,
                "last_activity": datetime.now().isoformat(),
                "tasks_completed": 0,
                "current_task": None
            })
        
        # Thêm execution agents  
        for agent_name, status in system_status["execution_agents"].items():
            agent_statuses.append({
                "agent_name": f"{agent_name.title()}Agent",
                "status": status,
                "last_activity": datetime.now().isoformat(),
                "tasks_completed": 0,
                "current_task": None
            })
        
        # Thêm communication agents
        for agent_name, status in system_status["communication_agents"].items():
            agent_statuses.append({
                "agent_name": f"{agent_name.title()}Agent", 
                "status": status,
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


@app.post("/test_tutor_flow", 
          response_model=InteractionResponse,
          summary="Test ALVA Tutor Flow",
          description="Endpoint để kiểm thử luồng Tutor ALVA với AI thực tế")
async def test_tutor_flow(request: Dict[str, str]):
    """
    Endpoint để kiểm thử luồng Tutor ALVA một cách nhanh chóng.
    
    Tạo session context giả lập và test toàn bộ luồng:
    User Input -> TutorAgent -> InteractionAgent -> Gemini AI -> Response
    """
    global app_stats
    app_stats["total_requests"] += 1
    
    try:
        user_input = request.get("user_input", "Chào ALVA, tôi muốn học về Delegation")
        
        print(f"\n🧪 [TEST_TUTOR_FLOW] Testing ALVA interaction")
        print(f"👤 User input: {user_input}")
        
        # Tạo session_context giả lập với dữ liệu phong phú
        session_context = {
            "mode": "learning",
            "user_id": "test_user_alva_demo",
            "user_level": "Trung bình",
            "learning_style": "Tương tác",
            "current_lesson": "Bài 2: Nghệ thuật Ủy thác (Delegation)",
            "lesson_progress": 25,  # 25% completed
            "session_id": "demo_session_001",
            "timestamp": datetime.now().isoformat(),
            "previous_topics": ["Giới thiệu Leadership", "Tự quản lý thời gian"],
            "chat_history": [
                {
                    "role": "user", 
                    "parts": ["Chào ALVA"]
                },
                {
                    "role": "model", 
                    "parts": ["Chào bạn! Tôi là ALVA, gia sư AI của AI Lab Việt. Hôm nay chúng ta sẽ cùng học về Nghệ thuật Ủy thác (Delegation). Đây là một kỹ năng rất quan trọng trong lãnh đạo. Bạn có câu hỏi nào về chủ đề này không? 🎓"]
                }
            ]
        }
        
        print(f"📚 Lesson: {session_context['current_lesson']}")
        print(f"👨‍🎓 User level: {session_context['user_level']}")
        
        # Gọi SmartDispatcher để xử lý
        result = dispatcher.dispatch(user_input, session_context)
        
        if result.get("status") == "error":
            app_stats["failed_requests"] += 1
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error_details", "Internal server error")
            )
        
        app_stats["successful_requests"] += 1
        
        # Tạo response với thông tin bổ sung cho test
        response = InteractionResponse(
            agent_name=result["agent_name"],
            action=result["action"],
            response_message=result["response_message"]
        )
        
        print(f"✅ [TEST_TUTOR_FLOW] Test completed successfully")
        print(f"🤖 AI Provider: {result['action'].get('ai_provider', 'unknown')}")
        print(f"📝 Response preview: {result['response_message'][:100]}...")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        app_stats["failed_requests"] += 1
        print(f"❌ [TEST_TUTOR_FLOW] Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi test ALVA flow: {str(e)}"
        )


@app.get("/test_ai_connection",
         summary="Test AI Connection",
         description="Kiểm tra kết nối với Gemini AI")
def test_ai_connection():
    """
    Endpoint để test kết nối AI và trả về thông tin chi tiết.
    """
    try:
        result = dispatcher.test_ai_connection()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error testing AI connection: {str(e)}"
        )


@app.post("/test_project_flow",
          summary="Test Complete Project Flow",
          description="Test toàn bộ luồng HÀNH -> CHỨNG MINH")
async def test_project_flow():
    """
    Endpoint để kiểm thử toàn bộ luồng HÀNH -> CHỨNG MINH.
    
    Mô phỏng hành trình hoàn chỉnh:
    1. Bắt đầu dự án với mission cụ thể
    2. Mô phỏng quá trình làm việc với chat history
    3. Hoàn thành dự án và tạo portfolio card
    """
    global app_stats
    app_stats["total_requests"] += 1
    
    try:
        print(f"\n🎯 [PROJECT_FLOW] Testing complete HÀNH -> CHỨNG MINH flow")
        
        # === PHASE 1: BẮT ĐẦU DỰ ÁN ===
        print(f"🚀 Phase 1: Starting project...")
        
        start_context = {
            "mode": "project",
            "sub_task": "start_project",
            "user_id": "demo_student",
            "user_name": "Nguyễn Văn A",
            "mission_id": "mission_01"
        }
        
        start_response = dispatcher.dispatch("Bắt đầu dự án nào!", start_context)
        print(f"✅ Project started: {start_response.get('status', 'unknown')}")
        
        # === PHASE 2: MÔ PHỎNG QUÁ TRÌNH LÀM VIỆC ===
        print(f"💬 Phase 2: Simulating project work...")
        
        # Mô phỏng một vài round conversation trong quá trình làm dự án
        work_context = {
            "mode": "project", 
            "sub_task": "continue_session",
            "user_id": "demo_student",
            "mission_id": "mission_01",
            "mission_title": "Chiến dịch truyền thông cho CLB Sách",
            "chat_history": [
                {"role": "user", "parts": ["Bắt đầu dự án nào!"]},
                {"role": "model", "parts": ["Chào bạn! Chúng ta sẽ cùng thực hiện dự án Chiến dịch truyền thông cho CLB Sách..."]},
                {"role": "user", "parts": ["Hãy brainstorm cho tôi 3 slogan thu hút học sinh tham gia CLB Sách"]},
                {"role": "model", "parts": ["Tuyệt vời! Đây là 3 slogan sáng tạo: 1. 'Mở Sách - Mở Tư Duy - Mở Tương Lai', 2. 'Đọc Để Khám Phá, Chia Sẻ Để Phát Triển', 3. 'CLB Sách - Nơi Tri Thức Gặp Gỡ Đam Mê'"]},
                {"role": "user", "parts": ["Dựa vào slogan thứ nhất, hãy giúp tôi lập kế hoạch truyền thông 3 tháng chi tiết"]},
                {"role": "model", "parts": ["Chắc chắn rồi! Kế hoạch 3 tháng cho slogan 'Mở Sách - Mở Tư Duy - Mở Tương Lai' sẽ bao gồm: THÁNG 1: Giai đoạn Nhận thức..."]}
            ]
        }
        
        work_response = dispatcher.dispatch(
            "Bây giờ tôi cần tạo timeline cụ thể cho từng hoạt động", 
            work_context
        )
        print(f"✅ Work session: {work_response.get('status', 'unknown')}")
        
        # === PHASE 3: HOÀN THÀNH DỰ ÁN VÀ TẠO PORTFOLIO ===
        print(f"🎯 Phase 3: Completing project and creating portfolio...")
        
        complete_context = {
            "mode": "project",
            "sub_task": "complete_project", 
            "user_id": "demo_student",
            "user_name": "Nguyễn Văn A",
            "mission_id": "mission_01",
            "final_product": """
            KẾ HOẠCH TRUYỀN THÔNG CHO CLB SÁCH
            
            SLOGAN: "Mở Sách - Mở Tư Duy - Mở Tương Lai"
            
            THÁNG 1 - GIAI ĐOẠN NHẬN THỨC:
            - Tuần 1-2: Thiết kế poster và banner với slogan chính
            - Tuần 3-4: Tung poster tại khu vực sinh viên, thư viện, căng tin
            
            THÁNG 2 - GIAI ĐOẠN TƯƠNG TÁC:
            - Tuần 1: Tổ chức book talk với tác giả nổi tiếng
            - Tuần 2-3: Chạy contest "Review sách hay" trên social media
            - Tuần 4: Workshop "Kỹ năng đọc hiệu quả"
            
            THÁNG 3 - GIAI ĐOẠN CHUYỂN ĐỔI:
            - Tuần 1-2: Mở đăng ký thành viên chính thức
            - Tuần 3: Event ra mắt CLB với mini book fair
            - Tuần 4: Kick-off meeting đầu tiên với thành viên mới
            
            BUDGET ƯỚC TÍNH: 5,000,000 VNĐ
            TARGET: 50 thành viên mới trong 3 tháng
            """,
            "chat_history": work_context["chat_history"] + [
                {"role": "user", "parts": ["Bây giờ tôi cần tạo timeline cụ thể cho từng hoạt động"]},
                {"role": "model", "parts": ["Tuyệt vời! Để tạo timeline chi tiết, chúng ta sẽ chia thành 3 giai đoạn..."]}
            ]
        }
        
        complete_response = dispatcher.dispatch("Tôi đã hoàn thành kế hoạch!", complete_context)
        
        app_stats["successful_requests"] += 1
        
        print(f"✅ [PROJECT_FLOW] Complete flow test finished!")
        print(f"🎉 Portfolio card created: {complete_response.get('final_portfolio_card', {}).get('status', 'unknown')}")
        
        # Tạo summary response
        flow_summary = {
            "flow_test_status": "success",
            "phases_completed": [
                {"phase": "start_project", "status": start_response.get("status", "unknown")},
                {"phase": "work_session", "status": work_response.get("status", "unknown")}, 
                {"phase": "complete_project", "status": complete_response.get("status", "unknown")}
            ],
            "final_portfolio": complete_response.get("final_portfolio_card", {}),
            "analysis_summary": complete_response.get("analysis_summary", {}),
            "mission_completed": "Chiến dịch truyền thông cho CLB Sách",
            "demo_user": "Nguyễn Văn A"
        }
        
        return flow_summary
        
    except HTTPException:
        raise
    except Exception as e:
        app_stats["failed_requests"] += 1
        print(f"❌ [PROJECT_FLOW] Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi trong project flow test: {str(e)}"
        )


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
