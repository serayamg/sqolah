import React, { useState } from 'react';
import { DiagnosticQuestion } from '../../types/intelligence';
import { DIAGNOSTIC_QUESTION_BANK } from '../../data/diagnosticBank';
import { audioEngine } from '../../services/audioEngine';
import { IntelligenceService } from '../../services/intelligenceService';
import { AuthService } from '../../services/authService';

interface DiagnosticPlayerProps {
  studentId: string;
  onFinished: (baselineScore: number) => void;
}

export const DiagnosticPlayer: React.FC<DiagnosticPlayerProps> = ({ studentId, onFinished }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = DIAGNOSTIC_QUESTION_BANK;
  const currentQ: DiagnosticQuestion = questions[currentIndex];

  const handleSelectOption = (optId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optId
    }));
    audioEngine.playSound('click');
  };

  const handleReadAudio = () => {
    if (isSpeaking) {
      audioEngine.stop();
      setIsSpeaking(false);
      return;
    }

    const promptToRead = currentQ.audioPrompt || currentQ.questionText;
    const optionsText = currentQ.options.map(o => `Pilihan ${o.id}: ${o.text}`).join('. ');
    const fullSpeech = `${promptToRead}. ${optionsText}`;

    setIsSpeaking(true);
    audioEngine.speak(fullSpeech, {
      rate: 1.0,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const handleNext = () => {
    audioEngine.stop();
    setIsSpeaking(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishDiagnostic();
    }
  };

  const handlePrev = () => {
    audioEngine.stop();
    setIsSpeaking(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const finishDiagnostic = () => {
    let correctCount = 0;
    const conceptScores: Record<string, { correct: boolean; question: DiagnosticQuestion }> = {};

    questions.forEach((q, idx) => {
      const isCorrect = selectedAnswers[idx] === q.correctOptionId;
      if (isCorrect) correctCount++;
      conceptScores[q.conceptId] = { correct: isCorrect, question: q };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setFinalScore(score);
    setIsCompleted(true);
    audioEngine.playSound(score >= 60 ? 'correct' : 'wrong');

    // Update Concept Masteries based on Diagnostic results
    Object.entries(conceptScores).forEach(([conceptId, data]) => {
      const qScore = data.correct ? (data.question.difficulty === 'hard' ? 90 : data.question.difficulty === 'medium' ? 75 : 65) : 35;
      const lvl = IntelligenceService.getLevelFromScore(qScore);

      IntelligenceService.saveMastery({
        id: `mas-${conceptId}-${Date.now()}`,
        studentId,
        subjectId: data.question.subjectId,
        chapterId: data.question.chapterId,
        topicId: data.question.topicId,
        conceptId,
        conceptName: data.question.conceptName,
        score: qScore,
        level: lvl.level,
        lastStudiedAt: new Date().toISOString(),
        reviewCount: 0,
        questionsAttempted: 1,
        questionsCorrect: data.correct ? 1 : 0,
        averageTimeSeconds: 45,
        masteredSkills: data.correct ? [data.question.conceptName] : [],
        needsImprovementSkills: data.correct ? [] : [data.question.conceptName],
        status: lvl.status
      });
    });

    // Track Diagnostic Learning Event
    IntelligenceService.trackEvent({
      studentId,
      eventType: 'DIAGNOSTIC_COMPLETED',
      subjectId: 'sma-kimia-10',
      metadata: {
        score,
        totalQuestions: questions.length,
        correctCount,
        durationMinutes: 15
      }
    }, 15);

    // Mark student diagnostic completed in auth profile
    const profiles = AuthService.getStudentProfiles();
    const student = profiles.find(p => p.studentId === studentId);
    if (student) {
      student.diagnosticCompleted = true;
      student.onboardingCompleted = true;
      student.currentOnboardingStep = 5;
      AuthService.saveStudentProfile(student);
    }
  };

  if (isCompleted) {
    const levelInfo = IntelligenceService.getLevelFromScore(finalScore);
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          {finalScore}%
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Asesmen Diagnostik Selesai!</h3>
        <p className="text-slate-600 mb-6">
          Titik awal kemampuan kamu berada pada level:{' '}
          <span className="font-semibold text-blue-600">{levelInfo.label}</span> ({levelInfo.status})
        </p>

        <div className="bg-slate-50 p-4 rounded-xl text-left text-sm text-slate-700 mb-6 space-y-2 border border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-500">Jumlah Soal:</span>
            <span className="font-medium">{questions.length} Soal Adaptif</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Akurasi Jawaban:</span>
            <span className="font-semibold text-emerald-600">
              {Math.round((finalScore / 100) * questions.length)} / {questions.length} Benar
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status Pembelajaran:</span>
            <span className="font-medium text-slate-800">Mastery Map Siap Dikelola</span>
          </div>
        </div>

        <button
          onClick={() => onFinished(finalScore)}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-sm"
        >
          Masuk ke Dashboard Pembelajaran
        </button>
      </div>
    );
  }

  const selectedOpt = selectedAnswers[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
          <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
            currentQ.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700' :
            currentQ.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' :
            'bg-rose-50 text-rose-700'
          }`}>
            {currentQ.difficulty === 'easy' ? 'Tingkat Dasar' : currentQ.difficulty === 'medium' ? 'Tingkat Sedang' : 'Tingkat Tantangan'}
          </span>
        </div>

        {/* Auditory Accessibility Button */}
        <button
          onClick={handleReadAudio}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
            isSpeaking
              ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
          title="Bacakan soal dan pilihan jawaban dengan audio narasi"
        >
          <span>{isSpeaking ? 'Berhenti Narasi' : 'Dengar Soal'}</span>
          <span className="text-base">{isSpeaking ? '⏹' : '🔊'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Concept Badge */}
      <div className="text-xs text-slate-500 font-medium mb-2">
        Konsep: <span className="text-slate-700 font-semibold">{currentQ.conceptName}</span>
      </div>

      {/* Question Text */}
      <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-6 leading-relaxed">
        {currentQ.questionText}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {currentQ.options.map(opt => {
          const isSelected = selectedOpt === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition flex items-start space-x-3.5 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {opt.id}
              </span>
              <span className="text-sm md:text-base leading-relaxed">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            currentIndex === 0
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ← Sebelumnya
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedOpt}
          className={`px-6 py-2.5 text-sm font-medium rounded-xl transition shadow-sm ${
            selectedOpt
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {currentIndex === questions.length - 1 ? 'Selesaikan Asesmen' : 'Selanjutnya →'}
        </button>
      </div>
    </div>
  );
};
