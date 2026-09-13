import React, { useState, useEffect } from 'react';
import { 
  Materi, 
  Subject, 
  AuditorySettings, 
  AccessibilitySettings 
} from '../types';
import { audioEngine } from '../services/audioEngine';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  HelpCircle, 
  BookOpen, 
  GraduationCap, 
  RotateCcw,
  Headphones,
  ExternalLink,
  FileText
} from 'lucide-react';

interface MateriViewProps {
  materi: Materi;
  subject?: Subject;
  onBack: () => void;
  onStartQuiz: (materiId: string) => void;
  hasQuiz: boolean;
  auditory: AuditorySettings;
  accessibility: AccessibilitySettings;
}

export const MateriView: React.FC<MateriViewProps> = ({
  materi,
  subject,
  onBack,
  onStartQuiz,
  hasQuiz,
  auditory,
  accessibility
}) => {
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [isReadingAll, setIsReadingAll] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'auditory' | 'handbook'>('auditory');

  useEffect(() => {
    return audioEngine.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
      if (!state.isSpeaking && !state.isPaused) {
        // If not playing, clear active paragraph if reading single paragraph
        if (!isReadingAll) {
          setActiveParagraphIndex(null);
        }
      }
    });
  }, [isReadingAll]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  // Read entire article step-by-step
  const handleReadFullMateri = () => {
    if (isSpeaking) {
      audioEngine.stop();
      setIsReadingAll(false);
      setActiveParagraphIndex(null);
      return;
    }

    setIsReadingAll(true);
    audioEngine.playSound('click');

    // Sequence of speech segments
    const segments: { text: string; index: number | null }[] = [
      { text: `Materi Pelajaran: ${materi.title}. Kelas ${materi.kelas}.`, index: -1 },
      { text: `Ringkasan: ${materi.summary}`, index: -2 },
      ...materi.contentParagraphs.map((p, idx) => ({ text: p, index: idx })),
      { text: `Poin-poin penting materi ini: ${materi.keyPoints.join('. ')}`, index: -3 },
    ];

    if (materi.auditoryNotes) {
      segments.push({ text: `Catatan khusus pendengaran: ${materi.auditoryNotes}`, index: -4 });
    }

    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex >= segments.length) {
        setIsReadingAll(false);
        setActiveParagraphIndex(null);
        audioEngine.playSound('notification');
        return;
      }

      const item = segments[currentIndex];
      setActiveParagraphIndex(item.index);

      audioEngine.speak(item.text, {
        rate: auditory.rate,
        onEnd: () => {
          currentIndex++;
          // Tiny delay between paragraphs for breathing room
          setTimeout(playNext, 400);
        },
        onError: () => {
          setIsReadingAll(false);
          setActiveParagraphIndex(null);
        }
      });
    };

    playNext();
  };

  const handleReadSingleParagraph = (paragraph: string, index: number) => {
    setIsReadingAll(false);
    setActiveParagraphIndex(index);
    audioEngine.speak(paragraph, {
      rate: auditory.rate,
      onEnd: () => {
        setActiveParagraphIndex(null);
      }
    });
  };

  const handleReadPoinKunci = () => {
    setIsReadingAll(false);
    setActiveParagraphIndex(-3);
    const text = `Poin-poin penting materi: ${materi.keyPoints.join('. ')}`;
    audioEngine.speak(text, {
      rate: auditory.rate,
      onEnd: () => {
        setActiveParagraphIndex(null);
      }
    });
  };

  // Font size classes based on accessibility setting
  const getFontSizeClass = () => {
    if (accessibility.fontSize === 'large') return 'text-lg leading-relaxed';
    if (accessibility.fontSize === 'extra-large') return 'text-xl leading-loose';
    return 'text-base leading-normal';
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => {
            audioEngine.stop();
            onBack();
          }}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold shadow-sm transition-all min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Materi</span>
        </button>

        {hasQuiz && (
          <button
            onClick={() => {
              audioEngine.stop();
              onStartQuiz(materi.id);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all min-h-[44px]"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Latihan Soal Bab Ini</span>
          </button>
        )}
      </div>

      {/* Main Material Card */}
      <article className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm relative overflow-hidden">
        
        {/* Subject and Level Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {subject && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {subject.name}
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            Kelas {materi.kelas}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            ± {materi.estimatedMinutes} Menit
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">
          {materi.title}
        </h1>

        {/* Mode Selector Tab (Auditory vs Original Handbook) */}
        {materi.handbookFile && (
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 mb-5 sm:mb-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setDisplayMode('auditory');
              }}
              className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap min-h-[44px] ${
                displayMode === 'auditory'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Belajar Auditori & Ringkasan</span>
            </button>

            <button
              onClick={() => {
                audioEngine.stop();
                setDisplayMode('handbook');
              }}
              className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap min-h-[44px] ${
                displayMode === 'handbook'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Buku Handbook Lengkap</span>
            </button>

            <a
              href={`/${materi.handbookFile}`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap min-h-[38px]"
              title="Buka handbook di tab baru"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Tab Baru</span>
            </a>
          </div>
        )}

        {displayMode === 'handbook' && materi.handbookFile ? (
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-emerald-900">
              <span className="font-semibold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Berkas handbook: <b>{materi.handbookFile}</b></span>
              </span>
              <a
                href={`/${materi.handbookFile}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline font-bold text-[11px] self-end sm:self-auto"
              >
                Buka Layar Penuh &rarr;
              </a>
            </div>

            <div className="w-full h-[520px] sm:h-[750px] rounded-xl sm:rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
              <iframe
                src={`/${materi.handbookFile}`}
                title={materi.title}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        ) : (
          <>
        {/* Summary Card with Audio Highlight */}
        <div className={`p-4 sm:p-5 rounded-2xl bg-sky-50/80 border border-sky-200/80 mb-6 transition-all ${
          activeParagraphIndex === -2 ? 'ring-2 ring-sky-500 bg-sky-100/90' : ''
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Ringkasan Materi
            </span>
            <button
              onClick={() => {
                setIsReadingAll(false);
                setActiveParagraphIndex(-2);
                audioEngine.speak(materi.summary, {
                  rate: auditory.rate,
                  onEnd: () => setActiveParagraphIndex(null)
                });
              }}
              className="p-1.5 rounded-lg text-sky-700 hover:bg-sky-200/60 transition-colors"
              title="Dengarkan Ringkasan"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            {materi.summary}
          </p>
        </div>

        {/* Big Auditory Learning Action Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shadow-md shadow-sky-600/15">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Fitur Belajar Auditori Aktif
              </h2>
              <p className="text-xs text-sky-100">
                Dengarkan seluruh materi dibacakan secara berurutan dengan teks yang disorot otomatis
              </p>
            </div>
          </div>

          <button
            onClick={handleReadFullMateri}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              isSpeaking && isReadingAll
                ? 'bg-rose-500 hover:bg-rose-600 text-white ring-2 ring-rose-300'
                : 'bg-white hover:bg-sky-50 text-sky-900'
            }`}
          >
            {isSpeaking && isReadingAll ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Hentikan Suara</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-sky-600" />
                <span>Dengarkan Seluruh Materi</span>
              </>
            )}
          </button>
        </div>

        {/* Content Paragraphs with individual and synced highlight */}
        <div className="space-y-6 mb-8">
          {materi.contentParagraphs.map((para, idx) => {
            const isCurrent = activeParagraphIndex === idx;
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative group ${
                  isCurrent
                    ? 'reading-highlight border-sky-400 bg-sky-50/70 shadow-sm'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-slate-800 font-normal leading-relaxed flex-1 ${getFontSizeClass()}`}>
                    {para}
                  </p>
                  <button
                    onClick={() => handleReadSingleParagraph(para, idx)}
                    className={`p-2 rounded-xl border flex-shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm animate-pulse'
                        : 'bg-slate-50 text-slate-500 hover:text-sky-600 hover:bg-sky-50 border-slate-200 opacity-80 group-hover:opacity-100'
                    }`}
                    title="Bacakan paragraf ini"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Poin-Poin Kunci (Key Takeaways) */}
        {materi.keyPoints && materi.keyPoints.length > 0 && (
          <div className={`p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-6 transition-all ${
            activeParagraphIndex === -3 ? 'ring-2 ring-amber-400 bg-amber-100/90' : ''
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-amber-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-amber-600" />
                Poin-Poin Penting untuk Diingat
              </h2>
              <button
                onClick={handleReadPoinKunci}
                className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-200/60 transition-colors"
                title="Dengarkan Poin Penting"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-2.5">
              {materi.keyPoints.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-amber-950 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Catatan Khusus Auditori & Inklusif */}
        {materi.auditoryNotes && (
          <div className={`p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 mb-8 transition-all ${
            activeParagraphIndex === -4 ? 'ring-2 ring-indigo-400 bg-indigo-100/90' : ''
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-indigo-600" />
                Tips Auditori & Mnemonic Suara
              </h2>
              <button
                onClick={() => {
                  setIsReadingAll(false);
                  setActiveParagraphIndex(-4);
                  audioEngine.speak(materi.auditoryNotes || '', {
                    rate: auditory.rate,
                    onEnd: () => setActiveParagraphIndex(null)
                  });
                }}
                className="p-1.5 rounded-lg text-indigo-700 hover:bg-indigo-200/60 transition-colors"
                title="Dengarkan Tips Auditori"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
              {materi.auditoryNotes}
            </p>
          </div>
        )}
        </>
        )}

        {/* Bottom CTA: Mulai Latihan Soal */}
        {hasQuiz ? (
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Sudah selesai membaca & mendengarkan?
              </h2>
              <p className="text-xs text-slate-700">
                Uji pemahamanmu sekarang dengan kuis latihan soal interaktif!
              </p>
            </div>
            <button
              onClick={() => {
                audioEngine.stop();
                onStartQuiz(materi.id);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Mulai Latihan Soal Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-700">
            Belum ada latihan soal khusus untuk materi ini. Anda dapat menambahkan soal melalui Panel Admin.
          </div>
        )}

      </article>
    </div>
  );
};
