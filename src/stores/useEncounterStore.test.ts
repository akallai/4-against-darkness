import { describe, it, expect, beforeEach } from 'vitest'
import { useEncounterStore } from './useEncounterStore'
import { usePartyStore } from './usePartyStore'

describe('useEncounterStore', () => {
  beforeEach(() => {
    useEncounterStore.setState({ encounters: [], bestiary: [] })
  })

  it('adds an encounter', () => {
    useEncounterStore.getState().addEncounter({
      type: 'Goblin',
      category: 'minion',
      lvl: '1',
      life: '1',
      morale: '3',
      treasure: 'None',
      attacks: '1',
      abilities: '',
      notes: '',
      count: 3,
    })
    const encounters = useEncounterStore.getState().encounters
    expect(encounters).toHaveLength(1)
    expect(encounters[0]?.type).toBe('Goblin')
    expect(encounters[0]?.count).toBe(3)
    expect(encounters[0]?.status).toEqual([false, false, false])
    expect(encounters[0]?.isCompleted).toBe(false)
  })

  it('toggles enemy status with fill-from-left behavior', () => {
    useEncounterStore.getState().addEncounter({
      type: 'Skeleton',
      category: 'minion',
      lvl: '2',
      life: '1',
      morale: '0',
      treasure: '1gp',
      attacks: '1',
      abilities: '',
      notes: '',
      count: 5,
    })
    const id = useEncounterStore.getState().encounters[0]!.id

    // Clicking pip 3 (4th) fills 0..3
    useEncounterStore.getState().toggleEnemyStatus(id, 3)
    expect(useEncounterStore.getState().encounters[0]?.status).toEqual([true, true, true, true, false])

    // Clicking pip 1 (2nd, already defeated) clears 1..4
    useEncounterStore.getState().toggleEnemyStatus(id, 1)
    expect(useEncounterStore.getState().encounters[0]?.status).toEqual([true, false, false, false, false])

    // Clicking pip 0 (1st, already defeated) clears all
    useEncounterStore.getState().toggleEnemyStatus(id, 0)
    expect(useEncounterStore.getState().encounters[0]?.status).toEqual([false, false, false, false, false])
  })

  it('auto-completes as victory when all enemies are defeated', () => {
    usePartyStore.setState({ partyStats: { mv: 0, bw: 0 } })
    useEncounterStore.getState().addEncounter({
      type: 'Goblin',
      category: 'minion',
      lvl: '1',
      life: '1',
      morale: '3',
      treasure: 'None',
      attacks: '1',
      abilities: '',
      notes: '',
      count: 3,
    })
    const id = useEncounterStore.getState().encounters[0]!.id

    // Defeat all enemies by clicking the last pip
    useEncounterStore.getState().toggleEnemyStatus(id, 2)
    const enc = useEncounterStore.getState().encounters[0]!
    expect(enc.status).toEqual([true, true, true])
    expect(enc.isCompleted).toBe(true)
    expect(enc.outcome).toBe('victory')
    // Should have incremented minion victories once per encounter
    expect(usePartyStore.getState().partyStats.mv).toBe(1)
  })

  it('auto-completes boss encounters and increments bw stat', () => {
    usePartyStore.setState({ partyStats: { mv: 0, bw: 0 } })
    useEncounterStore.getState().addEncounter({
      type: 'Dragon',
      category: 'boss',
      lvl: '5',
      life: '10',
      morale: '0',
      treasure: 'Hoard',
      attacks: '3',
      abilities: 'Fire Breath',
      notes: '',
      count: 1,
    })
    const id = useEncounterStore.getState().encounters[0]!.id

    useEncounterStore.getState().toggleEnemyStatus(id, 0)
    const enc = useEncounterStore.getState().encounters[0]!
    expect(enc.isCompleted).toBe(true)
    expect(enc.outcome).toBe('victory')
    expect(usePartyStore.getState().partyStats.bw).toBe(1)
  })

  it('completes an encounter', () => {
    useEncounterStore.getState().addEncounter({
      type: 'Dragon',
      category: 'boss',
      lvl: '5',
      life: '10',
      morale: '0',
      treasure: 'Hoard',
      attacks: '3',
      abilities: 'Fire Breath',
      notes: '',
      count: 1,
    })
    const id = useEncounterStore.getState().encounters[0]!.id
    useEncounterStore.getState().completeEncounter(id, 'victory')
    expect(useEncounterStore.getState().encounters[0]?.isCompleted).toBe(true)
    expect(useEncounterStore.getState().encounters[0]?.outcome).toBe('victory')
  })

  it('manages bestiary entries', () => {
    const entry = {
      type: 'Orc',
      category: 'minion' as const,
      lvl: '3',
      life: '3',
      morale: '4',
      treasure: '1d6 gp',
      attacks: '1',
      abilities: '',
      notes: '',
      environment: 'custom' as const,
      count: '1',
    }
    useEncounterStore.getState().addBestiaryEntry(entry)
    expect(useEncounterStore.getState().bestiary).toHaveLength(1)
    useEncounterStore.getState().deleteBestiaryEntry(0)
    expect(useEncounterStore.getState().bestiary).toHaveLength(0)
  })
})
