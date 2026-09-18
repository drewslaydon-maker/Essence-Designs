import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Gem,
  VaultState,
  PlayerProgression,
  CharacterProfile,
  CavernTheme,
  PartyMember,
  CulinaryRecipe,
  ActiveCulinaryBuff,
  NewspaperArticle,
  DiggerDecoration,
} from './types';
import {
  GEM_CATALOG,
  CAVERN_THEMES,
  CHARACTER_SAVE_KEY,
  INITIAL_VAULT_KEY,
  DETAILED_VAULT_KEY,
  PROGRESSION_SAVE_KEY,
  INITIAL_PROGRESSION,
  getXpRequiredForLevel,
} from './data/gems';
import {
  INITIAL_PARTY_MEMBERS,
  NEWSPAPER_ISSUES,
  DIGGER_DECORATIONS,
  CULINARY_RECIPES,
  MONSTER_PARTS_CATALOG,
} from './data/loreAndCooking';
import {
  initAudio,
  setMuted,
  playAudio,
  startCavernMusic,
  stopCavernMusic,
} from './audio';
import { MiningCanvas } from './components/MiningCanvas';
import { HUD } from './components/HUD';
import { TownHub } from './components/TownHub';
import { TheDiggerModal } from './components/TheDiggerModal';
import { MinerIssueModal } from './components/MinerIssueModal';
import { RescueModal } from './components/RescueModal';
import { CharacterCreatorModal } from './components/CharacterCreatorModal';
import { LevelUpModal } from './components/LevelUpModal';
import { CavernForkModal } from './components/CavernForkModal';
import { ExpeditionSummaryModal } from './components/ExpeditionSummaryModal';
import { VelvetVaultModal } from './components/VelvetVaultModal';

const SANITY_KEY = 'appalachian_sanity_v1';
const FATIGUE_KEY = 'appalachian_fatigue_v1';
const PARTY_KEY = 'appalachian_party_v1';
const MONSTER_PARTS_KEY = 'appalachian_monster_parts_v1';
const NEWSPAPERS_KEY = 'appalachian_newspapers_v1';
const DECOR_KEY = 'appalachian_decor_v1';
const CONSECUTIVE_SHAFTS_KEY = 'appalachian_shafts_no_meal_v1';

