import React, { useState, useEffect } from 'react';
import { 
  EducationLevel, 
  Subject, 
  Materi, 
  Question, 
  AuditorySettings, 
  AccessibilitySettings 
} from './types';
import { StorageService } from './services/storageService';
import { Header } from './components/Header';
import { AudioBar } from './components/AudioBar';
import { LevelClassPicker } from './components/LevelClassPicker';
import { StudentHome } from './components/StudentHome';
import { MateriView } from './components/MateriView';
import { QuizPlayer } from './components/QuizPlayer';
import { AdminPanel } from './components/AdminPanel';

export const App: React.FC = () => {
  // State: Curriculum data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // State: Navigation & Filters
  const [currentLevel, setCurrentLevel] = useState<EducationLevel>('SMA');
  const [selectedKelas, setSelectedKelas] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'materi' | 'quiz' | 'admin'>('home');
  const [selectedMateriId, setSelectedMateriId] = useState<string | null>(null);
  const [quizFilter, setQuizFilter] = useState<{ materiId?: string; subjectId?: string } | null>(null);

  // State: Preferences
  const [auditory, setAuditory] = useState<AuditorySettings>(StorageService.getAuditorySettings());
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(StorageService.getAccessibilitySettings());

  // Load data on mount
  const refreshData = () => {
    setSubjects(StorageService.getSubjects());
    setMateriList(StorageService.getMateri());
    setQuestions(StorageService.getQuestions());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Reset kelas filter when changing level if selected kelas doesn't belong
  const handleSelectLevel = (level: EducationLevel) => {
    setCurrentLevel(level);
    setSelectedKelas(null);
    if (activeView === 'materi' || activeView === 'quiz') {
      setActiveView('home');
    }
  };

  // Sync accessibility classes with document body
  useEffect(() => {
    if (accessibility.dyslexicFont) {
      document.body.classList.add('dyslexic-mode');
    } else {
      document.body.classList.remove('dyslexic-mode');
    }

    if (accessibility.highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [accessibility]);

  const handleUpdateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...accessibility, ...newSettings };
    setAccessibility(updated);
    StorageService.saveAccessibilitySettings(updated);
  };

  const handleUpdateAuditory = (newSettings: Partial<AuditorySettings>) => {
    const updated = { ...auditory, ...newSettings };
    setAuditory(updated);
    StorageService.saveAuditorySettings(updated);
  };

  // Navigation handlers
  const handleOpenMateri = (materiId: string) => {
    setSelectedMateriId(materiId);
    setActiveView('materi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuiz = (materiId?: string, subjectId?: string) => {
    setQuizFilter({ materiId, subjectId });
    setActiveView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAdmin = () => {
    if (activeView === 'admin') {
      setActiveView('home');
    } else {
      setActiveView('admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine current active item for MateriView or QuizPlayer
  const activeMateri = materiList.find(m => m.id === selectedMateriId);
  const activeSubject = activeMateri ? subjects.find(s => s.id === activeMateri.subjectId) : undefined;

  // Filter questions for QuizPlayer
  const getQuestionsForQuiz = (): Question[] => {
    if (!quizFilter) {
      // General quiz for current level
      return questions.filter(q => {
        const sub = subjects.find(s => s.id === q.subjectId);
        if (sub?.level !== currentLevel) return false;
        if (selectedKelas !== null && q.kelas !== selectedKelas) return false;
        return true;
      });
    }

    if (quizFilter.materiId) {
      const linked = questions.filter(q => q.materiId === quizFilter.materiId);
      if (linked.length > 0) return linked;
      // Fallback to same subject and kelas if no direct link
      if (activeMateri) {
        return questions.filter(q => q.subjectId === activeMateri.subjectId && q.kelas === activeMateri.kelas);
      }
    }

    if (quizFilter.subjectId) {
      return questions.filter(q => q.subjectId === quizFilter.subjectId);
    }

    return questions.filter(q => {
      const sub = subjects.find(s => s.id === q.subjectId);
      return sub?.level === currentLevel;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors duration-200">
      {/* Header */}
      <Header
        currentLevel={currentLevel}
        onSelectLevel={handleSelectLevel}
        isAdmin={activeView === 'admin'}
        onToggleAdmin={handleToggleAdmin}
        activeView={activeView}
        onNavigateHome={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        accessibility={accessibility}
        onUpdateAccessibility={handleUpdateAccessibility}
        auditory={auditory}
        onUpdateAuditory={handleUpdateAuditory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* If in Student Mode, show Level & Class Picker */}
        {activeView !== 'admin' && (
          <LevelClassPicker
            currentLevel={currentLevel}
            selectedKelas={selectedKelas}
            onSelectKelas={setSelectedKelas}
            auditory={auditory}
          />
        )}

        {/* View 1: Student Catalog & Home */}
        {activeView === 'home' && (
          <StudentHome
            currentLevel={currentLevel}
            selectedKelas={selectedKelas}
            subjects={subjects}
            materiList={materiList}
            questions={questions}
            onOpenMateri={handleOpenMateri}
            onOpenQuiz={handleOpenQuiz}
            onSelectLevel={handleSelectLevel}
            onOpenAdmin={() => setActiveView('admin')}
            auditory={auditory}
          />
        )}

        {/* View 2: Materi Detail with Auditory Highlight */}
        {activeView === 'materi' && activeMateri && (
          <MateriView
            materi={activeMateri}
            subject={activeSubject}
            onBack={() => setActiveView('home')}
            onStartQuiz={(matId) => handleOpenQuiz(matId)}
            hasQuiz={questions.some(q => q.materiId === activeMateri.id || (q.subjectId === activeMateri.subjectId && q.kelas === activeMateri.kelas))}
            auditory={auditory}
            accessibility={accessibility}
          />
        )}

        {/* View 3: Inclusive Quiz Player */}
        {activeView === 'quiz' && (
          <QuizPlayer
            questions={getQuestionsForQuiz()}
            subject={quizFilter?.subjectId ? subjects.find(s => s.id === quizFilter.subjectId) : activeSubject}
            materiTitle={activeMateri?.title}
            onBack={() => {
              if (selectedMateriId) {
                setActiveView('materi');
              } else {
                setActiveView('home');
              }
            }}
            auditory={auditory}
            accessibility={accessibility}
          />
        )}

        {/* View 4: Admin Panel */}
        {activeView === 'admin' && (
          <AdminPanel
            subjects={subjects}
            materiList={materiList}
            questions={questions}
            onDataChanged={refreshData}
            onExitAdmin={() => setActiveView('home')}
          />
        )}
      </main>

      {/* Floating Auditory Controller */}
      <AudioBar
        auditory={auditory}
        onUpdateAuditory={handleUpdateAuditory}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            © 2026 Sqolah — Platform Bimbingan Belajar Inklusif SD, SMP, SMA
          </p>
          <p className="text-slate-700">
            Didukung Fitur Belajar Auditori Web Speech & Web Audio Synthesizer
          </p>
        </div>
      </footer>
    </div>
  );
};
