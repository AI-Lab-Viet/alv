import { DetailedProject } from "./project.interface";

export interface Message {
  message: string;
  sender: "user" | "ai";
}

export interface ISessionHistoryResponse {
  mission_detail: DetailedProject;
  chat_history: Message[];
  mission_id: string;
  session_id: string;
}

export interface PromptStarterType {
  prompt: string;
  title: string;
}
