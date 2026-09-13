// Audio Engine: Web Speech API (TTS) + Web Audio API (Sound Effects)

class AudioEngine {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private indonesianVoice: SpeechSynthesisVoice | null = null;
  private isSpeakingState = false;
  private isPausedState = false;
  private listeners: Set<(state: { isSpeaking: boolean; isPaused: boolean; currentText?: string }) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public loadVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const voices = this.synth.getVoices();
    // Prioritize Indonesian voices
    const idVoice = voices.find(v => v.lang === 'id-ID' || v.lang.startsWith('id') || v.name.toLowerCase().includes('indonesia'));
    if (idVoice) {
      this.indonesianVoice = idVoice;
    } else {
      // Fallback: pick any available voice or default
      this.indonesianVoice = voices.find(v => v.default) || voices[0] || null;
    }
    return voices;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.synth ? this.synth.getVoices() : [];
  }

  public subscribe(cb: (state: { isSpeaking: boolean; isPaused: boolean; currentText?: string }) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(currentText?: string) {
    const state = {
      isSpeaking: this.isSpeakingState,
      isPaused: this.isPausedState,
      currentText
    };
    this.listeners.forEach(cb => cb(state));
  }

  /**
   * Cleans text to sound natural when read in Indonesian
   */
  public cleanTextForSpeech(text: string): string {
    return text
      .replace(/#+\s*/g, '') // remove markdown headings
      .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
      .replace(/\*(.*?)\*/g, '$1') // remove italics
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // markdown links
      .replace(/%/g, ' persen ')
      .replace(/\+/g, ' tambah ')
      .replace(/=/g, ' sama dengan ')
      .replace(/×/g, ' kali ')
      .replace(/÷/g, ' bagi ')
      .replace(/>/g, ' lebih dari ')
      .replace(/</g, ' kurang dari ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Speak arbitrary text
   */
  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      voiceURI?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    } = {}
  ): void {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      options.onEnd?.();
      return;
    }

    this.stop(); // Stop any currently playing audio

    const cleanedText = this.cleanTextForSpeech(text);
    if (!cleanedText) {
      options.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    this.currentUtterance = utterance;

    // Set voice
    if (options.voiceURI) {
      const selected = this.synth.getVoices().find(v => v.voiceURI === options.voiceURI);
      if (selected) utterance.voice = selected;
    } else if (this.indonesianVoice) {
      utterance.voice = this.indonesianVoice;
    }

    utterance.lang = utterance.voice?.lang || 'id-ID';
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    utterance.onstart = () => {
      this.isSpeakingState = true;
      this.isPausedState = false;
      this.notify(cleanedText);
      options.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.currentUtterance = null;
      this.notify();
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.currentUtterance = null;
      this.notify();
      options.onError?.(e);
    };

    this.synth.speak(utterance);
  }

  public pause(): void {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.isPausedState = true;
      this.notify(this.currentUtterance?.text);
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.isPausedState = false;
      this.notify(this.currentUtterance?.text);
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.currentUtterance = null;
      this.notify();
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  public isPaused(): boolean {
    return this.synth ? this.synth.paused : false;
  }

  // ==========================================
  // Web Audio Synthesizer Sound Effects
  // ==========================================

  public playSound(type: 'correct' | 'wrong' | 'click' | 'fanfare' | 'notification'): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'correct') {
        // Melodic ascending chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0, now + i * 0.1);
          gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.35);
        });
      } else if (type === 'wrong') {
        // Low double buzz
        const freqs = [220, 185];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);
          gain.gain.setValueAtTime(0.15, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.18);
        });
      } else if (type === 'fanfare') {
        // Celebration chords: C5, E5, G5, high C6
        const chord = [523.25, 659.25, 783.99, 1046.50];
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.18, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.6);
        });
      } else if (type === 'notification') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // Audio context might fail if blocked by autoplay policy before user gesture
    }
  }
}

export const audioEngine = new AudioEngine();
