import { ISessionHistoryResponse } from "@/interfaces/chat.interface";
import api from "./axios.service";
import axios, { AxiosError } from "axios";

export async function getChatHistory({
  sessionId,
}: {
  sessionId: string;
}): Promise<ISessionHistoryResponse> {
  try {
    const response = await api.get(`/api/history/`, {
      params: {
        session_id: sessionId,
      },
    });
    console.log("Chat history response:", response);
    return {
      mission_detail: response.data.mission_detail,
      chat_history: response.data.chat_history,
    };
  } catch (error: unknown) {
    // Gracefully handle "no history yet" case
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.info("No chat history yet for session", sessionId);
      // Return an empty history so the caller can treat it as a non-fatal state
      return {
        mission_detail: undefined as unknown as ISessionHistoryResponse["mission_detail"],
        chat_history: [],
      } as ISessionHistoryResponse;
    }

    // Re-throw original error so callers still have access to status code etc.
    throw error;
  }
}

export async function startSession(missionId: string) {
  try {
    const response = await api.post(`/api/start`, {
      mission_id: missionId,
    });
    console.log("Start session response:", response);
    return response;
  } catch (error) {
    console.error("Failed to start session:", error);
    throw new Error("Unable to start session");
  }
}

export async function finishSession(missionId: string) {
  try {
    const response = await api.post(`/api/end`, {
      mission_id: missionId,
    });
    console.log("Finish session response:", response);
    return response.data;
  } catch (error) {
    console.error("Failed to finish session:", error);
    throw new Error("Unable to finish session");
  }
}
