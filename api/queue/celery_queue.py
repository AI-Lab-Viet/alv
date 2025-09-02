import os
from kombu import Queue
from celery import Celery

host = os.getenv("REDIS_HOST", "localhost")
port = int(os.getenv("REDIS_PORT", "6379"))
db = int(os.getenv("REDIS_DB_CELERY", "1"))
REDIS_URL = f"redis://{host}:{port}/{db}"

celery_queue = Celery(
    "alva",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery_queue.conf.task_queues = (
    Queue("generic"),
    Queue("practice"),
    Queue("quiz"),
)

celery_queue.conf.task_default_queue = "generic"
celery_queue.conf.worker_send_task_events = True

