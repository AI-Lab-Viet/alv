# Models Package
"""
Các model dữ liệu và schema cho API
- Pydantic models cho request/response
"""

from .schemas import InteractionRequest, InteractionResponse

__all__ = ["InteractionRequest", "InteractionResponse"]
