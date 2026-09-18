import {
  PlayerStats,
  Realm,
  Position,
  Direction,
  Quest,
  WorldFlags,
  DialogueTree,
} from '../types';
import { MAPS, ITEMS } from './Maps';

export const INITIAL_PLAYER_STATS: PlayerStats = {
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  atk: 10,
  def: 4,
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  gold: 40,
  lanternCharge: 100,
  unlockedAbilities: ['Phase Shift', 'Power Strike'],
  equippedWeapon: ITEMS.rusty_sword,
  equippedArmor: ITEMS.traveler_cloak,
  inventory: [
    ITEMS.crimson_draught,
    ITEMS.aether_flask,
  ],
};

export const INITIAL_QUESTS: Record<string, Quest> = {
  main_quest_1: {
    id: 'main_quest_1',
    title: 'Echoes of the Interstice',
    giver: 'Elder Ronald',
    description: 'The ancient dimensional seal is leaking rift blight into the Ashen Hamlet. Confront Commander Malakar at the Rift Throne.',
    status: 'active',
    objectives: [
      {
        id: 'obj_elder',
        description: 'Converse with Elder Ronald in the Hamlet',
        current: 0,
        target: 1,
        completed: false,
      },
      {
        id: 'obj_crypt_key',
        description: 'Recover the Crypt Key from the Sunken Catacombs',
        current: 0,
        target: 1,
        completed: false,
      },
      {
        id: 'obj_sanctum_beacons',
        description: 'Ignite the Twin Astral Beacons in the Sanctum',
        current: 0,
        target: 2,
        completed: false,
      },
      {
        id: 'obj_boss',
        description: 'Confront Commander Malakar and resolve the Throne',
        current: 0,
        target: 1,
        completed: false,
      },
    ],
    rewards: {
      xp: 350,
      gold: 150,
      unlockName: 'Title: Champion of the Rift',
    },
  },
};

