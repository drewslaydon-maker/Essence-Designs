import React, { useState, useEffect, useRef } from 'react';
import { 
  PlayerProfile, 
  ActiveEnemy, 
  ActiveMinion, 
  LaneState, 
  AltarInfo, 
  MinionBlueprint,
  EquipmentItem 
} from '../types';
import { ALTARS, ENEMY_TYPES } from '../data/altars';
import { MINION_BLUEPRINTS } from '../data/minions';
import { sound } from '../audio/soundEngine';
import { RiftArenaCanvas } from './RiftArenaCanvas';
import { 
  Shield, 
  Sparkles, 
  Pickaxe, 
  Hammer, 
  Flame, 
  Zap, 
  Clock, 
  Play, 
  Pause, 
  Plus, 
  ShieldCheck, 
  Swords, 
  Layers, 
  Compass, 
  ChevronRight 
} from 'lucide-react';

interface RiftChamberProps {
  profile: PlayerProfile;
  onMatchComplete: (result: {
    isVictory: boolean;
    elementalPoints: number;
    catalyticPoints: number;
    elementalTokensEarned: number;
    catalyticTokensEarned: number;
    stardustEarned: number;
    monstersDefeated: number;
    greatGuardianCharge: number;
  }) => void;
  onExitToHub: () => void;
}

