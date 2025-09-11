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
  domain_skills: string[];
  skills_required?: string[];
  thumbnail: string;
  featured?: boolean;
  alv_skills: string[];
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

export interface PortfolioProject {
  id: string;
  final_product: string;
  key_prompts: string[];
  skills_applied: string[];
  completeion_time: number;
  created_at: string;
}

export interface IGetProjectByNameResponse {
  total_missions: number;
  missions: DetailedProject[];
}
