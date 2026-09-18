import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Sword,
  Shield,
  Zap,
  FlaskConical,
  Compass,
  Trophy,
  ArrowRight,
  Star,
  Coins,
  Activity,
  Skull,
  Lightbulb,
  Gamepad2,
  RefreshCw,
  CheckCircle2,
  Flame,
  FileHeart,
  CheckSquare,
  Square,
  MapPin,
  AlertTriangle,
  ScrollText,
  GraduationCap
} from 'lucide-react';
import {
  SENNECCA_BUILD_SPECS,
  BOZOG_CHRONICLE,
  ATRONACH_FUEL_INDEX,
  SENNECCA_PROGRESSION_ROADMAP,
  SENNECCA_SPELL_RECIPES,
  ARENA_SURVIVAL_WALKTHROUGH,
  WHY_THIS_CODEX_EXISTS,
  IMPERIAL_CITY_DAY_ONE_TASKS,
  ACTIONABLE_QUEST_GUIDES,
  MAGES_RECOMMENDATION_GUIDES
} from '../data/senneccaBuildData';

interface SenneccaGrimoireProps {
  onOpenEntity?: (id: string) => void;
}

type GrimoireTab = 'icDay1' | 'actionQuests' | 'fuel' | 'roadmap' | 'mages' | 'arena' | 'spells' | 'bozog' | 'dedication';

