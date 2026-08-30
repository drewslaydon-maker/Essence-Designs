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
  padFilter: BiquadFilterNode | null = null;
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

  ensureAudioContext() {
    this.initCtx();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
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

      this.padFilter = this.ctx.createBiquadFilter();
      this.padFilter.type = "lowpass";
      this.padFilter.frequency.value = 350;

      // C minor 7 harmonic frequencies: C3, Eb3, G3, Bb3
      const freqs = [130.81, 155.56, 196.00, 233.08];
      this.padOscs = freqs.map((f, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = i % 2 === 0 ? "sawtooth" : "sine";
        osc.frequency.value = f;
        osc.connect(this.padFilter!);
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

      this.padFilter.connect(this.padGain);
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
      if (this.padFilter) {
        this.padFilter.disconnect();
        this.padFilter = null;
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
      this.masterGain.gain.setValueAtTime(newMuted ? 0 : prefs.volume, this.ctx.currentTime);
    }
    return newMuted;
  }

  setVolume(volume: number) {
    saveAudioPrefs({ volume });
    if (this.masterGain && this.ctx) {
      const prefs = getAudioPrefs();
      if (!prefs.muted) {
        this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      }
    }
  }

  updatePadState(entropy: number, isPressure: boolean, persona: string) {
    if (!this.ctx || !this.padActive) return;

    try {
      const now = this.ctx.currentTime;

      // Lowpass frequency adjustment
      let cutoff = 350 + (entropy / 100) * 450;
      if (isPressure) {
        cutoff += 250;
      }
      cutoff = Math.min(2000, Math.max(100, cutoff));

      if (this.padFilter) {
        this.padFilter.frequency.setTargetAtTime(cutoff, now, 0.3);
      }

      // Base pitches based on persona
      // Maude (default stable): C minor 7 [130.81, 155.56, 196.00, 233.08]
      // Ricky (risky high-tension): transposing up to D minor 7
      // Dez (low tension/compounding): transposing down to Bb minor 7
      let freqs = [130.81, 155.56, 196.00, 233.08];
      if (persona === "ricky") {
        freqs = [146.83, 174.61, 220.00, 261.63];
      } else if (persona === "dez") {
        freqs = [116.54, 138.59, 174.61, 207.65];
      }

      if (this.padOscs.length === freqs.length) {
        freqs.forEach((baseFreq, idx) => {
          const osc = this.padOscs[idx];
          if (osc) {
            // Apply slight pitch shift depending on entropy
            const targetFreq = baseFreq * (1 + (entropy / 100) * 0.05);
            osc.frequency.setTargetAtTime(targetFreq, now, 0.4);

            // Detuning under pressure for phasey chaotic resonance
            const detuneAmt = isPressure ? (idx % 2 === 0 ? 15 : -15) : 0;
            osc.detune.setTargetAtTime(detuneAmt, now, 0.4);
          }
        });
      }
    } catch {
      // Fallback
    }
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
        sfxGain.gain.setValueAtTime(0.05, now);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(sfxGain);
        sfxGain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "ui_click") {
        // Redesigned: Bandpass-filtered white noise + low frequency drop (130Hz -> 60Hz)
        const bufferSize = this.ctx.sampleRate * 0.15; // 150ms
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(250, now);
        noiseFilter.Q.setValueAtTime(2.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.03, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        const sineOsc = this.ctx.createOscillator();
        const sineGain = this.ctx.createGain();
        sineOsc.type = "sine";
        sineOsc.frequency.setValueAtTime(130, now);
        sineOsc.frequency.linearRampToValueAtTime(60, now + 0.15);

        sineGain.gain.setValueAtTime(0.04, now);
        sineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        sineOsc.connect(sineGain);
        sineGain.connect(this.masterGain);

        noiseNode.start(now);
        noiseNode.stop(now + 0.15);
        sineOsc.start(now);
        sineOsc.stop(now + 0.15);
      } else if (type === "alert_threat") {
        const osc = this.ctx.createOscillator();
        const sfxGain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.1);
        sfxGain.gain.setValueAtTime(0.04, now);
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
          sfxGain.gain.setValueAtTime(0.04, startTime);
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

export function setVolume(volume: number): void {
  engine.setVolume(volume);
}

export function updatePadState(entropy: number, isPressure: boolean, persona: string): void {
  engine.updatePadState(entropy, isPressure, persona);
}

export function ensureAudioContext(): void {
  engine.ensureAudioContext();
}

