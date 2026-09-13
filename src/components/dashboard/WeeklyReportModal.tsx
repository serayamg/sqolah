import React from 'react';
import { WeeklyLearningReport } from '../../types/intelligence';

interface WeeklyReportModalProps {
  report: WeeklyLearningReport;
  studentName: string;
  onClose: () => void;
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({
  report,
  studentName,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 md:p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
              📊
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Laporan Belajar Mingguan</h2>
              <p className="text-xs text-slate-500">Periode: {report.weekRange} • {studentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Highlight Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 text-center">
            <div className="text-xs text-blue-600 font-medium mb-1">Total Waktu</div>
            <div className="text-lg font-bold text-slate-800">{report.learningHoursMinutes}</div>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 text-center">
            <div className="text-xs text-emerald-600 font-medium mb-1">Akurasi Soal</div>
            <div className="text-lg font-bold text-emerald-700">{report.accuracyPercentage}%</div>
          </div>

          <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 text-center">
            <div className="text-xs text-purple-600 font-medium mb-1">Pertumbuhan</div>
            <div className="text-lg font-bold text-purple-700">+{report.masteryGainPercentage}%</div>
          </div>

          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100 text-center">
            <div className="text-xs text-amber-600 font-medium mb-1">Konsistensi</div>
            <div className="text-lg font-bold text-amber-700">{report.consistencyScore}%</div>
          </div>
        </div>

        {/* Strongest vs Weakest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-2">
              <span>🌟 Topik Paling Dikuasai</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">{report.strongestTopic}</h4>
            <p className="text-xs text-slate-600 mt-1">
              Konsisten mendapatkan skor di atas 85% pada latihan soal dan penguasaan konsep.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
              <span>⚠️ Perlu Fokus Perbaikan</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">{report.weakestTopic}</h4>
            <p className="text-xs text-slate-600 mt-1">
              Disarankan memperkuat konsep prasyarat dan mengulang latihan bertahap.
            </p>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Rekomendasi Belajar Minggu Depan
          </h4>
          <div className="space-y-2.5">
            {report.recommendationsNextWeek.map((rec, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-xs text-slate-700 font-medium leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Close CTA */}
        <div className="text-right pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
          >
            Tutup Laporan
          </button>
        </div>
      </div>
    </div>
  );
};