export default function App() {
  // Character Profile State
  const [character, setCharacter] = useState<CharacterProfile | null>(() => {
    try {
      const saved = localStorage.getItem(CHARACTER_SAVE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load character save:', e);
    }
    return null;
  });

  // Game Phases:
  // - CHARACTER_CREATOR: Miner profile creation & customization
  // - TOWN_HUB: 2D walkable Mountain Town hub world (Intro/Default)
  // - PLAYING: Active cavern wall mining delve
  // - LEVEL_UP: RPG Perk talent tree selection
  // - SUMMARY: Shaft completion report & loot check
  // - CAVERN_FORK: Crossroads path choice
  // - VAULT: Velvet Vault gemstone collection
  // - DIGGER: Subterranean crawler rig (galley cooking, lounge, customization)
  // - NEWSPAPER: The Miner Issue archives
  // - RESCUE: Rescued party member milestone modal
  const [gamePhase, setGamePhase] = useState<
    | 'CHARACTER_CREATOR'
    | 'TOWN_HUB'
    | 'PLAYING'
    | 'LEVEL_UP'
    | 'SUMMARY'
    | 'CAVERN_FORK'
    | 'VAULT'
    | 'DIGGER'
    | 'NEWSPAPER'
    | 'RESCUE'
  >(() => {
    try {
      const saved = localStorage.getItem(CHARACTER_SAVE_KEY);
      if (saved) return 'TOWN_HUB';
    } catch {}
    return 'CHARACTER_CREATOR';
  });

  const [returnPhaseAfterModal, setReturnPhaseAfterModal] = useState<
    'TOWN_HUB' | 'PLAYING' | 'SUMMARY'
  >('TOWN_HUB');

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [regenerateTrigger, setRegenerateTrigger] = useState<number>(0);

  // Sector and Shaft Delve System (Veins divided into 3s: X-1, X-2, X-3)
  const [sector, setSector] = useState<number>(1);
  const [shaftInSector, setShaftInSector] = useState<number>(1);
  const [currentCavernTheme, setCurrentCavernTheme] = useState<CavernTheme>(
    CAVERN_THEMES.granite
  );

  // Crossroad choices state
  const [crossroadChoices, setCrossroadChoices] = useState<CavernTheme[]>([]);

  // Expedition stats for current shaft
  const [shaftGems, setShaftGems] = useState<Gem[]>([]);
  const [shaftGeodes, setShaftGeodes] = useState<number>(0);
  const [shaftXpGained, setShaftXpGained] = useState<number>(0);
  const [isShaftCleared, setIsShaftCleared] = useState<boolean>(false);

  // Sanity & Fatigue State (Delicious in Dungeon Sustenance mechanics)
  const [playerSanity, setPlayerSanity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(SANITY_KEY);
      if (saved) return Math.min(100, Math.max(10, Number(saved)));
    } catch {}
    return 100;
  });

  const [playerFatigue, setPlayerFatigue] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(FATIGUE_KEY);
      if (saved) return Math.min(100, Math.max(0, Number(saved)));
    } catch {}
    return 0;
  });

  const [consecutiveShaftsWithoutMeal, setConsecutiveShaftsWithoutMeal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(CONSECUTIVE_SHAFTS_KEY);
      if (saved) return Number(saved);
    } catch {}
    return 0;
  });

  // Active Culinary Buffs
  const [activeBuffs, setActiveBuffs] = useState<ActiveCulinaryBuff[]>([]);

  // Harvested Monster Parts & Cave Flora Locker
  const [storedMonsterParts, setStoredMonsterParts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(MONSTER_PARTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Starter pantry
    return {
      cave_beetle_meat: 3,
      phosphor_morel: 2,
      salt_crust_lichen: 3,
      geode_marrow: 1,
    };
  });

  // Party Members (Mage Ronald, Rogue Vesper, Warrior Brann)
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>(() => {
    try {
      const saved = localStorage.getItem(PARTY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PARTY_MEMBERS;
  });

  // Active Rescued Soul currently displayed in RescueModal
  const [activeRescuedMember, setActiveRescuedMember] = useState<PartyMember | null>(null);

  // The Miner Issue Newspaper Archive
  const [newspaperArticles, setNewspaperArticles] = useState<NewspaperArticle[]>(() => {
    try {
      const saved = localStorage.getItem(NEWSPAPERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return NEWSPAPER_ISSUES;
  });

  // The Digger Rig Decorations
  const [decorations, setDecorations] = useState<DiggerDecoration[]>(() => {
    try {
      const saved = localStorage.getItem(DECOR_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DIGGER_DECORATIONS;
  });

  // Persistent Player Progression (Level, XP, Chosen RPG Perks)
  const [progression, setProgression] = useState<PlayerProgression>(() => {
    try {
      const saved = localStorage.getItem(PROGRESSION_SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PROGRESSION,
          ...parsed,
          selectedPerkIds: Array.isArray(parsed.selectedPerkIds)
            ? parsed.selectedPerkIds
            : [],
          stats: {
            ...INITIAL_PROGRESSION.stats,
            ...(parsed.stats || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Could not load progression save:', e);
    }
    return { ...INITIAL_PROGRESSION };
  });

  // Persistent Vault State
  const [vaultState, setVaultState] = useState<VaultState>(() => {
    let initialDiscovered: string[] = [];
    let initialCounts: Record<string, number> = {};
    let initialExpeditions = 0;
    let initialDeepestStratum = 1;

    try {
      const v1Data = localStorage.getItem(INITIAL_VAULT_KEY);
      if (v1Data) {
        const parsed = JSON.parse(v1Data);
        if (Array.isArray(parsed)) {
          initialDiscovered = parsed;
          parsed.forEach((id: string) => {
            initialCounts[id] = (initialCounts[id] || 0) + 1;
          });
        }
      }

      const detailedData = localStorage.getItem(DETAILED_VAULT_KEY);
      if (detailedData) {
        const parsedDetailed = JSON.parse(detailedData);
        if (parsedDetailed.gemCounts) initialCounts = parsedDetailed.gemCounts;
        if (parsedDetailed.totalExpeditions)
          initialExpeditions = parsedDetailed.totalExpeditions;
        if (parsedDetailed.deepestStratum)
          initialDeepestStratum = parsedDetailed.deepestStratum;
      }
    } catch {}

    // Seed some initial basic minerals if empty so player can experiment with cooking
    if (Object.keys(initialCounts).length === 0) {
      initialCounts['quartz'] = 3;
      initialCounts['granite_flint'] = 2;
      initialDiscovered = ['quartz', 'granite_flint'];
    }

    return {
      discoveredGems: initialDiscovered,
      gemCounts: initialCounts,
      totalExpeditions: initialExpeditions,
      totalStrikesUsed: 0,
      deepestStratum: initialDeepestStratum,
    };
  });

  // All currently stored gems as an array for the Cooking Griddle
  const storedGemsList = useMemo<Gem[]>(() => {
    const list: Gem[] = [];
    Object.entries(vaultState.gemCounts).forEach(([gemId, rawCount]) => {
      const gemDef = GEM_CATALOG.find((g) => g.id === gemId);
      const count = Number(rawCount) || 0;
      if (gemDef) {
        for (let i = 0; i < count; i++) {
          list.push(gemDef);
        }
      }
    });
    return list;
  }, [vaultState.gemCounts]);

  // Calculate Base Strikes per shaft
  // Base: 18 strikes
  // Deep Delver class: +4 strikes
  // Iron Stamina perk: +4 strikes
  // Active Culinary Buff: e.g. +3 or +6 strikes!
  const baseStrikes = useMemo(() => {
    let strikesTotal = 18;
    if (character?.minerClass === 'deep_delver') strikesTotal += 4;
    if (progression.selectedPerkIds.includes('iron_stamina')) strikesTotal += 4;

    // Add culinary buff strikes
    activeBuffs.forEach((buff) => {
      if (buff.buffType === 'bonus_strikes' || buff.buffType === 'greed_ward') {
        strikesTotal += buff.buffValue;
      }
    });

    // Party rescue perk: Ronald the Mage adds concussive energy
    const mageRescued = partyMembers.find((m) => m.id === 'mage')?.rescued;
    if (mageRescued) strikesTotal += 2;

    return strikesTotal;
  }, [character?.minerClass, progression.selectedPerkIds, activeBuffs, partyMembers]);

  const [strikes, setStrikes] = useState<number>(baseStrikes);

  // Synchronize strikes when base strikes changes
  useEffect(() => {
    if (gamePhase === 'PLAYING' && strikes < baseStrikes) {
      // Keep existing strikes unless entering fresh
    }
  }, [baseStrikes, gamePhase, strikes]);

  // Persist State to LocalStorage
  const saveProgression = useCallback((newProgression: PlayerProgression) => {
    try {
      localStorage.setItem(PROGRESSION_SAVE_KEY, JSON.stringify(newProgression));
    } catch (e) {
      console.warn('Failed to save progression:', e);
    }
  }, []);

  const saveVault = useCallback((state: VaultState) => {
    try {
      localStorage.setItem(INITIAL_VAULT_KEY, JSON.stringify(state.discoveredGems));
      localStorage.setItem(
        DETAILED_VAULT_KEY,
        JSON.stringify({
          gemCounts: state.gemCounts,
          totalExpeditions: state.totalExpeditions,
          deepestStratum: state.deepestStratum,
        })
      );
    } catch (err) {
      console.warn('Failed to save vault to localStorage', err);
    }
  }, []);

  const saveSanityAndFatigue = useCallback((san: number, fat: number) => {
    try {
      localStorage.setItem(SANITY_KEY, san.toString());
      localStorage.setItem(FATIGUE_KEY, fat.toString());
    } catch {}
  }, []);

  const saveParty = useCallback((party: PartyMember[]) => {
    try {
      localStorage.setItem(PARTY_KEY, JSON.stringify(party));
    } catch {}
  }, []);

  const saveMonsterParts = useCallback((parts: Record<string, number>) => {
    try {
      localStorage.setItem(MONSTER_PARTS_KEY, JSON.stringify(parts));
    } catch {}
  }, []);

  const saveNewspapers = useCallback((papers: NewspaperArticle[]) => {
    try {
      localStorage.setItem(NEWSPAPERS_KEY, JSON.stringify(papers));
    } catch {}
  }, []);

  const saveDecor = useCallback((dec: DiggerDecoration[]) => {
    try {
      localStorage.setItem(DECOR_KEY, JSON.stringify(dec));
    } catch {}
  }, []);

  // Audio & Generative Background Music control
  useEffect(() => {
    if (gamePhase === 'PLAYING') {
      startCavernMusic(currentCavernTheme);
    } else {
      stopCavernMusic(false);
    }
  }, [gamePhase, currentCavernTheme]);

  // Handle Level Up & XP Awarding
  const awardXp = useCallback(
    (amount: number) => {
      setProgression((prev) => {
        let currentXp = prev.xp + amount;
        let currentLevel = prev.level;
        let pendingPerkChoices = prev.pendingPerkChoices;
        let xpRequired = prev.xpToNextLevel;
        let leveledUp = false;

        while (currentXp >= xpRequired) {
          currentXp -= xpRequired;
          currentLevel += 1;
          pendingPerkChoices += 1;
          xpRequired = getXpRequiredForLevel(currentLevel);
          leveledUp = true;
        }

        if (leveledUp) {
          playAudio('levelUp');
        }

        const nextProgression: PlayerProgression = {
          ...prev,
          level: currentLevel,
          xp: currentXp,
          xpToNextLevel: xpRequired,
          pendingPerkChoices,
          stats: {
            ...prev.stats,
            totalXpEarned: prev.stats.totalXpEarned + amount,
          },
        };

        saveProgression(nextProgression);
        return nextProgression;
      });

      setShaftXpGained((prev) => prev + amount);
    },
    [saveProgression]
  );

  // Saving character profile from Character Creator
  const handleSaveProfile = (profile: CharacterProfile) => {
    try {
      localStorage.setItem(CHARACTER_SAVE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save character profile:', e);
    }
    setCharacter(profile);
    initAudio();
    setGamePhase('TOWN_HUB');
  };

  // Strikes used in canvas
  const handleStrikeUsed = (newStrikes: number) => {
    setStrikes(newStrikes);
  };

  // Slag shattered
  const handleSlagShattered = () => {
    const xp = character?.minerClass === 'tunnel_scavenger' ? 25 : 12;
    awardXp(xp);
    setProgression((prev) => {
      const next = {
        ...prev,
        stats: {
          ...prev.stats,
          totalSlagMined: prev.stats.totalSlagMined + 1,
        },
      };
      saveProgression(next);
      return next;
    });
  };

  // Gem recovered
  const handleGemRecovered = (gem: Gem, xpAwarded: number) => {
    awardXp(xpAwarded);
    setShaftGems((prev) => [...prev, gem]);

    setProgression((prev) => {
      const next = {
        ...prev,
        stats: {
          ...prev.stats,
          totalGemsMined: prev.stats.totalGemsMined + 1,
        },
      };
      saveProgression(next);
      return next;
    });

    setVaultState((prev) => {
      const alreadyDiscovered = prev.discoveredGems.includes(gem.id);
      const nextDiscovered = alreadyDiscovered
        ? prev.discoveredGems
        : [...prev.discoveredGems, gem.id];
      const nextCounts = {
        ...prev.gemCounts,
        [gem.id]: (prev.gemCounts[gem.id] || 0) + 1,
      };

      const nextState: VaultState = {
        ...prev,
        discoveredGems: nextDiscovered,
        gemCounts: nextCounts,
      };
      saveVault(nextState);
      return nextState;
    });
  };

  // Geode triggered
  const handleGeodeTriggered = () => {
    awardXp(40);
    setShaftGeodes((prev) => prev + 1);
    setProgression((prev) => {
      const next = {
        ...prev,
        stats: {
          ...prev.stats,
          totalGeodesMined: prev.stats.totalGeodesMined + 1,
        },
      };
      saveProgression(next);
      return next;
    });
  };

  // Organic monster part or cave flora harvested from rock shatter
  const handleMonsterPartHarvested = (partId: string, partName: string) => {
    playAudio('paper');
    setStoredMonsterParts((prev) => {
      const updated = {
        ...prev,
        [partId]: (prev[partId] || 0) + 1,
      };
      saveMonsterParts(updated);
      return updated;
    });
  };

  // Check Trapped Miner Rescue & Hunger Penalty on Shaft Completion
  const evaluateShaftEndOutcomes = () => {
    // 1. Tick culinary buffs duration
    setActiveBuffs((prev) =>
      prev
        .map((b) => ({ ...b, shaftsRemaining: b.shaftsRemaining - 1 }))
        .filter((b) => b.shaftsRemaining > 0)
    );

    // 2. Delicious in Dungeon Hunger & Sanity mechanics:
    // If player has mined 3 consecutive shafts without cooking a meal, penalty strikes!
    const nextConsecutive = consecutiveShaftsWithoutMeal + 1;
    setConsecutiveShaftsWithoutMeal(nextConsecutive);
    localStorage.setItem(CONSECUTIVE_SHAFTS_KEY, nextConsecutive.toString());

    if (nextConsecutive >= 3 && activeBuffs.length === 0) {
      // Greed corruption / exhaustion penalty
      playAudio('crack');
      const penalizedSanity = Math.max(15, playerSanity - 18);
      const penalizedFatigue = Math.min(85, playerFatigue + 22);
      setPlayerSanity(penalizedSanity);
      setPlayerFatigue(penalizedFatigue);
      saveSanityAndFatigue(penalizedSanity, penalizedFatigue);
    }

    // 3. Trapped Miner Rescue Triggers
    // Sector 1 (Vein 1): Mage Ronald
    // Sector 2 (Vein 2): Rogue Vesper
    // Sector 3 (Vein 3): Warrior Brann
    let targetRescueId: string | null = null;
    if (sector === 1 && (shaftInSector >= 2 || isShaftCleared)) {
      const ronald = partyMembers.find((m) => m.id === 'mage');
      if (ronald && !ronald.rescued) targetRescueId = 'mage';
    } else if (sector === 2 && (shaftInSector >= 2 || isShaftCleared)) {
      const vesper = partyMembers.find((m) => m.id === 'rogue');
      if (vesper && !vesper.rescued) targetRescueId = 'rogue';
    } else if (sector === 3 && (shaftInSector >= 2 || isShaftCleared)) {
      const brann = partyMembers.find((m) => m.id === 'warrior');
      if (brann && !brann.rescued) targetRescueId = 'warrior';
    }

    if (targetRescueId) {
      playAudio('rescue');
      let rescuedRef: PartyMember | null = null;
      setPartyMembers((prev) => {
        const updated = prev.map((m) => {
          if (m.id === targetRescueId) {
            rescuedRef = { ...m, rescued: true, sanity: 75 };
            return rescuedRef;
          }
          return m;
        });
        saveParty(updated);
        return updated;
      });

      // Unlock special edition of The Miner Issue
      setNewspaperArticles((prev) => {
        const targetIssueId =
          targetRescueId === 'mage'
            ? 'issue-141'
            : targetRescueId === 'rogue'
            ? 'issue-156'
            : 'issue-170';
        const updated = prev.map((art) =>
          art.id === targetIssueId ? { ...art, unlockedByDefault: true } : art
        );
        saveNewspapers(updated);
        return updated;
      });

      if (rescuedRef) {
        setActiveRescuedMember(rescuedRef);
        setGamePhase('RESCUE');
        return true;
      }
    }

    return false;
  };

  // Wall Cleared: All rocks broken!
  const handleWallCleared = (leftoverStrikes: number) => {
    const clearBonus = 160 + leftoverStrikes * 20;
    awardXp(clearBonus);
    setIsShaftCleared(true);

    setProgression((prev) => {
      const next = {
        ...prev,
        stats: {
          ...prev.stats,
          totalWallsCleared: prev.stats.totalWallsCleared + 1,
        },
      };
      saveProgression(next);
      return next;
    });

    const hadRescue = evaluateShaftEndOutcomes();
    if (!hadRescue) {
      setGamePhase('SUMMARY');
    }
  };

  // Mine Depleted: Strikes hit 0
  const handleMineDepleted = () => {
    setIsShaftCleared(false);
    const hadRescue = evaluateShaftEndOutcomes();
    if (!hadRescue) {
      setGamePhase('SUMMARY');
    }
  };

  // Proceeding to next shaft or to Crossroads choice
  const handleNextShaft = () => {
    initAudio();

    if (shaftInSector < 3) {
      // Advance to next shaft in this sector (e.g. 1-1 -> 1-2, or 1-2 -> 1-3)
      setShaftInSector((prev) => prev + 1);
      setStrikes(baseStrikes);
      setShaftGems([]);
      setShaftGeodes(0);
      setShaftXpGained(0);
      setIsShaftCleared(false);
      setRegenerateTrigger((prev) => prev + 1);
      setGamePhase('PLAYING');
    } else {
      // Completed shaft 3 of sector! Trigger Cavern Fork Crossroads
      const availableThemes = Object.values(CAVERN_THEMES).filter(
        (t) => t.id !== currentCavernTheme.id && t.id !== 'granite'
      );
      // Pick 2 random distinct themes
      const shuffled = [...availableThemes].sort(() => Math.random() - 0.5);
      const choices = shuffled.slice(0, 2);
      setCrossroadChoices(choices);
      setGamePhase('CAVERN_FORK');
    }
  };

  // Selecting cavern route from crossroads
  const handleSelectCavern = (chosenTheme: CavernTheme) => {
    setCurrentCavernTheme(chosenTheme);
    setSector((prev) => prev + 1);
    setShaftInSector(1);
    setStrikes(baseStrikes);
    setShaftGems([]);
    setShaftGeodes(0);
    setShaftXpGained(0);
    setIsShaftCleared(false);
    setRegenerateTrigger((prev) => prev + 1);
    setGamePhase('PLAYING');
  };

  // Cook a meal in The Digger Field Galley
  const handleCookMeal = (recipe: CulinaryRecipe) => {
    // 1. Deduct mineral gem from vault counts
    const matchingGemDef = GEM_CATALOG.find((g) => g.name === recipe.mineralIngredient);
    if (matchingGemDef && (vaultState.gemCounts[matchingGemDef.id] || 0) > 0) {
      setVaultState((prev) => {
        const nextCounts = {
          ...prev.gemCounts,
          [matchingGemDef.id]: Math.max(0, (prev.gemCounts[matchingGemDef.id] || 0) - 1),
        };
        const nextState = { ...prev, gemCounts: nextCounts };
        saveVault(nextState);
        return nextState;
      });
    }

    // 2. Deduct monster part from locker
    const targetMonsterPart = MONSTER_PARTS_CATALOG.find(
      (p) => p.name === recipe.faunaIngredient
    );
    if (targetMonsterPart && (storedMonsterParts[targetMonsterPart.id] || 0) > 0) {
      setStoredMonsterParts((prev) => {
        const nextParts = {
          ...prev,
          [targetMonsterPart.id]: Math.max(0, (prev[targetMonsterPart.id] || 0) - 1),
        };
        saveMonsterParts(nextParts);
        return nextParts;
      });
    }

    // 3. Restore Sanity & clear Fatigue
    const newSanity = Math.min(100, playerSanity + recipe.sanityRestore);
    const newFatigue = Math.max(0, playerFatigue - recipe.fatigueRestore);
    setPlayerSanity(newSanity);
    setPlayerFatigue(newFatigue);
    saveSanityAndFatigue(newSanity, newFatigue);

    // Reset hunger timer
    setConsecutiveShaftsWithoutMeal(0);
    localStorage.setItem(CONSECUTIVE_SHAFTS_KEY, '0');

    // 4. Apply culinary delve buff
    const newBuff: ActiveCulinaryBuff = {
      id: `${recipe.id}-${Date.now()}`,
      recipeId: recipe.id,
      name: recipe.name,
      buffTitle: recipe.buffTitle,
      buffDescription: recipe.buffDescription,
      buffType: recipe.buffType,
      buffValue: recipe.buffValue,
      shaftsRemaining: recipe.buffDurationShafts,
    };
    setActiveBuffs((prev) => [newBuff, ...prev.filter((b) => b.name !== recipe.name)]);
  };

  // Feed a party member
  const handleFeedPartyMember = (memberId: string, recipe: CulinaryRecipe) => {
    playAudio('eat');
    setPartyMembers((prev) => {
      const updated = prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            sanity: Math.min(100, m.sanity + 25),
            hunger: Math.max(0, m.hunger - 35),
            currentThought: `That ${recipe.name} hit the spot! My hands have stopped shaking.`,
          };
        }
        return m;
      });
      saveParty(updated);
      return updated;
    });
  };

  // Toggle rig decoration
  const handleToggleDecoration = (decorId: string) => {
    setDecorations((prev) => {
      const updated = prev.map((d) =>
        d.id === decorId ? { ...d, equipped: !d.equipped } : d
      );
      saveDecor(updated);
      return updated;
    });
  };

  // Rest in The Digger Bunk
  const handleRestInBunk = () => {
    playAudio('eat');
    setPlayerFatigue((prev) => Math.max(0, prev - 30));
    setPlayerSanity((prev) => Math.min(100, prev + 10));
    saveSanityAndFatigue(Math.min(100, playerSanity + 10), Math.max(0, playerFatigue - 30));
  };

  // Selecting RPG Perk upon Level Up
  const handleSelectPerk = (perkId: string) => {
    setProgression((prev) => {
      const nextPerks = [...prev.selectedPerkIds, perkId];
      const remainingPending = Math.max(0, prev.pendingPerkChoices - 1);
      const nextProgression: PlayerProgression = {
        ...prev,
        selectedPerkIds: nextPerks,
        pendingPerkChoices: remainingPending,
      };
      saveProgression(nextProgression);
      return nextProgression;
    });

    if (progression.pendingPerkChoices <= 1) {
      setGamePhase(returnPhaseAfterModal);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    initAudio();
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    setMuted(nextMuted);
  };

  // Default character fallback
  const activeCharacter: CharacterProfile = character || {
    id: 'default-miner',
    name: 'Veteran Prospector',
    minerClass: 'deep_delver',
    appearance: {
      helmet: 'classic',
      accentColor: '#f59e0b',
      beardStyle: 'stout',
      pickaxeStyle: 'iron',
    },
    createdAt: Date.now(),
  };

  return (
    <div
      id="app-root"
      className="relative w-screen h-screen overflow-hidden bg-stone-950 select-none font-sans text-stone-100"
    >
      {/* 2D Walkable Mountain Town Hub World */}
      {gamePhase === 'TOWN_HUB' && (
        <TownHub
          character={activeCharacter}
          playerLevel={progression.level}
          playerSanity={playerSanity}
          playerFatigue={playerFatigue}
          partyMembers={partyMembers}
          activeBuffs={activeBuffs}
          unlockedNewspaperCount={newspaperArticles.filter((a) => a.unlockedByDefault).length}
          totalNewspaperCount={newspaperArticles.length}
          storedGemsCount={vaultState.discoveredGems.length}
          onOpenNewspaper={() => {
            setReturnPhaseAfterModal('TOWN_HUB');
            setGamePhase('NEWSPAPER');
          }}
          onOpenDigger={() => {
            setReturnPhaseAfterModal('TOWN_HUB');
            setGamePhase('DIGGER');
          }}
          onOpenCharacterSheet={() => {
            setReturnPhaseAfterModal('TOWN_HUB');
            setGamePhase('CHARACTER_CREATOR');
          }}
          onOpenVault={() => {
            setReturnPhaseAfterModal('TOWN_HUB');
            setGamePhase('VAULT');
          }}
          onDescendDirectly={() => {
            initAudio();
            setStrikes(baseStrikes);
            setShaftGems([]);
            setShaftGeodes(0);
            setShaftXpGained(0);
            setIsShaftCleared(false);
            setRegenerateTrigger((prev) => prev + 1);
            setGamePhase('PLAYING');
          }}
          onToggleMute={handleToggleMute}
          isMuted={isAudioMuted}
        />
      )}

      {/* Heads Up Display in Active Delve */}
      {gamePhase === 'PLAYING' && (
        <HUD
          strikes={strikes}
          sector={sector}
          shaftInSector={shaftInSector}
          cavernTheme={currentCavernTheme}
          character={activeCharacter}
          playerLevel={progression.level}
          currentXp={progression.xp}
          xpToNextLevel={progression.xpToNextLevel}
          pendingPerkChoices={progression.pendingPerkChoices}
          activePerkCount={progression.selectedPerkIds.length}
          vaultDiscoveredCount={vaultState.discoveredGems.length}
          vaultTotalCount={GEM_CATALOG.length}
          playerSanity={playerSanity}
          playerFatigue={playerFatigue}
          activeBuffs={activeBuffs}
          isMuted={isAudioMuted}
          onToggleMute={handleToggleMute}
          onOpenVault={() => {
            setReturnPhaseAfterModal('PLAYING');
            setGamePhase('VAULT');
          }}
          onOpenPerks={() => {
            setReturnPhaseAfterModal('PLAYING');
            setGamePhase('LEVEL_UP');
          }}
          onOpenCharacterSheet={() => {
            setReturnPhaseAfterModal('PLAYING');
            setGamePhase('CHARACTER_CREATOR');
          }}
          onOpenDigger={() => {
            setReturnPhaseAfterModal('PLAYING');
            setGamePhase('DIGGER');
          }}
          onReturnToTown={() => {
            stopCavernMusic(true);
            setGamePhase('TOWN_HUB');
          }}
          onOpenNewspaper={() => {
            setReturnPhaseAfterModal('PLAYING');
            setGamePhase('NEWSPAPER');
          }}
          isGameActive={gamePhase === 'PLAYING'}
        />
      )}

      {/* Main 60fps Mining Canvas with 3-Tap Progressive Fracture & Organics Drop */}
      {gamePhase === 'PLAYING' && (
        <MiningCanvas
          strikes={strikes}
          onStrikeUsed={handleStrikeUsed}
          onGemRecovered={handleGemRecovered}
          onGeodeTriggered={handleGeodeTriggered}
          onSlagShattered={handleSlagShattered}
          onWallCleared={handleWallCleared}
          onMineDepleted={handleMineDepleted}
          onMonsterPartHarvested={handleMonsterPartHarvested}
          isGameActive={gamePhase === 'PLAYING'}
          regenerateTrigger={regenerateTrigger}
          cavernTheme={currentCavernTheme}
          character={activeCharacter}
          selectedPerkIds={progression.selectedPerkIds}
        />
      )}

      {/* The Digger Mobile Subterranean Base Camp Modal */}
      {gamePhase === 'DIGGER' && (
        <TheDiggerModal
          playerSanity={playerSanity}
          playerFatigue={playerFatigue}
          storedGems={storedGemsList}
          storedMonsterParts={storedMonsterParts}
          partyMembers={partyMembers}
          activeBuffs={activeBuffs}
          unlockedRecipes={CULINARY_RECIPES.map((r) => r.id)}
          decorations={decorations}
          onCookMeal={handleCookMeal}
          onFeedPartyMember={handleFeedPartyMember}
          onToggleDecoration={handleToggleDecoration}
          onRestInBunk={handleRestInBunk}
          onEnterMines={() => {
            initAudio();
            setStrikes(baseStrikes);
            setShaftGems([]);
            setShaftGeodes(0);
            setShaftXpGained(0);
            setIsShaftCleared(false);
            setRegenerateTrigger((prev) => prev + 1);
            setGamePhase('PLAYING');
          }}
          onClose={() => setGamePhase(returnPhaseAfterModal)}
          canDescend={true}
        />
      )}

      {/* The Miner Issue Newspaper Archives Modal */}
      {gamePhase === 'NEWSPAPER' && (
        <MinerIssueModal
          articles={newspaperArticles}
          onClose={() => setGamePhase(returnPhaseAfterModal)}
        />
      )}

      {/* Trapped Miner Rescue Celebration Modal */}
      {gamePhase === 'RESCUE' && activeRescuedMember && (
        <RescueModal
          rescuedMember={activeRescuedMember}
          onProceedToDigger={() => {
            setReturnPhaseAfterModal('TOWN_HUB');
            setGamePhase('DIGGER');
          }}
          onReturnToTown={() => {
            stopCavernMusic(true);
            setGamePhase('TOWN_HUB');
          }}
        />
      )}

      {/* Character Creator Modal */}
      {gamePhase === 'CHARACTER_CREATOR' && (
        <CharacterCreatorModal
          initialProfile={character}
          onSaveProfile={handleSaveProfile}
          canCancel={character !== null}
          onCancel={() => setGamePhase(returnPhaseAfterModal)}
        />
      )}

      {/* RPG Level-Up Perk Picker Modal */}
      {gamePhase === 'LEVEL_UP' && (
        <LevelUpModal
          playerLevel={progression.level}
          rankTitle={`Rank ${progression.level}`}
          selectedPerkIds={progression.selectedPerkIds}
          onSelectPerk={handleSelectPerk}
        />
      )}

      {/* Shaft Expedition Summary Modal */}
      {gamePhase === 'SUMMARY' && (
        <ExpeditionSummaryModal
          expeditionGems={shaftGems}
          sector={sector}
          shaftInSector={shaftInSector}
          isShaftCleared={isShaftCleared}
          cavernTheme={currentCavernTheme}
          character={activeCharacter}
          geodeCount={shaftGeodes}
          xpEarned={shaftXpGained}
          playerLevel={progression.level}
          pendingPerkChoices={progression.pendingPerkChoices}
          onNextShaft={handleNextShaft}
          onInspectVault={() => {
            setReturnPhaseAfterModal('SUMMARY');
            setGamePhase('VAULT');
          }}
          onOpenPerks={() => {
            setReturnPhaseAfterModal('SUMMARY');
            setGamePhase('LEVEL_UP');
          }}
          onBoardDigger={() => {
            setReturnPhaseAfterModal('SUMMARY');
            setGamePhase('DIGGER');
          }}
          onReturnToTown={() => {
            stopCavernMusic(true);
            setGamePhase('TOWN_HUB');
          }}
        />
      )}

      {/* Crossroads / Cavern Fork Modal after Shaft 3 */}
      {gamePhase === 'CAVERN_FORK' && (
        <CavernForkModal
          completedSector={sector}
          cavernChoices={crossroadChoices}
          onSelectCavern={handleSelectCavern}
        />
      )}

      {/* Velvet Vault Modal */}
      {gamePhase === 'VAULT' && (
        <VelvetVaultModal
          vaultState={vaultState}
          onCloseVault={() => setGamePhase(returnPhaseAfterModal)}
        />
      )}
    </div>
  );
}
