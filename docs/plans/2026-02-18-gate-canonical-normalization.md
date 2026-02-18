# Gate Canonical Normalization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the duplicate gate placement bug by normalizing all gates to a canonical form so each wall boundary has exactly one representation.

**Architecture:** Add a `canonicalizeDoor()` utility to `mapGeometry.ts` that flips `left`→`right` and `top`→`bottom` (shifting the coordinate to the neighbor cell). Apply it at every gate entry point (manual toggle, tile stamp, data load). Update the `doorMap` builder in `MapGrid.tsx` to inject mirror entries so both adjacent cells render the opening.

**Tech Stack:** TypeScript, Vitest, Zustand

---

### Task 1: Add `canonicalizeDoor` utility and tests

**Files:**
- Modify: `src/utils/mapGeometry.ts` (add export at bottom, after `subtractDoors`)
- Create: `src/utils/mapGeometry.test.ts`

**Step 1: Write the failing test**

Create `src/utils/mapGeometry.test.ts`:

```ts
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
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/mapGeometry.test.ts`
Expected: FAIL — `canonicalizeDoor` is not exported from `./mapGeometry`

**Step 3: Write minimal implementation**

Add to the bottom of `src/utils/mapGeometry.ts` (after the `subtractDoors` function, around line 177):

```ts
/** Normalize a door to canonical form: always right (not left) and bottom (not top) */
export function canonicalizeDoor(d: AbsoluteDoor): AbsoluteDoor {
  if (d.side === 'left' && d.col > 0) {
    return { col: d.col - 1, row: d.row, side: 'right', ...(d.type ? { type: d.type } : {}) }
  }
  if (d.side === 'top' && d.row > 0) {
    return { col: d.col, row: d.row - 1, side: 'bottom', ...(d.type ? { type: d.type } : {}) }
  }
  return d
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/mapGeometry.test.ts`
Expected: all 8 tests PASS

**Step 5: Commit**

```bash
git add src/utils/mapGeometry.ts src/utils/mapGeometry.test.ts
git commit -m "feat: add canonicalizeDoor utility with tests"
```

---

### Task 2: Canonicalize in `toggleOpening` (primary bug fix)

**Files:**
- Modify: `src/stores/useMapStore.ts:1-5,182-205`

**Step 1: Add import**

In `src/stores/useMapStore.ts`, add `canonicalizeDoor` to the import from `@/utils/mapGeometry` (line 5-11):

```ts
import {
  stampTile,
  mergeCoords,
  subtractCoords,
  mergeDoors,
  subtractDoors,
  canonicalizeDoor,
} from '@/utils/mapGeometry'
```

**Step 2: Canonicalize at start of `toggleOpening`**

Replace lines 182-205 of `src/stores/useMapStore.ts` (`toggleOpening` body) with:

```ts
  toggleOpening: (col, row, side, type) => {
    const state = get()
    const canonical = canonicalizeDoor({ col, row, side, type })
    const idx = state.mapData.doors.findIndex(
      (d) => d.col === canonical.col && d.row === canonical.row && d.side === canonical.side,
    )
    const newDoors = [...state.mapData.doors]
    if (idx >= 0) {
      const existing = newDoors[idx]!
      const existingType = existing.type ?? 'door'
      if (existingType === type) {
        // Same type → remove
        newDoors.splice(idx, 1)
      } else {
        // Different type → replace
        newDoors[idx] = canonical
      }
    } else {
      newDoors.push(canonical)
    }
    set({
      undoStack: pushUndo(state.undoStack, state.mapData),
      mapData: { ...state.mapData, doors: newDoors },
    })
  },
```

**Step 3: Run tests**

Run: `npm run test`
Expected: all existing tests still pass

**Step 4: Commit**

```bash
git add src/stores/useMapStore.ts
git commit -m "fix: canonicalize doors in toggleOpening to prevent duplicates"
```

---

### Task 3: Canonicalize in `stampTile` and `setMapData`

**Files:**
- Modify: `src/utils/mapGeometry.ts:129-138` (`stampTile` function)
- Modify: `src/stores/useMapStore.ts:92` (`setMapData` action)

**Step 1: Canonicalize doors in `stampTile`**

In `src/utils/mapGeometry.ts`, change the door loop in `stampTile` (lines 129-136) to canonicalize each door:

