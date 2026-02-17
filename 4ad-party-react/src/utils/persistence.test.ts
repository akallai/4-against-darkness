import { describe, it, expect, beforeEach } from 'vitest'
import { partyKeyFromName, partyNameFromKey, saveParty, loadParty, deleteParty, listSavedParties } from './persistence'
import { createEmptyCharacter, createEmptyJournalData, createEmptyFollowersData, createEmptyMapData } from '@/types'

describe('persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('converts party name to key', () => {
    expect(partyKeyFromName('Test Party')).toBe('4AD_Party_Test_Party')
    expect(partyKeyFromName('  spaces  ')).toBe('4AD_Party_spaces')
  })

  it('converts key back to name', () => {
    expect(partyNameFromKey('4AD_Party_Test_Party')).toBe('Test Party')
  })

  it('saves and loads a party', () => {
    const bundle = {
      characters: [
        { ...createEmptyCharacter(0), name: 'Hero' },
        createEmptyCharacter(1),
        createEmptyCharacter(2),
        createEmptyCharacter(3),
      ] as [typeof createEmptyCharacter extends (i: number) => infer R ? R : never, typeof createEmptyCharacter extends (i: number) => infer R ? R : never, typeof createEmptyCharacter extends (i: number) => infer R ? R : never, typeof createEmptyCharacter extends (i: number) => infer R ? R : never],
      journalData: createEmptyJournalData(),
      followersData: createEmptyFollowersData(),
      encounters: [],
      partyStats: { mv: 5, bw: 2 },
      quests: [],
      mapData: createEmptyMapData(),
    }
    saveParty('4AD_Party_Test', bundle)
    const loaded = loadParty('4AD_Party_Test')
    expect(loaded).not.toBeNull()
    expect(loaded!.characters[0]?.name).toBe('Hero')
    expect(loaded!.partyStats.mv).toBe(5)
  })

  it('deletes a party', () => {
    const bundle = {
      characters: [createEmptyCharacter(0), createEmptyCharacter(1), createEmptyCharacter(2), createEmptyCharacter(3)] as [ReturnType<typeof createEmptyCharacter>, ReturnType<typeof createEmptyCharacter>, ReturnType<typeof createEmptyCharacter>, ReturnType<typeof createEmptyCharacter>],
      journalData: createEmptyJournalData(),
      followersData: createEmptyFollowersData(),
      encounters: [],
      partyStats: { mv: 0, bw: 0 },
      quests: [],
      mapData: createEmptyMapData(),
    }
    saveParty('4AD_Party_Del', bundle)
    expect(loadParty('4AD_Party_Del')).not.toBeNull()
    deleteParty('4AD_Party_Del')
    expect(loadParty('4AD_Party_Del')).toBeNull()
  })

  it('lists saved parties', () => {
    const bundle = {
      characters: [createEmptyCharacter(0), createEmptyCharacter(1), createEmptyCharacter(2), createEmptyCharacter(3)] as [ReturnType<typeof createEmptyCharacter>, ReturnType<typeof createEmptyCharacter>, ReturnType<typeof createEmptyCharacter>, ReturnType<typeof createEmptyCharacter>],
      journalData: createEmptyJournalData(),
      followersData: createEmptyFollowersData(),
      encounters: [],
      partyStats: { mv: 0, bw: 0 },
      quests: [],
      mapData: createEmptyMapData(),
    }
    saveParty('4AD_Party_Alpha', bundle)
    saveParty('4AD_Party_Beta', bundle)
    const list = listSavedParties()
    expect(list).toContain('4AD_Party_Alpha')
    expect(list).toContain('4AD_Party_Beta')
    expect(list).toHaveLength(2)
  })
})
