import { describe, it, expect } from 'vitest'
import { applyClassTemplate, CLASS_NAMES } from './applyClassTemplate'

describe('applyClassTemplate', () => {
  it('returns undefined for unknown class', () => {
    expect(applyClassTemplate('Bard')).toBeUndefined()
  })

  it('sets class name on result', () => {
    const result = applyClassTemplate('Warrior')!
    expect(result.class).toBe('Warrior')
  })

  it('computes L1 HP for Warrior (base 6 → 7/7)', () => {
    const result = applyClassTemplate('Warrior')!
    expect(result.hp).toBe('7/7')
  })

  it('computes L1 HP for Wizard (base 2 → 3/3)', () => {
    const result = applyClassTemplate('Wizard')!
    expect(result.hp).toBe('3/3')
  })

  it('resolves +L ATK at L1 to +1', () => {
    const result = applyClassTemplate('Warrior')!
    expect(result.atk).toBe('+1')
  })

  it('resolves +1/2L ATK at L1 to +0', () => {
    const result = applyClassTemplate('Cleric')!
    expect(result.atk).toBe('+0')
  })

  it('resolves +L DEF at L1 to +1', () => {
    const result = applyClassTemplate('Rogue')!
    expect(result.def).toBe('+1')
  })

  it('resolves +0 DEF to +0', () => {
    const result = applyClassTemplate('Warrior')!
    expect(result.def).toBe('+0')
  })

  it('resolves +1 ATK (Kukla flat bonus) to +1', () => {
    const result = applyClassTemplate('Kukla')!
    expect(result.atk).toBe('+1')
  })

  it('rolls gold within valid range for Warrior (2d6 = 2-12)', () => {
    for (let i = 0; i < 50; i++) {
      const result = applyClassTemplate('Warrior')!
      expect(result.gp).toBeGreaterThanOrEqual(2)
      expect(result.gp).toBeLessThanOrEqual(12)
    }
  })

  it('rolls gold within valid range for Wizard (4d6 = 4-24)', () => {
    for (let i = 0; i < 50; i++) {
      const result = applyClassTemplate('Wizard')!
      expect(result.gp).toBeGreaterThanOrEqual(4)
      expect(result.gp).toBeLessThanOrEqual(24)
    }
  })

  it('populates spells for Wizard', () => {
    const result = applyClassTemplate('Wizard')!
    expect(result.spells!.length).toBeGreaterThan(0)
    expect(result.spells!.some((s) => s.val === 'Fireball')).toBe(true)
  })

  it('populates abilities for Warrior', () => {
    const result = applyClassTemplate('Warrior')!
    expect(result.abilities!.length).toBeGreaterThan(0)
    expect(result.abilities!.some((a) => a.val === '+L ATK')).toBe(true)
  })

  it('populates gear for Warrior', () => {
    const result = applyClassTemplate('Warrior')!
    expect(result.gear!.length).toBeGreaterThan(0)
  })

  it('assigns 1 trait for most classes', () => {
    const result = applyClassTemplate('Warrior')!
    expect(result.traits).toHaveLength(1)
  })

  it('assigns 2 traits for Halfling', () => {
    const result = applyClassTemplate('Halfling')!
    expect(result.traits).toHaveLength(2)
  })

  it('Halfling traits are distinct (no duplicates)', () => {
    for (let i = 0; i < 50; i++) {
      const result = applyClassTemplate('Halfling')!
      expect(result.traits![0]!.val).not.toBe(result.traits![1]!.val)
    }
  })

  it('sets lantern for Illusionist', () => {
    const result = applyClassTemplate('Illusionist')!
    expect(result.lantern).toBe(true)
  })

  it('does not set lantern for Warrior', () => {
    const result = applyClassTemplate('Warrior')!
    expect(result.lantern).toBeUndefined()
  })

  it('sets rations for Halfling (d6+3 = 4-9)', () => {
    for (let i = 0; i < 50; i++) {
      const result = applyClassTemplate('Halfling')!
      expect(result.rations).toBeGreaterThanOrEqual(4)
      expect(result.rations).toBeLessThanOrEqual(9)
    }
  })

  it('sets rations for Ranger (d3 = 1-3)', () => {
    for (let i = 0; i < 50; i++) {
      const result = applyClassTemplate('Ranger')!
      expect(result.rations).toBeGreaterThanOrEqual(1)
      expect(result.rations).toBeLessThanOrEqual(3)
    }
  })

  it('CLASS_NAMES contains all 20 classes', () => {
    expect(CLASS_NAMES).toHaveLength(20)
    expect(CLASS_NAMES).toContain('Warrior')
    expect(CLASS_NAMES).toContain('Wizard')
    expect(CLASS_NAMES).toContain('Kukla')
    expect(CLASS_NAMES).toContain('Mushroom Monk')
  })

  it('sets lvl on result', () => {
    const result = applyClassTemplate('Warrior')!
    expect(result.lvl).toBe(1)
  })

  it('computes L3 HP for Warrior (base 6 → 9/9)', () => {
    const result = applyClassTemplate('Warrior', 3)!
    expect(result.hp).toBe('9/9')
  })

  it('resolves +L ATK at L3 to +3', () => {
    const result = applyClassTemplate('Warrior', 3)!
    expect(result.atk).toBe('+3')
  })

  it('resolves +1/2L ATK at L3 to +1', () => {
    const result = applyClassTemplate('Cleric', 3)!
    expect(result.atk).toBe('+1')
  })

  it('populates empty spells array for Warrior', () => {
    const result = applyClassTemplate('Warrior')!
    expect(result.spells).toEqual([])
  })

  it('every class produces a valid result', () => {
    for (const name of CLASS_NAMES) {
      const result = applyClassTemplate(name)!
      expect(result).toBeDefined()
      expect(result.class).toBe(name)
      expect(result.hp).toMatch(/^\d+\/\d+$/)
      expect(result.atk).toMatch(/^\+\d+$/)
      expect(result.def).toMatch(/^\+\d+$/)
      expect(result.gp).toBeGreaterThanOrEqual(1)
      expect(result.gear!.length).toBeGreaterThan(0)
    }
  })
})
