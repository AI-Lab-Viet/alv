import { Message } from "@/interfaces/chat.interface";
import api from "./axios.service";
import { IStartSessionResponse } from "@/interfaces/session.interface";

export async function getChatHistory({ sessionId }: { sessionId: string }) {
  try {
    const response = await api.get(`/api/history/${sessionId}`);
    console.log("Chat history response:", response);
    return response.data.chats as Message[];
  } catch (error) {
    console.error("Failed to get chat history:", error);
    throw new Error("Unable to retrieve chat history");
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
