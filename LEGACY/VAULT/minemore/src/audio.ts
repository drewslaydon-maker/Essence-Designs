// Pure Procedural Synthesized Web Audio Engine & Generative Subterranean Music
import { CavernTheme } from './types';

let audioCtx: AudioContext | null = null;
let isMuted = false;

// Generative Background Music Nodes
let musicMasterGain: GainNode | null = null;
let droneOscA: OscillatorNode | null = null;
let droneOscB: OscillatorNode | null = null;
let droneFilter: BiquadFilterNode | null = null;
let droneGain: GainNode | null = null;
let musicIntervalTimer: number | null = null;
let currentMusicTheme: CavernTheme | null = null;

export function initAudio() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (err) {
    console.warn('Web Audio initialization error:', err);
  }
}

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (musicMasterGain && audioCtx) {
    const now = audioCtx.currentTime;
    musicMasterGain.gain.setValueAtTime(muted ? 0 : 0.28, now);
  }
}

export function getIsMuted() {
  return isMuted;
}

// Play a single procedural sound effect
export function playAudio(
  type:
    | 'chip'
    | 'crack'
    | 'slag'
    | 'gem'
    | 'geode'
    | 'levelUp'
    | 'clear'
    | 'perkSelect'
    | 'shockwave'
    | 'cook'
    | 'paper'
    | 'footstep'
    | 'hatch'
    | 'eat'
    | 'rescue',
  pitch = 1
) {
  if (isMuted || !audioCtx) return;

  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'chip') {
      // Light pickaxe chisel tap (Hit 1)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'crack') {
      // Heavier fracture crack (Hit 2)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      gain.gain.setValueAtTime(0.65, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'slag') {
      // Dull crumbling slag (Hit 3)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.linearRampToValueAtTime(25, now + 0.22);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'gem') {
      // Pure crystalline sine chime (Hit 3)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.start(now);
      osc.stop(now + 0.85);
    } else if (type === 'geode') {
      // Celebratory geode cascade chime: A4, C#5, E5, A5, C#6
      [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
        if (!audioCtx) return;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(f, now + i * 0.07);
        g.gain.setValueAtTime(0.4, now + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);
        o.start(now + i * 0.07);
        o.stop(now + i * 0.07 + 0.45);
      });
    } else if (type === 'shockwave') {
      // Subterranean tremor boom
      osc.type = 'sine';
      osc.frequency.setValueAtTime(70, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'levelUp') {
      // Triumphant ascending arpeggio: C5, E5, G5, C6
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        if (!audioCtx) return;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, now + i * 0.09);
        g.gain.setValueAtTime(0.5, now + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.5);
        o.start(now + i * 0.09);
        o.stop(now + i * 0.09 + 0.5);
      });
    } else if (type === 'perkSelect') {
      // Resonant harmonic power chime
      [329.63, 493.88, 659.25].forEach((f, i) => {
        if (!audioCtx) return;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.35 / (i + 1), now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        o.start(now);
        o.stop(now + 0.6);
      });
    } else if (type === 'clear') {
      // Sparkling wall-cleared chime
      [659.25, 880.0, 987.77, 1318.51].forEach((f, i) => {
        if (!audioCtx) return;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(f, now + i * 0.07);
        g.gain.setValueAtTime(0.45, now + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.6);
        o.start(now + i * 0.07);
        o.stop(now + i * 0.07 + 0.6);
      });
    } else if (type === 'cook') {
      // Sizzling hot skillet pan sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(450, now + 0.15);
      osc.frequency.linearRampToValueAtTime(280, now + 0.4);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'paper') {
      // Rustling newspaper page turn
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(240, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'footstep') {
      // Mountain gravel footstep
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(75 * pitch, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.06);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'hatch') {
      // Heavy iron engine hatch
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.25);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'eat') {
      // Satisfying culinary bite & warm hum
      [261.63, 329.63, 392.0, 523.25].forEach((f, i) => {
        if (!audioCtx) return;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(f, now + i * 0.08);
        g.gain.setValueAtTime(0.35, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        o.start(now + i * 0.08);
        o.stop(now + i * 0.08 + 0.4);
      });
    } else if (type === 'rescue') {
      // Emotional rescue harmonic chord
      [220, 277.18, 329.63, 440, 554.37].forEach((f, i) => {
        if (!audioCtx) return;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(f, now + i * 0.06);
        g.gain.setValueAtTime(0.4, now + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.8);
        o.start(now + i * 0.06);
        o.stop(now + i * 0.06 + 0.8);
      });
    }
  } catch {
    // Silent fallback
  }
}

