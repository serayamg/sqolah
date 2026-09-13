export type AiProviderType = 'openai' | 'gemini' | 'deepseek' | 'claude' | 'custom';

export interface AiModelOption {
  id: string;
  name: string;
  provider: AiProviderType;
  description: string;
  recommended?: boolean;
}

export interface ProviderConfig {
  provider: AiProviderType;
  name: string;
  icon: string;
  color: string;
  badgeColor: string;
  defaultModel: string;
  models: AiModelOption[];
  requiresBaseUrl?: boolean;
  defaultBaseUrl?: string;
  docsUrl: string;
}

export interface StoredApiKey {
  provider: AiProviderType;
  key: string;
  customBaseUrl?: string;
  selectedModel?: string;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'error' | 'untested';
  lastLatencyMs?: number;
  lastErrorMessage?: string;
}

export interface AiChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: AiProviderType;
  model?: string;
}

export interface CliOutputLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'system';
  content: string;
  timestamp: string;
}

export interface TestConnectionResult {
  success: boolean;
  latencyMs: number;
  message: string;
  model: string;
}
