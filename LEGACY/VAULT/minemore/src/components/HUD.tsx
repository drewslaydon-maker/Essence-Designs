import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Pickaxe,
  Award,
  Layers,
  User,
  ShieldAlert,
  Brain,
  Flame,
  Home,
  BookOpen,
  MoreVertical,
  X,
} from 'lucide-react';
import { CavernTheme, CharacterProfile, ActiveCulinaryBuff } from '../types';
import { getRankTitle } from '../data/gems';

interface HUDProps {
  strikes: number;
  sector: number; // e.g. 1, 2, 3
  shaftInSector: number; // 1, 2, 3
  cavernTheme: CavernTheme;
  character: CharacterProfile;
  playerLevel: number;
  currentXp: number;
  xpToNextLevel: number;
  pendingPerkChoices: number;
  activePerkCount: number;
  vaultDiscoveredCount: number;
  vaultTotalCount: number;
  playerSanity: number;
  playerFatigue: number;
  activeBuffs: ActiveCulinaryBuff[];
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenVault: () => void;
  onOpenPerks: () => void;
  onOpenCharacterSheet: () => void;
  onOpenDigger: () => void;
  onReturnToTown: () => void;
  onOpenNewspaper: () => void;
  isGameActive: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  strikes,
  sector,
  shaftInSector,
  cavernTheme,
  character,
  playerLevel,
  currentXp,
  xpToNextLevel,
  pendingPerkChoices,
  activePerkCount,
  vaultDiscoveredCount,
  vaultTotalCount,
  playerSanity,
  playerFatigue,
  activeBuffs,
  isMuted,
  onToggleMute,
  onOpenVault,
  onOpenPerks,
  onOpenCharacterSheet,
  onOpenDigger,
  onReturnToTown,
  onOpenNewspaper,
  isGameActive,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  if (!isGameActive) return null;

  const xpPercent = Math.min(100, Math.max(0, (currentXp / Math.max(1, xpToNextLevel)) * 100));
  const rankTitle = getRankTitle(playerLevel);

