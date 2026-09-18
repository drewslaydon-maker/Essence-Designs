/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private wingOsc: OscillatorNode | null = null;
  private wingGain: GainNode | null = null;

  constructor() {
    // Lazy init audio context on first user interaction
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.wingGain) {
      this.wingGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Start continuous wingbeat drone with low subtle volume
  public startWingbeat() {
    const ctx = this.getContext();
    if (!ctx || this.wingOsc) return;

    try {
      this.wingOsc = ctx.createOscillator();
      this.wingGain = ctx.createGain();
      
      this.wingOsc.type = 'sawtooth';
      this.wingOsc.frequency.setValueAtTime(200, ctx.currentTime); // ~200Hz Drosophila wingbeat

      // Filter to sound like a tiny insect buzzing in a helmet
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      this.wingGain.gain.setValueAtTime(0.015, ctx.currentTime);

      this.wingOsc.connect(filter);
      filter.connect(this.wingGain);
      this.wingGain.connect(ctx.destination);

      this.wingOsc.start();
    } catch {
      // Audio context might fail before user interaction
    }
  }

  public updateWingbeat(frequencyHz: number, intensity: number) {
    if (!this.ctx || !this.wingOsc || !this.wingGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.wingOsc.frequency.setTargetAtTime(Math.max(120, Math.min(320, frequencyHz)), now, 0.05);
    this.wingGain.gain.setTargetAtTime(Math.max(0.005, Math.min(0.04, intensity * 0.03)), now, 0.05);
  }

  // Retro NERV interface confirmation blip
  public playBeep(freq = 880, type: OscillatorType = 'sine', duration = 0.08) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  // Giant Fiber Looming Reflex: sudden evasive dash whoosh!
  public playLoomingReflex() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }

  // A.T. Field resonance / crystalline hum
  public playAtField() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(440, ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.25);
    osc2.frequency.setValueAtTime(444, ctx.currentTime); // Slight detune for shimmer

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
  }

  // Positron Rifle blast
  public playLaserShot() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.22);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  }

  // Explosion when Angel or Projectile is destroyed
  public playExplosion() {
    const ctx = this.getContext();
    if (!ctx) return;

    // White noise explosion
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
  }

  // Baseball Bat strike (CRACK!)
  public playBatHit(isHomeRun = false) {
    const ctx = this.getContext();
    if (!ctx) return;

    // Sharp impulse pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isHomeRun ? 1200 : 800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);

    if (isHomeRun) {
      setTimeout(() => {
        this.playBeep(523, 'sawtooth', 0.15);
        setTimeout(() => this.playBeep(659, 'sawtooth', 0.15), 120);
        setTimeout(() => this.playBeep(784, 'sawtooth', 0.35), 240);
      }, 80);
    }
  }

  // NERV Emergency Klaxon Siren
  public playEmergencyKlaxon() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(750, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  // Dramatic Gendo Ikar-fly intro chord
  public playGendoChord() {
    const ctx = this.getContext();
    if (!ctx) return;

    [110, 164.81, 196, 220, 277.18].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08 / (idx + 1), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(150, ctx.currentTime + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.2);
    });
  }

  // Particle Beam charge whistling sound
  public playBeamCharge() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.3);
  }

  // Baseball Pitch Throw Whoosh
  public playPitchWhoosh() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  }

  // Strikeout Umpire Call (K!)
  public playStrikeoutWhistle() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }

  // Pilot Radio Chatter Chirp
  public playRadioChirp() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1050, ctx.currentTime);
    osc.frequency.setValueAtTime(1450, ctx.currentTime + 0.04);
    osc.frequency.setValueAtTime(950, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  // Crowd applause / cheer for big plays
  public playCrowdCheer() {
    const ctx = this.getContext();
    if (!ctx) return;

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + 1.2);
    });
  }
}

export const audio = new AudioService();
