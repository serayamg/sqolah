import React, { useState } from 'react';
import { StudentProfile } from '../../types/intelligence';
import { IntelligenceService } from '../../services/intelligenceService';
import { WeeklyReportModal } from './WeeklyReportModal';

interface StudentDashboardProps {
  studentProfile: StudentProfile;
  onNavigateToMateri: (babNumber: number) => void;
  onNavigateToQuiz: (babNumber: number) => void;
  onNavigateToMasteryMap: () => void;
  onNavigateToDiagnostic: () => void;
  onDataRefresh?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentProfile,
  onNavigateToMateri,
  onNavigateToQuiz,
  onNavigateToMasteryMap,
  onNavigateToDiagnostic,
  onDataRefresh
}) => {
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  const studentId = studentProfile.studentId;
  const overall = IntelligenceService.calculateOverallMastery(studentId);
  const masteries = IntelligenceService.getStudentMasteries(studentId);
  const gaps = IntelligenceService.detectLearningGaps(studentId);
  const nextBestActions = IntelligenceService.getNextBestActions(studentId);
  const todayTasks = IntelligenceService.getTodayLearningPlan(studentId);
  const streak = IntelligenceService.getStreak(studentId);
  const stats = IntelligenceService.getStudyStats(studentId);
  const insights = IntelligenceService.getPersonalInsights(studentId);
  const events = IntelligenceService.getEvents(studentId).slice(0, 4);
  const goals = IntelligenceService.getGoals(studentId);
  const weeklyReport = IntelligenceService.generateWeeklyReport(studentId);

  // Top strengths (score >= 75)
  const strengths = masteries.filter(m => m.score >= 75).slice(0, 3);

  // Active continue chapter calculation (reactive to student progress)
  const continueChapter = React.useMemo(() => {
    if (masteries.length === 0) {
      return {
        babNumber: 1,
        badge: 'Bab 1 Kimia',
        title: 'Bab 1: Struktur Atom & Sistem Periodik Unsur',
        description: 'Mulailah perjalanan belajarmu dengan menguasai partikel subatom, nomor atom, konfigurasi elektron, dan tabel periodik.',
        score: 0,
        buttonText: 'Mulai Belajar Bab 1'
      };
    }
    if (gaps.length > 0) {
      const gap = gaps[0];
      const match = gap.chapterId?.match(/kim-(\d+)/);
      const bNum = match ? parseInt(match[1]) : 1;
      return {
        babNumber: bNum,
        badge: `Bab ${bNum} (Perlu Penguatan)`,
        title: `Bab ${bNum}: Penguatan ${gap.strugglingConceptName}`,
        description: `Perbaiki konsep prasyarat "${gap.rootProblemConceptName}" agar pemahaman materi tidak terhambat.`,
        score: gap.currentMasteryScore,
        buttonText: `Perbaiki Materi Bab ${bNum}`
      };
    }
    return {
      babNumber: 1,
      badge: 'Bab 1 Kimia',
      title: 'Bab 1: Struktur Atom & Notasi Nuklida',
      description: 'Lanjutkan pendalaman materi dan kerjakan latihan soal untuk meningkatkan akurasi dan retensi.',
      score: overall.overallScore,
      buttonText: 'Buka Materi Bab 1'
    };
  }, [masteries, gaps, overall]);

  // Active curriculum chapters for overview
  const displayChapters = [
    { id: 'chap-kim-1', babNumber: 1, name: 'Bab 1: Struktur Atom & Tabel Periodik' },
    { id: 'chap-kim-2', babNumber: 2, name: 'Bab 2: Ikatan Kimia & Bentuk Molekul' },
    { id: 'chap-kim-4', babNumber: 4, name: 'Bab 4: Tata Nama & Persamaan Reaksi' },
    { id: 'chap-kim-5', babNumber: 5, name: 'Bab 5: Stoikiometri & Konsep Mol' },
  ];

  // Growth data: If new student with 0 masteries, display 0%
  const isNewStudent = masteries.length === 0 && stats.totalQuestionsCompleted === 0;
  const growthData = isNewStudent
    ? [
        { week: 'Minggu 1', score: 0 },
        { week: 'Minggu 2', score: 0 },
        { week: 'Minggu 3', score: 0 },
        { week: 'Minggu Ini', score: 0 }
      ]
    : [
        { week: 'Minggu 1', score: Math.max(0, Math.round(overall.overallScore * 0.4)) },
        { week: 'Minggu 2', score: Math.max(0, Math.round(overall.overallScore * 0.65)) },
        { week: 'Minggu 3', score: Math.max(0, Math.round(overall.overallScore * 0.85)) },
        { week: 'Minggu Ini', score: overall.overallScore }
      ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-5 sm:space-y-8 animate-fade-in">
      {/* ================= AREA 1: HEADER PROFIL SISWA ================= */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-600/40 text-blue-200 border border-blue-400/30 text-xs px-3 py-1 rounded-full font-semibold">
                ID: {studentProfile.studentId}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-semibold">
                {studentProfile.level} - Kelas {studentProfile.grade === 11 ? 'XI' : studentProfile.grade}
              </span>
              <span className="bg-white/10 text-slate-200 text-xs px-3 py-1 rounded-full">
                {studentProfile.curriculum}
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Halo, {studentProfile.fullName}! 👋
              </h1>
              <p className="text-slate-300 text-sm mt-1">
                Program: <span className="font-semibold text-white">{studentProfile.program}</span>
                {goals.targetCampusOrSchool && (
                  <span className="text-slate-400 ml-2">
                    • Target: <span className="text-blue-200 font-medium">{goals.targetCampusOrSchool}</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Overall Mastery Score Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 md:p-5 rounded-2xl flex items-center space-x-4 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-white/20"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * overall.overallScore) / 100}
                  className="text-blue-400 transition-all duration-1000"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xl font-bold text-white">{overall.overallScore}%</span>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                Overall Mastery
              </div>
              <div className="text-base font-bold text-white leading-snug">{overall.label}</div>
              <div className="text-xs text-blue-200 mt-0.5">
                Level {overall.level} • {overall.masteredConceptsCount} Konsep Dikuasai
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DATABASE STATUS & LEARNING SIMULATOR ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-slate-800">Database Sqolah Terhubung</span>
            <span className="text-xs text-slate-500 ml-2">
              {masteries.length === 0
                ? '• Status: Data Belajar Bersih (0% - Belum Ada Riwayat)'
                : `• Status: ${masteries.length} Konsep Tersimpan (${overall.overallScore}% Penguasaan)`}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {masteries.length === 0 ? (
            <>
              <button
                onClick={() => {
                  IntelligenceService.simulateLearning(studentId);
                  onDataRefresh?.();
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center space-x-1.5"
                title="Simulasikan proses belajar Elang (Asesmen Diagnostik, Membaca Materi dengan Audio TTS, dan Kuis)"
              >
                <span>⚡ Simulasikan Sesi Belajar Elang</span>
              </button>
              <button
                onClick={() => {
                  IntelligenceService.resetStudentToEmpty(studentId);
                  onDataRefresh?.();
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-200 font-semibold text-xs rounded-xl transition"
                title="Kosongkan dan bersihkan seluruh data belajar Elang ke nol"
              >
                🔄 Kosongkan Data (0%)
              </button>
              <button
                onClick={onNavigateToDiagnostic}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                Mulai Asesmen
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  IntelligenceService.simulateLearning(studentId);
                  onDataRefresh?.();
                }}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs rounded-xl transition"
                title="Perbarui sesi belajar simulasi"
              >
                + Update Sesi Belajar
              </button>
              <button
                onClick={() => {
                  IntelligenceService.resetStudentToEmpty(studentId);
                  onDataRefresh?.();
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-200 font-semibold text-xs rounded-xl transition"
                title="Kosongkan kembali semua riwayat dan data belajar Elang ke awal"
              >
                🔄 Kosongkan Data
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid: Areas 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= AREA 2: CONTINUE LEARNING ================= */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <span>⚡ Lanjutkan Belajar</span>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                {continueChapter.badge}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 leading-snug mb-2">
              {continueChapter.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {continueChapter.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span>Progres Materi</span>
              <span className="font-semibold text-slate-700">
                {continueChapter.score === 0 ? '0% (Belum Dimulai)' : `${continueChapter.score}% Dikuasai`}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  continueChapter.score >= 75
                    ? 'bg-emerald-500'
                    : continueChapter.score >= 50
                    ? 'bg-blue-600'
                    : continueChapter.score > 0
                    ? 'bg-amber-500'
                    : 'bg-slate-300'
                }`}
                style={{ width: `${continueChapter.score}%` }}
              />
            </div>
            <button
              onClick={() => onNavigateToMateri(continueChapter.babNumber)}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition shadow-sm flex items-center justify-center space-x-2 min-h-[44px]"
            >
              <span>{continueChapter.buttonText}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* ================= AREA 3: TODAY'S LEARNING PLAN ================= */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">Rencana Belajar Hari Ini</h2>
              <p className="text-xs text-slate-500">3 Target harian terkalibrasi untuk mempertahankan retensi</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 self-start sm:self-auto flex-shrink-0">
              Estimasi Total: {todayTasks.reduce((acc, t) => acc + t.durationMinutes, 0)} Menit
            </span>
          </div>

          <div className="space-y-3">
            {todayTasks.map((task, idx) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 transition bg-slate-50/50 hover:bg-white"
              >
                <div className="flex items-start space-x-3 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-slate-800 break-words leading-snug">{task.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="flex items-center space-x-1 flex-shrink-0">
                        <span>⏱</span>
                        <span>{task.durationMinutes} menit</span>
                      </span>
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-medium flex-shrink-0">
                        {task.type === 'review' ? 'Fondasi Prasyarat' : task.type === 'practice' ? 'Latihan Adaptif' : 'Materi Baru'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (task.type === 'practice') onNavigateToQuiz(5);
                    else if (task.type === 'review') onNavigateToMateri(1);
                    else onNavigateToMateri(7);
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-lg transition shrink-0 min-h-[36px]"
                >
                  Mulai
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= AREA 6: NEXT BEST ACTION (High Priority Alert) ================= */}
      {nextBestActions.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="inline-flex items-center space-x-1.5 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <span>🎯 Next Best Action Terpilih</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 break-words">{nextBestActions[0].title}</h3>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-3xl break-words">
                <span className="font-semibold text-amber-900">Mengapa penting:</span> {nextBestActions[0].reason}
              </p>
            </div>

            <button
              onClick={() => {
                if (nextBestActions[0].actionUrl === 'diagnostic') onNavigateToDiagnostic();
                else if (nextBestActions[0].actionUrl?.startsWith('quiz')) onNavigateToQuiz(5);
                else onNavigateToMateri(1);
              }}
              className="w-full md:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition shadow-md shrink-0 flex items-center justify-center space-x-2 min-h-[44px]"
            >
              <span>Kerjakan Sekarang</span>
              <span>⚡</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid: Areas 4 & 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= AREA 4: SUBJECT MASTERY OVERVIEW ================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Ringkasan Penguasaan Mapel</h2>
              <p className="text-xs text-slate-500">Kimia SMA (20 Bab Kurikulum Merdeka)</p>
            </div>
            <button
              onClick={onNavigateToMasteryMap}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Buka Mastery Map Penuh →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xl font-bold text-blue-600">{overall.overallScore}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Rata-rata Skor</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xl font-bold text-emerald-600">{overall.masteredConceptsCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Konsep Mahir</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xl font-bold text-purple-600">{stats.totalQuestionsCompleted}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Soal Selesai</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xl font-bold text-amber-600">{stats.accuracyPercentage}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Tingkat Akurasi</div>
            </div>
          </div>

          {/* Sample progress bars of active chapters */}
          <div className="space-y-3">
            {displayChapters.map(chap => {
              const chapterMasteries = masteries.filter(
                m => m.chapterId === chap.id || (m.chapterId && m.chapterId.includes(`kim-${chap.babNumber}`))
              );
              let chapScore = 0;
              let chapStatusText = '0% (Belum Dimulai)';
              let chapBarColor = 'bg-slate-200';
              let chapTextColor = 'text-slate-400';

              if (chapterMasteries.length > 0) {
                const sum = chapterMasteries.reduce((a, b) => a + b.score, 0);
                chapScore = Math.round(sum / chapterMasteries.length);
                const lvlInfo = IntelligenceService.getLevelFromScore(chapScore);
                chapStatusText = `${chapScore}% (${lvlInfo.label})`;
                chapTextColor = chapScore >= 75 ? 'text-emerald-600' : chapScore >= 60 ? 'text-blue-600' : 'text-amber-600';
                chapBarColor = chapScore >= 75 ? 'bg-emerald-500' : chapScore >= 60 ? 'bg-blue-500' : 'bg-amber-500';
              }

              return (
                <div key={chap.id}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{chap.name}</span>
                    <span className={chapTextColor}>{chapStatusText}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${chapBarColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${chapScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= AREA 5: STRENGTHS & LEARNING GAPS ================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Kekuatan & Kesenjangan (Learning Gaps)</h2>
            <p className="text-xs text-slate-500">Diagnosis akar masalah dan fondasi konsep yang butuh perbaikan</p>
          </div>

          {/* Top Strengths */}
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <span>⭐ Top Kekuatan Kamu</span>
            </div>
            {strengths.length > 0 ? (
              <div className="space-y-2">
                {strengths.map(s => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-xs gap-2"
                  >
                    <span className="font-semibold text-emerald-900 break-words min-w-0 flex-1">{s.conceptName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold flex-shrink-0">
                      {s.score}% (Lvl {s.level})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                Belum ada konsep teruji. Kerjakan kuis atau asesmen diagnostik untuk memetakan kekuatan belajarmu!
              </div>
            )}
          </div>

          {/* Learning Gaps & Root Prerequisite Diagnosis */}
          <div>
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <span>⚠️ Kesenjangan Terdeteksi & Akar Masalah</span>
            </div>
            {gaps.length > 0 ? (
              <div className="space-y-3">
                {gaps.slice(0, 2).map(gap => (
                  <div
                    key={gap.id}
                    className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-rose-950 text-sm break-words min-w-0 flex-1">{gap.strugglingConceptName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-800 flex-shrink-0">
                        Skor: {gap.currentMasteryScore}%
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed break-words">{gap.explanation}</p>
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-rose-200/60">
                      <span className="text-[11px] text-rose-800 font-semibold break-words min-w-0 flex-1">
                        Akar Prasyarat: {gap.rootProblemConceptName}
                      </span>
                      <button
                        onClick={() => onNavigateToMateri(1)}
                        className="w-full sm:w-auto px-3 py-1.5 text-[11px] font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition flex-shrink-0 min-h-[32px] self-end sm:self-auto"
                      >
                        Perbaiki Fondasi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                Tidak ada kesenjangan kritis saat ini. Lanjutkan target berikutnya!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Areas 7 & 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= AREA 7: PROGRESS & GROWTH CHART ================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Grafik Pertumbuhan Penguasaan</h2>
              <p className="text-xs text-slate-500">Kenaikan skor pemahaman 4 minggu terakhir</p>
            </div>
            {overall.overallScore === 0 ? (
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                0% (Baru Memulai)
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                +{overall.overallScore}% Pekan Ini
              </span>
            )}
          </div>

          {/* Clean Academic Bar Graph */}
          <div className="pt-4 pb-2">
            <div className="flex items-end justify-between h-40 gap-3 px-2 border-b border-slate-200">
              {growthData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-bold text-slate-700">{item.score}%</span>
                  <div
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 ${
                      item.score === 0 ? 'bg-slate-200' : idx === 3 ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-blue-300'
                    }`}
                    style={{ height: `${Math.max(4, (item.score / 100) * 120)}px` }}
                  />
                  <span className="text-[11px] text-slate-500 font-medium truncate w-full text-center">
                    {item.week}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= AREA 8: STUDY TIME & STREAK STATS ================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Waktu Belajar & Streak Keaktifan</h2>
              <p className="text-xs text-slate-500">Konsistensi harian melatih daya ingat jangka panjang</p>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-bold">
              <span>🔥</span>
              <span>{streak.currentStreakDays} Hari Streak</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
            <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-[11px] sm:text-xs text-slate-500 mb-1">Hari Ini</div>
              <div className="text-sm sm:text-lg font-bold text-slate-800">{stats.todayMinutes}m</div>
            </div>

            <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-[11px] sm:text-xs text-slate-500 mb-1">Minggu Ini</div>
              <div className="text-sm sm:text-lg font-bold text-blue-600">
                {Math.floor(stats.thisWeekMinutes / 60)}j {stats.thisWeekMinutes % 60}m
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-[11px] sm:text-xs text-slate-500 mb-1">Bulan Ini</div>
              <div className="text-sm sm:text-lg font-bold text-purple-600">{stats.totalHours} Jam</div>
            </div>
          </div>

          {/* Active days mini row */}
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-2">Keaktifan 7 Hari Terakhir:</div>
            <div className="flex items-center justify-between gap-1.5">
              {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => {
                const isActive = streak.currentStreakDays > 0 && idx < streak.currentStreakDays;
                return (
                  <div
                    key={day}
                    className={`flex-1 py-2 text-center rounded-xl border text-xs font-bold transition ${
                      isActive
                        ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div>{day}</div>
                    <div className="text-[10px] mt-0.5 font-normal">{isActive ? '✓' : '-'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Areas 9 & 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= AREA 9: RECENT LEARNING HISTORY ================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Riwayat Belajar Terkini</h2>
              <p className="text-xs text-slate-500">Log aktivitas pembelajaran dan latihan soal</p>
            </div>
          </div>

          <div className="space-y-3">
            {events.length > 0 ? (
              events.map(ev => {
                const dateStr = new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div
                    key={ev.id}
                    className="flex items-start justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-base mt-0.5">
                        {ev.eventType === 'QUIZ_COMPLETED' ? '📝' : ev.eventType === 'AUDIO_LISTENED' ? '🎧' : '📖'}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {ev.eventType === 'QUIZ_COMPLETED'
                            ? 'Menyelesaikan Kuis Evaluasi'
                            : ev.eventType === 'AUDIO_LISTENED'
                            ? 'Mendengarkan Narasi Audio Materi'
                            : ev.eventType === 'DIAGNOSTIC_COMPLETED'
                            ? 'Asesmen Diagnostik Awal'
                            : 'Mempelajari Modul Materi'}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {ev.chapterId ? `Bab ${ev.chapterId.replace('chap-kim-', '')} Kimia SMA` : 'Kimia SMA'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{dateStr}</span>
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Belum ada aktivitas belajar. Buka materi atau mulai kuis untuk mencatat riwayat belajarmu secara real-time!
              </div>
            )}
          </div>
        </div>

        {/* ================= AREA 10: PERSONAL LEARNING INSIGHTS ================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Insight Belajar Personal</h2>
                <p className="text-xs text-slate-500">Analisis kecenderungan belajar oleh Sqolah Intelligence</p>
              </div>
              <span className="text-base">💡</span>
            </div>

            <div className="space-y-3">
              {insights.map(ins => (
                <div key={ins.id} className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs">
                  <h4 className="font-bold text-blue-900 mb-1">{ins.title}</h4>
                  <p className="text-slate-700 leading-relaxed">{ins.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Evaluasi berkala mingguan</span>
            <button
              onClick={() => setShowWeeklyModal(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl transition"
            >
              Buka Laporan Mingguan Lengkap 📊
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Report Modal */}
      {showWeeklyModal && (
        <WeeklyReportModal
          report={weeklyReport}
          studentName={studentProfile.fullName}
          onClose={() => setShowWeeklyModal(false)}
        />
      )}
    </div>
  );
};
