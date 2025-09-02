#!/usr/bin/env python3
"""
RAG Engine cho AI Lab Việt Multi-Agent System.

Implements dual-source RAG strategy:
1. Tutor ALVA: Primary = Curriculum, Secondary = Chat History  
2. Project ALVA: Primary = Chat History, Secondary = Curriculum

Author: AI Lab Việt
"""

from typing import Dict, Any, List, Optional, Tuple
import re, os
from dataclasses import dataclass
from database.db_supabase import DbSupabase
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from google import genai
from google.genai.types import EmbedContentConfig
import ast

@dataclass
class RAGResult:
    """Kết quả RAG search."""
    source_type: str  # "curriculum" hoặc "chat_history"
    content: str
    relevance_score: float
    metadata: Dict[str, Any]

@dataclass
class DocumentModel:
    id: str
    content: Dict[str, Any]  # JSON structured content
    embedding: List[float]

class CurriculumRAG:
    """
    RAG Engine cho Bộ giáo trình.
    
    Mô phỏng việc tìm kiếm trong giáo trình dựa trên keywords và concepts.
    Trong thực tế sẽ kết nối với vector database hoặc search engine.
    """
    
    def __init__(self):
        """Khởi tạo với mock curriculum data."""
        self.curriculum_data: List[DocumentModel] = self._load_curriculum()
        print(f"[CurriculumRAG] Initialized with {len(self.curriculum_data)} curriculum entries")
    
    def _load_curriculum(self) -> List[DocumentModel]:
        """
        Load mock curriculum data.
        Trong thực tế sẽ load từ vector database hoặc knowledge base.
        """
        db = DbSupabase()
        return db.find_all("documents", DocumentModel)

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
        query_embedding = embed_text([query_lower])[0]
        results = []
        for concept_data in self.curriculum_data:
            doc_embedding = concept_data.embedding

            if not doc_embedding or len(doc_embedding) == 0:
                continue  

            if isinstance(doc_embedding, str):
                doc_embedding = ast.literal_eval(doc_embedding)
            relevance_score = self._calculate_relevance(query_embedding, doc_embedding)
            content = concept_data.content

            result = RAGResult(
                source_type="curriculum",
                content=content,
                relevance_score=relevance_score,
                metadata={
                    "concept_id": concept_data.id,
                    "title": content,
                    "source": "curriculum_database"
                }
            )
            results.append(result)
        
        # Sắp xếp theo relevance score giảm dần
        results.sort(key=lambda x: x.relevance_score, reverse=True)
        return results[:max_results]
    
    def _calculate_relevance(self, query_vec: List[float], doc_vec: List[float]) -> float:
        """Cosine similarity"""
        if not query_vec or not doc_vec:
            return 0.0
        query_vec = np.array(query_vec).reshape(1, -1)
        doc_vec = np.array(doc_vec).reshape(1, -1)
        return float(cosine_similarity(query_vec, doc_vec)[0][0])

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
            for step in concept_data["steps"]:
                content_parts.append(f"• {step}")
        
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

def embed_text(chunks, dim=1536):
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=chunks,
        config=EmbedContentConfig(output_dimensionality=dim)
    )
    return [e.values for e in response.embeddings]