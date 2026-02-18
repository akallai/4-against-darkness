# Map Blackout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Empty cells fully enclosed by floor cells (with no door/passage on the perimeter) appear near-black, visually communicating "unexplorable space."

**Architecture:** A pure utility function `computeBlackoutCells()` in `mapGeometry.ts` uses BFS flood-fill from map edges to identify reachable empty cells, then checks remaining enclosed regions for door access. `MapGrid.tsx` calls it in a `useMemo` and applies a `blackout` CSS class.

**Tech Stack:** React useMemo, BFS algorithm, CSS custom properties, Vitest

---

### Task 1: Write failing tests for `computeBlackoutCells`

**Files:**
- Modify: `src/utils/mapGeometry.test.ts` (append new describe block after line 44)

**Step 1: Write the failing tests**

Add this to the end of `src/utils/mapGeometry.test.ts`:

```typescript
import { computeBlackoutCells } from './mapGeometry'

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
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/utils/mapGeometry.test.ts`
Expected: FAIL — `computeBlackoutCells` is not exported from `./mapGeometry`

**Step 3: Commit**

```bash
git add src/utils/mapGeometry.test.ts
git commit -m "test: add failing tests for computeBlackoutCells"
```

---

### Task 2: Implement `computeBlackoutCells` in mapGeometry.ts

**Files:**
- Modify: `src/utils/mapGeometry.ts` (append after line 188)

**Step 1: Add the function**

Append to end of `src/utils/mapGeometry.ts`:

```typescript
/** Compute empty cells that should be blacked out (enclosed by floor cells, no door access) */
export function computeBlackoutCells(
  cells: GridCoord[],
  doors: AbsoluteDoor[],
  cols: number,
  rows: number,
): Set<string> {
  // 1. Build floor cell lookup
  const floorSet = new Set<string>()
  for (const c of cells) floorSet.add(`${c.col},${c.row}`)

  // 2. Build door lookup with both canonical and mirror sides
  // Each entry is "col,row,side" — stores both the door's cell+side and the neighbor's cell+opposite side
  const doorSet = new Set<string>()
  for (const d of doors) {
    doorSet.add(`${d.col},${d.row},${d.side}`)
    if (d.side === 'right') doorSet.add(`${d.col + 1},${d.row},left`)
    else if (d.side === 'bottom') doorSet.add(`${d.col},${d.row + 1},top`)
    else if (d.side === 'left') doorSet.add(`${d.col - 1},${d.row},right`)
    else if (d.side === 'top') doorSet.add(`${d.col},${d.row - 1},bottom`)
  }

  // 3. BFS from all empty cells on the map boundary
  const reachable = new Set<string>()
  const queue: [number, number][] = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (c === 0 || c === cols - 1 || r === 0 || r === rows - 1) {
        const key = `${c},${r}`
        if (!floorSet.has(key)) {
          reachable.add(key)
          queue.push([c, r])
        }
      }
    }
  }

  const deltas: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0]]
  while (queue.length > 0) {
    const [cx, cy] = queue.shift()!
    for (const [dx, dy] of deltas) {
      const nx = cx + dx
      const ny = cy + dy
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue
      const nkey = `${nx},${ny}`
      if (reachable.has(nkey) || floorSet.has(nkey)) continue
      reachable.add(nkey)
      queue.push([nx, ny])
    }
  }

  // 4. Find connected components of unreachable empty cells
  const visited = new Set<string>()
  const blackout = new Set<string>()
  const sides: [number, number, DoorSide][] = [[0, -1, 'top'], [1, 0, 'right'], [0, 1, 'bottom'], [-1, 0, 'left']]

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const key = `${c},${r}`
      if (floorSet.has(key) || reachable.has(key) || visited.has(key)) continue

      // BFS to collect this component
      const component: string[] = []
      const cQueue: [number, number][] = [[c, r]]
      visited.add(key)
      let hasDoorAccess = false

      while (cQueue.length > 0) {
        const [cx, cy] = cQueue.shift()!
        component.push(`${cx},${cy}`)

        // Check each neighbor
        for (const [dx, dy, side] of sides) {
          const nx = cx + dx
          const ny = cy + dy
          if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue
          const nkey = `${nx},${ny}`

          // If neighbor is a floor cell with a door on the shared edge → accessible
          if (floorSet.has(nkey) && doorSet.has(`${cx},${cy},${side}`)) {
            hasDoorAccess = true
          }

          // Continue BFS through empty unreachable cells
          if (!floorSet.has(nkey) && !reachable.has(nkey) && !visited.has(nkey)) {
            visited.add(nkey)
            cQueue.push([nx, ny])
          }
        }
      }

      if (!hasDoorAccess) {
        for (const k of component) blackout.add(k)
      }
    }
  }

  return blackout
}
```

