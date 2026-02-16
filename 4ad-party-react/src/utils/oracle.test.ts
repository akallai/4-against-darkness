import { describe, it, expect } from 'vitest'
import { generateNPC, askOracle, randomEvent } from './oracle'

describe('generateNPC', () => {
  it('returns an NPC with all fields', () => {
    const npc = generateNPC()
    expect(npc.name).toBeTruthy()
    expect(npc.name.split(' ')).toHaveLength(2)
    expect(npc.race).toBeTruthy()
    expect(npc.lvl).toBeGreaterThanOrEqual(1)
    expect(npc.lvl).toBeLessThanOrEqual(5)
    expect(npc.life).toBeGreaterThanOrEqual(1)
    expect(npc.life).toBeLessThanOrEqual(7)
    expect(npc.trait).toBeTruthy()
  })

  it('generates unique NPCs across multiple calls', () => {
    const names = new Set<string>()
    for (let i = 0; i < 20; i++) {
      names.add(generateNPC().name)
    }
    // Should have at least a few unique names
    expect(names.size).toBeGreaterThan(1)
  })
})

describe('askOracle', () => {
  it('returns a valid response', () => {
    const valid = ['Yes, and...', 'Yes', 'Yes, but...', 'No, but...', 'No', 'No, and...']
    for (let i = 0; i < 50; i++) {
      expect(valid).toContain(askOracle())
    }
  })
})

describe('randomEvent', () => {
  it('returns a non-empty string', () => {
    const event = randomEvent()
    expect(event).toBeTruthy()
    expect(typeof event).toBe('string')
  })
})
