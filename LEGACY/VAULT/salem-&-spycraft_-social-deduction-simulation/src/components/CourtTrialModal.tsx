import React, { useState } from 'react';
import { 
  Gavel, 
  Scale, 
  Crown, 
  ShieldAlert, 
  Check, 
  X, 
  AlertCircle, 
  FileText, 
  Skull,
  UserCheck,
  Award
} from 'lucide-react';
import { Player, RoleId } from '../types';
import { RoleBadge } from './RoleBadge';
import { ROLES } from '../data/roles';
import { soundEngine } from '../utils/audioEngine';

interface CourtTrialModalProps {
  accused: Player;
  players: Player[];
  humanPlayer: Player;
  onConcludeTrial: (verdict: 'guilty' | 'innocent', details: string) => void;
  onLawyerObjection?: () => void;
  onLawyerAlibi?: () => void;
  onJudgePardon?: () => void;
  onPrinceVeto?: () => void;
  objectionsRemaining?: number;
  pardonsRemaining?: number;
  vetosRemaining?: number;
}

export const CourtTrialModal: React.FC<CourtTrialModalProps> = ({
  accused,
  players,
  humanPlayer,
  onConcludeTrial,
  onLawyerObjection,
  onLawyerAlibi,
  onJudgePardon,
  onPrinceVeto,
  objectionsRemaining = 2,
  pardonsRemaining = 1,
  vetosRemaining = 1
}) => {
  const [humanVote, setHumanVote] = useState<'guilty' | 'innocent' | 'abstain' | null>(null);
  const [juryVotes, setJuryVotes] = useState<Record<string, 'guilty' | 'innocent' | 'abstain'>>(() => {
    // Generate initial bot jury inclinations based on suspicion score
    const votes: Record<string, 'guilty' | 'innocent' | 'abstain'> = {};
    const livingJurors = players.filter(p => p.isAlive && p.id !== accused.id && !p.isHuman);

    for (const juror of livingJurors) {
      if (juror.role === 'lawyer' && juror.targetPlayerId === accused.id) {
        votes[juror.id] = 'innocent'; // Lawyer always votes innocent for client
      } else if (juror.role === 'executioner' && juror.targetPlayerId === accused.id) {
        votes[juror.id] = 'guilty'; // Executioner wants them dead
      } else if (accused.suspicionScore > 50) {
        votes[juror.id] = Math.random() > 0.3 ? 'guilty' : 'innocent';
      } else {
        votes[juror.id] = Math.random() > 0.4 ? 'innocent' : 'abstain';
      }
    }
    return votes;
  });

  const [defenseSpeech] = useState<string>(() => {
    return accused.isHuman
      ? "Members of the court, I have acted solely in the defense of this estate! False rumors and circumstantial tells cannot sentence an honest soul to the gallows."
      : `I declare before this bench that my hands are clean! Look to the shadows of Blackthorn Manor—the real scoundrel watches this trial with a smile.`;
  });

  const [trialNotice, setTrialNotice] = useState<string | null>(null);

  // Tally votes
  const allVotes = { ...juryVotes };
  if (humanVote && humanPlayer.id !== accused.id) {
    allVotes[humanPlayer.id] = humanVote;
  }

  const guiltyCount = Object.values(allVotes).filter(v => v === 'guilty').length;
  const innocentCount = Object.values(allVotes).filter(v => v === 'innocent').length;
  const abstainCount = Object.values(allVotes).filter(v => v === 'abstain').length;

  const handleCastVote = (vote: 'guilty' | 'innocent' | 'abstain') => {
    soundEngine.playVotePaddle();
    setHumanVote(vote);
  };

  const handleApplyObjection = () => {
    if (onLawyerObjection) {
      soundEngine.playObjection();
      onLawyerObjection();
      // Strike down 2 guilty votes from bot jurors
      const updated = { ...juryVotes };
      let reduced = 0;
      for (const [id, val] of Object.entries(updated)) {
        if (val === 'guilty' && reduced < 2) {
          updated[id] = 'abstain';
          reduced++;
        }
      }
      setJuryVotes(updated);
      setTrialNotice("OBJECTION SUSTAINED! Defense Counsel struck down 2 guilty votes from the record!");
    }
  };

  const handleApplyAlibi = () => {
    if (onLawyerAlibi) {
      soundEngine.playParchment();
      onLawyerAlibi();
      const updated = { ...juryVotes };
      for (const id of Object.keys(updated)) {
        if (Math.random() > 0.5) updated[id] = 'innocent';
      }
      setJuryVotes(updated);
      setTrialNotice("ALIBI PRESENTED! The Lawyer submitted affidavits of presence, swaying jurors toward acquittal.");
    }
  };

  const handleApplyPardon = () => {
    if (onJudgePardon) {
      soundEngine.playGavel();
      onJudgePardon();
      setTrialNotice("JUDICIAL PARDON ISSUED! The Judge's gavel strikes the bench. The accused is pardoned!");
      setTimeout(() => {
        onConcludeTrial('innocent', `The Judge unilaterally pardoned ${accused.name} from the gallows.`);
      }, 1500);
    }
  };

  const handleApplyVeto = () => {
    if (onPrinceVeto) {
      soundEngine.playGavel();
      onPrinceVeto();
      setTrialNotice("ROYAL VETO INVOKED! By royal blood and sovereign right, Prince stays this execution!");
      setTimeout(() => {
        onConcludeTrial('innocent', `The Prince exercised royal prerogative to veto the trial of ${accused.name}.`);
      }, 1500);
    }
  };

  const handleFinalVerdict = () => {
    soundEngine.playGavel();
    // If Judge is human and votes guilty/innocent, tie-breaker priority applies
    let finalVerdict: 'guilty' | 'innocent' = guiltyCount > innocentCount ? 'guilty' : 'innocent';
    if (guiltyCount === innocentCount) {
      if (humanPlayer.role === 'judge') {
        finalVerdict = humanVote === 'guilty' ? 'guilty' : 'innocent';
      }
    }

    const detail = finalVerdict === 'guilty' 
      ? `The Court condemned ${accused.name} with ${guiltyCount} Guilty votes to ${innocentCount} Innocent votes.`
      : `The Court acquitted ${accused.name} (${innocentCount} Innocent vs ${guiltyCount} Guilty).`;

    onConcludeTrial(finalVerdict, detail);
  };

  return (
    <div 
      id="court-trial-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onConcludeTrial('innocent', `The town chose to adjourn court without an execution.`);
        }
      }}
    >
      <div 
        className="bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 max-h-[92vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-amber-200">
                The Court of Blackthorn Manor: Trial Phase
              </h2>
              <p className="text-xs text-stone-400">
                The accused stands upon the stand. The jury must cast their verdict.
              </p>
            </div>
          </div>

          <button
            id="btn-adjourn-trial"
            onClick={() => onConcludeTrial('innocent', `The court was adjourned without executing ${accused.name}.`)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Adjourn Court (Dismiss Trial)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Alert */}
        {trialNotice && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{trialNotice}</span>
          </div>
        )}

        {/* Accused Showcase */}
        <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800">
                  Accused on the Stand
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Suspicion: {accused.suspicionScore}%
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {accused.name}
              </h3>
              <p className="text-xs text-stone-400 font-medium">
                {accused.title}
              </p>
            </div>

            <RoleBadge 
              roleId={accused.role} 
              isUnknown={!accused.isHuman && humanPlayer.role !== 'judge'} 
            />
          </div>

          {/* Defense Speech Box */}
          <div className="mt-3 p-3 bg-stone-900/90 border border-stone-800 rounded-lg text-xs italic text-stone-200 leading-relaxed">
            <span className="text-amber-400 font-bold not-italic mr-1.5">Defense Testimony:</span>
            "{defenseSpeech}"
          </div>
        </div>

        {/* Role Privileges: Lawyer, Judge, Prince */}
        <div className="mb-5 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Special Court Prerogatives & Interventions
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Lawyer Intervention */}
            <div className="p-3 bg-stone-950/60 border border-indigo-900/40 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 mb-1">
                  <Scale className="w-4 h-4" />
                  Lawyer's Defense
                </div>
                <p className="text-[11px] text-stone-400">
                  Defend the client! Object to rumors or submit verifiable alibis.
                </p>
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                <button
                  id="btn-lawyer-objection"
                  onClick={handleApplyObjection}
                  disabled={objectionsRemaining <= 0 || (humanPlayer.role !== 'lawyer' && !players.some(p => p.role === 'lawyer' && p.isAlive))}
                  className="w-full py-1.5 px-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
                >
                  Objection! ({objectionsRemaining})
                </button>
                <button
                  id="btn-lawyer-alibi"
                  onClick={handleApplyAlibi}
                  disabled={humanPlayer.role !== 'lawyer' && !players.some(p => p.role === 'lawyer' && p.isAlive)}
                  className="w-full py-1.5 px-2 rounded-lg text-xs font-bold bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 border border-indigo-700/50 transition-colors"
                >
                  Produce Alibi
                </button>
              </div>
            </div>

            {/* Judge Intervention */}
            <div className="p-3 bg-stone-950/60 border border-amber-900/40 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                  <Gavel className="w-4 h-4" />
                  Judge's Bench
                </div>
                <p className="text-[11px] text-stone-400">
                  Unilateral authority: Issue a full Judicial Pardon or decisive tie-breaker gavel.
                </p>
              </div>

              <div className="mt-3">
                <button
                  id="btn-judge-pardon"
                  onClick={handleApplyPardon}
                  disabled={pardonsRemaining <= 0 || (humanPlayer.role !== 'judge' && !players.some(p => p.role === 'judge' && p.isAlive))}
                  className="w-full py-1.5 px-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 transition-colors"
                >
                  Judicial Pardon ({pardonsRemaining})
                </button>
              </div>
            </div>

            {/* Prince Intervention */}
            <div className="p-3 bg-stone-950/60 border border-purple-900/40 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 mb-1">
                  <Crown className="w-4 h-4" />
                  Royal Prince
                </div>
                <p className="text-[11px] text-stone-400">
                  Royal sovereignty: Invoke royal decree of veto to stay this gallows execution.
                </p>
              </div>

              <div className="mt-3">
                <button
                  id="btn-prince-veto"
                  onClick={handleApplyVeto}
                  disabled={vetosRemaining <= 0 || (humanPlayer.role !== 'prince' && !players.some(p => p.role === 'prince' && p.isAlive))}
                  className="w-full py-1.5 px-2 rounded-lg text-xs font-bold bg-purple-700 hover:bg-purple-600 disabled:opacity-40 text-white transition-colors"
                >
                  Royal Veto ({vetosRemaining})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Tally & Paddle Buttons */}
        <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Jury Box Deliberation
            </span>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-rose-400">Guilty: {guiltyCount}</span>
              <span className="text-emerald-400">Innocent: {innocentCount}</span>
              <span className="text-stone-400">Abstain: {abstainCount}</span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden flex mb-4">
            <div 
              className="bg-rose-500 transition-all duration-300"
              style={{ width: `${(guiltyCount / Math.max(1, guiltyCount + innocentCount + abstainCount)) * 100}%` }}
            />
            <div 
              className="bg-emerald-500 transition-all duration-300"
              style={{ width: `${(innocentCount / Math.max(1, guiltyCount + innocentCount + abstainCount)) * 100}%` }}
            />
            <div 
              className="bg-stone-600 transition-all duration-300"
              style={{ width: `${(abstainCount / Math.max(1, guiltyCount + innocentCount + abstainCount)) * 100}%` }}
            />
          </div>

          {/* Your Juror Vote */}
          {humanPlayer.id !== accused.id ? (
            <div>
              <div className="text-xs font-semibold text-stone-300 mb-2">
                Your Juror Vote: {humanVote ? <span className="uppercase text-amber-400 font-bold">{humanVote}</span> : <span className="text-stone-400">Pending</span>}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="btn-vote-guilty"
                  onClick={() => handleCastVote('guilty')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    humanVote === 'guilty'
                      ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-md'
                      : 'bg-stone-900 hover:bg-rose-950/60 text-stone-300 hover:text-rose-300 border border-stone-700 hover:border-rose-700'
                  }`}
                >
                  <Skull className="w-4 h-4 text-rose-400" />
                  Vote Guilty
                </button>

                <button
                  id="btn-vote-innocent"
                  onClick={() => handleCastVote('innocent')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    humanVote === 'innocent'
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-md'
                      : 'bg-stone-900 hover:bg-emerald-950/60 text-stone-300 hover:text-emerald-300 border border-stone-700 hover:border-emerald-700'
                  }`}
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  Vote Innocent
                </button>

                <button
                  id="btn-vote-abstain"
                  onClick={() => handleCastVote('abstain')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    humanVote === 'abstain'
                      ? 'bg-stone-700 text-white ring-2 ring-stone-400'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-700'
                  }`}
                >
                  <X className="w-4 h-4" />
                  Abstain
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-amber-950/40 border border-amber-800/40 rounded-lg text-xs text-amber-200 text-center font-medium">
              You are the accused! You cannot vote on your own sentence. You must await the jury and bench verdict.
            </div>
          )}
        </div>

        {/* Footer: Verdict Execution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-800">
          <p className="text-xs text-stone-400">
            {guiltyCount > innocentCount ? (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <Skull className="w-3.5 h-3.5" /> Gallows Execution is imminent
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Acquittal favored
              </span>
            )}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onConcludeTrial('innocent', `The town chose to adjourn court without an execution.`)}
              className="flex-1 sm:flex-none min-h-[44px] py-2 px-4 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-300 transition-colors cursor-pointer"
            >
              Adjourn Court
            </button>
            <button
              id="btn-conclude-verdict"
              onClick={handleFinalVerdict}
              className="flex-1 sm:flex-none min-h-[44px] py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Gavel className="w-4 h-4" />
              Deliver Verdict
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
