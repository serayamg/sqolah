import {
  ConceptMastery,
  MasteryLevel,
  LearningGap,
  NextBestAction,
  TodayLearningTask,
  LearningEvent,
  LearningStreak,
  StudyTimeStats,
  PersonalLearningInsight,
  WeeklyLearningReport,
  StudentGoals,
  StudentPreferences,
  StudentContextPayload
} from '../types/intelligence';
import { MASTER_CURRICULUM } from '../data/curriculumMaster';
import { AuthService } from './authService';

const KEY_MASTERIES = 'sqolah_masteries_v4';
const KEY_EVENTS = 'sqolah_events_v4';
const KEY_STREAKS = 'sqolah_streaks_v4';
const KEY_STUDY_STATS = 'sqolah_study_stats_v4';
const KEY_GOALS = 'sqolah_goals_v4';
const KEY_PREFERENCES = 'sqolah_preferences_v4';

export class IntelligenceService {
  // -------------------------------------------------------------
  // FORMULA & MASTERY LEVEL CALCULATOR
  // -------------------------------------------------------------
  public static calculateMasteryScore(components: {
    assessmentScore: number;
    quizScore: number;
    practiceScore: number;
    consistencyScore: number;
    recencyScore: number;
    completionScore: number;
  }): number {
    const raw =
      0.30 * components.assessmentScore +
      0.25 * components.quizScore +
      0.20 * components.practiceScore +
      0.10 * components.consistencyScore +
      0.10 * components.recencyScore +
      0.05 * components.completionScore;
    return Math.min(100, Math.max(0, Math.round(raw)));
  }

  public static getLevelFromScore(score: number): {
    level: MasteryLevel;
    label: string;
    status: ConceptMastery['status'];
    color: string;
  } {
    if (score <= 0) return { level: 0, label: 'Belum Dimulai', status: 'Not Started', color: 'slate' };
    if (score < 40) return { level: 1, label: 'Kesenjangan Pemahaman', status: 'Learning Gap', color: 'red' };
    if (score < 60) return { level: 2, label: 'Perlu Penguatan', status: 'Needs Review', color: 'amber' };
    if (score < 75) return { level: 3, label: 'Cukup Berkembang', status: 'Developing', color: 'blue' };
    if (score < 90) return { level: 4, label: 'Kuat & Mantap', status: 'Strong', color: 'emerald' };
    return { level: 5, label: 'Menguasai Penuh', status: 'Mastered', color: 'purple' };
  }