// ----------------------------------------------------
// Generative Subterranean Background Music Engine
// ----------------------------------------------------
export function startCavernMusic(theme: CavernTheme) {
  initAudio();
  if (!audioCtx) return;
  currentMusicTheme = theme;

  // Stop any previous active music nodes cleanly
  stopCavernMusic(false);

  try {
    const now = audioCtx.currentTime;

    // Master music gain node
    musicMasterGain = audioCtx.createGain();
    musicMasterGain.gain.setValueAtTime(isMuted ? 0 : 0.28, now);
    musicMasterGain.connect(audioCtx.destination);

    // Filtered subterranean ambient drone
    droneFilter = audioCtx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(theme.musicTone === 'volcanic' ? 260 : 380, now);
    droneFilter.connect(musicMasterGain);

    droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.12, now);
    droneGain.connect(droneFilter);

    // Root drone oscillator
    const rootFreq = theme.musicalScale[0] / 2; // Deep octave
    droneOscA = audioCtx.createOscillator();
    droneOscA.type = theme.musicTone === 'volcanic' ? 'sawtooth' : 'triangle';
    droneOscA.frequency.setValueAtTime(rootFreq, now);
    droneOscA.connect(droneGain);
    droneOscA.start(now);

    // Fifth overtone drone
    droneOscB = audioCtx.createOscillator();
    droneOscB.type = 'sine';
    droneOscB.frequency.setValueAtTime(rootFreq * 1.5, now);
    droneOscB.connect(droneGain);
    droneOscB.start(now);

    // Generative Mineral Chime Sequence
    const scheduleNextChime = () => {
      if (!audioCtx || !musicMasterGain || !currentMusicTheme) return;

      try {
        const time = audioCtx.currentTime;
        const scale = currentMusicTheme.musicalScale;
        const noteFreq = scale[Math.floor(Math.random() * scale.length)];

        const chimeOsc = audioCtx.createOscillator();
        const chimeGain = audioCtx.createGain();
        chimeOsc.connect(chimeGain);
        chimeGain.connect(musicMasterGain);

        chimeOsc.type = currentMusicTheme.musicTone === 'crystal' ? 'triangle' : 'sine';
        chimeOsc.frequency.setValueAtTime(noteFreq, time);

        // Gentle resonant water-drop/crystal chime envelope
        chimeGain.gain.setValueAtTime(0.09, time);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, time + 1.6);

        chimeOsc.start(time);
        chimeOsc.stop(time + 1.6);
      } catch {
        // Silent fallback
      }

      // Variable interval between chimes (1.8s to 3.6s)
      const nextDelay = 1800 + Math.random() * 1800;
      musicIntervalTimer = window.setTimeout(scheduleNextChime, nextDelay);
    };

    musicIntervalTimer = window.setTimeout(scheduleNextChime, 1500);
  } catch (err) {
    console.warn('Cavern music initialization failed:', err);
  }
}

export function stopCavernMusic(resetTheme = true) {
  if (musicIntervalTimer !== null) {
    window.clearTimeout(musicIntervalTimer);
    musicIntervalTimer = null;
  }

  if (droneOscA) {
    try {
      droneOscA.stop();
      droneOscA.disconnect();
    } catch {}
    droneOscA = null;
  }
  if (droneOscB) {
    try {
      droneOscB.stop();
      droneOscB.disconnect();
    } catch {}
    droneOscB = null;
  }
  if (musicMasterGain) {
    try {
      musicMasterGain.disconnect();
    } catch {}
    musicMasterGain = null;
  }

  if (resetTheme) {
    currentMusicTheme = null;
  }
}
