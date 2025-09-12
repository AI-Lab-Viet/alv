"""
Middleware functions for FastAPI
"""
import time
from fastapi import Request
from api.config import app_stats

async def add_process_time_header(request: Request, call_next):
    """Middleware để đo thời gian xử lý request."""
    start_time = time.time()
    
    # Track request statistics
    app_stats["total_requests"] += 1
    
    try:
        response = await call_next(request)
        app_stats["successful_requests"] += 1
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response
    except Exception as e:
        app_stats["failed_requests"] += 1
        raise e
