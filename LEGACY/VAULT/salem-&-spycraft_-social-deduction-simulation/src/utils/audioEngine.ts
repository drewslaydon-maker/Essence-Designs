// Web Audio API Procedural Sound Effects and Dynamic State-Shifting Background Music

type MusicMood = 'landing' | 'dawn' | 'day_discussion' | 'trial' | 'dusk' | 'night' | 'game_over';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.5;
  private musicVolume: number = 0.35;
  private sfxVolume: number = 0.55;

  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Active music tracking
  private currentMood: MusicMood | null = null;
  private musicInterval: number | null = null;
  private activeVoices: Array<{ osc: OscillatorNode; gain: GainNode }> = [];
  private ambientNoiseNode: AudioNode | null = null;

  public isUnlocked: boolean = false;

  // Initialize and unlock audio upon user gesture
  public unlockAudio(): boolean {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.isUnlocked = true;
      return true;
    } catch (err) {
      console.warn('AudioContext initialization failed or blocked:', err);
      return false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  // --- SOUND EFFECTS (SFX) ---

  // 1. Gavel Strike: Deep wooden crack with hollow resonance
  public playGavel() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // High snap
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.type = 'triangle';
    snap.frequency.setValueAtTime(480, now);
    snap.frequency.exponentialRampToValueAtTime(70, now + 0.12);
    snapGain.gain.setValueAtTime(0.8, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    snap.connect(snapGain);
    snapGain.connect(this.sfxGain);
    snap.start(now);
    snap.stop(now + 0.15);

    // Deep wooden body impact
    const body = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    body.type = 'sine';
    body.frequency.setValueAtTime(140, now);
    body.frequency.exponentialRampToValueAtTime(38, now + 0.35);
    bodyGain.gain.setValueAtTime(0.9, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    body.connect(bodyGain);
    bodyGain.connect(this.sfxGain);
    body.start(now);
    body.stop(now + 0.42);
  }

  // 2. Midnight Bell / Clock Chime
  public playBellToll() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const harmonics = [220, 442, 665, 890];

    harmonics.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const decay = 2.2 - idx * 0.3;
      gain.gain.setValueAtTime(0.3 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now);
      osc.stop(now + decay);
    });
  }

  // 3. Juror Vote Paddle: Clean wooden tap
  public playVotePaddle() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // 4. Objection / Alarm Alert
  public playObjection() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    this.playGavel();

    const now = this.ctx.currentTime + 0.05;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.linearRampToValueAtTime(550, now + 0.18);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  // 5. Coin Clink: Bright metallic drop
  public playCoinClink() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    [1950, 2400, 3100].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      gain.gain.setValueAtTime(0.2, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.25);
    });
  }

  // 6. Blade / Poison Strike: Noir metallic whoosh
  public playBladeStrike() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.28);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  // 7. Behavioral Tell Discovered (Spy Party Glass Harmonic)
  public playTellDiscovered() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    chords.forEach((note, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now + i * 0.06);

      gain.gain.setValueAtTime(0.18, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.5);
    });
  }

  // 8. Will & Parchment Rustle
  public playParchment() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Soft white noise burst filtered
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }

  // 9. Cobblestone Footstep
  private lastFootstepTime = 0;
  public playFootstep() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    if (now - this.lastFootstepTime < 0.22) return; // Prevent spamming
    this.lastFootstepTime = now;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const pitch = 140 + Math.random() * 40;
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // 10. Speech Blip (Town dialogue pop)
  public playSpeechBlip() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const pitch = 380 + Math.random() * 120;
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.3, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // --- DYNAMIC SHIFTING BACKGROUND MUSIC ---

  public setMood(mood: MusicMood) {
    if (this.currentMood === mood) return;
    this.currentMood = mood;
    if (!this.ctx || !this.musicGain) return;

    this.stopCurrentMusic();
    this.startMoodSequence(mood);
  }

  public getMood(): MusicMood | null {
    return this.currentMood;
  }

  private stopCurrentMusic() {
    if (this.musicInterval) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    // Fade out active voices gently
    const now = this.ctx?.currentTime || 0;
    this.activeVoices.forEach(v => {
      try {
        v.gain.gain.setTargetAtTime(0.0001, now, 0.4);
        setTimeout(() => {
          try { v.osc.stop(); } catch {}
        }, 600);
      } catch {}
    });
    this.activeVoices = [];
  }

  private playTone(freq: number, type: OscillatorType, duration: number, peakVol: number, filterFreq = 800) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);

    // Smooth envelope
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakVol, now + Math.min(0.3, duration * 0.3));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);

    this.activeVoices.push({ osc, gain });
    if (this.activeVoices.length > 20) {
      this.activeVoices.shift();
    }
  }

  private startMoodSequence(mood: MusicMood) {
    if (!this.ctx || !this.musicGain) return;

    switch (mood) {
      case 'landing': {
        // Mysterious aristocratic manor chord progression (D minor, Bb maj, G min, A min)
        const notes = [146.83, 174.61, 220.00, 261.63, 293.66]; // D3, F3, A3, C4, D4
        let step = 0;
        const playBaroqueArp = () => {
          const baseFreq = notes[step % notes.length];
          this.playTone(baseFreq, 'triangle', 2.4, 0.12, 600);
          this.playTone(baseFreq * 1.5, 'sine', 1.8, 0.08, 900);
          step++;
        };
        playBaroqueArp();
        this.musicInterval = window.setInterval(playBaroqueArp, 1800);
        break;
      }

      case 'dawn': {
        // Melancholy, quiet dawn over fallen bodies - slow mourning cello notes
        const dawnChords = [110.00, 130.81, 146.83, 164.81]; // A2, C3, D3, E3
        let idx = 0;
        const playDawnDrone = () => {
          const root = dawnChords[idx % dawnChords.length];
          this.playTone(root, 'sine', 4.5, 0.14, 450);
          this.playTone(root * 2.01, 'triangle', 3.8, 0.06, 550);
          idx++;
        };
        playDawnDrone();
        this.musicInterval = window.setInterval(playDawnDrone, 3500);
        break;
      }

      case 'day_discussion': {
        // Parlor intrigue: rhythmic, slightly nervous pizzicato-style pulses
        const parlorNotes = [220, 261.63, 293.66, 329.63, 392]; // A minor pentatonic
        let beat = 0;
        const playParlorPulse = () => {
          const n1 = parlorNotes[beat % parlorNotes.length];
          this.playTone(n1, 'triangle', 0.45, 0.10, 800);

          if (beat % 2 === 0) {
            this.playTone(110, 'sine', 0.8, 0.15, 300); // low cello anchor
          }
          beat++;
        };
        playParlorPulse();
        this.musicInterval = window.setInterval(playParlorPulse, 950);
        break;
      }

      case 'trial': {
        // Courtroom drama: intense heart-beat pulse, high stakes minor chords, suspense
        let heartBeat = false;
        const playCourtTension = () => {
          if (!heartBeat) {
            this.playTone(55, 'sine', 0.28, 0.26, 200); // thump
            this.playTone(65.41, 'triangle', 0.22, 0.12, 350);
          } else {
            this.playTone(58.27, 'sine', 0.24, 0.20, 180); // second thump
            // occasional high tension chord
            if (Math.random() > 0.4) {
              this.playTone(440, 'triangle', 1.2, 0.08, 900);
              this.playTone(466.16, 'sawtooth', 0.9, 0.04, 700); // half-step dissonance
            }
          }
          heartBeat = !heartBeat;
        };
        playCourtTension();
        this.musicInterval = window.setInterval(playCourtTension, 650);
        break;
      }

      case 'dusk': {
        // Twilight transition: ethereal pads, calming yet anticipatory
        const duskNotes = [174.61, 196.00, 220.00, 261.63]; // F, G, A, C
        let i = 0;
        const playDusk = () => {
          const note = duskNotes[i % duskNotes.length];
          this.playTone(note, 'sine', 3.8, 0.10, 500);
          this.playTone(note * 1.498, 'sine', 3.2, 0.07, 700);
          i++;
        };
        playDusk();
        this.musicInterval = window.setInterval(playDusk, 2800);
        break;
      }

      case 'night': {
        // Nocturnal stealth: deep sub-bass drone, eerie quiet, shadows creeping
        let nStep = 0;
        const playNightStealth = () => {
          const subFreq = nStep % 2 === 0 ? 65.41 : 73.42; // C2 / D2
          this.playTone(subFreq, 'sine', 4.2, 0.20, 150); // deep stealth sub

          if (nStep % 3 === 0) {
            this.playTone(329.63, 'triangle', 1.8, 0.05, 400); // whisper chime
          }
          nStep++;
        };
        playNightStealth();
        this.musicInterval = window.setInterval(playNightStealth, 3200);
        break;
      }

      case 'game_over': {
        // Resolution: noble slow cadence
        const finaleChords = [146.83, 220, 293.66, 440];
        finaleChords.forEach((f, idx) => {
          setTimeout(() => {
            this.playTone(f, 'triangle', 4.0, 0.16, 750);
            this.playTone(f * 0.5, 'sine', 4.0, 0.22, 300);
          }, idx * 400);
        });
        break;
      }
    }
  }
}

export const soundEngine = new SoundEngine();
export type { MusicMood };
