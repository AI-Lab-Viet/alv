# core/dispatcher.py
"""
SmartDispatcher - Bộ điều phối thông minh cho hệ thống đa tác tử.
Phiên bản nâng cấp với dependency injection và tích hợp AI thực tế.
"""

from typing import Dict, Any, Optional
from agents.orchestration.tutor_agent import TutorAgent
from agents.orchestration.project_agent import ProjectAgent
from agents.execution.practice_agent import PracticeAgent
from agents.execution.quiz_agent import QuizAgent
from agents.execution.mission_agent import MissionAgent
from agents.execution.analysis_agent import AnalysisAgent
from agents.execution.portfolio_agent import PortfolioAgent
from agents.communication.interaction_agent import InteractionAgent


class SmartDispatcher:
    """
    Bộ điều phối thông minh cho hệ thống đa tác tử.
    
    Tính năng:
    - Dependency injection để kết nối các agents
    - Tích hợp với Gemini AI
    - Luồng xử lý hoàn chỉnh từ user input đến AI response
    - Error handling và fallback mechanisms
    """
    
    def __init__(self):
        """Khởi tạo SmartDispatcher với dependency injection pattern."""
        print("🚀 Initializing SmartDispatcher with AI integration...")
        
        try:
            # 1. Khởi tạo InteractionAgent trước (core dependency)
            print("📡 Setting up AI communication layer...")
            self.interaction_agent = InteractionAgent()
            
            # 2. Khởi tạo Execution Agents với dependency injection
            print("⚡ Setting up execution agents...")
            self.mission_agent = MissionAgent()
            self.analysis_agent = AnalysisAgent(self.interaction_agent)
            self.portfolio_agent = PortfolioAgent()
            self.practice_agent = PracticeAgent(self.interaction_agent)  # DI for AI-powered exercises
            self.quiz_agent = QuizAgent(self.interaction_agent)          # DI for AI-powered quizzes
            
            self.execution_agents = {
                "practice": self.practice_agent,
                "quiz": self.quiz_agent,
                "mission": self.mission_agent,
                "analysis": self.analysis_agent,
                "portfolio": self.portfolio_agent,
            }
            
            # 3. Khởi tạo Orchestration Agents với dependency injection
            print("🎯 Setting up orchestration agents...")
            self.orchestration_agents = {
                "learning": TutorAgent(self.interaction_agent),
                "project": ProjectAgent(
                    interaction_agent=self.interaction_agent,
                    mission_agent=self.mission_agent,
                    analysis_agent=self.analysis_agent,
                    portfolio_agent=self.portfolio_agent
                ),
            }
            
            # 4. Communication Agents registry
            self.communication_agents = {
                "interaction": self.interaction_agent,
            }
            
            print("✅ SmartDispatcher initialized successfully!")
            print(f"📊 Total agents: {len(self.orchestration_agents) + len(self.execution_agents) + len(self.communication_agents)}")
            self._log_agent_status()
            
        except Exception as e:
            print(f"❌ Error initializing SmartDispatcher: {str(e)}")
            raise e
    
    def _classify_user_intent(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sử dụng LLM để phân tích ý định người dùng và xác định mode phù hợp.
        
        Args:
            user_input: Input từ người dùng
            session_context: Ngữ cảnh hiện tại
            
        Returns:
            Dict chứa classified intent và confidence
        """
        print(f"🧠 [SmartDispatcher] Analyzing user intent with LLM...")
        
        if not self.interaction_agent:
            # Fallback to rule-based classification
            return self._fallback_intent_classification(user_input, session_context)
        
        try:
            # Tạo Intent Classification Prompt
            intent_prompt = self._create_intent_classification_prompt()
            
            # Context cho việc phân loại
            classification_context = {
                "user_input": user_input,
                "session_info": {
                    "current_mode": session_context.get("mode"),
                    "user_id": session_context.get("user_id"),
                    "current_lesson": session_context.get("current_lesson"),
                    "mission_id": session_context.get("mission_id"),
                    "project_phase": session_context.get("project_phase"),
                    "chat_history_length": len(session_context.get("chat_history", []))
                },
                "classification_task": "intent_analysis"
            }
            
            # Gọi LLM để phân tích ý định
            classification_result = self.interaction_agent.communicate(
                intent_prompt, 
                classification_context, 
                []  # Không cần chat history cho classification
            )
            
            # Parse kết quả classification
            parsed_intent = self._parse_intent_result(classification_result, user_input)
            
            print(f"🎯 Intent classified: {parsed_intent['mode']} (confidence: {parsed_intent['confidence']})")
            return parsed_intent
            
        except Exception as e:
            print(f"❌ Error in intent classification: {str(e)}")
            print(f"🔄 Falling back to rule-based classification...")
            return self._fallback_intent_classification(user_input, session_context)
    
    def _create_intent_classification_prompt(self) -> str:
        """
        Tạo prompt cho LLM để phân loại ý định người dùng.
        
        Returns:
            System prompt cho intent classification
        """
        return """
Bạn là một chuyên gia phân tích ý định người dùng (Intent Classifier) của AI Lab Việt Multi-Agent System.

=== NHIỆM VỤ ===
Phân tích input của người dùng và xác định MODE phù hợp nhất trong hệ thống ALVA.

=== CÁC MODE AVAILABLE ===
1. **learning** - Module HỌC (Tutor ALVA)
   • Ý định: Học lý thuyết, hiểu khái niệm, giải đáp thắc mắc
   • Ví dụ: "Giải thích về machine learning", "Overfitting là gì?", "Em chưa hiểu về neural networks"
   • Đặc điểm: Câu hỏi về kiến thức, lý thuyết, khái niệm, giải thích

2. **project** - Module HÀNH (Project ALVA)  
   • Ý định: Thực hiện dự án, brainstorm, tạo sản phẩm, hợp tác
   • Ví dụ: "Tôi muốn làm dự án marketing", "Brainstorm ý tưởng content", "Giúp tôi lập kế hoạch"
   • Đặc điểm: Hành động thực tế, sáng tạo, làm việc, dự án

=== NGUYÊN TẮC PHÂN LOẠI ===
• **Ưu tiên ngữ cảnh**: Nếu user đang trong 1 mode, có xu hướng tiếp tục mode đó
• **Phân tích từ khóa**: "học", "hiểu", "giải thích" → learning | "làm", "tạo", "dự án" → project  
• **Phân tích cấu trúc**: Câu hỏi "là gì?" → learning | Câu yêu cầu "giúp tôi làm" → project
• **Xử lý mơ hồ**: Khi không chắc chắn, ưu tiên mode hiện tại hoặc learning (safer)

=== ĐỊNH DẠNG PHẢN HỒI ===
Trả lời CHÍNH XÁC theo format JSON sau (không có text khác):
{
  "mode": "learning|project",
  "confidence": 0.0-1.0,
  "reasoning": "Giải thích ngắn gọn lý do phân loại",
  "keywords": ["từ khóa", "quan trọng"],
  "fallback_mode": "learning|project"
}

=== VÍ DỤ ===
Input: "ALVA ơi, em chưa hiểu về deep learning"
Output: {"mode": "learning", "confidence": 0.95, "reasoning": "Câu hỏi về hiểu biết khái niệm", "keywords": ["chưa hiểu", "deep learning"], "fallback_mode": "learning"}

Input: "Giúp tôi brainstorm ý tưởng cho campaign marketing"  
Output: {"mode": "project", "confidence": 0.9, "reasoning": "Yêu cầu hỗ trợ thực hiện dự án", "keywords": ["brainstorm", "campaign", "marketing"], "fallback_mode": "project"}

Hãy phân tích input của người dùng ngay bây giờ!
"""
    
    def _parse_intent_result(self, classification_result: str, user_input: str) -> Dict[str, Any]:
        """
        Parse kết quả classification từ LLM.
        
        Args:
            classification_result: JSON string từ LLM
            user_input: Input gốc từ user
            
        Returns:
            Parsed intent dictionary
        """
        try:
            import json
            import re
            
            # Clean up response - remove markdown code blocks if present
            cleaned_result = classification_result.strip()
            
            # Remove ```json and ``` if present
            if cleaned_result.startswith('```json'):
                cleaned_result = cleaned_result[7:]  # Remove ```json
            if cleaned_result.startswith('```'):
                cleaned_result = cleaned_result[3:]   # Remove ```
            if cleaned_result.endswith('```'):
                cleaned_result = cleaned_result[:-3]  # Remove trailing ```
            
            # Extract JSON from text if needed
            json_match = re.search(r'\{.*\}', cleaned_result, re.DOTALL)
            if json_match:
                cleaned_result = json_match.group(0)
            
            parsed = json.loads(cleaned_result.strip())
            
            # Validate required fields
            required_fields = ["mode", "confidence", "reasoning"]
            for field in required_fields:
                if field not in parsed:
                    raise ValueError(f"Missing required field: {field}")
            
            # Validate mode
            valid_modes = list(self.orchestration_agents.keys())
            if parsed["mode"] not in valid_modes:
                print(f"⚠️  Invalid mode '{parsed['mode']}', using fallback")
                parsed["mode"] = parsed.get("fallback_mode", "learning")
            
            # Ensure confidence is in valid range
            parsed["confidence"] = max(0.0, min(1.0, float(parsed.get("confidence", 0.5))))
            
            return {
                "mode": parsed["mode"],
                "confidence": parsed["confidence"], 
                "reasoning": parsed.get("reasoning", "LLM classification"),
                "keywords": parsed.get("keywords", []),
                "classification_method": "llm",
                "original_input": user_input
            }
            
        except (json.JSONDecodeError, ValueError, KeyError) as e:
            print(f"⚠️  Failed to parse LLM classification: {str(e)}")
            print(f"📝 Raw LLM response: {classification_result[:200]}...")
            
            # Extract mode from text if possible
            classification_result_lower = classification_result.lower()
            if "project" in classification_result_lower and "mode" in classification_result_lower:
                mode = "project"
            elif "learning" in classification_result_lower and "mode" in classification_result_lower:
                mode = "learning"
            else:
                mode = "learning"  # Default fallback
            
            return {
                "mode": mode,
                "confidence": 0.3,
                "reasoning": "Parsed from text due to JSON parse error",
                "keywords": [],
                "classification_method": "text_extraction",
                "original_input": user_input,
                "parse_error": str(e)
            }
    
    def _fallback_intent_classification(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Rule-based fallback classification khi không có LLM.
        
        Args:
            user_input: Input từ người dùng
            session_context: Ngữ cảnh hiện tại
            
        Returns:
            Classification result
        """
        print(f"🔄 Using rule-based intent classification...")
        
        user_input_lower = user_input.lower()
        
        # Learning keywords
        learning_keywords = [
            "là gì", "giải thích", "hiểu", "học", "khái niệm", "lý thuyết", 
            "định nghĩa", "ví dụ", "tại sao", "như thế nào", "phân biệt"
        ]
        
        # Project keywords  
        project_keywords = [
            "dự án", "làm", "tạo", "xây dựng", "brainstorm", "ý tưởng",
            "kế hoạch", "chiến lược", "campaign", "marketing", "thiết kế"
        ]
        
        # Count keyword matches
        learning_score = sum(1 for keyword in learning_keywords if keyword in user_input_lower)
        project_score = sum(1 for keyword in project_keywords if keyword in user_input_lower)
        
        # Determine mode
        if project_score > learning_score:
            mode = "project"
            confidence = min(0.8, 0.5 + project_score * 0.1)
            reasoning = f"Rule-based: Found {project_score} project keywords"
        elif learning_score > project_score:
            mode = "learning"
            confidence = min(0.8, 0.5 + learning_score * 0.1)
            reasoning = f"Rule-based: Found {learning_score} learning keywords"
        else:
            # Use context or default to learning
            current_mode = session_context.get("mode", "learning")
            mode = current_mode if current_mode in self.orchestration_agents else "learning"
            confidence = 0.4
            reasoning = "Rule-based: No clear keywords, using context/default"
        
        return {
            "mode": mode,
            "confidence": confidence,
            "reasoning": reasoning,
            "keywords": [],
            "classification_method": "rule_based",
            "original_input": user_input,
            "learning_score": learning_score,
            "project_score": project_score
        }

    def dispatch(self, user_input: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Điều phối request qua luồng AI hoàn chỉnh với Intent Classification.
        
        Args:
            user_input: Input từ người dùng
            session_context: Ngữ cảnh phiên làm việc
            
        Returns:
            Dict chứa response từ AI và metadata
        """
        print(f"\n{'='*60}")
        print(f"🎭 [SmartDispatcher] New AI interaction request")
        print(f"👤 User input: {user_input}")
        print(f"📋 Original Mode: {session_context.get('mode', 'not_specified')}")
        print(f"{'='*60}")
        
        try:
            # 1. INTENT CLASSIFICATION - Phân tích ý định bằng LLM
            intent_result = self._classify_user_intent(user_input, session_context)
            
            # 2. Sử dụng mode từ intent classification (override mode cũ nếu cần)
            classified_mode = intent_result["mode"]
            original_mode = session_context.get("mode")
            
            # Log intent classification results
            print(f"🧠 Intent Analysis:")
            print(f"   • Classified Mode: {classified_mode}")
            print(f"   • Confidence: {intent_result['confidence']:.2f}")
            print(f"   • Method: {intent_result['classification_method']}")
            print(f"   • Reasoning: {intent_result['reasoning']}")
            
            # Override mode nếu classification có confidence cao hoặc mode không được specify
            if (not original_mode or 
                original_mode not in self.orchestration_agents or 
                intent_result['confidence'] > 0.7):
                
                if original_mode != classified_mode:
                    print(f"🔄 Mode changed: {original_mode} → {classified_mode}")
                
                # Update session context với mode mới
                updated_context = session_context.copy()
                updated_context["mode"] = classified_mode
                updated_context["intent_classification"] = intent_result
            else:
                print(f"🔒 Keeping original mode: {original_mode} (low confidence: {intent_result['confidence']:.2f})")
                updated_context = session_context.copy()
                updated_context["intent_classification"] = intent_result
                classified_mode = original_mode
            
            # 3. Validate final mode
            if classified_mode not in self.orchestration_agents:
                raise ValueError(f"Invalid classified mode: {classified_mode}. Available modes: {list(self.orchestration_agents.keys())}")
            
            # 4. Get the appropriate orchestration agent
            orchestration_agent = self.orchestration_agents[classified_mode]
            print(f"🎯 Selected agent: {orchestration_agent.name}")
            
            # 5. Let the orchestration agent handle the request
            print(f"🚀 Dispatching to {orchestration_agent.name}...")
            agent_result = orchestration_agent.handle_request(user_input, updated_context)
            
            # 6. Prepare final response với intent classification info
            final_result = {
                "agent_name": orchestration_agent.name,
                "classified_mode": classified_mode,
                "original_mode": original_mode,
                "intent_classification": intent_result,
                "action": {
                    "type": f"{classified_mode}_ai_interaction",
                    "orchestrator": orchestration_agent.name,
                    "ai_provider": "gemini" if self.interaction_agent.model else "mock",
                    "status": agent_result.get("status", "success")
                },
                "response_message": agent_result.get("response_text", "No response available"),
                "metadata": agent_result.get("metadata", {}),
                "suggestions": agent_result.get("suggestions", []),
                "status": "success"
            }
            
            print(f"✅ [SmartDispatcher] Request processed successfully")
            print(f"📝 Response length: {len(final_result['response_message'])} characters")
            print(f"{'='*60}\n")
            
            return final_result
            
        except Exception as e:
            print(f"❌ [SmartDispatcher] Error processing request: {str(e)}")
            error_result = {
                "agent_name": "SmartDispatcher",
                "action": {"type": "error_handling", "error": str(e)},
                "response_message": f"Xin lỗi, đã có lỗi xảy ra: {str(e)}",
                "status": "error",
                "error_details": str(e)
            }
            return error_result
    
    def _log_agent_status(self):
        """Log trạng thái của tất cả agents."""
        print("\n📊 Agent Status Report:")
        print("├── Orchestration Agents:")
        for name, agent in self.orchestration_agents.items():
            ai_status = "✓ AI Connected" if hasattr(agent, 'interaction_agent') and agent.interaction_agent else "✗ No AI"
            print(f"│   ├── {name}: {agent.name} ({ai_status})")
        
        print("├── Execution Agents:")
        for name, agent in self.execution_agents.items():
            print(f"│   ├── {name}: {agent.name}")
        
        print("└── Communication Agents:")
        for name, agent in self.communication_agents.items():
            ai_status = "✓ Gemini Pro" if hasattr(agent, 'model') and agent.model else "⚠ Mock Mode"
            print(f"    └── {name}: {agent.name} ({ai_status})")
        print()
    
    def get_system_status(self) -> Dict[str, Any]:
        """
        Lấy trạng thái chi tiết của hệ thống.
        
        Returns:
            Dict chứa thông tin trạng thái hệ thống
        """
        # Check AI connectivity
        ai_connected = hasattr(self.interaction_agent, 'model') and self.interaction_agent.model is not None
        
        return {
            "status": "healthy" if ai_connected else "degraded",
            "ai_integration": {
                "provider": "gemini-pro",
                "status": "connected" if ai_connected else "mock_mode",
                "interaction_agent": "active"
            },
            "orchestration_agents": {
                name: {
                    "status": "active",
                    "ai_enabled": hasattr(agent, 'interaction_agent') and agent.interaction_agent is not None
                }
                for name, agent in self.orchestration_agents.items()
            },
            "execution_agents": {
                name: "active" for name in self.execution_agents.keys()
            },
            "communication_agents": {
                name: "active" for name in self.communication_agents.keys()
            },
            "total_agents": len(self.orchestration_agents) + len(self.execution_agents) + len(self.communication_agents),
            "capabilities": [
                "AI-powered learning assistance",
                "Project management support", 
                "Natural language understanding",
                "Contextual responses",
                "Multi-agent orchestration"
            ]
        }
    
    def test_ai_connection(self) -> Dict[str, Any]:
        """
        Test kết nối AI và trả về thông tin chi tiết.
        
        Returns:
            Dict chứa kết quả test
        """
        print("🧪 Testing AI connection...")
        
        try:
            # Test với một câu hỏi đơn giản
            test_context = {
                "mode": "learning",
                "current_lesson": "Test Connection",
                "user_id": "test_user"
            }
            
            result = self.dispatch("Chào ALVA, bạn có thể nghe thấy tôi không?", test_context)
            
            return {
                "status": "success" if result.get("status") == "success" else "failed",
                "ai_provider": "gemini" if self.interaction_agent.model else "mock",
                "response_received": bool(result.get("response_message")),
                "response_length": len(result.get("response_message", "")),
                "test_timestamp": "now",
                "details": result
            }
            
        except Exception as e:
            return {
                "status": "failed",
                "error": str(e),
                "ai_provider": "unknown",
                "test_timestamp": "now"
            }