#!/usr/bin/env python3
"""
RAG Engine cho AI Lab Việt Multi-Agent System.

Implements dual-source RAG strategy:
1. Tutor ALVA: Primary = Curriculum, Secondary = Chat History  
2. Project ALVA: Primary = Chat History, Secondary = Curriculum

Author: AI Lab Việt
"""

from typing import Dict, Any, List, Optional, Tuple
import re
from dataclasses import dataclass


@dataclass
class RAGResult:
    """Kết quả RAG search."""
    source_type: str  # "curriculum" hoặc "chat_history"
    content: str
    relevance_score: float
    metadata: Dict[str, Any]


class CurriculumRAG:
    """
    RAG Engine cho Bộ giáo trình.
    
    Mô phỏng việc tìm kiếm trong giáo trình dựa trên keywords và concepts.
    Trong thực tế sẽ kết nối với vector database hoặc search engine.
    """
    
    def __init__(self):
        """Khởi tạo với mock curriculum data."""
        self.curriculum_data = self._load_mock_curriculum()
        print(f"[CurriculumRAG] Initialized with {len(self.curriculum_data)} curriculum entries")
    
    def _load_mock_curriculum(self) -> Dict[str, Dict[str, Any]]:
        """
        Load mock curriculum data.
        Trong thực tế sẽ load từ vector database hoặc knowledge base.
        """
        return {
            "delegation": {
                "title": "Delegation - Nghệ thuật Ủy thác",
                "definition": "Delegation là quá trình giao phó trách nhiệm và quyền hạn cho người khác để hoàn thành một nhiệm vụ cụ thể, trong khi vẫn giữ trách nhiệm cuối cùng về kết quả.",
                "key_principles": [
                    "Chọn đúng người cho đúng việc",
                    "Giao phó rõ ràng trách nhiệm và quyền hạn", 
                    "Thiết lập mốc thời gian và tiêu chí đánh giá",
                    "Theo dõi tiến độ nhưng không vi quản lý"
                ],
                "examples": [
                    "CEO giao cho Marketing Manager phụ trách chiến dịch Q4",
                    "Team Lead ủy thác cho Developer senior thiết kế architecture",
                    "Giám đốc dự án giao cho BA phụ trách thu thập requirements"
                ],
                "common_mistakes": [
                    "Giao việc nhưng không giao quyền",
                    "Vi quản lý thay vì theo dõi",
                    "Không thiết lập tiêu chí thành công rõ ràng"
                ],
                "keywords": ["delegation", "ủy thác", "giao phó", "phân công", "leadership"]
            },
            "rctc_framework": {
                "title": "R.C.T.C Framework - Khung tư duy Giải quyết vấn đề",
                "definition": "R.C.T.C là framework 4 bước để giải quyết vấn đề: Recognize (Nhận diện), Clarify (Làm rõ), Think (Suy nghĩ), Choose (Lựa chọn).",
                "steps": {
                    "R - Recognize": "Nhận diện và xác định vấn đề thực sự",
                    "C - Clarify": "Làm rõ nguyên nhân gốc rễ và thu thập thông tin",
                    "T - Think": "Suy nghĩ và đưa ra các phương án giải quyết",
                    "C - Choose": "Lựa chọn phương án tối ưu và thực thi"
                },
                "examples": [
                    "Giải quyết xung đột trong team",
                    "Tối ưu hóa quy trình làm việc",
                    "Xử lý khiếu nại khách hàng"
                ],
                "keywords": ["rctc", "problem solving", "giải quyết vấn đề", "framework", "tư duy"]
            }
        }
    
    def search(self, query: str, max_results: int = 3) -> List[RAGResult]:
        """
        Tìm kiếm trong curriculum dựa trên query.
        
        Args:
            query: Câu hỏi hoặc từ khóa tìm kiếm
            max_results: Số kết quả tối đa
            
        Returns:
            List các RAGResult được sắp xếp theo relevance
        """
        query_lower = query.lower()
        results = []
        
        for concept_id, concept_data in self.curriculum_data.items():
            relevance_score = self._calculate_relevance(query_lower, concept_data)
            
            if relevance_score > 0:
                # Tạo content summary từ concept data
                content = self._format_concept_content(concept_data)
                
                result = RAGResult(
                    source_type="curriculum",
                    content=content,
                    relevance_score=relevance_score,
                    metadata={
                        "concept_id": concept_id,
                        "title": concept_data["title"],
                        "source": "curriculum_database"
                    }
                )
                results.append(result)
        
        # Sắp xếp theo relevance score giảm dần
        results.sort(key=lambda x: x.relevance_score, reverse=True)
        
        return results[:max_results]
    
    def _calculate_relevance(self, query: str, concept_data: Dict[str, Any]) -> float:
        """
        Tính toán độ liên quan giữa query và concept.
        Trong thực tế sẽ sử dụng embedding similarity.
        """
        score = 0.0
        
        # Check keywords
        keywords = concept_data.get("keywords", [])
        for keyword in keywords:
            if keyword.lower() in query:
                score += 1.0
        
        # Check title
        title_words = concept_data.get("title", "").lower().split()
        for word in title_words:
            if word in query:
                score += 0.8
        
        # Check definition
        definition = concept_data.get("definition", "").lower()
        query_words = query.split()
        for word in query_words:
            if len(word) > 3 and word in definition:
                score += 0.5
        
        return score
    
    def _format_concept_content(self, concept_data: Dict[str, Any]) -> str:
        """Format concept data thành text để đưa vào prompt."""
        content_parts = []
        
        # Title và Definition
        content_parts.append(f"**{concept_data['title']}**")
        content_parts.append(f"Định nghĩa: {concept_data['definition']}")
        
        # Key principles/steps
        if "key_principles" in concept_data:
            content_parts.append("Nguyên tắc chính:")
            for principle in concept_data["key_principles"]:
                content_parts.append(f"• {principle}")
        
        if "steps" in concept_data:
            content_parts.append("Các bước thực hiện:")
            for step, desc in concept_data["steps"].items():
                content_parts.append(f"• {step}: {desc}")
        
        # Examples
        if "examples" in concept_data:
            content_parts.append("Ví dụ thực tế:")
            for example in concept_data["examples"][:2]:  # Chỉ lấy 2 ví dụ
                content_parts.append(f"• {example}")
        
        return "\n".join(content_parts)


