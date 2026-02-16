import { describe, it, expect } from 'vitest'
import { rollDice, rollD66 } from './dice'

describe('rollDice', () => {
  it('returns a result with correct number of rolls', () => {
    const result = rollDice(3, 6)
    expect(result.rolls).toHaveLength(3)
    expect(result.total).toBe(result.rolls.reduce((a, b) => a + b, 0))
  })

  it('rolls are within valid range for d6', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDice(1, 6)
      expect(result.total).toBeGreaterThanOrEqual(1)
      expect(result.total).toBeLessThanOrEqual(6)
    }
  })

  it('rolls are within valid range for d20', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDice(1, 20)
      expect(result.total).toBeGreaterThanOrEqual(1)
      expect(result.total).toBeLessThanOrEqual(20)
    }
  })

  it('exploding dice can exceed max face value', () => {
    // Run many times to have a chance of getting an exploding result
    let foundExploding = false
    for (let i = 0; i < 500; i++) {
      const result = rollDice(1, 6, true)
      if (result.total > 6) {
        foundExploding = true
        break
      }
    }
    // It's statistically near-certain we'll get at least one exploding result in 500 tries
    expect(foundExploding).toBe(true)
  })

  it('non-exploding dice never exceed max', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDice(1, 6, false)
      expect(result.total).toBeLessThanOrEqual(6)
    }
  })

  it('detail string matches rolls', () => {
    const result = rollDice(2, 6)
    expect(result.detail).toBe(result.rolls.join('+'))
  })
})

describe('rollD66', () => {
  it('returns values between 11 and 66', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollD66()
      expect(result).toBeGreaterThanOrEqual(11)
      expect(result).toBeLessThanOrEqual(66)
      // Tens digit should be 1-6, ones digit should be 1-6
      const tens = Math.floor(result / 10)
      const ones = result % 10
      expect(tens).toBeGreaterThanOrEqual(1)
      expect(tens).toBeLessThanOrEqual(6)
      expect(ones).toBeGreaterThanOrEqual(1)
      expect(ones).toBeLessThanOrEqual(6)
    }
  })
})
