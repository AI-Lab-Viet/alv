import asyncio
from typing import Any, Dict
from unittest import result

from agents.communication.interaction_agent import InteractionAgent
from agents.execution.practice_agent import PracticeAgent
from agents.execution.quiz_agent import QuizAgent
from .celery_queue import celery_queue

interaction_agent = InteractionAgent()
AGENT_REGISTRY = {
    "practice": PracticeAgent(interaction_agent=interaction_agent),
    "quiz": QuizAgent(interaction_agent=interaction_agent)
}

@celery_queue.task(name="task_consumer.generate_practice_activity", queue="practice")
def generate_practice_activity(job: Dict[str, Any]):
    agent: PracticeAgent = AGENT_REGISTRY.get("practice")
    print(f"[PracticeTask] Received job: {job}")

    result = asyncio.run(agent.execute(job.get("job")))

    print(f"[PracticeTask] Result: {result}")
    return result

def generate_quiz(job: Dict[str, Any]):
    agent: QuizAgent = AGENT_REGISTRY.get("quiz")
    result = agent.execute(job)
    print(f"Generating quiz for job: {job}")
    return result