**Step 2: Run tests to verify they pass**

Run: `npx vitest run src/utils/mapGeometry.test.ts`
Expected: ALL PASS

**Step 3: Commit**

```bash
git add src/utils/mapGeometry.ts
git commit -m "feat: add computeBlackoutCells utility for enclosed empty regions"
```

---

### Task 3: Add CSS for blackout cells

**Files:**
- Modify: `src/styles/theme.css:15` (add variable after `--map-empty-bg`)
- Modify: `src/styles/theme.css:84` (add classic theme variable after `--map-empty-bg`)
- Modify: `src/components/map/MapGrid.css:37` (add rule after `.map-cell.ghost`)

**Step 1: Add CSS variable to dark theme**

In `src/styles/theme.css`, after line 15 (`--map-empty-bg: #1a1a1a;`), add:

```css
  --map-blackout-bg: #0a0a0a;
```

**Step 2: Add CSS variable to classic theme**

In `src/styles/theme.css`, after line 84 (`--map-empty-bg: var(--classic-paper-dark) !important;`), add:

```css
  --map-blackout-bg: #0d0a06 !important;
```

**Step 3: Add blackout CSS rule**

In `src/components/map/MapGrid.css`, after line 37 (`.map-cell.ghost` closing brace), add:

```css

.map-cell.blackout {
  background-color: var(--map-blackout-bg);
}
```

**Step 4: Commit**

```bash
git add src/styles/theme.css src/components/map/MapGrid.css
git commit -m "style: add blackout CSS class and theme variables"
```

---

### Task 4: Wire up blackout rendering in MapGrid

**Files:**
- Modify: `src/components/map/MapGrid.tsx:5` (add import)
- Modify: `src/components/map/MapGrid.tsx:38` (add useMemo after cellSet)
- Modify: `src/components/map/MapGrid.tsx:213` (add blackout class)

**Step 1: Add import**

In `src/components/map/MapGrid.tsx` line 5, change:

```typescript
import { stampTile, transformTile } from '@/utils/mapGeometry'
```

to:

```typescript
import { stampTile, transformTile, computeBlackoutCells } from '@/utils/mapGeometry'
```

**Step 2: Add blackout useMemo**

After the `cellSet` useMemo (after line 38), add:

```typescript
  // Compute blackout cells (enclosed empty regions with no door access)
  const blackoutCells = useMemo(
    () => computeBlackoutCells(mapData.cells, mapData.doors, MAP_COLS, MAP_ROWS),
    [mapData.cells, mapData.doors],
  )
```

**Step 3: Add blackout class in the cell rendering**

In the cell rendering loop, change line 213 from:

```tsx
className={`map-cell${isFloor ? ' floor' : ''}${isGhost ? ' ghost' : ''}${wallClasses}${doorClasses}`}
```

to:

```tsx
className={`map-cell${isFloor ? ' floor' : ''}${isGhost ? ' ghost' : ''}${!isFloor && !isGhost && blackoutCells.has(key) ? ' blackout' : ''}${wallClasses}${doorClasses}`}
```

**Step 4: Add `blackoutCells` to the useMemo dependency array**

On line 238, add `blackoutCells` to the dependency array of the `cells` useMemo:

```typescript
  }, [cellSet, blackoutCells, ghostCells, ghostDoorMap, doorMap, labelMap, activeTool, handleCellMouseDown, handleCellMouseEnter])
```

**Step 5: Build check**

Run: `npm run build`
Expected: No TypeScript errors, clean build

**Step 6: Commit**

```bash
git add src/components/map/MapGrid.tsx
git commit -m "feat: render blackout on enclosed empty cells in MapGrid"
```

---

### Task 5: Manual verification

**Step 1: Start dev server**

Run: `npm run dev`

**Step 2: Verify scenarios**

1. Empty map → no blackout anywhere
2. Place a room tile in the center → enclosed empty cells inside the room walls (if any) turn near-black; outside cells stay normal
3. Add a door on a wall facing enclosed void → that void region returns to normal
4. Remove the door → void goes black again
5. Switch to classic theme → blackout uses dark brown instead of near-black

**Step 3: Run full test suite**

Run: `npm run test`
Expected: All tests pass

**Step 4: Final commit (if any adjustments needed)**
