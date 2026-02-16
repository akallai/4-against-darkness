import { create } from 'zustand'
import type { JournalData, JournalEntry, NPC, NPCLocation } from '@/types'
import { createEmptyJournalData } from '@/types'

interface JournalState {
  journalData: JournalData

  setJournalData: (data: JournalData) => void
  resetJournal: () => void

  // Entries
  addEntry: (title?: string) => void
  updateEntry: (id: number, updates: Partial<JournalEntry>) => void
  deleteEntry: (id: number) => void
  toggleEntryCollapse: (id: number) => void

  // NPC Locations
  addNPCLocation: (name?: string) => void
  updateLocation: (id: number, updates: Partial<NPCLocation>) => void
  deleteLocation: (id: number) => void
  toggleLocationCollapse: (id: number) => void

  // NPCs
  addNPC: (locationId: number) => void
  updateNPC: (locationId: number, npcId: number, updates: Partial<NPC>) => void
  deleteNPC: (locationId: number, npcId: number) => void
  toggleNPCCollapse: (locationId: number, npcId: number) => void
}

export const useJournalStore = create<JournalState>()((set) => ({
  journalData: createEmptyJournalData(),

  setJournalData: (data) => set({ journalData: data }),
  resetJournal: () => set({ journalData: createEmptyJournalData() }),

  addEntry: (title) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        entries: [
          ...state.journalData.entries,
          { id: Date.now(), title: title ?? 'New Entry', content: '', collapsed: false },
        ],
      },
    })),

  updateEntry: (id, updates) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        entries: state.journalData.entries.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      },
    })),

  deleteEntry: (id) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        entries: state.journalData.entries.filter((e) => e.id !== id),
      },
    })),

  toggleEntryCollapse: (id) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        entries: state.journalData.entries.map((e) =>
          e.id === id ? { ...e, collapsed: !e.collapsed } : e,
        ),
      },
    })),

  addNPCLocation: (name) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        npcLocations: [
          ...state.journalData.npcLocations,
          { id: Date.now(), name: name ?? 'New Location', details: '', collapsed: false, list: [] },
        ],
      },
    })),

  updateLocation: (id, updates) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        npcLocations: state.journalData.npcLocations.map((loc) =>
          loc.id === id ? { ...loc, ...updates } : loc,
        ),
      },
    })),

  deleteLocation: (id) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        npcLocations: state.journalData.npcLocations.filter((loc) => loc.id !== id),
      },
    })),

  toggleLocationCollapse: (id) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        npcLocations: state.journalData.npcLocations.map((loc) =>
          loc.id === id ? { ...loc, collapsed: !loc.collapsed } : loc,
        ),
      },
    })),

  addNPC: (locationId) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        npcLocations: state.journalData.npcLocations.map((loc) =>
          loc.id === locationId
            ? {
                ...loc,
                list: [
                  ...loc.list,
                  { id: Date.now(), name: '', race: '', l: '', life: '', attacks: '', details: '', collapsed: false },
                ],
              }
            : loc,
        ),
      },
    })),

  updateNPC: (locationId, npcId, updates) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        npcLocations: state.journalData.npcLocations.map((loc) =>
          loc.id === locationId
            ? { ...loc, list: loc.list.map((npc) => (npc.id === npcId ? { ...npc, ...updates } : npc)) }
            : loc,
        ),
      },
    })),

  deleteNPC: (locationId, npcId) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        npcLocations: state.journalData.npcLocations.map((loc) =>
          loc.id === locationId
            ? { ...loc, list: loc.list.filter((npc) => npc.id !== npcId) }
            : loc,
        ),
      },
    })),

  toggleNPCCollapse: (locationId, npcId) =>
    set((state) => ({
      journalData: {
        ...state.journalData,
        npcLocations: state.journalData.npcLocations.map((loc) =>
          loc.id === locationId
            ? {
                ...loc,
                list: loc.list.map((npc) =>
                  npc.id === npcId ? { ...npc, collapsed: !npc.collapsed } : npc,
                ),
              }
            : loc,
        ),
      },
    })),
}))