```ts
  const absDoors: AbsoluteDoor[] = []
  for (const d of doors) {
    const col = originCol + d.col
    const row = originRow + d.row
    if (col >= 0 && col < MAP_COLS && row >= 0 && row < MAP_ROWS) {
      absDoors.push(canonicalizeDoor({ col, row, side: d.side, ...(d.type ? { type: d.type } : {}) }))
    }
  }
```

**Step 2: Normalize doors on load in `setMapData`**

In `src/stores/useMapStore.ts`, change `setMapData` (line 92) from:

```ts
  setMapData: (data) => set({ mapData: data, undoStack: [] }),
```

to:

```ts
  setMapData: (data) => set({
    mapData: { ...data, doors: data.doors.map(canonicalizeDoor) },
    undoStack: [],
  }),
```

**Step 3: Run tests**

Run: `npm run test`
Expected: all tests pass

**Step 4: Run build**

Run: `npm run build`
Expected: clean build, no TypeScript errors

**Step 5: Commit**

```bash
git add src/utils/mapGeometry.ts src/stores/useMapStore.ts
git commit -m "fix: canonicalize doors in stampTile and setMapData"
```

---

### Task 4: Inject mirror entries in `doorMap` rendering

**Files:**
- Modify: `src/components/map/MapGrid.tsx:41-49` (`doorMap` useMemo)

**Step 1: Update `doorMap` builder**

Replace the `doorMap` useMemo block (lines 41-49) with a version that also injects the mirror entry into the neighbor cell:

```ts
  // Build door lookup map: cell key → Map<side, openingType>
  // For each canonical door, also inject the mirror entry into the neighbor cell
  const doorMap = useMemo(() => {
    const map = new Map<string, Map<DoorSide, WallOpeningType>>()
    const addEntry = (col: number, row: number, side: DoorSide, type: WallOpeningType) => {
      const key = `${col},${row}`
      if (!map.has(key)) map.set(key, new Map())
      map.get(key)!.set(side, type)
    }
    for (const d of mapData.doors) {
      const type = d.type ?? 'door'
      addEntry(d.col, d.row, d.side, type)
      // Mirror entry for the neighbor cell
      if (d.side === 'right') addEntry(d.col + 1, d.row, 'left', type)
      else if (d.side === 'bottom') addEntry(d.col, d.row + 1, 'top', type)
      else if (d.side === 'left') addEntry(d.col - 1, d.row, 'right', type)
      else if (d.side === 'top') addEntry(d.col, d.row - 1, 'bottom', type)
    }
    return map
  }, [mapData.doors])
```

**Step 2: Run build**

Run: `npm run build`
Expected: clean build, no TypeScript errors

**Step 3: Run tests**

Run: `npm run test`
Expected: all tests pass

**Step 4: Manual verification**

Run: `npm run dev`
Test in the browser:
1. Draw two adjacent floor cells
2. Select the Gate tool
3. Click the right edge of the left cell — gate appears
4. Click the left edge of the right cell — toggles the same gate OFF (not a second gate)
5. Place a gate and verify both cells show the opening (transparent wall on both sides)

**Step 5: Commit**

```bash
git add src/components/map/MapGrid.tsx
git commit -m "fix: inject mirror door entries so both cells render the opening"
```

---

### Task 5: Also mirror ghost doors for tile preview

**Files:**
- Modify: `src/components/map/MapGrid.tsx:72-91` (`ghostDoorMap` useMemo)

**Step 1: Update `ghostDoorMap` builder**

Replace the ghost door map construction (lines 84-89 inside the `ghostDoorMap` useMemo) with the same mirror logic:

```ts
    const doorMap = new Map<string, Map<DoorSide, WallOpeningType>>()
    const addEntry = (col: number, row: number, side: DoorSide, type: WallOpeningType) => {
      const key = `${col},${row}`
      if (!doorMap.has(key)) doorMap.set(key, new Map())
      doorMap.get(key)!.set(side, type)
    }
    for (const d of doors) {
      const type = d.type ?? 'door'
      addEntry(d.col, d.row, d.side, type)
      if (d.side === 'right') addEntry(d.col + 1, d.row, 'left', type)
      else if (d.side === 'bottom') addEntry(d.col, d.row + 1, 'top', type)
      else if (d.side === 'left') addEntry(d.col - 1, d.row, 'right', type)
      else if (d.side === 'top') addEntry(d.col, d.row - 1, 'bottom', type)
    }
```

**Step 2: Run build**

Run: `npm run build`
Expected: clean build

**Step 3: Commit**

```bash
git add src/components/map/MapGrid.tsx
git commit -m "fix: mirror ghost doors in tile preview for consistent rendering"
```