export const DIALOGUES: Record<string, DialogueTree> = {
  elder_dialogue: {
    id: 'elder_dialogue',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'Elder Ronald',
        text: 'Traveler! The dimensional barrier is fracturing. The sky shudders with violet lightning from the Interstice.',
        choices: [
          {
            text: 'What is the Interstice?',
            nextNodeId: 'explain_rift',
          },
          {
            text: 'How can I stop the tremors?',
            nextNodeId: 'task',
          },
          {
            text: 'I am ready to enter the crypts.',
            nextNodeId: 'farewell',
            action: 'advance_quest',
            questId: 'main_quest_1',
          },
        ],
      },
      explain_rift: {
        id: 'explain_rift',
        speaker: 'Elder Ronald',
        text: 'The Interstice is the spectral shadow of our realm. Decades ago, Commander Malakar sealed himself inside to hold back the void horrors. But now... his seal is rotting from within.',
        choices: [
          {
            text: 'Will I have to fight Malakar?',
            nextNodeId: 'combat_choice',
          },
          {
            text: 'Tell me my mission.',
            nextNodeId: 'task',
          },
        ],
      },
      combat_choice: {
        id: 'combat_choice',
        speaker: 'Elder Ronald',
        text: 'You have a choice, young soul. You may slay him to sever the rift by force, subdue his madness through dialogue and honor, or banish him into eternity using your Lantern. Each path will forever reshape our world.',
        choices: [
          {
            text: 'I understand. I will proceed.',
            nextNodeId: 'task',
          },
        ],
      },
      task: {
        id: 'task',
        speaker: 'Elder Ronald',
        text: 'Take this knowledge: toggle your Interstice Lantern to reveal hidden bridges and hidden mechanisms. Descend north into the Sunken Catacombs. May the old stars shield your mind.',
        choices: [
          {
            text: 'Thank you, Elder. I shall depart.',
            action: 'advance_quest',
            questId: 'main_quest_1',
          },
        ],
      },
      farewell: {
        id: 'farewell',
        speaker: 'Elder Ronald',
        text: 'Step carefully between the dimensions. Do not lose yourself to the void.',
        choices: [],
      },
    },
  },
  blacksmith_dialogue: {
    id: 'blacksmith_dialogue',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'Blacksmith Torvald',
        text: 'Clang, clang! My forge flames turn violet whenever the rift opens. Need some advice for the trials below?',
        choices: [
          {
            text: 'How does combat work against rift fiends?',
            nextNodeId: 'combat_tips',
          },
          {
            text: 'Heard of any hidden treasures?',
            nextNodeId: 'secret_tip',
          },
          {
            text: 'Can you sharpen my blade? (Heal)',
            nextNodeId: 'heal_node',
            action: 'heal',
          },
        ],
      },
      combat_tips: {
        id: 'combat_tips',
        speaker: 'Blacksmith Torvald',
        text: 'When you strike, time your swing when the indicator reaches the bright core for a Critical Hit! When they retaliate, maneuver your Soul Spark carefully in the arena. You can even parry by timing your guard!',
        choices: [
          {
            text: 'What about non-lethal combat?',
            nextNodeId: 'act_tips',
          },
          {
            text: 'Good to know. Thanks!',
            action: 'close',
          },
        ],
      },
      act_tips: {
        id: 'act_tips',
        speaker: 'Blacksmith Torvald',
        text: 'Use the "ACT" menu! Inquire, parley, or disarm your foes. Once their Compliance hits 100%, you can SPARE them without spilling blood.',
        choices: [
          {
            text: 'Fascinating. I will remember that.',
            action: 'close',
          },
        ],
      },
      secret_tip: {
        id: 'secret_tip',
        speaker: 'Blacksmith Torvald',
        text: 'To the east of our village, there is a broken chasm. Switch into the Interstice plane, and you\'ll find a spectral bridge leading to an ancient weapon chest!',
        choices: [
          {
            text: 'I\'ll investigate right away.',
            action: 'close',
          },
        ],
      },
      heal_node: {
        id: 'heal_node',
        speaker: 'Blacksmith Torvald',
        text: 'Here, drink some restorative tonic from my hearth. Your vitality and mana are restored!',
        choices: [
          {
            text: 'Much obliged, Torvald.',
            action: 'close',
          },
        ],
      },
    },
  },
};

export const INITIAL_WORLD_FLAGS: WorldFlags = {
  elderSpokenWith: false,
  catacombsUnlocked: false,
  astralSanctumUnlocked: false,
  switchesActivated: {},
  openedChests: {},
  defeatedEnemies: {},
  riftStormActive: false,
  guardianAlliance: false,
};

/**
 * Checks if a tile is walkable given the current realm
 */
export function isTileWalkable(mapId: string, x: number, y: number, realm: Realm, flags: WorldFlags): boolean {
  const map = MAPS[mapId];
  if (!map) return false;
  if (x < 0 || x >= map.width || y < 0 || y >= map.height) return false;

  const tile = realm === 'physical' ? map.physicalTiles[y][x] : map.intersticeTiles[y][x];

  // Tile semantics:
  // 0: grass (walkable)
  // 1: stone wall (solid)
  // 2: stone floor (walkable)
  // 3: abyss / water (solid)
  // 4: interstice bridge (walkable in interstice, solid in physical)
  // 5: physical rubble (solid in physical, walkable in interstice)
  // 6: dungeon wall (solid)
  // 7: throne altar (walkable)

  if (tile === 1 || tile === 6) return false;
  if (tile === 3) return false;
  if (tile === 4 && realm === 'physical') return false;
  if (tile === 5 && realm === 'physical') return false;

  // Check doors
  const entity = map.entities.find((e) => e.x === x && e.y === y && e.type === 'door');
  if (entity && !entity.isOpen) {
    return false;
  }

  return true;
}
