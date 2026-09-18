import React, { useState } from 'react';
import {
  Gem,
  PartyMember,
  MonsterPart,
  CulinaryRecipe,
  ActiveCulinaryBuff,
  DiggerDecoration,
} from '../types';
import {
  CULINARY_RECIPES,
  MONSTER_PARTS_CATALOG,
  DIGGER_DECORATIONS,
} from '../data/loreAndCooking';
import { playAudio } from '../audio';
import {
  Flame,
  Utensils,
  Users,
  Home,
  Compass,
  Sparkles,
  Shield,
  Heart,
  Brain,
  Coffee,
  X,
  Check,
  ChevronRight,
  Plus,
  Package,
} from 'lucide-react';

interface TheDiggerModalProps {
  playerSanity: number;
  playerFatigue: number;
  storedGems: Gem[];
  storedMonsterParts: Record<string, number>;
  partyMembers: PartyMember[];
  activeBuffs: ActiveCulinaryBuff[];
  unlockedRecipes: string[];
  decorations: DiggerDecoration[];
  onCookMeal: (recipe: CulinaryRecipe) => void;
  onFeedPartyMember: (memberId: string, recipe: CulinaryRecipe) => void;
  onToggleDecoration: (decorId: string) => void;
  onRestInBunk: () => void;
  onEnterMines: () => void;
  onClose: () => void;
  canDescend: boolean;
}

