import { create } from 'zustand'
import type { Encounter, BestiaryEntry } from '@/types'

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
        newStatus[enemyIndex] = !newStatus[enemyIndex]
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
