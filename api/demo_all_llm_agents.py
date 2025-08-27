#!/usr/bin/env python3
"""
Demo script để test tất cả 4 LLM Agents trong hệ thống Multi-Agent.

Agents được test:
1. InteractionAgent - Giao tiếp trực tiếp với Gemini AI
2. AnalysisAgent - Phân tích chat history với AI
3. PracticeAgent - Tạo bài tập thực hành với AI
4. QuizAgent - Tạo quiz đánh giá với AI

"""

import sys
import os
import json
from typing import Dict, Any

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.dispatcher import SmartDispatcher


def print_section(title: str):
    """In header cho từng section."""
    print("\n" + "="*80)
    print(f"🧪 {title}")
    print("="*80)


def print_result(agent_name: str, result: Dict[str, Any]):
    """In kết quả test của agent."""
    print(f"\n📊 KẾT QUẢ TỪ {agent_name}:")
    print("-" * 50)
    
    if isinstance(result, dict):
        for key, value in result.items():
            if isinstance(value, (dict, list)):
                print(f"{key}: {json.dumps(value, ensure_ascii=False, indent=2)}")
            else:
                print(f"{key}: {value}")
    else:
        print(result)
    print("-" * 50)


def test_interaction_agent(dispatcher: SmartDispatcher):
    """Test InteractionAgent - giao tiếp trực tiếp với AI."""
    print_section("TEST 1: INTERACTION AGENT - Giao tiếp AI")
    
    try:
        # Test basic communication
        persona = """
Bạn là ALVA, trợ lý AI thông minh của AI Lab Việt. 
Hãy trả lời ngắn gọn và thân thiện.
"""
        
        context = {
            "user_input": "Xin chào ALVA! Bạn có thể giúp tôi học về AI không?",
            "test_type": "basic_communication"
        }
        
        chat_history = []
        
        print("🤖 Đang gọi InteractionAgent...")
        response = dispatcher.interaction_agent.communicate(persona, context, chat_history)
        
        result = {
            "agent_name": "InteractionAgent",
            "response_text": response,
            "status": "success",
            "test_type": "basic_communication"
        }
        
        print_result("InteractionAgent", result)
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi test InteractionAgent: {str(e)}")
        return False


def test_analysis_agent(dispatcher: SmartDispatcher):
    """Test AnalysisAgent - phân tích chat history."""
    print_section("TEST 2: ANALYSIS AGENT - Phân tích AI")
    
    try:
        # Tạo mock chat history
        mock_chat_history = [
            {"role": "user", "parts": ["Tôi muốn học về machine learning"]},
            {"role": "model", "parts": ["Tuyệt vời! Machine learning là một lĩnh vực thú vị..."]},
            {"role": "user", "parts": ["Làm sao để tôi có thể xây dựng một mô hình dự đoán giá nhà?"]},
            {"role": "model", "parts": ["Để xây dựng mô hình dự đoán giá nhà, bạn cần..."]},
            {"role": "user", "parts": ["Tôi có thể sử dụng Python và thư viện nào để implement?"]},
            {"role": "model", "parts": ["Python là lựa chọn tuyệt vời! Bạn có thể sử dụng scikit-learn..."]}
        ]
        
        params = {
            "chat_history": mock_chat_history,
            "analysis_type": "learning_progress"
        }
        
        print("📊 Đang phân tích chat history với AI...")
        result = dispatcher.analysis_agent.execute(params)
        
        print_result("AnalysisAgent", result)
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi test AnalysisAgent: {str(e)}")
        return False


def test_practice_agent(dispatcher: SmartDispatcher):
    """Test PracticeAgent - tạo bài tập thực hành với AI."""
    print_section("TEST 3: PRACTICE AGENT - Tạo bài tập AI")
    
    try:
        params = {
            "topic": "Python Programming",
            "difficulty_level": "intermediate",
            "exercise_type": "coding",
            "estimated_time": 45
        }
        
        print("🎯 Đang tạo bài tập thực hành với AI...")
        result = dispatcher.practice_agent.execute(params)
        
        print_result("PracticeAgent", result)
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi test PracticeAgent: {str(e)}")
        return False


def test_quiz_agent(dispatcher: SmartDispatcher):
    """Test QuizAgent - tạo quiz với AI."""
    print_section("TEST 4: QUIZ AGENT - Tạo quiz AI")
    
    try:
        params = {
            "topic": "Machine Learning Basics",
            "difficulty_level": "beginner",
            "question_count": 5,
            "question_types": ["multiple_choice", "true_false"],
            "time_limit": 10
        }
        
        print("📝 Đang tạo quiz với AI...")
        result = dispatcher.quiz_agent.execute(params)
        
        print_result("QuizAgent", result)
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi test QuizAgent: {str(e)}")
        return False


