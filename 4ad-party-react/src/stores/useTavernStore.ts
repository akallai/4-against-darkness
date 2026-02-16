import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character } from '@/types'

export interface TavernHero extends Character {
  tavernId: number
}

interface TavernState {
  roster: TavernHero[]

  setRoster: (roster: TavernHero[]) => void
  addHero: (hero: TavernHero) => void
  updateHero: (tavernId: number, updates: Partial<TavernHero>) => void
  deleteHero: (tavernId: number) => void
  syncFromParty: (characters: Character[]) => void
}

export const useTavernStore = create<TavernState>()(
  persist(
    (set) => ({
      roster: [],

      setRoster: (roster) => set({ roster }),

      addHero: (hero) =>
        set((state) => ({ roster: [...state.roster, hero] })),

      updateHero: (tavernId, updates) =>
        set((state) => ({
          roster: state.roster.map((h) =>
            h.tavernId === tavernId ? { ...h, ...updates } : h,
          ),
        })),

      deleteHero: (tavernId) =>
        set((state) => ({
          roster: state.roster.filter((h) => h.tavernId !== tavernId),
        })),

      syncFromParty: (characters) =>
        set((state) => {
          const newRoster = [...state.roster]
          for (const char of characters) {
            if (!char.tavernId || !char.name) continue
            const idx = newRoster.findIndex((h) => h.tavernId === char.tavernId)
            if (idx >= 0) {
              newRoster[idx] = { ...char, tavernId: char.tavernId } as TavernHero
            }
          }
          return { roster: newRoster }
        }),
    }),
    {
      name: '4AD_Tavern_Roster',
    },
  ),
)
