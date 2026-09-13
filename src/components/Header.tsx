import React, { useState } from 'react';
import { 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  Sliders, 
  ShieldCheck, 
  UserCheck, 
  Sun, 
  Moon, 
  Type, 
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Compass,
  History,
  Users
} from 'lucide-react';
import { EducationLevel, AccessibilitySettings, AuditorySettings } from '../types';
import { User } from '../types/intelligence';
import { audioEngine } from '../services/audioEngine';
import { AuthService } from '../services/authService';

interface HeaderProps {
  currentLevel: EducationLevel;
  onSelectLevel: (lvl: EducationLevel) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  activeView: string;
  onNavigateView: (view: string) => void;
  onNavigateHome: () => void;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  auditory: AuditorySettings;
  onUpdateAuditory: (settings: Partial<AuditorySettings>) => void;
  currentUser?: User;
  onSwitchUser?: (userId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  onSelectLevel,
  isAdmin,
  onToggleAdmin,
  activeView,
  onNavigateView,
  onNavigateHome,
  accessibility,
  onUpdateAccessibility,
  auditory,
  onUpdateAuditory,
  currentUser,
  onSwitchUser
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const allUsers = AuthService.getUsers();

  React.useEffect(() => {
    return audioEngine.subscribe(state => {
      setIsSpeaking(state.isSpeaking);
    });
  }, []);

  const handleStopAudio = () => {
    audioEngine.stop();
  };

  const handleLevelChange = (lvl: EducationLevel) => {
    audioEngine.playSound('click');
    onSelectLevel(lvl);
    if (auditory.soundEffects) {
      audioEngine.speak(`Pindah ke jenjang ${lvl}`, { rate: 1.1 });
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Belajar', icon: LayoutDashboard },
    { id: 'home', label: 'Materi Kimia SMA', icon: BookOpen },
    { id: 'mastery-map', label: 'Mastery Map', icon: Compass },
    { id: 'history', label: 'Riwayat', icon: History }
  ];

  if (currentUser?.role === 'superadmin' || currentUser?.role === 'admin' || isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Analytics', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Row 1: Brand, Level Picker, Accessibility & Persona Switcher */}
        <div className="flex items-center justify-between h-16 sm:h-18 py-2 gap-1.5 sm:gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigateView('dashboard')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0"
            title="Ke Dashboard Belajar Sqolah"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 bg-gradient-to-r from-sky-600 to-indigo-700 bg-clip-text text-transparent">
                  Sqolah
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  <Volume2 className="w-3 h-3 text-sky-600" />
                  Inklusif & Auditori
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden lg:block font-medium">
                Student Learning Intelligence & Bimbel Inklusif
              </p>
            </div>
          </div>

          {/* Level Switcher (SD, SMP, SMA) */}
          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 flex-shrink-0">
            {(['SD', 'SMP', 'SMA'] as EducationLevel[]).map((lvl) => {
              const isActive = currentLevel === lvl;
              let activeBadge = 'bg-white text-sky-700 shadow-sm font-bold';
              if (lvl === 'SD') activeBadge = isActive ? 'bg-red-500 text-white shadow-sm font-bold' : '';
              if (lvl === 'SMP') activeBadge = isActive ? 'bg-blue-600 text-white shadow-sm font-bold' : '';
              if (lvl === 'SMA') activeBadge = isActive ? 'bg-indigo-600 text-white shadow-sm font-bold' : '';

              return (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all min-h-[36px] flex items-center justify-center ${
                    isActive
                      ? activeBadge
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className="hidden sm:inline">Jenjang </span>
                  <span>{lvl}</span>
                </button>
              );
            })}
          </div>

          {/* User Persona Switcher & Tool Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Persona Switcher Dropdown */}
            {onSwitchUser && (
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                <span className="text-xs text-slate-500 px-1.5 hidden md:inline font-medium">Akun:</span>
                <select
                  value={currentUser?.id || 'usr-student-elang'}
                  onChange={e => onSwitchUser(e.target.value)}
                  className="bg-white text-slate-800 font-semibold text-xs py-1.5 px-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
                  title="Ganti akun untuk simulasi persona"
                >
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.role === 'superadmin' ? `🛡️ ${u.fullName}` : `👤 ${u.fullName}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick Stop Audio if playing */}
            {isSpeaking && (
              <button
                onClick={handleStopAudio}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-semibold animate-pulse min-h-[36px]"
                title="Hentikan Pembacaan Suara"
              >
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Stop</span>
              </button>
            )}

            {/* Accessibility & Audio Preferences Button */}
            <button
              onClick={() => setShowSettingsModal(!showSettingsModal)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs sm:text-sm font-medium transition-colors min-h-[36px]"
              title="Pengaturan Aksesibilitas & Auditori"
            >
              <Sliders className="w-4 h-4 text-sky-600" />
              <span className="hidden md:inline">Akses</span>
            </button>
          </div>

        </div>

        {/* Row 2: Navigation Bar (Pills) */}
        <div className="flex items-center space-x-1 sm:space-x-2 py-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateView(item.id)}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessibility & Audio Floating Modal */}
      {showSettingsModal && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-45"
            onClick={() => setShowSettingsModal(false)} 
          />
          <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-4 top-20 max-w-md sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 z-50 animate-in fade-in zoom-in duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                Aksesibilitas & Suara
              </h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {/* TTS Speed */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                    Kecepatan Pembaca Suara:
                  </span>
                  <span className="text-xs font-bold text-sky-600">{auditory.rate}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.1"
                  value={auditory.rate}
                  onChange={(e) => onUpdateAuditory({ rate: parseFloat(e.target.value) })}
                  className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sound Effects Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700">Efek Suara Jawaban & Bimbingan:</span>
                <button
                  onClick={() => {
                    const val = !auditory.soundEffects;
                    onUpdateAuditory({ soundEffects: val });
                    if (val) audioEngine.playSound('correct');
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    auditory.soundEffects ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    auditory.soundEffects ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Dyslexic font */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700">Font Khusus Disleksia:</span>
                <button
                  onClick={() => onUpdateAccessibility({ dyslexicFont: !accessibility.dyslexicFont })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    accessibility.dyslexicFont ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    accessibility.dyslexicFont ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700">Kontras Tinggi (High Contrast):</span>
                <button
                  onClick={() => onUpdateAccessibility({ highContrast: !accessibility.highContrast })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    accessibility.highContrast ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    accessibility.highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
