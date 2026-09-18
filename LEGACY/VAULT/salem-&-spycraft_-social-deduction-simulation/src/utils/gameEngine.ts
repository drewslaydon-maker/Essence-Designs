import { 
  Player, 
  RoleId, 
  Phase, 
  StoryEvent, 
  DialogueMessage, 
  ForensicReport, 
  BehavioralTell,
  GameSettings
} from '../types';
import { ROLES } from '../data/roles';
import { BOT_PERSONALITIES } from '../data/botPersonalities';

const ALL_ROLES_ORDER: RoleId[] = [
  'killer',
  'sheriff',
  'detective',
  'doctor',
  'judge',
  'lawyer',
  'tavern_keeper',
  'prince',
  'executioner',
  'jester',
  'merchant',
  'cook',
  'artist',
  'musician',
  'gambler'
];

export interface NightActionChoice {
  actionId: string;
  targetId?: string;
  secondaryTargetId?: string;
  customNote?: string;
}

export function initializeGame(
  humanPlayerName: string,
  selectedRoleId: RoleId | 'random',
  settings: GameSettings
): {
  players: Player[];
  events: StoryEvent[];
  dialogues: DialogueMessage[];
} {
  const count = Math.min(Math.max(settings.playerCount, 6), 15);
  
  // Select roles to include
  let rolesPool: RoleId[] = [...ALL_ROLES_ORDER];
  
  let playerRole: RoleId;
  if (selectedRoleId === 'random') {
    playerRole = rolesPool[Math.floor(Math.random() * rolesPool.length)];
  } else {
    playerRole = selectedRoleId;
  }

  // Ensure chosen role is included and remaining roles filled
  const assignedRoles: RoleId[] = [playerRole];
  const remainingRoles = rolesPool.filter(r => r !== playerRole);
  
  // Always prioritize essential conflict roles: killer, doctor, sheriff/detective, judge/lawyer
  const corePriorities: RoleId[] = ['killer', 'doctor', 'sheriff', 'detective', 'judge', 'executioner'];
  for (const pr of corePriorities) {
    if (assignedRoles.length < count && !assignedRoles.includes(pr)) {
      assignedRoles.push(pr);
    }
  }

  // Shuffle remaining
  const shuffledOthers = remainingRoles
    .filter(r => !assignedRoles.includes(r))
    .sort(() => Math.random() - 0.5);

  while (assignedRoles.length < count && shuffledOthers.length > 0) {
    assignedRoles.push(shuffledOthers.pop()!);
  }

  // Shuffle all roles except human index 0
  const humanRole = assignedRoles[0];
  const botRoles = assignedRoles.slice(1).sort(() => Math.random() - 0.5);

  const players: Player[] = [];

  // Human Player
  players.push({
    id: 'p_human',
    name: humanPlayerName || 'You (Investigator)',
    role: humanRole,
    isAlive: true,
    isHuman: true,
    avatarSeed: 'HumanPlayer',
    title: 'The Esteemed Guest',
    suspicionScore: 10,
    coins: humanRole === 'merchant' ? 65 : humanRole === 'gambler' ? 50 : 30,
    items: ['item_vest'],
    will: `[Last Will & Testament of ${humanPlayerName || 'Guest'}]\nI am the ${ROLES[humanRole].name}.\nTrust the law, beware the shadows.`,
    behavioralTells: [],
    votesAgainst: 0
  });

  // Bots
  const personalities = [...BOT_PERSONALITIES].sort(() => Math.random() - 0.5);
  for (let i = 0; i < count - 1; i++) {
    const personality = personalities[i % personalities.length];
    const roleId = botRoles[i];
    const botId = `bot_${i + 1}`;

    players.push({
      id: botId,
      name: personality.name,
      role: roleId,
      isAlive: true,
      isHuman: false,
      avatarSeed: personality.avatarSeed + i,
      title: personality.title,
      suspicionScore: roleId === 'killer' ? 25 : roleId === 'jester' ? 40 : 15,
      coins: roleId === 'merchant' ? 60 : roleId === 'gambler' ? 45 : 30,
      items: roleId === 'killer' ? ['item_poison'] : [],
      will: `[Last Will of ${personality.name}]\nI served this town as ${ROLES[roleId].name}. Seek truth in the records.`,
      behavioralTells: [],
      votesAgainst: 0
    });
  }

  // Assign special targets: Executioner gets a secret target townsperson, Lawyer gets client
  const townMembers = players.filter(p => ROLES[p.role].faction === 'Town');
  const exePlayer = players.find(p => p.role === 'executioner');
  if (exePlayer && townMembers.length > 0) {
    const eligibleTargets = townMembers.filter(p => p.id !== exePlayer.id);
    if (eligibleTargets.length > 0) {
      exePlayer.targetPlayerId = eligibleTargets[Math.floor(Math.random() * eligibleTargets.length)].id;
    }
  }

  const lawyerPlayer = players.find(p => p.role === 'lawyer');
  if (lawyerPlayer) {
    const potentialClients = players.filter(p => p.id !== lawyerPlayer.id);
    lawyerPlayer.targetPlayerId = potentialClients[Math.floor(Math.random() * potentialClients.length)].id;
  }

  // Initial Events
  const events: StoryEvent[] = [
    {
      id: 'init_1',
      dayNumber: 1,
      phase: 'dawn',
      title: 'Assembly at Blackthorn Manor',
      description: `The town assembly has gathered under the grand chandelier. Secret intentions and noble aspirations mingle among ${players.length} guests.`,
      category: 'system',
      involvedPlayerIds: players.map(p => p.id),
      timestamp: '08:00 AM'
    }
  ];

  // Initial Ambient Dialogues
  const dialogues: DialogueMessage[] = [
    {
      id: 'd_init_1',
      senderId: players[1].id,
      senderName: players[1].name,
      text: "The estate gates have been bolted shut. We must ascertain who among us is plotting treason before nightfall.",
      timestamp: '08:05 AM'
    },
    {
      id: 'd_init_2',
      senderId: players[2].id,
      senderName: players[2].name,
      text: "I trust the Judge and our esteemed peacekeepers will maintain order throughout the proceedings.",
      timestamp: '08:07 AM'
    }
  ];

  return { players, events, dialogues };
}

