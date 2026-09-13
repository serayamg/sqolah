import React, { useState, useEffect } from 'react';
import { 
  EducationLevel, 
  Subject, 
  Materi, 
  Question, 
  AuditorySettings, 
  AccessibilitySettings 
} from './types';
import { User, StudentProfile } from './types/intelligence';
import { StorageService } from './services/storageService';
import { AuthService } from './services/authService';
import { IntelligenceService } from './services/intelligenceService';

import { Header } from './components/Header';
import { AudioBar } from './components/AudioBar';
import { LevelClassPicker } from './components/LevelClassPicker';
import { StudentHome } from './components/StudentHome';
import { MateriView } from './components/MateriView';
import { QuizPlayer } from './components/QuizPlayer';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { MasteryMapView } from './components/dashboard/MasteryMapView';
import { LearningHistoryView } from './components/dashboard/LearningHistoryView';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { AdminAnalyticsView } from './components/admin/AdminAnalyticsView';
import { ApiKeyModal } from './components/ai/ApiKeyModal';
import { AiCliDrawer } from './components/ai/AiCliDrawer';

export const App: React.FC = () => {
  // State: Auth & Student Intelligence
  const [currentUser, setCurrentUser] = useState<User>(() => AuthService.getCurrentUser());
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() =>
    AuthService.getStudentProfileByUserId(AuthService.getCurrentUser().id)
  );

  // State: Curriculum data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // State: Navigation & Filters
  const [currentLevel, setCurrentLevel] = useState<EducationLevel>(() => {
    const user = AuthService.getCurrentUser();
    if (user.role !== 'superadmin') {
      const profile = AuthService.getStudentProfileByUserId(user.id);
      return profile?.level || 'SMA';
    }
    return 'SMA';
  });
  const [selectedKelas, setSelectedKelas] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<string>(() => {
    const user = AuthService.getCurrentUser();
    if (user.role === 'superadmin') return 'admin';
    const profile = AuthService.getStudentProfileByUserId(user.id);
    if (profile && !profile.onboardingCompleted) return 'onboarding';
    return 'dashboard';
  });
  const [selectedMateriId, setSelectedMateriId] = useState<string | null>(null);
  const [quizFilter, setQuizFilter] = useState<{ materiId?: string; subjectId?: string } | null>(null);

  // State: Preferences
  const [auditory, setAuditory] = useState<AuditorySettings>(StorageService.getAuditorySettings());
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(StorageService.getAccessibilitySettings());

  // State: Multi-Provider AI & CLI
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAiCliOpen, setIsAiCliOpen] = useState(false);

  // State: Refresh trigger for database updates
  const [refreshTick, setRefreshTick] = useState(0);

  // Load data on mount and on database refresh
  const refreshData = () => {
    setSubjects(StorageService.getSubjects());
    setMateriList(StorageService.getMateri());
    setQuestions(StorageService.getQuestions());
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    const prof = AuthService.getStudentProfileByUserId(user.id);
    setStudentProfile(prof);
    if (user.role !== 'superadmin' && prof?.level) {
      setCurrentLevel(prof.level);
    }
  };

  useEffect(() => {
    refreshData();
    IntelligenceService.initSeedData();
  }, [refreshTick]);

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

  // Handle switching persona / user
  const handleSwitchUser = (userId: string) => {
    const newUser = AuthService.switchUser(userId);
    setCurrentUser(newUser);
    const newProfile = AuthService.getStudentProfileByUserId(newUser.id);
    setStudentProfile(newProfile);

    // If switching to a student/non-superadmin, lock level to their assigned level
    if (newUser.role !== 'superadmin') {
      setCurrentLevel(newProfile?.level || 'SMA');
    }

    if (newUser.role === 'superadmin') {
      setActiveView('admin');
    } else if (newProfile && !newProfile.onboardingCompleted) {
      setActiveView('onboarding');
    } else {
      setActiveView('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLevel = (level: EducationLevel) => {
    if (currentUser.role !== 'superadmin') {
      const allowedLevel = studentProfile?.level || 'SMA';
      if (level !== allowedLevel) {
        // User selain superadmin tidak bisa merubah jenjang SD/SMP/SMA
        return;
      }
    }
    setCurrentLevel(level);
    setSelectedKelas(null);
    if (activeView === 'materi' || activeView === 'quiz') {
      setActiveView('home');
    }
  };

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

    // Track learning event & concept exploration
    if (studentProfile) {
      const materi = materiList.find(m => m.id === materiId);
      const match = materi?.title.match(/bab\s*(\d+)/i);
      const bNum = match ? parseInt(match[1]) : 1;
      const chapterId = `chap-kim-${bNum}`;

      IntelligenceService.recordLessonReading(
        studentProfile.studentId,
        'sma-kimia-10',
        chapterId,
        `conc-${materiId}`,
        materi?.title || 'Materi Belajar',
        5
      );
      setRefreshTick(prev => prev + 1);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMateriByBab = (babNumber: number) => {
    const found = materiList.find(m => m.title.toLowerCase().includes(`bab ${babNumber}:`) || m.title.toLowerCase().includes(`bab ${babNumber} `));
    if (found) {
      handleOpenMateri(found.id);
    } else if (materiList.length > 0) {
      handleOpenMateri(materiList[0].id);
    }
  };

  const handleOpenQuiz = (materiId?: string, subjectId?: string) => {
    setQuizFilter({ materiId, subjectId });
    setActiveView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuizByBab = (babNumber: number) => {
    const foundMateri = materiList.find(m => m.title.toLowerCase().includes(`bab ${babNumber}:`) || m.title.toLowerCase().includes(`bab ${babNumber} `));
    setQuizFilter({ materiId: foundMateri?.id, subjectId: 'sma-kimia-10' });
    setActiveView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizCompleted = (scorePercent: number, correctCount: number, totalCount: number) => {
    if (studentProfile) {
      const materi = activeMateri;
      let chapterId = 'chap-kim-1';
      let conceptId = 'conc-partikel-atom';
      let conceptName = 'Struktur Atom & Notasi Nuklida';

      if (materi) {
        const match = materi.title.match(/bab\s*(\d+)/i);
        if (match) {
          const bNum = parseInt(match[1]);
          chapterId = `chap-kim-${bNum}`;
        }
        conceptId = `conc-${materi.id}`;
        conceptName = materi.title;
      }

      IntelligenceService.recordQuizPerformance(
        studentProfile.studentId,
        'sma-kimia-10',
        chapterId,
        conceptId,
        conceptName,
        scorePercent,
        correctCount,
        totalCount,
        15
      );

      // Force UI refresh so dashboard and stats update reactively
      setRefreshTick(prev => prev + 1);
    }
  };

  const handleAudioListen = () => {
    if (studentProfile && activeMateri) {
      const match = activeMateri.title.match(/bab\s*(\d+)/i);
      const bNum = match ? parseInt(match[1]) : 1;
      IntelligenceService.trackEvent({
        studentId: studentProfile.studentId,
        eventType: 'AUDIO_LISTENED',
        subjectId: 'sma-kimia-10',
        chapterId: `chap-kim-${bNum}`,
        metadata: {
          materiId: activeMateri.id,
          title: activeMateri.title,
          durationMinutes: 3
        }
      }, 3);
      setRefreshTick(prev => prev + 1);
    }
  };

  // Determine current active item for MateriView or QuizPlayer
  const activeMateri = materiList.find(m => m.id === selectedMateriId);
  const activeSubject = activeMateri ? subjects.find(s => s.id === activeMateri.subjectId) : undefined;

  // Filter questions for QuizPlayer
  const getQuestionsForQuiz = (): Question[] => {
    if (!quizFilter) {
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
      if (activeMateri) {
        return questions.filter(q => q.subjectId === activeMateri.subjectId && q.kelas === activeMateri.kelas);
      }
    }

    if (quizFilter.subjectId) {
      return questions.filter(q => q.subjectId === quizFilter.subjectId);
    }

    return questions;
  };

  const effectiveStudentProfile = studentProfile || AuthService.getStudentProfiles()[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors duration-200">
      {/* Universal Header with Navigation Pills & Persona Switcher */}
      <Header
        currentLevel={currentLevel}
        onSelectLevel={handleSelectLevel}
        isAdmin={currentUser.role === 'superadmin'}
        onToggleAdmin={() => {
          if (currentUser.role === 'superadmin') {
            handleSwitchUser('usr-student-elang');
          } else {
            handleSwitchUser('usr-admin-1');
          }
        }}
        activeView={activeView}
        onNavigateView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateHome={() => {
          setActiveView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        accessibility={accessibility}
        onUpdateAccessibility={handleUpdateAccessibility}
        auditory={auditory}
        onUpdateAuditory={handleUpdateAuditory}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenAiCli={() => setIsAiCliOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-28 sm:pb-12 overflow-x-hidden">
        
        {/* Onboarding View (First-login Experience for New Students) */}
        {activeView === 'onboarding' && (
          <OnboardingWizard
            currentProfile={effectiveStudentProfile}
            onFinishOnboarding={() => {
              const refreshed = AuthService.getStudentProfileByUserId(currentUser.id);
              setStudentProfile(refreshed);
              setActiveView('dashboard');
            }}
          />
        )}

        {/* View: Student Learning Dashboard (Areas 1 - 10) */}
        {activeView === 'dashboard' && (
          <StudentDashboard
            studentProfile={effectiveStudentProfile}
            onNavigateToMateri={handleOpenMateriByBab}
            onNavigateToQuiz={handleOpenQuizByBab}
            onNavigateToMasteryMap={() => setActiveView('mastery-map')}
            onNavigateToDiagnostic={() => setActiveView('onboarding')}
            onDataRefresh={() => setRefreshTick(p => p + 1)}
          />
        )}

        {/* View: Mastery Map Hierarchy */}
        {activeView === 'mastery-map' && (
          <MasteryMapView
            studentId={effectiveStudentProfile.studentId}
            onNavigateToMateri={handleOpenMateriByBab}
            onNavigateToQuiz={handleOpenQuizByBab}
          />
        )}

        {/* View: Learning History Timeline */}
        {activeView === 'history' && (
          <LearningHistoryView
            studentId={effectiveStudentProfile.studentId}
          />
        )}

        {/* View: Materi Catalog (Home) */}
        {activeView === 'home' && (
          <>
            <LevelClassPicker
              currentLevel={currentLevel}
              selectedKelas={selectedKelas}
              onSelectKelas={setSelectedKelas}
              auditory={auditory}
            />
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
          </>
        )}

        {/* View: Single Materi Viewer with Auditory Highlight */}
        {activeView === 'materi' && activeMateri && (
          <MateriView
            materi={activeMateri}
            subject={activeSubject}
            onBack={() => setActiveView('home')}
            onStartQuiz={(matId) => handleOpenQuiz(matId)}
            hasQuiz={questions.some(q => q.materiId === activeMateri.id || (q.subjectId === activeMateri.subjectId && q.kelas === activeMateri.kelas))}
            auditory={auditory}
            accessibility={accessibility}
            onAudioListen={() => {
              if (studentProfile && activeMateri) {
                const match = activeMateri.title.match(/bab\s*(\d+)/i);
                const bNum = match ? parseInt(match[1]) : (activeMateri.babNumber || 1);
                IntelligenceService.recordLessonReading(
                  studentProfile.studentId,
                  activeMateri.subjectId,
                  `chap-kim-${bNum}`,
                  `con-mat-${activeMateri.id}`,
                  activeMateri.title,
                  5
                );
                setRefreshTick(t => t + 1);
              }
            }}
          />
        )}

        {/* View: Interactive Quiz Player */}
        {activeView === 'quiz' && (
          <QuizPlayer
            questions={getQuestionsForQuiz()}
            subject={quizFilter?.subjectId ? subjects.find(s => s.id === quizFilter.subjectId) : activeSubject}
            materiTitle={activeMateri?.title}
            onBack={() => {
              if (selectedMateriId) {
                setActiveView('materi');
              } else {
                setActiveView('dashboard');
              }
            }}
            auditory={auditory}
            accessibility={accessibility}
            onQuizCompleted={handleQuizCompleted}
          />
        )}

        {/* View: Super Admin Analytics & Student 360 */}
        {activeView === 'admin' && (
          <AdminAnalyticsView
            onSwitchUser={handleSwitchUser}
          />
        )}
      </main>

      {/* Floating Auditory Controller */}
      <AudioBar
        auditory={auditory}
        onUpdateAuditory={handleUpdateAuditory}
      />

      {/* Multi-Provider AI API Key Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onOpenCli={() => setIsAiCliOpen(true)}
      />

      {/* In-App Interactive AI CLI Drawer */}
      <AiCliDrawer
        isOpen={isAiCliOpen}
        onClose={() => setIsAiCliOpen(false)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        studentId={effectiveStudentProfile.studentId}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 pb-24 sm:pb-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            © 2026 Sqolah — Student Learning Profile & Mastery Intelligence Platform
          </p>
          <p className="text-slate-500">
            Didukung Fitur Belajar Auditori Web Speech & Web Audio Synthesizer
          </p>
        </div>
      </footer>
    </div>
  );
};
