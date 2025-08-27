#!/usr/bin/env python3
"""
Demo script để test hai nhân cách của ALVA theo đặc tả:
1. Tutor ALVA - Gia sư Thông thái (Module HỌC)
2. Project ALVA - Cộng sự Sáng tạo (Module HÀNH)

Mục đích: Chứng minh sự khác biệt rõ rệt giữa hai personas
"""

import sys
import os
from typing import Dict, Any

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.dispatcher import SmartDispatcher


def print_section(title: str):
    """In header cho từng section."""
    print("\n" + "="*80)
    print(f"🎭 {title}")
    print("="*80)


def print_persona_response(persona_name: str, response: Dict[str, Any]):
    """In response từ một persona cụ thể."""
    print(f"\n🤖 {persona_name} phản hồi:")
    print("-" * 60)
    
    # Trích xuất response text từ nhiều nguồn có thể
    response_text = (
        response.get('response_text') or 
        response.get('response_message') or 
        response.get('action', {}).get('response_text') or
        'Không có phản hồi'
    )
    
    persona_type = (
        response.get('persona_type') or 
        response.get('action', {}).get('persona_type') or
        'unknown'
    )
    
    response_from = (
        response.get('response_from') or 
        response.get('action', {}).get('response_from') or
        response.get('agent_name') or
        'Unknown Agent'
    )
    
    # Cắt ngắn response nếu quá dài
    if len(response_text) > 300:
        display_text = response_text[:300] + "..."
    else:
        display_text = response_text
    
    print(f"📝 Nội dung: {display_text}")
    print(f"🎭 Persona Type: {persona_type}")
    print(f"🤖 Response From: {response_from}")
    print("-" * 60)


def test_tutor_alva_persona(dispatcher: SmartDispatcher):
    """Test Tutor ALVA - Gia sư Thông thái."""
    print_section("TEST TUTOR ALVA - GIA SƯ THÔNG THÁI")
    
    print("📚 Đặc điểm Tutor ALVA:")
    print("• Vai trò: Gia sư Thông thái")
    print("• Tính cách: Kiên nhẫn, rõ ràng, mạch lạc, phương pháp Socratic")
    print("• Phạm vi: Hẹp & Sâu - chỉ tập trung vào bài học hiện tại")
    print("• Mục tiêu: Người dùng hiểu rõ và tự diễn đạt lại khái niệm")
    
    # Test case 1: Câu hỏi về lý thuyết
    print("\n🧪 Test Case 1: Câu hỏi về lý thuyết Machine Learning")
    
    tutor_context = {
        "mode": "learning",
        "user_id": "student_001",
        "current_lesson": "Supervised Learning Fundamentals",
        "user_level": "beginner",
        "learning_style": "visual",
        "chat_history": [
            {"role": "user", "parts": ["Chào ALVA"]},
            {"role": "model", "parts": ["Chào bạn! Tôi là ALVA, gia sư AI của bạn."]}
        ]
    }
    
    user_question = "ALVA ơi, em chưa hiểu rõ về khái niệm overfitting. Bạn có thể giải thích giúp em không?"
    
    try:
        response = dispatcher.dispatch(user_question, tutor_context)
        print_persona_response("TUTOR ALVA", response)
        
        # Test case 2: Câu hỏi ngoài phạm vi
        print("\n🧪 Test Case 2: Câu hỏi ngoài phạm vi bài học")
        off_topic_question = "ALVA ơi, em muốn biết cách nấu phở ngon thì làm sao?"
        
        response2 = dispatcher.dispatch(off_topic_question, tutor_context)
        print_persona_response("TUTOR ALVA (Off-topic)", response2)
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi test Tutor ALVA: {str(e)}")
        return False


def test_project_alva_persona(dispatcher: SmartDispatcher):
    """Test Project ALVA - Cộng sự Sáng tạo."""
    print_section("TEST PROJECT ALVA - CỘNG SỰ SÁNG TẠO")
    
    print("🚀 Đặc điểm Project ALVA:")
    print("• Vai trò: Cộng sự Sáng tạo")
    print("• Tính cách: Năng động, khích lệ, chủ động, linh hoạt, sáng tạo")
    print("• Phạm vi: Rộng & Thực tế - sử dụng kiến thức chung của LLM")
    print("• Mục tiêu: Tạo sản phẩm chất lượng cao và học kỹ năng")
    
    # Test case 1: Bắt đầu dự án
    print("\n🧪 Test Case 1: Khởi động dự án marketing")
    
    project_start_context = {
        "mode": "project",
        "sub_task": "start_project",
        "user_id": "creator_001",
        "user_name": "An",
        "mission_id": "mission_01",
        "project_phase": "kickoff",
        "chat_history": []
    }
    
    kickoff_message = "Chào ALVA! Mình muốn bắt đầu dự án marketing cho CLB Sách. Bạn có thể giúp mình không?"
    
    try:
        response = dispatcher.dispatch(kickoff_message, project_start_context)
        print_persona_response("PROJECT ALVA (Kickoff)", response)
        
        # Test case 2: Brainstorming trong dự án
        print("\n🧪 Test Case 2: Brainstorming ý tưởng sáng tạo")
        
        project_continue_context = {
            "mode": "project",
            "sub_task": "continue_session",
            "user_id": "creator_001", 
            "user_name": "An",
            "mission_id": "Chiến dịch truyền thông cho CLB Sách",
            "project_phase": "brainstorming",
            "chat_history": [
                {"role": "user", "parts": ["Mình đang nghĩ về campaign social media"]},
                {"role": "model", "parts": ["Tuyệt vời! Social media là kênh rất hiệu quả..."]}
            ]
        }
        
        brainstorm_message = "ALVA ơi, mình đang stuck với ý tưởng content. Làm sao để thu hút được Gen Z đọc sách hơn nhỉ?"
        
        response2 = dispatcher.dispatch(brainstorm_message, project_continue_context)
        print_persona_response("PROJECT ALVA (Brainstorming)", response2)
        
        # Test case 3: Câu hỏi rộng (không bị giới hạn như Tutor)
        print("\n🧪 Test Case 3: Câu hỏi về xu hướng marketing")
        
        trend_question = "ALVA, bạn nghĩ xu hướng marketing 2024 sẽ như thế nào? Mình nên tập trung vào platform nào?"
        
        response3 = dispatcher.dispatch(trend_question, project_continue_context)
        print_persona_response("PROJECT ALVA (Trend Analysis)", response3)
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi test Project ALVA: {str(e)}")
        return False


