export type AgentId = 'drew' | 'juju' | 'wave' | 'mp' | 'mechanic' | 'qa' | 'au' | 'oracle' | 'omega';

export type AgentRealm = 'cloud' | 'local' | 'sovereign';

export interface AgentProfile {
  id: AgentId;
  name: string;
  title: string;
  realm: AgentRealm;
  rune: string;
  runeName: string;
  avatarSymbol: string;
  description: string;
  specialties: string[];
  status: 'online' | 'processing' | 'standby' | 'purifying';
  color: {
    text: string;
    border: string;
    bg: string;
    glow: string;
  };
}

export type TicketStatus = 
  | 'backlog' 
  | 'cleanroom' 
  | 'dispatched' 
  | 'mechanic_forge' 
  | 'qa_inspection' 
  | 'merged';

export type TicketPriority = 'Cosmic' | 'High' | 'Normal' | 'Stellar Backlog';
export type TicketDifficulty = 'Apprentice' | 'Adept' | 'Archmage' | 'Cosmic';
export type ProjectScope = 'all' | 'pr0sis' | 'journeys_unto';

export interface TicketCriterion {
  id: string;
  text: string;
  completed: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  project?: 'pr0sis' | 'journeys_unto';
  objective: string;
  status: TicketStatus;
  priority: TicketPriority;
  targetAgent: AgentId;
  runeAffinity: string;
  difficultyRank: TicketDifficulty;
  acceptanceCriteria: TicketCriterion[];
  mathematicalOrPhysicsSpec?: string;
  localDispatchCommand?: string;
  codeStarterSnippet?: string;
  reasoning?: string;
  oracleProphecy?: string;
  branch?: string;
  purityScore?: number;
  isBlocked?: boolean;
  blockedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SprintGoal {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetFPS: number;
  currentAvgFPS: number;
  targetPurityScore: number;
  currentPurityScore: number;
  milestoneConstellation: string;
  keyDirectives: string[];
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  branch: string;
  rune: string;
  tickets: string[];
}

export interface GitRepoState {
  url: string;
  branch: string;
  branches: string[];
  isSynced: boolean;
  lastSync: string;
  commits: GitCommit[];
}

export interface CleanroomReport {
  purityScore: number;
  cleanroomStatus: 'PURIFIED' | 'SANITIZED_WITH_WARNINGS' | 'QUARANTINED';
  astralSeal: string;
  summary: string;
  memoryLeakHazards: string[];
  framePacingAudit: {
    targetFPS: string;
    determinismRisk: string;
    timingNotes: string;
  };
  isolatedSandboxCode: string;
  cleanroomDecree: string;
}
