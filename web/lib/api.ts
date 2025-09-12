export interface LearningRequest {
  chapter_id: string;
  query: string;
  topic: string;
  user_id: string;
  session_id: string;
  current_state: number;
  exercise_data?: any;
}

export interface LearningResponse {
  response_from: string;
  response_text: string;
  task_id: string | null;
  status: "success" | "error";
  state: number;
  metadata: {
    lesson: any | null;
  };
}

export interface LessonBlock {
  section: string;
  id: string;
  chapter: number;
  block_type: string;
  content: string;
  display_order: number;
}

export interface KnowledgeVaultItem {
  id: string;
  user_id: string;
  chapter: number;
  title: string;
  skill: string;
  definition: string;
  explanation: string;
  status: string;
  examples: string[];
  tags: string[];
}

export interface KnowledgeVaultQuery {
  search?: string;
  skill?: string;
  chapter?: string | number;
}

export interface TaskResult {
  status: "SUCCESS" | "PENDING" | "FAILED";
  result: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function poolingExerciseDate(
  task_id: string
): Promise<TaskResult> {
  const res = await fetch(`${API_BASE_URL}/tasks/${task_id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  const data = await res.json();
  if (data.status === "PENDING") {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
    return poolingExerciseDate(task_id); // recursive call
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return data;
}

export async function postLearningRequest(
  data: LearningRequest
): Promise<LearningResponse> {
  const res = await fetch(`${API_BASE_URL}/learning`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function getLessonsByChapter(
  chapter: string
): Promise<LessonBlock[]> {
  const res = await fetch(
    `${API_BASE_URL}/lessons?chapter=${encodeURIComponent(chapter)}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function getKnowledgeVault(
  user_id: string,
  query?: KnowledgeVaultQuery
): Promise<KnowledgeVaultItem[]> {
  const params = new URLSearchParams();
  if (query?.search) params.append("search", query.search);
  if (query?.skill) params.append("skill", query.skill);
  if (query?.chapter) params.append("chapter", String(query.chapter));

  const url = `${API_BASE_URL}/knowledge-vault/${encodeURIComponent(user_id)}${
    params.toString() ? "?" + params.toString() : ""
  }`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}
