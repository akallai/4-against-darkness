import { describe, it, expect } from 'vitest'
import { canonicalizeDoor, computeBlackoutCells } from './mapGeometry'

describe('canonicalizeDoor', () => {
  it('keeps right side as-is (already canonical)', () => {
    expect(canonicalizeDoor({ col: 2, row: 3, side: 'right', type: 'passage' }))
      .toEqual({ col: 2, row: 3, side: 'right', type: 'passage' })
  })

  it('keeps bottom side as-is (already canonical)', () => {
    expect(canonicalizeDoor({ col: 5, row: 1, side: 'bottom' }))
      .toEqual({ col: 5, row: 1, side: 'bottom' })
  })

  it('flips left to right on the neighbor cell', () => {
    expect(canonicalizeDoor({ col: 3, row: 3, side: 'left', type: 'passage' }))
      .toEqual({ col: 2, row: 3, side: 'right', type: 'passage' })
  })

  it('flips top to bottom on the neighbor cell', () => {
    expect(canonicalizeDoor({ col: 5, row: 2, side: 'top' }))
      .toEqual({ col: 5, row: 1, side: 'bottom' })
  })

  it('keeps left on col 0 (grid boundary, no neighbor)', () => {
    expect(canonicalizeDoor({ col: 0, row: 5, side: 'left' }))
      .toEqual({ col: 0, row: 5, side: 'left' })
  })

  it('keeps top on row 0 (grid boundary, no neighbor)', () => {
    expect(canonicalizeDoor({ col: 3, row: 0, side: 'top' }))
      .toEqual({ col: 3, row: 0, side: 'top' })
  })

  it('preserves type through canonicalization', () => {
    expect(canonicalizeDoor({ col: 4, row: 4, side: 'left', type: 'door' }))
      .toEqual({ col: 3, row: 4, side: 'right', type: 'door' })
  })

  it('handles undefined type (defaults to no type key)', () => {
    const result = canonicalizeDoor({ col: 4, row: 4, side: 'left' })
    expect(result).toEqual({ col: 3, row: 4, side: 'right' })
  })
})

describe('computeBlackoutCells', () => {
  // Use a small 5x5 grid for all tests
  const COLS = 5
  const ROWS = 5

  it('returns empty set for empty map (no floor cells)', () => {
    const result = computeBlackoutCells([], [], COLS, ROWS)
    expect(result.size).toBe(0)
  })

  it('blacks out enclosed empty cells surrounded by floor cells with no doors', () => {
    // Floor ring around center cell (2,2):
    // .....
    // .FFF.
    // .F.F.
    // .FFF.
    // .....
    const cells = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 },
      { col: 1, row: 2 },                      { col: 3, row: 2 },
      { col: 1, row: 3 }, { col: 2, row: 3 }, { col: 3, row: 3 },
    ]
    const result = computeBlackoutCells(cells, [], COLS, ROWS)
    expect(result.has('2,2')).toBe(true)
    // Edge-reachable empty cells should NOT be blacked out
    expect(result.has('0,0')).toBe(false)
    expect(result.has('4,4')).toBe(false)
  })

  it('does NOT black out enclosed void if a door faces into it', () => {
    // Same ring, but floor cell (2,3) has a door on its top side facing (2,2)
    // Canonical form: (2,2) bottom → but we want the door between (2,2) empty and (2,3) floor
    // Door on (2,3) top side → canonicalizes to (2,2) bottom
    const cells = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 },
      { col: 1, row: 2 },                      { col: 3, row: 2 },
      { col: 1, row: 3 }, { col: 2, row: 3 }, { col: 3, row: 3 },
    ]
    const doors = [{ col: 2, row: 2, side: 'bottom' as const, type: 'door' as const }]
    const result = computeBlackoutCells(cells, doors, COLS, ROWS)
    expect(result.has('2,2')).toBe(false)
  })

  it('does NOT black out enclosed void if a passage faces into it', () => {
    const cells = [
      { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 },
      { col: 1, row: 2 },                      { col: 3, row: 2 },
      { col: 1, row: 3 }, { col: 2, row: 3 }, { col: 3, row: 3 },
    ]
    const doors = [{ col: 2, row: 2, side: 'bottom' as const, type: 'passage' as const }]
    const result = computeBlackoutCells(cells, doors, COLS, ROWS)
    expect(result.has('2,2')).toBe(false)
  })

  it('does not black out cells adjacent to a room touching the map edge', () => {
    // Room in top-left corner: cells at (0,0), (1,0), (0,1), (1,1)
    // No enclosed void because all surrounding empty cells reach the edge
    const cells = [
      { col: 0, row: 0 }, { col: 1, row: 0 },
      { col: 0, row: 1 }, { col: 1, row: 1 },
    ]
    const result = computeBlackoutCells(cells, [], COLS, ROWS)
    expect(result.size).toBe(0)
  })

  it('blacks out only doorless enclosed regions when multiple exist', () => {
    // Two separate enclosed voids in a 7x5 grid:
    // Region A at (1,2) — no door → blackout
    // Region B at (5,2) — has door → not blackout
    const WIDE = 7
    // Ring A around (1,2)
    const ringA = [
      { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 },
      { col: 0, row: 2 },                      { col: 2, row: 2 },
      { col: 0, row: 3 }, { col: 1, row: 3 }, { col: 2, row: 3 },
    ]
    // Ring B around (5,2)
    const ringB = [
      { col: 4, row: 1 }, { col: 5, row: 1 }, { col: 6, row: 1 },
      { col: 4, row: 2 },                      { col: 6, row: 2 },
      { col: 4, row: 3 }, { col: 5, row: 3 }, { col: 6, row: 3 },
    ]
    const cells = [...ringA, ...ringB]
    // Door on ring B facing inward: (5,3) top → canonical (5,2) bottom
    const doors = [{ col: 5, row: 2, side: 'bottom' as const, type: 'door' as const }]
    const result = computeBlackoutCells(cells, doors, WIDE, ROWS)
    expect(result.has('1,2')).toBe(true)  // Region A: no door → blackout
    expect(result.has('5,2')).toBe(false) // Region B: has door → not blackout
  })
})
