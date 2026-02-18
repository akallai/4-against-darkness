export interface Retainer {
  name: string
  role: string
  fee: string
  notes: string
}

export interface Professional {
  name: string
  role: string
  fee: string
  notes: string
}

export interface AnimalCompanion {
  owner: string
  name: string
  type: string
  life: number
  atk: string
  def: string
  notes: string
}

export interface Mount {
  owner: string
  name: string
  type: string
  life: number
  notes: string
}

export interface FollowersData {
  retainers: Retainer[]
  professionals: Professional[]
  animals: [AnimalCompanion, AnimalCompanion, AnimalCompanion, AnimalCompanion]
  mounts: [Mount, Mount, Mount, Mount]
}

export function createEmptyAnimal(): AnimalCompanion {
  return { owner: '', name: '', type: '', life: 0, atk: '+0', def: '+0', notes: '' }
}

export function createEmptyMount(): Mount {
  return { owner: '', name: '', type: '', life: 0, notes: '' }
}

export function createEmptyFollowersData(): FollowersData {
  return {
    retainers: [],
    professionals: [],
    animals: [createEmptyAnimal(), createEmptyAnimal(), createEmptyAnimal(), createEmptyAnimal()],
    mounts: [createEmptyMount(), createEmptyMount(), createEmptyMount(), createEmptyMount()],
  }
}