export const TheDiggerModal: React.FC<TheDiggerModalProps> = ({
  playerSanity,
  playerFatigue,
  storedGems,
  storedMonsterParts,
  partyMembers,
  activeBuffs,
  unlockedRecipes,
  decorations,
  onCookMeal,
  onFeedPartyMember,
  onToggleDecoration,
  onRestInBunk,
  onEnterMines,
  onClose,
  canDescend,
}) => {
  const [activeTab, setActiveTab] = useState<'galley' | 'party' | 'decor' | 'console'>('galley');
  const [selectedRecipe, setSelectedRecipe] = useState<CulinaryRecipe>(CULINARY_RECIPES[0]);
  const [cookingSuccessEffect, setCookingSuccessEffect] = useState<boolean>(false);

  // Group gems by name for ingredient selection
  const gemCountsByName = React.useMemo(() => {
    const counts: Record<string, number> = {};
    storedGems.forEach((g) => {
      counts[g.name] = (counts[g.name] || 0) + 1;
    });
    return counts;
  }, [storedGems]);

  // Check if player has ingredients for selected recipe
  const hasMineral = (gemCountsByName[selectedRecipe.mineralIngredient] || 0) > 0;
  const targetMonsterPart = MONSTER_PARTS_CATALOG.find((p) => p.name === selectedRecipe.faunaIngredient);
  const hasFauna = (targetMonsterPart && (storedMonsterParts[targetMonsterPart.id] || 0) > 0) || false;
  const canCook = hasMineral && hasFauna;

  const handleCook = () => {
    if (!canCook) return;
    playAudio('cook');
    playAudio('eat');
    setCookingSuccessEffect(true);
    setTimeout(() => setCookingSuccessEffect(false), 2200);
    onCookMeal(selectedRecipe);
  };

  const handleRest = () => {
    playAudio('hatch');
    onRestInBunk();
  };

  return (
    <div
      id="the-digger-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn select-none"
    >
      <div
        id="digger-interior-chassis"
        className="relative w-full max-w-6xl h-[92vh] max-h-[850px] bg-stone-900 text-stone-100 rounded-lg shadow-2xl border-2 border-amber-800/60 flex flex-col overflow-hidden"
        style={{
          boxShadow: '0 0 60px rgba(180, 83, 9, 0.2), inset 0 0 80px rgba(0, 0, 0, 0.8)',
          backgroundImage: 'radial-gradient(ellipse at top, #292524 0%, #1c1917 100%)',
        }}
      >
        {/* Top Rig Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-stone-950/80 border-b border-amber-900/40">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 h-9 rounded bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-400 shrink-0">
              <Flame className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif font-black tracking-wider text-sm sm:text-base md:text-lg text-amber-200 uppercase truncate">
                  The Digger
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.2 sm:py-0.5 bg-amber-900/60 text-amber-300 rounded border border-amber-700/50 uppercase shrink-0">
                  Crawler Rig
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-mono text-stone-400 truncate hidden sm:block">
                Track 4 • Heavy Armor Plate • Hearth Galley Online
              </p>
            </div>
          </div>

          {/* Player Sanity & Fatigue HUD Status */}
          <div className="flex items-center gap-2 sm:gap-6 text-xs font-mono shrink-0">
            {/* Mobile Vitals */}
            <div className="flex lg:hidden items-center gap-2 text-[11px] font-mono bg-stone-900/80 px-2 py-1 rounded border border-stone-800">
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" /> {playerSanity}%
              </span>
              <span className="text-stone-600">|</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> {Math.max(0, 100 - playerFatigue)}%
              </span>
            </div>

            {/* Desktop Full Vitals */}
            <div className="hidden lg:flex items-center gap-2 bg-stone-900/80 px-3 py-1.5 rounded border border-stone-800">
              <Brain className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-[10px] text-stone-400 uppercase">Sanity</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-20 h-2 bg-stone-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${playerSanity}%` }}
                    />
                  </div>
                  <span className="font-bold text-purple-300">{playerSanity}%</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-stone-900/80 px-3 py-1.5 rounded border border-stone-800">
              <Heart className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-stone-400 uppercase">Energy</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-20 h-2 bg-stone-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(0, 100 - playerFatigue)}%` }}
                    />
                  </div>
                  <span className="font-bold text-amber-300">{100 - playerFatigue}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playAudio('hatch');
                onClose();
              }}
              className="p-1.5 sm:p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded transition cursor-pointer"
              title="Close Rig"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interior Navigation Tabs */}
        <div className="flex items-center border-b border-stone-800 bg-stone-950/40 px-2 sm:px-6 gap-1 sm:gap-2 overflow-x-auto whitespace-nowrap touch-pan-x">
          <button
            onClick={() => {
              playAudio('paper');
              setActiveTab('galley');
            }}
            className={`flex items-center gap-1.5 py-2.5 sm:py-3 px-2.5 sm:px-4 font-mono text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'galley'
                ? 'border-amber-500 text-amber-300 font-bold bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="hidden sm:inline">Field </span>
            <span>Galley</span>
          </button>

          <button
            onClick={() => {
              playAudio('paper');
              setActiveTab('party');
            }}
            className={`flex items-center gap-1.5 py-2.5 sm:py-3 px-2.5 sm:px-4 font-mono text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'party'
                ? 'border-amber-500 text-amber-300 font-bold bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span>Party</span>
            <span className="hidden sm:inline"> Bunks</span>
            {partyMembers.filter((m) => m.rescued).length > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-900/60 text-emerald-300 rounded-full text-[10px]">
                {partyMembers.filter((m) => m.rescued).length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              playAudio('paper');
              setActiveTab('decor');
            }}
            className={`flex items-center gap-1.5 py-2.5 sm:py-3 px-2.5 sm:px-4 font-mono text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'decor'
                ? 'border-amber-500 text-amber-300 font-bold bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span className="hidden sm:inline">Rig </span>
            <span>Decor</span>
          </button>

          <button
            onClick={() => {
              playAudio('paper');
              setActiveTab('console');
            }}
            className={`flex items-center gap-1.5 py-2.5 sm:py-3 px-2.5 sm:px-4 font-mono text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'console'
                ? 'border-amber-500 text-amber-300 font-bold bg-amber-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>Console</span>
          </button>
        </div>

        {/* Tab Content Areas */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {/* ----------------- TAB 1: FIELD GALLEY & COOKING ----------------- */}
          {activeTab === 'galley' && (
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              {/* Recipe Book Shelf */}
              <div className="w-full lg:w-80 flex flex-col gap-2 shrink-0">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
                  <span className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wide text-amber-200">
                    Subterranean Recipes
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-stone-400">
                    {CULINARY_RECIPES.length} Available
                  </span>
                </div>

                {/* Mobile: Horizontal scroll strip; Desktop: Vertical list */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-none lg:max-h-[500px] pb-1.5 lg:pb-0 pr-0 lg:pr-1 touch-pan-x">
                  {CULINARY_RECIPES.map((recipe) => {
                    const isSelected = selectedRecipe.id === recipe.id;
                    const canCraftThis =
                      (gemCountsByName[recipe.mineralIngredient] || 0) > 0 &&
                      (storedMonsterParts[
                        MONSTER_PARTS_CATALOG.find((p) => p.name === recipe.faunaIngredient)?.id || ''
                      ] || 0) > 0;

                    return (
                      <button
                        key={recipe.id}
                        onClick={() => {
                          playAudio('paper');
                          setSelectedRecipe(recipe);
                        }}
                        className={`text-left p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer min-w-[190px] sm:min-w-[220px] lg:min-w-0 shrink-0 lg:shrink ${
                          isSelected
                            ? 'bg-amber-950/50 border-amber-500 shadow-md ring-1 ring-amber-500/60'
                            : 'bg-stone-900/60 border-stone-800 hover:bg-stone-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-serif font-bold text-xs text-stone-100 truncate">
                            {recipe.name}
                          </span>
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: recipe.visualColor }}
                          />
                        </div>

                        <div className="text-[10px] sm:text-[11px] font-mono text-stone-400 mt-1 flex items-center justify-between">
                          <span>{recipe.dishType}</span>
                          {canCraftThis ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-0.5 text-[9px] sm:text-[10px]">
                              <Check className="w-3 h-3" /> Ready
                            </span>
                          ) : (
                            <span className="text-stone-500 text-[9px] sm:text-[10px]">Missing</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Pantry Preview */}
                <div className="hidden lg:block mt-auto p-3 bg-stone-950/60 border border-stone-800 rounded-lg">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1.5 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    Locker Fauna & Fungus
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-stone-300">
                    {MONSTER_PARTS_CATALOG.map((part) => (
                      <div key={part.id} className="flex justify-between bg-stone-900/60 px-2 py-1 rounded">
                        <span className="truncate">{part.name}</span>
                        <span className="font-bold text-amber-300">
                          x{storedMonsterParts[part.id] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cooking Stove Station */}
              <div className="flex-1 bg-stone-950/60 border border-stone-800/80 rounded-xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
                {/* Visual Cast Iron Stove Background Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

                <div>
                  {/* Dish Title & Type */}
                  <div className="flex items-start justify-between border-b border-stone-800 pb-4">
                    <div>
                      <div className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                        {selectedRecipe.dishType} Recipe
                      </div>
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-100 mt-0.5">
                        {selectedRecipe.name}
                      </h2>
                      <p className="text-stone-300 text-sm mt-1 leading-relaxed font-sans max-w-xl">
                        {selectedRecipe.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono text-stone-400">Restoration Value</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-mono text-purple-400 font-bold">
                          +{selectedRecipe.sanityRestore} Sanity
                        </span>
                        <span className="text-xs font-mono text-amber-400 font-bold">
                          +{selectedRecipe.fatigueRestore} Energy
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Required Mineral & Fauna Ingredients */}
                  <div className="my-6">
                    <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-3">
                      Required Skillet Ingredients:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Mineral Ingredient Box */}
                      <div
                        className={`p-4 rounded-lg border ${
                          hasMineral
                            ? 'bg-stone-900/80 border-amber-700/60'
                            : 'bg-stone-950/40 border-stone-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-amber-400 uppercase">
                            Mineral Core
                          </span>
                          <span
                            className={`text-xs font-mono font-bold ${
                              hasMineral ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {gemCountsByName[selectedRecipe.mineralIngredient] || 0} in Vault
                          </span>
                        </div>
                        <div className="font-serif font-bold text-base text-stone-100 mt-1">
                          {selectedRecipe.mineralIngredient}
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          Imparts crystalline resonance and thermal durability to the skillet.
                        </p>
                      </div>

                      {/* Monster / Fauna Ingredient Box */}
                      <div
                        className={`p-4 rounded-lg border ${
                          hasFauna
                            ? 'bg-stone-900/80 border-amber-700/60'
                            : 'bg-stone-950/40 border-stone-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-cyan-400 uppercase">
                            Subterranean Protein
                          </span>
                          <span
                            className={`text-xs font-mono font-bold ${
                              hasFauna ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {targetMonsterPart ? storedMonsterParts[targetMonsterPart.id] || 0 : 0} in Locker
                          </span>
                        </div>
                        <div className="font-serif font-bold text-base text-stone-100 mt-1">
                          {selectedRecipe.faunaIngredient}
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          {targetMonsterPart?.flavorProfile || 'Rich in cave minerals and organic fat.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Culinary Delve Buff */}
                  <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-lg flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-serif font-bold text-amber-200 text-sm">
                        {selectedRecipe.buffTitle}: {selectedRecipe.buffDescription}
                      </div>
                      <div className="text-xs text-stone-300 italic mt-0.5">
                        Flavor Profile: "{selectedRecipe.tasteNotes}"
                      </div>
                      <div className="text-[11px] font-mono text-amber-400/80 mt-1">
                        Active Duration: {selectedRecipe.buffDurationShafts} Delve Shafts
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sizzle Action & Feedback */}
                <div className="mt-6 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs font-mono text-stone-400">
                    {canCook
                      ? 'Ingredients prepped on the iron griddle.'
                      : 'Mine deeper into Big Cave to harvest missing gems or monster meat.'}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      id="cook-meal-btn"
                      disabled={!canCook}
                      onClick={handleCook}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-mono text-sm uppercase tracking-wider font-bold transition-all shadow-lg ${
                        canCook
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer shadow-amber-900/50 hover:scale-105 active:scale-95'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <Flame className="w-4 h-4" />
                      Sizzle & Feast
                    </button>
                  </div>
                </div>

                {/* Success cooking banner */}
                {cookingSuccessEffect && (
                  <div className="absolute inset-x-4 top-4 p-4 bg-emerald-900/90 border border-emerald-500 text-emerald-100 rounded-lg shadow-2xl flex items-center justify-between animate-fadeIn z-20">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-emerald-300 animate-spin" />
                      <div>
                        <div className="font-serif font-bold text-base">Delicious! {selectedRecipe.name} Ready!</div>
                        <div className="text-xs font-mono text-emerald-200">
                          +{selectedRecipe.sanityRestore} Sanity • +{selectedRecipe.fatigueRestore} Energy • Buff Activated
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------- TAB 2: PARTY BUNKS & LOUNGE ----------------- */}
          {activeTab === 'party' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-100">
                    Rescued Townsfolk & Expedition Party
                  </h3>
                  <p className="text-xs font-mono text-stone-400 mt-0.5">
                    Miners driven mad or trapped by corporate greed. Fed and sheltered in your mobile haven.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {partyMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`rounded-xl border p-5 flex flex-col justify-between relative overflow-hidden ${
                      member.rescued
                        ? 'bg-stone-950/70 border-stone-800'
                        : 'bg-stone-950/30 border-dashed border-stone-800/80 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-serif font-bold text-lg text-stone-100">
                            {member.name}
                          </div>
                          <div className="text-xs font-mono text-amber-400 font-semibold">
                            {member.classTitle}
                          </div>
                        </div>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                          style={{
                            backgroundColor: member.rescued ? `${member.color}33` : '#292524',
                            color: member.rescued ? member.color : '#78716c',
                            border: `1px solid ${member.rescued ? member.color : '#44403c'}`,
                          }}
                        >
                          {member.id[0].toUpperCase()}
                        </div>
                      </div>

                      {member.rescued ? (
                        <>
                          <div className="mt-4 p-3 bg-stone-900/80 rounded-lg text-xs font-serif italic text-stone-300 border border-stone-800">
                            "{member.currentThought}"
                          </div>

                          <div className="mt-4 space-y-2 text-xs font-mono">
                            <div className="flex justify-between text-stone-400">
                              <span>Sanity Clarity:</span>
                              <span className="font-bold text-purple-400">{member.sanity}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500"
                                style={{ width: `${member.sanity}%` }}
                              />
                            </div>

                            <div className="pt-2 text-stone-300">
                              <span className="text-amber-400 font-semibold">Vein Traversed: </span>
                              {member.veinUnlockTitle}
                            </div>
                            <div className="text-stone-400 text-[11px]">
                              {member.perkDescription}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="my-8 text-center space-y-2">
                          <div className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                            Trapped in Vein {member.rescueVein}
                          </div>
                          <p className="text-xs text-stone-400 font-serif italic max-w-xs mx-auto">
                            {member.rescueStory}
                          </p>
                          <div className="text-[11px] font-mono text-amber-500/80">
                            Delve into Vein {member.rescueVein} to rescue!
                          </div>
                        </div>
                      )}
                    </div>

                    {member.rescued && (
                      <div className="mt-6 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-stone-400">
                          {member.favoriteFoodNote}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- TAB 3: RIG CUSTOMIZATION ----------------- */}
          {activeTab === 'decor' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-100">
                    Cozy Rig Customization & Warmth
                  </h3>
                  <p className="text-xs font-mono text-stone-400 mt-0.5">
                    Turn this rolling iron tank into a home with quilts, amber lamps, and mountain keepsakes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {decorations.map((decor) => (
                  <div
                    key={decor.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      decor.equipped
                        ? 'bg-amber-950/30 border-amber-500 shadow-md'
                        : decor.unlocked
                        ? 'bg-stone-900/60 border-stone-800'
                        : 'bg-stone-950/40 border-stone-800/50 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-amber-400 uppercase">
                          {decor.category}
                        </span>
                        {decor.equipped ? (
                          <span className="text-[10px] font-mono font-bold bg-amber-600 text-stone-950 px-2 py-0.5 rounded">
                            Equipped
                          </span>
                        ) : decor.unlocked ? (
                          <span className="text-[10px] font-mono text-stone-400">In Locker</span>
                        ) : (
                          <span className="text-[10px] font-mono text-stone-500">Locked</span>
                        )}
                      </div>

                      <div className="font-serif font-bold text-base text-stone-100 mt-1">
                        {decor.name}
                      </div>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        {decor.description}
                      </p>

                      <div className="mt-3 p-2 bg-stone-950/60 rounded border border-stone-800/60 text-xs font-mono text-amber-300">
                        ✨ {decor.cozyBonus}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playAudio('paper');
                        onToggleDecoration(decor.id);
                      }}
                      disabled={!decor.unlocked}
                      className={`mt-4 w-full py-2 rounded font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                        decor.equipped
                          ? 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                          : decor.unlocked
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                          : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                      }`}
                    >
                      {decor.equipped ? 'Unequip' : decor.unlocked ? 'Mount in Rig' : 'Locked'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- TAB 4: EXPEDITION CONSOLE ----------------- */}
          {activeTab === 'console' && (
            <div className="max-w-2xl mx-auto space-y-6 text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-950 border-2 border-amber-600 flex items-center justify-center text-amber-400">
                <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '12s' }} />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-100">
                  Subterranean Departure Console
                </h3>
                <p className="text-sm text-stone-400 font-mono mt-1">
                  Check rig pressure, review your party, and begin the next descent into Big Cave.
                </p>
              </div>

              {/* Active Buffs Summary */}
              <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-xl text-left">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Active Culinary Sustenance Buffs
                </div>
                {activeBuffs.length === 0 ? (
                  <p className="text-xs text-stone-500 font-mono italic">
                    No meals currently active. Cook a meal in the Galley to safeguard sanity and boost strikes!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {activeBuffs.map((buff, i) => (
                      <div key={i} className="flex items-center justify-between text-xs font-mono bg-stone-900/60 p-2 rounded">
                        <div>
                          <span className="font-bold text-amber-300">{buff.buffTitle}</span>
                          <span className="text-stone-400 ml-2">({buff.name})</span>
                        </div>
                        <span className="text-stone-500">
                          {buff.shaftsRemaining} Delves Remaining
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={handleRest}
                  className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Coffee className="w-4 h-4 text-amber-400" />
                  Rest in Bunk (Recover Energy)
                </button>

                <button
                  id="descend-into-mines-btn"
                  onClick={() => {
                    playAudio('hatch');
                    onEnterMines();
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg font-mono text-sm uppercase tracking-wider font-bold transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-amber-900/50 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                  Descend Shaft Into Big Cave
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
