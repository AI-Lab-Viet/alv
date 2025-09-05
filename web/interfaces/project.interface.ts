import { DIFFICULTY } from "@/consts/common";

export interface DetailedProject {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_hours: string;
  context: string;
  objectives: string[];
  deliverables: string[];
  tips: string[];
  participants: number;
  rating: number;
  skills: string[];
  thumbnail: string;
  featured?: boolean;
}
