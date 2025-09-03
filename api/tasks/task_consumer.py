from typing import Any, Dict
from .celery_queue import celery_queue

@celery_queue.task(name="task_consumer.generate_practice_activity", queue="practice")
def generate_practice_activity(query: Dict[str, Any]):
    print(f"Generating practice activity for query: {query}")
    return {"answer": f"Activity for {query}"}

@celery_queue.task(name="task_consumer.generate_quiz", queue="quiz")
def generate_quiz(topic: str):
    print(f"Generating quiz for topic: {topic}")
    return {"quiz": f"Quiz for {topic}"}
