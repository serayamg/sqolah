import React, { useState } from 'react';
import { StudentProfile } from '../../types/intelligence';
import { AuthService } from '../../services/authService';
import { IntelligenceService } from '../../services/intelligenceService';
import { Student360View } from './Student360View';

interface AdminAnalyticsViewProps {
  onSwitchUser: (userId: string) => void;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ onSwitchUser }) => {
  const [selectedStudentFor360, setSelectedStudentFor360] = useState<StudentProfile | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const students = AuthService.getStudentProfiles();
  const auditLogs = AuthService.getAuditLogs();

  // Compute platform metrics dynamically from real student records
  const studentMasteries = students.map(s => IntelligenceService.calculateOverallMastery(s.studentId));
  const avgMastery = studentMasteries.length > 0
    ? Math.round(studentMasteries.reduce((a, b) => a + b.overallScore, 0) / studentMasteries.length)
    : 0;
  const avgLevelLabel = avgMastery === 0 ? 'Belum Dimulai' : IntelligenceService.getLevelFromScore(avgMastery).label;
  const totalHours = students.reduce((acc, s) => {
    const st = IntelligenceService.getStudyStats(s.studentId);
    return acc + (st?.totalHours || 0);
  }, 0);

  // Find students needing attention (have critical learning gaps or uncompleted onboarding)
  const studentsNeedAttention = students.filter(s => {
    if (!s.diagnosticCompleted) return true;
    const gaps = IntelligenceService.detectLearningGaps(s.studentId);
    return gaps.length > 0;
  });

  if (selectedStudentFor360) {
    return (
      <Student360View
        studentProfile={selectedStudentFor360}
        onBack={() => setSelectedStudentFor360(null)}
        onProfileUpdated={() => setRefreshTick(prev => prev + 1)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
            <span>🛡️ Super Admin Control Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Admin Analytics & Student Intelligence
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitoring penguasaan silabus, deteksi kesenjangan belajar siswa, dan audit trail operasional bimbel.
          </p>
        </div>

        <button
          onClick={() => {
            AuthService.resetDemoData();
            setRefreshTick(prev => prev + 1);
          }}
          className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl transition self-start sm:self-auto"
        >
          🔄 Reset Data Demo
        </button>
      </div>

      {/* Top Platform Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
          <div className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Total Siswa Terdaftar
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800">{students.length}</div>
          <div className="text-[11px] sm:text-xs text-emerald-600 font-medium mt-1">100% Akun Aktif</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
          <div className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Rata-rata Penguasaan
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{avgMastery}%</div>
          <div className="text-[11px] sm:text-xs text-blue-500 font-medium mt-1">Tingkat: {avgLevelLabel}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
          <div className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Butuh Perhatian
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-600">{studentsNeedAttention.length}</div>
          <div className="text-[11px] sm:text-xs text-rose-500 font-medium mt-1">Gaps / Diagnostik</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
          <div className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Total Jam Belajar
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">{totalHours} Jam</div>
          <div className="text-[11px] sm:text-xs text-purple-500 font-medium mt-1">Bulan Ini</div>
        </div>
      </div>

      {/* ================= SECTION: STUDENTS NEED ATTENTION ================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <span>⚠️ Siswa yang Memerlukan Perhatian Khusus</span>
            </h2>
            <p className="text-xs text-slate-500">
              Siswa dengan kesenjangan pemahaman konsep atau belum menyelesaikan asesmen awal
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
            {studentsNeedAttention.length} Siswa Terdeteksi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentsNeedAttention.map(s => {
            const gaps = IntelligenceService.detectLearningGaps(s.studentId);
            const overall = IntelligenceService.calculateOverallMastery(s.studentId);
            return (
              <div
                key={s.id}
                className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{s.fullName}</h4>
                      <div className="text-xs text-slate-500 font-mono">
                        {s.studentId} • {s.school}
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-800">
                      Mastery: {overall.overallScore}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mb-3 leading-relaxed">
                    {!s.diagnosticCompleted
                      ? '📌 Siswa belum menyelesaikan Asesmen Diagnostik Awal. Jalur rekomendasi belum sepenuhnya aktif.'
                      : `📌 Kesenjangan terdeteksi pada ${gaps.length} konsep. Salah satu akar masalah: "${gaps[0]?.rootProblemConceptName || 'Konsep Dasar'}".`}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-rose-200/60">
                  <button
                    onClick={() => onSwitchUser(s.userId)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Login sebagai Siswa Ini →
                  </button>
                  <button
                    onClick={() => setSelectedStudentFor360(s)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold transition"
                  >
                    Buka Profil 360°
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= SECTION: ALL STUDENTS DIRECTORY ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-1">Daftar Seluruh Siswa Sqolah</h2>
        <p className="text-xs text-slate-500 mb-4 sm:mb-5">
          Manajemen penugasan silabus, kurikulum, dan pemantauan individual siswa
        </p>

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-xs text-slate-700 min-w-[620px]">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Siswa</th>
                <th className="py-3 px-4">Program & Kelas</th>
                <th className="py-3 px-4">Kurikulum</th>
                <th className="py-3 px-4">Status Diagnostik</th>
                <th className="py-3 px-4">Mastery Score</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(st => {
                const overall = IntelligenceService.calculateOverallMastery(st.studentId);
                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{st.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{st.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{st.program}</div>
                      <div className="text-[11px] text-slate-500">Kelas {st.grade === 11 ? 'XI' : st.grade} ({st.level})</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{st.curriculum}</td>
                    <td className="py-3.5 px-4">
                      {st.diagnosticCompleted ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ Selesai
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Belum Tes
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">
                      {overall.overallScore}% ({overall.label})
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onSwitchUser(st.userId)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px] transition"
                        title="Simulasi sesi sebagai siswa ini"
                      >
                        Simulasi Sesi
                      </button>
                      <button
                        onClick={() => setSelectedStudentFor360(st)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-[11px] transition shadow-sm"
                      >
                        Lihat 360°
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= SECTION: AUDIT TRAIL LOG ================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <span>📜 Audit Trail Operasional</span>
            </h2>
            <p className="text-xs text-slate-500">
              Pencatatan riwayat perubahan penugasan, kurikulum, dan pengaturan oleh Administrator
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {auditLogs.length} Entri Tercatat
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Waktu (When)</th>
                <th className="py-3 px-4">Pelaku (Who)</th>
                <th className="py-3 px-4">Aksi (What)</th>
                <th className="py-3 px-4">Target Siswa</th>
                <th className="py-3 px-4">Nilai Sebelumnya (Old)</th>
                <th className="py-3 px-4">Nilai Baru (New)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.when).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{log.who}</td>
                  <td className="py-3 px-4 font-bold text-blue-600">{log.what}</td>
                  <td className="py-3 px-4 text-slate-800">{log.targetUserName}</td>
                  <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{log.oldValue}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700 max-w-xs truncate">
                    {log.newValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
