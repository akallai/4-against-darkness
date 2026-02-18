import { create } from 'zustand'
import type { Encounter, BestiaryEntry } from '@/types'
import { usePartyStore } from './usePartyStore'

interface EncounterState {
  encounters: Encounter[]
  bestiary: BestiaryEntry[]

  setEncounters: (encounters: Encounter[]) => void
  setBestiary: (bestiary: BestiaryEntry[]) => void
  resetEncounters: () => void

  addEncounter: (encounter: Omit<Encounter, 'id' | 'status' | 'collapsed' | 'moraleChecked' | 'isCompleted' | 'outcome'>) => void
  updateEncounter: (id: number, updates: Partial<Encounter>) => void
  deleteEncounter: (id: number) => void
  toggleEncounterCollapse: (id: number) => void
  toggleEnemyStatus: (encounterId: number, enemyIndex: number) => void
  completeEncounter: (id: number, outcome: string) => void
  setMoraleChecked: (id: number) => void
  setEncounterCount: (id: number, count: number) => void

  addBestiaryEntry: (entry: BestiaryEntry) => void
  updateBestiaryEntry: (index: number, entry: BestiaryEntry) => void
  deleteBestiaryEntry: (index: number) => void
}

export const useEncounterStore = create<EncounterState>()((set) => ({
  encounters: [],
  bestiary: [],

  setEncounters: (encounters) => set({ encounters }),
  setBestiary: (bestiary) => set({ bestiary }),
  resetEncounters: () => set({ encounters: [] }),

  addEncounter: (encounter) =>
    set((state) => ({
      encounters: [
        ...state.encounters,
        {
          ...encounter,
          id: Date.now(),
          status: new Array(encounter.count).fill(false) as boolean[],
          collapsed: false,
          moraleChecked: false,
          isCompleted: false,
          outcome: '',
        },
      ],
    })),

  updateEncounter: (id, updates) =>
    set((state) => ({
      encounters: state.encounters.map((e) =>
        e.id === id ? { ...e, ...updates } : e,
      ),
    })),

  deleteEncounter: (id) =>
    set((state) => ({
      encounters: state.encounters.filter((e) => e.id !== id),
    })),

  toggleEncounterCollapse: (id) =>
    set((state) => ({
      encounters: state.encounters.map((e) =>
        e.id === id ? { ...e, collapsed: !e.collapsed } : e,
      ),
    })),

  toggleEnemyStatus: (encounterId, enemyIndex) =>
    set((state) => ({
      encounters: state.encounters.map((e) => {
        if (e.id !== encounterId) return e
        const newStatus = [...e.status]
        if (newStatus[enemyIndex]) {
          // Clicking a defeated pip: clear it and all after it
          for (let i = enemyIndex; i < newStatus.length; i++) newStatus[i] = false
        } else {
          // Clicking an undefeated pip: fill it and all before it
          for (let i = 0; i <= enemyIndex; i++) newStatus[i] = true
        }
        // Auto-complete when all enemies are defeated
        if (newStatus.every(Boolean) && !e.isCompleted) {
          const stat = e.category === 'minion' ? 'mv' : 'bw'
          usePartyStore.getState().incrementStat(stat, e.count)
          return { ...e, status: newStatus, isCompleted: true, outcome: 'victory' }
        }
        return { ...e, status: newStatus }
      }),
    })),

  completeEncounter: (id, outcome) =>
    set((state) => ({
      encounters: state.encounters.map((e) =>
        e.id === id ? { ...e, isCompleted: true, outcome } : e,
      ),
    })),

  setMoraleChecked: (id) =>
    set((state) => ({
      encounters: state.encounters.map((e) =>
        e.id === id ? { ...e, moraleChecked: true } : e,
      ),
    })),

  setEncounterCount: (id, count) =>
    set((state) => ({
      encounters: state.encounters.map((e) => {
        if (e.id !== id || count < 1) return e
        const newStatus = e.status.slice(0, count)
        while (newStatus.length < count) newStatus.push(false)
        return { ...e, count, status: newStatus }
      }),
    })),

  addBestiaryEntry: (entry) =>
    set((state) => ({ bestiary: [...state.bestiary, entry] })),

  updateBestiaryEntry: (index, entry) =>
    set((state) => ({
      bestiary: state.bestiary.map((e, i) => (i === index ? entry : e)),
    })),

  deleteBestiaryEntry: (index) =>
    set((state) => ({
      bestiary: state.bestiary.filter((_, i) => i !== index),
    })),
}))
