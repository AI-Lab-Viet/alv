export interface DetailedProject {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_hours: string;
  context: string;
  learning_objectives: string[];
  deliverables: string[];
  tips: string[];
  participants: number;
  rating: number;
  core_skills: string[];
  thumbnail: string;
  featured?: boolean;
  skills_required: string[];
}

export interface IAnalysisResponse {
  featured_prompts: string[];
  skills: string[];
  summary: string;
}

export interface IFinishSessionResponse {
  status: string;
  analysis: IAnalysisResponse;
  mission: DetailedProject;
  session_id: string;
  
  
}