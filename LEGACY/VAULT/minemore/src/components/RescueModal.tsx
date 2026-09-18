import React from 'react';
import { PartyMember } from '../types';
import { playAudio } from '../audio';
import { Sparkles, Heart, Users, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface RescueModalProps {
  rescuedMember: PartyMember;
  onProceedToDigger: () => void;
  onReturnToTown: () => void;
}

export const RescueModal: React.FC<RescueModalProps> = ({
  rescuedMember,
  onProceedToDigger,
  onReturnToTown,
}) => {
  return (
    <div
      id="rescue-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/90 backdrop-blur-md animate-fadeIn select-none"
    >
      <div
        id="rescue-card"
        className="relative w-full max-w-xl bg-stone-900 border-2 border-amber-500 rounded-xl p-4 sm:p-6 md:p-8 text-stone-100 shadow-2xl overflow-hidden my-auto"
        style={{
          boxShadow: '0 0 70px rgba(245, 158, 11, 0.25), inset 0 0 50px rgba(0,0,0,0.8)',
        }}
      >
        {/* Glow background accent */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: rescuedMember.color }}
        />

        <div className="relative z-10 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/80 border border-amber-600/60 rounded-full text-xs font-mono text-amber-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Trapped Soul Rescued!
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-stone-100 tracking-tight">
              {rescuedMember.name}
            </h2>
            <div className="text-xs sm:text-sm font-mono text-amber-400 font-semibold uppercase tracking-wider">
              {rescuedMember.classTitle} • Rescued From Vein {rescuedMember.rescueVein}
            </div>
          </div>

          {/* Lore Narrative Box */}
          <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-lg text-left space-y-3">
            <p className="font-serif italic text-sm text-stone-200 leading-relaxed">
              "{rescuedMember.currentThought}"
            </p>
            <div className="text-xs text-stone-400 border-t border-stone-800/80 pt-2 font-sans">
              {rescuedMember.rescueStory}
            </div>
          </div>

          {/* Ability & Vein Unlock Feature */}
          <div className="p-3 bg-amber-950/40 border border-amber-700/50 rounded-lg text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono text-amber-300 uppercase font-bold">
                Party Ability Unlocked: {rescuedMember.veinUnlockTitle}
              </div>
              <div className="text-xs text-stone-300 mt-0.5">
                {rescuedMember.perkDescription}
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-stone-400 italic">
            New Extra edition of The Miner Issue has been typeset in town!
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                playAudio('hatch');
                onProceedToDigger();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              Bring to The Digger Galley
            </button>

            <button
              onClick={() => {
                playAudio('paper');
                onReturnToTown();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              Return to Mountain Town
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
