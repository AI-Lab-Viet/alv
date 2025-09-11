import { DetailedProject } from "./project.interface";

export interface IStartSessionResponse {
  session_id: string;
  user_id: string;
  mission: DetailedProject;
}
