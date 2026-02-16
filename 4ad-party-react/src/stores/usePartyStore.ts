import { create } from 'zustand'
import type { Character, CreationMode, PartyStats } from '@/types'
import { createEmptyCharacter } from '@/types'

interface PartyState {
  currentPartyKey: string
  partyName: string
  creationMode: CreationMode
  characters: [Character, Character, Character, Character]
  partyStats: PartyStats

  setPartyKey: (key: string) => void
  setPartyName: (name: string) => void
  setCreationMode: (mode: CreationMode) => void
  setCharacter: (index: number, char: Character) => void
  updateCharacter: (index: number, updates: Partial<Character>) => void
  setCharacters: (chars: [Character, Character, Character, Character]) => void
  swapCharacters: (a: number, b: number) => void
  setPartyStats: (stats: PartyStats) => void
  incrementStat: (stat: keyof PartyStats, amount?: number) => void
  resetParty: () => void
}

const defaultCharacters: [Character, Character, Character, Character] = [
  createEmptyCharacter(0),
  createEmptyCharacter(1),
  createEmptyCharacter(2),
  createEmptyCharacter(3),
]

export const usePartyStore = create<PartyState>()((set) => ({
  currentPartyKey: '',
  partyName: '',
  creationMode: 'standard',
  characters: defaultCharacters,
  partyStats: { mv: 0, bw: 0 },

  setPartyKey: (key) => set({ currentPartyKey: key }),
  setPartyName: (name) => set({ partyName: name }),
  setCreationMode: (mode) => set({ creationMode: mode }),

  setCharacter: (index, char) =>
    set((state) => {
      const chars = [...state.characters] as [Character, Character, Character, Character]
      chars[index] = char
      return { characters: chars }
    }),

  updateCharacter: (index, updates) =>
    set((state) => {
      const chars = [...state.characters] as [Character, Character, Character, Character]
      chars[index] = { ...chars[index]!, ...updates }
      return { characters: chars }
    }),

  setCharacters: (chars) => set({ characters: chars }),

  swapCharacters: (a, b) =>
    set((state) => {
      const chars = [...state.characters] as [Character, Character, Character, Character]
      const temp = chars[a]!
      chars[a] = chars[b]!
      chars[b] = temp
      return { characters: chars }
    }),

  setPartyStats: (stats) => set({ partyStats: stats }),

  incrementStat: (stat, amount = 1) =>
    set((state) => ({
      partyStats: { ...state.partyStats, [stat]: state.partyStats[stat] + amount },
    })),

  resetParty: () =>
    set({
      currentPartyKey: '',
      partyName: '',
      characters: [
        createEmptyCharacter(0),
        createEmptyCharacter(1),
        createEmptyCharacter(2),
        createEmptyCharacter(3),
      ],
      partyStats: { mv: 0, bw: 0 },
    }),
}))
