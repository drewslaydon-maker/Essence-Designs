// Procedural Web Audio Synthesizer for Ball Break Simulator
// Works 100% offline, zero external asset dependencies, zero 404s

let audioCtx: AudioContext | null = null;
let masterSFXGain: GainNode | null = null;
let masterBGMGain: GainNode | null = null;
let isBgmRunning = false;
let bgmInterval: any = null;

let sfxVolume = 0.85;
let bgmVolume = 0.35;
let isMuted = false;

let tensionOsc: OscillatorNode | null = null;
let tensionGain: GainNode | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        masterSFXGain = audioCtx.createGain();
        masterBGMGain = audioCtx.createGain();

        masterSFXGain.gain.setValueAtTime(isMuted ? 0 : sfxVolume, audioCtx.currentTime);
        masterBGMGain.gain.setValueAtTime(isMuted ? 0 : bgmVolume, audioCtx.currentTime);

        masterSFXGain.connect(audioCtx.destination);
        masterBGMGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (err) {
    console.warn('Web Audio init error:', err);
    return null;
  }
}

export function unlockBallBreakAudio(): boolean {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  return !!ctx;
}

export function ensureAudioUnlocked(): AudioContext | null {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

export function initContinuousTension(): void {
  const ctx = ensureAudioUnlocked();
  if (!ctx || !masterSFXGain) return;
  try {
    if (tensionOsc) {
      try { tensionOsc.stop(); } catch {}
      tensionOsc.disconnect();
      tensionOsc = null;
    }
    if (tensionGain) {
      tensionGain.disconnect();
      tensionGain = null;
    }

    tensionOsc = ctx.createOscillator();
    tensionGain = ctx.createGain();
    tensionOsc.type = 'triangle';
    tensionGain.gain.setValueAtTime(0, ctx.currentTime);
    tensionOsc.connect(tensionGain);
    tensionGain.connect(masterSFXGain);
    tensionOsc.start();
  } catch (err) {
    console.warn('initContinuousTension error:', err);
  }
}

export function setContinuousTension(ratio: number): void {
  if (isMuted || sfxVolume <= 0) return;
  const ctx = ensureAudioUnlocked();
  if (!ctx || !tensionGain || !tensionOsc) {
    if (ratio > 0.05) {
      initContinuousTension();
    }
    return;
  }
  try {
    if (ratio <= 0.05) {
      tensionGain.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
    } else {
      const clampedRatio = Math.min(1.0, Math.max(0, ratio));
      const freq = 110 + clampedRatio * 330; // 110Hz -> 440Hz
      tensionOsc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.02);
      const targetGain = 0.28 * clampedRatio * sfxVolume;
      tensionGain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.02);
    }
  } catch {}
}

export function stopContinuousTension(): void {
  const ctx = getAudioContext();
  if (ctx && tensionGain) {
    try {
      tensionGain.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
    } catch {}
  }
}

export function playKineticRelease(power = 1.0): void {
  stopContinuousTension();
  if (isMuted || sfxVolume <= 0) return;
  const ctx = ensureAudioUnlocked();
  if (!ctx || !masterSFXGain) return;

  try {
    const t = ctx.currentTime;
    // 1. Sub-bass punch: 140Hz -> 32Hz
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startFreq = 140 * Math.min(1.4, Math.max(0.8, power));
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.11);

    gain.gain.setValueAtTime(0.7 * sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    osc.connect(gain);
    gain.connect(masterSFXGain);
    osc.start(t);
    osc.stop(t + 0.12);

    // 2. Highpassed noise snap transient
    const bufferSize = Math.floor(ctx.sampleRate * 0.025);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.28 * sfxVolume, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterSFXGain);
    noise.start(t);

    triggerHaptic('heavy');
  } catch {}
}

export function playKineticCancel(): void {
  stopContinuousTension();
  if (isMuted || sfxVolume <= 0) return;
  const ctx = ensureAudioUnlocked();
  if (!ctx || !masterSFXGain) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.07);
    gain.gain.setValueAtTime(0.2 * sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc.connect(gain);
    gain.connect(masterSFXGain);
    osc.start(t);
    osc.stop(t + 0.08);
  } catch {}
}

