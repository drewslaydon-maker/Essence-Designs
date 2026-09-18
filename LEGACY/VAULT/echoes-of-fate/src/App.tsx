/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlayerStats,
  Realm,
  Position,
  Direction,
  MapEntity,
  CombatOutcome,
  EnemyStats,
  DialogueChoice,
  DialogueNode,
  Item,
} from './types';
import { MAPS, ITEMS } from './engine/Maps';
import {
  INITIAL_PLAYER_STATS,
  INITIAL_QUESTS,
  INITIAL_WORLD_FLAGS,
  DIALOGUES,
  isTileWalkable,
} from './engine/GameState';
import { ENEMY_DATABASE } from './engine/Combat';
import { sound } from './engine/Audio';

import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { VirtualControls } from './components/VirtualControls';
import { CombatView } from './components/CombatView';
import { DialogueModal } from './components/DialogueModal';
import { InventoryModal } from './components/InventoryModal';
import { GameOverOrVictoryModal } from './components/GameOverOrVictoryModal';

export default function App() {
  // Map and World Realm
  const [currentMapId, setCurrentMapId] = useState<string>('ashen_hamlet');
  const [realm, setRealm] = useState<Realm>('physical');

  // Player Position & Movement
  const [playerPos, setPlayerPos] = useState<Position>({ x: 7, y: 8 });
  const [playerDir, setPlayerDir] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // Player Stats, Inventory & Equipment
  const [stats, setStats] = useState<PlayerStats>(INITIAL_PLAYER_STATS);

  // Quest State
  const [quests, setQuests] = useState(INITIAL_QUESTS);

  // World Persistence Flags
  const [worldFlags, setWorldFlags] = useState(INITIAL_WORLD_FLAGS);

  // Active Modals & Combat
  const [activeDialogueNode, setActiveDialogueNode] = useState<DialogueNode | null>(null);
  const [activeCombatEnemy, setActiveCombatEnemy] = useState<EnemyStats | null>(null);
  const [inventoryModalOpen, setInventoryModalOpen] = useState<boolean>(false);
  const [initialInventoryTab, setInitialInventoryTab] = useState<'gear' | 'quests' | 'abilities'>('gear');
  const [finalCombatOutcome, setFinalCombatOutcome] = useState<CombatOutcome | null>(null);

  // Toast Notifications
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Find nearby interactive entity
  const getNearbyEntity = useCallback((): MapEntity | null => {
    const map = MAPS[currentMapId];
    if (!map) return null;

    // Check adjacent tiles or current tile
    for (const ent of map.entities) {
      if (worldFlags.defeatedEnemies[ent.id]) continue;
      if (ent.realmVisibility === 'physical_only' && realm !== 'physical') continue;
      if (ent.realmVisibility === 'interstice_only' && realm !== 'interstice') continue;

      const dist = Math.hypot(ent.x - playerPos.x, ent.y - playerPos.y);
      if (dist <= 1.42) {
        return ent;
      }
    }
    return null;
  }, [currentMapId, playerPos, realm, worldFlags]);

  const nearbyEntity = getNearbyEntity();

  // Realm Shift Toggle
  const handleToggleRealm = useCallback(() => {
    const nextRealm = realm === 'physical' ? 'interstice' : 'physical';
    sound.playRealmShift(nextRealm === 'interstice');
    setRealm(nextRealm);
    showToast(
      nextRealm === 'interstice'
        ? '✦ Shifted to the Interstice! Spectral paths and secrets revealed.'
        : '✦ Returned to the Physical Realm.'
    );
  }, [realm]);

  // Synchronized state refs for smooth, non-stale callbacks & intervals
  const playerPosRef = useRef(playerPos);
  playerPosRef.current = playerPos;
  const realmRef = useRef(realm);
  realmRef.current = realm;
  const worldFlagsRef = useRef(worldFlags);
  worldFlagsRef.current = worldFlags;
  const currentMapIdRef = useRef(currentMapId);
  currentMapIdRef.current = currentMapId;

  // Keyboard and pacing refs
  const heldDirectionsRef = useRef<Set<Direction>>(new Set());
  const activeMoveDirRef = useRef<Direction | null>(null);
  const moveHoldTimerRef = useRef<number | null>(null);
  const moveIntervalRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);
  const lastDashTimeRef = useRef<number>(0);

  // Trigger Combat encounter
  const triggerCombat = useCallback((enemyEntity: MapEntity) => {
    const dbEnemy = enemyEntity.enemyType
      ? ENEMY_DATABASE[enemyEntity.enemyType]
      : ENEMY_DATABASE.shade;

    if (!dbEnemy) return;

    if (enemyEntity.isBoss) {
      sound.playBossSting();
    } else {
      sound.playAttackSwing();
    }

    setActiveCombatEnemy({ ...dbEnemy, id: enemyEntity.id, isBoss: enemyEntity.isBoss });
  }, []);

  // Movement execution: deliberate single step with throttle guard
  const movePlayer = useCallback(
    (dir: Direction) => {
      setPlayerDir(dir);
      const now = Date.now();
      // Throttle guard prevents jitter / double triggers under 80ms
      if (now - lastStepTimeRef.current < 80) return;
      lastStepTimeRef.current = now;

      let dx = 0;
      let dy = 0;
      if (dir === 'up') dy = -1;
      if (dir === 'down') dy = 1;
      if (dir === 'left') dx = -1;
      if (dir === 'right') dx = 1;

      const curPos = playerPosRef.current;
      const curMap = currentMapIdRef.current;
      const curRealm = realmRef.current;
      const curFlags = worldFlagsRef.current;

      const nextX = curPos.x + dx;
      const nextY = curPos.y + dy;

      // Check collision
      if (isTileWalkable(curMap, nextX, nextY, curRealm, curFlags)) {
        sound.playStep();
        setPlayerPos({ x: nextX, y: nextY });
        setIsMoving(true);

        // Check if stepped into an enemy encounter
        const map = MAPS[curMap];
        const steppedEnemy = map.entities.find(
          (e) =>
            e.x === nextX &&
            e.y === nextY &&
            e.type === 'enemy' &&
            !curFlags.defeatedEnemies[e.id]
        );

        if (steppedEnemy) {
          triggerCombat(steppedEnemy);
        }

        // Check if stepped on switch
        const steppedSwitch = map.entities.find(
          (e) => e.x === nextX && e.y === nextY && e.type === 'switch'
        );
        if (steppedSwitch && !curFlags.switchesActivated[steppedSwitch.id]) {
          sound.playMercyChime();
          setWorldFlags((prev) => ({
            ...prev,
            switchesActivated: { ...prev.switchesActivated, [steppedSwitch.id]: true },
          }));
          showToast(`Pressure plate depressed! A mechanical lock clanks open.`);
        }
      }
    },
    [triggerCombat]
  );

  // Dash mechanic with cooldown
  const handleDash = useCallback(() => {
    const now = Date.now();
    if (now - lastDashTimeRef.current < 420) return; // Prevent double trigger
    lastDashTimeRef.current = now;

    let dx = 0;
    let dy = 0;
    if (playerDir === 'up') dy = -2;
    if (playerDir === 'down') dy = 2;
    if (playerDir === 'left') dx = -2;
    if (playerDir === 'right') dx = 2;

    const curPos = playerPosRef.current;
    const curMap = currentMapIdRef.current;
    const curRealm = realmRef.current;
    const curFlags = worldFlagsRef.current;

    const targetX = curPos.x + dx;
    const targetY = curPos.y + dy;

    if (isTileWalkable(curMap, targetX, targetY, curRealm, curFlags)) {
      sound.playAttackSwing();
      setPlayerPos({ x: targetX, y: targetY });
      showToast('Astral Dash!');
    }
  }, [playerDir]);

  // Primary Interaction Handler (Action / E button)
  const handleInteract = useCallback(() => {
    const target = nearbyEntity;
    if (!target) return;

    if (target.type === 'npc' && target.dialogueId) {
      sound.playDialogueBlip();
      const tree = DIALOGUES[target.dialogueId];
      if (tree) {
        setActiveDialogueNode(tree.nodes[tree.startNodeId]);
      }
    } else if (target.type === 'chest') {
      const isAlreadyOpen = worldFlags.openedChests[target.id] || target.isOpen;
      if (isAlreadyOpen) {
        showToast('This chest is already empty.');
        return;
      }

      sound.playChestOpen();
      setWorldFlags((prev) => ({
        ...prev,
        openedChests: { ...prev.openedChests, [target.id]: true },
      }));

      if (target.loot) {
        const item = target.loot;
        setStats((prev) => ({
          ...prev,
          inventory: [...prev.inventory, item],
          gold: prev.gold + 20,
        }));
        showToast(`Obtained [${item.name}]! +20 Gold.`);

        // Quest updates if Crypt Key found
        if (item.id === 'crypt_key') {
          advanceQuestObjective('main_quest_1', 'obj_crypt_key');
        }
      }
    } else if (target.type === 'door') {
      if (worldFlags.catacombsUnlocked || target.isOpen) {
        showToast('The gate is unlocked.');
        return;
      }

      // Check key requirement
      const hasKey = target.requiredKeyId
        ? stats.inventory.some((i) => i.id === target.requiredKeyId)
        : true;

      if (hasKey) {
        sound.playChestOpen();
        target.isOpen = true;
        setWorldFlags((prev) => ({ ...prev, catacombsUnlocked: true }));
        showToast(`Used Key! The heavy gate grinds open.`);
      } else {
        sound.playDialogueBlip();
        showToast(`Locked gate! Requires the ${target.requiredKeyId === 'sanctum_sigil' ? 'Astral Seal Sigil' : 'Crypt Key'}.`);
      }
    } else if (target.type === 'shrine') {
      if (worldFlags.switchesActivated[target.id]) {
        showToast('This astral beacon is already blazing with ethereal fire.');
        return;
      }

      sound.playMercyChime();
      setWorldFlags((prev) => ({
        ...prev,
        switchesActivated: { ...prev.switchesActivated, [target.id]: true },
      }));
      showToast(`Beacon ignited! Astral resonance pulses through the sanctum.`);

      // Update beacon quest objective
      advanceQuestObjective('main_quest_1', 'obj_sanctum_beacons');

      // Check if both shrines are now active
      const westLit = target.id === 'shrine_west' || worldFlags.switchesActivated['shrine_west'];
      const eastLit = target.id === 'shrine_east' || worldFlags.switchesActivated['shrine_east'];

      if (westLit && eastLit) {
        // Grant sanctum sigil key
        setStats((prev) => ({
          ...prev,
          inventory: [...prev.inventory, ITEMS.sanctum_sigil],
        }));
        showToast(`✦ The Twin Beacons align! Obtained [Astral Seal Sigil]!`);
      }
    } else if (target.type === 'portal') {
      if (target.targetMap && target.targetPos) {
        sound.playRealmShift(false);
        setCurrentMapId(target.targetMap);
        setPlayerPos(target.targetPos);
        const nextMap = MAPS[target.targetMap];
        showToast(`Traversed to ${nextMap ? nextMap.name : 'new chamber'}.`);
      }
    } else if (target.type === 'enemy') {
      triggerCombat(target);
    } else if (target.type === 'lore' && target.loreText) {
      sound.playDialogueBlip();
      showToast(target.loreText);
    }
  }, [nearbyEntity, stats.inventory, worldFlags, triggerCombat]);

  // Advance quest objective helper
  const advanceQuestObjective = (questId: string, objectiveId: string) => {
    setQuests((prev) => {
      const q = prev[questId];
      if (!q) return prev;
      const updatedObjs = q.objectives.map((obj) => {
        if (obj.id === objectiveId) {
          const nextCur = Math.min(obj.target, obj.current + 1);
          return { ...obj, current: nextCur, completed: nextCur >= obj.target };
        }
        return obj;
      });

      const allCompleted = updatedObjs.every((o) => o.completed);
      return {
        ...prev,
        [questId]: {
          ...q,
          status: allCompleted ? 'completed' : 'active',
          objectives: updatedObjs,
        },
      };
    });
  };

  // Dialogue Choice Handler
  const handleSelectDialogueChoice = (choice: DialogueChoice) => {
    if (choice.action === 'heal') {
      sound.playSpellCast();
      setStats((prev) => ({ ...prev, hp: prev.maxHp, mp: prev.maxMp }));
      showToast('Vitality and Mana fully restored!');
    } else if (choice.action === 'advance_quest' && choice.questId) {
      advanceQuestObjective(choice.questId, 'obj_elder');
      showToast('Quest Objective Updated!');
    }

    if (choice.nextNodeId && activeDialogueNode) {
      const treeId =
        activeDialogueNode.speaker === 'Elder Ronald'
          ? 'elder_dialogue'
          : 'blacksmith_dialogue';
      const tree = DIALOGUES[treeId];
      if (tree && tree.nodes[choice.nextNodeId]) {
        setActiveDialogueNode(tree.nodes[choice.nextNodeId]);
        return;
      }
    }

    setActiveDialogueNode(null);
  };

  // Combat Outcome Handler
  const handleCombatVictory = (outcome: CombatOutcome, enemy: EnemyStats) => {
    sound.playMercyChime();

    // Mark enemy defeated
    setWorldFlags((prev) => ({
      ...prev,
      defeatedEnemies: { ...prev.defeatedEnemies, [enemy.id]: true },
    }));

    // Award XP and Gold
    const xpGain = enemy.isBoss ? 250 : 45;
    const goldGain = enemy.isBoss ? 120 : 25;

    let newXp = stats.xp + xpGain;
    let newLevel = stats.level;
    let newNextXp = stats.nextLevelXp;
    let newMaxHp = stats.maxHp;
    let newMaxMp = stats.maxMp;
    let newAtk = stats.atk;
    let newDef = stats.def;

    if (newXp >= newNextXp) {
      newLevel += 1;
      newXp = newXp - newNextXp;
      newNextXp = Math.floor(newNextXp * 1.5);
      newMaxHp += 20;
      newMaxMp += 10;
      newAtk += 4;
      newDef += 2;
      showToast(`LEVEL UP! You are now Level ${newLevel}!`);
    }

    // Boss Victory Consequences
    if (enemy.isBoss) {
      setWorldFlags((prev) => ({
        ...prev,
        bossOutcome: outcome as 'slain' | 'subdued' | 'banished',
      }));

      advanceQuestObjective('main_quest_1', 'obj_boss');

      // Grant outcome-specific legendary relic
      let rewardItem = ITEMS.void_slayer;
      if (outcome === 'subdued') {
        rewardItem = ITEMS.astral_cuirass;
      } else if (outcome === 'banished') {
        rewardItem = ITEMS.rift_edge;
      }

      setStats((prev) => ({
        ...prev,
        level: newLevel,
        xp: newXp,
        nextLevelXp: newNextXp,
        maxHp: newMaxHp,
        maxMp: newMaxMp,
        atk: newAtk,
        def: newDef,
        gold: prev.gold + goldGain,
        inventory: [...prev.inventory, rewardItem],
        unlockedAbilities: [...prev.unlockedAbilities, 'Aegis Guard'],
      }));

      setActiveCombatEnemy(null);
      setFinalCombatOutcome(outcome);
      return;
    }

    setStats((prev) => ({
      ...prev,
      level: newLevel,
      xp: newXp,
      nextLevelXp: newNextXp,
      maxHp: newMaxHp,
      maxMp: newMaxMp,
      atk: newAtk,
      def: newDef,
      gold: prev.gold + goldGain,
    }));

    setActiveCombatEnemy(null);
    showToast(`Victory! +${xpGain} XP, +${goldGain} Gold.`);
  };

  // Player Defeat in Combat
  const handleCombatDefeat = () => {
    setActiveCombatEnemy(null);
    setFinalCombatOutcome('player_died');
  };

  // Keyboard Event Listener with controlled hold-delay and cadence
  useEffect(() => {
    const clearMoveTimers = () => {
      if (moveHoldTimerRef.current !== null) {
        window.clearTimeout(moveHoldTimerRef.current);
        moveHoldTimerRef.current = null;
      }
      if (moveIntervalRef.current !== null) {
        window.clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal or combat is active, ignore movement
      if (activeDialogueNode || activeCombatEnemy || inventoryModalOpen || finalCombatOutcome) {
        if (e.key === 'Escape') {
          setActiveDialogueNode(null);
          setInventoryModalOpen(false);
        }
        return;
      }

      // Ignore OS native keydown repeat spam
      if (e.repeat) return;

      let targetDir: Direction | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') targetDir = 'up';
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') targetDir = 'down';
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') targetDir = 'left';
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') targetDir = 'right';

      if (targetDir) {
        heldDirectionsRef.current.add(targetDir);
        activeMoveDirRef.current = targetDir;
        // Immediate single tile step
        movePlayer(targetDir);

        clearMoveTimers();
        // Hold delay: 220ms, then step at a comfortable 180ms cadence (~5.5 tiles/sec)
        moveHoldTimerRef.current = window.setTimeout(() => {
          moveIntervalRef.current = window.setInterval(() => {
            const currentDir = activeMoveDirRef.current;
            if (currentDir && heldDirectionsRef.current.has(currentDir)) {
              movePlayer(currentDir);
            }
          }, 180);
        }, 220);
        return;
      }

      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        handleInteract();
      } else if (e.key === 'q' || e.key === 'Q') {
        handleToggleRealm();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleDash();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setInitialInventoryTab('gear');
        setInventoryModalOpen(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let releasedDir: Direction | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') releasedDir = 'up';
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') releasedDir = 'down';
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') releasedDir = 'left';
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') releasedDir = 'right';

      if (releasedDir) {
        heldDirectionsRef.current.delete(releasedDir);
        if (activeMoveDirRef.current === releasedDir) {
          const remaining = Array.from(heldDirectionsRef.current);
          if (remaining.length > 0) {
            activeMoveDirRef.current = remaining[remaining.length - 1];
          } else {
            activeMoveDirRef.current = null;
            clearMoveTimers();
            setIsMoving(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      clearMoveTimers();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    activeCombatEnemy,
    activeDialogueNode,
    finalCombatOutcome,
    handleDash,
    handleInteract,
    handleToggleRealm,
    inventoryModalOpen,
    movePlayer,
  ]);

  // Restart Slice
  const handleRestartSlice = () => {
    setCurrentMapId('ashen_hamlet');
    setRealm('physical');
    setPlayerPos({ x: 7, y: 8 });
    setPlayerDir('down');
    setStats(INITIAL_PLAYER_STATS);
    setQuests(INITIAL_QUESTS);
    setWorldFlags(INITIAL_WORLD_FLAGS);
    setActiveCombatEnemy(null);
    setFinalCombatOutcome(null);
    showToast('Testing slice restarted from Ashen Hamlet.');
  };

  const currentMap = MAPS[currentMapId] || MAPS.ashen_hamlet;
  const activeQuest = quests.main_quest_1;

  return (
    <div id="game-root" className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 2D Canvas Overworld/Dungeon Renderer */}
      <GameCanvas
        currentMapId={currentMapId}
        realm={realm}
        playerPos={playerPos}
        playerDir={playerDir}
        isMoving={isMoving}
        worldFlags={worldFlags}
        stats={stats}
        nearbyEntity={nearbyEntity}
        onCanvasClickMove={(target) => {
          // Simple single step towards target
          const dx = target.x - playerPos.x;
          const dy = target.y - playerPos.y;
          if (Math.abs(dx) > Math.abs(dy)) {
            movePlayer(dx > 0 ? 'right' : 'left');
          } else if (dy !== 0) {
            movePlayer(dy > 0 ? 'down' : 'up');
          }
        }}
      />

      {/* Floating HUD */}
      <HUD
        stats={stats}
        realm={realm}
        mapName={currentMap.name}
        activeQuest={activeQuest}
        onToggleRealm={handleToggleRealm}
        onOpenInventory={() => {
          setInitialInventoryTab('gear');
          setInventoryModalOpen(true);
        }}
        onOpenQuests={() => {
          setInitialInventoryTab('quests');
          setInventoryModalOpen(true);
        }}
      />

      {/* Mobile/Touch Virtual Joystick & Action Buttons */}
      {!activeCombatEnemy && !activeDialogueNode && !inventoryModalOpen && !finalCombatOutcome && (
        <VirtualControls
          realm={realm}
          onStep={(dir) => movePlayer(dir)}
          onInteract={handleInteract}
          onToggleRealm={handleToggleRealm}
          onDash={handleDash}
        />
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="pointer-events-none fixed top-16 sm:top-20 inset-x-0 z-40 flex justify-center px-4">
          <div className="bg-slate-900/95 border border-amber-400/80 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold text-amber-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Expressive Combat View (Deltarune / Final Fantasy hybrid) */}
      {activeCombatEnemy && (
        <CombatView
          enemy={activeCombatEnemy}
          player={stats}
          onVictory={handleCombatVictory}
          onDefeat={handleCombatDefeat}
          onFlee={() => {
            setActiveCombatEnemy(null);
            showToast('Retreated from combat!');
          }}
          onUpdatePlayerStats={(updates) => {
            setStats((prev) => ({ ...prev, ...updates }));
          }}
        />
      )}

      {/* Dialogue Modal */}
      {activeDialogueNode && (
        <DialogueModal
          node={activeDialogueNode}
          onSelectChoice={handleSelectDialogueChoice}
          onClose={() => setActiveDialogueNode(null)}
        />
      )}

      {/* Inventory, Equipment & Quest Modal */}
      {inventoryModalOpen && (
        <InventoryModal
          stats={stats}
          quests={quests}
          initialTab={initialInventoryTab}
          onClose={() => setInventoryModalOpen(false)}
          onEquipWeapon={(weapon) => {
            const oldW = stats.equippedWeapon;
            const diff = weapon.value - (oldW ? oldW.value : 0);
            setStats((prev) => ({
              ...prev,
              equippedWeapon: weapon,
              atk: prev.atk + diff,
            }));
            showToast(`Equipped ${weapon.name}!`);
          }}
          onEquipArmor={(armor) => {
            const oldA = stats.equippedArmor;
            const diff = armor.value - (oldA ? oldA.value : 0);
            setStats((prev) => ({
              ...prev,
              equippedArmor: armor,
              def: prev.def + diff,
            }));
            showToast(`Equipped ${armor.name}!`);
          }}
          onUseConsumable={(item) => {
            if (item.id === 'crimson_draught') {
              sound.playSpellCast();
              setStats((prev) => ({
                ...prev,
                hp: Math.min(prev.maxHp, prev.hp + item.value),
                inventory: prev.inventory.filter((i) => i !== item),
              }));
              showToast(`Drank Crimson Draught! +${item.value} HP.`);
            } else if (item.id === 'aether_flask') {
              sound.playSpellCast();
              setStats((prev) => ({
                ...prev,
                mp: Math.min(prev.maxMp, prev.mp + item.value),
                inventory: prev.inventory.filter((i) => i !== item),
              }));
              showToast(`Drank Aether Flask! +${item.value} MP.`);
            }
          }}
        />
      )}

      {/* Game Over or Victory Epilogue Modal */}
      {finalCombatOutcome && (
        <GameOverOrVictoryModal
          outcome={finalCombatOutcome}
          player={stats}
          onRestartSlice={handleRestartSlice}
          onContinueExploring={() => {
            setFinalCombatOutcome(null);
            showToast('Continuing exploration in the altered world.');
          }}
        />
      )}
    </div>
  );
}
