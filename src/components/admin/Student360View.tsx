import React, { useState } from 'react';
import { StudentProfile } from '../../types/intelligence';
import { AuthService } from '../../services/authService';
import { IntelligenceService } from '../../services/intelligenceService';

interface Student360ViewProps {
  studentProfile: StudentProfile;
  onBack: () => void;
  onProfileUpdated?: () => void;
}

export const Student360View: React.FC<Student360ViewProps> = ({
  studentProfile,
  onBack,
  onProfileUpdated
}) => {
  const [profile, setProfile] = useState<StudentProfile>(studentProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const studentId = profile.studentId;
  const overall = IntelligenceService.calculateOverallMastery(studentId);
  const gaps = IntelligenceService.detectLearningGaps(studentId);
  const stats = IntelligenceService.getStudyStats(studentId);
  const streak = IntelligenceService.getStreak(studentId);
  const events = IntelligenceService.getEvents(studentId).slice(0, 5);

  const handleSaveAdminChanges = () => {
    const oldVal = `${studentProfile.program} | Kelas ${studentProfile.grade}`;
    const newVal = `${profile.program} | Kelas ${profile.grade}`;

    AuthService.updateStudentByAdmin(
      profile,
      'Update Program & Kelas Siswa',
      oldVal,
      newVal,
      'admin@sqolah.id'
    );

    setIsEditing(false);
    onProfileUpdated?.();
  };

  const handleCopyStudentContext = () => {
    const payload = IntelligenceService.exportStudentContext(studentId);
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fade-in">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              Student 360° Profile: {profile.fullName}
            </h1>
            <p className="text-xs text-slate-500">ID Siswa: {profile.studentId} • Asal: {profile.school}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyStudentContext}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
            title="Salin payload student_context JSON untuk integrasi AI / Tutor"
          >
            <span>{copiedPayload ? '✓ Tersalin!' : '📋 Salin JSON Context'}</span>
          </button>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
            >
              Ubah Penugasan Admin
            </button>
          ) : (
            <button
              onClick={handleSaveAdminChanges}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
            >
              Simpan Perubahan
            </button>
          )}
        </div>
      </div>

      {/* Admin Assignment Details Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <span>⚙️ Pengaturan Penugasan Akademik (Super Admin)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 mb-1 font-medium">Program Bimbel</label>
            {isEditing ? (
              <select
                value={profile.program}
                onChange={e => setProfile({ ...profile, program: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
              >
                <option value="Reguler Bimbel SMA">Reguler Bimbel SMA</option>
                <option value="Intensif UTBK / SNBT & Prestasi">Intensif UTBK / SNBT & Prestasi</option>
                <option value="Persiapan Olimpiade Sains (OSN)">Persiapan Olimpiade Sains (OSN)</option>
              </select>
            ) : (
              <div className="p-2.5 bg-slate-50 rounded-xl font-semibold text-slate-800 border border-slate-200">
                {profile.program}
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-medium">Kurikulum</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.curriculum}
                onChange={e => setProfile({ ...profile, curriculum: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
              />
            ) : (
              <div className="p-2.5 bg-slate-50 rounded-xl font-semibold text-slate-800 border border-slate-200">
                {profile.curriculum}
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-medium">Tingkat Kelas</label>
            {isEditing ? (
              <input
                type="number"
                min="10"
                max="12"
                value={profile.grade}
                onChange={e => setProfile({ ...profile, grade: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
              />
            ) : (
              <div className="p-2.5 bg-slate-50 rounded-xl font-semibold text-slate-800 border border-slate-200">
                Kelas {profile.grade} ({profile.level})
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Intelligence & Mastery Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Overall Mastery
          </div>
          <div className="text-3xl font-bold text-blue-600">{overall.overallScore}%</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">{overall.label} (Lvl {overall.level})</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Streak Belajar
          </div>
          <div className="text-3xl font-bold text-amber-500">{streak.currentStreakDays} Hari 🔥</div>
          <div className="text-xs text-slate-600 mt-1">Rekor Terbaik: {streak.bestStreakDays} Hari</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Total Jam Belajar
          </div>
          <div className="text-3xl font-bold text-purple-600">{stats.totalHours} Jam</div>
          <div className="text-xs text-slate-600 mt-1">Akurasi Soal: {stats.accuracyPercentage}%</div>
        </div>
      </div>

      {/* Learning Gaps & Prerequisite Diagnostic */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Kesenjangan Belajar & Masalah Prasyarat Terdeteksi
        </h3>

        {gaps.length > 0 ? (
          <div className="space-y-3">
            {gaps.map(g => (
              <div key={g.id} className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-rose-950 text-sm">{g.strugglingConceptName}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-800 font-bold">
                    Skor Saat Ini: {g.currentMasteryScore}%
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">{g.explanation}</p>
                <div className="font-semibold text-rose-800">
                  Akar Prasyarat Bermasalah: {g.rootProblemConceptName}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500 py-4 text-center">
            Tidak ada learning gaps kritis pada siswa ini.
          </div>
        )}
      </div>

      {/* Recent Learning Activity Log */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Aktivitas Belajar Terakhir
        </h3>

        <div className="space-y-2 text-xs">
          {events.map(ev => (
            <div key={ev.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-2">
                <span>{ev.eventType === 'QUIZ_COMPLETED' ? '📝' : '🎧'}</span>
                <span className="font-semibold text-slate-800">{ev.eventType}</span>
                <span className="text-slate-500">• {ev.chapterId || 'Kimia SMA'}</span>
              </div>
              <span className="text-slate-400 font-mono">
                {new Date(ev.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