export function SenneccaGrimoire({ onOpenEntity }: SenneccaGrimoireProps) {
  const [activeTab, setActiveTab] = useState<GrimoireTab>('icDay1');
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(0);
  const [selectedFuelIndex, setSelectedFuelIndex] = useState(0);
  const [selectedQuestId, setSelectedQuestId] = useState('honorblade_of_chorrol');
  const [selectedCityRecommendation, setSelectedCityRecommendation] = useState('Chorrol');
  const [showDedicationModal, setShowDedicationModal] = useState(false);

  // Local state for interactive Day 1 Checklist
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('sennecca_completed_ic_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [taskFilter, setTaskFilter] = useState<'all' | 'free' | 'purchase'>('all');

  useEffect(() => {
    try {
      localStorage.setItem('sennecca_completed_ic_tasks', JSON.stringify(completedTasks));
    } catch {
      // safe fallback
    }
  }, [completedTasks]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const currentMilestone = SENNECCA_PROGRESSION_ROADMAP[selectedMilestoneIndex];
  const currentFuel = ATRONACH_FUEL_INDEX[selectedFuelIndex];
  const currentQuest = ACTIONABLE_QUEST_GUIDES.find(q => q.id === selectedQuestId) || ACTIONABLE_QUEST_GUIDES[0];
  const currentMagesCity = MAGES_RECOMMENDATION_GUIDES.find(m => m.city === selectedCityRecommendation) || MAGES_RECOMMENDATION_GUIDES[0];

  const filteredTasks = IMPERIAL_CITY_DAY_ONE_TASKS.filter(task => {
    if (taskFilter === 'free') {
      return task.priority === 'Immediate (0 Gold)' || task.priority === 'Free Profit';
    }
    if (taskFilter === 'purchase') {
      return task.priority === 'Under 50 Gold' || task.priority === 'Under 150 Gold';
    }
    return true;
  });

  const completedCount = Object.values(completedTasks).filter(Boolean).length;

  return (
    <div className="space-y-8" id="sennecca-grimoire-root">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-[#3b82f6]/40 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#60a5fa]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-[#8b5cf6]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#3b82f6]/20 text-[#93c5fd] border border-[#3b82f6]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#60a5fa]" />
              Tailor-Made Oblivion Survival & Build Grimoire
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#f8fafc] tracking-tight">
                Sennecca’s Spellblade Grimoire
              </h1>
              <span className="px-3 py-0.5 rounded-md text-xs font-mono bg-[#1e293b] text-[#38bdf8] border border-[#334155]">
                Level 1 • Imperial City Start
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#cbd5e1] max-w-2xl leading-relaxed">
              Actionable survival roadmap for Julia & Drew. From your first 30 minutes in the Imperial City market 
              to claiming the unbreakable 0-weight Honorblade and building an immortal, 100% spell-absorbing demigod.
            </p>
          </div>

          {/* Quick Action / Dedication Button */}
          <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-3">
            <button
              onClick={() => setShowDedicationModal(true)}
              className="px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#d97706] to-[#b45309] text-white hover:from-[#f59e0b] hover:to-[#d97706] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileHeart className="w-4 h-4 text-[#fef08a]" />
              <span>Why This Codex Exists</span>
            </button>
            <button
              onClick={() => setActiveTab('fuel')}
              className="px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#1e293b] text-[#93c5fd] border border-[#334155] hover:bg-[#334155] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#38bdf8]" />
              <span>Free Mana Refills</span>
            </button>
          </div>
        </div>

        {/* CHARACTER SPEC STRIP */}
        <div className="mt-6 pt-6 border-t border-[#1e293b] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0b1120]/70 p-3 rounded-xl border border-[#1e293b]">
            <div className="text-[10px] font-mono uppercase text-[#64748b]">Birthsign</div>
            <div className="text-xs font-bold text-[#38bdf8] mt-0.5 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#38bdf8]" />
              The Atronach
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-0.5">+150 Magicka • 50% Absorb</div>
          </div>

          <div className="bg-[#0b1120]/70 p-3 rounded-xl border border-[#1e293b]">
            <div className="text-[10px] font-mono uppercase text-[#64748b]">Primary Attributes</div>
            <div className="text-xs font-bold text-[#e2e8f0] mt-0.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#a855f7]" />
              Int & Willpower
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-0.5">Huge Pool + High Fatigue</div>
          </div>

          <div className="bg-[#0b1120]/70 p-3 rounded-xl border border-[#1e293b]">
            <div className="text-[10px] font-mono uppercase text-[#64748b]">Combat Engine</div>
            <div className="text-xs font-bold text-[#e2e8f0] mt-0.5 flex items-center gap-1.5">
              <Sword className="w-3.5 h-3.5 text-[#f43f5e]" />
              Blade + Destruction
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-0.5">Fast Slash & Shock Touch</div>
          </div>

          <div className="bg-[#0b1120]/70 p-3 rounded-xl border border-[#1e293b]">
            <div className="text-[10px] font-mono uppercase text-[#64748b]">Survival & Movement</div>
            <div className="text-xs font-bold text-[#e2e8f0] mt-0.5 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-[#10b981]" />
              Alchemy + Acrobatics
            </div>
            <div className="text-[10px] text-[#94a3b8] mt-0.5">Flax Potions & Pillar Hopping</div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-[#1e293b] pb-3">
        {[
          { id: 'icDay1', label: '1. Level 1 IC Start Guide', icon: MapPin },
          { id: 'actionQuests', label: '2. Actionable Quests (Honorblade & Kvatch)', icon: ScrollText },
          { id: 'fuel', label: '3. Zero-Panic Mana Fuel', icon: RefreshCw },
          { id: 'roadmap', label: '4. Progression Roadmap (Acts I-IV)', icon: Compass },
          { id: 'mages', label: '5. Mages Guild 7-City Tour', icon: GraduationCap },
          { id: 'arena', label: '6. Arena Gladiator Guide', icon: Trophy },
          { id: 'spells', label: '7. Custom Spell Recipes', icon: Flame },
          { id: 'bozog', label: '8. Bozog’s Berserk Engine', icon: Skull },
          { id: 'dedication', label: '9. Love Letter & Sandbox Tenets', icon: FileHeart }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as GrimoireTab)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white shadow-md shadow-[#2563eb]/20'
                  : 'bg-[#0f172a] text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] border border-[#1e293b]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LEVEL 1 IMPERIAL CITY START GUIDE (ACTIONABLE CHECKLIST)           */}
      {/* ========================================================================= */}
      {activeTab === 'icDay1' && (
        <div className="space-y-6">
          {/* Quick Intro Banner */}
          <div className="rounded-2xl border border-[#3b82f6]/40 bg-[#0f172a] p-6 sm:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#38bdf8] font-bold tracking-wider mb-1">
                  <MapPin className="w-4 h-4" />
                  First 30 Minutes Out of the Sewers
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f8fafc]">
                  Level 1 Imperial City Setup Guide
                </h2>
                <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
                  Julia is currently in the Imperial City with a few hundred gold and the Atronach stone. 
                  Here is the exact shopping list, free healing spots, and setup actions to take before venturing into the wilderness.
                </p>
              </div>

              {/* Progress Counter & Filter */}
              <div className="bg-[#020617] p-3 rounded-xl border border-[#1e293b] flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase text-[#64748b]">Checklist Progress</div>
                  <div className="text-sm font-mono font-bold text-[#38bdf8]">
                    {completedCount} / {IMPERIAL_CITY_DAY_ONE_TASKS.length} Tasks Done
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#38bdf8] flex items-center justify-center text-xs font-bold text-[#38bdf8]">
                  {Math.round((completedCount / IMPERIAL_CITY_DAY_ONE_TASKS.length) * 100)}%
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-[#64748b] font-mono mr-2">Filter View:</span>
              <button
                onClick={() => setTaskFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  taskFilter === 'all'
                    ? 'bg-[#3b82f6] text-white font-bold'
                    : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
                }`}
              >
                All Steps ({IMPERIAL_CITY_DAY_ONE_TASKS.length})
              </button>
              <button
                onClick={() => setTaskFilter('free')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  taskFilter === 'free'
                    ? 'bg-[#10b981] text-white font-bold'
                    : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
                }`}
              >
                Free / Profit Only
              </button>
              <button
                onClick={() => setTaskFilter('purchase')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  taskFilter === 'purchase'
                    ? 'bg-[#f59e0b] text-white font-bold'
                    : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
                }`}
              >
                Budget Purchases (&lt;50g)
              </button>
            </div>
          </div>

          {/* Interactive Task Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => {
              const isDone = !!completedTasks[task.id];
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isDone
                      ? 'bg-[#0f291e]/60 border-[#10b981]/50 opacity-80'
                      : 'bg-[#0b1329] border-[#1e293b] hover:border-[#38bdf8]/60 hover:bg-[#0f1d40]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#1e293b] text-[#93c5fd]">
                        {task.district}
                      </span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                        task.priority === 'Free Profit' || task.priority === 'Immediate (0 Gold)'
                          ? 'bg-[#064e3b] text-[#6ee7b7]'
                          : 'bg-[#451a03] text-[#fcd34d]'
                      }`}>
                        {task.budgetCostOrGain}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        className="mt-1 text-[#38bdf8] hover:scale-110 transition-transform"
                      >
                        {isDone ? (
                          <CheckSquare className="w-5 h-5 text-[#10b981]" />
                        ) : (
                          <Square className="w-5 h-5 text-[#64748b]" />
                        )}
                      </button>
                      <div>
                        <h4 className={`text-base font-semibold leading-snug ${
                          isDone ? 'line-through text-[#94a3b8]' : 'text-[#f8fafc]'
                        }`}>
                          {task.goal}
                        </h4>
                        <div className="text-xs font-mono text-[#38bdf8] mt-0.5">
                          📍 {task.merchantOrPlace}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#cbd5e1] leading-relaxed pl-8">
                      {task.detailedAction}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1e293b]/60 pl-8 flex items-center justify-between text-[11px] text-[#64748b]">
                    <span>Click card to toggle complete</span>
                    {isDone && <span className="text-[#10b981] font-mono font-bold">✓ Completed</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Golden Bridge: Next Step Recommendation Card */}
          <div className="rounded-2xl border border-[#eab308]/40 bg-gradient-to-r from-[#1c1917] via-[#1c160c] to-[#0f172a] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#facc15] font-bold">
                <AlertTriangle className="w-4 h-4" />
                Done with the Market District?
              </div>
              <h3 className="text-xl font-serif font-bold text-[#fef08a]">
                Head to Chorrol for the Free 23-Damage Honorblade!
              </h3>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                Don’t buy expensive weapons from merchants. You can claim an indestructible, 0-weight Ebony-equivalent 
                longsword in Chorrol right now at Level 1 without spending a single coin.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('actionQuests');
                setSelectedQuestId('honorblade_of_chorrol');
              }}
              className="px-5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider bg-gradient-to-r from-[#ca8a04] to-[#a16207] text-white hover:from-[#eab308] hover:to-[#ca8a04] transition-all shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Read Honorblade Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ACTIONABLE QUESTS (HONORBLADE, KVATCH, GRAY PRINCE)                 */}
      {/* ========================================================================= */}
      {activeTab === 'actionQuests' && (
        <div className="space-y-6">
          {/* Sub-Selector for Quests */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ACTIONABLE_QUEST_GUIDES.map((quest) => {
              const isSelected = quest.id === selectedQuestId;
              return (
                <button
                  key={quest.id}
                  onClick={() => setSelectedQuestId(quest.id)}
                  className={`p-4 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e293b] border-[#38bdf8] shadow-lg shadow-[#38bdf8]/10'
                      : 'bg-[#0b1329] border-[#1e293b] hover:bg-[#111c38] text-[#94a3b8]'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-[#38bdf8] mb-1">
                    {quest.recommendedLevel}
                  </div>
                  <div className="font-bold text-sm text-[#f8fafc] leading-tight">
                    {quest.title}
                  </div>
                  <div className="text-xs text-[#64748b] truncate mt-1">
                    {quest.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Quest Guide Detail */}
          <div className="rounded-2xl border border-[#38bdf8]/40 bg-[#0f172a] p-6 sm:p-8 space-y-6">
            {/* Title & Metadata */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#0369a1] text-[#e0f2fe]">
                  Recommended Level: {currentQuest.recommendedLevel}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f8fafc] mt-2">
                  {currentQuest.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
                  {currentQuest.subtitle}
                </p>
              </div>

              <div className="bg-[#020617] px-4 py-3 rounded-xl border border-[#1e293b] self-start">
                <div className="text-[10px] font-mono uppercase text-[#64748b]">Reward Breakdown</div>
                <div className="text-xs font-bold text-[#38bdf8] mt-0.5">
                  {currentQuest.rewardBreakdown}
                </div>
              </div>
            </div>

            {/* Why Do This Now Banner */}
            <div className="rounded-xl bg-[#0b1120] p-4 border border-[#1e293b] space-y-1.5">
              <div className="text-xs font-mono uppercase text-[#60a5fa] font-bold flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-[#38bdf8]" />
                Why You Should Do This Right Now:
              </div>
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                {currentQuest.whyDoThisNow}
              </p>
            </div>

            {/* Critical Exploit / Warning if present */}
            {currentQuest.criticalExploitOrWarning && (
              <div className="rounded-xl bg-gradient-to-r from-[#451a03] to-[#291104] p-4 border border-[#f59e0b]/50 space-y-1">
                <div className="text-xs font-mono uppercase text-[#fcd34d] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                  CRITICAL RULE / EXPLOIT:
                </div>
                <p className="text-xs sm:text-sm text-[#fef3c7] leading-relaxed">
                  {currentQuest.criticalExploitOrWarning}
                </p>
              </div>
            )}

            {/* Step-by-Step Walkthrough Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-mono uppercase text-[#38bdf8] tracking-wider font-bold">
                Step-by-Step Execution Walkthrough:
              </h3>

              <div className="space-y-4">
                {currentQuest.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="rounded-xl bg-[#020617]/70 p-5 border border-[#1e293b] space-y-2 relative"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-[#2563eb] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-[#f8fafc]">
                          {step.objective}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-[#38bdf8] bg-[#0f172a] px-2.5 py-1 rounded border border-[#1e293b] self-start sm:self-auto">
                        📍 {step.location}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed pl-0 sm:pl-9">
                      {step.actionableDetail}
                    </p>

                    {step.proTip && (
                      <div className="ml-0 sm:ml-9 mt-2 text-xs text-[#a5f3fc] bg-[#083344]/50 p-2.5 rounded-lg border border-[#0e7490]/40 flex items-start gap-2">
                        <span className="text-[#38bdf8] font-bold font-mono shrink-0">💡 Pro-Tip:</span>
                        <span>{step.proTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ZERO-PANIC MANA FUEL                                               */}
      {/* ========================================================================= */}
      {activeTab === 'fuel' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-[#0f172a] p-5 border border-[#334155] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#f8fafc]">
                The Zero-Panic Atronach Fuel Station
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                Your Magicka doesn't regenerate naturally when sleeping or waiting. Here is how you keep your tank at 100% anytime.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#1e293b] text-[#38bdf8] border border-[#334155]">
              Rule #1: Never Pay a Healer
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* List of Fuel Sources */}
            <div className="space-y-2 md:col-span-1">
              {ATRONACH_FUEL_INDEX.map((fuel, idx) => {
                const isSelected = idx === selectedFuelIndex;
                return (
                  <button
                    key={fuel.name}
                    onClick={() => setSelectedFuelIndex(idx)}
                    className={`w-full p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#1e293b] border-[#38bdf8] shadow-md'
                        : 'bg-[#0b1329] border-[#1e293b] hover:bg-[#111c38] text-[#94a3b8]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-[#38bdf8] uppercase">{fuel.type}</span>
                      <span className="text-[#64748b]">{fuel.convenienceRating}</span>
                    </div>
                    <div className="text-sm font-semibold text-[#f1f5f9]">{fuel.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Fuel Source Details */}
            <div className="md:col-span-2 rounded-2xl border border-[#38bdf8]/40 bg-[#0f172a] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#0369a1] text-white">
                    {currentFuel.type}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-[#f8fafc] mt-2">
                    {currentFuel.name}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#38bdf8] bg-[#020617] px-3 py-1 rounded-md border border-[#1e293b]">
                  {currentFuel.convenienceRating}
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                <div>
                  <strong className="text-[#f1f5f9] block mb-1">📍 Where to Find It:</strong>
                  <p className="text-[#94a3b8]">{currentFuel.location}</p>
                </div>

                <div>
                  <strong className="text-[#f1f5f9] block mb-1">⚡ Game Mechanic:</strong>
                  <p className="text-[#cbd5e1]">{currentFuel.mechanic}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#020617] border border-[#1e293b] space-y-1">
                  <div className="text-xs font-mono text-[#38bdf8] uppercase font-bold">
                    Actionable Field Instructions:
                  </div>
                  <p className="text-xs sm:text-sm text-[#e2e8f0] leading-relaxed">
                    {currentFuel.instructions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PROGRESSION ROADMAP (ACTS I-IV)                                     */}
      {/* ========================================================================= */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Milestone Step Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SENNECCA_PROGRESSION_ROADMAP.map((mile, idx) => {
              const isSelected = idx === selectedMilestoneIndex;
              return (
                <button
                  key={mile.stage}
                  onClick={() => setSelectedMilestoneIndex(idx)}
                  className={`p-4 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#172554] border-[#3b82f6] shadow-lg shadow-[#3b82f6]/10'
                      : 'bg-[#0b1329] border-[#1e293b] hover:bg-[#0f1d40] text-[#94a3b8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className={isSelected ? 'text-[#60a5fa] font-bold' : 'text-[#64748b]'}>
                      Act {idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#020617] text-[#93c5fd] text-[10px]">
                      {mile.levelRange}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[#f1f5f9] truncate">
                    {mile.title}
                  </div>
                  <div className="text-xs text-[#64748b] truncate mt-0.5">
                    {mile.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Milestone Card */}
          <div className="rounded-2xl border border-[#2563eb]/40 bg-[#0f172a] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
              <div>
                <div className="text-xs font-mono uppercase text-[#38bdf8] tracking-wider mb-1">
                  {currentMilestone.stage} ({currentMilestone.levelRange})
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#f8fafc]">
                  {currentMilestone.title}
                </h2>
                <p className="text-xs text-[#94a3b8] mt-1">{currentMilestone.subtitle}</p>
              </div>

              <div className="bg-[#1e293b] px-4 py-2.5 rounded-xl border border-[#334155] self-start">
                <div className="text-[10px] font-mono uppercase text-[#64748b]">Priority Mission</div>
                <div className="text-xs font-bold text-[#38bdf8] mt-0.5">{currentMilestone.priorityQuest}</div>
              </div>
            </div>

            {/* Tactical Objective & RE Village Parallels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#020617]/70 p-4 border border-[#1e293b] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#60a5fa] uppercase tracking-wide">
                  <Compass className="w-4 h-4" />
                  Tactical Objective
                </div>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  {currentMilestone.tacticalObjective}
                </p>
              </div>

              <div className="rounded-xl bg-[#020617]/70 p-4 border border-[#1e293b] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#f59e0b] uppercase tracking-wide">
                  <Gamepad2 className="w-4 h-4" />
                  Resident Evil Village Parallel
                </div>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  {currentMilestone.reVillageComparison}
                </p>
              </div>
            </div>

            {/* Gear & Spells Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Key Gear */}
              <div className="rounded-xl bg-[#1e293b]/40 p-4 border border-[#334155] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#f472b6] uppercase tracking-wide">
                    <Sword className="w-4 h-4" />
                    Recommended Arsenal & Armor
                  </div>
                  {selectedMilestoneIndex === 0 && (
                    <button
                      onClick={() => {
                        setActiveTab('actionQuests');
                        setSelectedQuestId('honorblade_of_chorrol');
                      }}
                      className="text-[10px] font-mono text-[#38bdf8] hover:underline"
                    >
                      Walkthrough &rarr;
                    </button>
                  )}
                </div>
                <ul className="space-y-2">
                  {currentMilestone.keyGear.map((gear, i) => (
                    <li key={i} className="text-xs text-[#e2e8f0] flex items-start gap-2">
                      <span className="text-[#f472b6] mt-0.5">•</span>
                      <span>{gear}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Spells to Acquire */}
              <div className="rounded-xl bg-[#1e293b]/40 p-4 border border-[#334155] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#a855f7] uppercase tracking-wide">
                  <Zap className="w-4 h-4" />
                  Crucial Spells to Purchase / Craft
                </div>
                <ul className="space-y-2">
                  {currentMilestone.spellsToAcquire.map((spell, i) => (
                    <li key={i} className="text-xs text-[#e2e8f0] flex items-start gap-2">
                      <span className="text-[#a855f7] mt-0.5">•</span>
                      <span>{spell}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Atronach Pro-Tip */}
            <div className="rounded-xl bg-gradient-to-r from-[#1e1b4b] to-[#0f172a] p-4 border border-[#6366f1]/40 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[#818cf8] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#c7d2fe] uppercase tracking-wide mb-1">
                  Atronach Pro-Tip for this Phase
                </div>
                <p className="text-xs sm:text-sm text-[#e0e7ff] leading-relaxed">
                  {currentMilestone.atronachTips}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MAGES GUILD 7-CITY TOUR                                            */}
      {/* ========================================================================= */}
      {activeTab === 'mages' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-[#0f172a] p-5 border border-[#334155] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase text-[#a855f7] font-bold tracking-wider mb-1">
                The Arcane University Key
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f8fafc]">
                The 7 Mages Guild Recommendations Tour
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                To craft custom spells (like Sennecca’s Needle) and enchant your own weapons, you need recommendations from all 7 local guild stewards.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#1e293b] text-[#c084fc] border border-[#334155]">
              Unlocks Spellmaking & Enchanting Altars
            </div>
          </div>

          {/* City Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {MAGES_RECOMMENDATION_GUIDES.map((step) => {
              const isSelected = step.city === selectedCityRecommendation;
              return (
                <button
                  key={step.city}
                  onClick={() => setSelectedCityRecommendation(step.city)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#581c87] border-[#c084fc] text-white font-bold shadow-md shadow-[#581c87]/30'
                      : 'bg-[#0b1329] border-[#1e293b] text-[#94a3b8] hover:bg-[#111c38] hover:text-[#f8fafc]'
                  }`}
                >
                  {step.city}
                </button>
              );
            })}
          </div>

          {/* City Recommendation Card */}
          <div className="rounded-2xl border border-[#a855f7]/40 bg-[#0f172a] p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e293b]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#c084fc] bg-[#3b0764] px-2.5 py-0.5 rounded-full border border-[#581c87]">
                  Steward: {currentMagesCity.stewardName}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#f8fafc] mt-2">
                  {currentMagesCity.city}: {currentMagesCity.questName}
                </h3>
                <div className="text-xs font-mono text-[#38bdf8] mt-1">
                  🎯 Objective: {currentMagesCity.objective}
                </div>
              </div>

              <div className="bg-[#020617] p-3 rounded-xl border border-[#1e293b] self-start">
                <div className="text-[10px] font-mono uppercase text-[#64748b]">Reward / Spell</div>
                <div className="text-xs font-bold text-[#e9d5ff] mt-0.5">{currentMagesCity.lootOrSpellReward}</div>
              </div>
            </div>

            {/* Walkthrough */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-[#e9d5ff] font-bold">
                Actionable Walkthrough:
              </div>
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed bg-[#020617]/70 p-4 rounded-xl border border-[#1e293b]">
                {currentMagesCity.walkthrough}
              </p>
            </div>

            {/* Warning or Trick */}
            <div className="rounded-xl bg-[#451a03]/40 p-4 border border-[#f59e0b]/50 space-y-1">
              <div className="text-xs font-mono uppercase text-[#fcd34d] font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                Pitfall / Pro-Tip to Avoid Failing or Delays:
              </div>
              <p className="text-xs sm:text-sm text-[#fef3c7] leading-relaxed">
                {currentMagesCity.warningOrTrick}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: ARENA GLADIATOR GUIDE                                              */}
      {/* ========================================================================= */}
      {activeTab === 'arena' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-[#0f172a] p-5 border border-[#334155] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#f8fafc]">
                Imperial City Arena Gladiator Handbook
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                From Pit Dog to Grand Champion. Rake in thousands of gold to bankroll your spell purchases.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('actionQuests');
                  setSelectedQuestId('agronak_gray_prince_hack');
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono bg-[#b45309] text-white hover:bg-[#d97706] transition-all cursor-pointer"
              >
                Agronak Gray Prince Hack &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARENA_SURVIVAL_WALKTHROUGH.map((tier) => (
              <div
                key={tier.rank}
                className="rounded-2xl border border-[#1e293b] bg-[#0b1329] p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#f59e0b] uppercase">
                      {tier.rank}
                    </span>
                    <span className="text-xs font-mono text-[#34d399] bg-[#064e3b] px-2 py-0.5 rounded">
                      +{tier.goldReward} Gold
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#f8fafc]">{tier.matchName}</h3>
                  <div className="text-xs text-[#94a3b8]">
                    <strong>Opponents:</strong> {tier.opponentType} ({tier.levelBracket})
                  </div>

                  <div className="bg-[#020617] p-3 rounded-xl border border-[#1e293b] text-xs text-[#cbd5e1] leading-relaxed">
                    <strong className="text-[#38bdf8] block mb-0.5 font-mono">Tactical Plan:</strong>
                    {tier.tactic}
                  </div>
                </div>

                <div className="text-[11px] text-[#64748b] pt-2 border-t border-[#1e293b]">
                  <strong>Perk / Hazard:</strong> {tier.hazardOrPerk}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: CUSTOM SPELL RECIPES                                               */}
      {/* ========================================================================= */}
      {activeTab === 'spells' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-[#0f172a] p-5 border border-[#334155] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#f8fafc]">
                Arcane University Spellcrafting Formulas
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                Custom touch-range and utility recipes designed specifically for Sennecca’s +150 Atronach mana pool.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#1e293b] text-[#f43f5e] border border-[#334155]">
              Touch Spells = Half Magicka Cost
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SENNECCA_SPELL_RECIPES.map((recipe) => (
              <div
                key={recipe.name}
                className="rounded-2xl border border-[#1e293b] bg-[#0b1329] p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#a855f7] uppercase font-bold">
                      {recipe.school} • {recipe.levelRequired}
                    </span>
                    <span className="text-xs font-mono text-[#38bdf8] bg-[#0c2e4e] px-2 py-0.5 rounded">
                      {recipe.magickaCost}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#f8fafc]">{recipe.name}</h3>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {recipe.effects.map((eff, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1e293b] text-[#cbd5e1] border border-[#334155]"
                      >
                        {eff}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tactical Application */}
                <div className="bg-[#020617]/70 p-3 rounded-xl border border-[#1e293b] space-y-1">
                  <div className="text-[10px] font-mono uppercase text-[#38bdf8] font-bold">
                    How to Use in Combat:
                  </div>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    {recipe.tacticalApplication}
                  </p>
                </div>

                {/* Lore Flavor */}
                <div className="text-[11px] italic text-[#94a3b8] border-l-2 border-[#a855f7] pl-3 py-0.5">
                  "{recipe.loreFlavor}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: BOZOG THE SKULLCRUSHER                                             */}
      {/* ========================================================================= */}
      {activeTab === 'bozog' && (
        <div className="rounded-2xl border border-[#b91c1c]/40 bg-gradient-to-br from-[#180d0d] via-[#120808] to-[#1a0f0f] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#3f1616]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#ef4444]/20 text-[#fca5a5] border border-[#ef4444]/40 mb-2">
                <Skull className="w-3.5 h-3.5 text-[#ef4444]" />
                The Husband's Level 12 Berserker Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fef2f2]">
                {BOZOG_CHRONICLE.characterName}
              </h2>
              <p className="text-xs text-[#fca5a5] mt-1">
                {BOZOG_CHRONICLE.playstyle} • {BOZOG_CHRONICLE.status}
              </p>
            </div>

            <button
              onClick={() => {
                if (onOpenEntity) onOpenEntity('azuras_star');
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white hover:from-[#ef4444] hover:to-[#dc2626] transition-all shadow-lg flex items-center gap-2 cursor-pointer self-start"
            >
              <Star className="w-4 h-4 text-[#fef08a]" />
              <span>Inspect Azura’s Star Strategy</span>
            </button>
          </div>

          <p className="text-sm sm:text-base italic text-[#fecaca] bg-[#450a0a]/30 p-4 rounded-xl border border-[#7f1d1d]/40">
            {BOZOG_CHRONICLE.quote}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BOZOG_CHRONICLE.buildMechanics.map((mech, i) => (
              <div
                key={i}
                className="bg-[#240c0c] p-4 rounded-xl border border-[#4d1313] space-y-1.5"
              >
                <div className="text-xs font-mono uppercase text-[#f87171] font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Chaos Mechanic #{i + 1}
                </div>
                <p className="text-xs text-[#fca5a5] leading-relaxed">{mech}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-[#1c0808] p-4 border border-[#5c1d1d] flex items-center justify-between gap-4">
            <div className="text-xs text-[#fca5a5]">
              <strong>Current Quest:</strong> {BOZOG_CHRONICLE.currentMission}
            </div>
            <span className="text-[10px] font-mono uppercase text-[#ef4444] bg-[#450a0a] px-3 py-1 rounded-md border border-[#7f1d1d]">
              Unskilled Chaos Engine
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: WHY THIS CODEX EXISTS (THE LOVE LETTER)                            */}
      {/* ========================================================================= */}
      {activeTab === 'dedication' && (
        <div className="rounded-2xl border border-[#d97706]/40 bg-gradient-to-br from-[#1c140d] via-[#140e08] to-[#19110a] p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#3d2714]">
            <span className="text-xs font-mono uppercase text-[#fbbf24] tracking-wider font-bold">
              The Dedication
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#fef3c7] mt-1">
              {WHY_THIS_CODEX_EXISTS.dedicationTitle}
            </h2>
            <p className="text-xs text-[#d97706] mt-1 font-mono">
              {WHY_THIS_CODEX_EXISTS.authorNote}
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#fde68a]/90 leading-relaxed whitespace-pre-line bg-[#291b0c]/40 p-6 rounded-2xl border border-[#523517]">
            {WHY_THIS_CODEX_EXISTS.lorePhilosophy}
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono uppercase text-[#f59e0b] tracking-wider">
              Core Tenets of the Sandbox:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WHY_THIS_CODEX_EXISTS.coreTenets.map((tenet, idx) => (
                <div
                  key={idx}
                  className="bg-[#24170a] p-4 rounded-xl border border-[#4d3215] text-xs text-[#fde68a] leading-relaxed"
                >
                  {tenet}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DEDICATION MODAL POPUP (Triggered via top banner button) */}
      <AnimatePresence>
        {showDedicationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-[#d97706] bg-[#1a1209] p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#3d2714]">
                <div>
                  <span className="text-xs font-mono uppercase text-[#fbbf24] font-bold">
                    A Note From Drew
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#fef3c7] mt-1">
                    {WHY_THIS_CODEX_EXISTS.dedicationTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDedicationModal(false)}
                  className="p-2 rounded-lg bg-[#291b0c] text-[#fde68a] hover:bg-[#452b12] transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs sm:text-sm text-[#fde68a]/90 leading-relaxed whitespace-pre-line bg-[#291b0c]/50 p-5 rounded-xl border border-[#523517]">
                {WHY_THIS_CODEX_EXISTS.lorePhilosophy}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-[#fbbf24]">The Golden Rules:</div>
                <div className="space-y-2">
                  {WHY_THIS_CODEX_EXISTS.coreTenets.map((t, i) => (
                    <div key={i} className="text-xs text-[#fef3c7] bg-[#24170a] p-3 rounded-lg border border-[#4d3215]">
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowDedicationModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold font-mono bg-[#d97706] text-white hover:bg-[#f59e0b] transition-all cursor-pointer"
                >
                  Enter the Sandbox
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
