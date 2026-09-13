import { EducationLevel } from './index';

export type UserRole = 'student' | 'admin' | 'superadmin';
export type AccountStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  password?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentId: string; // e.g. "SQ-2026-0042"
  fullName: string;
  nickname: string;
  phone: string;
  email: string;
  school: string;
  grade: number; // 1-12
  level: EducationLevel; // SD, SMP, SMA
  curriculum: string; // "Kurikulum Merdeka", "Kurikulum 2013", etc.
  academicYear: string; // "2026/2027"
  city: string;
  program: string; // "Reguler Bimbel", "Intensif UTBK / SNBT", "Persiapan Olimpiade"
  batch: string; // "Gelombang 1 - 2026"
  startDate: string;
  endDate?: string;
  parentName?: string;
  parentPhone?: string;
  assignedSubjectIds: string[];
  
  // Onboarding metadata
  onboardingCompleted: boolean;
  currentOnboardingStep: number; // 1 to 5
  diagnosticCompleted: boolean;
}

export interface StudentGoals {
  studentId: string;
  primaryGoals: string[]; // ["Persiapan UTBK/SNBT", "Meningkatkan nilai sekolah", etc.]
  targetGrades: Record<string, { currentGrade: number; targetGrade: number }>; // subjectId -> {current, target}
  targetCampusOrSchool?: string;
  updatedAt: string;
}

export interface StudentPreferences {
  studentId: string;
  selfAssessmentUnderstanding: Record<string, number>; // subjectId -> 1 to 5 (Likert scale)
  easiestSubjectId: string;
  hardestSubjectId: string;
  challengingTopics: string;
  studyTimePreference: 'pagi' | 'siang' | 'sore' | 'malam'; // e.g. 19.00 - 21.00
  averageStudyDurationMinutes: number; // e.g. 45
  learningStylePreference: 'visual' | 'auditory' | 'reading_writing' | 'practice' | 'mixed';
  updatedAt: string;
}

export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;
// 0: Not Assessed
// 1: Foundation Gap
// 2: Developing
// 3: Proficient
// 4: Advanced
// 5: Mastered

export interface ConceptMastery {
  id: string;
  studentId: string;
  subjectId: string;
  chapterId: string;
  topicId: string;
  conceptId: string;
  conceptName: string;
  score: number; // 0 - 100
  level: MasteryLevel;
  lastStudiedAt?: string;
  reviewCount: number;
  
  // Evidence metrics
  questionsAttempted: number;
  questionsCorrect: number;
  averageTimeSeconds: number;
  masteredSkills: string[];
  needsImprovementSkills: string[];
  status: 'Mastered' | 'Strong' | 'Developing' | 'Needs Review' | 'Learning Gap' | 'Not Started';
}

export interface MasteryHistoryRecord {
  id: string;
  studentId: string;
  conceptId: string;
  conceptName: string;
  previousScore: number;
  newScore: number;
  reason: string; // "Diagnostic Assessment", "Quiz Bab 1", "Exercise", "Spaced Review"
  activityId?: string;
  timestamp: string;
}

export interface LearningGap {
  id: string;
  studentId: string;
  subjectId: string;
  strugglingConceptId: string;
  strugglingConceptName: string;
  rootProblemConceptId: string;
  rootProblemConceptName: string;
  currentMasteryScore?: number;
  explanation: string;
  recommendedReviewTopicId: string;
  estimatedMinutes: number;
  resolved: boolean;
}

export interface NextBestAction {
  id: string;
  studentId: string;
  type: 'foundation_review' | 'continue_learning' | 'practice_exercise' | 'mini_quiz' | 'mastery_reinforcement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  subjectId: string;
  chapterId?: string;
  conceptId?: string;
  materiId?: string;
  estimatedMinutes: number;
  reason: string; // e.g. "Mastery turun menjadi 67% (Forgetting Curve)", "Prasyarat untuk Ikatan Kimia"
  actionUrl?: string;
  completed: boolean;
}

export interface TodayLearningTask {
  id: string;
  studentId: string;
  title: string;
  durationMinutes: number;
  type: 'review' | 'learn' | 'practice' | 'quiz';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  subjectId: string;
  materiId?: string;
}

export type LearningEventType = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'LESSON_STARTED'
  | 'LESSON_COMPLETED'
  | 'AUDIO_LISTENED'
  | 'QUIZ_STARTED'
  | 'QUESTION_ANSWERED'
  | 'QUIZ_COMPLETED'
  | 'DIAGNOSTIC_COMPLETED'
  | 'MASTERY_UPDATED'
  | 'RECOMMENDATION_CREATED'
  | 'RECOMMENDATION_COMPLETED';

export interface LearningEvent {
  id: string;
  studentId: string;
  eventType: LearningEventType;
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  activityId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface LearningStreak {
  studentId: string;
  currentStreakDays: number;
  bestStreakDays: number;
  lastActivityDate: string; // YYYY-MM-DD
  historyDates: string[]; // array of YYYY-MM-DD
}

export interface StudyTimeStats {
  studentId: string;
  todayMinutes: number;
  thisWeekMinutes: number;
  thisMonthMinutes: number;
  totalHours: number;
  consistencyScore: number; // 0 - 100%
  accuracyPercentage: number; // 0 - 100%
  averageQuizScore: number;
  totalQuestionsCompleted: number;
  totalTopicsMastered: number;
}

export interface PersonalLearningInsight {
  id: string;
  studentId: string;
  title: string;
  description: string;
  type: 'time_pattern' | 'accuracy_trend' | 'error_tendency' | 'mastery_milestone';
  icon: string;
  createdAt: string;
}

export interface WeeklyLearningReport {
  id: string;
  studentId: string;
  weekRange: string; // e.g. "7 - 13 September 2026"
  learningHoursMinutes: string; // "5h 32m"
  lessonsCompleted: number;
  questionsAnswered: number;
  accuracyPercentage: number;
  masteryGainPercentage: number; // e.g. +6%
  strongestTopic: string;
  weakestTopic: string;
  consistencyScore: number;
  recommendationsNextWeek: string[];
  generatedAt: string;
}

export interface AuditLog {
  id: string;
  who: string; // Username or admin email
  what: string; // Action e.g. "Assign Program", "Reset Password", "Update Status"
  targetUserId: string;
  targetUserName: string;
  when: string; // ISO String
  oldValue: string;
  newValue: string;
}

export interface DiagnosticQuestion {
  id: string;
  subjectId: string;
  chapterId: string;
  topicId: string;
  conceptId: string;
  conceptName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  audioPrompt?: string;
}

export interface StudentContextPayload {
  student_id: string;
  grade: number;
  curriculum: string;
  learning_goal: string[];
  subject: string;
  mastery: {
    overall_score: number;
    level: string;
    topics_summary: { concept: string; score: number; status: string }[];
  };
  weak_topics: string[];
  strong_topics: string[];
  learning_history: { recent_activity: string; timestamp: string }[];
  study_preferences: {
    preferred_style: string;
    effective_hours: string;
  };
}
