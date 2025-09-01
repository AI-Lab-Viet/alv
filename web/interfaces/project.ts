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
