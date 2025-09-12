import { ISessionHistoryResponse } from "@/interfaces/chat.interface";
import api from "./axios.service";
import axios, { AxiosError } from "axios";
import { IFinishSessionResponse } from "@/interfaces/session.interface";

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
    return response.data as ISessionHistoryResponse;
  } catch (error: unknown) {
    // Gracefully handle "no history yet" case
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.info("No chat history yet for session", sessionId);
      // Return an empty history so the caller can treat it as a non-fatal state
      return {
        mission_id: "",
        session_id: sessionId,
        mission_detail:
          undefined as unknown as ISessionHistoryResponse["mission_detail"],
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
    return response;
  } catch (error) {
    console.error("Failed to start session:", error);
    throw new Error("Unable to start session");
  }
}

export async function finishSession(
  sessionId: string,
  finalSubmission: string,
  reflection: string
) {
  try {
    const response = await api.post(
      `/api/end`,
      { reflection: reflection, submission: finalSubmission },
      {
        params: {
          session_id: sessionId,
        },
      }
    );
    return response.data as IFinishSessionResponse;
  } catch (error) {
    console.error("Failed to finish session:", error);
    throw new Error("Unable to finish session");
  }
}
