export interface JournalEntry {
  id: number
  title: string
  content: string
  collapsed: boolean
}

export interface NPC {
  id: number
  name: string
  race: string
  l: string
  life: string
  attacks: string
  details: string
  collapsed: boolean
}

export interface NPCLocation {
  id: number
  name: string
  details: string
  collapsed: boolean
  list: NPC[]
}

export interface JournalData {
  entries: JournalEntry[]
  npcLocations: NPCLocation[]
}

export function createEmptyJournalData(): JournalData {
  return {
    entries: [],
    npcLocations: [],
  }
}
