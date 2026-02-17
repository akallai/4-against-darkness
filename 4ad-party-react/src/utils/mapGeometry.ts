import type {
  TileTemplate,
  TileDoor,
  DoorSide,
  Rotation,
  GridCoord,
  AbsoluteDoor,
} from '@/types/map'
import { MAP_COLS, MAP_ROWS } from '@/types/map'

/** Parse a grid string ("010\n010\n011") into a 2D boolean array [row][col] */
export function parseGrid(grid: string): boolean[][] {
  return grid.split('\n').map((row) => row.split('').map((c) => c === '1'))
}

/** Horizontal flip: reverse each row, swap left/right door sides */
export function mirrorGrid(
  cells: boolean[][],
  doors: TileDoor[],
  width: number,
): { cells: boolean[][]; doors: TileDoor[] } {
  const mirrored = cells.map((row) => [...row].reverse())
  const mirroredDoors = doors.map((d) => ({
    col: width - 1 - d.col,
    row: d.row,
    side: mirrorSide(d.side),
    ...(d.type ? { type: d.type } : {}),
  }))
  return { cells: mirrored, doors: mirroredDoors }
}

function mirrorSide(side: DoorSide): DoorSide {
  if (side === 'left') return 'right'
  if (side === 'right') return 'left'
  return side
}

/** 90° clockwise rotation: transpose then reverse each row, rotate door sides */
export function rotateGrid90(
  cells: boolean[][],
  doors: TileDoor[],
  width: number,
  height: number,
): { cells: boolean[][]; doors: TileDoor[]; width: number; height: number } {
  // After 90° CW: new dimensions are [width rows × height cols]
  const newHeight = width
  const newWidth = height
  const rotated: boolean[][] = []
  for (let c = 0; c < width; c++) {
    const newRow: boolean[] = []
    for (let r = height - 1; r >= 0; r--) {
      newRow.push(cells[r]?.[c] ?? false)
    }
    rotated.push(newRow)
  }
  const rotatedDoors = doors.map((d) => ({
    col: height - 1 - d.row,
    row: d.col,
    side: rotateSide90(d.side),
    ...(d.type ? { type: d.type } : {}),
  }))
  return { cells: rotated, doors: rotatedDoors, width: newWidth, height: newHeight }
}

function rotateSide90(side: DoorSide): DoorSide {
  const map: Record<DoorSide, DoorSide> = {
    top: 'right',
    right: 'bottom',
    bottom: 'left',
    left: 'top',
  }
  return map[side]
}

/** Apply mirror (optional) then N×90° rotations to a tile template */
export function transformTile(
  template: TileTemplate,
  rotation: Rotation,
  mirrored: boolean,
): { cells: boolean[][]; doors: TileDoor[]; width: number; height: number } {
  let cells = parseGrid(template.grid)
  let doors = [...template.doors]
  let width = template.width
  let height = template.height

  if (mirrored) {
    const m = mirrorGrid(cells, doors, width)
    cells = m.cells
    doors = m.doors
  }

  const rotations = rotation / 90
  for (let i = 0; i < rotations; i++) {
    const r = rotateGrid90(cells, doors, width, height)
    cells = r.cells
    doors = r.doors
    width = r.width
    height = r.height
  }

  return { cells, doors, width, height }
}

/** Compute absolute cells and doors for a placed tile, with bounds truncation */
export function stampTile(
  template: TileTemplate,
  originCol: number,
  originRow: number,
  rotation: Rotation,
  mirrored: boolean,
): { cells: GridCoord[]; doors: AbsoluteDoor[] } {
  const { cells, doors } = transformTile(template, rotation, mirrored)

  const absCells: GridCoord[] = []
  for (let r = 0; r < cells.length; r++) {
    const row = cells[r]
    if (!row) continue
    for (let c = 0; c < row.length; c++) {
      if (row[c]) {
        const col = originCol + c
        const row2 = originRow + r
        if (col >= 0 && col < MAP_COLS && row2 >= 0 && row2 < MAP_ROWS) {
          absCells.push({ col, row: row2 })
        }
      }
    }
  }

  const absDoors: AbsoluteDoor[] = []
  for (const d of doors) {
    const col = originCol + d.col
    const row = originRow + d.row
    if (col >= 0 && col < MAP_COLS && row >= 0 && row < MAP_ROWS) {
      absDoors.push({ col, row, side: d.side, ...(d.type ? { type: d.type } : {}) })
    }
  }

  return { cells: absCells, doors: absDoors }
}

/** Create a coordinate key for set operations */
function coordKey(c: GridCoord): string {
  return `${c.col},${c.row}`
}

/** Merge two coordinate arrays, deduplicating */
export function mergeCoords(a: GridCoord[], b: GridCoord[]): GridCoord[] {
  const set = new Map<string, GridCoord>()
  for (const c of a) set.set(coordKey(c), c)
  for (const c of b) set.set(coordKey(c), c)
  return Array.from(set.values())
}

/** Subtract b from a */
export function subtractCoords(a: GridCoord[], b: GridCoord[]): GridCoord[] {
  const bSet = new Set(b.map(coordKey))
  return a.filter((c) => !bSet.has(coordKey(c)))
}

/** Create a door key for set operations */
function doorKey(d: AbsoluteDoor): string {
  return `${d.col},${d.row},${d.side}`
}

/** Merge two door arrays, deduplicating */
export function mergeDoors(a: AbsoluteDoor[], b: AbsoluteDoor[]): AbsoluteDoor[] {
  const set = new Map<string, AbsoluteDoor>()
  for (const d of a) set.set(doorKey(d), d)
  for (const d of b) set.set(doorKey(d), d)
  return Array.from(set.values())
}

/** Subtract b from a */
export function subtractDoors(a: AbsoluteDoor[], b: AbsoluteDoor[]): AbsoluteDoor[] {
  const bSet = new Set(b.map(doorKey))
  return a.filter((d) => !bSet.has(doorKey(d)))
}
