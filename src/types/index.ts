export type EducationLevel = 'SD' | 'SMP' | 'SMA';

export interface Subject {
  id: string;
  name: string;
  level: EducationLevel;
  kelas: number[]; // e.g. [1, 2, 3, 4, 5, 6] for SD or [7, 8, 9] for SMP
  icon: string;
  color: string;
  description: string;
}

export interface Materi {
  id: string;
  subjectId: string;
  kelas: number;
  babNumber?: number;
  handbookFile?: string; // Path to Handbook HTML file
  title: string;
  summary: string;
  keyPoints: string[];
  contentParagraphs: string[];
  auditoryNotes?: string; // Additional verbal explanations or tips for auditory learners
  estimatedMinutes: number;
  createdAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  audioPronunciation?: string;
}

export interface Question {
  id: string;
  subjectId: string;
  materiId?: string;
  kelas: number;
  questionText: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  audioTip?: string;
}

export interface AuditorySettings {
  rate: number;       // 0.75 - 1.5
  pitch: number;      // 0.8 - 1.2
  volume: number;     // 0.0 - 1.0
  voiceURI?: string;
  autoReadNext: boolean;
  soundEffects: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  dyslexicFont: boolean;
  highContrast: boolean;
  lineHeight: 'normal' | 'relaxed' | 'loose';
}
