import React, { useState, useEffect, useRef } from 'react';
import {
  AiProviderType,
  CliOutputLine
} from '../../types/ai';
import { AiService, SUPPORTED_PROVIDERS } from '../../services/aiService';
import { IntelligenceService } from '../../services/intelligenceService';
import {
  Terminal,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Key,
  Zap,
  CornerDownLeft,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface AiCliDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiKeyModal: () => void;
  studentId?: string;
}

export const AiCliDrawer: React.FC<AiCliDrawerProps> = ({
  isOpen,
  onClose,
  onOpenApiKeyModal,
  studentId = 'SQ-2026-0001'
}) => {
  const [lines, setLines] = useState<CliOutputLine[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // History buffer for UP/DOWN navigation
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (lines.length === 0) {
        initWelcomeMessage();
      }
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const initWelcomeMessage = () => {
    const activeProvider = AiService.getActiveProvider();
    const stored = AiService.getStoredKey(activeProvider);
    const hasKey = Boolean(stored?.key);

    const welcome: CliOutputLine[] = [
      {
        id: 'w1',
        type: 'system',
        content: '╔══════════════════════════════════════════════════════════════════╗\n║   SQOLAH AI CLI & MULTI-PROVIDER INTELLIGENCE TERMINAL v1.0.0   ║\n║   OpenAI • Google Gemini • DeepSeek • Anthropic Claude • Custom  ║\n╚══════════════════════════════════════════════════════════════════╝',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: 'w2',
        type: 'info',
        content: `Provider Aktif: [${activeProvider.toUpperCase()}] • Model: [${stored?.selectedModel || 'default'}] • Status: [${hasKey ? 'CONNECTED' : 'KEY NOT SET'}]`,
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: 'w3',
        type: 'info',
        content: 'Ketik "help" untuk melihat daftar perintah, atau langsung ketik pertanyaan seputar materi kimia untuk dijawab oleh AI.',
        timestamp: new Date().toLocaleTimeString()
      }
    ];

    if (!hasKey) {
      welcome.push({
        id: 'w4',
        type: 'error',
        content: `⚠️ PERHATIAN: API Key ${activeProvider.toUpperCase()} belum disetel. Ketik "key" atau gunakan perintah "set-key <provider> <key>" untuk menghubungkan.`,
        timestamp: new Date().toLocaleTimeString()
      });
    }

    setLines(welcome);
  };

  const addLine = (type: CliOutputLine['type'], content: string) => {
    setLines(prev => [
      ...prev,
      {
        id: `line-${Date.now()}-${Math.random()}`,
        type,
        content,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const command = inputVal.trim();
    if (!command || isProcessing) return;

    // Add to input history
    setHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setInputVal('');

    // Echo user input
    addLine('input', command);

    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    setIsProcessing(true);

    try {
      switch (cmd) {
        case 'help':
          addLine(
            'info',
            `DAFTAR PERINTAH TERSEDIA:
  • help                     : Tampilkan panduan ini
  • status                   : Periksa status penyedia AI & API Key
  • providers                : Daftar semua penyedia yang didukung
  • models [provider]        : Daftar model yang tersedia
  • use <provider> [model]   : Ganti provider/model aktif (openai, gemini, deepseek, claude, custom)
  • test [provider]          : Tes koneksi dan ping latensi API
  • set-key <prov> <key>     : Simpan API Key langsung dari CLI
  • key                      : Buka panel dialog pengaturan API Key
  • ask <pertanyaan>         : Konsultasi konsep kimia / soal ujian dengan AI
  • diagnose                 : Analisis learning gaps siswa oleh Sqolah Intelligence
  • explain-bab <nomor>      : Rangkum materi bab kurikulum Kimia SMA (1-20)
  • clear                    : Bersihkan layar terminal
  • exit                     : Tutup konsol CLI

Tips: Anda juga bisa langsung mengetik pertanyaan tanpa awalan "ask".`
          );
          break;

        case 'status': {
          const active = AiService.getActiveProvider();
          const stored = AiService.getStoredKey(active);
          const all = AiService.getStoredKeys();
          const config = SUPPORTED_PROVIDERS.find(p => p.provider === active);
          const configuredList = Object.keys(all).filter(k => Boolean(all[k]?.key));

          addLine(
            'output',
            `STATUS SISTEM AI SQOLAH:
  Provider Aktif     : ${active.toUpperCase()} (${config?.name || '-'})
  Model Terpilih     : ${stored?.selectedModel || config?.defaultModel || '-'}
  Status API Key     : ${stored?.key ? `Terkonfigurasi (${AiService.maskApiKey(stored.key)})` : 'BELUM DIATUR'}
  Latensi Terakhir   : ${stored?.lastLatencyMs !== undefined ? `${stored.lastLatencyMs}ms` : 'Belum dites'}
  Uji Terakhir       : ${stored?.lastTestStatus === 'success' ? '✓ BERHASIL' : stored?.lastTestStatus === 'error' ? '✗ GAGAL' : 'Belum diuji'}
  Provider Tersedia  : ${configuredList.length > 0 ? configuredList.map(c => c.toUpperCase()).join(', ') : 'Belum ada key tersimpan'}`
          );
          break;
        }

        case 'providers': {
          const out = SUPPORTED_PROVIDERS.map(
            p => `  • ${p.provider.padEnd(10)}: ${p.name} (Default: ${p.defaultModel})`
          ).join('\n');
          addLine('output', `PENYEDIA AI YANG DIDUKUNG:\n${out}`);
          break;
        }

        case 'models': {
          const targetProv = (args[0]?.toLowerCase() as AiProviderType) || AiService.getActiveProvider();
          const provConfig = SUPPORTED_PROVIDERS.find(p => p.provider === targetProv);
          if (!provConfig) {
            addLine('error', `Provider "${args[0]}" tidak dikenal. Ketik "providers" untuk daftar resmi.`);
            break;
          }
          const modelList = provConfig.models
            .map(m => `  • ${m.id.padEnd(30)}: ${m.name} ${m.recommended ? '(Rekomendasi)' : ''}`)
            .join('\n');
          addLine('output', `MODEL TERSEDIA UNTUK [${targetProv.toUpperCase()}]:\n${modelList}`);
          break;
        }

        case 'use': {
          if (!args[0]) {
            addLine('error', 'Format: use <provider> [model]\nContoh: use gemini gemini-1.5-flash');
            break;
          }
          const targetProv = args[0].toLowerCase() as AiProviderType;
          const provConfig = SUPPORTED_PROVIDERS.find(p => p.provider === targetProv);
          if (!provConfig) {
            addLine('error', `Provider "${args[0]}" tidak ditemukan. Gunakan: openai, gemini, deepseek, claude, custom.`);
            break;
          }

          AiService.setActiveProvider(targetProv);
          if (args[1]) {
            const stored = AiService.getStoredKey(targetProv);
            AiService.saveStoredKey(targetProv, stored?.key || '', stored?.customBaseUrl, args[1]);
          }
          addLine('success', `Provider aktif berhasil diganti ke: [${targetProv.toUpperCase()}] model: [${args[1] || provConfig.defaultModel}]`);
          break;
        }

        case 'test': {
          const targetProv = (args[0]?.toLowerCase() as AiProviderType) || AiService.getActiveProvider();
          addLine('info', `Menguji koneksi ke ${targetProv.toUpperCase()}...`);
          const res = await AiService.testConnection(targetProv);
          if (res.success) {
            addLine('success', `✓ [BERHASIL] ${res.message} (Model: ${res.model})`);
          } else {
            addLine('error', `✗ [GAGAL] ${res.message}`);
          }
          break;
        }

        case 'set-key': {
          if (args.length < 2) {
            addLine('error', 'Format: set-key <provider> <api-key>\nContoh: set-key gemini AIzaSyAbc123...');
            break;
          }
          const targetProv = args[0].toLowerCase() as AiProviderType;
          const targetKey = args[1];
          const provConfig = SUPPORTED_PROVIDERS.find(p => p.provider === targetProv);
          if (!provConfig) {
            addLine('error', `Provider "${args[0]}" tidak valid.`);
            break;
          }
          AiService.saveStoredKey(targetProv, targetKey);
          addLine('success', `✓ API Key untuk [${targetProv.toUpperCase()}] berhasil disimpan ke local storage.`);
          break;
        }

        case 'key':
          onOpenApiKeyModal();
          addLine('info', 'Membuka antarmuka dialog pengaturan API Key...');
          break;

        case 'diagnose': {
          addLine('info', 'Mengambil data diagnosis pemahaman siswa dari Sqolah Intelligence...');
          const gaps = IntelligenceService.detectLearningGaps(studentId);
          const masteries = IntelligenceService.getStudentMasteries(studentId);
          const overall = IntelligenceService.calculateOverallMastery(studentId);

          let diagContext = `Siswa ID: ${studentId}. Rata-rata Penguasaan: ${overall.overallScore}% (${overall.label}). `;
          if (gaps.length > 0) {
            diagContext += `Kesenjangan Kritis: ${gaps.map(g => `${g.strugglingConceptName} (Akar masalah: ${g.rootProblemConceptName})`).join('; ')}.`;
          } else {
            diagContext += `Belum ada kesenjangan kritis terdeteksi atau baru memulai belajar.`;
          }

          addLine('info', `Menghubungi AI untuk menganalisis rekomendasi belajar personal...`);
          const { response, provider, model } = await AiService.chatWithSqolahAi(
            `Buat analisis diagnostik komprehensif dan strategi penguatan konsep bagi siswa ini berdasarkan datanya:\n${diagContext}`,
            { studentContext: diagContext }
          );

          addLine('output', `[ANALISIS DIAGNOSTIK OLEH ${provider.toUpperCase()} (${model})]:\n\n${response}`);
          break;
        }

        case 'explain-bab': {
          const babNum = parseInt(args[0], 10);
          if (isNaN(babNum) || babNum < 1 || babNum > 20) {
            addLine('error', 'Format: explain-bab <1-20>\nContoh: explain-bab 1');
            break;
          }
          addLine('info', `Menghubungi AI untuk merangkum esensi Bab ${babNum} Kimia SMA...`);
          const { response, provider, model } = await AiService.chatWithSqolahAi(
            `Tolong jelaskan intisari konsep penting, rumus kunci, dan penerapan nyata dari Bab ${babNum} Kimia SMA Kurikulum Merdeka.`,
            { chapterContext: `Bab ${babNum} Kurikulum Kimia SMA` }
          );
          addLine('output', `[RANGKUMAN MATERI BAB ${babNum} VIA ${provider.toUpperCase()} (${model})]:\n\n${response}`);
          break;
        }

        case 'clear':
          setLines([]);
          break;

        case 'exit':
          onClose();
          break;

        case 'ask':
        default: {
          // If typed "ask Something" or directly "Something"
          const promptText = cmd === 'ask' ? args.join(' ') : command;
          if (!promptText.trim()) {
            addLine('error', 'Tuliskan pertanyaan yang ingin Anda tanyakan.');
            break;
          }

          addLine('info', `Mengirim ke [${AiService.getActiveProvider().toUpperCase()}]...`);
          const { response, provider, model } = await AiService.chatWithSqolahAi(promptText);
          addLine('output', `[RESPONS ${provider.toUpperCase()} (${model})]:\n\n${response}`);
          break;
        }
      }
    } catch (err: any) {
      addLine('error', `ERROR: ${err?.message || 'Terjadi kesalahan sistem eksekusi AI.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`bg-slate-950 text-slate-100 w-full rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl flex flex-col transition-all duration-300 font-mono ${
          isMaximized
            ? 'h-full sm:h-[95vh] max-w-6xl'
            : 'h-[85vh] sm:h-[680px] max-w-4xl'
        }`}
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 rounded-t-3xl shrink-0 select-none">
          <div className="flex items-center space-x-2.5">
            <div className="flex space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <div className="flex items-center space-x-2 text-xs">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-slate-200">Sqolah AI CLI Console</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-bold uppercase">
                {AiService.getActiveProvider()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition text-xs flex items-center gap-1 mr-1"
              title="Kelola Kunci API"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keys</span>
            </button>

            <button
              type="button"
              onClick={() => setLines([])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Bersihkan Terminal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition hidden sm:block"
              title={isMaximized ? 'Perkecil' : 'Perbesar'}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Tutup CLI"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed selection:bg-cyan-900 selection:text-white">
          {lines.map(line => {
            if (line.type === 'input') {
              return (
                <div key={line.id} className="flex items-start space-x-2 text-cyan-300">
                  <span className="text-emerald-400 font-bold select-none">sqolah-ai&gt;</span>
                  <span className="font-semibold">{line.content}</span>
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={line.id} className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 whitespace-pre-wrap">
                  {line.content}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={line.id} className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 whitespace-pre-wrap">
                  {line.content}
                </div>
              );
            }
            if (line.type === 'info' || line.type === 'system') {
              return (
                <div key={line.id} className="text-slate-400 whitespace-pre-wrap">
                  {line.content}
                </div>
              );
            }
            return (
              <div key={line.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-slate-200 whitespace-pre-wrap leading-relaxed">
                {line.content}
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center space-x-2 text-cyan-400 animate-pulse pt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Memproses inferensi ke {AiService.getActiveProvider().toUpperCase()}...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Row */}
        <form onSubmit={handleCommandSubmit} className="p-3 bg-slate-900 border-t border-slate-800 rounded-b-3xl flex items-center gap-2">
          <span className="text-emerald-400 font-bold select-none text-xs pl-2">sqolah-ai&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder="Ketik perintah (contoh: help, status, explain-bab 1) atau tanya langsung..."
            className="flex-1 bg-transparent text-slate-100 text-xs font-mono outline-none border-none focus:ring-0 placeholder:text-slate-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isProcessing || !inputVal.trim()}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-sm shrink-0"
          >
            <span>Kirim</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
