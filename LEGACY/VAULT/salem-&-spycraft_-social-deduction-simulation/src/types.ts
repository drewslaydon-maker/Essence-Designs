export type Faction = 'Town' | 'Outlaw' | 'Neutral Evil' | 'Neutral Chaos' | 'Neutral Barter' | 'Artisan & Flavor';

export type RoleId = 
  | 'judge' 
  | 'sheriff' 
  | 'killer' 
  | 'executioner' 
  | 'jester' 
  | 'prince' 
  | 'merchant' 
  | 'lawyer' 
  | 'tavern_keeper' 
  | 'doctor' 
  | 'detective' 
  | 'cook' 
  | 'artist' 
  | 'musician' 
  | 'gambler';

export type Phase = 'dawn' | 'day_discussion' | 'trial' | 'dusk' | 'night' | 'game_over';

export interface Ability {
  id: string;
  name: string;
  description: string;
  phase: 'day' | 'night' | 'trial' | 'dusk' | 'dawn' | 'passive';
  charges?: number;
  cooldown?: number;
  iconName: string;
}

export interface RoleDefinition {
  id: RoleId;
  name: string;
  faction: Faction;
  badgeColor: string; // Tailwind color class or hex
  accentColor: string;
  icon: string;
  tagline: string;
  description: string;
  detailedAbilities: Ability[];
  winCondition: string;
  prerogativeLevel: 'Absolute' | 'High' | 'Moderate' | 'Specialized';
  spyPartyTells: string[];
}

export interface BehavioralTell {
  id: string;
  playerId: string;
  actorName: string;
  actionText: string;
  isSuspicious: boolean;
  discoveredBy?: string; // e.g. Artist, Detective
  timestamp: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: 'shield' | 'truth_serum' | 'dna_scanner' | 'smoke_bomb' | 'disguise' | 'poison';
  icon: string;
}

export interface ForensicReport {
  victimId: string;
  victimName: string;
  victimRole: RoleId;
  causeOfDeath: string;
  timeEstimated: string;
  weaponType: string;
  clues: string[];
  dnaMatches: string[]; // List of suspected visitors
  certaintyPercent: number;
}

export interface Player {
  id: string;
  name: string;
  role: RoleId;
  isAlive: boolean;
  isHuman: boolean;
  avatarSeed: string;
  title: string;
  suspicionScore: number; // 0 to 100
  coins: number;
  items: string[];
  will: string;
  deathNote?: string;
  targetPlayerId?: string; // Used by Executioner, Lawyer, or Gambler
  hasProtectedSelf?: boolean; // Doctor self-heal
  immuneFirstHit?: boolean; // Prince royal ward
  isProtectedTonight?: boolean;
  isRoleblockedTonight?: boolean;
  lastActionUsed?: string;
  behavioralTells: BehavioralTell[];
  votesAgainst: number;
  votedForId?: string | null;
  trialVote?: 'guilty' | 'innocent' | 'abstain' | null;
}

export interface StoryEvent {
  id: string;
  dayNumber: number;
  phase: Phase;
  title: string;
  description: string;
  category: 'death' | 'verdict' | 'investigation' | 'gossip' | 'tell' | 'trade' | 'system';
  involvedPlayerIds: string[];
  details?: string;
  timestamp: string;
}

export interface DialogueMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: RoleId; // only revealed if known or user
  text: string;
  isAccusation?: boolean;
  targetId?: string;
  timestamp: string;
}

export interface GameSettings {
  playerCount: number;
  gameSeed: string;
  allowRoleRevealOnDeath: boolean;
  turnPacing: 'manual' | 'brisk' | 'relaxed';
  includeFlavorRoles: boolean;
}
