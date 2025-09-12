# demo_project_flow.py
"""
Demo script để test luồng Project Flow hoàn chỉnh: HÀNH -> CHỨNG MINH
Mô phỏng toàn bộ hành trình từ bắt đầu dự án đến tạo portfolio card.
"""

import json
import os
from dotenv import load_dotenv
from core.dispatcher import SmartDispatcher

# Load environment variables
load_dotenv()


def check_environment():
    """Kiểm tra môi trường setup."""
    print("🔍 Checking environment setup...")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "YOUR_API_KEY_HERE":
        print("⚠️  WARNING: GEMINI_API_KEY not configured properly!")
        print("   The system will run in MOCK MODE for demonstration")
        return False
    else:
        print("✅ GEMINI_API_KEY found and configured")
        return True


def demo_complete_project_flow():
    """Demo luồng project hoàn chỉnh: HÀNH -> CHỨNG MINH."""
    print("\n" + "="*80)
    print("🎯 DEMO: COMPLETE PROJECT FLOW - HÀNH -> CHỨNG MINH")
    print("="*80)
    print("Mô phỏng hành trình hoàn chỉnh của một học viên:")
    print("1. 🚀 Bắt đầu dự án")
    print("2. 💬 Quá trình làm việc và tương tác")
    print("3. 🎯 Hoàn thành và tạo portfolio")
    print("="*80)
    
    try:
        # Khởi tạo dispatcher
        print("🚀 Initializing AI Lab Việt Project System...")
        dispatcher = SmartDispatcher()
        
        # === PHASE 1: BẮT ĐẦU DỰ ÁN ===
        print(f"\n{'🚀 PHASE 1: BẮT ĐẦU DỰ ÁN':=^70}")
        print("👤 Học viên: Nguyễn Văn A")
        print("🎯 Mission: Chiến dịch truyền thông cho CLB Sách")
        
        start_context = {
            "mode": "project",
            "sub_task": "start_project",
            "user_id": "demo_student_001",
            "user_name": "Nguyễn Văn A",
            "mission_id": "mission_01"
        }
        
        start_response = dispatcher.dispatch("Chào ALVA! Tôi sẵn sàng bắt đầu dự án!", start_context)
        
        print(f"✅ Status: {start_response.get('status', 'unknown')}")
        print(f"🤖 ALVA Response:")
        print(f"   {start_response.get('response_message', 'No response')[:200]}...")
        
        if start_response.get('mission_info'):
            mission = start_response['mission_info']
            print(f"📋 Mission Details:")
            print(f"   - Title: {mission.get('title', 'N/A')}")
            print(f"   - Category: {mission.get('category', 'N/A')}")
            print(f"   - Difficulty: {mission.get('difficulty', 'N/A')}")
            print(f"   - Estimated: {mission.get('estimated_hours', 'N/A')} hours")
        
        # === PHASE 2: QUÁ TRÌNH LÀM VIỆC ===
        print(f"\n{'💬 PHASE 2: QUÁ TRÌNH LÀM VIỆC':=^70}")
        
        # Mô phỏng chat history trong quá trình làm dự án
        chat_history = [
            {"role": "user", "parts": ["Chào ALVA! Tôi sẵn sàng bắt đầu dự án!"]},
            {"role": "model", "parts": ["Chào bạn! Chúng ta sẽ cùng thực hiện dự án Chiến dịch truyền thông cho CLB Sách. Đây là một dự án thú vị!"]},
            
            {"role": "user", "parts": ["Hãy brainstorm cho tôi 3 slogan thu hút học sinh tham gia CLB Sách"]},
            {"role": "model", "parts": ["Tuyệt vời! Đây là 3 slogan sáng tạo:\n1. 'Mở Sách - Mở Tư Duy - Mở Tương Lai'\n2. 'Đọc Để Khám Phá, Chia Sẻ Để Phát Triển'\n3. 'CLB Sách - Nơi Tri Thức Gặp Gỡ Đam Mê'"]},
            
            {"role": "user", "parts": ["Tôi thích slogan số 1! Dựa vào đó, hãy giúp tôi lập kế hoạch truyền thông 3 tháng chi tiết"]},
            {"role": "model", "parts": ["Chắc chắn rồi! Kế hoạch 3 tháng cho slogan 'Mở Sách - Mở Tư Duy - Mở Tương Lai':\n\nTHÁNG 1 - Giai đoạn Nhận thức\nTHÁNG 2 - Giai đoạn Tương tác\nTHÁNG 3 - Giai đoạn Chuyển đổi"]},
            
            {"role": "user", "parts": ["Bây giờ tôi cần timeline cụ thể cho từng hoạt động và ước tính budget"]},
            {"role": "model", "parts": ["Tuyệt vời! Để tạo timeline chi tiết và budget, chúng ta sẽ chia thành các milestone cụ thể..."]}
        ]
        
        # Simulate work session
        work_context = {
            "mode": "project",
            "sub_task": "continue_session",
            "user_id": "demo_student_001",
            "mission_id": "mission_01",
            "mission_title": "Chiến dịch truyền thông cho CLB Sách",
            "chat_history": chat_history
        }
        
        work_response = dispatcher.dispatch(
            "Tôi cần hướng dẫn tạo budget chi tiết cho campaign này", 
            work_context
        )
        
        print(f"✅ Work Session Status: {work_response.get('status', 'unknown')}")
        print(f"🤖 ALVA Work Response:")
        print(f"   {work_response.get('response_message', 'No response')[:200]}...")
        
        # === PHASE 3: HOÀN THÀNH VÀ TẠO PORTFOLIO ===
        print(f"\n{'🎯 PHASE 3: HOÀN THÀNH & TẠO PORTFOLIO':=^70}")
        
        # Sản phẩm cuối cùng của học viên
        final_product = """
        KẾ HOẠCH TRUYỀN THÔNG CHO CLB SÁCH
        SLOGAN: "Mở Sách - Mở Tư Duy - Mở Tương Lai"
        
        === GIAI ĐOẠN 1: NHẬN THỨC (Tháng 1) ===
        🎯 Mục tiêu: Tạo nhận thức về CLB trong cộng đồng sinh viên
        
        Tuần 1-2: Thiết kế Visual Identity
        - Thiết kế logo và poster với slogan chính
        - Tạo template cho social media posts
        - Budget: 1,000,000 VNĐ
        
        Tuần 3-4: Triển khai Truyền thông
        - Dán poster tại khu vực sinh viên, thư viện, căng tin
        - Chạy social media campaign với hashtag #MởSáchMởTươngLai
        - Budget: 500,000 VNĐ
        
        === GIAI ĐOẠN 2: TƯƠNG TÁC (Tháng 2) ===
        🎯 Mục tiêu: Tạo engagement và xây dựng cộng đồng
        
        Tuần 1: Book Talk Event
        - Mời tác giả nổi tiếng talkshow
        - Tổ chức tại hội trường trường
        - Budget: 2,000,000 VNĐ
        
        Tuần 2-3: Contest "Review Sách Hay"
        - Contest trên Facebook và Instagram
        - Giải thưởng: Voucher nhà sách 500k x 3 người
        - Budget: 1,500,000 VNĐ
        
        Tuần 4: Workshop "Kỹ năng đọc hiệu quả"
        - Workshop miễn phí cho sinh viên
        - Budget: 300,000 VNĐ
        
        === GIAI ĐOẠN 3: CHUYỂN ĐỔI (Tháng 3) ===
        🎯 Mục tiêu: Thu hút thành viên chính thức
        
        Tuần 1-2: Mở đăng ký thành viên
        - Form đăng ký online và offline
        - Ưu đãi cho 50 thành viên đầu tiên
        
        Tuần 3: Event Ra mắt CLB
        - Mini book fair với gian hàng sách
        - Hoạt động giao lưu và chia sẻ
        - Budget: 2,000,000 VNĐ
        
        Tuần 4: Kick-off Meeting
        - Meeting đầu tiên với thành viên mới
        - Lập kế hoạch hoạt động cho semester
        
        === TỔNG KẾT ===
        💰 Tổng Budget: 7,300,000 VNĐ
        🎯 Target: 50 thành viên mới trong 3 tháng
        📊 KPI: 
        - Reach: 10,000 sinh viên
        - Engagement rate: >5%
        - Conversion rate: 0.5%
        """
        
        complete_context = {
            "mode": "project",
            "sub_task": "complete_project",
            "user_id": "demo_student_001",
            "user_name": "Nguyễn Văn A",
            "mission_id": "mission_01",
            "final_product": final_product,
            "chat_history": chat_history + [
                {"role": "user", "parts": ["Tôi cần hướng dẫn tạo budget chi tiết cho campaign này"]},
                {"role": "model", "parts": ["Tuyệt vời! Để tạo budget chi tiết, chúng ta sẽ chia theo từng giai đoạn và hoạt động cụ thể..."]}
            ]
        }
        
        print("🔄 Processing project completion...")
        print("   📊 Analyzing chat history with AI...")
        print("   🏷️  Extracting featured prompts and skills...")
        print("   📁 Creating portfolio card...")
        
        complete_response = dispatcher.dispatch("Tôi đã hoàn thành kế hoạch! Hãy phân tích và tạo portfolio cho tôi.", complete_context)
        
        # === HIỂN THỊ KẾT QUẢ ===
        print(f"\n{'✅ KẾT QUẢ CUỐI CÙNG':=^70}")
        
        status = complete_response.get('status', 'unknown')
        print(f"🎯 Completion Status: {status}")
        
        # Analysis Summary
        analysis = complete_response.get('analysis_summary', {})
        if analysis:
            print(f"\n📊 ANALYSIS SUMMARY:")
            print(f"   - Featured Prompts: {len(analysis.get('featured_prompts', []))}")
            print(f"   - Skills Identified: {len(analysis.get('skills', []))}")
            
            print(f"\n💡 FEATURED PROMPTS:")
            for i, prompt in enumerate(analysis.get('featured_prompts', [])[:3], 1):
                print(f"   {i}. {prompt[:80]}...")
            
            print(f"\n🏷️  SKILLS DEMONSTRATED:")
            for skill in analysis.get('skills', [])[:5]:
                print(f"   • {skill}")
        
        # Portfolio Card
        portfolio = complete_response.get('final_portfolio_card', {})
        if portfolio and portfolio.get('status') == 'created':
            card_data = portfolio.get('card_data', {})
            print(f"\n📁 PORTFOLIO CARD CREATED:")
            print(f"   - Card ID: {card_data.get('card_id', 'N/A')}")
            print(f"   - Project: {card_data.get('project_overview', {}).get('title', 'N/A')}")
            print(f"   - Completion Status: {card_data.get('project_overview', {}).get('completion_status', 'N/A')}")
            
            # Show learning outcomes
            outcomes = card_data.get('learning_outcomes', {})
            if outcomes:
                print(f"\n🎓 LEARNING OUTCOMES:")
                for outcome in outcomes.get('achieved_objectives', [])[:3]:
                    print(f"   ✓ {outcome}")
        
        print(f"\n{'🎉 PROJECT FLOW DEMO COMPLETED SUCCESSFULLY!':=^70}")
        return complete_response
        
    except Exception as e:
        print(f"❌ Error in project flow demo: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


def demo_individual_phases():
    """Demo từng phase riêng biệt để hiểu rõ hơn."""
    print("\n" + "="*80)
    print("🔍 DEMO: INDIVIDUAL PHASES BREAKDOWN")
    print("="*80)
    
    dispatcher = SmartDispatcher()
    
    # Test Phase 1: Start Project
    print("\n🚀 Testing Phase 1: Start Project...")
    start_context = {
        "mode": "project",
        "sub_task": "start_project",
        "user_id": "test_user",
        "mission_id": "mission_02"  # Try different mission
    }
    
    start_result = dispatcher.dispatch("Bắt đầu thôi!", start_context)
    print(f"   Status: {start_result.get('status')}")
    print(f"   Mission: {start_result.get('mission_info', {}).get('title', 'N/A')}")
    
    # Test Phase 2: Continue Session
    print("\n💬 Testing Phase 2: Continue Session...")
    continue_context = {
        "mode": "project",
        "sub_task": "continue_session",
        "user_id": "test_user",
        "mission_title": "Test Mission",
        "chat_history": [
            {"role": "user", "parts": ["Hello"]},
            {"role": "model", "parts": ["Hi there!"]}
        ]
    }
    
    continue_result = dispatcher.dispatch("Tôi cần hỗ trợ với ý tưởng", continue_context)
    print(f"   Status: {continue_result.get('status')}")
    
    # Test Phase 3: Complete Project
    print("\n🎯 Testing Phase 3: Complete Project...")
    complete_context = {
        "mode": "project", 
        "sub_task": "complete_project",
        "user_id": "test_user",
        "mission_id": "mission_02",
        "final_product": "Đây là sản phẩm test đơn giản",
        "chat_history": [
            {"role": "user", "parts": ["Tôi cần giúp đỡ về chatbot"]},
            {"role": "model", "parts": ["Tôi sẽ giúp bạn thiết kế chatbot hiệu quả"]}
        ]
    }
    
    complete_result = dispatcher.dispatch("Hoàn thành!", complete_context)
    print(f"   Status: {complete_result.get('status')}")
    
    portfolio = complete_result.get('final_portfolio_card', {})
    if portfolio.get('status') == 'created':
        print(f"   Portfolio Created: ✅")
        print(f"   Card ID: {portfolio.get('card_data', {}).get('card_id', 'N/A')}")
    else:
        print(f"   Portfolio Status: {portfolio.get('status', 'unknown')}")


def main():
    """Main demo function."""
    print("🎯 AI Lab Việt - Complete Project Flow Demo")
    print("=" * 80)
    
    # Check environment
    has_api_key = check_environment()
    
    if not has_api_key:
        print("\n⚠️  Running in MOCK MODE - Some features may be limited")
        print("   To experience full AI capabilities, configure GEMINI_API_KEY in .env file")
    else:
        print("\n🚀 Running with REAL AI - Full capabilities enabled")
    
    try:
        # Main demo
        result = demo_complete_project_flow()
        
        if result and result.get('status') == 'completed_successfully':
            print("\n🎊 FANTASTIC! The complete HÀNH -> CHỨNG MINH flow works perfectly!")
            
            # Optional: Show individual phases
            print("\n" + "="*50)
            user_input = input("🤔 Do you want to see individual phases breakdown? (y/N): ")
            if user_input.lower() in ['y', 'yes']:
                demo_individual_phases()
        
        print("\n" + "="*80)
        print("✅ PROJECT FLOW DEMO COMPLETED!")
        print("="*80)
        print("\n📋 Summary:")
        print("   🚀 Phase 1: Start Project - Khởi động dự án với mission")
        print("   💬 Phase 2: Work Sessions - Tương tác và phát triển ý tưởng")
        print("   🎯 Phase 3: Complete & Portfolio - Hoàn thành và tạo portfolio")
        print("\n🌟 Next Steps:")
        print("   1. Start the API server: python main.py")
        print("   2. Visit: http://127.0.0.1:8000/docs")
        print("   3. Try endpoint: POST /test_project_flow")
        print("   4. Explore other endpoints for learning mode")
        
        if not has_api_key:
            print("\n💡 Pro tip: Configure GEMINI_API_KEY for real AI responses!")
        
    except Exception as e:
        print(f"\n❌ Demo failed: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
