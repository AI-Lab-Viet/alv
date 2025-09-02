from .celery_queue import celery_queue

@celery_queue.task(queue="practice")
def generate_practice_activity(query: str):
    return {"answer": f"Activity for {query}"}

@celery_queue.task(queue="quiz")
def generate_quiz(topic: str):
    return {"quiz": f"Quiz for {topic}"}