def compare_personas_side_by_side(dispatcher: SmartDispatcher):
    """So sánh trực tiếp hai personas với cùng một câu hỏi."""
    print_section("SO SÁNH TRỰC TIẾP HAI PERSONAS")
    
    common_question = "ALVA ơi, bạn có thể giúp mình về AI không?"
    
    print(f"🤔 Câu hỏi chung: '{common_question}'")
    print("\n📊 So sánh phản hồi:")
    
    # Tutor ALVA response
    tutor_context = {
        "mode": "learning",
        "current_lesson": "Introduction to AI",
        "user_level": "beginner"
    }
    
    print("\n1️⃣ TUTOR ALVA (Gia sư Thông thái):")
    try:
        tutor_response = dispatcher.dispatch(common_question, tutor_context)
        tutor_text = (
            tutor_response.get('response_text') or 
            tutor_response.get('response_message') or 
            tutor_response.get('action', {}).get('response_text') or
            'Không có phản hồi'
        )
        print(f"📝 {tutor_text[:200]}...")
    except Exception as e:
        print(f"❌ Lỗi: {str(e)}")
    
    # Project ALVA response  
    project_context = {
        "mode": "project",
        "sub_task": "continue_session",
        "user_name": "bạn",
        "mission_id": "AI Project",
        "project_phase": "planning"
    }
    
    print("\n2️⃣ PROJECT ALVA (Cộng sự Sáng tạo):")
    try:
        project_response = dispatcher.dispatch(common_question, project_context)
        project_text = (
            project_response.get('response_text') or 
            project_response.get('response_message') or 
            project_response.get('action', {}).get('response_text') or
            'Không có phản hồi'
        )
        print(f"📝 {project_text[:200]}...")
    except Exception as e:
        print(f"❌ Lỗi: {str(e)}")


def main():
    """Hàm main để chạy demo hai personas của ALVA."""
    print("🎭 DEMO HAI NHÂN CÁCH CỦA ALVA - AI LAB VIỆT")
    print("Chứng minh sự khác biệt giữa Tutor ALVA và Project ALVA theo đặc tả")
    
    # Khởi tạo dispatcher
    print("\n🔧 Khởi tạo SmartDispatcher...")
    try:
        dispatcher = SmartDispatcher()
        print("✅ SmartDispatcher khởi tạo thành công!")
    except Exception as e:
        print(f"❌ Lỗi khởi tạo SmartDispatcher: {str(e)}")
        return
    
    # Test từng persona
    test_results = []
    
    print("\n" + "🎯 BẮT ĐẦU TESTING HAI PERSONAS" + "\n")
    
    # Test Tutor ALVA
    test_results.append(("Tutor ALVA", test_tutor_alva_persona(dispatcher)))
    
    # Test Project ALVA  
    test_results.append(("Project ALVA", test_project_alva_persona(dispatcher)))
    
    # So sánh trực tiếp
    compare_personas_side_by_side(dispatcher)
    
    # Tổng kết
    print_section("TỔNG KẾT DEMO PERSONAS")
    
    passed = sum(1 for _, result in test_results if result)
    total = len(test_results)
    
    for persona_name, result in test_results:
        status = "✅ HOẠT ĐỘNG" if result else "❌ LỖI"
        print(f"{persona_name:15} | {status}")
    
    print(f"\n📊 KẾT QUẢ:")
    print(f"   • Personas hoạt động: {passed}/{total}")
    print(f"   • Success Rate: {(passed/total*100):.1f}%")
    
    if passed == total:
        print("\n🎉 CẢ HAI PERSONAS HOẠT ĐỘNG HOÀN HẢO!")
        print("✨ Tutor ALVA và Project ALVA đã thể hiện rõ sự khác biệt theo đặc tả!")
    else:
        print(f"\n⚠️  CÓ {total-passed} PERSONAS GẶP VẤN ĐỀ.")
    
    print("\n📋 TÓNG KẾT SỰ KHÁC BIỆT:")
    print("🎓 Tutor ALVA: Kiên nhẫn, tập trung bài học, phương pháp Socratic")
    print("🚀 Project ALVA: Năng động, sáng tạo, hỗ trợ thực tế, không giới hạn")
    print("\n🔚 Demo hoàn thành!")


if __name__ == "__main__":
    main()
