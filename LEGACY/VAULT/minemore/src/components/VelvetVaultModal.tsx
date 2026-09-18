import React, { useState } from 'react';
import { GEM_CATALOG } from '../data/gems';
import { Gem, VaultState } from '../types';
import { playAudio } from '../audio';
import { Lock, Sparkles, Volume2, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface VelvetVaultModalProps {
  vaultState: VaultState;
  onCloseVault: () => void;
}

export const VelvetVaultModal: React.FC<VelvetVaultModalProps> = ({
  vaultState,
  onCloseVault,
}) => {
  const [selectedGem, setSelectedGem] = useState<Gem | null>(null);

  const discoveredSet = new Set(vaultState.discoveredGems);
  const totalGems = GEM_CATALOG.length;
  const discoveredCount = vaultState.discoveredGems.filter((id) =>
    GEM_CATALOG.some((g) => g.id === id)
  ).length;
  const isMasterCollector = discoveredCount === totalGems;

  const handleInspectGem = (gem: Gem, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    setSelectedGem(gem);
    playAudio('gem', gem.freq);
  };

  return (
    <div
      id="vault-overlay"
      className="fixed inset-0 z-40 bg-stone-950/95 backdrop-blur-md flex flex-col items-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="max-w-md w-full flex flex-col items-center gap-4 sm:gap-5 my-auto py-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Mineral Reliquary
          </div>
          <h2
            id="vault-heading"
            className="text-2xl sm:text-3xl font-black tracking-wide text-amber-400 font-serif"
          >
            THE VELVET VAULT
          </h2>
          <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
            Your permanent collection of recovered gemstones. Tap any discovered gem to sound its harmonic resonance.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="w-full bg-stone-900/80 border border-stone-800 rounded-xl p-3.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-stone-300 block">
              Vault Completion
            </span>
            <span className="text-[11px] font-mono text-stone-500">
              {isMasterCollector ? 'All mineral veins logged!' : `${totalGems - discoveredCount} specimens undiscovered`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-amber-400">
              {discoveredCount} / {totalGems}
            </span>
            {isMasterCollector && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </div>
        </div>

        {/* Velvet Pedestal Grid */}
        <div
          id="vault-grid"
          className="w-full grid grid-cols-3 gap-3 p-4 bg-[#181310] border-2 border-stone-800 rounded-2xl shadow-[inset_0_4px_24px_rgba(0,0,0,0.85)] relative"
        >
          {GEM_CATALOG.map((gem) => {
            const isUnlocked = discoveredSet.has(gem.id);
            const count = vaultState.gemCounts[gem.id] || 0;
            const isSelected = selectedGem?.id === gem.id;

            return (
              <button
                key={gem.id}
                type="button"
                onClick={() => handleInspectGem(gem, isUnlocked)}
                disabled={!isUnlocked}
                className={`group relative aspect-square rounded-xl p-2 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                  isUnlocked
                    ? isSelected
                      ? 'bg-gradient-to-b from-amber-950/60 to-stone-900 border-2 border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.3)]'
                      : 'bg-gradient-to-b from-stone-900/90 to-stone-950 border border-stone-700/80 hover:border-amber-500/50 hover:bg-stone-850'
                    : 'bg-stone-950/70 border border-dashed border-stone-800 cursor-not-allowed opacity-60'
                }`}
              >
                {/* Gem or Lock Icon */}
                {isUnlocked ? (
                  <>
                    <div
                      className="text-2xl sm:text-3xl transition-transform group-hover:scale-110"
                      style={{
                        filter: `drop-shadow(0 0 10px ${gem.color})`,
                      }}
                    >
                      💎
                    </div>
                    <span className="text-[11px] font-semibold text-stone-200 mt-1 truncate max-w-full text-center">
                      {gem.name.split(' ')[1] || gem.name}
                    </span>
                    {count > 1 && (
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-mono font-bold px-1 rounded bg-stone-800/90 text-amber-300 border border-stone-700">
                        x{count}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Lock className="w-5 h-5 text-stone-600" />
                    <span className="text-[9px] font-mono text-stone-600 tracking-wider">
                      LOCKED
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Gem Details Field Note */}
        {selectedGem && (
          <div className="w-full bg-stone-900/90 border border-amber-500/30 rounded-xl p-4 text-left space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-md shrink-0"
                  style={{
                    backgroundColor: selectedGem.color,
                    boxShadow: `0 0 8px ${selectedGem.color}`,
                  }}
                />
                <h3 className="font-bold text-stone-100 font-serif text-sm sm:text-base">
                  {selectedGem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => playAudio('gem', selectedGem.freq)}
                className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" />
                <span>{selectedGem.pitchNote} ({Math.round(selectedGem.freq)}Hz)</span>
              </button>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {selectedGem.description}
            </p>
          </div>
        )}

        {/* Back to Mine Button */}
        <button
          id="close-vault-btn"
          type="button"
          onClick={onCloseVault}
          className="w-full py-3.5 px-6 font-bold tracking-wider uppercase text-stone-950 bg-amber-500 hover:bg-amber-400 active:scale-98 transition-all rounded-xl shadow-[0_4px_16px_rgba(217,119,6,0.35)] cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back To Cavern</span>
        </button>
      </div>
    </div>
  );
};
