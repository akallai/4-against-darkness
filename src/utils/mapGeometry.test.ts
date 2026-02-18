import { describe, it, expect } from 'vitest'
import { canonicalizeDoor } from './mapGeometry'

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
