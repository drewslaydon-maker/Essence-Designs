import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';

export function AudioAtmosphere() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'shrine' | 'nirnroot' | 'chimes'>('shrine');
  const [volume, setVolume] = useState(0.2);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscNodesRef = useRef<OscillatorNode[]>([]);
  const intervalRef = useRef<number | null>(null);

  const stopAudio = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    oscNodesRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // already stopped
      }
    });
    oscNodesRef.current = [];
  };

  const startShrineDrone = (ctx: AudioContext, masterGain: GainNode) => {
    // Low harmonic root and fifth (Velothi temple drone)
    const baseFreqs = [110, 164.81, 220, 329.63]; // A2, E3, A3, E4
    const oscs: OscillatorNode[] = [];

    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Add gentle detune modulation for sacred reverberation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.1 + idx * 0.05, ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();
      oscs.push(lfo);

      oscGain.gain.setValueAtTime(0.08 / (idx + 1), ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start();
      oscs.push(osc);
    });

    oscNodesRef.current = oscs;
  };

  const startNirnrootChime = (ctx: AudioContext, masterGain: GainNode) => {
    // High crystalline sine waves mimicking the Nirnroot harmonic shimmer
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5

    lfo.frequency.setValueAtTime(4.5, ctx.currentTime); // 4.5Hz vibrato
    lfoGain.gain.setValueAtTime(20, ctx.currentTime);
    lfo.connect(osc.frequency);
    lfo.start();

    noteGain.gain.setValueAtTime(0.05, ctx.currentTime);
    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start();
    oscNodesRef.current = [osc, lfo];
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
        if (mode === 'shrine') {
          startShrineDrone(audioCtxRef.current, gainNodeRef.current);
        } else {
          startNirnrootChime(audioCtxRef.current, gainNodeRef.current);
        }
      }

      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying && gainNodeRef.current && audioCtxRef.current) {
      stopAudio();
      if (mode === 'shrine') {
        startShrineDrone(audioCtxRef.current, gainNodeRef.current);
      } else {
        startNirnrootChime(audioCtxRef.current, gainNodeRef.current);
      }
    }
  }, [mode]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="flex items-center gap-3 bg-[#13141d] px-3.5 py-2 rounded-xl border border-[#262938] shadow-inner text-xs">
      <button
        onClick={togglePlayback}
        className={`p-2 rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
          isPlaying
            ? 'bg-[#c8983e] text-[#121008] shadow'
            : 'bg-[#1b1d29] text-[#8c887e] hover:text-[#f4efe6]'
        }`}
        title={isPlaying ? 'Mute Atmosphere' : 'Play Ambient Drone'}
      >
        {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        <span className="hidden sm:inline">{isPlaying ? 'Atmosphere On' : 'Elder Drone'}</span>
      </button>

      {isPlaying && (
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'shrine' | 'nirnroot')}
            className="bg-[#1b1d29] border border-[#2e3245] text-[#cbd5e1] text-xs rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="shrine">Velothi Shrine Drone</option>
            <option value="nirnroot">Nirnroot Shimmer</option>
          </select>

          <input
            type="range"
            min="0.05"
            max="0.4"
            step="0.02"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 accent-[#c8983e] cursor-pointer"
            title="Volume"
          />
        </div>
      )}
    </div>
  );
}
