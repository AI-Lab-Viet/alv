import { DetailedProject } from "./project.interface";

export interface IStartSessionResponse {
  session_id: string;
  user_id: string;
  mission: DetailedProject;
}

export interface IFinishSessionResponse {
  analysis: {
    analysis_data: {
      mission_detail: string;
      skills: string;
      summary: string;
    };
    reflection: string;
    submission: string;
  };
  mission: DetailedProject;
  portfolio: {
    data_saved: {
      final_product: string;
      key_prompts: string[];
      skills_applied: string[];
    };
  };
  session_id: string;
  user_id: string;
}
