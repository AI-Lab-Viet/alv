import { DIFFICULTY } from "@/consts/common";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  participants: number;
  rating: number;
  skills: string[];
  thumbnail: string;
}

export interface DetailedProject {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  context: string;
  objectives: string[];
  deliverables: string[];
  tips: string[];
  participants: number;
  rating: number;
  skills: string[];
  thumbnail: string;
}
