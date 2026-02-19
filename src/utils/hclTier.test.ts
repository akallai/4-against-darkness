import { describe, it, expect } from 'vitest'
import { getHCL, getTier, resolveExpression, rollCountFormula } from './hclTier'

describe('getHCL', () => {
  it('returns highest level from 4 characters', () => {
    const chars = [{ lvl: 3 }, { lvl: 5 }, { lvl: 1 }, { lvl: 2 }] as any
    expect(getHCL(chars)).toBe(5)
  })

  it('returns 1 for all level-1 characters', () => {
    const chars = [{ lvl: 1 }, { lvl: 1 }, { lvl: 1 }, { lvl: 1 }] as any
    expect(getHCL(chars)).toBe(1)
  })
})

describe('getTier', () => {
  it('returns tier 1 for levels 1-4', () => {
    expect(getTier(1)).toBe(1)
    expect(getTier(4)).toBe(1)
  })
  it('returns tier 2 for levels 5-9', () => {
    expect(getTier(5)).toBe(2)
    expect(getTier(9)).toBe(2)
  })
  it('returns tier 3 for levels 10-14', () => {
    expect(getTier(10)).toBe(3)
    expect(getTier(14)).toBe(3)
  })
  it('returns tier 4 for levels 15-19', () => {
    expect(getTier(15)).toBe(4)
    expect(getTier(19)).toBe(4)
  })
  it('returns tier 5 for level 20+', () => {
    expect(getTier(20)).toBe(5)
    expect(getTier(25)).toBe(5)
  })
})

describe('resolveExpression', () => {
  const hcl = 5
  const tier = 2

  it('resolves plain numbers', () => {
    expect(resolveExpression('3', hcl, tier)).toBe(3)
  })
  it('resolves HCL', () => {
    expect(resolveExpression('HCL', hcl, tier)).toBe(5)
  })
  it('resolves HCL+N', () => {
    expect(resolveExpression('HCL+2', hcl, tier)).toBe(7)
  })
  it('resolves Tier', () => {
    expect(resolveExpression('Tier', hcl, tier)).toBe(2)
  })
  it('resolves Tier+N', () => {
    expect(resolveExpression('Tier+3', hcl, tier)).toBe(5)
  })
  it('returns original string if unresolvable', () => {
    expect(resolveExpression('special', hcl, tier)).toBe('special')
  })
  it('respects max cap', () => {
    expect(resolveExpression('HCL+2', 10, 3, 6)).toBe(6)
  })
  it('does not cap when below max', () => {
    expect(resolveExpression('HCL+2', 3, 1, 6)).toBe(5)
  })
})

describe('rollCountFormula', () => {
  it('returns fixed number for plain integers', () => {
    expect(rollCountFormula('1')).toBe(1)
    expect(rollCountFormula('4')).toBe(4)
  })
  it('rolls dice formula and returns a number in range', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('d6')
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
    }
  })
  it('handles NdM+K formula', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('2d6+3')
      expect(result).toBeGreaterThanOrEqual(5)
      expect(result).toBeLessThanOrEqual(15)
    }
  })
  it('handles d6+N shorthand (1d6+N)', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('d6+3')
      expect(result).toBeGreaterThanOrEqual(4)
      expect(result).toBeLessThanOrEqual(9)
    }
  })
  it('handles NdM without modifier', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('3d6')
      expect(result).toBeGreaterThanOrEqual(3)
      expect(result).toBeLessThanOrEqual(18)
    }
  })
  it('handles d3 formula', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('d3')
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(3)
    }
  })
  it('handles 2d3+N formula', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('2d3+4')
      expect(result).toBeGreaterThanOrEqual(6)
      expect(result).toBeLessThanOrEqual(10)
    }
  })
})
