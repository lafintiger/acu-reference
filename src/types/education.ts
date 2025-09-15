// Education System Types
// Types for quizzes, learning modules, and educational content

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: 'points' | 'theory' | 'safety' | 'modalities' | 'protocols';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  passingScore: number; // Percentage required to pass
  timeLimit?: number; // Minutes, optional
  tags: string[];
  createdAt: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation: string;
  points: number;
  references?: string[];
  imageUrl?: string;
  audioUrl?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'theory' | 'points' | 'modalities' | 'safety' | 'clinical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // Minutes
  prerequisites?: string[]; // Other module IDs
  tags: string[];
  createdAt: string;
  sections: LearningSection[];
  quiz?: Quiz; // Optional assessment
}

export interface LearningSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive' | 'practice';
  duration: number; // Minutes
  resources?: LearningResource[];
}

export interface LearningResource {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'link';
  title: string;
  url: string;
  description?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId?: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  passed?: boolean;
  answers: QuizAnswer[];
  timeSpent?: number; // Seconds
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent?: number; // Seconds on this question
}

export interface LearningProgress {
  userId?: string;
  moduleId: string;
  startedAt: string;
  completedAt?: string;
  currentSectionId?: string;
  completedSections: string[];
  quizAttempts: QuizAttempt[];
  totalTimeSpent: number; // Minutes
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  modules: string[]; // Module IDs in order
  estimatedWeeks: number;
  dailyStudyTime: number; // Minutes
  tags: string[];
}