export function playKineticBounce(intensity = 1.0): void {
  if (isMuted || sfxVolume <= 0) return;
  const ctx = ensureAudioUnlocked();
  if (!ctx || !masterSFXGain) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startFreq = 220 + Math.min(intensity, 2.5) * 160;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.09);

    const vol = Math.min(0.45 * intensity, 0.55) * sfxVolume;
    gain.gain.setValueAtTime(Math.max(0.05, vol), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(gain);
    gain.connect(masterSFXGain);
    osc.start(t);
    osc.stop(t + 0.1);
  } catch {}
}

export function playAudioTestPing(): void {
  const ctx = ensureAudioUnlocked();
  if (!ctx || !masterSFXGain) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.setValueAtTime(783.99, t + 0.09); // G5

    gain.gain.setValueAtTime(0.35 * sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain);
    gain.connect(masterSFXGain);
    osc.start(t);
    osc.stop(t + 0.32);
  } catch {}
}

export function setSoundSettings(settings: { sfxVol?: number; bgmVol?: number; muted?: boolean }) {
  if (settings.sfxVol !== undefined) sfxVolume = Math.max(0, Math.min(1, settings.sfxVol));
  if (settings.bgmVol !== undefined) bgmVolume = Math.max(0, Math.min(1, settings.bgmVol));
  if (settings.muted !== undefined) isMuted = settings.muted;

  const ctx = getAudioContext();
  if (ctx && masterSFXGain && masterBGMGain) {
    masterSFXGain.gain.setTargetAtTime(isMuted ? 0 : sfxVolume, ctx.currentTime, 0.05);
    masterBGMGain.gain.setTargetAtTime(isMuted ? 0 : bgmVolume, ctx.currentTime, 0.05);
  }
}

export function getSoundSettings() {
  return { sfxVolume, bgmVolume, isMuted };
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'shatter' | 'subtier') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'light') navigator.vibrate(12);
      else if (type === 'medium') navigator.vibrate(28);
      else if (type === 'heavy') navigator.vibrate([45, 30, 60]);
      else if (type === 'shatter') navigator.vibrate([25, 20, 50]);
      else if (type === 'subtier') navigator.vibrate(18);
    } catch {}
  }
}

// 1. Slingshot Tension Pitch
export function playSlingshotTension(pullRatio: number) {
  if (isMuted || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx || !masterSFXGain) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Frequency ramps up smoothly as user drags further back
    const freq = 140 + pullRatio * 240;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12 * pullRatio, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(masterSFXGain);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {}
}

// 2. Slingshot Release
export function playSlingshotRelease(power: number) {
  if (isMuted || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx || !masterSFXGain) return;

  try {
    const now = ctx.currentTime;
    // Percussive elastic snap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420 * Math.min(1.5, Math.max(0.7, power)), now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(masterSFXGain);

    osc.start(now);
    osc.stop(now + 0.14);
    triggerHaptic('medium');
  } catch {}
}

// 3. Momentum Tier Shift
export function playTierShift(tier: number) {
  if (isMuted || sfxVolume <= 0 || tier <= 0) return;
  const ctx = getAudioContext();
  if (!ctx || !masterSFXGain) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = tier === 3 ? 'sawtooth' : 'sine';
    const freqs = [300, 523.25, 659.25, 880]; // C5, E5, A5
    const baseF = freqs[tier] || 523.25;

    osc.frequency.setValueAtTime(baseF * 0.85, now);
    osc.frequency.exponentialRampToValueAtTime(baseF * 1.3, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(masterSFXGain);

    osc.start(now);
    osc.stop(now + 0.24);
    triggerHaptic(tier === 3 ? 'heavy' : 'medium');
  } catch {}
}

// 4. Bumper Bounce
export function playBumperHit() {
  if (isMuted || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx || !masterSFXGain) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const notes = [659.25, 783.99, 880, 1046.5]; // E5, G5, A5, C6
    const f = notes[Math.floor(Math.random() * notes.length)];

    osc.frequency.setValueAtTime(f, now);
    osc.frequency.exponentialRampToValueAtTime(f * 1.25, now + 0.05);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(masterSFXGain);

    osc.start(now);
    osc.stop(now + 0.16);
    triggerHaptic('light');
  } catch {}
}