export function generateSpyPartyTells(players: Player[]): BehavioralTell[] {
  const livingPlayers = players.filter(p => p.isAlive);
  const newTells: BehavioralTell[] = [];

  for (const player of livingPlayers) {
    const roleDef = ROLES[player.role];
    const candidateTells = roleDef.spyPartyTells || [];
    if (candidateTells.length === 0) continue;

    // Chance to manifest a tell
    const roll = Math.random();
    if (roll > 0.45) {
      const text = candidateTells[Math.floor(Math.random() * candidateTells.length)];
      const isSuspicious = player.role === 'killer' || player.role === 'jester' || player.role === 'executioner' || Math.random() < 0.2;
      
      const tell: BehavioralTell = {
        id: `tell_${Date.now()}_${player.id}`,
        playerId: player.id,
        actorName: player.name,
        actionText: text,
        isSuspicious,
        timestamp: 'Present'
      };
      newTells.push(tell);
    }
  }

  return newTells;
}

export function generateBotDialogues(
  players: Player[],
  phase: Phase,
  dayNumber: number,
  accusedPlayer?: Player
): DialogueMessage[] {
  const livingBots = players.filter(p => !p.isHuman && p.isAlive);
  if (livingBots.length === 0) return [];

  const dialogues: DialogueMessage[] = [];
  const selectedSpeakers = livingBots.sort(() => Math.random() - 0.5).slice(0, 3);

  for (const bot of selectedSpeakers) {
    const personality = BOT_PERSONALITIES.find(bp => bp.name === bot.name) || BOT_PERSONALITIES[0];
    
    if (phase === 'day_discussion') {
      const isAccusing = Math.random() > 0.4;
      if (isAccusing) {
        const potentialTargets = players.filter(p => p.id !== bot.id && p.isAlive);
        const target = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
        const text = personality.accusations[Math.floor(Math.random() * personality.accusations.length)];
        
        dialogues.push({
          id: `dlg_${Date.now()}_${bot.id}`,
          senderId: bot.id,
          senderName: bot.name,
          text: `[To ${target.name}] ${text}`,
          isAccusation: true,
          targetId: target.id,
          timestamp: 'Just now'
        });
      } else {
        const chat = personality.casualChat[Math.floor(Math.random() * personality.casualChat.length)];
        dialogues.push({
          id: `dlg_${Date.now()}_${bot.id}`,
          senderId: bot.id,
          senderName: bot.name,
          text: chat,
          timestamp: 'Just now'
        });
      }
    } else if (phase === 'trial' && accusedPlayer) {
      if (bot.id === accusedPlayer.id) {
        const defenseText = personality.defenses[Math.floor(Math.random() * personality.defenses.length)];
        dialogues.push({
          id: `dlg_trial_${Date.now()}_${bot.id}`,
          senderId: bot.id,
          senderName: bot.name,
          text: defenseText,
          timestamp: 'On the stand'
        });
      } else if (bot.role === 'lawyer' && bot.targetPlayerId === accusedPlayer.id) {
        dialogues.push({
          id: `dlg_lawyer_${Date.now()}_${bot.id}`,
          senderId: bot.id,
          senderName: bot.name,
          text: `OBJECTION! As counsel for ${accusedPlayer.name}, I remind the court that circumstantial rumors do not constitute guilt!`,
          timestamp: 'Court Counsel'
        });
      } else if (bot.role === 'judge') {
        dialogues.push({
          id: `dlg_judge_${Date.now()}_${bot.id}`,
          senderId: bot.id,
          senderName: bot.name,
          text: `Let the record show the accused has spoken. The jury must weigh their conscience before the gallows.`,
          timestamp: 'From the Bench'
        });
      } else {
        const voteTendency = accusedPlayer.suspicionScore > 40 ? "Guilty! The evidence cannot be overlooked." : "I am hesitant to send an innocent to the rope today.";
        dialogues.push({
          id: `dlg_juror_${Date.now()}_${bot.id}`,
          senderId: bot.id,
          senderName: bot.name,
          text: voteTendency,
          timestamp: 'Jury box'
        });
      }
    }
  }

  return dialogues;
}

