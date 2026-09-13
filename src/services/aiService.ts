import {
  AiProviderType,
  ProviderConfig,
  StoredApiKey,
  AiChatMessage,
  TestConnectionResult
} from '../types/ai';

const STORAGE_KEYS_KEY = 'sqolah_ai_keys_v1';
const ACTIVE_PROVIDER_KEY = 'sqolah_ai_active_provider_v1';

export const SUPPORTED_PROVIDERS: ProviderConfig[] = [
  {
    provider: 'openai',
    name: 'OpenAI (ChatGPT)',
    icon: 'Sparkles',
    color: 'emerald',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    defaultModel: 'gpt-4o-mini',
    docsUrl: 'https://platform.openai.com/api-keys',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', description: 'Cepat, hemat token, ideal untuk tanya jawab materi belajar.', recommended: true },
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', description: 'Model penalaran paling cerdas & multimodal.' },
      { id: 'o3-mini', name: 'o3-mini', provider: 'openai', description: 'Model penalaran sains & matematika tingkat lanjut.' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', description: 'Model klasik berbiaya sangat terjangkau.' }
    ]
  },
  {
    provider: 'gemini',
    name: 'Google Gemini',
    icon: 'Zap',
    color: 'blue',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    defaultModel: 'gemini-1.5-flash',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    models: [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'gemini', description: 'Sangat responsif, jangkauan konteks luas, hemat kuota.', recommended: true },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'gemini', description: 'Generasi terbaru dengan kecepatan inferensi ultra-tinggi.' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini', description: 'Penalaran kompleks analisis konsep sains mendalam.' }
    ]
  },
  {
    provider: 'deepseek',
    name: 'DeepSeek AI',
    icon: 'Compass',
    color: 'cyan',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    defaultModel: 'deepseek-chat',
    docsUrl: 'https://platform.deepseek.com/api_keys',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3 (Chat)', provider: 'deepseek', description: 'Model bahasa umum berkinerja tinggi dan ekonomis.', recommended: true },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1 (Reasoner)', provider: 'deepseek', description: 'Kemampuan CoT (Chain-of-Thought) untuk hitungan stoikiometri & reaksi.' }
    ]
  },
  {
    provider: 'claude',
    name: 'Anthropic Claude',
    icon: 'BookOpen',
    color: 'amber',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    defaultModel: 'claude-3-5-haiku-20241022',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    models: [
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'claude', description: 'Cepat dan sangat presisi dalam menjelaskan teks sains.', recommended: true },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'claude', description: 'Kemampuan pemahaman konsep tingkat tinggi dan bernuansa edukasi.' }
    ]
  },
  {
    provider: 'custom',
    name: 'OpenRouter / Groq / Custom LLM',
    icon: 'Cpu',
    color: 'purple',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    defaultModel: 'google/gemini-2.0-flash-exp:free',
    requiresBaseUrl: true,
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    docsUrl: 'https://openrouter.ai/keys',
    models: [
      { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (OpenRouter Free)', provider: 'custom', description: 'Gratis via OpenRouter.', recommended: true },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', provider: 'custom', description: 'Model open-source terkuat di OpenRouter/Groq.' },
      { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1 (OpenRouter)', provider: 'custom', description: 'Penalaran terbuka via agregator OpenRouter.' },
      { id: 'custom-model', name: 'Custom Model ID', provider: 'custom', description: 'Gunakan model ID spesifik dari penyedia Anda.' }
    ]
  }
];

export class AiService {
  // =========================================================================
  // STORAGE & CONFIGURATION
  // =========================================================================

  public static getStoredKeys(): Record<string, StoredApiKey> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  public static getStoredKey(provider: AiProviderType): StoredApiKey | undefined {
    const keys = this.getStoredKeys();
    return keys[provider];
  }

  public static saveStoredKey(
    provider: AiProviderType,
    key: string,
    customBaseUrl?: string,
    selectedModel?: string
  ): void {
    const keys = this.getStoredKeys();
    const config = SUPPORTED_PROVIDERS.find(p => p.provider === provider);
    const existing = keys[provider] || { provider, key: '' };

    keys[provider] = {
      ...existing,
      provider,
      key: key.trim(),
      customBaseUrl: customBaseUrl !== undefined ? customBaseUrl.trim() : existing.customBaseUrl || config?.defaultBaseUrl,
      selectedModel: selectedModel || existing.selectedModel || config?.defaultModel
    };

    localStorage.setItem(STORAGE_KEYS_KEY, JSON.stringify(keys));

    // If no active provider, set this as active
    if (!this.getActiveProvider()) {
      this.setActiveProvider(provider);
    }
  }

