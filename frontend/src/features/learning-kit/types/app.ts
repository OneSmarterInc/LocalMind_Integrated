export type ModuleStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NEEDS_REVIEW';

export type ModuleCategory =
  | 'Basics'
  | 'Advanced'
  | 'Compliance';

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: ModuleCategory;
  status: ModuleStatus;
  difficulty: string;
  icon: string;
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface QuestionOption {
  id: string;
  label: string;
  description: string;
}

export interface Question {
  id: string;
  question: string;
  description: string;
  options: QuestionOption[];
  correctOptionId: string;
}

export interface ProgressMetric {
  id: string;
  title: string;
  percentage: number;
  status: string;
  description: string;
}