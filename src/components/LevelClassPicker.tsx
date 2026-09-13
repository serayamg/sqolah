import React from 'react';
import { EducationLevel, AuditorySettings } from '../types';
import { audioEngine } from '../services/audioEngine';
import { Sparkles, Layers, CheckCircle2 } from 'lucide-react';

interface LevelClassPickerProps {
  currentLevel: EducationLevel;
  selectedKelas: number | null;
  onSelectKelas: (kelas: number | null) => void;
  auditory: AuditorySettings;
}

export const LevelClassPicker: React.FC<LevelClassPickerProps> = ({
  currentLevel,
  selectedKelas,
  onSelectKelas,
  auditory
}) => {
  const getClassesForLevel = (lvl: EducationLevel): number[] => {
    switch (lvl) {
      case 'SD':
        return [1, 2, 3, 4, 5, 6];
      case 'SMP':
        return [7, 8, 9];
      case 'SMA':
        return [10, 11, 12];
    }
  };

  const classes = getClassesForLevel(currentLevel);

  const handleChoose = (k: number | null) => {
    audioEngine.playSound('click');
    onSelectKelas(k);
    if (auditory.soundEffects) {
      const msg = k === null ? `Menampilkan semua kelas untuk jenjang ${currentLevel}` : `Memilih Kelas ${k} ${currentLevel}`;
      audioEngine.speak(msg, { rate: 1.1 });
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-sm mb-4 sm:mb-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 flex flex-wrap items-center gap-1.5">
              <span>Pilihan Kelas {currentLevel}</span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                {currentLevel === 'SD' ? 'Sekolah Dasar' : currentLevel === 'SMP' ? 'SMP' : 'SMA'}
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-700 truncate sm:whitespace-normal">
              Pilih kelas spesifik untuk menyaring materi dan latihan soal
            </p>
          </div>
        </div>

        {selectedKelas !== null && (
          <button
            onClick={() => handleChoose(null)}
            className="text-xs text-sky-600 hover:text-sky-800 font-semibold self-start sm:self-auto bg-sky-50 px-2.5 py-1 rounded-lg hover:bg-sky-100 transition-colors"
          >
            Tampilkan Semua Kelas
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => handleChoose(null)}
          className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border whitespace-nowrap min-h-[38px] ${
            selectedKelas === null
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/20'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Semua Kelas
        </button>

        {classes.map((k) => {
          const isSelected = selectedKelas === k;
          let themeColor = 'bg-sky-600 text-white border-sky-600 shadow-sm ring-2 ring-sky-600/20';
          if (currentLevel === 'SD') themeColor = 'bg-red-500 text-white border-red-500 shadow-sm ring-2 ring-red-500/20';
          if (currentLevel === 'SMP') themeColor = 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600/20';
          if (currentLevel === 'SMA') themeColor = 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-600/20';

          return (
            <button
              key={k}
              onClick={() => handleChoose(k)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center gap-1.5 whitespace-nowrap min-h-[38px] ${
                isSelected
                  ? themeColor
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
              Kelas {k}
            </button>
          );
        })}
      </div>
    </div>
  );
};
