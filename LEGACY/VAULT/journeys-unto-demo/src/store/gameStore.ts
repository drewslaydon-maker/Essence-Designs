import { create } from 'zustand'

export interface Character {
  id: string
  name: string
  hp: number
  maxHp: number
  primary: string
  abilities: Record<string, string>
  sprite: { width: number; height: number; color: string }
}

export interface GameState {
  party: Character[]
  flags: {
    hasPassedLanding: boolean
    hasSeenVista: boolean
    hasMetCompanion: boolean
    companionForm: string
    hasDefeatedWarden: boolean
    isGameOver: boolean
  }
  activeCharacterId: string
  volume: number
  dialogueState: {
    isActive: boolean
    stage: number
    text: string
  }
  combatState: {
    isActive: boolean
    enemyHp: number
    enemyMaxHp: number
    enemyAc: number
    log: string[]
    turn: 'player' | 'enemy'
    hasClone: boolean
  }
  loadState: (data: Partial<GameState>) => void
  setFlag: (key: keyof GameState['flags'], value: any) => void
  setActiveCharacter: (id: string) => void
  setVolume: (vol: number) => void
  setDialogue: (isActive: boolean, stage?: number, text?: string) => void
  startCombat: () => void
  endCombat: (won: boolean) => void
  addCombatLog: (msg: string) => void
  setEnemyHp: (hp: number) => void
  damageActiveCharacter: (amount: number) => void
  triggerGameOver: () => void
  setTurn: (turn: 'player' | 'enemy') => void
  setHasClone: (hasClone: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
  party: [],
  flags: {
    hasPassedLanding: false,
    hasSeenVista: false,
    hasMetCompanion: false,
    companionForm: '',
    hasDefeatedWarden: false,
    isGameOver: false
  },
  activeCharacterId: '',
  volume: 0.5,
  dialogueState: {
    isActive: false,
    stage: 0,
    text: ''
  },
  combatState: {
    isActive: false,
    enemyHp: 90,
    enemyMaxHp: 90,
    enemyAc: 14,
    log: [],
    turn: 'player',
    hasClone: false
  },
  loadState: (data) => set((state) => ({ ...state, ...data })),
  setFlag: (key, value) => set((state) => ({ flags: { ...state.flags, [key]: value } })),
  setActiveCharacter: (id) => set({ activeCharacterId: id }),
  setVolume: (vol) => set({ volume: vol }),
  setDialogue: (isActive, stage = 0, text = '') => set((state) => ({
    dialogueState: { ...state.dialogueState, isActive, stage: stage || state.dialogueState.stage, text: text || state.dialogueState.text }
  })),
  startCombat: () => set((state) => ({
    combatState: { ...state.combatState, isActive: true, enemyHp: 90, log: ['Combat started against Stasis Remnant!'], turn: 'player', hasClone: false }
  })),
  endCombat: (won) => set((state) => ({
    combatState: { ...state.combatState, isActive: false },
    flags: { ...state.flags, hasDefeatedWarden: won ? true : state.flags.hasDefeatedWarden }
  })),
  addCombatLog: (msg) => set((state) => ({
    combatState: { ...state.combatState, log: [...state.combatState.log, msg] }
  })),
  setEnemyHp: (hp) => set((state) => ({
    combatState: { ...state.combatState, enemyHp: hp }
  })),
  damageActiveCharacter: (amount) => set((state) => {
    const newParty = state.party.map(char => {
      if (char.id === state.activeCharacterId) {
        return { ...char, hp: Math.max(0, char.hp - amount) }
      }
      return char
    })
    return { party: newParty }
  }),
  triggerGameOver: () => set((state) => ({
    flags: { ...state.flags, isGameOver: true },
    combatState: { ...state.combatState, isActive: false }
  })),
  setTurn: (turn) => set((state) => ({ combatState: { ...state.combatState, turn } })),
  setHasClone: (hasClone) => set((state) => ({ combatState: { ...state.combatState, hasClone } }))
}))
