import { describe, it, expect, beforeEach } from 'vitest'
import { usePartyStore } from './usePartyStore'

describe('usePartyStore', () => {
  beforeEach(() => {
    usePartyStore.setState({
      currentPartyKey: '',
      partyName: '',
      creationMode: 'standard',
      characters: [
        { name: '', class: '', lvl: 1, hp: '0/0', gp: 0, atk: '+0', def: '+0', madness: 0, clues: 0, rations: 0, xp: 0, color: '#d4af37', lantern: false, bandaged: false, gear: [], spells: [], abilities: [], traits: [], milestones: [], notes: '' },
        { name: '', class: '', lvl: 1, hp: '0/0', gp: 0, atk: '+0', def: '+0', madness: 0, clues: 0, rations: 0, xp: 0, color: '#c0c0c0', lantern: false, bandaged: false, gear: [], spells: [], abilities: [], traits: [], milestones: [], notes: '' },
        { name: '', class: '', lvl: 1, hp: '0/0', gp: 0, atk: '+0', def: '+0', madness: 0, clues: 0, rations: 0, xp: 0, color: '#cd7f32', lantern: false, bandaged: false, gear: [], spells: [], abilities: [], traits: [], milestones: [], notes: '' },
        { name: '', class: '', lvl: 1, hp: '0/0', gp: 0, atk: '+0', def: '+0', madness: 0, clues: 0, rations: 0, xp: 0, color: '#b87333', lantern: false, bandaged: false, gear: [], spells: [], abilities: [], traits: [], milestones: [], notes: '' },
      ],
      partyStats: { mv: 0, bw: 0 },
    })
  })

  it('sets party name', () => {
    usePartyStore.getState().setPartyName('Test Party')
    expect(usePartyStore.getState().partyName).toBe('Test Party')
  })

  it('sets creation mode', () => {
    usePartyStore.getState().setCreationMode('troupe')
    expect(usePartyStore.getState().creationMode).toBe('troupe')
  })

  it('updates a character', () => {
    usePartyStore.getState().updateCharacter(0, { name: 'Alaric', class: 'Warrior' })
    const char = usePartyStore.getState().characters[0]
    expect(char?.name).toBe('Alaric')
    expect(char?.class).toBe('Warrior')
  })

  it('swaps characters', () => {
    usePartyStore.getState().updateCharacter(0, { name: 'First' })
    usePartyStore.getState().updateCharacter(1, { name: 'Second' })
    usePartyStore.getState().swapCharacters(0, 1)
    expect(usePartyStore.getState().characters[0]?.name).toBe('Second')
    expect(usePartyStore.getState().characters[1]?.name).toBe('First')
  })

  it('increments party stats', () => {
    usePartyStore.getState().incrementStat('mv', 3)
    expect(usePartyStore.getState().partyStats.mv).toBe(3)
    usePartyStore.getState().incrementStat('bw')
    expect(usePartyStore.getState().partyStats.bw).toBe(1)
  })

  it('resets party', () => {
    usePartyStore.getState().setPartyName('Test')
    usePartyStore.getState().updateCharacter(0, { name: 'Hero' })
    usePartyStore.getState().resetParty()
    expect(usePartyStore.getState().partyName).toBe('')
    expect(usePartyStore.getState().characters[0]?.name).toBe('')
  })
})
