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
  analysis_data: {
    featured_prompts: string[];
    skills: string[];
    summary: string;
  };
}

export interface PortfolioProject {
  id: string;
  final_product: string;
  featured_prompts: string[];
  skills: string[];
  total_messages: number;
  created_at: string;
  mission_name: string;
  mission_description: string;
  reflection: string;
}

export interface IGetProjectByNameResponse {
  total_missions: number;
  missions: DetailedProject[];
}