class ChatHistoryRAG:
    """
    RAG Engine cho Chat History.
    
    Trích xuất ngữ cảnh từ lịch sử cuộc trò chuyện.
    """
    
    def __init__(self):
        print(f"[ChatHistoryRAG] Initialized for conversation context extraction")
    
    def search(self, chat_history: List[Dict[str, Any]], query: str, max_results: int = 5) -> List[RAGResult]:
        """
        Tìm kiếm trong chat history dựa trên query.
        
        Args:
            chat_history: Lịch sử cuộc trò chuyện
            query: Câu hỏi hiện tại
            max_results: Số tin nhắn tối đa
            
        Returns:
            List các RAGResult từ chat history
        """
        if not chat_history:
            return []
        
        results = []
        query_lower = query.lower()
        
        # Lấy tin nhắn gần đây nhất (có relevance cao hơn)
        recent_messages = chat_history[-max_results*2:] if len(chat_history) > max_results*2 else chat_history
        
        for i, message in enumerate(recent_messages):
            relevance_score = self._calculate_message_relevance(message, query_lower, i, len(recent_messages))
            
            if relevance_score > 0:
                content = self._format_message_content(message)
                
                result = RAGResult(
                    source_type="chat_history",
                    content=content,
                    relevance_score=relevance_score,
                    metadata={
                        "message_index": i,
                        "role": message.get("role", "unknown"),
                        "timestamp": message.get("timestamp", "unknown")
                    }
                )
                results.append(result)
        
        # Sắp xếp theo relevance
        results.sort(key=lambda x: x.relevance_score, reverse=True)
        
        return results[:max_results]
    
    def _calculate_message_relevance(self, message: Dict[str, Any], query: str, position: int, total: int) -> float:
        """Tính relevance của message với query hiện tại."""
        content = self._extract_message_text(message).lower()
        
        # Base score dựa trên vị trí (tin nhắn gần đây có score cao hơn)
        recency_score = (position + 1) / total * 0.5
        
        # Content relevance
        content_score = 0.0
        query_words = query.split()
        
        for word in query_words:
            if len(word) > 2 and word in content:
                content_score += 0.3
        
        # Bonus cho user messages (thường chứa context quan trọng)
        role_bonus = 0.2 if message.get("role") == "user" else 0.1
        
        return recency_score + content_score + role_bonus
    
    def _extract_message_text(self, message: Dict[str, Any]) -> str:
        """Trích xuất text từ message."""
        parts = message.get("parts", [])
        if isinstance(parts, list):
            return " ".join(str(part) for part in parts)
        return str(parts)
    
    def _format_message_content(self, message: Dict[str, Any]) -> str:
        """Format message để đưa vào context."""
        role = message.get("role", "unknown")
        content = self._extract_message_text(message)
        
        role_label = "Người dùng" if role == "user" else "ALVA"
        return f"{role_label}: {content}"


