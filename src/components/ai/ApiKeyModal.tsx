import React, { useState, useEffect } from 'react';
import {
  AiProviderType,
  StoredApiKey,
  ProviderConfig
} from '../../types/ai';
import { AiService, SUPPORTED_PROVIDERS } from '../../services/aiService';
import {
  Key,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  ExternalLink,
  Trash2,
  Save,
  Radio,
  Terminal,
  Shield,
  Zap,
  Sparkles,
  Info
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCli?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onOpenCli }) => {
  const [activeTab, setActiveTab] = useState<AiProviderType>('gemini');
  const [keys, setKeys] = useState<Record<string, StoredApiKey>>({});
  const [activeProvider, setActiveProvider] = useState<AiProviderType>('gemini');
  
  // Form edit states for active tab
  const [inputKey, setInputKey] = useState('');
  const [inputBaseUrl, setInputBaseUrl] = useState('');
  const [inputModel, setInputModel] = useState('');
  const [showKey, setShowKey] = useState(false);
  
  // Test states
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    const stored = AiService.getStoredKeys();
    setKeys(stored);
    const active = AiService.getActiveProvider();
    setActiveProvider(active);
    
    // Default tab to active provider or gemini
    const initialTab = (active && SUPPORTED_PROVIDERS.some(p => p.provider === active)) ? active : 'gemini';
    setActiveTab(initialTab);
    loadTabValues(initialTab, stored);
  };

  const loadTabValues = (provider: AiProviderType, allKeys: Record<string, StoredApiKey>) => {
    const item = allKeys[provider];
    const config = SUPPORTED_PROVIDERS.find(p => p.provider === provider);
    setInputKey(item?.key || '');
    setInputBaseUrl(item?.customBaseUrl || config?.defaultBaseUrl || '');
    setInputModel(item?.selectedModel || config?.defaultModel || '');
    setShowKey(false);
    setTestResult(null);
  };

  const handleSelectTab = (provider: AiProviderType) => {
    setActiveTab(provider);
    loadTabValues(provider, keys);
  };

  const handleSaveCurrent = () => {
    if (!inputKey.trim()) return;
    AiService.saveStoredKey(activeTab, inputKey, inputBaseUrl, inputModel);
    const updated = AiService.getStoredKeys();
    setKeys(updated);
    setTestResult({
      success: true,
      message: `API Key ${activeTab.toUpperCase()} berhasil disimpan ke penyimpanan lokal.`
    });
  };

  const handleRemoveCurrent = () => {
    AiService.removeStoredKey(activeTab);
    const updated = AiService.getStoredKeys();
    setKeys(updated);
    setInputKey('');
    setTestResult({
      success: false,
      message: `API Key ${activeTab.toUpperCase()} telah dihapus.`
    });
  };

  const handleSetPrimary = (provider: AiProviderType) => {
    AiService.setActiveProvider(provider);
    setActiveProvider(provider);
  };

  const handleTestConnection = async () => {
    // If key not saved yet, save first
    if (inputKey.trim()) {
      AiService.saveStoredKey(activeTab, inputKey, inputBaseUrl, inputModel);
    }
    
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await AiService.testConnection(activeTab);
      setTestResult({
        success: res.success,
        message: res.message,
        latency: res.latencyMs
      });
      // Refresh stored state to update lastTestedAt
      setKeys(AiService.getStoredKeys());
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Gagal terhubung.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  const currentConfig = SUPPORTED_PROVIDERS.find(p => p.provider === activeTab)!;
  const currentSaved = keys[activeTab];
  const isCurrentActive = activeProvider === activeTab;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                <span>Koneksi AI & API Keys</span>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Multi-Provider
                </span>
              </h2>
              <p className="text-xs text-slate-500">Hubungkan OpenAI, Google Gemini, DeepSeek, Claude & OpenRouter</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          
          {/* Privacy & Safe Storage Badge */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Aman & Terlindungi (Client-Side Storage):</span> API Key disimpan hanya di peramban (browser) Anda. Setiap request dikirim langsung ke server resmi penyedia AI tanpa server perantara pihak ketiga.
            </div>
          </div>

          {/* Provider Tabs */}
          <div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
              Pilih Penyedia AI:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SUPPORTED_PROVIDERS.map(p => {
                const isSelected = activeTab === p.provider;
                const hasKey = Boolean(keys[p.provider]?.key);
                const isPrimary = activeProvider === p.provider;

                return (
                  <button
                    key={p.provider}
                    onClick={() => handleSelectTab(p.provider)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-slate-800 truncate">{p.name.split(' ')[0]}</span>
                      {hasKey ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Key tersimpan" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300" title="Belum diatur" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {isPrimary ? (
                        <span className="text-indigo-600 font-bold">★ Utama</span>
                      ) : hasKey ? (
                        'Tersedia'
                      ) : (
                        'Kosong'
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Provider Form */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentConfig.name}</span>
                  {currentSaved?.key && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Aktif Tersimpan
                    </span>
                  )}
                </h3>
                <a
                  href={currentConfig.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 font-medium mt-0.5"
                >
                  <span>Dapatkan API Key {currentConfig.name.split(' ')[0]}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {currentSaved?.key && (
                <button
                  onClick={() => handleSetPrimary(activeTab)}
                  disabled={isCurrentActive}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto ${
                    isCurrentActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{isCurrentActive ? '★ Provider Utama Aktif' : 'Jadikan Provider Utama'}</span>
                </button>
              )}
            </div>

            {/* API Key Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                API Key {currentConfig.name.split(' ')[0]}:
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder={`Tempel kunci API Anda (${currentConfig.provider === 'openai' ? 'sk-...' : currentConfig.provider === 'gemini' ? 'AIzaSy...' : 'sk-ant-...'})`}
                  value={inputKey}
                  onChange={e => setInputKey(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  title={showKey ? 'Sembunyikan Kunci' : 'Lihat Kunci'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Model Selection Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Model AI Pilihan:
                </label>
                <select
                  value={inputModel}
                  onChange={e => setInputModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {currentConfig.models.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.recommended ? '(Rekomendasi)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Base URL (if custom or needed) */}
              {currentConfig.requiresBaseUrl && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base URL API:
                  </label>
                  <input
                    type="text"
                    value={inputBaseUrl}
                    onChange={e => setInputBaseUrl(e.target.value)}
                    placeholder="https://openrouter.ai/api/v1"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Test Result Message Box */}
            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{testResult.message}</div>
                  {testResult.latency !== undefined && (
                    <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                      Waktu Respons: {testResult.latency}ms
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveCurrent}
                  disabled={!inputKey.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition shadow-sm flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan API Key</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !inputKey.trim()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center space-x-1.5"
                >
                  <Zap className={`w-3.5 h-3.5 ${isTesting ? 'animate-bounce text-amber-500' : 'text-slate-500'}`} />
                  <span>{isTesting ? 'Menguji Koneksi...' : 'Tes Koneksi'}</span>
                </button>
              </div>

              {currentSaved?.key && (
                <button
                  type="button"
                  onClick={handleRemoveCurrent}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <span className="font-medium">Provider Aktif Sqolah:</span>
            <span className="font-bold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {activeProvider}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenCli && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCli();
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Buka AI Terminal CLI</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition"
            >
              Selesai
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
