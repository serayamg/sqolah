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
  BookOpen
} from 'lucide-react';
import { EducationLevel, AccessibilitySettings, AuditorySettings } from '../types';
import { audioEngine } from '../services/audioEngine';

interface HeaderProps {
  currentLevel: EducationLevel;
  onSelectLevel: (lvl: EducationLevel) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  activeView: 'home' | 'materi' | 'quiz' | 'admin';
  onNavigateHome: () => void;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  auditory: AuditorySettings;
  onUpdateAuditory: (settings: Partial<AuditorySettings>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  onSelectLevel,
  isAdmin,
  onToggleAdmin,
  activeView,
  onNavigateHome,
  accessibility,
  onUpdateAccessibility,
  auditory,
  onUpdateAuditory
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 py-2 gap-1.5 sm:gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0"
            title="Kembali ke Beranda Sqolah"
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
                Bimbel Online & Ruang Belajar Ramah Kebutuhan Khusus
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

          {/* Action Tools: Accessibility, Audio Stop, Admin Switch */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
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

            {/* Admin Toggle Button */}
            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all min-h-[36px] ${
                isAdmin
                  ? 'bg-amber-500 text-white shadow-sm hover:bg-amber-600'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isAdmin ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Siswa</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Accessibility & Audio Floating Modal */}
      {showSettingsModal && (
        <>
          {/* Backdrop for mobile */}
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
            {/* Kecepatan Suara TTS */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                  Kecepatan Pembaca Suara:
                </span>
                <span className="text-xs font-bold text-sky-600">{auditory.rate}x</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0.75, 1.0, 1.25, 1.5].map(rate => (
                  <button
                    key={rate}
                    onClick={() => {
                      onUpdateAuditory({ rate });
                      audioEngine.speak(`Kecepatan suara ${rate} kali`, { rate });
                    }}
                    className={`py-1 rounded text-xs font-medium border ${
                      auditory.rate === rate
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Efek Suara (Sound Effects) */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-semibold text-slate-800 text-xs">Efek Suara Feedback</p>
                <p className="text-[11px] text-slate-700">Bunyi lonceng benar/salah saat kuis</p>
              </div>
              <button
                onClick={() => {
                  const next = !auditory.soundEffects;
                  onUpdateAuditory({ soundEffects: next });
                  if (next) audioEngine.playSound('correct');
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  auditory.soundEffects ? 'bg-sky-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            <hr className="border-slate-100" />

            {/* Font Ukuran */}
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1">Ukuran Huruf Teks:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Standar' },
                  { id: 'large', label: 'Besar' },
                  { id: 'extra-large', label: 'Ekstra' },
                ].map((size) => (
                  <button
                    key={size.id}
                    onClick={() => onUpdateAccessibility({ fontSize: size.id as AccessibilitySettings['fontSize'] })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center ${
                      accessibility.fontSize === size.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Font Ramah Disleksia */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-indigo-500" />
                  Font Ramah Disleksia
                </p>
                <p className="text-[11px] text-slate-700">Huruf lebih renggang & mudah dibaca</p>
              </div>
              <button
                onClick={() => onUpdateAccessibility({ dyslexicFont: !accessibility.dyslexicFont })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  accessibility.dyslexicFont ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {/* Mode Kontras Tinggi */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-amber-500" />
                  Mode Kontras Tinggi
                </p>
                <p className="text-[11px] text-slate-700">Membantu kenyamanan visual mata</p>
              </div>
              <button
                onClick={() => onUpdateAccessibility({ highContrast: !accessibility.highContrast })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  accessibility.highContrast ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                audioEngine.speak(
                  "Pengaturan aksesibilitas Sqolah aktif. Anda dapat mendengarkan materi dan soal dengan menekan tombol dengarkan.",
                  { rate: auditory.rate }
                );
              }}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center justify-center gap-1 mx-auto"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Tes Audio Sqolah
            </button>
          </div>
        </div>
        </>
      )}
    </header>
  );
};
