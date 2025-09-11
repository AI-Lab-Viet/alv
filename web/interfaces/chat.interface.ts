import { DetailedProject } from "./project.interface";

export interface Message {
  message: string;
  sender: "user" | "ai";
}

export interface ISessionHistoryResponse {
  mission_detail: DetailedProject;
  chat_history: Message[];
}

export interface PromptStarterType {
  prompt: string;
  title: string;
}