  return (
    <header
      id="hud-bar"
      className="absolute top-0 left-0 right-0 z-20 pointer-events-none flex flex-col"
    >
      {/* Sleek top XP progress indicator line (visible across all screen sizes) */}
      <div className="w-full h-1 bg-stone-900 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
          style={{ width: `${xpPercent}%` }}
        />
      </div>

      {/* ========================================================= */}
      {/* MOBILE COMPACT HUD (Screen < 640px)                      */}
      {/* ========================================================= */}
      <div className="flex sm:hidden items-center justify-between px-2.5 py-2 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 pointer-events-auto">
        {/* Left: Essential Delver Vitals */}
        <div className="flex items-center gap-1.5">
          {/* Strikes Counter */}
          <div
            id="mobile-strikes-badge"
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
              strikes <= 3
                ? 'bg-red-950/90 border-red-500 text-red-200 animate-pulse'
                : 'bg-stone-900 border-stone-750 text-stone-200'
            }`}
          >
            <Pickaxe className={`w-3.5 h-3.5 ${strikes <= 3 ? 'text-red-400' : 'text-amber-400'}`} />
            <span
              className={`text-xs font-mono font-black ${
                strikes <= 3 ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              {strikes}
            </span>
          </div>

          {/* Depth Indicator */}
          <div
            id="mobile-depth-badge"
            className="px-2 py-1 rounded-lg border border-stone-800 bg-stone-900/80 flex items-center gap-1.5 text-[11px] font-mono text-amber-300 font-bold"
          >
            <Layers className="w-3 h-3 text-amber-400" />
            <span>{sector}-{shaftInSector}</span>
            <div className="flex items-center gap-0.5 ml-0.5">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-1.5 h-1.5 rounded-full ${
                    step < shaftInSector
                      ? 'bg-emerald-400'
                      : step === shaftInSector
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-stone-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sanity / Meal Icon */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-800 bg-stone-900/80 text-[11px] font-mono"
            title={`Sanity: ${playerSanity}%`}
          >
            <Brain
              className={`w-3 h-3 ${
                playerSanity < 40 ? 'text-purple-400 animate-pulse' : 'text-purple-400'
              }`}
            />
            <span
              className={`font-bold ${
                playerSanity < 40 ? 'text-purple-300 animate-pulse' : 'text-stone-300'
              }`}
            >
              {playerSanity}%
            </span>
          </div>
        </div>

        {/* Right: Quick Delve Actions */}
        <div className="flex items-center gap-1.5">
          {/* Digger Rig Button */}
          <button
            id="mobile-digger-btn"
            type="button"
            onClick={onOpenDigger}
            className="p-1.5 bg-amber-600 active:bg-amber-500 text-stone-950 rounded-lg font-bold flex items-center gap-1 shadow cursor-pointer text-xs"
            title="The Digger Rig"
          >
            <Flame className="w-4 h-4" />
            <span className="font-mono text-[11px] font-bold">Rig</span>
          </button>

          {/* Vault Button */}
          <button
            id="mobile-vault-btn"
            type="button"
            onClick={onOpenVault}
            className="p-1.5 bg-stone-900 active:bg-stone-800 text-amber-300 rounded-lg border border-amber-500/40 flex items-center gap-1 text-xs cursor-pointer"
            title="Velvet Vault"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[10px]">{vaultDiscoveredCount}</span>
          </button>

          {/* Talents / Perk Button */}
          <button
            id="mobile-talents-btn"
            type="button"
            onClick={onOpenPerks}
            className={`p-1.5 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
              pendingPerkChoices > 0
                ? 'bg-amber-500 text-stone-950 border-amber-300 animate-bounce'
                : 'bg-stone-900 text-stone-300 border-stone-800'
            }`}
            title="Miner Talents"
          >
            <Award className="w-4 h-4" />
            {pendingPerkChoices > 0 && (
              <span className="bg-stone-950 text-amber-300 text-[9px] font-mono font-bold px-1 rounded-full">
                !
              </span>
            )}
          </button>

          {/* More Menu Dropdown Toggle */}
          <button
            id="mobile-more-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 bg-stone-900 active:bg-stone-800 text-stone-300 rounded-lg border border-stone-800 cursor-pointer"
            title="More Options"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Quick Options Panel */}
      {isMobileMenuOpen && (
        <div
          id="mobile-hud-drawer"
          className="sm:hidden w-full bg-stone-950/95 border-b border-stone-800 p-3 flex flex-col gap-2.5 pointer-events-auto backdrop-blur-md shadow-2xl animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-850 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-stone-300 font-bold">{character.name}</span>
              <span className="text-amber-400 text-[10px]">Lv.{playerLevel} {rankTitle}</span>
            </div>
            <span className="text-stone-400 text-[10px]">{cavernTheme.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onReturnToTown();
              }}
              className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-lg border border-stone-750 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>Surface Town</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenNewspaper();
              }}
              className="py-2 px-3 bg-[#f5efe1] text-stone-900 rounded-lg font-serif font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-900" />
              <span>Gazette</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCharacterSheet();
              }}
              className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-lg border border-stone-750 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Miner Profile</span>
            </button>

            <button
              onClick={onToggleMute}
              className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-lg border border-stone-750 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span>Unmute Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mute Audio</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DESKTOP HUD (Screen >= 640px)                             */}
      {/* ========================================================= */}
      <div className="hidden sm:flex flex-col gap-2 p-3">
        {/* Primary Top Row */}
        <div className="flex items-center justify-between w-full gap-2">
          {/* Left: Miner Profile & Strikes & Sector Tracker */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Miner Profile Pill */}
            <button
              id="hud-miner-profile-btn"
              type="button"
              onClick={onOpenCharacterSheet}
              className="bg-stone-900/90 hover:bg-stone-850 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-stone-750 hover:border-amber-400/60 shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95 text-left"
              title="View Miner Profile & Appearance"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center border text-xs font-bold font-mono shrink-0"
                style={{
                  backgroundColor: `${character.appearance.accentColor}20`,
                  borderColor: character.appearance.accentColor,
                  color: character.appearance.accentColor,
                }}
              >
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-stone-100 font-serif leading-none">
                  {character.name}
                </span>
                <span className="text-[10px] text-amber-400/90 font-mono font-semibold uppercase leading-tight">
                  Lv.{playerLevel} {rankTitle}
                </span>
              </div>
            </button>

            {/* Strikes Status Counter */}
            <div
              id="hud-strikes-panel"
              className={`px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-lg flex items-center gap-2 transition-all ${
                strikes <= 3
                  ? 'bg-red-950/80 border-red-500/80 text-red-200 animate-pulse'
                  : 'bg-stone-900/90 border-stone-750 text-stone-300'
              }`}
            >
              <Pickaxe className={`w-4 h-4 ${strikes <= 3 ? 'text-red-400' : 'text-amber-400'}`} />
              <span className="text-[11px] uppercase font-bold text-stone-400 font-mono">
                Strikes:
              </span>
              <span
                className={`text-sm font-mono font-black ${
                  strikes <= 3 ? 'text-red-400' : 'text-amber-400'
                }`}
              >
                {strikes}
              </span>
              <span className="text-[10px] text-stone-400 font-mono hidden md:inline">
                (3 taps / rock)
              </span>
            </div>

            {/* Sector & Shaft Tracker (X-1, X-2, X-3) */}
            <div
              id="hud-mines-tracker"
              className="bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-750 shadow-lg flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300/90 font-bold">
                    Depth {sector}-{shaftInSector}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    (Shaft {shaftInSector}/3)
                  </span>
                </div>
              </div>

              {/* Visual 3-shaft pips */}
              <div className="flex items-center gap-1 ml-1">
                {[1, 2, 3].map((step) => {
                  const isCurrent = step === shaftInSector;
                  const isPast = step < shaftInSector;
                  return (
                    <div
                      key={step}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isPast
                          ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                          : isCurrent
                          ? 'bg-amber-400 ring-2 ring-amber-400/50 animate-pulse'
                          : 'bg-stone-700'
                      }`}
                      title={`Shaft ${sector}-${step}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Cavern Theme Badge */}
            <div
              id="hud-theme-badge"
              className="hidden lg:flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border text-[11px] font-mono"
              style={{
                borderColor: `${cavernTheme.accentColor}40`,
                color: cavernTheme.accentColor,
              }}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="font-bold">{cavernTheme.name}</span>
              <span className="text-stone-400 text-[10px]">({cavernTheme.modifierName})</span>
            </div>

            {/* Sanity & Energy Vitals */}
            <div
              id="hud-vitals"
              className="flex items-center gap-2 bg-stone-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-stone-800 text-xs font-mono"
            >
              <div className="flex items-center gap-1.5" title={`Sanity: ${playerSanity}%`}>
                <Brain className={`w-3.5 h-3.5 ${playerSanity < 40 ? 'text-purple-400 animate-pulse' : 'text-purple-400'}`} />
                <div className="w-12 bg-stone-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${playerSanity < 40 ? 'bg-purple-400 animate-pulse' : 'bg-purple-500'}`}
                    style={{ width: `${playerSanity}%` }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${playerSanity < 40 ? 'text-purple-300 animate-pulse' : 'text-stone-300'}`}>
                  {playerSanity}%
                </span>
              </div>

              {activeBuffs.length > 0 && (
                <div
                  className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-950/80 border border-amber-600/60 rounded text-[10px] text-amber-300"
                  title={`${activeBuffs[0].buffTitle}: ${activeBuffs[0].buffDescription}`}
                >
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span className="font-bold truncate max-w-[80px]">{activeBuffs[0].name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions (Digger, Town, Talents, Vault, Sound) */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              id="hud-digger-btn"
              type="button"
              onClick={onOpenDigger}
              className="bg-amber-600/90 hover:bg-amber-500 active:scale-95 text-stone-950 font-mono font-bold text-xs px-2.5 py-1.5 rounded-xl shadow-lg border border-amber-400 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Board The Digger Subterranean Crawler Rig"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>The Digger</span>
            </button>

            <button
              id="hud-town-return-btn"
              type="button"
              onClick={onReturnToTown}
              className="bg-stone-900/90 hover:bg-stone-800 active:scale-95 text-stone-300 hover:text-stone-100 font-mono text-xs px-2.5 py-1.5 rounded-xl shadow-lg border border-stone-750 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Return to Mountain Town Surface Hub"
            >
              <Home className="w-3.5 h-3.5 text-stone-400" />
              <span>Surface</span>
            </button>

            <button
              id="hud-newspaper-btn"
              type="button"
              onClick={onOpenNewspaper}
              className="hidden md:flex bg-[#f5efe1]/90 hover:bg-[#fff9ed] active:scale-95 text-stone-900 font-serif font-bold text-xs px-2.5 py-1.5 rounded-xl shadow-lg border border-amber-800/40 items-center gap-1.5 cursor-pointer transition-all"
              title="Read The Miner Issue"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-900" />
              <span>Gazette</span>
            </button>

            <button
              id="hud-talents-btn"
              type="button"
              onClick={onOpenPerks}
              className={`px-3 py-1.5 rounded-xl border shadow-lg cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 ${
                pendingPerkChoices > 0
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 border-amber-300 text-stone-950 font-black shadow-[0_0_16px_rgba(245,158,11,0.5)] animate-bounce'
                  : 'bg-stone-900/90 hover:bg-stone-850 border-stone-750 text-stone-300 hover:text-amber-400'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Talents
              </span>
              {pendingPerkChoices > 0 ? (
                <span className="bg-stone-950 text-amber-300 font-mono font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {pendingPerkChoices} CHOOSE
                </span>
              ) : (
                <span className="text-[10px] font-mono text-stone-400">
                  ({activePerkCount})
                </span>
              )}
            </button>

            <button
              id="hud-vault-btn"
              type="button"
              onClick={onOpenVault}
              className="bg-stone-900/90 hover:bg-stone-850 active:scale-95 transition-all px-3 py-1.5 rounded-xl border border-amber-500/40 hover:border-amber-400 shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Vault
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[11px] font-mono px-1.5 py-0.5 rounded border border-amber-500/30">
                {vaultDiscoveredCount}/{vaultTotalCount}
              </span>
            </button>

            <button
              id="hud-sound-toggle"
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted ? 'Unmute Audio & Music' : 'Mute Audio & Music'}
              className="bg-stone-900/90 hover:bg-stone-800 active:scale-95 transition-all text-stone-300 hover:text-amber-400 p-2 rounded-xl border border-stone-750 shadow-lg cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-stone-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Secondary Row: XP & Progression Level Bar */}
        <div className="w-full max-w-md mx-auto pointer-events-auto">
          <div
            id="hud-xp-bar-container"
            className="bg-stone-950/80 backdrop-blur-md border border-stone-800 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-3"
          >
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-bold text-[11px]">
                {playerLevel}
              </div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide leading-none font-mono">
                {rankTitle}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-0.5">
              <div className="w-full bg-stone-850 h-2 rounded-full overflow-hidden border border-stone-800 relative">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-stone-400 px-0.5">
                <span>{Math.round(currentXp)} XP</span>
                <span>{xpToNextLevel} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

