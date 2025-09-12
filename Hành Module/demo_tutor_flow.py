# demo_upgraded.py
"""
Demo script nâng cấp để test hệ thống AI Lab Việt với Gemini AI integration.
Kiểm tra toàn bộ luồng: User -> TutorAgent -> InteractionAgent -> Gemini AI -> Response
"""

import asyncio
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
        print("   Please set your Gemini API key in .env file")
        print("   The system will run in MOCK MODE for demonstration")
        return False
    else:
        print("✅ GEMINI_API_KEY found and configured")
        return True


def demo_alva_learning_flow():
    """Demo luồng học tập với ALVA - Trải nghiệm thực tế."""
    print("\n" + "="*70)
    print("🎓 DEMO: ALVA LEARNING FLOW (AI-Powered)")
    print("="*70)
    
    try:
        # Khởi tạo dispatcher (sẽ tự động setup AI connection)
        print("🚀 Initializing AI Lab Việt System...")
        dispatcher = SmartDispatcher()
        
        # Test case 1: Học viên hỏi về Delegation
        user_input = "Chào ALVA! Tôi muốn hiểu rõ hơn về Delegation. Có thể giải thích đơn giản được không?"
        
        session_context = {
            "mode": "learning",
            "user_id": "student_001",
            "user_level": "Trung bình",
            "learning_style": "Tương tác",
            "current_lesson": "Bài 2: Nghệ thuật Ủy thác (Delegation)",
            "lesson_progress": 30,
            "session_id": "alva_demo_001",
            "previous_topics": ["Giới thiệu Leadership", "Tự quản lý thời gian"],
            "chat_history": [
                {
                    "role": "user",
                    "parts": ["Chào ALVA"]
                },
                {
                    "role": "model", 
                    "parts": ["Chào bạn! Tôi là ALVA, gia sư AI của AI Lab Việt. Hôm nay chúng ta sẽ cùng học về Nghệ thuật Ủy thác. Đây là kỹ năng quan trọng cho các nhà lãnh đạo. Bạn có câu hỏi gì không? 🎓"]
                }
            ]
        }
        
        print(f"👤 Student Question: {user_input}")
        print(f"📚 Current Lesson: {session_context['current_lesson']}")
        print(f"👨‍🎓 Student Level: {session_context['user_level']}")
        print("\n🤖 Processing with ALVA AI System...")
        
        # Gọi hệ thống xử lý
        result = dispatcher.dispatch(user_input, session_context)
        
        # Hiển thị kết quả
        print(f"\n{'='*50}")
        print(f"🎯 ALVA RESPONSE:")
        print(f"{'='*50}")
        print(f"🤖 Agent: {result['agent_name']}")
        print(f"🔧 AI Provider: {result['action'].get('ai_provider', 'unknown')}")
        print(f"📝 Response:")
        print(f"{result['response_message']}")
        
        if result.get('suggestions'):
            print(f"\n💡 Follow-up suggestions:")
            for i, suggestion in enumerate(result['suggestions'], 1):
                print(f"   {i}. {suggestion}")
        
        return result
        
    except Exception as e:
        print(f"❌ Error in ALVA demo: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


def demo_advanced_questions():
    """Demo với các câu hỏi nâng cao."""
    print("\n" + "="*70)
    print("🧠 DEMO: ADVANCED QUESTIONS")
    print("="*70)
    
    questions = [
        "Làm thế nào để biết khi nào nên delegate và khi nào nên tự làm?",
        "Có những sai lầm phổ biến nào khi delegate mà tôi cần tránh?",
        "Bạn có thể cho một ví dụ cụ thể về delegation thành công trong công ty Việt Nam không?"
    ]
    
    dispatcher = SmartDispatcher()
    
    for i, question in enumerate(questions, 1):
        print(f"\n🎯 Question {i}: {question}")
        
        session_context = {
            "mode": "learning",
            "user_id": "advanced_student",
            "current_lesson": "Bài 2: Nghệ thuật Ủy thác (Delegation)",
            "user_level": "Nâng cao",
            "chat_history": []
        }
        
        try:
            result = dispatcher.dispatch(question, session_context)
            print(f"🤖 ALVA: {result['response_message'][:200]}...")
            print(f"   [Response length: {len(result['response_message'])} characters]")
        except Exception as e:
            print(f"❌ Error: {str(e)}")


def demo_system_capabilities():
    """Demo khả năng của hệ thống."""
    print("\n" + "="*70)
    print("📊 DEMO: SYSTEM CAPABILITIES")
    print("="*70)
    
    try:
        dispatcher = SmartDispatcher()
        
        # Test system status
        print("🔍 System Status:")
        status = dispatcher.get_system_status()
        print(json.dumps(status, indent=2, ensure_ascii=False))
        
        # Test AI connection
        print("\n🧪 AI Connection Test:")
        ai_test = dispatcher.test_ai_connection()
        print(json.dumps(ai_test, indent=2, ensure_ascii=False))
        
    except Exception as e:
        print(f"❌ Error checking system: {str(e)}")


def main():
    """Chạy tất cả demo scenarios."""
    print("🤖 AI Lab Việt - ALVA System Demo (AI-Powered)")
    print("=" * 70)
    
    # Kiểm tra environment
    has_api_key = check_environment()
    
    if not has_api_key:
        print("\n⚠️  Running in MOCK MODE - Responses will be rule-based")
        print("   To experience real AI, please configure GEMINI_API_KEY in .env file")
    else:
        print("\n🚀 Running with REAL AI - Powered by Gemini")
    
    try:
        # Demo 1: Luồng học tập cơ bản
        result1 = demo_alva_learning_flow()
        
        if result1 and result1.get("status") == "success":
            # Demo 2: Câu hỏi nâng cao
            demo_advanced_questions()
            
            # Demo 3: System capabilities
            demo_system_capabilities()
        
        print("\n" + "="*70)
        print("✅ DEMO COMPLETED SUCCESSFULLY!")
        print("="*70)
        print("\n🎉 ALVA System is ready to use!")
        print("📖 Next steps:")
        print("   1. Run 'python main.py' to start the API server")
        print("   2. Visit http://127.0.0.1:8000/docs for API documentation")
        print("   3. Test endpoints with curl or Postman")
        print("   4. Try the /test_tutor_flow endpoint for quick testing")
        
        if not has_api_key:
            print("\n💡 Pro tip: Configure GEMINI_API_KEY for real AI responses!")
        
    except Exception as e:
        print(f"\n❌ Demo failed: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
