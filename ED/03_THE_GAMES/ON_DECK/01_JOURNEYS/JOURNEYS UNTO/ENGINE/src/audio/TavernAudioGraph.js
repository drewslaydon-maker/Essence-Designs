/**
 * TavernAudioGraph.js
 * ESSENCE FL0W v0.1 • Journeys Top-Down RPG Engine
 * Module 3: State-Contact Web Audio Controller
 * 
 * Topology:
 * [BGM / Ambience Sources] -> [StageGains 1..4] -> [MasterGainNode] -> ctx.destination
 * [SFX Transients]         -> [SFXGainNode]     -> [MasterGainNode] -> ctx.destination
 * 
 * Invariants Enforced:
 * - AU-03 Invariant: Web Audio gain ramps must NEVER target <= 0.0 directly.
 *   Always clamp to >= 0.0001 safety floor to prevent RangeError:
 *   "The target value provided must be non-zero and positive".
 * - Stage 1 (Hearth): G1 = 1.0, warm low-passed chords.
 * - Stage 2 (Duel Crossfade): 1.2s linear transition to G1 = 0.3, G2 = 1.0.
 * - Stage 3 (Sudden Silence & Steps): Anti-pop decay to 0.0001 over 80ms, then zero; center-panned footstep with 1.8s tail.
 * - Stage 4 (Ambush Crash): Transient impact (<5ms); duck Master Gain by -6dB (0.501x) for 2000ms.
 */

