import React, { useState } from 'react';
import { CharacterProfile, MinerClassType, MinerAppearance } from '../types';
import { playAudio } from '../audio';
import {
  Pickaxe,
  Dices,
  Shield,
  Sparkles,
  Zap,
  RefreshCw,
  Compass,
  Check,
  ChevronRight,
  User,
} from 'lucide-react';

interface CharacterCreatorModalProps {
  initialProfile?: CharacterProfile | null;
  onSaveProfile: (profile: CharacterProfile) => void;
  canCancel?: boolean;
  onCancel?: () => void;
}

const RANDOM_NAMES = [
  'Garrick Ironpick',
  'Lyra Goldvein',
  'Torin Deepforge',
  'Bram Emberstone',
  'Vala Sunshard',
  'Kael Rockstrider',
  'Doran Boulderfist',
  'Sylas Skystone',
  'Bruna Quartzheart',
  'Morrigan Flint',
];

const CLASS_OPTIONS: {
  type: MinerClassType;
  name: string;
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  bonus: string;
}[] = [
  {
    type: 'deep_delver',
    name: 'Deep Delver',
    role: 'Stamina & Endurance',
    icon: Shield,
    description: 'A resilient subterranean explorer with decades of bedrock digging experience.',
    bonus: '+4 Starting strikes on every cavern wall & bonus shock resistance.',
  },
  {
    type: 'gemologist',
    name: 'Gemologist',
    role: 'Lapidary & Fortune',
    icon: Sparkles,
    description: 'An artisan trained in uncovering pristine crystal geometries without fracturing them.',
    bonus: '+35% bonus XP from all recovered gemstones & higher rare gem frequency.',
  },
  {
    type: 'resonance_mystic',
    name: 'Resonance Mystic',
    role: 'Geode Resonance',
    icon: Zap,
    description: 'Attuned to deep seismic vibrations and acoustic geode frequencies.',
    bonus: 'Echo Geodes grant +3 extra cascade strikes and release acoustic shockwaves.',
  },
  {
    type: 'tunnel_scavenger',
    name: 'Tunnel Scavenger',
    role: 'Bedrock Salvage',
    icon: RefreshCw,
    description: 'A resourceful survivor who turns ordinary subterranean slag into usable stamina.',
    bonus: 'Shattering slag yields +20 XP and has a 35% chance to refund 1 strike.',
  },
];

const HELMET_STYLES: { id: MinerAppearance['helmet']; label: string }[] = [
  { id: 'classic', label: 'Lantern Hardhat' },
  { id: 'horned', label: 'Horned Deep Helm' },
  { id: 'goggles', label: 'Prospector Goggles' },
  { id: 'circlet', label: 'Crystalline Circlet' },
];

const ACCENT_COLORS = [
  { hex: '#f59e0b', name: 'Amber Gold' },
  { hex: '#ef4444', name: 'Pyre Ruby' },
  { hex: '#10b981', name: 'Jade Emerald' },
  { hex: '#38bdf8', name: 'Abyssal Cyan' },
  { hex: '#a855f7', name: 'Astral Amethyst' },
];

const BEARD_STYLES: { id: MinerAppearance['beardStyle']; label: string }[] = [
  { id: 'clean', label: 'Clean Shaven' },
  { id: 'stout', label: 'Stout Beard' },
  { id: 'braided', label: 'Braided Dwarven' },
  { id: 'visor', label: 'Protective Visor' },
];