def test_integration_scenario(dispatcher: SmartDispatcher):
    """Test scenario tích hợp - sử dụng nhiều LLM agents."""
    print_section("TEST 5: INTEGRATION SCENARIO - Kịch bản tích hợp")
    
    try:
        print("🔄 Kịch bản: Học viên học về AI → Làm bài tập → Làm quiz → Phân tích kết quả")
        
        # 1. Tương tác học tập
        print("\n1️⃣ Giai đoạn học tập...")
        learning_context = {
            "mode": "learning",
            "user_id": "test_user",
            "current_lesson": "Giới thiệu về Machine Learning",
            "chat_history": [
                {"role": "user", "parts": ["Tôi muốn học về AI"]},
                {"role": "model", "parts": ["Chào bạn! Hôm nay chúng ta sẽ học về AI..."]}
            ]
        }
        
        learning_result = dispatcher.dispatch("Giải thích cho tôi về supervised learning", learning_context)
        print(f"✅ Học tập hoàn thành: {learning_result.get('response_message', 'N/A')[:100]}...")
        
        # 2. Tạo bài tập thực hành
        print("\n2️⃣ Tạo bài tập thực hành...")
        practice_result = dispatcher.practice_agent.execute({
            "topic": "Supervised Learning",
            "difficulty_level": "beginner",
            "exercise_type": "analysis",
            "estimated_time": 30
        })
        print(f"✅ Bài tập được tạo: {practice_result.get('exercise_id', 'N/A')}")
        
        # 3. Tạo quiz đánh giá
        print("\n3️⃣ Tạo quiz đánh giá...")
        quiz_result = dispatcher.quiz_agent.execute({
            "topic": "Supervised Learning",
            "difficulty_level": "beginner",
            "question_count": 3,
            "question_types": ["multiple_choice"],
            "time_limit": 5
        })
        print(f"✅ Quiz được tạo: {quiz_result.get('quiz_id', 'N/A')}")
        
        # 4. Phân tích toàn bộ quá trình
        print("\n4️⃣ Phân tích quá trình học tập...")
        extended_chat_history = learning_context["chat_history"] + [
            {"role": "user", "parts": ["Giải thích cho tôi về supervised learning"]},
            {"role": "model", "parts": ["Supervised learning là phương pháp học máy..."]}
        ]
        
        analysis_result = dispatcher.analysis_agent.execute({
            "chat_history": extended_chat_history,
            "analysis_type": "comprehensive_learning"
        })
        print(f"✅ Phân tích hoàn thành: {len(analysis_result.get('featured_prompts', []))} featured prompts")
        
        # Tổng kết
        integration_summary = {
            "learning_completed": bool(learning_result.get('response_message')),
            "practice_generated": bool(practice_result.get('exercise_id')),
            "quiz_generated": bool(quiz_result.get('quiz_id')),
            "analysis_completed": bool(analysis_result.get('featured_prompts')),
            "total_llm_calls": 4,  # TutorAgent, PracticeAgent, QuizAgent, AnalysisAgent
            "integration_status": "success"
        }
        
        print_result("Integration Test", integration_summary)
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi test integration: {str(e)}")
        return False


def main():
    """Hàm main để chạy tất cả tests."""
    print("🚀 DEMO TEST TẤT CẢ 4 LLM AGENTS - AI LAB VIỆT")
    print("Kiểm tra khả năng gọi API LLM của các agents trong hệ thống Multi-Agent")
    
    # Khởi tạo dispatcher
    print("\n🔧 Khởi tạo SmartDispatcher...")
    try:
        dispatcher = SmartDispatcher()
        print("✅ SmartDispatcher khởi tạo thành công!")
    except Exception as e:
        print(f"❌ Lỗi khởi tạo SmartDispatcher: {str(e)}")
        return
    
    # Chạy các tests
    test_results = []
    
    # Test từng agent riêng lẻ
    test_results.append(("InteractionAgent", test_interaction_agent(dispatcher)))
    test_results.append(("AnalysisAgent", test_analysis_agent(dispatcher)))
    test_results.append(("PracticeAgent", test_practice_agent(dispatcher)))
    test_results.append(("QuizAgent", test_quiz_agent(dispatcher)))
    
    # Test integration
    test_results.append(("Integration", test_integration_scenario(dispatcher)))
    
    # Tổng kết kết quả
    print_section("TỔNG KẾT KẾT QUẢ TEST")
    
    passed = 0
    failed = 0
    
    for agent_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{agent_name:20} | {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\n📊 THỐNG KÊ:")
    print(f"   • Passed: {passed}/{len(test_results)}")
    print(f"   • Failed: {failed}/{len(test_results)}")
    print(f"   • Success Rate: {(passed/len(test_results)*100):.1f}%")
    
    if failed == 0:
        print("\n🎉 TẤT CẢ TESTS PASSED! Hệ thống Multi-Agent hoạt động hoàn hảo!")
    else:
        print(f"\n⚠️  CÓ {failed} TESTS FAILED. Vui lòng kiểm tra lại cấu hình và API keys.")
    
    print("\n🔚 Demo hoàn thành. Cảm ơn bạn đã sử dụng AI Lab Việt Multi-Agent System!")


if __name__ == "__main__":
    main()
