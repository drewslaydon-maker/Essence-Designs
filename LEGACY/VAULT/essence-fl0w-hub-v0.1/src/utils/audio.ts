// Procedural Web Audio synthesizer for celestial chimes, rune resonances, and Deltarune dialogue voice blips
let audioCtx: AudioContext | null = null;
let isAudioEnabled = false;

export function toggleAudioState(enabled?: boolean): boolean {
  if (enabled !== undefined) {
    isAudioEnabled = enabled;
  } else {
    isAudioEnabled = !isAudioEnabled;
  }
  if (isAudioEnabled) {
    unlockAudio();
  }
  return isAudioEnabled;
}

export function getAudioState(): boolean {
  return isAudioEnabled;
}

export function unlockAudio(): AudioContext | null {
  isAudioEnabled = true;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function getAudioContext(): AudioContext | null {
  if (!isAudioEnabled) return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Deltarune-style Procedural Character Speech Voice Blip
 * Synthesizes unique retro chiptune bleeps/chirps based on speaker archetype.
 */
export function playDialogueBlip(speaker: string = 'Narrator', char: string = 'a') {
  if (!char || char.trim() === '') return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const speakerLower = speaker.toLowerCase();

    const isVowel = /[aeiouyAEIOUY]/.test(char);
    const isPunctuation = /[!?.]/.test(char);
    const charMod = (char.charCodeAt(0) % 7) - 3;
    const vowelPitchMultiplier = isVowel ? 1.08 : isPunctuation ? 1.15 : 1.0;

    if (speakerLower.includes('bozog')) {
      // Bozog the Berserker: Stout, deep chest-bark, gruff brawler (square wave with punchy downward scoop)
      osc.type = 'square';
      const baseFreq = (94 + charMod * 2) * vowelPitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq * 1.22, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, baseFreq * 0.88), now + 0.048);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, now);
      filter.Q.setValueAtTime(1.8, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (speakerLower.includes('atreyu')) {
      // Atreyu (High Moon Priest): Luminous, crystalline celestial sine tone with serene starlight glissando
      osc.type = 'sine';
      const baseFreq = (495 + charMod * 6) * vowelPitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq * 0.94, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.06, now + 0.045);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 1.5, now);
      filter.Q.setValueAtTime(1.0, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.058);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (speakerLower.includes('kairon')) {
      // Kairon the Eternal: Flamboyant bardic lute overdrive, raspy resonant bandpass harmonic
      osc.type = 'sawtooth';
      const baseFreq = (215 + charMod * 4) * vowelPitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(880 + (isVowel ? 120 : 0), now);
      filter.Q.setValueAtTime(3.4, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.046);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (speakerLower.includes('matchstick')) {
      // Matchstick: Whisper-thin, razor-sharp pocket mirror tick / refraction chirp
      osc.type = 'triangle';
      const baseFreq = (940 + charMod * 18) * vowelPitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, now);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(700, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.026);
    } else if (speakerLower.includes('knight') || speakerLower.includes('black knight')) {
      // Black Knights: Clattering iron plate armor resonance, deep authoritarian dread drone
      osc.type = 'sawtooth';
      const baseFreq = (78 + charMod * 2) * vowelPitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);
      filter.Q.setValueAtTime(2.2, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (speakerLower.includes('patron') || speakerLower.includes('docker') || speakerLower.includes('citizen')) {
      // Delain Tavern Patron: Warm, bubbly mid-range tavern mumbling
      osc.type = 'triangle';
      const baseFreq = (180 + charMod * 5) * vowelPitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } else {
      // Narrator / World / System: Crisp retro text blip (Undertale/Deltarune style)
      osc.type = 'triangle';
      const baseFreq = (360 + charMod * 8) * vowelPitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.13, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.034);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.038);
    }
  } catch {
    // Web Audio non-blocking
  }
}

// Play a celestial chime at specific frequency with exponential starlight decay
export function playCelestialChime(freq: number = 528, type: OscillatorType = 'sine', duration: number = 0.8) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
  } catch (e) {
    // Audio failures should never block UI
    console.debug('Audio error', e);
  }
}

export function playRuneCastSound() {
  playCelestialChime(659.25, 'sine', 0.6); // E5
  setTimeout(() => playCelestialChime(880.0, 'triangle', 0.8), 120); // A5
}

export function playDispatchSound() {
  playCelestialChime(440, 'triangle', 0.4);
  setTimeout(() => playCelestialChime(554.37, 'sine', 0.5), 90);
  setTimeout(() => playCelestialChime(659.25, 'sine', 0.7), 180);
}

export function playPurifySound() {
  playCelestialChime(784.0, 'sine', 0.5); // G5
  setTimeout(() => playCelestialChime(1046.5, 'sine', 0.9), 150); // C6
}
