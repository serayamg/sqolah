import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, FastForward } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { AuditorySettings } from '../types';

interface AudioBarProps {
  auditory: AuditorySettings;
  onUpdateAuditory: (settings: Partial<AuditorySettings>) => void;
}

export const AudioBar: React.FC<AudioBarProps> = ({ auditory, onUpdateAuditory }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState<string>('');

  useEffect(() => {
    return audioEngine.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
      setIsPaused(state.isPaused);
      if (state.currentText) {
        setCurrentText(state.currentText);
      }
    });
  }, []);

  if (!isSpeaking && !isPaused) {
    return null; // Only show floating bar when audio is actively being used
  }

  const togglePlayPause = () => {
    if (isPaused) {
      audioEngine.resume();
    } else {
      audioEngine.pause();
    }
  };

  const handleStop = () => {
    audioEngine.stop();
  };

  const handleRepeat = () => {
    if (currentText) {
      audioEngine.speak(currentText, { rate: auditory.rate });
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(auditory.rate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    onUpdateAuditory({ rate: nextSpeed });
    audioEngine.speak(`Kecepatan ${nextSpeed}x`, { rate: nextSpeed });
  };

  return (
    <aside 
      aria-label="Pemutar Suara Aktif" 
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-4 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 sm:w-11/12 max-w-2xl bg-slate-900/95 backdrop-blur-md text-white px-2.5 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-1.5 sm:gap-3 animate-in slide-in-from-bottom duration-200"
    >
      {/* Wave Visualizer & Status */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex items-end gap-0.5 h-6 w-7 justify-center flex-shrink-0">
          {!isPaused ? (
            <>
              <span className="w-1 bg-sky-400 rounded-full wave-bar" />
              <span className="w-1 bg-sky-400 rounded-full wave-bar" />
              <span className="w-1 bg-indigo-400 rounded-full wave-bar" />
              <span className="w-1 bg-sky-400 rounded-full wave-bar" />
              <span className="w-1 bg-sky-400 rounded-full wave-bar" />
            </>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
              {isPaused ? 'Audio Dijeda' : 'Sedang Membaca Audio'}
            </span>
            <span className="text-[10px] text-slate-400">({auditory.rate}x)</span>
          </div>
          <p className="text-xs text-slate-200 truncate font-medium">
            {currentText || 'Membacakan materi...'}
          </p>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Repeat Button */}
        <button
          onClick={handleRepeat}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Ulangi Bacaan Ini"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-md shadow-sky-500/30"
          title={isPaused ? 'Lanjutkan Suara' : 'Jeda Suara'}
        >
          {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
        </button>

        {/* Speed Cycle Button */}
        <button
          onClick={cycleSpeed}
          className="px-2 py-1.5 rounded-xl text-xs font-bold text-sky-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 border border-slate-700"
          title="Ubah Kecepatan Suara"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>{auditory.rate}x</span>
        </button>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          title="Hentikan Audio"
        >
          <Square className="w-4 h-4 fill-rose-400" />
        </button>
      </div>
    </aside>
  );
};