const PICKAXE_STYLES: { id: MinerAppearance['pickaxeStyle']; label: string }[] = [
  { id: 'iron', label: 'Standard Mattock' },
  { id: 'obsidian', label: 'Obsidian Hew' },
  { id: 'dwarven', label: 'War-Pick' },
  { id: 'crystal', label: 'Resonant Chisel' },
];

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({
  initialProfile,
  onSaveProfile,
  canCancel = false,
  onCancel,
}) => {
  const [name, setName] = useState(
    initialProfile?.name || RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]
  );
  const [minerClass, setMinerClass] = useState<MinerClassType>(
    initialProfile?.minerClass || 'deep_delver'
  );
  const [appearance, setAppearance] = useState<MinerAppearance>(
    initialProfile?.appearance || {
      helmet: 'classic',
      accentColor: '#f59e0b',
      beardStyle: 'stout',
      pickaxeStyle: 'iron',
    }
  );

  const randomizeName = () => {
    const next = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    setName(next);
    playAudio('chip', 1.2);
  };

  const handleSave = () => {
    playAudio('perkSelect');
    const profile: CharacterProfile = {
      id: initialProfile?.id || `miner-${Date.now()}`,
      name: name.trim() || 'Daring Miner',
      minerClass,
      appearance,
      createdAt: initialProfile?.createdAt || Date.now(),
    };
    onSaveProfile(profile);
  };

  const selectedClassDef = CLASS_OPTIONS.find((c) => c.type === minerClass)!;

  return (
    <div
      id="character-creator-overlay"
      className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col items-center p-2.5 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="max-w-2xl w-full bg-stone-900/90 border border-stone-800 p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col gap-4 sm:gap-6 my-auto">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold tracking-wider uppercase mb-1">
            <User className="w-3.5 h-3.5" />
            Character Creation
          </div>
          <h2
            id="character-creator-heading"
            className="text-xl sm:text-3xl font-black tracking-wide text-amber-400 font-serif"
          >
            FORGE YOUR MINER
          </h2>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Customize your prospector identity, background specialization, and gear before embarking into the deep earth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column: Portrait & Badge Preview */}
          <div className="md:col-span-5 flex flex-col items-center gap-3 bg-stone-950/80 p-5 rounded-xl border border-stone-800 text-center">
            {/* Visual Portrait */}
            <div
              className="relative w-28 h-28 rounded-2xl flex items-center justify-center border-2 shadow-xl transition-all duration-300"
              style={{
                borderColor: appearance.accentColor,
                backgroundColor: `${appearance.accentColor}15`,
                boxShadow: `0 0 24px ${appearance.accentColor}30`,
              }}
            >
              {/* Miner Helmet & Figure Rendering */}
              <div className="relative flex flex-col items-center">
                {/* Helmet / Lantern */}
                <div
                  className="w-12 h-6 rounded-t-xl border border-stone-600 flex items-center justify-center relative"
                  style={{ backgroundColor: appearance.accentColor }}
                >
                  <div className="w-3 h-3 rounded-full bg-amber-200 shadow-[0_0_8px_#fef08a] animate-pulse" />
                </div>
                {/* Face & Visor */}
                <div className="w-10 h-7 bg-stone-700 rounded-b-md flex flex-col items-center justify-center px-1 border-t border-stone-800">
                  {appearance.beardStyle === 'visor' ? (
                    <div className="w-8 h-2 bg-cyan-400/80 rounded-sm shadow-[0_0_6px_#22d3ee]" />
                  ) : (
                    <div className="flex gap-1.5 pt-0.5">
                      <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
                    </div>
                  )}
                  {appearance.beardStyle === 'stout' && (
                    <div className="w-8 h-3 bg-stone-600 rounded-b-md mt-0.5" />
                  )}
                  {appearance.beardStyle === 'braided' && (
                    <div className="w-6 h-4 bg-stone-500 rounded-b-lg mt-0.5 border-t border-stone-600" />
                  )}
                </div>
                {/* Pickaxe Tool Beside */}
                <Pickaxe
                  className="w-5 h-5 absolute -right-4 -bottom-1 transform rotate-12"
                  style={{ color: appearance.accentColor }}
                />
              </div>
            </div>

            {/* Name & Class Display */}
            <div className="space-y-0.5">
              <h3 className="font-serif font-black text-lg text-stone-100 tracking-wide">
                {name || 'Nameless Delver'}
              </h3>
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block"
                style={{
                  color: appearance.accentColor,
                  borderColor: `${appearance.accentColor}50`,
                  backgroundColor: `${appearance.accentColor}15`,
                }}
              >
                {selectedClassDef.name}
              </span>
            </div>

            {/* Trait Summary */}
            <div className="w-full text-left bg-stone-900/90 p-3 rounded-lg border border-stone-800/80 text-xs space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 font-bold">
                Specialization Trait:
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                {selectedClassDef.bonus}
              </p>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="md:col-span-7 space-y-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="miner-name-input"
                className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider block text-left"
              >
                Prospector Name
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="miner-name-input"
                  type="text"
                  maxLength={24}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter prospector name..."
                  className="flex-1 bg-stone-950 border border-stone-700 rounded-lg px-3.5 py-2 text-stone-100 font-sans text-sm focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={randomizeName}
                  title="Randomize Name"
                  className="p-2.5 bg-stone-800 hover:bg-stone-750 text-amber-400 border border-stone-700 rounded-lg cursor-pointer transition-all active:scale-95"
                >
                  <Dices className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Class Selection */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider block">
                Miner Background Archetype
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CLASS_OPTIONS.map((c) => {
                  const isSelected = minerClass === c.type;
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.type}
                      type="button"
                      onClick={() => {
                        setMinerClass(c.type);
                        playAudio('chip', 1);
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 text-stone-100 ring-1 ring-amber-400/40'
                          : 'bg-stone-950/80 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-stone-100">
                          {c.name}
                        </span>
                        <Icon
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-amber-400' : 'text-stone-500'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono leading-tight">
                        {c.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Customizations: Color & Styles */}
            <div className="space-y-3 pt-1 text-left">
              {/* Accent Color */}
              <div>
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Gear Luminescence Accent
                </span>
                <div className="flex items-center gap-2">
                  {ACCENT_COLORS.map((col) => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => {
                        setAppearance((prev) => ({ ...prev, accentColor: col.hex }));
                        playAudio('chip', 1.3);
                      }}
                      className={`w-7 h-7 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                        appearance.accentColor === col.hex
                          ? 'ring-2 ring-white scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {appearance.accentColor === col.hex && (
                        <Check className="w-3.5 h-3.5 text-stone-950 font-bold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Helmet & Pickaxe Grids */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                    Headgear
                  </span>
                  <select
                    value={appearance.helmet}
                    onChange={(e) =>
                      setAppearance((p) => ({
                        ...p,
                        helmet: e.target.value as MinerAppearance['helmet'],
                      }))
                    }
                    className="w-full bg-stone-950 border border-stone-750 text-stone-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-400"
                  >
                    {HELMET_STYLES.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                    Pickaxe Archetype
                  </span>
                  <select
                    value={appearance.pickaxeStyle}
                    onChange={(e) =>
                      setAppearance((p) => ({
                        ...p,
                        pickaxeStyle: e.target.value as MinerAppearance['pickaxeStyle'],
                      }))
                    }
                    className="w-full bg-stone-950 border border-stone-750 text-stone-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-400"
                  >
                    {PICKAXE_STYLES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-3 pt-2">
          {canCancel && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-3.5 px-5 rounded-xl border border-stone-700 bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs font-mono uppercase font-bold cursor-pointer transition-all"
            >
              Cancel
            </button>
          )}
          <button
            id="embark-btn"
            type="button"
            onClick={handleSave}
            className="flex-1 py-3.5 px-6 font-bold tracking-wider uppercase text-stone-950 bg-amber-500 hover:bg-amber-400 active:scale-98 transition-all rounded-xl shadow-[0_4px_16px_rgba(217,119,6,0.35)] cursor-pointer flex items-center justify-center gap-2 text-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Embark On Cavern Delve</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
