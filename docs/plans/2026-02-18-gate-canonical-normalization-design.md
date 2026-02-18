# Gate Canonical Normalization

## Problem

When placing a gate between two adjacent cells, the user can create two separate entries for the same physical boundary. For example, the boundary between cells (2,3) and (3,3) can be stored as either `{ col: 2, row: 3, side: 'right' }` or `{ col: 3, row: 3, side: 'left' }`. The system treats these as independent gates, allowing duplicates and rendering them with subtle visual differences.

## Solution: Canonical Normalization

Introduce a `canonicalizeDoor()` function that normalizes every gate to a single canonical form before storage.

### Canonical Form Rule

A gate always belongs to the cell with the smaller coordinate:

- `right` / `left` pair: always stored as `(min_col, row, 'right')`
- `bottom` / `top` pair: always stored as `(col, min_row, 'bottom')`

Gates on grid boundaries (row 0 top, col 0 left, last row bottom, last col right) are already canonical since there is no neighbor to flip to.

### Where Canonicalization Is Applied

1. **`toggleOpening` in `useMapStore.ts`** — canonicalize before searching/inserting. Primary fix for the user-facing bug.
2. **`stampTile` in `mapGeometry.ts`** — canonicalize each door from tile placement.
3. **`setMapData` in `useMapStore.ts`** — normalize doors on load to migrate existing saved maps.

### Rendering Adjustment

The `doorMap` in `MapGrid.tsx` currently only maps doors to the cell that owns them. After canonicalization, the neighbor cell also needs wall transparency and passage markers. When building `doorMap`, inject a mirror entry into the neighbor cell for each canonical door. For example, `(2, 3, 'right')` also adds a `'left'` entry to cell `(3, 3)`.

### Testing

New tests for `canonicalizeDoor` covering: already-canonical inputs, left-to-right flip, top-to-bottom flip, and grid-boundary edges.
