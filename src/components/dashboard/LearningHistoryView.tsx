import React, { useState } from 'react';
import { IntelligenceService } from '../../services/intelligenceService';
import { LearningEventType } from '../../types/intelligence';

interface LearningHistoryViewProps {
  studentId: string;
}

export const LearningHistoryView: React.FC<LearningHistoryViewProps> = ({ studentId }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const events = IntelligenceService.getEvents(studentId);

  const filteredEvents = events.filter(e => {
    if (filterType === 'all') return true;
    return e.eventType === filterType;
  });

  const getEventBadge = (type: LearningEventType) => {
    switch (type) {
      case 'QUIZ_COMPLETED':
        return { label: 'Kuis Selesai', color: 'bg-emerald-100 text-emerald-800', icon: '📝' };
      case 'AUDIO_LISTENED':
        return { label: 'Narasi Audio Didengar', color: 'bg-blue-100 text-blue-800', icon: '🎧' };
      case 'DIAGNOSTIC_COMPLETED':
        return { label: 'Asesmen Diagnostik', color: 'bg-purple-100 text-purple-800', icon: '🎯' };
      case 'LESSON_STARTED':
      case 'LESSON_COMPLETED':
        return { label: 'Materi Pelajaran', color: 'bg-amber-100 text-amber-800', icon: '📖' };
      default:
        return { label: 'Aktivitas Belajar', color: 'bg-slate-100 text-slate-800', icon: '⚡' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Riwayat Belajar (Learning History)</h1>
          <p className="text-slate-500 text-sm mt-1">
            Rekam jejak setiap sesi membaca, mendengarkan audio narasi, dan pengerjaan kuis latihan.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'QUIZ_COMPLETED', label: 'Kuis' },
            { id: 'AUDIO_LISTENED', label: 'Audio TTS' },
            { id: 'DIAGNOSTIC_COMPLETED', label: 'Diagnostik' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterType === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        {filteredEvents.length > 0 ? (
          <div className="relative border-l-2 border-slate-100 ml-4 space-y-6">
            {filteredEvents.map(ev => {
              const badge = getEventBadge(ev.eventType);
              const date = new Date(ev.timestamp);
              const formattedDate = date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              const formattedTime = date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={ev.id} className="relative pl-6">
                  {/* Timeline dot */}
                  <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-xs">
                    {badge.icon}
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {formattedDate} • {formattedTime} WIB
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800">
                      {ev.chapterId ? `Bab ${ev.chapterId.replace('chap-kim-', '')} Kimia SMA` : 'Mata Pelajaran Kimia SMA'}
                    </h4>

                    {ev.metadata && (
                      <div className="mt-2 text-xs text-slate-600 space-y-1">
                        {typeof ev.metadata.score === 'number' && (
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-500">Skor Diperoleh:</span>
                            <span className="font-bold text-emerald-600">{ev.metadata.score}%</span>
                          </div>
                        )}
                        {typeof ev.metadata.durationMinutes === 'number' && (
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-500">Durasi Belajar:</span>
                            <span className="font-medium text-slate-700">{ev.metadata.durationMinutes} menit</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm">
            Belum ada aktivitas tercatat untuk filter ini.
          </div>
        )}
      </div>
    </div>
  );
};
