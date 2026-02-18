export interface ListItem {
  val: string
  det: string
}

export interface Milestone {
  val: string
  det: string
  completed: boolean
}

export interface Character {
  name: string
  class: string
  lvl: number
  hp: string // format: "current/max"
  gp: number
  atk: string // format: "+N"
  def: string // format: "+N"
  madness: number
  clues: number
  rations: number
  xp: number
  color: string // hex color
  lantern: boolean
  bandaged: boolean
  gear: ListItem[]
  spells: ListItem[]
  abilities: ListItem[]
  traits: ListItem[]
  milestones: Milestone[]
  notes: string
  tavernId?: number
}

export function createEmptyCharacter(slotIndex: number): Character {
  const defaultColors = ['#d4af37', '#c0c0c0', '#cd7f32', '#b87333']
  return {
    name: '',
    class: '',
    lvl: 1,
    hp: '0/0',
    gp: 0,
    atk: '+0',
    def: '+0',
    madness: 0,
    clues: 0,
    rations: 0,
    xp: 0,
    color: defaultColors[slotIndex % 4]!,
    lantern: false,
    bandaged: false,
    gear: [],
    spells: [],
    abilities: [],
    traits: [],
    milestones: [],
    notes: '',
  }
}