class DualSourceRAGEngine:
    """
    Main RAG Engine implementing dual-source strategy.
    
    Tutor ALVA: Primary = Curriculum, Secondary = Chat History
    Project ALVA: Primary = Chat History, Secondary = Curriculum
    """
    
    def __init__(self):
        """Khởi tạo cả hai RAG engines."""
        self.curriculum_rag = CurriculumRAG()
        self.chat_rag = ChatHistoryRAG()
        print(f"[DualSourceRAGEngine] Initialized with dual-source strategy")
    
    def search_for_tutor(self, query: str, chat_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        RAG search cho Tutor ALVA.
        Primary: Curriculum, Secondary: Chat History
        """
        print(f"[DualSourceRAGEngine] Tutor RAG search for: {query[:50]}...")
        
        # Primary: Search curriculum
        curriculum_results = self.curriculum_rag.search(query, max_results=2)
        
        # Secondary: Search chat history for context
        chat_results = self.chat_rag.search(chat_history, query, max_results=3)
        
        return {
            "primary_source": "curriculum",
            "curriculum_knowledge": curriculum_results,
            "chat_context": chat_results,
            "rag_summary": self._create_tutor_rag_summary(curriculum_results, chat_results)
        }
    
    def search_for_project(self, query: str, chat_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        RAG search cho Project ALVA.
        Primary: Chat History, Secondary: Curriculum (nếu có keywords)
        """
        print(f"[DualSourceRAGEngine] Project RAG search for: {query[:50]}...")
        
        # Primary: Search chat history for project context
        chat_results = self.chat_rag.search(chat_history, query, max_results=5)
        
        # Secondary: Search curriculum if query contains curriculum keywords
        curriculum_results = []
        if self._contains_curriculum_keywords(query):
            curriculum_results = self.curriculum_rag.search(query, max_results=1)
        
        return {
            "primary_source": "chat_history", 
            "project_context": chat_results,
            "curriculum_support": curriculum_results,
            "rag_summary": self._create_project_rag_summary(chat_results, curriculum_results)
        }
    
    def _contains_curriculum_keywords(self, query: str) -> bool:
        """Kiểm tra xem query có chứa keywords liên quan đến curriculum không."""
        curriculum_keywords = [
            "delegation", "ủy thác", "phân công",
            "rctc", "giải quyết vấn đề", 
            "machine learning", "học máy", "overfitting",
            "framework", "nguyên tắc", "phương pháp"
        ]
        
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in curriculum_keywords)
    
    def _create_tutor_rag_summary(self, curriculum_results: List[RAGResult], chat_results: List[RAGResult]) -> str:
        """Tạo summary cho Tutor ALVA RAG results."""
        summary_parts = []
        
        if curriculum_results:
            summary_parts.append("=== KIẾN THỨC TỪ GIÁO TRÌNH ===")
            for result in curriculum_results:
                summary_parts.append(result.content)
                summary_parts.append("")
        
        if chat_results:
            summary_parts.append("=== NGỮ CẢNH CUỘC TRÒ CHUYỆN ===")
            for result in chat_results[:3]:  # Chỉ lấy 3 tin nhắn gần nhất
                summary_parts.append(result.content)
        
        return "\n".join(summary_parts) if summary_parts else "Không có thông tin RAG liên quan."
    
    def _create_project_rag_summary(self, chat_results: List[RAGResult], curriculum_results: List[RAGResult]) -> str:
        """Tạo summary cho Project ALVA RAG results."""
        summary_parts = []
        
        if chat_results:
            summary_parts.append("=== NGỮ CẢNH DỰ ÁN ===")
            for result in chat_results:
                summary_parts.append(result.content)
            summary_parts.append("")
        
        if curriculum_results:
            summary_parts.append("=== KIẾN THỨC HỖ TRỢ TỪ GIÁO TRÌNH ===")
            for result in curriculum_results:
                summary_parts.append(result.content)
        
        return "\n".join(summary_parts) if summary_parts else "Ngữ cảnh dự án: Đang bắt đầu cuộc trò chuyện mới."
