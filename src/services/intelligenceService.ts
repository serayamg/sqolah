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
import { DatabaseService } from './databaseService';

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
  // DATABASE INITIALIZATION & RESET
  // -------------------------------------------------------------
  public static initSeedData(): void {
    DatabaseService.initDatabase();
  }

  public static resetStudentToEmpty(studentId: string = 'SQ-2026-0001'): void {
    DatabaseService.initDatabase(true);
  }

  public static simulateLearning(studentId: string = 'SQ-2026-0001'): void {
    DatabaseService.applySimulatedLearningProgress(studentId);
  }

  // -------------------------------------------------------------
  // CONCEPT MASTERIES (CONNECTED TO DATABASE)
  // -------------------------------------------------------------
  public static getAllMasteries(): ConceptMastery[] {
    return DatabaseService.getMasteries();
  }

  public static getStudentMasteries(studentId: string): ConceptMastery[] {
    return DatabaseService.getMasteries(studentId);
  }

  public static getMasteryForConcept(studentId: string, conceptId: string): ConceptMastery | undefined {
    const masteries = this.getStudentMasteries(studentId);
    return masteries.find(m => m.conceptId === conceptId);
  }

  public static saveMastery(mastery: ConceptMastery): void {
    DatabaseService.saveMastery(mastery);
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
        label: 'Belum Ada Data (Mulai Belajar)',
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
    const studentProfile = DatabaseService.getStudentById(studentId);

    // If student hasn't completed onboarding or diagnostic
    if (!studentProfile || !studentProfile.diagnosticCompleted) {
      return [
        {
          id: 'nba-diag',
          studentId,
          type: 'foundation_review',
          priority: 'high',
          title: 'Ikuti Asesmen Diagnostik Awal',
          description: 'Ukur titik awal pemahaman materi Kimia SMA kamu secara adaptif.',
          subjectId: 'sma-kimia-10',
          estimatedMinutes: 20,
          reason: 'Sqolah perlu memetakan tingkat penguasaan konsep awalmu sebelum menyusun rekomendasi belajar yang presisi.',
          actionUrl: 'diagnostic',
          completed: false
        },
        {
          id: 'nba-start-atom',
          studentId,
          type: 'continue_learning',
          priority: 'medium',
          title: 'Pelajari Bab 1: Struktur Atom & Notasi Nuklida',
          description: 'Pahami partikel dasar atom, elektron, proton, neutron, dan notasi isotop.',
          subjectId: 'sma-kimia-10',
          chapterId: 'chap-kim-1',
          estimatedMinutes: 25,
          reason: 'Materi pengantar utama kurikulum kimia kelas X SMA.',
          actionUrl: 'materi-1',
          completed: false
        },
        {
          id: 'nba-audio-explore',
          studentId,
          type: 'practice_exercise',
          priority: 'low',
          title: 'Eksplorasi Audio Narasi TTS & Aksesibilitas',
          description: 'Dengarkan materi pelajaran dengan text-to-speech otomatis dan visual asistif.',
          subjectId: 'sma-kimia-10',
          chapterId: 'chap-kim-1',
          estimatedMinutes: 15,
          reason: 'Membiasakan diri dengan gaya belajar auditori untuk daya ingat jangka panjang.',
          actionUrl: 'materi-1',
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
      id: 'nba-practice-active',
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
  // STREAKS & STUDY STATS (CONNECTED TO DATABASE)
  // -------------------------------------------------------------
  public static getStreak(studentId: string): LearningStreak {
    return DatabaseService.getStreak(studentId);
  }

  public static getStudyStats(studentId: string): StudyTimeStats {
    return DatabaseService.getStats(studentId);
  }

  // -------------------------------------------------------------
  // LEARNING EVENTS & TRACKING (CONNECTED TO DATABASE)
  // -------------------------------------------------------------
  public static getEvents(studentId: string): LearningEvent[] {
    return DatabaseService.getEvents(studentId);
  }

  public static trackEvent(
    event: Omit<LearningEvent, 'id' | 'timestamp'>,
    durationMinutes: number = 0
  ): LearningEvent {
    // 1. Insert into events table
    const fullEvent = DatabaseService.insertEvent(event);

    // 2. Update study time stats in database
    if (durationMinutes > 0) {
      const stats = DatabaseService.getStats(fullEvent.studentId);
      stats.todayMinutes += durationMinutes;
      stats.thisWeekMinutes += durationMinutes;
      stats.thisMonthMinutes += durationMinutes;
      stats.totalHours = Math.round((stats.thisMonthMinutes / 60) * 10) / 10;
      DatabaseService.updateStats(stats);
    }

    // 3. Update streak in database
    const todayStr = new Date().toISOString().split('T')[0];
    const streak = DatabaseService.getStreak(fullEvent.studentId);
    if (!streak.historyDates.includes(todayStr)) {
      streak.historyDates.push(todayStr);
      streak.currentStreakDays += 1;
      if (streak.currentStreakDays > streak.bestStreakDays) {
        streak.bestStreakDays = streak.currentStreakDays;
      }
    }
    streak.lastActivityDate = todayStr;
    DatabaseService.updateStreak(streak);

    return fullEvent;
  }

  /**
   * Records a student's quiz or practice test result, updating concept mastery,
   * question accuracy statistics, study time, streak, and audit trail.
   */
  public static recordQuizPerformance(
    studentId: string,
    subjectId: string,
    chapterId: string,
    conceptId: string,
    conceptName: string,
    scorePercent: number,
    correctCount: number,
    totalCount: number,
    durationMinutes: number = 15
  ): void {
    const lvl = this.getLevelFromScore(scorePercent);

    // 1. Update or create ConceptMastery
    const existingMastery = this.getMasteryForConcept(studentId, conceptId);
    const newAttempted = (existingMastery?.questionsAttempted || 0) + totalCount;
    const newCorrect = (existingMastery?.questionsCorrect || 0) + correctCount;
    const reviewCount = (existingMastery?.reviewCount || 0) + 1;
    
    // Blend score if existing, or use current score
    const newScore = existingMastery
      ? Math.round(existingMastery.score * 0.35 + scorePercent * 0.65)
      : scorePercent;
    const newLevel = this.getLevelFromScore(newScore);

    const updatedMastery: ConceptMastery = {
      id: existingMastery?.id || `mas-${conceptId}-${Date.now()}`,
      studentId,
      subjectId,
      chapterId,
      topicId: existingMastery?.topicId || `${chapterId}-top-1`,
      conceptId,
      conceptName: existingMastery?.conceptName || conceptName,
      score: newScore,
      level: newLevel.level,
      lastStudiedAt: new Date().toISOString(),
      reviewCount,
      questionsAttempted: newAttempted,
      questionsCorrect: newCorrect,
      averageTimeSeconds: 45,
      masteredSkills: newScore >= 75 ? [conceptName] : (existingMastery?.masteredSkills || []),
      needsImprovementSkills: newScore < 60 ? [conceptName] : [],
      status: newLevel.status
    };
    DatabaseService.saveMastery(updatedMastery);

    // 2. Track Event with full metadata
    this.trackEvent({
      studentId,
      eventType: 'QUIZ_COMPLETED',
      subjectId,
      chapterId,
      metadata: {
        score: scorePercent,
        correctCount,
        totalCount,
        conceptId,
        conceptName,
        durationMinutes
      }
    }, durationMinutes);

    // 3. Update StudyTimeStats accurately
    const stats = DatabaseService.getStats(studentId);
    const prevTotal = stats.totalQuestionsCompleted;
    const prevCorrect = Math.round((stats.accuracyPercentage / 100) * prevTotal);
    const newTotalQ = prevTotal + totalCount;
    const newTotalC = prevCorrect + correctCount;

    stats.totalQuestionsCompleted = newTotalQ;
    stats.accuracyPercentage = newTotalQ > 0 ? Math.round((newTotalC / newTotalQ) * 100) : 0;
    stats.averageQuizScore = stats.averageQuizScore === 0 ? scorePercent : Math.round((stats.averageQuizScore + scorePercent) / 2);

    const allMasteries = DatabaseService.getMasteries(studentId);
    stats.totalTopicsMastered = allMasteries.filter(m => m.level >= 4).length;
    DatabaseService.updateStats(stats);

    // 4. Record Audit Log
    const student = DatabaseService.getStudentById(studentId);
    DatabaseService.insertAuditLog({
      id: `audit-quiz-${Date.now()}`,
      who: 'Student Engine',
      what: 'Kuis Evaluasi Selesai',
      targetUserId: student?.userId || studentId,
      targetUserName: student?.fullName || 'M Elang El Haqeem',
      when: new Date().toISOString(),
      oldValue: existingMastery ? `Skor Lama: ${existingMastery.score}%` : 'Belum Ada Skor',
      newValue: `Skor Baru: ${newScore}% (${correctCount}/${totalCount} Benar)`
    });
  }

  /**
   * Records that a student started or completed reading a lesson module (with visual and TTS audio),
   * increasing study time and registering initial concept awareness.
   */
  public static recordLessonReading(
    studentId: string,
    subjectId: string,
    chapterId: string,
    conceptId: string,
    conceptName: string,
    durationMinutes: number = 5
  ): void {
    const existing = this.getMasteryForConcept(studentId, conceptId);
    if (!existing) {
      // Create initial baseline mastery for explored lesson
      const initialScore = 45; // Developing / exploration
      const lvl = this.getLevelFromScore(initialScore);
      DatabaseService.saveMastery({
        id: `mas-${conceptId}-${Date.now()}`,
        studentId,
        subjectId,
        chapterId,
        topicId: `${chapterId}-top-1`,
        conceptId,
        conceptName,
        score: initialScore,
        level: lvl.level,
        lastStudiedAt: new Date().toISOString(),
        reviewCount: 1,
        questionsAttempted: 0,
        questionsCorrect: 0,
        averageTimeSeconds: 60,
        masteredSkills: [],
        needsImprovementSkills: [],
        status: lvl.status
      });
    } else {
      existing.reviewCount += 1;
      existing.lastStudiedAt = new Date().toISOString();
      DatabaseService.saveMastery(existing);
    }

    // Track Event
    this.trackEvent({
      studentId,
      eventType: 'LESSON_STARTED',
      subjectId,
      chapterId,
      metadata: {
        conceptId,
        conceptName,
        durationMinutes
      }
    }, durationMinutes);
  }

  // -------------------------------------------------------------
  // GOALS & PREFERENCES (CONNECTED TO DATABASE)
  // -------------------------------------------------------------
  public static getGoals(studentId: string): StudentGoals {
    return DatabaseService.getGoals(studentId);
  }

  public static saveGoals(goals: StudentGoals): void {
    DatabaseService.updateGoals(goals);
  }

  public static getPreferences(studentId: string): StudentPreferences {
    return DatabaseService.getPreferences(studentId);
  }

  public static savePreferences(prefs: StudentPreferences): void {
    DatabaseService.updatePreferences(prefs);
  }

  // -------------------------------------------------------------
  // PERSONAL INSIGHTS & WEEKLY REPORT
  // -------------------------------------------------------------
  public static getPersonalInsights(studentId: string): PersonalLearningInsight[] {
    const gaps = this.detectLearningGaps(studentId);
    const stats = this.getStudyStats(studentId);

    if (stats.thisMonthMinutes === 0 && gaps.length === 0) {
      return [
        {
          id: 'ins-empty-1',
          studentId,
          title: 'Mulai Pembelajaran Pertama Kamu',
          description: 'Sqolah akan menganalisis kecepatan belajar, tingkat akurasi soal, dan retensi memorimu setelah kamu menyelesaikan materi atau kuis pertama.',
          type: 'time_pattern',
          icon: 'sparkles',
          createdAt: new Date().toISOString()
        }
      ];
    }

    const insights: PersonalLearningInsight[] = [
      {
        id: 'ins-1',
        studentId,
        title: 'Gaya Belajar Auditori Paling Efektif',
        description: 'Tingkat akurasi soal meningkat 24% saat materi dibaca dengan fitur narasi suara (TTS) aktif.',
        type: 'accuracy_trend',
        icon: 'volume-high',
        createdAt: new Date().toISOString()
      },
      {
        id: 'ins-2',
        studentId,
        title: 'Konsistensi Belajar Jam 19:00 - 21:00',
        description: 'Kamu paling produktif menyelesaikan kuis dan modul materi di malam hari dengan fokus stabil.',
        type: 'time_pattern',
        icon: 'moon',
        createdAt: new Date().toISOString()
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

    let strongest = 'Belum Ada Data';
    let weakest = 'Belum Ada Data';

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
      weekRange: 'Pekan Ini (Aktif)',
      learningHoursMinutes: `${hours} jam ${mins} menit`,
      lessonsCompleted: stats.totalTopicsMastered,
      questionsAnswered: stats.totalQuestionsCompleted,
      accuracyPercentage: stats.accuracyPercentage,
      masteryGainPercentage: stats.totalTopicsMastered > 0 ? 8 : 0,
      strongestTopic: strongest,
      weakestTopic: weakest,
      consistencyScore: Math.min(100, streak.currentStreakDays * 20),
      recommendationsNextWeek: [
        'Selesaikan asesmen diagnostik dan modul materi Bab 1 Struktur Atom.',
        'Gunakan narasi suara TTS untuk meningkatkan retensi rumus.',
        'Jaga streak belajar minimal 15 menit setiap hari.'
      ],
      generatedAt: new Date().toISOString()
    };
  }

  // -------------------------------------------------------------
  // STUDENT CONTEXT PAYLOAD EXPORT (For AI/Tutor Integration)
  // -------------------------------------------------------------
  public static exportStudentContext(studentId: string): StudentContextPayload {
    const student = DatabaseService.getStudentById(studentId) || DatabaseService.getStudents()[0];
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
