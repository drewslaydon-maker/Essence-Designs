// Procedural Synth & SFX Engine for prOsis v2.0CE.

export const AUDIO_PREFS_KEY = "PROSIS_AUDIO_PREFS_v1";

export interface AudioPrefs {
  muted: boolean;
  volume: number;
}

const memoryStore = new Map<string, string>();

function getItem(key: string): string | null {
  try {
    if (typeof localStorage !== "undefined" && localStorage !== null) {
      return localStorage.getItem(key);
    }
  } catch {
    // Fallback on storage errors
  }
  return memoryStore.get(key) ?? null;
}

function setItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== "undefined" && localStorage !== null) {
      localStorage.setItem(key, value);
      return;
    }
  } catch {
    // Fallback on storage errors
  }
  memoryStore.set(key, value);
}

const DEFAULT_AUDIO_PREFS: AudioPrefs = {
  muted: false,
  volume: 0.7,
};

export function getAudioPrefs(): AudioPrefs {
  const raw = getItem(AUDIO_PREFS_KEY);
  if (!raw) return { ...DEFAULT_AUDIO_PREFS };
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_AUDIO_PREFS,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_AUDIO_PREFS };
  }
}

export function saveAudioPrefs(prefs: Partial<AudioPrefs>): AudioPrefs {
  const current = getAudioPrefs();
  const updated: AudioPrefs = {
    ...current,
    ...prefs,
  };
  setItem(AUDIO_PREFS_KEY, JSON.stringify(updated));
  return updated;
}
class ProceduralAudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  padGain: GainNode | null = null;
  padOscs: OscillatorNode[] = [];
  lfoOsc: OscillatorNode | null = null;
  padActive = false;

  private initCtx() {
    if (this.ctx) return;
    if (typeof window === "undefined") return;

    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        const prefs = getAudioPrefs();
        this.masterGain.gain.value = prefs.muted ? 0 : prefs.volume;
        this.masterGain.connect(this.ctx.destination);
      }
    } catch {
      // AudioContext unavailable or blocked by autoplay policy
    }
  }

  startAmbientPad() {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    if (this.padActive) return;

    try {
      this.padGain = this.ctx.createGain();
      this.padGain.gain.value = 0.15;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 350;

      // C minor 7 harmonic frequencies: C3, Eb3, G3, Bb3
      const freqs = [130.81, 155.56, 196.00, 233.08];
      this.padOscs = freqs.map((f, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = i % 2 === 0 ? "sawtooth" : "sine";
        osc.frequency.value = f;
        osc.connect(filter);
        osc.start();
        return osc;
      });

      this.lfoOsc = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.lfoOsc.frequency.value = 0.12;
      lfoGain.gain.value = 0.04;
      this.lfoOsc.connect(lfoGain);
      lfoGain.connect(this.padGain.gain);
      this.lfoOsc.start();

      filter.connect(this.padGain);
      this.padGain.connect(this.masterGain);
      this.padActive = true;
    } catch {
      // Fallback
    }
  }

  stopAmbientPad() {
    if (!this.padActive) return;
    try {
      for (const osc of this.padOscs) {
        osc.stop();
        osc.disconnect();
      }
      this.padOscs = [];
      if (this.lfoOsc) {
        this.lfoOsc.stop();
        this.lfoOsc.disconnect();
        this.lfoOsc = null;
      }
      this.padActive = false;
    } catch {
      // Fallback
    }
  }

  toggleMute(): boolean {
    const prefs = getAudioPrefs();
    const newMuted = !prefs.muted;
    saveAudioPrefs({ muted: newMuted });

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.value = newMuted ? 0 : prefs.volume;
    }
    return newMuted;
  }

  isMuted(): boolean {
    return getAudioPrefs().muted;
  }

  playSFX(type: "warp_transit" | "ui_click" | "alert_threat" | "barrier_claim" | string) {
    const prefs = getAudioPrefs();
    if (prefs.muted) return;

    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    try {
      const now = this.ctx.currentTime;

      if (type === "warp_transit") {
        const osc = this.ctx.createOscillator();
        const sfxGain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.4);
        sfxGain.gain.setValueAtTime(0.2, now);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(sfxGain);
        sfxGain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "ui_click") {
        const osc = this.ctx.createOscillator();
        const sfxGain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(800, now);
        sfxGain.gain.setValueAtTime(0.1, now);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(sfxGain);
        sfxGain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "alert_threat") {
        const osc = this.ctx.createOscillator();
        const sfxGain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.1);
        sfxGain.gain.setValueAtTime(0.15, now);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(sfxGain);
        sfxGain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "barrier_claim") {
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((f, idx) => {
          const osc = this.ctx!.createOscillator();
          const sfxGain = this.ctx!.createGain();
          const startTime = now + idx * 0.06;
          osc.type = "sine";
          osc.frequency.value = f;
          sfxGain.gain.setValueAtTime(0.1, startTime);
          sfxGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

          osc.connect(sfxGain);
          sfxGain.connect(this.masterGain!);
          osc.start(startTime);
          osc.stop(startTime + 0.2);
        });
      }
    } catch {
      // Fallback
    }
  }
}

const engine = new ProceduralAudioEngine();

export function startAmbientPad(): void {
  engine.startAmbientPad();
}

export function stopAmbientPad(): void {
  engine.stopAmbientPad();
}

export function toggleMute(): boolean {
  return engine.toggleMute();
}

export function isMuted(): boolean {
  return engine.isMuted();
}

export function playSFX(type: "warp_transit" | "ui_click" | "alert_threat" | "barrier_claim" | string): void {
  engine.playSFX(type);
}