export const RiftChamber: React.FC<RiftChamberProps> = ({
  profile,
  onMatchComplete,
  onExitToHub,
}) => {
  // Aggregate stats from equipment and upgrades
  const computeStats = () => {
    let miningSpeed = 0;
    let chiselSpeed = 0;
    let pocketCap = 28;
    let minionDmg = 0;
    let barrierBonus = 0;
    let tokenBonus = 0;
    let critChance = 0.05;

    (Object.values(profile.equipped) as (EquipmentItem | null)[]).forEach((item) => {
      if (!item) return;
      if (item.stats.miningSpeed) miningSpeed += item.stats.miningSpeed;
      if (item.stats.chiselSpeed) chiselSpeed += item.stats.chiselSpeed;
      if (item.stats.pocketCapacity) pocketCap += item.stats.pocketCapacity;
      if (item.stats.minionDamage) minionDmg += item.stats.minionDamage;
      if (item.stats.barrierShieldBonus) barrierBonus += item.stats.barrierShieldBonus;
      if (item.stats.tokenBonus) tokenBonus += item.stats.tokenBonus;
      if (item.stats.critChiselChance) critChance += item.stats.critChiselChance;
    });

    const pocketLvl = profile.upgrades['deep_pockets'] || 0;
    pocketCap += pocketLvl * 4;

    const speedLvl = profile.upgrades['caffeine_drip'] || 0;
    chiselSpeed += speedLvl * 15;
    miningSpeed += speedLvl * 15;

    const barrierLvl = profile.upgrades['barrier_reinforcement'] || 0;
    barrierBonus += barrierLvl * 10;

    const golemLvl = profile.upgrades['golem_steroids'] || 0;
    minionDmg += golemLvl * 18;

    return {
      miningSpeed,
      chiselSpeed,
      pocketCapacity: pocketCap,
      minionDamageBonus: minionDmg,
      barrierBonus,
      tokenBonus,
      critChance,
    };
  };

  const stats = computeStats();

  // Match State
  const [matchTimeRemaining, setMatchTimeRemaining] = useState<number>(270); // 4.5 minutes
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [greatGuardianCharge, setGreatGuardianCharge] = useState<number>(0);
  const [greatGuardianHp, setGreatGuardianHp] = useState<number>(350); // Robust core integrity
  const [instability, setInstability] = useState<number>(0);
  const [prepTimeRemaining, setPrepTimeRemaining] = useState<number>(25); // 25s opening prep phase
  const [emergencyCooldown, setEmergencyCooldown] = useState<number>(0);

  // Score
  const [elementalPoints, setElementalPoints] = useState<number>(0);
  const [catalyticPoints, setCatalyticPoints] = useState<number>(0);
  const [monstersDefeated, setMonstersDefeated] = useState<number>(0);
  const [stardustAccrued, setStardustAccrued] = useState<number>(0);

  // Player Inventory during run
  const [rawFragments, setRawFragments] = useState<number>(18);
  const [refinedEssence, setRefinedEssence] = useState<number>(10);
  const [elementalRunes, setElementalRunes] = useState<number>(0);
  const [catalyticRunes, setCatalyticRunes] = useState<number>(0);
  const [heldChargedCell, setHeldChargedCell] = useState<'weak' | 'medium' | 'strong' | 'overcharged' | null>('medium');

  // Channeling / Activity Progress
  const [activeChannelAction, setActiveChannelAction] = useState<string | null>(null);
  const [channelProgress, setChannelProgress] = useState<number>(0);

  // Lanes - Sturdy 300 base HP barriers with auto-turrets
  const maxBarrier = 300 + stats.barrierBonus;
  const [lanes, setLanes] = useState<Record<'west' | 'north' | 'east', LaneState>>({
    west: { id: 'west', name: 'West Gate', barrierHp: maxBarrier, maxBarrierHp: maxBarrier, turretCharge: 30 },
    north: { id: 'north', name: 'North Gate', barrierHp: maxBarrier, maxBarrierHp: maxBarrier, turretCharge: 50 },
    east: { id: 'east', name: 'East Gate', barrierHp: maxBarrier, maxBarrierHp: maxBarrier, turretCharge: 30 },
  });

  const [selectedTargetLane, setSelectedTargetLane] = useState<'west' | 'north' | 'east'>('north');

  // Combat Entities - Start with 1 Rock Sentinel pre-stationed at North Gate
  const [activeEnemies, setActiveEnemies] = useState<ActiveEnemy[]>([]);
  const [activeMinions, setActiveMinions] = useState<ActiveMinion[]>([
    {
      uid: 'starter-rock-sentinel',
      blueprintId: 'starter_rock_sentinel',
      name: 'Rift Rock Sentinel',
      hp: 150,
      maxHp: 150,
      attackPower: 20,
      lane: 'north',
      lastAttackTime: Date.now(),
    }
  ]);

  // Simulation tick and wave cooldown refs
  const combatTickRef = useRef<number>(0);
  const waveCooldownRef = useRef<number>(8);

  // Rotating Altars
  const [activeElementalAltar, setActiveElementalAltar] = useState<AltarInfo>(ALTARS[0]); // Air
  const [activeCatalyticAltar, setActiveCatalyticAltar] = useState<AltarInfo>(ALTARS[4]); // Mind
  const [altarRotationSeconds, setAltarRotationSeconds] = useState<number>(20);

  // Huge Portal Event
  const [hugePortalActive, setHugePortalActive] = useState<boolean>(false);
  const [hugePortalSeconds, setHugePortalSeconds] = useState<number>(0);

  // Combat notifications / feedback log
  const [eventLog, setEventLog] = useState<{ id: string; text: string; color: string }[]>([
    { id: '1', text: 'Preparation Phase active! Click anywhere to move your wizard. Mine quarry or chisel essence!', color: 'text-amber-300' },
  ]);

  const addLog = (text: string, color: string = 'text-stone-300') => {
    setEventLog((prev) => [{ id: Math.random().toString(), text, color }, ...prev.slice(0, 5)]);
  };

  // Start Theme music on enter
  useEffect(() => {
    sound.startMusic();
  }, []);

  // Update music tempo with instability
  useEffect(() => {
    sound.setMusicSpeed(instability);
  }, [instability]);

  // Main Simulation Loop (runs every 500ms)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // 1. Check Win / Loss Conditions
      if (greatGuardianCharge >= 100) {
        sound.playWinFanfare();
        finishMatch(true);
        return;
      }
      if (greatGuardianHp <= 0 || matchTimeRemaining <= 0) {
        finishMatch(false);
        return;
      }

      combatTickRef.current += 1;

      // 2. Decrement Timer, Emergency Cooldown & Increment Instability
      setMatchTimeRemaining((prev) => Math.max(0, prev - 0.5));
      setInstability((prev) => Math.min(100, prev + 0.14));
      setEmergencyCooldown((prev) => Math.max(0, prev - 0.5));

      // 3. Prep Phase Handling
      setPrepTimeRemaining((prev) => {
        if (prev <= 0.5 && prev > 0) {
          addLog('THE RIFT HAS UNSEALED! Abyssal monsters are emerging from the maws!', 'text-rose-400 font-bold');
          sound.playPortalSfx();
          return 0;
        }
        return Math.max(0, prev - 0.5);
      });

      // 4. Altar Portal Rotations
      setAltarRotationSeconds((prev) => {
        if (prev <= 0.5) {
          const elemAltars = ALTARS.filter((a) => a.category === 'elemental');
          const cataAltars = ALTARS.filter((a) => a.category === 'catalytic');

          const nextElem = elemAltars[Math.floor(Math.random() * elemAltars.length)];
          const nextCata = cataAltars[Math.floor(Math.random() * cataAltars.length)];

          setActiveElementalAltar(nextElem);
          setActiveCatalyticAltar(nextCata);
          addLog(`Portals shifted! ${nextElem.name} & ${nextCata.name} are now open.`, 'text-indigo-400');
          return 22;
        }
        return prev - 0.5;
      });

      // 5. Huge Portal random trigger
      if (!hugePortalActive && Math.random() < 0.015) {
        setHugePortalActive(true);
        setHugePortalSeconds(14);
        sound.playPortalSfx();
        addLog('A Great Essence Portal has opened near the quarry!', 'text-amber-400 font-bold');
      } else if (hugePortalActive) {
        setHugePortalSeconds((prev) => {
          if (prev <= 0.5) {
            setHugePortalActive(false);
            return 0;
          }
          return prev - 0.5;
        });
      }

      // 6. Spawn Enemy Waves after Prep Phase
      if (prepTimeRemaining <= 0) {
        waveCooldownRef.current -= 0.5;
        if (waveCooldownRef.current <= 0) {
          spawnEnemyWave();
          // Scale wave frequency with instability
          waveCooldownRef.current = Math.max(4.5, 9 - (instability / 20));
        }
      }

      // 7. Combat Step
      advanceCombatRound();
    }, 500);

    return () => clearInterval(interval);
  }, [
    isPaused,
    greatGuardianCharge,
    greatGuardianHp,
    matchTimeRemaining,
    prepTimeRemaining,
    instability,
    hugePortalActive,
  ]);

  // Spawn an enemy in one of the 3 lanes
  const spawnEnemyWave = () => {
    const laneChoices: ('west' | 'north' | 'east')[] = ['west', 'north', 'east'];
    const chosenLane = laneChoices[Math.floor(Math.random() * laneChoices.length)];

    setActiveEnemies((current) => {
      // Pick enemy type based on current instability
      let typeId = 'crawler';
      const roll = Math.random() * 100;
      if (instability > 55 && roll > 75) {
        typeId = 'titan';
      } else if (instability > 30 && roll > 50) {
        typeId = 'leech';
      } else if (roll > 35) {
        typeId = 'walker';
      }

      const enemyTemplate = ENEMY_TYPES[typeId];
      const newEnemy: ActiveEnemy = {
        uid: Math.random().toString(),
        typeId,
        name: enemyTemplate.name,
        hp: enemyTemplate.maxHp,
        maxHp: enemyTemplate.maxHp,
        attackPower: enemyTemplate.attackPower,
        speed: enemyTemplate.speed,
        distanceToGuardian: 100,
        lane: chosenLane,
        color: enemyTemplate.color,
      };

      addLog(`Abyssal creep (${enemyTemplate.name}) entered ${lanes[chosenLane].name}!`, 'text-rose-400');
      return [...current, newEnemy];
    });
  };

  // Combat step with Minions, Automated Gate Turrets, and Guardian Counter-Pulse
  const advanceCombatRound = () => {
    setActiveEnemies((currentEnemies) => {
      let updatedEnemies = [...currentEnemies];
      const defeatedList: ActiveEnemy[] = [];

      // A. Pylon Turret Auto-Defenses (fires every 2s)
      if (combatTickRef.current % 4 === 0) {
        (['west', 'north', 'east'] as const).forEach((lKey) => {
          const lEnemies = updatedEnemies
            .filter((e) => e.lane === lKey && e.distanceToGuardian <= 55)
            .sort((a, b) => a.distanceToGuardian - b.distanceToGuardian);

          if (lEnemies.length > 0) {
            const target = lEnemies[0];
            const laneObj = lanes[lKey];
            const hasCharge = laneObj.turretCharge > 0;
            const zapDmg = hasCharge ? 30 : 14;
            target.hp -= zapDmg;

            if (hasCharge) {
              setLanes((prevL) => ({
                ...prevL,
                [lKey]: { ...prevL[lKey], turretCharge: Math.max(0, prevL[lKey].turretCharge - 2) },
              }));
            }

            if (target.hp <= 0 && !defeatedList.some((d) => d.uid === target.uid)) {
              defeatedList.push(target);
            }
          }
        });
      }

      // B. Minions attack lead enemies in their lane
      setActiveMinions((currentMinions) => {
        let updatedMinions = [...currentMinions];

        currentMinions.forEach((minion) => {
          const targets = updatedEnemies
            .filter((e) => e.lane === minion.lane)
            .sort((a, b) => a.distanceToGuardian - b.distanceToGuardian);

          if (targets.length > 0) {
            const target = targets[0];
            const dmg = Math.floor(minion.attackPower * (1 + stats.minionDamageBonus / 100));
            target.hp -= dmg;

            if (target.hp <= 0 && !defeatedList.some((d) => d.uid === target.uid)) {
              defeatedList.push(target);
            }
          }
        });

        return updatedMinions.filter((m) => m.hp > 0);
      });

      // C. Great Guardian Celestial Counter-Pulse (if creeps reach core)
      const enemiesAtCore = updatedEnemies.filter((e) => e.distanceToGuardian <= 0);
      if (enemiesAtCore.length > 0 && combatTickRef.current % 8 === 0) {
        sound.playWardPulseSfx();
        addLog('The Great Guardian unleashed a Celestial Counter-Pulse!', 'text-amber-300 font-bold');
        updatedEnemies.forEach((e) => {
          if (e.distanceToGuardian <= 5) {
            e.hp -= 35;
            e.distanceToGuardian = 35; // Repelled back
            if (e.hp <= 0 && !defeatedList.some((d) => d.uid === e.uid)) {
              defeatedList.push(e);
            }
          }
        });
      }

      // D. Process Defeated Enemies (Grant Stardust & Catalytic Points)
      if (defeatedList.length > 0) {
        setMonstersDefeated((prev) => prev + defeatedList.length);
        const stardustWon = defeatedList.length * 8;
        const cataWon = defeatedList.length * 10;
        setStardustAccrued((prev) => prev + stardustWon);
        setCatalyticPoints((prev) => prev + cataWon);
      }

      // Filter out defeated enemies
      updatedEnemies = updatedEnemies.filter((e) => e.hp > 0);

      // E. Enemies advance & attack barriers or Great Guardian
      setLanes((currentLanes) => {
        const nextLanes = { ...currentLanes };

        updatedEnemies.forEach((enemy) => {
          const lane = nextLanes[enemy.lane];

          // Advance towards barrier (barrier is at distance 20)
          if (enemy.distanceToGuardian > 20) {
            enemy.distanceToGuardian = Math.max(20, enemy.distanceToGuardian - enemy.speed);
          } else if (lane.barrierHp > 0) {
            // Attack barrier
            lane.barrierHp = Math.max(0, lane.barrierHp - enemy.attackPower * 0.25);
            if (lane.barrierHp <= 0) {
              sound.playBarrierSfx();
              addLog(`BREACH! ${lane.name} barrier has collapsed!`, 'text-rose-500 font-bold');
            }
          } else {
            // Barrier broken - advance to core
            enemy.distanceToGuardian = Math.max(0, enemy.distanceToGuardian - enemy.speed);

            if (enemy.distanceToGuardian <= 0) {
              // Direct damage to Great Guardian (gentle tick giving time to react)
              setGreatGuardianHp((prevHp) => {
                const nextHp = Math.max(0, prevHp - enemy.attackPower * 0.15);
                return nextHp;
              });
            }
          }
        });

        return nextLanes;
      });

      return updatedEnemies;
    });
  };

  // Direct Player Zap Ability (Apprentice Arcane Bolt)
  const handleZapEnemy = (enemyUid: string) => {
    sound.playZapSfx();
    setActiveEnemies((prev) => {
      return prev.map((e) => {
        if (e.uid === enemyUid) {
          const nextHp = e.hp - 25;
          if (nextHp <= 0) {
            setMonstersDefeated((m) => m + 1);
            setStardustAccrued((s) => s + 8);
            setCatalyticPoints((c) => c + 10);
            addLog(`⚡ Apprentice Bolt vaporized ${e.name}!`, 'text-amber-300 font-bold');
          }
          return { ...e, hp: nextHp };
        }
        return e;
      }).filter((e) => e.hp > 0);
    });
  };

  // Emergency Guardian Ward Shockwave (Clears lane pressure and restores gates)
  const handleEmergencyPulse = () => {
    if (emergencyCooldown > 0) return;
    sound.playWardPulseSfx();
    setEmergencyCooldown(45); // 45 second cooldown

    // Knock all active enemies back by 35 paces, deal 30 damage
    setActiveEnemies((prev) => {
      return prev.map((e) => ({
        ...e,
        hp: e.hp - 30,
        distanceToGuardian: Math.min(95, e.distanceToGuardian + 35),
      })).filter((e) => {
        if (e.hp <= 0) {
          setMonstersDefeated((m) => m + 1);
          setStardustAccrued((s) => s + 8);
          setCatalyticPoints((c) => c + 10);
          return false;
        }
        return true;
      });
    });

    // Repair all 3 gates by +80 HP and give +30 turret charge
    setLanes((prev) => {
      const next = { ...prev };
      (['west', 'north', 'east'] as const).forEach((l) => {
        next[l] = {
          ...next[l],
          barrierHp: Math.min(next[l].maxBarrierHp, next[l].barrierHp + 80),
          turretCharge: Math.min(100, next[l].turretCharge + 35),
        };
      });
      return next;
    });

    addLog('DIVINE REVERSAL! Guardian Shockwave repels all creeps and restores barrier shields!', 'text-amber-300 font-bold');
  };

  // Match Finish calculation
  const finishMatch = (isVictory: boolean) => {
    const basePairs = Math.min(elementalPoints, catalyticPoints);
    const elemLeftover = elementalPoints - basePairs;
    const cataLeftover = catalyticPoints - basePairs;

    const pairTokens = Math.floor(basePairs / 60);
    const elemExtra = Math.floor(elemLeftover / 120);
    const cataExtra = Math.floor(cataLeftover / 120);

    const bonusMultiplier = 1 + stats.tokenBonus / 100;
    const elemTokens = Math.max(isVictory ? 2 : 1, Math.floor((pairTokens + elemExtra) * bonusMultiplier));
    const cataTokens = Math.max(isVictory ? 2 : 1, Math.floor((pairTokens + cataExtra) * bonusMultiplier));
    const finalStardust = Math.floor((stardustAccrued + (isVictory ? 60 : 20)) * bonusMultiplier);

    onMatchComplete({
      isVictory,
      elementalPoints,
      catalyticPoints,
      elementalTokensEarned: elemTokens,
      catalyticTokensEarned: cataTokens,
      stardustEarned: finalStardust,
      monstersDefeated,
      greatGuardianCharge: Math.floor(greatGuardianCharge),
    });
  };

  // 1. Mine Fragments
  const handleMine = () => {
    if (activeChannelAction) return;
    const duration = Math.max(600, 1600 - stats.miningSpeed * 10);

    setActiveChannelAction('mining');
    setChannelProgress(0);

    const stepMs = 50;
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += stepMs;
      setChannelProgress(Math.min(100, (elapsed / duration) * 100));

      if (elapsed >= duration) {
        clearInterval(interval);
        setActiveChannelAction(null);
        setChannelProgress(0);

        sound.playMineSfx();
        const mined = Math.floor(5 + Math.random() * 4);
        setRawFragments((prev) => prev + mined);
        setElementalPoints((prev) => prev + 6);
        addLog(`Mined ${mined} guardian fragments from the quarry.`, 'text-stone-300');
      }
    }, stepMs);
  };

  // 2. Chisel Fragments into Refined Essence
  const handleChisel = () => {
    if (activeChannelAction || rawFragments <= 0) return;
    if (refinedEssence >= stats.pocketCapacity) {
      addLog('Your essence pockets are completely full!', 'text-amber-400');
      return;
    }

    const duration = Math.max(500, 1400 - stats.chiselSpeed * 10);
    setActiveChannelAction('chiseling');
    setChannelProgress(0);

    const stepMs = 50;
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += stepMs;
      setChannelProgress(Math.min(100, (elapsed / duration) * 100));

      if (elapsed >= duration) {
        clearInterval(interval);
        setActiveChannelAction(null);
        setChannelProgress(0);

        sound.playChiselSfx();

        const canConvert = Math.min(rawFragments, stats.pocketCapacity - refinedEssence);
        const isCrit = Math.random() < stats.critChance;

        const yieldAmount = isCrit ? Math.floor(canConvert * 1.5) : canConvert;
        setRawFragments((prev) => prev - canConvert);
        setRefinedEssence((prev) => Math.min(stats.pocketCapacity, prev + yieldAmount));

        if (isCrit) {
          addLog(`CRIT-CHISEL! Transmuted ${yieldAmount} refined essence!`, 'text-amber-300 font-bold');
        } else {
          addLog(`Chiseled ${yieldAmount} refined essence.`, 'text-stone-300');
        }
      }
    }, stepMs);
  };

  // 3. Enter Altar & Bind Runes
  const handleBindRunes = (altar: AltarInfo) => {
    if (activeChannelAction || refinedEssence <= 0) return;

    setActiveChannelAction(`binding_${altar.id}`);
    setChannelProgress(0);

    const duration = 1200;
    const stepMs = 50;
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += stepMs;
      setChannelProgress(Math.min(100, (elapsed / duration) * 100));

      if (elapsed >= duration) {
        clearInterval(interval);
        setActiveChannelAction(null);
        setChannelProgress(0);

        sound.playPortalSfx();

        const count = refinedEssence;
        setRefinedEssence(0);

        if (altar.category === 'elemental') {
          setElementalRunes((prev) => prev + count);
          setElementalPoints((prev) => prev + count * altar.tier * 4);
        } else {
          setCatalyticRunes((prev) => prev + count);
          setCatalyticPoints((prev) => prev + count * altar.tier * 4);
        }

        // Grants a charged cell
        setHeldChargedCell(altar.cellTier);
        addLog(`Bound ${count} ${altar.name} runes & charged a ${altar.cellTier.toUpperCase()} cell!`, altar.color);
      }
    }, stepMs);
  };

  // 4. Infuse Great Guardian
  const handleInfuseGuardian = () => {
    if (elementalRunes === 0 && catalyticRunes === 0) {
      addLog('You have no crafted runes to infuse into the Great Guardian!', 'text-amber-400');
      return;
    }

    sound.playPortalSfx();
    const totalRunes = elementalRunes + catalyticRunes;
    const chargeGain = totalRunes * 2.8;

    setGreatGuardianCharge((prev) => Math.min(100, prev + chargeGain));
    setElementalPoints((prev) => prev + elementalRunes * 5);
    setCatalyticPoints((prev) => prev + catalyticRunes * 5);

    addLog(`Infused ${totalRunes} runes! Great Guardian power +${chargeGain.toFixed(1)}%`, 'text-amber-400 font-bold');

    setElementalRunes(0);
    setCatalyticRunes(0);
  };

  // 5. Repair Barrier with Held Cell
  const handleRepairBarrier = (laneKey: 'west' | 'north' | 'east') => {
    if (!heldChargedCell) {
      addLog('Craft runes at an active altar first to charge a power cell!', 'text-amber-400');
      return;
    }

    sound.playBarrierSfx();

    let healAmount = 90;
    let turretGain = 35;
    if (heldChargedCell === 'medium') { healAmount = 150; turretGain = 50; }
    if (heldChargedCell === 'strong') { healAmount = 230; turretGain = 75; }
    if (heldChargedCell === 'overcharged') { healAmount = 350; turretGain = 100; }

    setLanes((prev) => ({
      ...prev,
      [laneKey]: {
        ...prev[laneKey],
        barrierHp: Math.min(prev[laneKey].maxBarrierHp, prev[laneKey].barrierHp + healAmount),
        turretCharge: Math.min(100, prev[laneKey].turretCharge + turretGain),
      },
    }));

    setElementalPoints((prev) => prev + Math.floor(healAmount * 0.5));
    addLog(`Socketed ${heldChargedCell.toUpperCase()} cell into ${lanes[laneKey].name}! (+${healAmount} Shield, +${turretGain}% Turret Charge)`, 'text-cyan-400 font-semibold');

    setHeldChargedCell(null);
  };

  // 6. Summon Minion from Blueprint
  const handleSummonMinion = (bp: MinionBlueprint) => {
    if (
      refinedEssence < bp.recipeCost.refinedEssence ||
      elementalRunes < bp.recipeCost.elementalRunes ||
      catalyticRunes < bp.recipeCost.catalyticRunes
    ) {
      addLog(`Need ${bp.recipeCost.refinedEssence} essence, ${bp.recipeCost.elementalRunes} elem, ${bp.recipeCost.catalyticRunes} cata to summon!`, 'text-rose-400');
      return;
    }

    sound.playSummonSfx();

    setRefinedEssence((prev) => prev - bp.recipeCost.refinedEssence);
    setElementalRunes((prev) => prev - bp.recipeCost.elementalRunes);
    setCatalyticRunes((prev) => prev - bp.recipeCost.catalyticRunes);

    const minion: ActiveMinion = {
      uid: Math.random().toString(),
      blueprintId: bp.id,
      name: bp.name,
      hp: bp.maxHp,
      maxHp: bp.maxHp,
      attackPower: bp.attackPower,
      lane: selectedTargetLane,
      lastAttackTime: Date.now(),
    };

    setActiveMinions((prev) => [...prev, minion]);
    setCatalyticPoints((prev) => prev + 25);
    addLog(`Summoned ${bp.name} to ${lanes[selectedTargetLane].name}!`, 'text-emerald-400 font-bold');
  };

  // 7. Huge Portal Grab
  const handleHugePortal = () => {
    if (!hugePortalActive) return;
    sound.playWinFanfare();
    setRefinedEssence(stats.pocketCapacity);
    setHugePortalActive(false);
    addLog('You leaped through the Huge Essence Portal! Pockets filled to 100% capacity!', 'text-amber-300 font-bold');
  };

  // Format time (mm:ss)
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Determine current recommended flow step
  const getCycleStep = () => {
    if (elementalRunes > 0 || catalyticRunes > 0) {
      return {
        step: 4,
        title: 'Infuse the Great Guardian',
        desc: `You hold ${elementalRunes + catalyticRunes} crafted runes! Walk to the center daïs or click Infuse.`,
      };
    }
    if (refinedEssence > 0) {
      return {
        step: 3,
        title: 'Step into an Altar Portal',
        desc: `You have ${refinedEssence} refined essence ready. Step into the active portals to craft runes & charge a cell!`,
      };
    }
    if (rawFragments > 0) {
      return {
        step: 2,
        title: 'Chisel Fragments into Essence',
        desc: `You have ${rawFragments} raw fragments. Walk over to the chisel bench to shape essence blocks!`,
      };
    }
    return {
      step: 1,
      title: 'Mine the Guardian Quarry',
      desc: 'Click on the crystal quarry in the lower left to mine fragments.',
    };
  };

  const cycle = getCycleStep();
  const totalRunesHeld = elementalRunes + catalyticRunes;

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5 space-y-4">
      {/* 1. Top Bar: Great Guardian Core Status & Clocks */}
      <div className="bg-stone-900/95 border border-stone-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Guardian Core Power Status */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-400 to-indigo-700 flex items-center justify-center border border-amber-400/50 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6 text-stone-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-stone-100 uppercase tracking-wider">The Great Guardian Core</h2>
                <span className="font-mono text-sm font-extrabold text-amber-300">{greatGuardianCharge.toFixed(1)}%</span>
              </div>
              {/* Charge Progress Bar */}
              <div className="w-48 sm:w-64 h-3 rounded-full bg-stone-950 border border-stone-800 overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 rounded-full transition-all duration-300 shadow-sm shadow-amber-400/50"
                  style={{ width: `${greatGuardianCharge}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sanctum Integrity & Match Clock */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400 uppercase font-semibold text-[10px]">Sanctum Integrity</span>
                <span className={`font-mono font-bold ${greatGuardianHp > 100 ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                  {Math.ceil(greatGuardianHp)} HP
                </span>
              </div>
              <div className="w-40 sm:w-48 h-2.5 rounded-full bg-stone-950 border border-stone-800 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    greatGuardianHp > 180 ? 'bg-emerald-500' : greatGuardianHp > 80 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (greatGuardianHp / 350) * 100)}%` }}
                />
              </div>
            </div>

            {/* Instability & Match Timer */}
            <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
              <Clock className="w-4 h-4 text-stone-400" />
              <span className="font-mono text-sm font-bold text-stone-200">{formatTime(matchTimeRemaining)}</span>
              <button
                id="match-pause-btn"
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 transition ml-1"
                title={isPaused ? 'Resume Match' : 'Pause Match'}
              >
                {isPaused ? <Play className="w-3 h-3 fill-stone-400" /> : <Pause className="w-3 h-3" />}
              </button>
            </div>

            {/* Emergency Shockwave Ability */}
            <button
              id="emergency-pulse-btn"
              disabled={emergencyCooldown > 0}
              onClick={handleEmergencyPulse}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
                emergencyCooldown <= 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/30 active:scale-95'
                  : 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed'
              }`}
              title="Discharge radiant shockwave to push back all enemies and restore barrier shields"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>
                {emergencyCooldown <= 0 ? 'Shockwave (Ready)' : `Shockwave (${Math.ceil(emergencyCooldown)}s)`}
              </span>
            </button>

            <button
              id="match-retreat-btn"
              onClick={onExitToHub}
              className="px-2.5 py-1 text-xs text-stone-400 hover:text-stone-200 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 transition"
            >
              Retreat
            </button>
          </div>
        </div>

        {/* Preparation Phase Banner */}
        {prepTimeRemaining > 0 && (
          <div className="bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-amber-500/20 border border-amber-500/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs animate-pulse">
            <div className="flex items-center gap-2 text-amber-200">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>
                <strong className="text-amber-300">Preparation Phase ({Math.ceil(prepTimeRemaining)}s):</strong> Mine fragments, chisel essence, and reinforce barriers before the Rift breaches!
              </span>
            </div>
            <button
              id="skip-prep-btn"
              onClick={() => setPrepTimeRemaining(0)}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] transition shadow"
            >
              Unseal Rift Early ⚔️
            </button>
          </div>
        )}

        {/* Live Points Tracker */}
        <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/60" />
              <span className="text-stone-400">Elemental:</span>
              <span className="font-mono font-bold text-cyan-300">{elementalPoints} pts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/60" />
              <span className="text-stone-400">Catalytic:</span>
              <span className="font-mono font-bold text-purple-300">{catalyticPoints} pts</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span>Rift Instability:</span>
            <span className={`font-mono font-bold ${instability > 70 ? 'text-rose-400' : 'text-amber-400'}`}>
              {Math.floor(instability)}%
            </span>
            <span className="text-stone-600">•</span>
            <span>Abyssals Slain: <strong className="text-stone-200">{monstersDefeated}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. THE PLAYABLE 2D RIFT ARENA CANVAS */}
      <div className="space-y-2">
        {/* Next Step Flow Guide */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-stone-900/80 border border-stone-800/80 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-stone-300 uppercase tracking-wider text-[11px]">Recommended:</span>
            <span className="text-amber-300 font-semibold">{cycle.title}</span>
          </div>
          <span className="text-stone-400 text-[11px] hidden sm:inline">{cycle.desc}</span>
        </div>

        {/* The 2D Arena Canvas */}
        <RiftArenaCanvas
          rawFragments={rawFragments}
          refinedEssence={refinedEssence}
          elementalRunes={elementalRunes}
          catalyticRunes={catalyticRunes}
          heldChargedCell={heldChargedCell}
          activeChannelAction={activeChannelAction}
          channelProgress={channelProgress}
          greatGuardianCharge={greatGuardianCharge}
          greatGuardianHp={greatGuardianHp}
          lanes={lanes}
          activeEnemies={activeEnemies}
          activeMinions={activeMinions}
          activeElementalAltar={activeElementalAltar}
          activeCatalyticAltar={activeCatalyticAltar}
          altarRotationSeconds={altarRotationSeconds}
          hugePortalActive={hugePortalActive}
          hugePortalSeconds={hugePortalSeconds}
          selectedTargetLane={selectedTargetLane}
          onSelectLane={(lane) => setSelectedTargetLane(lane)}
          onMine={handleMine}
          onChisel={handleChisel}
          onEnterAltar={(category) => {
            if (category === 'elemental') handleBindRunes(activeElementalAltar);
            else handleBindRunes(activeCatalyticAltar);
          }}
          onInfuseGuardian={handleInfuseGuardian}
          onRepairBarrier={(lane) => handleRepairBarrier(lane)}
          onZapEnemy={handleZapEnemy}
          onHugePortal={handleHugePortal}
        />
      </div>

      {/* 3. THE RUNECRAFTER'S SATCHEL & ACTION DOCK */}
      <div className="bg-stone-900/95 border border-stone-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider">Runecrafter Satchel & Quick Actions</h3>
          </div>
          <span className="text-[11px] text-stone-400">
            Click objects on the 2D arena above, or use these dock shortcuts:
          </span>
        </div>

        {/* 5 Satchel Inventory Slots */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* Slot 1: Raw Fragments */}
          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400">Raw Fragments</span>
              <Pickaxe className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="font-mono text-lg font-extrabold text-amber-300">{rawFragments}</div>
            <button
              id="dock-mine-btn"
              disabled={!!activeChannelAction}
              onClick={handleMine}
              className={`w-full py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeChannelAction
                  ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 active:scale-95'
              }`}
            >
              <Pickaxe className="w-3 h-3" />
              <span>Mine Quarry</span>
            </button>
          </div>

          {/* Slot 2: Refined Essence */}
          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400">Refined Essence</span>
              <Hammer className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-mono text-lg font-extrabold text-emerald-400">
              {refinedEssence} <span className="text-xs text-stone-500 font-normal">/ {stats.pocketCapacity}</span>
            </div>
            <button
              id="dock-chisel-btn"
              disabled={!!activeChannelAction || rawFragments <= 0 || refinedEssence >= stats.pocketCapacity}
              onClick={handleChisel}
              className={`w-full py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeChannelAction || rawFragments <= 0 || refinedEssence >= stats.pocketCapacity
                  ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 active:scale-95'
              }`}
            >
              <Hammer className="w-3 h-3" />
              <span>Chisel Essence</span>
            </button>
          </div>

          {/* Slot 3: Elemental Runes & Portal */}
          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400">Elemental Runes</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="font-mono text-lg font-extrabold text-cyan-300">{elementalRunes}</div>
            <button
              id="dock-elem-portal-btn"
              disabled={!!activeChannelAction || refinedEssence <= 0}
              onClick={() => handleBindRunes(activeElementalAltar)}
              className={`w-full py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 truncate ${
                activeChannelAction || refinedEssence <= 0
                  ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 active:scale-95'
              }`}
              title={`Step into ${activeElementalAltar.name} Portal`}
            >
              <span>🌀 {activeElementalAltar.name} Altar</span>
            </button>
          </div>

          {/* Slot 4: Catalytic Runes & Portal */}
          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400">Catalytic Runes</span>
              <Flame className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="font-mono text-lg font-extrabold text-purple-300">{catalyticRunes}</div>
            <button
              id="dock-cata-portal-btn"
              disabled={!!activeChannelAction || refinedEssence <= 0}
              onClick={() => handleBindRunes(activeCatalyticAltar)}
              className={`w-full py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 truncate ${
                activeChannelAction || refinedEssence <= 0
                  ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 active:scale-95'
              }`}
              title={`Step into ${activeCatalyticAltar.name} Portal`}
            >
              <span>🌀 {activeCatalyticAltar.name} Altar</span>
            </button>
          </div>

          {/* Slot 5: Held Cell or Infuse Trigger */}
          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between gap-2 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400">Held Cell / Infuse</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="font-mono text-xs font-bold truncate">
              {heldChargedCell ? (
                <span className="text-cyan-300">⚡ {heldChargedCell.toUpperCase()}</span>
              ) : totalRunesHeld > 0 ? (
                <span className="text-amber-300">{totalRunesHeld} Runes Held</span>
              ) : (
                <span className="text-stone-500">None</span>
              )}
            </div>
            {totalRunesHeld > 0 ? (
              <button
                id="dock-infuse-btn"
                onClick={handleInfuseGuardian}
                className="w-full py-1 rounded-lg text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md shadow-amber-500/30 active:scale-95 transition"
              >
                ✨ Infuse Core!
              </button>
            ) : (
              <button
                id="dock-socket-cell-btn"
                disabled={!heldChargedCell}
                onClick={() => handleRepairBarrier(selectedTargetLane)}
                className={`w-full py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 truncate ${
                  heldChargedCell
                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 active:scale-95'
                    : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Socket {lanes[selectedTargetLane].name.split(' ')[0]}</span>
              </button>
            )}
          </div>
        </div>

        {/* Huge Portal Quick Alert Button if active */}
        {hugePortalActive && (
          <button
            id="dock-huge-portal-btn"
            onClick={handleHugePortal}
            className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 animate-bounce transition active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>HUGE ESSENCE PORTAL ACTIVE! Step through to fill pockets to 100% capacity ({Math.ceil(hugePortalSeconds)}s)</span>
          </button>
        )}
      </div>

      {/* 4. DEFENSE SECTOR & MINION REINFORCEMENTS DOCK */}
      <div className="bg-stone-900/95 border border-stone-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider">Reinforce Defenses & Summon Minions</h3>
          </div>
          {/* Target Lane Selector */}
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 px-2 font-medium">Target Gate:</span>
            {(['west', 'north', 'east'] as const).map((lKey) => {
              const lane = lanes[lKey];
              const isSelected = selectedTargetLane === lKey;
              return (
                <button
                  key={lKey}
                  onClick={() => setSelectedTargetLane(lKey)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <span>{lane.name.split(' ')[0]}</span>
                  <span className="font-mono text-[10px] opacity-75">{Math.ceil(lane.barrierHp)} HP</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Minion Blueprints Summon Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {MINION_BLUEPRINTS.map((bp) => {
            const isUnlocked = profile.unlockedBlueprints.includes(bp.id);
            const canAfford =
              refinedEssence >= bp.recipeCost.refinedEssence &&
              elementalRunes >= bp.recipeCost.elementalRunes &&
              catalyticRunes >= bp.recipeCost.catalyticRunes;

            return (
              <div
                key={bp.id}
                className={`p-2.5 rounded-xl border flex flex-col justify-between gap-2 transition ${
                  !isUnlocked
                    ? 'bg-stone-950/40 border-stone-800/50 opacity-50'
                    : canAfford
                    ? 'bg-stone-950 border-emerald-500/40 hover:border-emerald-500/70'
                    : 'bg-stone-950 border-stone-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">{bp.name}</h4>
                    <p className="text-[10px] text-stone-400 line-clamp-1">{bp.description}</p>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-900 text-emerald-400 border border-stone-800">
                    {bp.attackPower} ATK
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-900 text-[10px] font-mono text-stone-400">
                  <span>Cost:</span>
                  <span>
                    {bp.recipeCost.refinedEssence} ess {bp.recipeCost.elementalRunes > 0 ? `+${bp.recipeCost.elementalRunes} elem` : ''}
                  </span>
                </div>

                <button
                  id={`summon-${bp.id}-btn`}
                  disabled={!isUnlocked || !canAfford}
                  onClick={() => handleSummonMinion(bp)}
                  className={`w-full py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    !isUnlocked
                      ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                      : canAfford
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-sm shadow-emerald-500/20 active:scale-95'
                      : 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Summon to {lanes[selectedTargetLane].name.split(' ')[0]}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Live Tactical Event Feed */}
      <div className="p-2.5 rounded-xl bg-stone-950/90 border border-stone-800 text-xs font-mono flex items-center gap-2 overflow-x-auto whitespace-nowrap shadow-inner">
        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Sanctum Chronicle:</span>
        {eventLog.map((log) => (
          <span key={log.id} className={`${log.color} flex items-center gap-1.5`}>
            <span>•</span>
            <span>{log.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
