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
  Users,
  Lock
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

  const isSuperAdmin = currentUser?.role === 'superadmin';

  const handleLevelChange = (lvl: EducationLevel) => {
    if (!isSuperAdmin) {
      audioEngine.playSound('wrong');
      if (auditory.soundEffects) {
        audioEngine.speak('Perubahan jenjang hanya dapat dilakukan oleh Super Admin', { rate: 1.1 });
      }
      return;
    }
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
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Row 1: Brand, Level Picker, Accessibility & Persona Switcher */}
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 py-1.5 sm:py-2 gap-2 sm:gap-4">
            
            {/* Logo & Brand */}
            <div 
              onClick={() => onNavigateView('dashboard')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0 flex-shrink-0"
              title="Ke Dashboard Belajar Sqolah"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 bg-gradient-to-r from-sky-600 to-indigo-700 bg-clip-text text-transparent">
                    Sqolah
                  </span>
                  <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    <Volume2 className="w-3 h-3 text-sky-600" />
                    Inklusif & Auditori
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden xl:block font-medium">
                  Student Learning Intelligence & Bimbel Inklusif
                </p>
              </div>
            </div>

            {/* Level Switcher (SD, SMP, SMA) */}
            <div 
              className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 flex-shrink-0"
              title={isSuperAdmin ? "Pilih jenjang pendidikan (Mode Super Admin)" : "Jenjang dikunci ke SMA sesuai penugasan siswa (Hanya Super Admin yang dapat mengubah)"}
            >
              {(['SD', 'SMP', 'SMA'] as EducationLevel[]).map((lvl) => {
                const isActive = currentLevel === lvl;
                let activeBadge = 'bg-white text-sky-700 shadow-sm font-bold';
                if (lvl === 'SD') activeBadge = isActive ? 'bg-red-500 text-white shadow-sm font-bold' : '';
                if (lvl === 'SMP') activeBadge = isActive ? 'bg-blue-600 text-white shadow-sm font-bold' : '';
                if (lvl === 'SMA') activeBadge = isActive ? 'bg-indigo-600 text-white shadow-sm font-bold' : '';

                const isLocked = !isSuperAdmin && lvl !== currentLevel;

                return (
                  <button
                    key={lvl}
                    disabled={isLocked}
                    onClick={() => handleLevelChange(lvl)}
                    className={`px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all min-h-[30px] sm:min-h-[36px] flex items-center justify-center gap-1 ${
                      isLocked
                        ? 'text-slate-400 opacity-50 cursor-not-allowed'
                        : isActive
                        ? activeBadge
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                    title={
                      isLocked
                        ? `Jenjang ${lvl} terkunci. Hanya Super Admin yang dapat mengubah jenjang pendidikan.`
                        : !isSuperAdmin
                        ? `Jenjang ${lvl} (Terkunci untuk akun siswa)`
                        : `Ganti jenjang ke ${lvl}`
                    }
                  >
                    {isLocked && <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 flex-shrink-0" />}
                    {!isSuperAdmin && isActive && <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-200 flex-shrink-0" />}
                    <span className="hidden lg:inline">Jenjang </span>
                    <span>{lvl}</span>
                  </button>
                );
              })}
            </div>

            {/* User Persona Switcher (Desktop/Tablet) & Tool Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Persona Switcher Dropdown (Tablet/Desktop only) */}
              {onSwitchUser && (
                <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-0.5 sm:p-1 border border-slate-200">
                  <span className="text-xs text-slate-500 px-1.5 font-medium">Akun:</span>
                  <select
                    value={currentUser?.id || 'usr-student-elang'}
                    onChange={e => onSwitchUser(e.target.value)}
                    className="bg-white text-slate-800 font-semibold text-xs py-1 sm:py-1.5 px-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer max-w-[140px] md:max-w-[180px] truncate min-h-[34px]"
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
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-[11px] sm:text-xs font-semibold animate-pulse min-h-[30px] sm:min-h-[36px]"
                  title="Hentikan Pembacaan Suara"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Stop</span>
                </button>
              )}

              {/* Accessibility & Audio Preferences Button */}
              <button
                onClick={() => setShowSettingsModal(!showSettingsModal)}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-medium transition-colors min-h-[30px] sm:min-h-[36px]"
                title="Pengaturan Aksesibilitas & Auditori"
              >
                <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" />
                <span className="hidden md:inline">Akses</span>
              </button>
            </div>

          </div>

          {/* Row 1.5: Dedicated Mobile Account Switcher Sub-Bar (prevents crowding on mobile) */}
          {onSwitchUser && (
            <div className="sm:hidden flex items-center justify-between py-1.5 px-1 border-t border-slate-100 gap-2 text-xs">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span className="text-[11px] text-slate-500 font-medium flex-shrink-0">Akun:</span>
                <select
                  value={currentUser?.id || 'usr-student-elang'}
                  onChange={e => onSwitchUser(e.target.value)}
                  className="bg-slate-50 text-slate-800 font-semibold text-[11px] py-1 px-2 rounded-lg border border-slate-200 focus:outline-none cursor-pointer truncate min-w-0 flex-1"
                  title="Ganti persona simulasi siswa/admin"
                >
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.role === 'superadmin' ? `🛡️ ${u.fullName}` : `👤 ${u.fullName}`}
                    </option>
                  ))}
                </select>
              </div>
              <span 
                className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/70 flex items-center gap-1 flex-shrink-0"
                title={!isSuperAdmin ? "Jenjang terkunci untuk akun siswa" : "Jenjang aktif"}
              >
                {!isSuperAdmin && <Lock className="w-2.5 h-2.5 text-sky-600" />}
                {currentLevel} {!isSuperAdmin && <span className="text-[9px] text-sky-600 font-normal hidden xs:inline">(Terkunci)</span>}
              </span>
            </div>
          )}

          {/* Row 2: Navigation Bar (Pills for iPad and Desktop, hidden on small mobile) */}
          <div className="hidden sm:flex items-center space-x-1.5 py-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateView(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all min-h-[36px] ${
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
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb friendly for Smartphone / HP) */}
      <nav 
        aria-label="Navigasi Bawah Mobile"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around"
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          let shortLabel = item.label;
          if (item.id === 'dashboard') shortLabel = 'Dashboard';
          if (item.id === 'home') shortLabel = 'Materi';
          if (item.id === 'mastery-map') shortLabel = 'Mastery';
          if (item.id === 'history') shortLabel = 'Riwayat';
          if (item.id === 'admin') shortLabel = 'Admin';

          return (
            <button
              key={item.id}
              onClick={() => onNavigateView(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all min-h-[46px] ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium leading-none">
                {shortLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Accessibility & Audio Floating Modal */}
      {showSettingsModal && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50"
            onClick={() => setShowSettingsModal(false)} 
          />
          <div className="fixed inset-x-3 bottom-4 sm:bottom-auto sm:inset-x-auto sm:right-4 sm:top-20 max-w-md sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 z-50 animate-in fade-in zoom-in duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                Aksesibilitas & Suara
              </h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-slate-100"
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
    </>
  );
};