  // -------------------------------------------------------------
  // INITIAL DEMO DATA SEEDING
  // -------------------------------------------------------------
  public static initSeedData(): void {
    // Clear old versions if present
    ['sqolah_masteries_v1', 'sqolah_masteries_v2', 'sqolah_masteries_v3',
     'sqolah_events_v1', 'sqolah_events_v2', 'sqolah_events_v3',
     'sqolah_streaks_v1', 'sqolah_streaks_v2', 'sqolah_streaks_v3',
     'sqolah_study_stats_v1', 'sqolah_study_stats_v2', 'sqolah_study_stats_v3',
     'sqolah_goals_v1', 'sqolah_goals_v2', 'sqolah_goals_v3',
     'sqolah_preferences_v1', 'sqolah_preferences_v2', 'sqolah_preferences_v3'].forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });

    if (localStorage.getItem(KEY_MASTERIES)) return;

    // Seed M Elang El Haqeem's Mastery (demonstrating realistic learning path with an Ikatan Kimia gap)
    const elangMasteries: ConceptMastery[] = [
      {
        id: 'mas-1',
        studentId: 'SQ-2026-0001',
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-1',
        topicId: 'top-1-1',
        conceptId: 'conc-partikel-atom',
        conceptName: 'Proton, Neutron & Elektron',
        score: 95,
        level: 5,
        lastStudiedAt: '2026-09-12T10:15:00Z',
        reviewCount: 3,
        questionsAttempted: 15,
        questionsCorrect: 14,
        averageTimeSeconds: 42,
        masteredSkills: ['Identifikasi partikel subatom', 'Letak proton & neutron dalam inti'],
        needsImprovementSkills: [],
        status: 'Mastered'
      },
      {
        id: 'mas-2',
        studentId: 'SQ-2026-0001',
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-1',
        topicId: 'top-1-1',
        conceptId: 'conc-isotop-notasi',
        conceptName: 'Nomor Atom, Nomor Massa & Isotop',
        score: 88,
        level: 4,
        lastStudiedAt: '2026-09-11T16:00:00Z',
        reviewCount: 2,
        questionsAttempted: 12,
        questionsCorrect: 11,
        averageTimeSeconds: 50,
        masteredSkills: ['Perhitungan neutron ion', 'Pengelompokan isotop, isobar, isoton'],
        needsImprovementSkills: [],
        status: 'Strong'
      },
      {
        id: 'mas-3',
        studentId: 'SQ-2026-0001',
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-1',
        topicId: 'top-1-2',
        conceptId: 'conc-konfig-elektron',
        conceptName: 'Prinsip Aufbau & Konfigurasi spdf',
        score: 52, // Gap!
        level: 2,
        lastStudiedAt: '2026-09-08T15:30:00Z',
        reviewCount: 1,
        questionsAttempted: 10,
        questionsCorrect: 5,
        averageTimeSeconds: 78,
        masteredSkills: ['Urutan dasar tingkat energi s-p'],
        needsImprovementSkills: ['Pengecualian kestabilan subkulit d setengah penuh', 'Konfigurasi ion transisi'],
        status: 'Needs Review'
      },
      {
        id: 'mas-4',
        studentId: 'SQ-2026-0001',
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-1',
        topicId: 'top-1-2',
        conceptId: 'conc-bil-kuantum',
        conceptName: 'Bilangan Kuantum n, l, m, s',
        score: 48,
        level: 2,
        lastStudiedAt: '2026-09-08T16:00:00Z',
        reviewCount: 1,
        questionsAttempted: 8,
        questionsCorrect: 4,
        averageTimeSeconds: 85,
        masteredSkills: ['Penentuan bilangan kuantum utama (n)'],
        needsImprovementSkills: ['Penentuan nilai bilangan kuantum magnetik (m) dan spin (s)'],
        status: 'Needs Review'
      },
      {
        id: 'mas-5',
        studentId: 'SQ-2026-0001',
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-2',
        topicId: 'top-2-1',
        conceptId: 'conc-ikatan-ion',
        conceptName: 'Karakteristik & Pembentukan Senyawa Ion',
        score: 42, // Gap! Prerequisite is Konfigurasi Elektron
        level: 2,
        lastStudiedAt: '2026-09-07T14:00:00Z',
        reviewCount: 1,
        questionsAttempted: 8,
        questionsCorrect: 3,
        averageTimeSeconds: 90,
        masteredSkills: ['Ciri-ciri fisik senyawa ionik'],
        needsImprovementSkills: ['Transfer elektron valensi atom logam-nonlogam'],
        status: 'Learning Gap'
      },
      {
        id: 'mas-6',
        studentId: 'SQ-2026-0001',
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-2',
        topicId: 'top-2-1',
        conceptId: 'conc-ikatan-kovalen',
        conceptName: 'Ikatan Kovalen Tunggal, Rangkap & Koordinasi',
        score: 35, // Gap!
        level: 1,
        lastStudiedAt: '2026-09-08T11:00:00Z',
        reviewCount: 1,
        questionsAttempted: 10,
        questionsCorrect: 3,
        averageTimeSeconds: 110,
        masteredSkills: ['Pengertian pemakaian bersama elektron'],
        needsImprovementSkills: ['Identifikasi pasangan elektron bebas untuk ikatan koordinasi'],
        status: 'Learning Gap'
      },
      {
        id: 'mas-7',
        studentId: 'SQ-2026-0001',
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-4',
        topicId: 'top-4-2',
        conceptId: 'conc-setara-reaksi',
        conceptName: 'Penyetaraan Persamaan Reaksi Kimia',
        score: 82,
        level: 4,
        lastStudiedAt: '2026-09-12T15:00:00Z',
        reviewCount: 2,
        questionsAttempted: 14,
        questionsCorrect: 12,
        averageTimeSeconds: 65,
        masteredSkills: ['Metode aljabar sederhana', 'Penyetaraan reaksi hidrokarbon'],
        needsImprovementSkills: [],
        status: 'Strong'
      },
      {
        id: 'mas-8',
        studentId: 'SQ-2026-0001',
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-5',
        topicId: 'top-5-1',
        conceptId: 'conc-konsep-mol',
        conceptName: 'Mol, Massa Molar & Volume Molar STP',
        score: 76,
        level: 4,
        lastStudiedAt: '2026-09-13T09:00:00Z',
        reviewCount: 2,
        questionsAttempted: 15,
        questionsCorrect: 12,
        averageTimeSeconds: 70,
        masteredSkills: ['Konversi gram ke mol', 'Volume gas pada kondisi standar STP'],
        needsImprovementSkills: ['Hubungan jumlah partikel dengan bilangan Avogadro'],
        status: 'Strong'
      }
    ];

    localStorage.setItem(KEY_MASTERIES, JSON.stringify(elangMasteries));

    // Seed M Elang El Haqeem's Streaks & Stats
    const elangStreak: LearningStreak = {
      studentId: 'SQ-2026-0001',
      currentStreakDays: 5,
      bestStreakDays: 12,
      lastActivityDate: new Date().toISOString().split('T')[0],
      historyDates: [
        '2026-09-08',
        '2026-09-09',
        '2026-09-10',
        '2026-09-11',
        '2026-09-12',
        '2026-09-13'
      ]
    };
    localStorage.setItem(KEY_STREAKS, JSON.stringify([elangStreak]));

    const elangStats: StudyTimeStats = {
      studentId: 'SQ-2026-0001',
      todayMinutes: 48,
      thisWeekMinutes: 340,
      thisMonthMinutes: 870,
      totalHours: 14.5,
      consistencyScore: 85,
      accuracyPercentage: 79,
      averageQuizScore: 82,
      totalQuestionsCompleted: 86,
      totalTopicsMastered: 4
    };
    localStorage.setItem(KEY_STUDY_STATS, JSON.stringify([elangStats]));

    // Seed M Elang El Haqeem's Learning Goals & Preferences
    const elangGoals: StudentGoals = {
      studentId: 'SQ-2026-0001',
      primaryGoals: [
        'Persiapan UTBK / SNBT 2027',
        'Meningkatkan nilai rapor Kimia Kelas XI di atas 90',
        'Lolos PTN Kedokteran / Teknik Kimia'
      ],
      targetGrades: {
        'sma-kimia-10': { currentGrade: 80, targetGrade: 95 }
      },
      targetCampusOrSchool: 'Institut Teknologi Bandung (Teknik Kimia)',
      updatedAt: '2026-08-01T00:00:00Z'
    };
    localStorage.setItem(KEY_GOALS, JSON.stringify([elangGoals]));

    const elangPreferences: StudentPreferences = {
      studentId: 'SQ-2026-0001',
      selfAssessmentUnderstanding: {
        'sma-kimia-10': 4
      },
      easiestSubjectId: 'Kimia - Struktur Atom',
      hardestSubjectId: 'Kimia - Ikatan Kimia & Geometri',
      challengingTopics: 'Menentukan hibridisasi dan bentuk molekul PEI PEB',
      studyTimePreference: 'malam',
      averageStudyDurationMinutes: 45,
      learningStylePreference: 'auditory',
      updatedAt: '2026-08-01T00:00:00Z'
    };
    localStorage.setItem(KEY_PREFERENCES, JSON.stringify([elangPreferences]));

    // Seed Events
    const elangEvents: LearningEvent[] = [
      {
        id: 'evt-1',
        studentId: 'SQ-2026-0001',
        eventType: 'QUIZ_COMPLETED',
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-5',
        topicId: 'top-5-1',
        metadata: { score: 80, correctCount: 4, totalCount: 5, durationMinutes: 15 },
        timestamp: '2026-09-13T09:15:00Z'
      },
      {
        id: 'evt-2',
        studentId: 'SQ-2026-0001',
        eventType: 'AUDIO_LISTENED',
        subjectId: 'sma-kimia-10',
        chapterId: 'chap-kim-5',
        topicId: 'top-5-1',
        metadata: { babTitle: 'Bab 5 - Stoikiometri', ttsSpeed: 1.0, durationMinutes: 20 },
        timestamp: '2026-09-13T08:45:00Z'
      },
      {
        id: 'evt-3',
        studentId: 'SQ-2026-0001',
        eventType: 'DIAGNOSTIC_COMPLETED',
        subjectId: 'sma-kimia-10',
        metadata: { baselineScore: 74, level: 'Kompeten', durationMinutes: 30 },
        timestamp: '2026-09-02T10:30:00Z'
      }
    ];
    localStorage.setItem(KEY_EVENTS, JSON.stringify(elangEvents));
  }

  // -------------------------------------------------------------
  // MASTERIES
  // -------------------------------------------------------------
  public static getAllMasteries(): ConceptMastery[] {
    this.initSeedData();
    try {
      return JSON.parse(localStorage.getItem(KEY_MASTERIES) || '[]');
    } catch {
      return [];
    }
  }

  public static getStudentMasteries(studentId: string): ConceptMastery[] {
    const all = this.getAllMasteries();
    return all.filter(m => m.studentId === studentId);
  }

  public static getMasteryForConcept(studentId: string, conceptId: string): ConceptMastery | undefined {
    const masteries = this.getStudentMasteries(studentId);
    return masteries.find(m => m.conceptId === conceptId);
  }

  public static saveMastery(mastery: ConceptMastery): void {
    const all = this.getAllMasteries();
    const idx = all.findIndex(m => m.studentId === mastery.studentId && m.conceptId === mastery.conceptId);
    if (idx >= 0) {
      all[idx] = mastery;
    } else {
      all.push(mastery);
    }
    localStorage.setItem(KEY_MASTERIES, JSON.stringify(all));
  }

  public static calculateOverallMastery(studentId: string): {
    overallScore: number;
    level: MasteryLevel;
    label: string;
    color: string;
    assessedConceptsCount: number;
    masteredConceptsCount: number;
  } {
    const masteries = this.getStudentMasteries(studentId);
    if (masteries.length === 0) {
      return {
        overallScore: 0,
        level: 0,
        label: 'Belum Ada Data (Mulai Asesmen)',
        color: 'slate',
        assessedConceptsCount: 0,
        masteredConceptsCount: 0
      };
    }

    const totalScore = masteries.reduce((sum, m) => sum + m.score, 0);
    const avgScore = Math.round(totalScore / masteries.length);
    const lvl = this.getLevelFromScore(avgScore);
    const masteredCount = masteries.filter(m => m.level >= 4).length;

    return {
      overallScore: avgScore,
      level: lvl.level,
      label: lvl.label,
      color: lvl.color,
      assessedConceptsCount: masteries.length,
      masteredConceptsCount: masteredCount
    };
  }

  // -------------------------------------------------------------
  // PREREQUISITE & LEARNING GAP DETECTION
  // -------------------------------------------------------------
  public static detectLearningGaps(studentId: string): LearningGap[] {
    const masteries = this.getStudentMasteries(studentId);
    const gaps: LearningGap[] = [];

    const masteryMap = new Map<string, ConceptMastery>();
    masteries.forEach(m => masteryMap.set(m.conceptId, m));

    for (const m of masteries) {
      if (m.score < 60) {
        let rootPrereqId = m.conceptId;
        let rootPrereqName = m.conceptName;
        let explanation = `Akurasi pada topik "${m.conceptName}" (${m.score}%) berada di bawah standar ketuntasan 60%.`;

        // Look for prerequisite concepts
        for (const subject of MASTER_CURRICULUM) {
          for (const chap of subject.chapters) {
            for (const top of chap.topics) {
              const concept = top.concepts.find(c => c.id === m.conceptId);
              if (concept && concept.prerequisiteConceptIds.length > 0) {
                for (const prereqId of concept.prerequisiteConceptIds) {
                  const prereqMastery = masteryMap.get(prereqId);
                  if (!prereqMastery || prereqMastery.score < 60) {
                    rootPrereqId = prereqId;
                    for (const s of MASTER_CURRICULUM) {
                      for (const c of s.chapters) {
                        for (const t of c.topics) {
                          const pc = t.concepts.find(x => x.id === prereqId);
                          if (pc) {
                            rootPrereqName = pc.name;
                            break;
                          }
                        }
                      }
                    }
                    explanation = `Akar masalah terdeteksi: Kesulitan pada "${m.conceptName}" berakar dari belum mantapnya konsep prasyarat "${rootPrereqName}". Perbaiki prasyarat ini terlebih dahulu agar pemahaman tidak macet.`;
                    break;
                  }
                }
              }
            }
          }
        }

        gaps.push({
          id: `gap-${m.conceptId}`,
          studentId,
          subjectId: m.subjectId,
          strugglingConceptId: m.conceptId,
          strugglingConceptName: m.conceptName,
          rootProblemConceptId: rootPrereqId,
          rootProblemConceptName: rootPrereqName,
          currentMasteryScore: m.score,
          explanation,
          recommendedReviewTopicId: m.topicId,
          estimatedMinutes: 20,
          resolved: false
        });
      }
    }

    return gaps;
  }

  // -------------------------------------------------------------
  // NEXT BEST ACTION & TODAY'S PLAN ENGINE
  // -------------------------------------------------------------
  public static getNextBestActions(studentId: string): NextBestAction[] {
    const studentProfile = AuthService.getStudentProfileByUserId(studentId) ||
      AuthService.getStudentProfiles().find(p => p.studentId === studentId);

    if (!studentProfile || !studentProfile.diagnosticCompleted) {
      return [
        {
          id: 'nba-diag',
          studentId,
          type: 'foundation_review',
          priority: 'high',
          title: 'Ikuti Asesmen Diagnostik Awal',
          description: 'Ukur titik awal pemahaman materi Kimia SMA kamu secara adaptif',
          subjectId: 'sma-kimia-10',
          estimatedMinutes: 20,
          reason: 'Sqolah perlu memetakan tingkat penguasaan konsep awalmu sebelum menyusun rekomendasi belajar yang presisi.',
          actionUrl: 'diagnostic',
          completed: false
        }
      ];
    }

    const gaps = this.detectLearningGaps(studentId);
    const actions: NextBestAction[] = [];

    // 1. Critical Gap / Prerequisite Action
    if (gaps.length > 0) {
      const topGap = gaps[0];
      actions.push({
        id: `nba-root-${topGap.id}`,
        studentId,
        type: 'foundation_review',
        priority: 'high',
        title: `Perbaiki Fondasi: ${topGap.rootProblemConceptName}`,
        description: `Prasyarat kunci sebelum mempelajari lebih dalam materi ${topGap.strugglingConceptName}.`,
        subjectId: topGap.subjectId,
        conceptId: topGap.rootProblemConceptId,
        estimatedMinutes: 15,
        reason: topGap.explanation,
        actionUrl: 'materi-1',
        completed: false
      });
    }

    // 2. Active Practice / Quiz
    actions.push({
      id: 'nba-practice-mol',
      studentId,
      type: 'practice_exercise',
      priority: 'medium',
      title: 'Latihan Soal Adaptif: Konsep Mol & Stoikiometri',
      description: 'Pertajam kemampuan hitung mol, massa molar, dan volume gas STP.',
      subjectId: 'sma-kimia-10',
      chapterId: 'chap-kim-5',
      estimatedMinutes: 25,
      reason: 'Konsep Mol adalah fondasi utama kimia analitik dan perhitungan reaksi kimia lanjut.',
      actionUrl: 'quiz-5',
      completed: false
    });

    // 3. Advance to Next Topic
    actions.push({
      id: 'nba-advance-termokimia',
      studentId,
      type: 'continue_learning',
      priority: 'low',
      title: 'Jelajahi Materi Baru: Termokimia & Perubahan Entalpi',
      description: 'Pelajari reaksi eksoterm, endoterm, dan penentuan delta H reaksi.',
      subjectId: 'sma-kimia-10',
      chapterId: 'chap-kim-7',
      estimatedMinutes: 30,
      reason: 'Setelah konsep mol dikuasai, silabus berikutnya adalah pemahaman energi pada reaksi kimia.',
      actionUrl: 'materi-7',
      completed: false
    });

    return actions;
  }

  public static getTodayLearningPlan(studentId: string): TodayLearningTask[] {
    const actions = this.getNextBestActions(studentId);
    return actions.map((act, index) => ({
      id: `task-${index + 1}`,
      studentId,
      title: act.title,
      durationMinutes: act.estimatedMinutes,
      type: act.type === 'foundation_review' ? 'review' : act.type === 'practice_exercise' ? 'practice' : 'learn',
      status: 'pending',
      subjectId: act.subjectId,
      materiId: act.actionUrl
    }));
  }

  // -------------------------------------------------------------
  // STREAKS & STUDY STATS
  // -------------------------------------------------------------
  public static getStreak(studentId: string): LearningStreak {
    this.initSeedData();
    try {
      const list: LearningStreak[] = JSON.parse(localStorage.getItem(KEY_STREAKS) || '[]');
      const found = list.find(s => s.studentId === studentId);
      if (found) return found;
    } catch {}
    return {
      studentId,
      currentStreakDays: 1,
      bestStreakDays: 1,
      lastActivityDate: new Date().toISOString().split('T')[0],
      historyDates: [new Date().toISOString().split('T')[0]]
    };
  }

  public static getStudyStats(studentId: string): StudyTimeStats {
    this.initSeedData();
    try {
      const list: StudyTimeStats[] = JSON.parse(localStorage.getItem(KEY_STUDY_STATS) || '[]');
      const found = list.find(s => s.studentId === studentId);
      if (found) return found;
    } catch {}
    return {
      studentId,
      todayMinutes: 0,
      thisWeekMinutes: 0,
      thisMonthMinutes: 0,
      totalHours: 0,
      consistencyScore: 70,
      accuracyPercentage: 0,
      averageQuizScore: 0,
      totalQuestionsCompleted: 0,
      totalTopicsMastered: 0
    };
  }

  // -------------------------------------------------------------
  // LEARNING EVENTS & TRACKING
  // -------------------------------------------------------------
  public static getEvents(studentId: string): LearningEvent[] {
    this.initSeedData();
    try {
      const all: LearningEvent[] = JSON.parse(localStorage.getItem(KEY_EVENTS) || '[]');
      return all.filter(e => e.studentId === studentId);
    } catch {
      return [];
    }
  }

  public static trackEvent(
    event: Omit<LearningEvent, 'id' | 'timestamp'>,
    durationMinutes: number = 0
  ): LearningEvent {
    const fullEvent: LearningEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };

    // Save to events list
    const all: LearningEvent[] = JSON.parse(localStorage.getItem(KEY_EVENTS) || '[]');
    all.unshift(fullEvent);
    localStorage.setItem(KEY_EVENTS, JSON.stringify(all));

    // Update study time
    if (durationMinutes > 0) {
      const statsList: StudyTimeStats[] = JSON.parse(localStorage.getItem(KEY_STUDY_STATS) || '[]');
      let stats = statsList.find(s => s.studentId === fullEvent.studentId);
      if (!stats) {
        stats = {
          studentId: fullEvent.studentId,
          todayMinutes: 0,
          thisWeekMinutes: 0,
          thisMonthMinutes: 0,
          totalHours: 0,
          consistencyScore: 80,
          accuracyPercentage: 80,
          averageQuizScore: 80,
          totalQuestionsCompleted: 0,
          totalTopicsMastered: 0
        };
        statsList.push(stats);
      }
      stats.todayMinutes += durationMinutes;
      stats.thisWeekMinutes += durationMinutes;
      stats.thisMonthMinutes += durationMinutes;
      stats.totalHours = Math.round((stats.thisMonthMinutes / 60) * 10) / 10;
      localStorage.setItem(KEY_STUDY_STATS, JSON.stringify(statsList));
    }

    // Update streak if needed
    const todayStr = new Date().toISOString().split('T')[0];
    const streakList: LearningStreak[] = JSON.parse(localStorage.getItem(KEY_STREAKS) || '[]');
    let streak = streakList.find(s => s.studentId === fullEvent.studentId);
    if (!streak) {
      streak = {
        studentId: fullEvent.studentId,
        currentStreakDays: 1,
        bestStreakDays: 1,
        lastActivityDate: todayStr,
        historyDates: [todayStr]
      };
      streakList.push(streak);
    } else {
      if (!streak.historyDates.includes(todayStr)) {
        streak.historyDates.push(todayStr);
        streak.currentStreakDays += 1;
        if (streak.currentStreakDays > streak.bestStreakDays) {
          streak.bestStreakDays = streak.currentStreakDays;
        }
      }
      streak.lastActivityDate = todayStr;
    }
    localStorage.setItem(KEY_STREAKS, JSON.stringify(streakList));

    return fullEvent;
  }

  // -------------------------------------------------------------
  // GOALS & PREFERENCES
  // -------------------------------------------------------------
  public static getGoals(studentId: string): StudentGoals {
    this.initSeedData();
    try {
      const list: StudentGoals[] = JSON.parse(localStorage.getItem(KEY_GOALS) || '[]');
      const found = list.find(g => g.studentId === studentId);
      if (found) return found;
    } catch {}
    return {
      studentId,
      primaryGoals: ['Meningkatkan Pemahaman Kimia'],
      targetGrades: { 'sma-kimia-10': { currentGrade: 70, targetGrade: 85 } },
      updatedAt: new Date().toISOString()
    };
  }

  public static saveGoals(goals: StudentGoals): void {
    const list: StudentGoals[] = JSON.parse(localStorage.getItem(KEY_GOALS) || '[]');
    const idx = list.findIndex(g => g.studentId === goals.studentId);
    if (idx >= 0) list[idx] = goals;
    else list.push(goals);
    localStorage.setItem(KEY_GOALS, JSON.stringify(list));
  }

  public static getPreferences(studentId: string): StudentPreferences {
    this.initSeedData();
    try {
      const list: StudentPreferences[] = JSON.parse(localStorage.getItem(KEY_PREFERENCES) || '[]');
      const found = list.find(p => p.studentId === studentId);
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

  public static savePreferences(prefs: StudentPreferences): void {
    const list: StudentPreferences[] = JSON.parse(localStorage.getItem(KEY_PREFERENCES) || '[]');
    const idx = list.findIndex(p => p.studentId === prefs.studentId);
    if (idx >= 0) list[idx] = prefs;
    else list.push(prefs);
    localStorage.setItem(KEY_PREFERENCES, JSON.stringify(list));
  }

  // -------------------------------------------------------------
  // PERSONAL INSIGHTS & WEEKLY REPORT
  // -------------------------------------------------------------
  public static getPersonalInsights(studentId: string): PersonalLearningInsight[] {
    const gaps = this.detectLearningGaps(studentId);

    const insights: PersonalLearningInsight[] = [
      {
        id: 'ins-1',
        studentId,
        title: 'Gaya Belajar Auditori Paling Efektif',
        description: 'Tingkat akurasi soal meningkat 24% saat materi dibaca dengan fitur narasi suara (TTS) aktif.',
        type: 'accuracy_trend',
        icon: 'volume-high',
        createdAt: '2026-09-12T10:00:00Z'
      },
      {
        id: 'ins-2',
        studentId,
        title: 'Konsistensi Belajar Jam 19:00 - 21:00',
        description: 'Kamu paling produktif menyelesaikan kuis dan modul materi di malam hari dengan fokus stabil.',
        type: 'time_pattern',
        icon: 'moon',
        createdAt: '2026-09-11T18:00:00Z'
      }
    ];

    if (gaps.length > 0) {
      insights.unshift({
        id: 'ins-gap',
        studentId,
        title: `Peluang Lonjakan Nilai pada ${gaps[0].strugglingConceptName}`,
        description: gaps[0].explanation,
        type: 'error_tendency',
        icon: 'alert-triangle',
        createdAt: new Date().toISOString()
      });
    }

    return insights;
  }

  public static generateWeeklyReport(studentId: string): WeeklyLearningReport {
    const stats = this.getStudyStats(studentId);
    const streak = this.getStreak(studentId);
    const masteries = this.getStudentMasteries(studentId);

    let strongest = 'Struktur Atom & Notasi Nuklida';
    let weakest = 'Ikatan Kimia & Bentuk Molekul';

    if (masteries.length > 0) {
      const sorted = [...masteries].sort((a, b) => b.score - a.score);
      strongest = sorted[0].conceptName;
      weakest = sorted[sorted.length - 1].conceptName;
    }

    const hours = Math.floor(stats.thisWeekMinutes / 60);
    const mins = stats.thisWeekMinutes % 60;

    return {
      id: `rep-${Date.now()}`,
      studentId,
      weekRange: '8 - 14 September 2026',
      learningHoursMinutes: `${hours} jam ${mins} menit`,
      lessonsCompleted: 6,
      questionsAnswered: stats.totalQuestionsCompleted || 35,
      accuracyPercentage: stats.accuracyPercentage || 79,
      masteryGainPercentage: 8,
      strongestTopic: strongest,
      weakestTopic: weakest,
      consistencyScore: Math.min(100, streak.currentStreakDays * 20),
      recommendationsNextWeek: [
        'Selesaikan latihan remedial materi Konfigurasi Elektron sebelum ujian harian.',
        'Lanjutkan membaca rangkuman Bab 6 Hidrokarbon.',
        'Pertahankan streak belajar minimal 20 menit setiap hari.'
      ],
      generatedAt: new Date().toISOString()
    };
  }

  // -------------------------------------------------------------
  // STUDENT CONTEXT PAYLOAD EXPORT (For AI/Tutor Integration)
  // -------------------------------------------------------------
  public static exportStudentContext(studentId: string): StudentContextPayload {
    const student = AuthService.getStudentProfiles().find(p => p.studentId === studentId) ||
      AuthService.getStudentProfiles()[0];
    const goals = this.getGoals(studentId);
    const prefs = this.getPreferences(studentId);
    const overall = this.calculateOverallMastery(studentId);
    const masteries = this.getStudentMasteries(studentId);
    const gaps = this.detectLearningGaps(studentId);
    const events = this.getEvents(studentId).slice(0, 5);

    const strongTopics = masteries.filter(m => m.score >= 75).map(m => m.conceptName);
    const weakTopics = gaps.map(g => g.strugglingConceptName);

    return {
      student_id: student.studentId,
      grade: student.grade,
      curriculum: student.curriculum,
      learning_goal: goals.primaryGoals,
      subject: 'Kimia SMA',
      mastery: {
        overall_score: overall.overallScore,
        level: overall.label,
        topics_summary: masteries.map(m => ({
          concept: m.conceptName,
          score: m.score,
          status: this.getLevelFromScore(m.score).label
        }))
      },
      weak_topics: weakTopics,
      strong_topics: strongTopics,
      learning_history: events.map(e => ({
        recent_activity: `${e.eventType} - ${e.chapterId || 'general'}`,
        timestamp: e.timestamp
      })),
      study_preferences: {
        preferred_style: prefs.learningStylePreference,
        effective_hours: `${prefs.studyTimePreference} hari`
      }
    };
  }
}
