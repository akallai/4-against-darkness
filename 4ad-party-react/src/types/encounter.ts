export type EncounterCategory = 'minion' | 'boss' | 'weird'

export interface Encounter {
  id: number
  type: string
  category: EncounterCategory
  lvl: string
  life: string
  morale: string
  treasure: string
  attacks: string
  abilities: string
  notes: string
  count: number
  status: boolean[] // tracks which enemies are defeated
  collapsed: boolean
  moraleChecked: boolean
  isCompleted: boolean
  outcome: string
}

export interface BestiaryEntry {
  type: string
  category: EncounterCategory
  lvl: string
  life: string
  morale: string
  treasure: string
  attacks: string
  abilities: string
  notes: string
}
