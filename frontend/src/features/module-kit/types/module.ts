export type ModuleCategory =
  | 'Basics'
  | 'Advanced'
  | 'Compliance';

export type ModuleStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NEEDS_REVIEW';

export type ModuleDifficulty =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced';

export type ActivityType =
  | 'INTRO'
  | 'QUESTION'
  | 'QUIZ'
  | 'READING'
  | 'REFLECTION'
  | 'SCENARIO';

export interface ModuleActivity {
  id: string;
  title: string;
  type: ActivityType;

  description?: string;
  duration?: number;

  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;

  completed?: boolean;
}

export interface ModuleItem {
  id: string;
  code: string;
  title: string;
  description: string;

  duration: number;

  category: ModuleCategory;
  difficulty: ModuleDifficulty;
  status: ModuleStatus;

  icon: string;
  progress: number;

  activities?: ModuleActivity[];
}