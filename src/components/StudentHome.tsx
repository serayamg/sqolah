import React, { useState, useMemo } from 'react';
import { 
  Subject, 
  Materi, 
  Question, 
  EducationLevel, 
  AuditorySettings 
} from '../types';
import { audioEngine } from '../services/audioEngine';
import { 
  Search, 
  BookOpen, 
  HelpCircle, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Clock, 
  Headphones, 
  ChevronRight,
  Zap,
  CheckCircle
} from 'lucide-react';

interface StudentHomeProps {
  currentLevel: EducationLevel;
  selectedKelas: number | null;
  subjects: Subject[];
  materiList: Materi[];
  questions: Question[];
  onOpenMateri: (materiId: string) => void;
  onOpenQuiz: (materiId?: string, subjectId?: string) => void;
  onSelectLevel: (lvl: EducationLevel) => void;
  onOpenAdmin: () => void;
  auditory: AuditorySettings;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  currentLevel,
  selectedKelas,
  subjects,
  materiList,
  questions,
  onOpenMateri,
  onOpenQuiz,
  onSelectLevel,
  onOpenAdmin,
  auditory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Filter subjects for current level and selected kelas
  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => {
      if (s.level !== currentLevel) return false;
      if (selectedKelas !== null && !s.kelas.includes(selectedKelas)) return false;
      return true;
    });
  }, [subjects, currentLevel, selectedKelas]);

  // Filter materi and sort by kelas and babNumber
  const filteredMateri = useMemo(() => {
    const list = materiList.filter(m => {
      // Must match subject of this level
      const subj = subjects.find(s => s.id === m.subjectId);
      if (!subj || subj.level !== currentLevel) return false;
      if (selectedKelas !== null && m.kelas !== selectedKelas) return false;
      if (selectedSubjectId && m.subjectId !== selectedSubjectId) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchSummary = m.summary.toLowerCase().includes(q);
        const matchSubject = subj.name.toLowerCase().includes(q);
        return matchTitle || matchSummary || matchSubject;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (a.kelas !== b.kelas) return a.kelas - b.kelas;
      const getBab = (m: Materi) => {
        if (m.babNumber !== undefined) return m.babNumber;
        const match = m.title.match(/bab\s*(\d+)/i);
        return match ? parseInt(match[1], 10) : 999;
      };
      return getBab(a) - getBab(b);
    });
  }, [materiList, subjects, currentLevel, selectedKelas, selectedSubjectId, searchQuery]);

  const handleQuickListenSummary = (materi: Materi) => {
    audioEngine.playSound('click');
    audioEngine.speak(`Materi: ${materi.title}. Kelas ${materi.kelas}. ${materi.summary}`, {
      rate: auditory.rate
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-24">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-sky-700 via-sky-600 to-indigo-800 text-white p-5 sm:p-8 lg:p-10 shadow-lg shadow-sky-700/15">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-sky-200 mb-2.5 sm:mb-3 border border-white/20">
            <Headphones className="w-3.5 h-3.5 text-sky-300" />
            <span>Bimbingan Belajar Auditori & Inklusif</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-2.5 sm:mb-3">
            Belajar Mandiri Lebih Asyik dengan Panduan Suara di Sqolah
          </h1>

          <p className="text-sky-100 text-xs sm:text-sm lg:text-base mb-5 sm:mb-6 leading-relaxed">
            Pilih jenjang {currentLevel}, dengarkan penjelasan materi dengan teks bersuara, dan latih pemahamanmu dengan kuis interaktif yang ramah pembelajar auditori.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => {
                audioEngine.speak(
                  `Selamat datang di Sqolah jenjang ${currentLevel}. Kamu dapat memilih materi pelajaran atau langsung mencoba latihan soal dengan fitur pembaca suara kami.`,
                  { rate: auditory.rate }
                );
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-sky-900 hover:bg-sky-50 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 min-h-[42px]"
            >
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>Dengarkan Panduan Audio</span>
            </button>

            <button
              onClick={() => onOpenQuiz(undefined, selectedSubjectId || undefined)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-900/60 hover:bg-sky-900/80 text-white border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2 transition-colors min-h-[42px]"
            >
              <HelpCircle className="w-4 h-4 text-sky-300" />
              <span>Coba Kuis Cepat ({questions.filter(q => {
                const sub = subjects.find(s => s.id === q.subjectId);
                return sub?.level === currentLevel && (selectedKelas ? q.kelas === selectedKelas : true);
              }).length} Soal)</span>
            </button>

            {currentLevel === 'SMA' && (
              <a
                href="/Handbook_Kimia_SMA_Indeks.html"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-400/30 backdrop-blur-sm flex items-center justify-center gap-2 transition-all shadow-sm min-h-[42px]"
              >
                <BookOpen className="w-4 h-4 text-emerald-200" />
                <span>Buka Handbook Kimia (20 Bab)</span>
              </a>
            )}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20" />
      </div>

      {/* Search & Subject Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Cari materi, bab, atau konsep ${currentLevel}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedSubjectId(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedSubjectId === null
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Semua Mapel
          </button>

          {filteredSubjects.map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id === selectedSubjectId ? null : sub.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedSubjectId === sub.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Cards List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              Modul Materi Pembelajaran
            </h2>
            <p className="text-xs text-slate-700">
              Menampilkan {filteredMateri.length} materi untuk jenjang {currentLevel} {selectedKelas ? `Kelas ${selectedKelas}` : '(Semua Kelas)'}
            </p>
          </div>
        </div>

        {filteredMateri.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/90 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              Materi Pelajaran Belum Diisi
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
              Materi untuk pilihan mata pelajaran ini sedang dikosongkan sementara sesuai konfigurasi. Saat ini, <b>Handbook Kimia SMA (20 Bab Lengkap)</b> telah aktif dan siap dipelajari dengan panduan suara interaktif!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {currentLevel !== 'SMA' || selectedSubjectId !== 'sma-kimia' ? (
                <button
                  onClick={() => {
                    onSelectLevel('SMA');
                    setSelectedSubjectId('sma-kimia');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buka Materi Kimia SMA (20 Bab)</span>
                </button>
              ) : null}

              <button
                onClick={onOpenAdmin}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <span>Kelola / Tambah Materi di Admin</span>
              </button>

              {(searchQuery || selectedSubjectId) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubjectId(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredMateri.map((materi) => {
              const subj = subjects.find(s => s.id === materi.subjectId);
              const linkedQuestions = questions.filter(q => q.materiId === materi.id);

              return (
                <div
                  key={materi.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden group min-w-0"
                >
                  <div className="p-4 sm:p-6">
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 truncate max-w-[170px]">
                        {subj?.name || 'Mata Pelajaran'}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 flex-shrink-0">
                        <GraduationCap className="w-3 h-3" />
                        Kelas {materi.kelas}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onOpenMateri(materi.id)}
                      className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer mb-2 line-clamp-2 break-words"
                    >
                      {materi.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-slate-700 line-clamp-3 mb-4 leading-relaxed break-words">
                      {materi.summary}
                    </p>

                    {/* Auditory highlight preview */}
                    {materi.auditoryNotes && (
                      <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2 text-[11px] text-indigo-900 font-medium mb-4">
                        <Headphones className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2 break-words">Tips Audio: {materi.auditoryNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="px-4 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => handleQuickListenSummary(materi)}
                      className="p-2 rounded-xl text-sky-700 hover:bg-sky-100 border border-sky-200/60 transition-colors text-xs font-semibold flex items-center gap-1.5 min-h-[36px]"
                      title="Dengarkan Suara Ringkasan"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Dengar</span>
                    </button>

                    <div className="flex items-center gap-2 flex-wrap">
                      {linkedQuestions.length > 0 && (
                        <button
                          onClick={() => onOpenQuiz(materi.id)}
                          className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1 min-h-[36px]"
                          title="Latihan Soal Materi Ini"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{linkedQuestions.length} Soal</span>
                        </button>
                      )}

                      <button
                        onClick={() => onOpenMateri(materi.id)}
                        className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm flex items-center gap-1 transition-all min-h-[36px]"
                      >
                        <span>Belajar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Auditory Learning Features Card for Special Needs */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-sky-50/60 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Fitur Aksesibilitas & Inklusifitas Sqolah
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 mb-2">
            Belajar Tanpa Hambatan untuk Semua Pelajar
          </h2>
          <p className="text-xs sm:text-sm text-indigo-900/80 mb-6 leading-relaxed">
            Platform Sqolah dilengkapi dengan berbagai alat bantu untuk mempermudah siswa auditori, siswa dengan disleksia, maupun kebutuhan khusus lainnya dalam memahami materi pelajaran dan mengerjakan latihan soal.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-indigo-950">
            <div className="p-4 rounded-2xl bg-white/80 border border-indigo-100 shadow-sm">
              <Volume2 className="w-5 h-5 text-sky-600 mb-2" />
              <h3 className="font-bold text-sm mb-1 text-slate-900">Pembacaan Teks Sinkron</h3>
              <p className="text-slate-700">Setiap paragraf dibacakan dengan penanda teks otomatis yang bersinar saat disuarakan.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-indigo-100 shadow-sm">
              <Zap className="w-5 h-5 text-amber-500 mb-2" />
              <h3 className="font-bold text-sm mb-1 text-slate-900">Feedback Suara Interaktif</h3>
              <p className="text-slate-700">Suara lonceng instan untuk jawaban kuis benar dan dengungan halus saat salah tanpa perlu membaca ulang.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-indigo-100 shadow-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 mb-2" />
              <h3 className="font-bold text-sm mb-1 text-slate-900">Font & Kontras Ramah Mata</h3>
              <p className="text-slate-700">Dukungan font ramah disleksia, pembesar teks, dan mode kontras tinggi untuk kenyamanan membaca.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
