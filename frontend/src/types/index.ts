export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  level_id: number;
  xp: number;
  study_days: number;
  created_at: string;
  totalQuizzes?: number;
  avgScore?: number;
  rank?: number;
  badges?: Badge[];
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned_at?: string;
}

export interface SubTopic {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  question_count: number;
  parent_id: number;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  color: string;
  question_count: number;
  children?: SubTopic[];
}

export interface Level {
  id: number;
  name: string;
  description: string;
  questionCount: number;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  buttonBg: string;
  gradient: string;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  topic_id: number;
  topic_name?: string;
  topic_icon?: string;
  topic_color?: string;
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao' | 'Chuyên sâu';
  question_count: number;
  time_limit: number;
  questions?: Question[];
}

export interface Question {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer?: number;
  explanation?: string;
}

export interface QuizResult {
  id: number;
  quiz_id: number;
  quiz_title: string;
  topic_name: string;
  level: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_spent: number;
  passed: boolean;
  completed_at: string;
}

export interface LeaderboardEntry {
  id: number;
  rank: number;
  name: string;
  avatar?: string;
  xp: number;
  level_id: number;
  isCurrentUser?: boolean;
}

export interface UserStats {
  total_quizzes: number;
  avg_score: number;
  passed_count: number;
  total_correct: number;
  total_questions: number;
  xp: number;
  study_days: number;
  rank: number;
  totalUsers: number;
  rankPercentage: number;
}
