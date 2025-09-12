"""
Chat history utilities
"""
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from api.config import supabase

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

def get_current_progress(chat_history: List[Dict[str, Any]], mission: Dict[str, Any]) -> str:
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
    
    return phases[current_step]["name"] if current_step < len(phases) else phases[-1]["name"]

def convert_context_to_chat_history(context_string: str) -> List[Dict[str, Any]]:
    """Chuyển đổi context string thành chat_history format cho Gemini."""
    chat_history = []
    if not context_string:
        return chat_history
    
    # Xử lý từng đoạn chat bằng cách tách theo patterns "user: " và "ai: "
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

def parse_chat_history_to_messages(chat_history: str) -> List[Dict[str, str]]:
    """Chuyển đổi context string thành danh sách messages với xử lý đúng các message nhiều dòng"""
    messages = []
    if not chat_history:
        return messages
    
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
    
    return messages
