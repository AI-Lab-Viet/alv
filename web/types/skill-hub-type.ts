import { MessageSquare } from "lucide-react";

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  icon: typeof MessageSquare;
  color: string;
  lessons: number;
  duration: string;
  progress: number;
  difficulty: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizList {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  questions: QuizQuestion[];
}