export function resolveNightPhase(
  players: Player[],
  humanChoice: NightActionChoice | null,
  dayNumber: number
): {
  updatedPlayers: Player[];
  events: StoryEvent[];
  newReports: ForensicReport[];
  intelFeedback: string[];
} {
  const updatedPlayers = players.map(p => ({
    ...p,
    isProtectedTonight: false,
    isRoleblockedTonight: false
  }));

  const events: StoryEvent[] = [];
  const newReports: ForensicReport[] = [];
  const intelFeedback: string[] = [];

  // Determine Bot Night Actions
  const actionsMap: Record<string, { targetId?: string; actionType: string }> = {};

  for (const p of updatedPlayers) {
    if (!p.isAlive) continue;

    if (p.isHuman) {
      if (humanChoice) {
        actionsMap[p.id] = {
          targetId: humanChoice.targetId,
          actionType: humanChoice.actionId
        };
      }
    } else {
      // Bot decision making
      const livingOthers = updatedPlayers.filter(o => o.id !== p.id && o.isAlive);
      if (livingOthers.length === 0) continue;

      switch (p.role) {
        case 'killer': {
          // Priority targets: High threat town (Judge, Sheriff, Detective, Prince)
          const highThreats = livingOthers.filter(o => ['judge', 'sheriff', 'detective', 'prince'].includes(o.role));
          const target = highThreats.length > 0 && Math.random() > 0.4
            ? highThreats[Math.floor(Math.random() * highThreats.length)]
            : livingOthers[Math.floor(Math.random() * livingOthers.length)];
          actionsMap[p.id] = { targetId: target.id, actionType: 'killer_strike' };
          break;
        }
        case 'doctor': {
          // Heal suspicious or key roles
          const protectCandidates = updatedPlayers.filter(o => o.isAlive);
          const target = protectCandidates[Math.floor(Math.random() * protectCandidates.length)];
          actionsMap[p.id] = { targetId: target.id, actionType: 'doc_heal' };
          break;
        }
        case 'sheriff': {
          const target = livingOthers[Math.floor(Math.random() * livingOthers.length)];
          actionsMap[p.id] = { targetId: target.id, actionType: 'sheriff_interrogate' };
          break;
        }
        case 'detective': {
          const target = livingOthers[Math.floor(Math.random() * livingOthers.length)];
          actionsMap[p.id] = { targetId: target.id, actionType: 'det_track' };
          break;
        }
        case 'tavern_keeper': {
          const target = livingOthers[Math.floor(Math.random() * livingOthers.length)];
          actionsMap[p.id] = { targetId: target.id, actionType: 'tavern_serve' };
          break;
        }
        case 'gambler': {
          const target = updatedPlayers.filter(o => o.isAlive)[Math.floor(Math.random() * updatedPlayers.length)];
          actionsMap[p.id] = { targetId: target?.id, actionType: 'gambler_dice' };
          break;
        }
      }
    }
  }

  // 1. Tavern Keeper Roleblock resolution
  for (const [actorId, act] of Object.entries(actionsMap)) {
    if (act.actionType === 'tavern_serve' && act.targetId) {
      const target = updatedPlayers.find(p => p.id === act.targetId);
      if (target) {
        target.isRoleblockedTonight = true;
        if (target.isHuman) {
          intelFeedback.push("The Tavern Keeper plied you with tankards of fine cider. You were thoroughly roleblocked tonight!");
        }
        events.push({
          id: `ev_tk_${Date.now()}`,
          dayNumber,
          phase: 'night',
          title: 'Tavern Revelry',
          description: `${target.name} spent the late hours enjoying the Tavern Keeper's vintage ale, unable to roam the grounds.`,
          category: 'gossip',
          involvedPlayerIds: [actorId, act.targetId],
          timestamp: 'Night'
        });
      }
    }
  }

  // 2. Doctor Medical Protections
  for (const [actorId, act] of Object.entries(actionsMap)) {
    const actor = updatedPlayers.find(p => p.id === actorId);
    if (!actor || actor.isRoleblockedTonight) continue;

    if (act.actionType === 'doc_heal' && act.targetId) {
      const target = updatedPlayers.find(p => p.id === act.targetId);
      if (target) {
        target.isProtectedTonight = true;
      }
    }
  }

  // 3. Killer Strike Resolution
  for (const [actorId, act] of Object.entries(actionsMap)) {
    const actor = updatedPlayers.find(p => p.id === actorId);
    if (!actor || actor.isRoleblockedTonight) continue;

    if (act.actionType === 'killer_strike' && act.targetId) {
      const victim = updatedPlayers.find(p => p.id === act.targetId);
      if (victim && victim.isAlive) {
        // Check protections: Doctor ward, Prince royal bodyguard, item vest, or Gambler charm
        let saved = false;
        let saveReason = '';

        if (victim.isProtectedTonight) {
          saved = true;
          saveReason = 'The Doctor arrived just in time with surgical sutures and bandages!';
        } else if (victim.role === 'prince' && !victim.immuneFirstHit) {
          saved = true;
          victim.immuneFirstHit = true;
          saveReason = 'The Prince\'s sworn royal bodyguards intercepted the blade, shielding him at great cost!';
        } else if (victim.items.includes('item_vest')) {
          saved = true;
          victim.items = victim.items.filter(it => it !== 'item_vest');
          saveReason = 'A concealed Kevlar-lined aristocrat vest absorbed the brutal strike!';
        }

        if (saved) {
          events.push({
            id: `ev_attack_saved_${Date.now()}`,
            dayNumber,
            phase: 'dawn',
            title: 'Assassination Foiled!',
            description: `A shadowy figure ambushed ${victim.name} in their quarters, but ${saveReason}`,
            category: 'investigation',
            involvedPlayerIds: [victim.id],
            timestamp: 'Dawn'
          });
          if (victim.isHuman) {
            intelFeedback.push(`You were attacked during the dead of night, but saved! (${saveReason})`);
          }
        } else {
          // Lethal kill
          victim.isAlive = false;
          victim.deathNote = humanChoice?.customNote || `Beware the court of shadows. No one is safe.`;

          events.push({
            id: `ev_kill_${Date.now()}`,
            dayNumber,
            phase: 'dawn',
            title: `Corpse Discovered: ${victim.name}`,
            description: `${victim.name} (${victim.title}) was discovered cold and lifeless in the private chambers.`,
            category: 'death',
            involvedPlayerIds: [victim.id],
            details: `Their Will was found folded on the writing desk.\nRole: ${ROLES[victim.role].name}`,
            timestamp: 'Dawn'
          });

          // Generate Forensic Report for the Detective (TTT style forensic certainty)
          const weapons = ['Serrated Silver Dirk', 'Poisoned Lace Cord', 'Chamber Candlestick', 'Concealed Derringer'];
          const chosenWeapon = weapons[Math.floor(Math.random() * weapons.length)];
          const visitors = [actor.name];
          // Add a random passerby for nuance
          const bystander = updatedPlayers.filter(p => p.id !== actor.id && p.id !== victim.id)[0];
          if (bystander) visitors.push(bystander.name);

          const report: ForensicReport = {
            victimId: victim.id,
            victimName: victim.name,
            victimRole: victim.role,
            causeOfDeath: 'Lethal Trauma / Asphyxiation',
            timeEstimated: '03:15 AM (approx 3 hours ago)',
            weaponType: chosenWeapon,
            clues: [
              `Faint scuff marks near the balcony matching size 10 leather soles.`,
              `Scent of bitter almond and burnt wick detected on the collar.`,
              `The lock on the chamber door was picked with professional finesse.`
            ],
            dnaMatches: visitors,
            certaintyPercent: 95
          };
          newReports.push(report);
        }
      }
    }
  }

  // 4. Sheriff Interrogation & Detective Tracking intel for human player
  const human = updatedPlayers.find(p => p.isHuman);
  if (human && human.isAlive && !human.isRoleblockedTonight) {
    if (human.role === 'sheriff' && humanChoice?.targetId) {
      const target = updatedPlayers.find(p => p.id === humanChoice.targetId);
      if (target) {
        const isSuspicious = target.role === 'killer' || target.role === 'executioner' || target.items.includes('item_poison');
        intelFeedback.push(
          `[Sheriff Interrogation] You investigated ${target.name}: Subject is ${isSuspicious ? '⚠️ SUSPICIOUS! They harbor dark secrets.' : '🛡️ LAW-ABIDING (Town / Inoffensive).'}`
        );
      }
    } else if (human.role === 'detective' && humanChoice?.targetId) {
      const target = updatedPlayers.find(p => p.id === humanChoice.targetId);
      if (target) {
        const visitedAction = actionsMap[target.id];
        const visitedPlayer = visitedAction?.targetId ? updatedPlayers.find(p => p.id === visitedAction.targetId) : null;
        intelFeedback.push(
          `[Detective Forensics - 100% Certainty] You shadowed ${target.name}: Tonight, they ${visitedPlayer ? `visited the bedchamber of ${visitedPlayer.name}.` : 'remained behind bolted doors in their own quarters.'}`
        );
      }
    } else if (human.role === 'tavern_keeper' && humanChoice?.targetId) {
      const target = updatedPlayers.find(p => p.id === humanChoice.targetId);
      intelFeedback.push(
        `[Tavern Keeper] You served spiced stout to ${target?.name}. Overheard rumor: "Someone smelled of sulfur near the Prince's vestibule."`
      );
    } else if (human.role === 'gambler') {
      const d20Roll = Math.floor(Math.random() * 20) + 1;
      if (d20Roll >= 15) {
        human.coins += 25;
        intelFeedback.push(`[Gambler's Dice] You rolled a ${d20Roll}! Exceptional luck: You won 25 gold coins!`);
      } else if (d20Roll === 1) {
        intelFeedback.push(`[Gambler's Dice] Natural 1! You dropped your purse and lost 10 coins in the floorboards.`);
        human.coins = Math.max(0, human.coins - 10);
      } else {
        intelFeedback.push(`[Gambler's Dice] You rolled an unremarkable ${d20Roll}. Fortune holds its breath.`);
      }
    }
  }

  return {
    updatedPlayers,
    events,
    newReports,
    intelFeedback
  };
}

export function checkWinCondition(players: Player[]): {
  isOver: boolean;
  winnerFaction?: string;
  headline?: string;
  details?: string;
} {
  const living = players.filter(p => p.isAlive);
  const livingKillers = living.filter(p => p.role === 'killer');
  const livingTown = living.filter(p => ROLES[p.role].faction === 'Town' || ROLES[p.role].faction === 'Artisan & Flavor');

  // Killer Victory
  if (livingKillers.length > 0 && livingKillers.length >= livingTown.length) {
    return {
      isOver: true,
      winnerFaction: 'Outlaws',
      headline: 'The Shadow Prevails!',
      details: 'The Killer has eliminated enough town leaders to plunge Blackthorn Manor into complete anarchy.'
    };
  }

  // Town Victory
  if (livingKillers.length === 0) {
    return {
      isOver: true,
      winnerFaction: 'Town',
      headline: 'Justice Prevails!',
      details: 'All killers and menaces have been brought to justice! The township celebrates a return to peace.'
    };
  }

  return { isOver: false };
}