export class TavernAudioGraph {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.stageGains = [null, null, null, null]; // 0-indexed for Stage 1..4
    this.currentStage = 1;
    this.initialized = false;
    this.bgmOscillators = [];
    this.musicTimer = null;
    this.stepIndex = 0;
    this.duelStepIndex = 0;
  }

  /**
   * Safe initialization upon first user gesture
   */
  ensureContext() {
    if (this.ctx && this.initialized) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;

      this.ctx = new AudioContextClass();

      // Master Gain Node (Generous headroom & clear volume)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Gain Node
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Stage Gain Nodes (1 to 4)
      for (let i = 0; i < 4; i++) {
        const stageGain = this.ctx.createGain();
        // Stage 1 starts at 0.9, others at 0.0001 (AU-03 safety floor)
        const initVal = (i === 0) ? 0.9 : 0.0001;
        stageGain.gain.setValueAtTime(initVal, this.ctx.currentTime);
        stageGain.connect(this.masterGain);
        this.stageGains[i] = stageGain;
      }

      this.startAmbientHearthLoop();
      this.startDuelMusicLoop();
      this.initialized = true;
      return this.ctx;
    } catch (e) {
      console.warn('[TavernAudioGraph] Web Audio init deferred or not supported:', e);
      return null;
    }
  }

  /**
   * AU-03 Invariant: Safe Exponential Ramp
   * Clamps target gain strictly to >= 0.0001 to prevent RangeError
   * @param {AudioParam} param AudioParam to automate
   * @param {number} targetValue Desired target gain
   * @param {number} durationSec Duration in seconds
   */
  static safeExponentialRamp(param, targetValue, durationSec, currentTime) {
    const safetyFloor = 0.0001;
    const clampedTarget = Math.max(safetyFloor, targetValue);
    const targetTime = currentTime + durationSec;

    // Prevent discontinuity: anchor current value first
    param.setValueAtTime(Math.max(safetyFloor, param.value), currentTime);
    param.exponentialRampToValueAtTime(clampedTarget, targetTime);

    // If caller intended exact 0.0, step to 0 immediately following the ramp
    if (targetValue <= 0.00001) {
      param.setValueAtTime(0.0, targetTime + 0.002);
    }
  }

  /**
   * Safe Linear Ramp
   */
  static safeLinearRamp(param, targetValue, durationSec, currentTime) {
    param.setValueAtTime(param.value, currentTime);
    param.linearRampToValueAtTime(targetValue, currentTime + durationSec);
  }

  /**
   * Transition Audio Topology to requested Stage
   * @param {number} stage 1, 2, 3, or 4
   */
  transitionToStage(stage) {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    this.currentStage = stage;

    switch (stage) {
      case 1: {
        // Stage 1 (Hearth): G1 = 1.0, G2..G4 -> 0.0001
        TavernAudioGraph.safeLinearRamp(this.stageGains[0].gain, 1.0, 0.8, now);
        TavernAudioGraph.safeExponentialRamp(this.stageGains[1].gain, 0.0001, 0.8, now);
        TavernAudioGraph.safeExponentialRamp(this.stageGains[2].gain, 0.0001, 0.8, now);
        TavernAudioGraph.safeExponentialRamp(this.stageGains[3].gain, 0.0001, 0.8, now);
        break;
      }

      case 2: {
        // Stage 2 (Duel Crossfade): 1.2s linear transition to G1 = 0.3, G2 = 1.0
        TavernAudioGraph.safeLinearRamp(this.stageGains[0].gain, 0.30, 1.2, now);
        TavernAudioGraph.safeLinearRamp(this.stageGains[1].gain, 1.00, 1.2, now);
        TavernAudioGraph.safeExponentialRamp(this.stageGains[2].gain, 0.0001, 0.5, now);
        TavernAudioGraph.safeExponentialRamp(this.stageGains[3].gain, 0.0001, 0.5, now);
        break;
      }

      case 3: {
        // Stage 3 (Sudden Silence & Steps): Anti-pop exponential decay down to safety floor (0.0001 over 80ms)
        TavernAudioGraph.safeExponentialRamp(this.stageGains[0].gain, 0.0001, 0.080, now);
        TavernAudioGraph.safeExponentialRamp(this.stageGains[1].gain, 0.0001, 0.080, now);
        TavernAudioGraph.safeLinearRamp(this.stageGains[2].gain, 1.00, 0.080, now);

        // Fire single center-panned wooden heel footstep with 1.8s reverb tail
        this.triggerFootstep(now + 0.100);
        break;
      }

      case 4: {
        // Stage 4 (Ambush Crash): Transient impact (<5ms); duck Master Gain by -6dB (0.501x) for 2000ms
        this.triggerAmbushCrash(now);
        break;
      }
    }
  }

  /**
   * Footstep with 1.8s decaying room reflection
   */
  triggerFootstep(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, time);

    gain.gain.setValueAtTime(0.7, time);
    TavernAudioGraph.safeExponentialRamp(gain.gain, 0.0001, 1.80, time);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.stageGains[2] || this.sfxGain);

    osc.start(time);
    osc.stop(time + 1.85);
  }

  /**
   * Ambush Crash with -6dB master gain ducking
   */
  triggerAmbushCrash(time) {
    if (!this.ctx) return;

    // 1. Duck Master Gain by -6dB (~0.501x) for 2000ms
    const currentMaster = this.masterGain.gain.value;
    const duckedMaster = currentMaster * 0.50118; // -6dB

    this.masterGain.gain.setValueAtTime(currentMaster, time);
    this.masterGain.gain.linearRampToValueAtTime(duckedMaster, time + 0.020);
    // Hold ducked for 2000ms then restore
    this.masterGain.gain.setValueAtTime(duckedMaster, time + 2.0);
    this.masterGain.gain.linearRampToValueAtTime(currentMaster, time + 2.5);

    // 2. High-energy splinter transient (<5ms rise time)
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 1.5, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.25));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const crashGain = this.ctx.createGain();
    crashGain.gain.setValueAtTime(0.0001, time);
    // <5ms transient attack
    crashGain.gain.linearRampToValueAtTime(1.0, time + 0.004);
    TavernAudioGraph.safeExponentialRamp(crashGain.gain, 0.0001, 1.4, time + 0.005);

    noiseSource.connect(crashGain);
    crashGain.connect(this.sfxGain);

    noiseSource.start(time);
    noiseSource.stop(time + 1.5);
  }

  /**
   * Warm Celtic tavern lute arpeggios & hearth ambience (Stage 1)
   */
  startAmbientHearthLoop() {
    if (!this.ctx) return;

    // 1. Subtle warm hearth drone (D2, A2)
    const droneRoot = 73.42; // D2
    const droneFifth = 110.0; // A2
    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    droneGain.connect(filter);
    filter.connect(this.stageGains[0]);

    [droneRoot, droneFifth].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.connect(droneGain);
      osc.start();
      this.bgmOscillators.push(osc);
    });

    // 2. Celtic Lute Pluck Progression (Dm -> Bb -> C -> Am / A7)
    // 6/8 lilting sea-shanty arpeggios
    const chords = [
      // Dm: D3, F3, A3, D4, F4, A3
      [146.83, 174.61, 220.00, 293.66, 349.23, 220.00],
      // Bb: Bb2, D3, F3, Bb3, D4, F3
      [116.54, 146.83, 174.61, 233.08, 293.66, 174.61],
      // C: C3, E3, G3, C4, E4, G3
      [130.81, 164.81, 196.00, 261.63, 329.63, 196.00],
      // A7: A2, E3, G3, A3, C#4, E3
      [110.00, 164.81, 196.00, 220.00, 277.18, 164.81],
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    const playLuteNote = () => {
      if (!this.ctx || this.ctx.state === 'closed') return;
      if (this.currentStage !== 1 && this.stageGains[0].gain.value < 0.01) return;

      try {
        const chord = chords[chordIdx];
        const freq = chord[noteIdx];
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const pluckGain = this.ctx.createGain();

        // Plucked nylon/wood lute timbre
        osc.type = noteIdx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const velocity = noteIdx === 0 ? 0.22 : 0.16;
        pluckGain.gain.setValueAtTime(0.0001, now);
        pluckGain.gain.linearRampToValueAtTime(velocity, now + 0.008);
        TavernAudioGraph.safeExponentialRamp(pluckGain.gain, 0.0001, 0.55, now + 0.01);

        osc.connect(pluckGain);
        pluckGain.connect(this.stageGains[0]);

        osc.start(now);
        osc.stop(now + 0.60);

        noteIdx = (noteIdx + 1) % chord.length;
        if (noteIdx === 0) {
          chordIdx = (chordIdx + 1) % chords.length;
        }
      } catch {}
    };

    // 6/8 beat every 260ms (~115 BPM)
    if (!this.musicTimer) {
      this.musicTimer = setInterval(playLuteNote, 260);
    }
  }

  /**
   * Fast Celtic drinking duel jig (Stage 2)
   */
  startDuelMusicLoop() {
    if (!this.ctx) return;

    // Upbeat 140 BPM Drinking Jig in D
    const jigNotes = [
      293.66, 329.63, 349.23, 293.66, 440.00, 392.00, 349.23, 329.63, // D4, E4, F4, D4, A4, G4, F4, E4
      293.66, 349.23, 440.00, 523.25, 587.33, 523.25, 440.00, 349.23, // D4, F4, A4, C5, D5, C5, A4, F4
    ];
    const bassNotes = [146.83, 220.00, 146.83, 220.00, 116.54, 174.61, 130.81, 196.00];

    let jigStep = 0;

    const playJigStep = () => {
      if (!this.ctx || this.ctx.state === 'closed') return;
      if (this.currentStage !== 2 && this.stageGains[1].gain.value < 0.01) return;

      try {
        const now = this.ctx.currentTime;
        const melodyFreq = jigNotes[jigStep % jigNotes.length];
        const bassFreq = bassNotes[Math.floor(jigStep / 2) % bassNotes.length];

        // Reed / Accordion Lead Synth
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'sawtooth';
        leadOsc.frequency.setValueAtTime(melodyFreq, now);

        const leadFilter = this.ctx.createBiquadFilter();
        leadFilter.type = 'lowpass';
        leadFilter.frequency.setValueAtTime(1100, now);

        leadGain.gain.setValueAtTime(0.0001, now);
        leadGain.gain.linearRampToValueAtTime(0.18, now + 0.005);
        TavernAudioGraph.safeExponentialRamp(leadGain.gain, 0.0001, 0.22, now + 0.006);

        leadOsc.connect(leadFilter);
        leadFilter.connect(leadGain);
        leadGain.connect(this.stageGains[1]);

        leadOsc.start(now);
        leadOsc.stop(now + 0.24);

        // Bouncy Tavern Bass (every alternate 8th note)
        if (jigStep % 2 === 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'triangle';
          bassOsc.frequency.setValueAtTime(bassFreq, now);

          bassGain.gain.setValueAtTime(0.0001, now);
          bassGain.gain.linearRampToValueAtTime(0.24, now + 0.006);
          TavernAudioGraph.safeExponentialRamp(bassGain.gain, 0.0001, 0.32, now + 0.01);

          bassOsc.connect(bassGain);
          bassGain.connect(this.stageGains[1]);

          bassOsc.start(now);
          bassOsc.stop(now + 0.34);
        }

        jigStep++;
      } catch {}
    };

    setInterval(playJigStep, 210); // 142 BPM jig
  }

  dispose() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.bgmOscillators.forEach((osc) => {
      try { osc.stop(); } catch {}
    });
    this.bgmOscillators = [];
    if (this.ctx && this.ctx.state !== 'closed') {
      try { this.ctx.close(); } catch {}
    }
  }
}