  public static removeStoredKey(provider: AiProviderType): void {
    const keys = this.getStoredKeys();
    delete keys[provider];
    localStorage.setItem(STORAGE_KEYS_KEY, JSON.stringify(keys));

    // If active was removed, fallback to next available key
    if (this.getActiveProvider() === provider) {
      const available = Object.keys(keys) as AiProviderType[];
      if (available.length > 0) {
        this.setActiveProvider(available[0]);
      } else {
        localStorage.removeItem(ACTIVE_PROVIDER_KEY);
      }
    }
  }

  public static getActiveProvider(): AiProviderType {
    const active = localStorage.getItem(ACTIVE_PROVIDER_KEY) as AiProviderType;
    if (active && SUPPORTED_PROVIDERS.some(p => p.provider === active)) {
      return active;
    }
    // Default fallback to first configured provider, or 'openai'
    const keys = this.getStoredKeys();
    const configured = Object.keys(keys)[0] as AiProviderType;
    return configured || 'openai';
  }

  public static setActiveProvider(provider: AiProviderType): void {
    localStorage.setItem(ACTIVE_PROVIDER_KEY, provider);
  }

  public static maskApiKey(key: string): string {
    if (!key) return '';
    if (key.length <= 8) return '••••••••';
    return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
  }

  public static isAnyKeyConfigured(): boolean {
    const keys = this.getStoredKeys();
    return Object.values(keys).some(k => Boolean(k.key && k.key.length > 5));
  }

  // =========================================================================
  // CONNECTION TESTER
  // =========================================================================

  public static async testConnection(provider: AiProviderType): Promise<TestConnectionResult> {
    const stored = this.getStoredKey(provider);
    if (!stored || !stored.key) {
      return {
        success: false,
        latencyMs: 0,
        message: `API Key untuk ${provider.toUpperCase()} belum dimasukkan.`,
        model: '-'
      };
    }

    const config = SUPPORTED_PROVIDERS.find(p => p.provider === provider);
    const model = stored.selectedModel || config?.defaultModel || '';
    const startTime = performance.now();

    try {
      const testPrompt = 'Balas satu kata: SIAP';
      await this.callProviderRaw(provider, stored.key, model, [
        { id: '1', role: 'user', content: testPrompt, timestamp: new Date().toISOString() }
      ], stored.customBaseUrl);

      const latencyMs = Math.round(performance.now() - startTime);

      // Update test status in storage
      stored.lastTestedAt = new Date().toISOString();
      stored.lastTestStatus = 'success';
      stored.lastLatencyMs = latencyMs;
      stored.lastErrorMessage = undefined;
      const allKeys = this.getStoredKeys();
      allKeys[provider] = stored;
      localStorage.setItem(STORAGE_KEYS_KEY, JSON.stringify(allKeys));

      return {
        success: true,
        latencyMs,
        message: `Koneksi berhasil! Latensi: ${latencyMs}ms`,
        model
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      const errMsg = err?.message || 'Gagal terhubung ke API provider.';

      stored.lastTestedAt = new Date().toISOString();
      stored.lastTestStatus = 'error';
      stored.lastLatencyMs = latencyMs;
      stored.lastErrorMessage = errMsg;
      const allKeys = this.getStoredKeys();
      allKeys[provider] = stored;
      localStorage.setItem(STORAGE_KEYS_KEY, JSON.stringify(allKeys));

      return {
        success: false,
        latencyMs,
        message: errMsg,
        model
      };
    }
  }

  // =========================================================================
  // PROVIDER API CLIENT ADAPTERS
  // =========================================================================

  public static async callProviderRaw(
    provider: AiProviderType,
    apiKey: string,
    model: string,
    messages: AiChatMessage[],
    customBaseUrl?: string
  ): Promise<string> {
    switch (provider) {
      case 'openai':
        return this.callOpenAi(apiKey, model, messages);
      case 'gemini':
        return this.callGemini(apiKey, model, messages);
      case 'deepseek':
        return this.callDeepSeek(apiKey, model, messages);
      case 'claude':
        return this.callClaude(apiKey, model, messages);
      case 'custom':
        return this.callCustomOpenAiCompatible(apiKey, customBaseUrl || 'https://openrouter.ai/api/v1', model, messages);
      default:
        throw new Error(`Penyedia AI ${provider} tidak dikenal.`);
    }
  }

  /**
   * OpenAI REST API Client
   */
  private static async callOpenAi(apiKey: string, model: string, messages: AiChatMessage[]): Promise<string> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI Error HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Tidak ada respons dari OpenAI.';
  }

