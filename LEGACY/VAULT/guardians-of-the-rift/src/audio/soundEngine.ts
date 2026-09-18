/**
 * Web Audio procedural synthesizer for GotR-inspired music and sound effects.
 * No external audio files needed — runs 100% reliably in any modern browser!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.35;
  private sfxVolume: number = 0.6;
  private isMusicPlaying: boolean = false;
  private musicInterval: number | null = null;
  private step: number = 0;
  private currentBpm: number = 104;

  // D Dorian modal scale (reminiscent of Temple of the Eye / OSRS desert & rift mysteries)
  // D3, E3, F3, G3, A3, B3, C4, D4, E4, F4, G4, A4
  private melodyNotes: number[] = [
    293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46
  ];
  private bassNotes: number[] = [
    146.83, 164.81, 174.61, 196.00, 220.00 // D2, E2, F2, G2, A2
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMusicSpeed(instabilityPct: number) {
    // Escalate BPM from 104 up to 132 as rift gets chaotic
    this.currentBpm = Math.floor(104 + (instabilityPct * 0.28));
  }

  public startMusic() {
    if (this.isMuted || this.isMusicPlaying) return;
    this.initCtx();
    this.isMusicPlaying = true;
    this.step = 0;

    const playLoop = () => {
      if (!this.isMusicPlaying || this.isMuted || !this.ctx) return;
      
      const now = this.ctx.currentTime;
      const stepDuration = 60 / (this.currentBpm * 2); // 16th/8th note grid

      // Bassline pattern (syncopated GotR groove)
      if (this.step % 4 === 0) {
        const bassIdx = (this.step % 16 === 0) ? 0 : (this.step % 16 === 8) ? 3 : 2;
        this.playBassTone(this.bassNotes[bassIdx % this.bassNotes.length], now, stepDuration * 1.8);
      }

      // Temple chimes / harp arpeggio
      const chimePattern = [0, 2, 4, 7, 4, 2, 7, 5, 0, 3, 5, 8, 5, 3, 2, 0];
      const noteIdx = chimePattern[this.step % chimePattern.length];
      const freq = this.melodyNotes[noteIdx % this.melodyNotes.length];
      
      if (this.step % 2 === 0) {
        this.playBellTone(freq, now, stepDuration * 1.4);
      }

      // Snappy medieval acoustic frame drum (percussion)
      if (this.step % 4 === 0 || this.step % 8 === 6) {
        this.playPercussion(now, this.step % 4 === 0 ? 'kick' : 'snare');
      }

      this.step = (this.step + 1) % 64;
      this.musicInterval = window.setTimeout(playLoop, stepDuration * 1000);
    };

    playLoop();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private playBassTone(freq: number, time: number, duration: number) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(this.musicVolume * 0.55, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playBellTone(freq: number, time: number, duration: number) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(this.musicVolume * 0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playPercussion(time: number, type: 'kick' | 'snare') {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'kick') {
      osc.frequency.setValueAtTime(110, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);
      gain.gain.setValueAtTime(this.musicVolume * 0.45, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);
      gain.gain.setValueAtTime(this.musicVolume * 0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  // --- Sound Effects ---

  public playMineSfx() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Pickaxe strike: high metallic ping + low crunch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);

    gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playChiselSfx() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.06);

    gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playPortalSfx() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Celestial chord sweep
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      osc.frequency.linearRampToValueAtTime(freq * 1.5, now + 0.35);

      gain.gain.setValueAtTime(this.sfxVolume * 0.15, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + 0.42);
    });
  }

  public playSummonSfx() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(320, now + 0.25);

    gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playBarrierSfx() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.22);

    gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playZapSfx() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

    gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playWardPulseSfx() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.35);

    gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  public playVendingCrankSfx() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Rachet clatters
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(300 + i * 60, t);
      gain.gain.setValueAtTime(this.sfxVolume * 0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  public playWinFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [587.33, 659.25, 739.99, 880.00, 1174.66]; // Victory fanfare
    notes.forEach((f, idx) => {
      if (!this.ctx) return;
      const t = now + idx * 0.11;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(this.sfxVolume * 0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  public playClickSfx() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const sound = new SoundEngine();
