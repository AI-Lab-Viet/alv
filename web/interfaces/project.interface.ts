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
