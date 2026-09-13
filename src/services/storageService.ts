import { Subject, Materi, Question, AuditorySettings, AccessibilitySettings, EducationLevel } from '../types';
import { DEFAULT_SUBJECTS, DEFAULT_MATERI, DEFAULT_QUESTIONS } from '../data/defaultData';

const STORAGE_KEYS = {
  SUBJECTS: 'sqolah_subjects_v3',
  MATERI: 'sqolah_materi_v3',
  QUESTIONS: 'sqolah_questions_v3',
  AUDITORY: 'sqolah_auditory_settings_v3',
  ACCESSIBILITY: 'sqolah_accessibility_settings_v3'
};

export const defaultAuditorySettings: AuditorySettings = {
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  autoReadNext: true,
  soundEffects: true
};

export const defaultAccessibilitySettings: AccessibilitySettings = {
  fontSize: 'normal',
  dyslexicFont: false,
  highContrast: false,
  lineHeight: 'normal'
};

export class StorageService {
  // ================= SUBJECTS =================
  static getSubjects(): Subject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load subjects from localStorage', e);
    }
    this.saveSubjects(DEFAULT_SUBJECTS);
    return DEFAULT_SUBJECTS;
  }

  static saveSubjects(subjects: Subject[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.error('Failed to save subjects', e);
    }
  }

  static addSubject(subject: Subject): void {
    const list = this.getSubjects();
    list.push(subject);
    this.saveSubjects(list);
  }

  static updateSubject(subject: Subject): void {
    const list = this.getSubjects().map(s => s.id === subject.id ? subject : s);
    this.saveSubjects(list);
  }

  static deleteSubject(id: string): void {
    const list = this.getSubjects().filter(s => s.id !== id);
    this.saveSubjects(list);
    // Also cleanup linked materi & questions
    const materi = this.getMateri().filter(m => m.subjectId !== id);
    this.saveMateri(materi);
    const questions = this.getQuestions().filter(q => q.subjectId !== id);
    this.saveQuestions(questions);
  }

  // ================= MATERI =================
  static getMateri(): Materi[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MATERI);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load materi from localStorage', e);
    }
    this.saveMateri(DEFAULT_MATERI);
    return DEFAULT_MATERI;
  }

  static saveMateri(materi: Materi[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MATERI, JSON.stringify(materi));
    } catch (e) {
      console.error('Failed to save materi', e);
    }
  }

  static addMateri(item: Materi): void {
    const list = this.getMateri();
    list.unshift(item);
    this.saveMateri(list);
  }

  static updateMateri(item: Materi): void {
    const list = this.getMateri().map(m => m.id === item.id ? item : m);
    this.saveMateri(list);
  }

  static deleteMateri(id: string): void {
    const list = this.getMateri().filter(m => m.id !== id);
    this.saveMateri(list);
  }

  // ================= QUESTIONS =================
  static getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load questions from localStorage', e);
    }
    this.saveQuestions(DEFAULT_QUESTIONS);
    return DEFAULT_QUESTIONS;
  }

  static saveQuestions(questions: Question[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error('Failed to save questions', e);
    }
  }

  static addQuestion(question: Question): void {
    const list = this.getQuestions();
    list.unshift(question);
    this.saveQuestions(list);
  }

  static updateQuestion(question: Question): void {
    const list = this.getQuestions().map(q => q.id === question.id ? question : q);
    this.saveQuestions(list);
  }

  static deleteQuestion(id: string): void {
    const list = this.getQuestions().filter(q => q.id !== id);
    this.saveQuestions(list);
  }

  // ================= SETTINGS =================
  static getAuditorySettings(): AuditorySettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDITORY);
      if (data) return { ...defaultAuditorySettings, ...JSON.parse(data) };
    } catch (e) {
      console.error('Failed to load auditory settings', e);
    }
    return defaultAuditorySettings;
  }

  static saveAuditorySettings(settings: AuditorySettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDITORY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save auditory settings', e);
    }
  }

  static getAccessibilitySettings(): AccessibilitySettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY);
      if (data) return { ...defaultAccessibilitySettings, ...JSON.parse(data) };
    } catch (e) {
      console.error('Failed to load accessibility settings', e);
    }
    return defaultAccessibilitySettings;
  }

  static saveAccessibilitySettings(settings: AccessibilitySettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save accessibility settings', e);
    }
  }

  // ================= BACKUP & RESTORE =================
  static exportDataJSON(): string {
    const exportObj = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      subjects: this.getSubjects(),
      materi: this.getMateri(),
      questions: this.getQuestions()
    };
    return JSON.stringify(exportObj, null, 2);
  }

  static importDataJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.subjects) && Array.isArray(parsed.materi) && Array.isArray(parsed.questions)) {
        this.saveSubjects(parsed.subjects);
        this.saveMateri(parsed.materi);
        this.saveQuestions(parsed.questions);
        return true;
      }
    } catch (e) {
      console.error('Invalid import data format', e);
    }
    return false;
  }

  static resetToDefault(): void {
    this.saveSubjects(DEFAULT_SUBJECTS);
    this.saveMateri(DEFAULT_MATERI);
    this.saveQuestions(DEFAULT_QUESTIONS);
  }
}
