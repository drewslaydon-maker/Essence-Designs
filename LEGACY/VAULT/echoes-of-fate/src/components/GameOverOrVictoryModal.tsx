import React from 'react';
import { CombatOutcome, PlayerStats } from '../types';
import { Trophy, Skull, RefreshCw, CheckCircle, FlameKindling, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { ModalShell } from './ModalShell';

interface GameOverOrVictoryModalProps {
  outcome: CombatOutcome;
  player: PlayerStats;
  onRestartSlice: () => void;
  onContinueExploring: () => void;
}

export const GameOverOrVictoryModal: React.FC<GameOverOrVictoryModalProps> = ({
  outcome,
  player,
  onRestartSlice,
  onContinueExploring,
}) => {
  const isDeath = outcome === 'player_died';

  const modalTitle = isDeath
    ? 'Fallen to the Rift'
    : outcome === 'subdued'
    ? 'Victory: The Restored Oath'
    : outcome === 'banished'
    ? 'Victory: The Eternal Interstice'
    : 'Victory: The Ruthless Purge';

  const badgeText = isDeath
    ? 'Defeated'
    : outcome === 'subdued'
    ? 'Redeemed & Allied'
    : outcome === 'banished'
    ? 'Planar Exile'
    : 'Martial Execution';

  const badgeColor = isDeath
    ? 'rose'
    : outcome === 'subdued'
    ? 'emerald'
    : outcome === 'banished'
    ? 'purple'
    : 'rose';

  const iconElement = isDeath ? (
    <Skull className="w-4 h-4 text-rose-400" />
  ) : outcome === 'subdued' ? (
    <CheckCircle className="w-4 h-4 text-emerald-400" />
  ) : outcome === 'banished' ? (
    <FlameKindling className="w-4 h-4 text-purple-400" />
  ) : (
    <Trophy className="w-4 h-4 text-amber-400" />
  );

  return (
    <ModalShell
      id="ending-modal"
      isOpen={true}
      title={modalTitle}
      badge={badgeText}
      badgeColor={badgeColor}
      subtitle={isDeath ? 'Soul Spark Dispersed' : 'Testing Segment Completed • Consequential Narrative Branch'}
      icon={iconElement}
      maxWidthClass="max-w-xl"
      footer={
        isDeath ? (
          <button
            onClick={onRestartSlice}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry from Checkpoint</span>
          </button>
        ) : (
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <button
              onClick={onContinueExploring}
              className="flex-1 py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <span>Continue Exploring World</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onRestartSlice}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-xl text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Replay Testing Slice</span>
            </button>
          </div>
        )
      }
    >
      {/* Narrative Epilogue & World Mutation Recap */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed text-left shadow-inner">
        {isDeath ? (
          <p>
            Your vitality waned as the dimensional pressures overwhelmed your Soul Spark. The astral rift claims your physical form, but the Interstice lantern glimmers with residual life, awaiting your rekindling.
          </p>
        ) : outcome === 'subdued' ? (
          <p>
            By looking past malice and reaching into Malakar’s humanity, you disarmed the Outcast Sentinel without taking his life. The dark rift blight in his veins dissipates. He kneels, pledging his ancient martial oath to defend the Ashen Hamlet alongside you. The rift seal stabilizes in perfect harmony, unlocking the <strong className="text-emerald-300 font-semibold">Guardian Aegis</strong>.
          </p>
        ) : outcome === 'banished' ? (
          <p>
            Invoking the full planar polarity of your Interstice Lantern, you severed Malakar from the physical realm forever. Cast into the void interstice, his threat to the living world is extinguished, though eternal violet auroras now dance in the evening sky—birthing new spectral creatures and granting you the <strong className="text-purple-300 font-semibold">Void Walker Shard</strong>.
          </p>
        ) : (
          <p>
            You struck down Commander Malakar with unyielding martial execution. The ancient sentinel falls, his blood dissolving into the stone altar. The rift collapses violently; the Hamlet is saved from the immediate cataclysm, but a chilling fear settles over the villagers. You claim the colossal <strong className="text-rose-400 font-semibold">Executioner Greatsword</strong>.
          </p>
        )}
      </div>

      {/* Player Testing Statistics */}
      <div className="w-full grid grid-cols-3 gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 text-xs text-center">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-mono">Hero Level</span>
          <span className="font-bold text-amber-300 font-mono text-sm">Lv. {player.level}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-mono">Collected Gold</span>
          <span className="font-bold text-amber-400 font-mono text-sm">{player.gold}g</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-mono">Inventory</span>
          <span className="font-bold text-cyan-300 font-mono text-sm">{player.inventory.length} items</span>
        </div>
      </div>
    </ModalShell>
  );
};

