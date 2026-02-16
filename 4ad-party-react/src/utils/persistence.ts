import type { Character, JournalData, FollowersData, PartyStats, Quest } from '@/types'
import type { Encounter, BestiaryEntry } from '@/types'

const BESTIARY_KEY = '4AD_Enemy_Bestiary'
const CREATION_MODE_KEY = '4AD_CreationMode'
const LAST_LOADED_KEY = '4AD_LastLoadedParty'

export interface PartyBundle {
  characters: [Character, Character, Character, Character]
  journalData: JournalData
  followersData: FollowersData
  encounters: Encounter[]
  partyStats: PartyStats
  quests: Quest[]
}

export function saveParty(key: string, bundle: PartyBundle): void {
  localStorage.setItem(key, JSON.stringify(bundle.characters))
  localStorage.setItem(`${key}_JournalData`, JSON.stringify(bundle.journalData))
  localStorage.setItem(`${key}_Followers`, JSON.stringify(bundle.followersData))
  localStorage.setItem(`${key}_Encounters`, JSON.stringify(bundle.encounters))
  localStorage.setItem(`${key}_PartyStats`, JSON.stringify(bundle.partyStats))
  localStorage.setItem(`${key}_Quests`, JSON.stringify(bundle.quests))
}

export function loadParty(key: string): PartyBundle | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null

  try {
    const characters = JSON.parse(raw) as [Character, Character, Character, Character]
    const journalData: JournalData = JSON.parse(
      localStorage.getItem(`${key}_JournalData`) ?? '{"entries":[],"npcLocations":[]}',
    )
    const followersData: FollowersData = JSON.parse(
      localStorage.getItem(`${key}_Followers`) ??
        '{"retainers":[],"professionals":[],"animals":[{},{},{},{}],"mounts":[{},{},{},{}]}',
    )
    const encounters: Encounter[] = JSON.parse(
      localStorage.getItem(`${key}_Encounters`) ?? '[]',
    )
    const partyStats: PartyStats = JSON.parse(
      localStorage.getItem(`${key}_PartyStats`) ?? '{"mv":0,"bw":0}',
    )
    const quests: Quest[] = JSON.parse(
      localStorage.getItem(`${key}_Quests`) ?? '[]',
    )

    return { characters, journalData, followersData, encounters, partyStats, quests }
  } catch {
    return null
  }
}

export function deleteParty(key: string): void {
  localStorage.removeItem(key)
  localStorage.removeItem(`${key}_JournalData`)
  localStorage.removeItem(`${key}_Followers`)
  localStorage.removeItem(`${key}_Encounters`)
  localStorage.removeItem(`${key}_PartyStats`)
  localStorage.removeItem(`${key}_Quests`)
}

export function listSavedParties(): string[] {
  const parties: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (
      key &&
      key.startsWith('4AD_Party_') &&
      !key.includes('_JournalData') &&
      !key.includes('_Followers') &&
      !key.includes('_Encounters') &&
      !key.includes('_PartyStats') &&
      !key.includes('_Quests')
    ) {
      parties.push(key)
    }
  }
  return parties.sort()
}

export function partyKeyFromName(name: string): string {
  return `4AD_Party_${name.trim().replace(/\s+/g, '_')}`
}

export function partyNameFromKey(key: string): string {
  return key.replace('4AD_Party_', '').replace(/_/g, ' ')
}

export function saveBestiary(bestiary: BestiaryEntry[]): void {
  localStorage.setItem(BESTIARY_KEY, JSON.stringify(bestiary))
}

export function loadBestiary(): BestiaryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(BESTIARY_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveCreationMode(mode: string): void {
  localStorage.setItem(CREATION_MODE_KEY, mode)
}

export function loadCreationMode(): string {
  return localStorage.getItem(CREATION_MODE_KEY) ?? 'standard'
}

export function setLastLoadedParty(key: string): void {
  localStorage.setItem(LAST_LOADED_KEY, key)
}

export function getLastLoadedParty(): string | null {
  return localStorage.getItem(LAST_LOADED_KEY)
}

export function exportAllData(): string {
  const data: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('4AD_')) {
      data[key] = localStorage.getItem(key) ?? ''
    }
  }
  return JSON.stringify(data, null, 2)
}

export function importAllData(json: string): boolean {
  try {
    const data = JSON.parse(json) as Record<string, string>
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('4AD_')) {
        localStorage.setItem(key, value)
      }
    }
    return true
  } catch {
    return false
  }
}
