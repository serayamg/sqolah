import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Question, 
  AuditorySettings, 
  AccessibilitySettings,
  Subject 
} from '../types';
import { audioEngine } from '../services/audioEngine';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle,
  Keyboard,
  Check,
  Headphones
} from 'lucide-react';

interface QuizPlayerProps {
  questions: Question[];
  subject?: Subject;
  materiTitle?: string;
  onBack: () => void;
  auditory: AuditorySettings;
  accessibility: AccessibilitySettings;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  questions,
  subject,
  materiTitle,
  onBack,
  auditory,
  accessibility
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [readingOptionId, setReadingOptionId] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    return audioEngine.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
      if (!state.isSpeaking && !state.isPaused) {
        setReadingOptionId(null);
      }
    });
  }, []);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  // When question changes, optionally auto-read if enabled or prompt
  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setReadingOptionId(null);

    if (currentQuestion && auditory.autoReadNext && !isCompleted) {
      handleReadQuestionAndOptions();
    }
  }, [currentIndex, isCompleted]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (!isAnswered && currentQuestion) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') {
          handleSelectOption(currentQuestion.options[0]?.id);
        } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
          handleSelectOption(currentQuestion.options[1]?.id);
        } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
          handleSelectOption(currentQuestion.options[2]?.id);
        } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
          handleSelectOption(currentQuestion.options[3]?.id);
        }
      }

      if (e.key === ' ' && !isCompleted) {
        e.preventDefault();
        if (isSpeaking) {
          audioEngine.stop();
        } else {
          handleReadQuestionAndOptions();
        }
      } else if (e.key.toLowerCase() === 'r' && !isCompleted) {
        e.preventDefault();
        handleReadQuestionAndOptions();
      } else if (e.key === 'Enter' && isAnswered && !isCompleted) {
        e.preventDefault();
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, isAnswered, isCompleted, isSpeaking]);

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Soal Tersedia</h2>
        <p className="text-slate-600 mb-6">
          Belum ada latihan soal yang ditambahkan untuk materi atau kelas ini. Silakan tambahkan soal melalui Panel Admin.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800"
        >
          Kembali
        </button>
      </div>
    );
  }

  // Audio: Read question + options in sequence
  const handleReadQuestionAndOptions = () => {
    if (!currentQuestion) return;
    audioEngine.stop();

    const texts: { text: string; optId: string | null }[] = [
      { text: `Soal nomor ${currentIndex + 1} dari ${questions.length}. ${currentQuestion.questionText}`, optId: 'question' },
    ];

    currentQuestion.options.forEach((opt, idx) => {
      const letter = String.fromCharCode(65 + idx); // A, B, C, D
      texts.push({ text: `Pilihan ${letter}: ${opt.text}`, optId: opt.id });
    });

    let idx = 0;
    const speakNext = () => {
      if (idx >= texts.length) {
        setReadingOptionId(null);
        return;
      }
      const item = texts[idx];
      setReadingOptionId(item.optId);

      audioEngine.speak(item.text, {
        rate: auditory.rate,
        onEnd: () => {
          idx++;
          setTimeout(speakNext, 350);
        },
        onError: () => {
          setReadingOptionId(null);
        }
      });
    };

    speakNext();
  };

  const handleReadSingleOption = (optText: string, letter: string, optId: string) => {
    setReadingOptionId(optId);
    audioEngine.speak(`Pilihan ${letter}: ${optText}`, {
      rate: auditory.rate,
      onEnd: () => setReadingOptionId(null)
    });
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswered || !currentQuestion) return;

    audioEngine.stop();
    setSelectedOptionId(optId);
    setIsAnswered(true);

    const isCorrect = optId === currentQuestion.correctOptionId;

    if (isCorrect) {
      setScore(prev => prev + 1);
      if (auditory.soundEffects) {
        audioEngine.playSound('correct');
      }
      audioEngine.speak('Jawaban kamu benar!', {
        rate: auditory.rate,
        onEnd: () => {
          // Read explanation
          audioEngine.speak(`Penjelasan: ${currentQuestion.explanation}`, { rate: auditory.rate });
        }
      });
    } else {
      if (auditory.soundEffects) {
        audioEngine.playSound('wrong');
      }
      const correctIdx = currentQuestion.options.findIndex(o => o.id === currentQuestion.correctOptionId);
      const correctLetter = String.fromCharCode(65 + correctIdx);
      audioEngine.speak(`Jawaban kamu belum tepat. Jawaban yang benar adalah pilihan ${correctLetter}. ${currentQuestion.explanation}`, {
        rate: auditory.rate
      });
    }
  };

  const handleNextQuestion = () => {
    audioEngine.stop();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Quiz Finished!
      setIsCompleted(true);
      if (auditory.soundEffects) {
        audioEngine.playSound('fanfare');
      }
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      const finalScore = score + (selectedOptionId === currentQuestion.correctOptionId ? 0 : 0);
      audioEngine.speak(
        `Selamat! Kamu telah menyelesaikan seluruh soal latihan. Nilai kamu adalah ${Math.round((score / questions.length) * 100)} dari total ${questions.length} soal. Kerja yang sangat bagus!`,
        { rate: auditory.rate }
      );
    }
  };

  const handleRestart = () => {
    audioEngine.stop();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  // Completion View
  if (isCompleted) {
    const finalPercentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30 animate-bounce">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            Latihan Soal Selesai!
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-6">
            Hebat sekali! Kamu telah menyelesaikan evaluasi pembelajaran dengan baik.
          </p>

          {/* Score Box */}
          <div className="inline-block p-6 rounded-3xl bg-slate-50 border border-slate-200 mb-8 min-w-[240px]">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500 block mb-1">
              Nilai Akhir
            </span>
            <span className="text-5xl sm:text-6xl font-black text-sky-600 tracking-tight">
              {finalPercentage}
            </span>
            <span className="text-xs text-slate-500 block mt-2 font-medium">
              Menjawab benar {score} dari {questions.length} soal
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Latihan</span>
            </button>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Materi</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            audioEngine.stop();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <span>Soal {currentIndex + 1} / {questions.length}</span>
          <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-sky-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm">
        
        {/* Top Header Tools: Auditory Read Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3.5 sm:pb-4 mb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {subject?.name || 'Latihan Soal'} — Kelas {currentQuestion.kelas}
            </span>
            {materiTitle && (
              <h2 className="text-xs text-slate-700 truncate max-w-md font-medium">
                Materi: {materiTitle}
              </h2>
            )}
          </div>

          {/* Read Aloud Button */}
          <button
            onClick={handleReadQuestionAndOptions}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm min-h-[40px] ${
              isSpeaking
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
            }`}
            title="Bacakan soal beserta seluruh pilihan jawaban (Spasi)"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? 'Hentikan Suara' : 'Bacakan Soal Ini'}</span>
          </button>
        </div>

        {/* Question Text */}
        <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 transition-colors ${
          readingOptionId === 'question' ? 'bg-sky-50 ring-2 ring-sky-400' : 'bg-slate-50/70'
        }`}>
          <div className="flex items-start justify-between gap-2.5 sm:gap-3">
            <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-snug flex-1">
              {currentQuestion.questionText}
            </h3>
            <button
              onClick={() => {
                setReadingOptionId('question');
                audioEngine.speak(currentQuestion.questionText, {
                  rate: auditory.rate,
                  onEnd: () => setReadingOptionId(null)
                });
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-100/50 transition-colors"
              title="Dengarkan pertanyaan saja"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.id === currentQuestion.correctOptionId;
            const isCurrentlyRead = readingOptionId === option.id;

            let optionStyle = 'border-slate-200 hover:border-sky-400 hover:bg-sky-50/40';
            let badgeStyle = 'bg-slate-100 text-slate-700 group-hover:bg-sky-500 group-hover:text-white';

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/30';
                badgeStyle = 'bg-emerald-600 text-white';
              } else if (isSelected) {
                optionStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-2 ring-rose-400/30';
                badgeStyle = 'bg-rose-500 text-white';
              } else {
                optionStyle = 'border-slate-200 opacity-60 bg-slate-50';
              }
            } else if (isCurrentlyRead) {
              optionStyle = 'border-sky-500 bg-sky-100/70 ring-2 ring-sky-400';
              badgeStyle = 'bg-sky-600 text-white';
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer group ${optionStyle}`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0 transition-colors ${badgeStyle}`}>
                    {letter}
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-800 flex-1">
                    {option.text}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Status icon when answered */}
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  )}

                  {/* Individual option speak button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadSingleOption(option.text, letter, option.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                    title={`Dengarkan pilihan ${letter}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation Box after answering */}
        {isAnswered && (
          <div className={`p-5 rounded-2xl border mb-6 animate-in fade-in slide-in-from-top-2 duration-200 ${
            selectedOptionId === currentQuestion.correctOptionId
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`text-sm font-bold flex items-center gap-1.5 ${
                selectedOptionId === currentQuestion.correctOptionId ? 'text-emerald-900' : 'text-amber-900'
              }`}>
                <Check className="w-4 h-4" />
                Pembahasan Jawaban:
              </h4>
              <button
                onClick={() => {
                  audioEngine.speak(`Penjelasan: ${currentQuestion.explanation}`, {
                    rate: auditory.rate
                  });
                }}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/50"
                title="Dengarkan Pembahasan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Bottom Actions: Next Question */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-700">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Tekan 1-4 atau A-D untuk menjawab, Spasi untuk dengarkan soal</span>
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isAnswered
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/25'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{currentIndex + 1 < questions.length ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil Latihan'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
