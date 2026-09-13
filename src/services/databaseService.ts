import {
  User,
  StudentProfile,
  ConceptMastery,
  LearningEvent,
  LearningStreak,
  StudyTimeStats,
  StudentGoals,
  StudentPreferences,
  AuditLog
} from '../types/intelligence';

// Database Table Keys in Storage Engine
const DB_PREFIX = 'sqolah_db_v5_';
const TABLES = {
  USERS: `${DB_PREFIX}users`,
  STUDENTS: `${DB_PREFIX}students`,
  MASTERIES: `${DB_PREFIX}masteries`,
  EVENTS: `${DB_PREFIX}events`,
  STREAKS: `${DB_PREFIX}streaks`,
  STATS: `${DB_PREFIX}stats`,
  GOALS: `${DB_PREFIX}goals`,
  PREFERENCES: `${DB_PREFIX}preferences`,
  AUDIT_LOGS: `${DB_PREFIX}audit_logs`,
  DB_META: `${DB_PREFIX}meta`
};

export class DatabaseService {
  private static isInitialized = false;

  /**
   * Initializes the database schema and seeds base accounts if not already present.
   * If fresh = true, forces clearing Elang's learning records to zero.
   */
  public static initDatabase(forceFreshElang = false): void {
    if (this.isInitialized && !forceFreshElang) return;

    // Remove legacy database keys from older iterations
    ['sqolah_users_v1', 'sqolah_users_v2', 'sqolah_users_v3', 'sqolah_users_v4',
     'sqolah_students_v1', 'sqolah_students_v2', 'sqolah_students_v3', 'sqolah_students_v4',
     'sqolah_masteries_v1', 'sqolah_masteries_v4',
     'sqolah_events_v1', 'sqolah_events_v4',
     'sqolah_streaks_v1', 'sqolah_streaks_v4',
     'sqolah_study_stats_v1', 'sqolah_study_stats_v4',
     'sqolah_goals_v1', 'sqolah_goals_v4',
     'sqolah_preferences_v1', 'sqolah_preferences_v4',
     'sqolah_audit_logs_v1', 'sqolah_audit_logs_v4'].forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });

    // Check if DB was already initialized
    const meta = localStorage.getItem(TABLES.DB_META);
    if (!meta || forceFreshElang) {
      this.seedEmptyElangDatabase();
    }

    this.isInitialized = true;
  }

  /**
   * Creates a clean database where M Elang El Haqeem (Kelas XI SMA) has NO previous learning data:
   * - 0 Masteries (Belum dimulai / 0%)
   * - 0 Events (Kosong)
   * - 0 Streak (0 Hari)
   * - 0 Study Time (0 Menit)
   * - Onboarding: Belum selesai (currentOnboardingStep: 1)
   * - Diagnostik: Belum selesai (diagnosticCompleted: false)
   */
  public static seedEmptyElangDatabase(): void {
    const defaultUser: User = {
      id: 'usr-student-elang',
      username: 'elangelhaqeem',
      fullName: 'M Elang El Haqeem',
      email: 'elang.elhaqeem@sqolah.id',
      role: 'student',
      status: 'active',
      createdAt: '2026-09-01T08:00:00Z',
      lastLoginAt: new Date().toISOString()
    };

    const adminUser: User = {
      id: 'usr-admin-1',
      username: 'admin',
      fullName: 'Super Administrator Sqolah',
      email: 'admin@sqolah.id',
      role: 'superadmin',
      status: 'active',
      createdAt: '2026-01-01T00:00:00Z',
      lastLoginAt: new Date().toISOString()
    };

    const elangProfile: StudentProfile = {
      id: 'prof-student-elang',
      userId: 'usr-student-elang',
      studentId: 'SQ-2026-0001',
      fullName: 'M Elang El Haqeem',
      nickname: 'Elang',
      phone: '0812-3456-7890',
      email: 'elang.elhaqeem@sqolah.id',
      school: 'SMA Negeri 1',
      grade: 11, // Kelas XI SMA
      level: 'SMA',
      curriculum: 'Kurikulum Merdeka',
      academicYear: '2026/2027',
      city: 'Jakarta',
      program: 'Intensif UTBK / SNBT & Prestasi SMA',
      batch: 'Gelombang 1 - 2026',
      startDate: '2026-09-01',
      parentName: 'Wali Murid',
      parentPhone: '0811-2233-4455',
      assignedSubjectIds: ['sma-kimia-10'],
      // FRESH / EMPTY STATE:
      onboardingCompleted: false,
      currentOnboardingStep: 1,
      diagnosticCompleted: false
    };

    const initialAudit: AuditLog[] = [
      {
        id: 'audit-reg-1',
        who: 'admin@sqolah.id',
        what: 'Student Registration & Curriculum Assignment',
        targetUserId: 'usr-student-elang',
        targetUserName: 'M Elang El Haqeem',
        when: '2026-09-01T08:00:00Z',
        oldValue: 'Unregistered',
        newValue: 'SQ-2026-0001 | Kelas XI SMA | Kurikulum Merdeka | Status: Fresh (Belum Belajar)'
      }
    ];

    const initialStreak: LearningStreak = {
      studentId: 'SQ-2026-0001',
      currentStreakDays: 0,
      bestStreakDays: 0,
      lastActivityDate: '',
      historyDates: []
    };

    const initialStats: StudyTimeStats = {
      studentId: 'SQ-2026-0001',
      todayMinutes: 0,
      thisWeekMinutes: 0,
      thisMonthMinutes: 0,
      totalHours: 0,
      consistencyScore: 0,
      accuracyPercentage: 0,
      averageQuizScore: 0,
      totalQuestionsCompleted: 0,
      totalTopicsMastered: 0
    };

    const initialGoals: StudentGoals = {
      studentId: 'SQ-2026-0001',
      primaryGoals: ['Persiapan UTBK / SNBT Masuk PTN', 'Meningkatkan Nilai Rapor Kelas XI'],
      targetGrades: {
        'sma-kimia-10': { currentGrade: 70, targetGrade: 92 }
      },
      targetCampusOrSchool: 'Institut Teknologi Bandung (Teknik Kimia)',
      updatedAt: new Date().toISOString()
    };

    const initialPreferences: StudentPreferences = {
      studentId: 'SQ-2026-0001',
      selfAssessmentUnderstanding: {},
      easiestSubjectId: '',
      hardestSubjectId: '',
      challengingTopics: '',
      studyTimePreference: 'malam',
      averageStudyDurationMinutes: 45,
      learningStylePreference: 'auditory',
      updatedAt: new Date().toISOString()
    };

    // Store into tables
    localStorage.setItem(TABLES.USERS, JSON.stringify([adminUser, defaultUser]));
    localStorage.setItem(TABLES.STUDENTS, JSON.stringify([elangProfile]));
    localStorage.setItem(TABLES.MASTERIES, JSON.stringify([])); // EMPTY
    localStorage.setItem(TABLES.EVENTS, JSON.stringify([])); // EMPTY
    localStorage.setItem(TABLES.STREAKS, JSON.stringify([initialStreak]));
    localStorage.setItem(TABLES.STATS, JSON.stringify([initialStats]));
    localStorage.setItem(TABLES.GOALS, JSON.stringify([initialGoals]));
    localStorage.setItem(TABLES.PREFERENCES, JSON.stringify([initialPreferences]));
    localStorage.setItem(TABLES.AUDIT_LOGS, JSON.stringify(initialAudit));
    localStorage.setItem(TABLES.DB_META, JSON.stringify({
      version: 5,
      initializedAt: new Date().toISOString(),
      activeStudentId: 'SQ-2026-0001'
    }));
  }

  // =================== TABLE: USERS ===================
  public static getUsers(): User[] {
    this.initDatabase();
    try {
      return JSON.parse(localStorage.getItem(TABLES.USERS) || '[]');
    } catch {
      return [];
    }
  }

  public static getUserById(userId: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === userId) || null;
  }

  public static saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) users[idx] = user;
    else users.push(user);
    localStorage.setItem(TABLES.USERS, JSON.stringify(users));
  }

  // =================== TABLE: STUDENTS ===================
  public static getStudents(): StudentProfile[] {
    this.initDatabase();
    try {
      return JSON.parse(localStorage.getItem(TABLES.STUDENTS) || '[]');
    } catch {
      return [];
    }
  }

  public static getStudentById(studentId: string): StudentProfile | null {
    const students = this.getStudents();
    return students.find(s => s.studentId === studentId || s.userId === studentId) || null;
  }

  public static updateStudent(profile: StudentProfile): void {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === profile.id || s.studentId === profile.studentId || s.userId === profile.userId);
    if (idx >= 0) students[idx] = profile;
    else students.push(profile);
    localStorage.setItem(TABLES.STUDENTS, JSON.stringify(students));
  }

  // =================== TABLE: CONCEPT MASTERIES ===================
  public static getMasteries(studentId?: string): ConceptMastery[] {
    this.initDatabase();
    try {
      const all: ConceptMastery[] = JSON.parse(localStorage.getItem(TABLES.MASTERIES) || '[]');
      if (studentId) return all.filter(m => m.studentId === studentId);
      return all;
    } catch {
      return [];
    }
  }

  public static saveMastery(mastery: ConceptMastery): void {
    const all = this.getMasteries();
    const idx = all.findIndex(m => m.studentId === mastery.studentId && m.conceptId === mastery.conceptId);
    if (idx >= 0) all[idx] = mastery;
    else all.push(mastery);
    localStorage.setItem(TABLES.MASTERIES, JSON.stringify(all));
  }

  public static clearMasteries(studentId: string): void {
    const all = this.getMasteries().filter(m => m.studentId !== studentId);
    localStorage.setItem(TABLES.MASTERIES, JSON.stringify(all));
  }

  // =================== TABLE: LEARNING EVENTS ===================
  public static getEvents(studentId?: string): LearningEvent[] {
    this.initDatabase();
    try {
      const all: LearningEvent[] = JSON.parse(localStorage.getItem(TABLES.EVENTS) || '[]');
      if (studentId) return all.filter(e => e.studentId === studentId);
      return all;
    } catch {
      return [];
    }
  }

  public static insertEvent(event: Omit<LearningEvent, 'id' | 'timestamp'>): LearningEvent {
    const fullEvent: LearningEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    const all = this.getEvents();
    all.unshift(fullEvent);
    localStorage.setItem(TABLES.EVENTS, JSON.stringify(all));
    return fullEvent;
  }

  public static clearEvents(studentId: string): void {
    const all = this.getEvents().filter(e => e.studentId !== studentId);
    localStorage.setItem(TABLES.EVENTS, JSON.stringify(all));
  }

  // =================== TABLE: LEARNING STREAKS ===================
  public static getStreak(studentId: string): LearningStreak {
    this.initDatabase();
    try {
      const all: LearningStreak[] = JSON.parse(localStorage.getItem(TABLES.STREAKS) || '[]');
      const found = all.find(s => s.studentId === studentId);
      if (found) return found;
    } catch {}
    return {
      studentId,
      currentStreakDays: 0,
      bestStreakDays: 0,
      lastActivityDate: '',
      historyDates: []
    };
  }

  public static updateStreak(streak: LearningStreak): void {
    const all: LearningStreak[] = JSON.parse(localStorage.getItem(TABLES.STREAKS) || '[]');
    const idx = all.findIndex(s => s.studentId === streak.studentId);
    if (idx >= 0) all[idx] = streak;
    else all.push(streak);
    localStorage.setItem(TABLES.STREAKS, JSON.stringify(all));
  }

  // =================== TABLE: STUDY TIME STATS ===================
  public static getStats(studentId: string): StudyTimeStats {
    this.initDatabase();
    try {
      const all: StudyTimeStats[] = JSON.parse(localStorage.getItem(TABLES.STATS) || '[]');
      const found = all.find(s => s.studentId === studentId);
      if (found) return found;
    } catch {}
    return {
      studentId,
      todayMinutes: 0,
      thisWeekMinutes: 0,
      thisMonthMinutes: 0,
      totalHours: 0,
      consistencyScore: 0,
      accuracyPercentage: 0,
      averageQuizScore: 0,
      totalQuestionsCompleted: 0,
      totalTopicsMastered: 0
    };
  }

  public static updateStats(stats: StudyTimeStats): void {
    const all: StudyTimeStats[] = JSON.parse(localStorage.getItem(TABLES.STATS) || '[]');
    const idx = all.findIndex(s => s.studentId === stats.studentId);
    if (idx >= 0) all[idx] = stats;
    else all.push(stats);
    localStorage.setItem(TABLES.STATS, JSON.stringify(all));
  }

  // =================== TABLE: GOALS & PREFERENCES ===================
  public static getGoals(studentId: string): StudentGoals {
    this.initDatabase();
    try {
      const all: StudentGoals[] = JSON.parse(localStorage.getItem(TABLES.GOALS) || '[]');
      const found = all.find(g => g.studentId === studentId);
      if (found) return found;
    } catch {}
    return {
      studentId,
      primaryGoals: ['Meningkatkan Nilai Kimia Kelas XI'],
      targetGrades: { 'sma-kimia-10': { currentGrade: 70, targetGrade: 90 } },
      updatedAt: new Date().toISOString()
    };
  }

  public static updateGoals(goals: StudentGoals): void {
    const all: StudentGoals[] = JSON.parse(localStorage.getItem(TABLES.GOALS) || '[]');
    const idx = all.findIndex(g => g.studentId === goals.studentId);
    if (idx >= 0) all[idx] = goals;
    else all.push(goals);
    localStorage.setItem(TABLES.GOALS, JSON.stringify(all));
  }

  public static getPreferences(studentId: string): StudentPreferences {
    this.initDatabase();
    try {
      const all: StudentPreferences[] = JSON.parse(localStorage.getItem(TABLES.PREFERENCES) || '[]');
      const found = all.find(p => p.studentId === studentId);
      if (found) return found;
    } catch {}
    return {
      studentId,
      selfAssessmentUnderstanding: {},
      easiestSubjectId: '',
      hardestSubjectId: '',
      challengingTopics: '',
      studyTimePreference: 'malam',
      averageStudyDurationMinutes: 45,
      learningStylePreference: 'auditory',
      updatedAt: new Date().toISOString()
    };
  }

  public static updatePreferences(prefs: StudentPreferences): void {
    const all: StudentPreferences[] = JSON.parse(localStorage.getItem(TABLES.PREFERENCES) || '[]');
    const idx = all.findIndex(p => p.studentId === prefs.studentId);
    if (idx >= 0) all[idx] = prefs;
    else all.push(prefs);
    localStorage.setItem(TABLES.PREFERENCES, JSON.stringify(all));
  }

  // =================== TABLE: AUDIT LOGS ===================
  public static getAuditLogs(): AuditLog[] {
    this.initDatabase();
    try {
      return JSON.parse(localStorage.getItem(TABLES.AUDIT_LOGS) || '[]');
    } catch {
      return [];
    }
  }

  public static insertAuditLog(log: AuditLog): void {
    const all = this.getAuditLogs();
    all.unshift(log);
    localStorage.setItem(TABLES.AUDIT_LOGS, JSON.stringify(all));
  }

  /**
   * Applies simulated learning activity for M Elang El Haqeem:
   * Called when testing how the system dynamically transforms after Elang studies.
   */
  public static applySimulatedLearningProgress(studentId: string = 'SQ-2026-0001'): void {
    const student = this.getStudentById(studentId);
    if (!student) return;

    // 1. Mark onboarding and diagnostic as completed
    student.onboardingCompleted = true;
    student.currentOnboardingStep = 5;
    student.diagnosticCompleted = true;
    this.updateStudent(student);

    // 2. Insert Diagnostic Learning Event
    this.insertEvent({
      studentId,
      eventType: 'DIAGNOSTIC_COMPLETED',
      subjectId: 'sma-kimia-10',
      metadata: {
        baselineScore: 78,
        correctCount: 9,
        totalQuestions: 12,
        level: 'Bisa Mengerjakan (Developing)'
      }
    });

    // 3. Insert Reading & Auditory Event (Bab 1: Struktur Atom)
    this.insertEvent({
      studentId,
      eventType: 'AUDIO_LISTENED',
      subjectId: 'sma-kimia-10',
      chapterId: 'chap-kim-1',
      topicId: 'top-1-1',
      metadata: {
        babTitle: 'Bab 1: Struktur Atom & Sistem Periodik Unsur',
        ttsUsed: true,
        durationMinutes: 25
      }
    });

    // 4. Insert Quiz Completed Event (Bab 1 & Bab 5)
    this.insertEvent({
      studentId,
      eventType: 'QUIZ_COMPLETED',
      subjectId: 'sma-kimia-10',
      chapterId: 'chap-kim-1',
      topicId: 'top-1-1',
      metadata: {
        score: 90,
        correctCount: 9,
        totalCount: 10,
        durationMinutes: 15
      }
    });

    // 5. Populate Concept Masteries reflecting the learning session
    const learnedMasteries: ConceptMastery[] = [
      {
        id: `mas-elang-1`,
        studentId,
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-1',
        topicId: 'top-1-1',
        conceptId: 'conc-partikel-atom',
        conceptName: 'Proton, Neutron & Elektron',
        score: 95,
        level: 5,
        lastStudiedAt: new Date().toISOString(),
        reviewCount: 2,
        questionsAttempted: 15,
        questionsCorrect: 14,
        averageTimeSeconds: 38,
        masteredSkills: ['Identifikasi proton, neutron, elektron', 'Letak partikel inti atom'],
        needsImprovementSkills: [],
        status: 'Mastered'
      },
      {
        id: `mas-elang-2`,
        studentId,
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-1',
        topicId: 'top-1-1',
        conceptId: 'conc-isotop-notasi',
        conceptName: 'Nomor Atom, Nomor Massa & Isotop',
        score: 88,
        level: 4,
        lastStudiedAt: new Date().toISOString(),
        reviewCount: 2,
        questionsAttempted: 12,
        questionsCorrect: 11,
        averageTimeSeconds: 45,
        masteredSkills: ['Perhitungan neutron ion', 'Pengelompokan isotop, isobar, isoton'],
        needsImprovementSkills: [],
        status: 'Strong'
      },
      {
        id: `mas-elang-3`,
        studentId,
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-1',
        topicId: 'top-1-2',
        conceptId: 'conc-konfig-elektron',
        conceptName: 'Prinsip Aufbau & Konfigurasi spdf',
        score: 55, // Gap detected! Prerequisite issue
        level: 2,
        lastStudiedAt: new Date().toISOString(),
        reviewCount: 1,
        questionsAttempted: 10,
        questionsCorrect: 5,
        averageTimeSeconds: 70,
        masteredSkills: ['Urutan subkulit tingkat energi dasar'],
        needsImprovementSkills: ['Kestabilan subkulit d penuh & setengah penuh'],
        status: 'Needs Review'
      },
      {
        id: `mas-elang-4`,
        studentId,
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-2',
        topicId: 'top-2-1',
        conceptId: 'conc-ikatan-ion',
        conceptName: 'Karakteristik & Pembentukan Senyawa Ion',
        score: 45, // Gap traced back to Konfigurasi Elektron
        level: 2,
        lastStudiedAt: new Date().toISOString(),
        reviewCount: 1,
        questionsAttempted: 8,
        questionsCorrect: 4,
        averageTimeSeconds: 85,
        masteredSkills: ['Ciri fisik ikatan ion'],
        needsImprovementSkills: ['Pelepasan & penangkapan elektron valensi'],
        status: 'Learning Gap'
      },
      {
        id: `mas-elang-5`,
        studentId,
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-4',
        topicId: 'top-4-2',
        conceptId: 'conc-setara-reaksi',
        conceptName: 'Penyetaraan Persamaan Reaksi Kimia',
        score: 84,
        level: 4,
        lastStudiedAt: new Date().toISOString(),
        reviewCount: 2,
        questionsAttempted: 12,
        questionsCorrect: 10,
        averageTimeSeconds: 60,
        masteredSkills: ['Metode koefisien reaksi setara'],
        needsImprovementSkills: [],
        status: 'Strong'
      }
    ];

    learnedMasteries.forEach(m => this.saveMastery(m));

    // 6. Update Streak
    const todayStr = new Date().toISOString().split('T')[0];
    this.updateStreak({
      studentId,
      currentStreakDays: 1,
      bestStreakDays: 1,
      lastActivityDate: todayStr,
      historyDates: [todayStr]
    });

    // 7. Update Study Time Stats
    this.updateStats({
      studentId,
      todayMinutes: 40,
      thisWeekMinutes: 40,
      thisMonthMinutes: 40,
      totalHours: 0.7,
      consistencyScore: 85,
      accuracyPercentage: 81,
      averageQuizScore: 87,
      totalQuestionsCompleted: 35,
      totalTopicsMastered: 3
    });

    // 8. Record audit trail
    this.insertAuditLog({
      id: `audit-learn-${Date.now()}`,
      who: 'System Intelligence Engine',
      what: 'Learning Activity & Mastery Update',
      targetUserId: student.userId,
      targetUserName: student.fullName,
      when: new Date().toISOString(),
      oldValue: 'Mastery: 0% | Belum Ada Aktivitas',
      newValue: 'Mastery: 73% | 3 Topik Mahir | 1 Kesenjangan Terdeteksi'
    });
  }
}