// 5. Speed Boost Strip
export function playSpeedBoost() {
  if (isMuted || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx || !masterSFXGain) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterSFXGain);

    osc.start(now);
    osc.stop(now + 0.25);
    triggerHaptic('medium');
  } catch {}
}

// 6. Obstacle Impact (Full Shatter vs Sub-Tier Crack)
export function playObstacleHit(material: 'glass' | 'wood' | 'stone', isDestroyed: boolean, crackCount: number) {
  if (isMuted || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx || !masterSFXGain) return;

  try {
    const now = ctx.currentTime;

    if (material === 'glass') {
      if (isDestroyed) {
        // Crystalline shatter burst
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const freq = 1200 + Math.random() * 1600;
          osc.frequency.setValueAtTime(freq, now + i * 0.02);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.18 + i * 0.02);

          gain.gain.setValueAtTime(0.22, now + i * 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22 + i * 0.02);

          osc.connect(gain);
          gain.connect(masterSFXGain);
          osc.start(now + i * 0.02);
          osc.stop(now + 0.24 + i * 0.02);
        }
        triggerHaptic('shatter');
      } else {
        // Glass stress crack tick
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800 + crackCount * 200, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.07);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(masterSFXGain);
        osc.start(now);
        osc.stop(now + 0.09);
        triggerHaptic('subtier');
      }
    } else if (material === 'wood') {
      if (isDestroyed) {
        // Snappy splintering crunch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.16);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, now);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterSFXGain);
        osc.start(now);
        osc.stop(now + 0.22);
        triggerHaptic('shatter');
      } else {
        // Wood fibrous crack
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240 + crackCount * 40, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(masterSFXGain);
        osc.start(now);
        osc.stop(now + 0.11);
        triggerHaptic('subtier');
      }
    } else if (material === 'stone') {
      if (isDestroyed) {
        // Seismic sub-bass boom + gravel pulverization
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.Q.setValueAtTime(3, now);

        gain.gain.setValueAtTime(0.48, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterSFXGain);
        osc.start(now);
        osc.stop(now + 0.42);
        triggerHaptic('heavy');
      } else {
        // Stone heavy thud & stress crack
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110 + crackCount * 25, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(masterSFXGain);
        osc.start(now);
        osc.stop(now + 0.15);
        triggerHaptic('subtier');
      }
    }
  } catch {}
}

// 7. Combo Jingle
export function playComboJingle(comboCount: number) {
  if (isMuted || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx || !masterSFXGain) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    const pitch = scale[Math.min(scale.length - 1, comboCount - 1)] || 523.25;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(masterSFXGain);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch {}
}

// 8. Stage Clear Fanfare
export function playStageClear() {
  if (isMuted || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx || !masterSFXGain) return;

  try {
    const chords = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    const now = ctx.currentTime;
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.001, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(masterSFXGain!);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.42);
    });
    triggerHaptic('heavy');
  } catch {}
}

// 9. Ball Drain Whoosh
export function playBallDrain() {
  if (isMuted || sfxVolume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx || !masterSFXGain) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.28);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(masterSFXGain);
    osc.start(now);
    osc.stop(now + 0.32);
  } catch {}
}

// 10. Procedural Ambient Cyber-Pinball BGM
export function startBGM() {
  if (isBgmRunning) return;
  const ctx = getAudioContext();
  if (!ctx || !masterBGMGain) return;

  isBgmRunning = true;
  let step = 0;
  // Bass arpeggio in D minor: D2, F2, A2, C3, D2, G2, A2, Bb2
  const notes = [73.42, 87.31, 110.0, 130.81, 73.42, 98.0, 110.0, 116.54];

  bgmInterval = setInterval(() => {
    if (!isBgmRunning || isMuted || bgmVolume <= 0) return;
    const currentCtx = getAudioContext();
    if (!currentCtx || !masterBGMGain) return;

    try {
      const now = currentCtx.currentTime;
      const osc = currentCtx.createOscillator();
      const gain = currentCtx.createGain();
      const filter = currentCtx.createBiquadFilter();

      const freq = notes[step % notes.length];
      step++;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260 + (step % 4) * 80, now);
      filter.Q.setValueAtTime(2, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterBGMGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }, 240); // ~125 BPM 8th-note pulse
}

export function stopBGM() {
  isBgmRunning = false;
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}