  /**
   * Google Gemini REST API Client
   */
  private static async callGemini(apiKey: string, model: string, messages: AiChatMessage[]): Promise<string> {
    // Separate system message if present
    const systemMsg = messages.find(m => m.role === 'system')?.content;
    const contents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    // Handle single prompt case if all were system
    if (contents.length === 0 && systemMsg) {
      contents.push({ role: 'user', parts: [{ text: systemMsg }] });
    }

    const payload: any = { contents };
    if (systemMsg) {
      payload.systemInstruction = {
        parts: [{ text: systemMsg }]
      };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini Error HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada respons dari Google Gemini.';
  }

  /**
   * DeepSeek REST API Client (OpenAI-compatible)
   */
  private static async callDeepSeek(apiKey: string, model: string, messages: AiChatMessage[]): Promise<string> {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `DeepSeek Error HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Tidak ada respons dari DeepSeek.';
  }

  /**
   * Anthropic Claude REST API Client
   */
  private static async callClaude(apiKey: string, model: string, messages: AiChatMessage[]): Promise<string> {
    const systemMsg = messages.find(m => m.role === 'system')?.content;
    const conversationMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

    if (conversationMessages.length === 0 && systemMsg) {
      conversationMessages.push({ role: 'user', content: systemMsg });
    }

    const payload: any = {
      model,
      max_tokens: 2048,
      messages: conversationMessages
    };

    if (systemMsg) {
      payload.system = systemMsg;
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Claude Error HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text || 'Tidak ada respons dari Anthropic Claude.';
  }

  /**
   * Custom / OpenRouter / Groq (Generic OpenAI-compatible)
   */
  private static async callCustomOpenAiCompatible(
    apiKey: string,
    baseUrl: string,
    model: string,
    messages: AiChatMessage[]
  ): Promise<string> {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const endpoint = cleanBase.endsWith('/chat/completions') ? cleanBase : `${cleanBase}/chat/completions`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin || 'https://sqolah.id',
        'X-Title': 'Sqolah Educational Platform'
      },
      body: JSON.stringify({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Custom LLM Error HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Tidak ada respons dari Custom LLM.';
  }

  // =========================================================================
  // HIGH-LEVEL SQOLAH PEDAGOGICAL AI CHAT
  // =========================================================================

  public static async chatWithSqolahAi(
    userPrompt: string,
    options?: {
      overrideProvider?: AiProviderType;
      overrideModel?: string;
      studentContext?: string;
      chapterContext?: string;
    }
  ): Promise<{ response: string; provider: AiProviderType; model: string }> {
    const provider = options?.overrideProvider || this.getActiveProvider();
    const stored = this.getStoredKey(provider);

    if (!stored || !stored.key) {
      throw new Error(`API Key untuk provider ${provider.toUpperCase()} belum dikonfigurasi. Buka menu "Koneksi API Key" untuk mengaturnya.`);
    }

    const config = SUPPORTED_PROVIDERS.find(p => p.provider === provider);
    const model = options?.overrideModel || stored.selectedModel || config?.defaultModel || '';

    const systemPrompt = `Kamu adalah Sqolah Intelligence Tutor, asisten belajar kimia inklusif untuk siswa SMA Kurikulum Merdeka di Indonesia.
Pedoman Menjawab:
1. Berikan penjelasan yang ramah, jelas, berbasis analogi kehidupan sehari-hari, dan mudah dipahami siswa SMA.
2. Jelaskan konsep kimia secara mendalam tapi tidak berbelit-belit (prinsip atom, ikatan kimia, stoikiometri, asam basa, termokimia).
3. Jika ada rumus atau perhitungan numerik, tuliskan langkah penyelesaian secara runtut tahap demi tahap.
4. Gunakan gaya bahasa Indonesia yang menyemangati dan mendidik.
${options?.studentContext ? `Konteks Siswa: ${options.studentContext}` : ''}
${options?.chapterContext ? `Konteks Materi Pelajaran: ${options.chapterContext}` : ''}`;

    const messages: AiChatMessage[] = [
      { id: 'sys', role: 'system', content: systemPrompt, timestamp: new Date().toISOString() },
      { id: 'usr', role: 'user', content: userPrompt, timestamp: new Date().toISOString() }
    ];

    const response = await this.callProviderRaw(
      provider,
      stored.key,
      model,
      messages,
      stored.customBaseUrl
    );

    return { response, provider, model };
  }
}
