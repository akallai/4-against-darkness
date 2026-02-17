import type { TileTemplate, TileDoor } from '@/types/map'

/** Helper to define a tile concisely */
function tile(
  id: number,
  category: 'entrance' | 'corridor' | 'room',
  grid: string,
  doors: TileDoor[] = [],
  hasStairs = false,
): TileTemplate {
  const rows = grid.split('\n')
  const height = rows.length
  const width = Math.max(...rows.map((r) => r.length))
  return { id, category, grid, width, height, doors, hasStairs }
}

// ────────────────────────────────────────────────────────────────
// Entrance Tiles (d6: 1–6)
// These are larger starting rooms with stairs (X marks)
// and doors leading into the dungeon.
// ────────────────────────────────────────────────────────────────
const ENTRANCE_TILES: TileTemplate[] = [
  // Tile 1: Flat wide rectangular room (6w × 2h).
  // 3 doors on top, 2 doors on bottom center. Stairs inside.
  tile(1, 'entrance',
    [
      '1111111',
      '1111111',
      '0011100',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 3, row: 0, side: 'top' },
      { col: 6, row: 0, side: 'top' },
      { col: 2, row: 2, side: 'bottom' },
      { col: 3, row: 2, side: 'bottom' },
      { col: 4, row: 2, side: 'bottom' },
    ],
    true,
  ),

  // Tile 2: L-shaped room with upper corridor going up,
  // a small right extension, and lower corridor going down.
  // Door on upper corridor left wall, right extension, and bottom corridor.
  tile(2, 'entrance',
    [
      '001000',
      '101000',
      '111110',
      '111110',
      '111111',
      '111110',
      '011100',
    ].join('\n'),
    [
      { col: 0, row: 1, side: 'bottom' },
      { col: 0, row: 1, side: 'top', type: 'passage' },
      { col: 2, row: 0, side: 'top', type: 'passage' },
      { col: 4, row: 4, side: 'right' },
      { col: 5, row: 4, side: 'right' , type: 'passage'},
      { col: 1, row: 6, side: 'bottom' },
      { col: 2, row: 6, side: 'bottom' },
      { col: 3, row: 6, side: 'bottom' },
    ],
    true,
  ),

  // Tile 3: Three parallel corridors going upward from a
  // horizontal base. Comb/trident shape. Gates at corridor tops.
  tile(3, 'entrance',
    [
      '1001001',
      '1001001',
      '1111111',
      '0011100',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top', type: 'passage' },
      { col: 3, row: 0, side: 'top', type: 'passage' },
      { col: 6, row: 0, side: 'top', type: 'passage' },
      { col: 2, row: 3, side: 'bottom' , type: 'passage'},
      { col: 3, row: 3, side: 'bottom' , type: 'passage'},
      { col: 4, row: 3, side: 'bottom' , type: 'passage'},
    ],
    true,
  ),

  // Tile 4: Two parallel corridors going upward from a
  // horizontal base. Fork shape. Doors at corridor tops.
  tile(4, 'entrance',
    [
      '10001',
      '10001',
      '11111',
      '11111',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' , type: 'passage'},
      { col: 4, row: 0, side: 'top' , type: 'passage'},
      { col: 0, row: 3, side: 'bottom' },
      { col: 1, row: 3, side: 'bottom' },
      { col: 2, row: 3, side: 'bottom' },
      { col: 3, row: 3, side: 'bottom' },
      { col: 4, row: 3, side: 'bottom' },
    ],
    true,
  ),

  // Tile 5: Branching corridors — two upward prongs from a
  // junction, a right branch, and a long corridor going down.
  // Tree-like shape.
  tile(5, 'entrance',
    [
      '010',
      '010',
      '111',
      '010',
      '010',
      '010',
      '111',
      '111'
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' , type: 'passage'},
      { col: 0, row: 2, side: 'left' , type: 'passage'},
      { col: 2, row: 2, side: 'right' , type: 'passage'},
      { col: 0, row: 7, side: 'bottom' },
      { col: 1, row: 7, side: 'bottom' },
      { col: 2, row: 7, side: 'bottom' },
    ],
    true,
  ),

  // Tile 6: L-shaped room — wide top section, right portion
  // continues downward. Doors at bottom of the right section.
  tile(6, 'entrance',
    [
      '111111',
      '001100',
      '001100',
      '011100',
      '011100',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'left', type: 'passage' },
      { col: 5, row: 0, side: 'right', type: 'passage' },
      { col: 3, row: 4, side: 'bottom' },
      { col: 2, row: 4, side: 'bottom' },
    ],
    true,
  ),
]

// ────────────────────────────────────────────────────────────────
// Dungeon Tiles (d66: 11–66)
// Corridors are 1 cell wide; rooms are 2+ cells.
// Each tile is encoded as a grid string where 1=floor, 0=empty.
// Doors mark connection points on tile edges.
// ────────────────────────────────────────────────────────────────
const DUNGEON_TILES: TileTemplate[] = [

  // ── 11–16: Basic Corridors ──

  // 11: Straight vertical corridor, 1 wide, 5 long
  tile(11, 'corridor',
    [
      '1',
      '1',
      '1',
      '1',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'right' },
      { col: 0, row: 2, side: 'left' },
    ],
  ),

  // 12: Short corridor with a side door
  tile(12, 'corridor',
    [
      '1',
      '1',
      '1',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 0, row: 2, side: 'bottom' },
    ],
  ),

  // 13: L-shaped corridor bending down then right
  tile(13, 'corridor',
    [
      '1111',
      '0001',
      '0001',
      '1111',
      '1000',
      '1111',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'left' },
      { col: 2, row: 0, side: 'top' },
      { col: 3, row: 5, side: 'right', type: 'passage' },
    ],
  ),

  // 14: 4-way crossroads
  tile(14, 'corridor',
    [
      '111',
      '010',
      '010',
      '010',
      '010',
      '111',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'left', type: 'passage' },
      { col: 2, row: 0, side: 'right', type: 'passage' },
      { col: 0, row: 5, side: 'left' },
      { col: 2, row: 5, side: 'right', type: 'passage' },
    ],
  ),

  // 15: T-junction (corridor from top, branches left+right)
  tile(15, 'corridor',
    [
      '1100',
      '1111',
      '1111',
      '0001',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 0, row: 2, side: 'left' },
      { col: 3, row: 3, side: 'bottom' },
    ],
  ),

  // 16: Long straight corridor, 1 wide, 7 long
  tile(16, 'corridor',
    [
      '111',
      '111',
      '010',
      '010',
      '010',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 1, row: 4, side: 'bottom' , type: 'passage'},
    ],
  ),

  // ── 21–26: Corridor Variants ──

  // 21: S-bend corridor
  tile(21, 'corridor',
    [
      '111',
      '111',
      '111',
    ].join('\n'),
    [
      { col: 1, row: 2, side: 'bottom' },
    ],
  ),

  // 22: Wide L-corridor (2-wide corridors)
  tile(22, 'corridor',
    [
      '111',
      '111',
      '111',
      '010'
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 0, row: 1, side: 'left' },
      { col: 1, row: 3, side: 'bottom', type: 'passage' },
    ],
  ),

  // 23: Z-shaped corridor (bends twice)
  tile(23, 'corridor',
    [
      '0000111',
      '1111111',
      '0000111',
      '0000111',
    ].join('\n'),
    [
      { col: 0, row: 1, side: 'left' },
      { col: 6, row: 1, side: 'right' },
    ],
  ),

  // 24: Room with corridor extending down
  tile(24, 'room',
    [
      '010',
      '111',
      '111',
      '010',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 0, row: 1, side: 'left' },
      { col: 1, row: 3, side: 'bottom'},
    ],
  ),

  // 25: L-shaped room with corridor
  tile(25, 'room',
    [
      '000111',
      '111111',
      '000111',
      '000111',
    ].join('\n'),
    [
      { col: 5, row: 2, side: 'right' },
      { col: 0, row: 1, side: 'left', type: 'passage' },
    ],
  ),

  // 26: Small room with attached corridor going down
  tile(26, 'corridor',
    [
      '1',
      '1',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'left' },
      { col: 0, row: 1, side: 'right' },
    ],
  ),

  // ── 31–36: Small Rooms ──

  // 31: Small rectangular room, 1 door on left
  tile(31, 'room',
    [
      '011',
      '011',
      '111',
      '100',
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'top' },
      { col: 0, row: 3, side: 'bottom' },
    ],
  ),

  // 32: Small room, 2 doors (left and right)
  tile(32, 'room',
    [
      '00111',
      '00100',
      '00100',
      '11111',
    ].join('\n'),
    [
      { col: 4, row: 0, side: 'right' },
      { col: 0, row: 3, side: 'left' },
      { col: 4, row: 3, side: 'right' },
    ],
  ),

  // 33: Taller narrow room
  tile(33, 'room',
    [
      '1',
      '1',
      '1',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 0, row: 1, side: 'left' },
    ],
  ),

  // 34: Round room (octagonal approximation, 5x5)
  tile(34, 'room',
    [
      '010',
      '010',
      '111',
      '111',
      '111',
      '010',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 1, row: 5, side: 'bottom' },
    ],
  ),

  // 35: L-shaped room
  tile(35, 'room',
    [
      '10000',
      '11111',
      '01111',
      '01111',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top', type: 'passage' },
    ],
  ),

  // 36: Oval room (elongated, 6x4)
  tile(36, 'room',
    [
      '011',
      '010',
      '110',
      '111',
      '111',
      '010',
      '110'
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'right' },
      { col: 0, row: 3, side: 'left' },
      { col: 0, row: 6, side: 'left' },
    ],
  ),

  // ── 41–46: Medium Rooms ──

  // 41: Large rectangular room
  tile(41, 'room',
    [
      '100',
      '111',
      '111',
      '111',
      '010'
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 1, row: 4, side: 'bottom' },
    ],
  ),

  // 42: Room with corridor extension to right
  tile(42, 'room',
    [
      '001',
      '111',
      '100',
      '100'
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'top', type: 'passage' },
      { col: 0, row: 3, side: 'bottom', type: 'passage' },
    ],
  ),

  // 43: T-shaped room (wider at bottom)
  tile(43, 'room',
    [
      '111',
      '111',
      '111',
      '010'
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'top' },
      { col: 1, row: 3, side: 'bottom', type: 'passage' },
    ],
  ),

  // 44: Room with corridor going up
  tile(44, 'room',
    [
      '0011',
      '1111',
      '1111',
      '0100',
      '0100'
    ].join('\n'),
    [
      { col: 3, row: 0, side: 'right' },
      { col: 1, row: 4, side: 'bottom' },
    ],
  ),

  // 45: Cross-shaped room
  tile(45, 'room',
    [
      '000100',
      '000100',
      '111111',
      '000100',
      '000100'
    ].join('\n'),
    [
      { col: 3, row: 0, side: 'top' , type: 'passage'},
      { col: 0, row: 2, side: 'left', type: 'passage' },
      { col: 5, row: 2, side: 'right', type: 'passage' },
      { col: 3, row: 4, side: 'bottom', type: 'passage' },
    ],
  ),

  // 46: U-shaped room (open at top)
  tile(46, 'room',
    [
      '111',
      '111',
      '111',
      '010',
      '010'
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 1, row: 4, side: 'bottom', type: 'passage' },
    ],
  ),

  // ── 51–56: Complex Corridors ──

  // 51: Plus-shaped junction with longer vertical arms
  tile(51, 'corridor',
    [
      '101',
      '111',
      '010',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 2, row: 0, side: 'top' },
      { col: 1, row: 2, side: 'bottom' },
    ],
  ),

  // 52: Z-bend corridor (orthogonal bends)
  tile(52, 'corridor',
    [
      '01000',
      '11100',
      '11111',
      '11100',
      '01000',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 0, row: 2, side: 'left' },
      { col: 4, row: 2, side: 'right', type: 'passage' },
      { col: 1, row: 4, side: 'bottom' },
    ],
  ),

  // 53: Double L-bend corridor (winding path)
  tile(53, 'corridor',
    [
      '111',
      '010',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'left' },
      { col: 2, row: 0, side: 'right', type: 'passage' },
      { col: 1, row: 1, side: 'bottom', type: 'passage' },
    ],
  ),

  // 54: Wide 2-cell passage
  tile(54, 'corridor',
    [
      '11100',
      '11111',
      '11100',
    ].join('\n'),
    [
      { col: 4, row: 1, side: 'right', type: 'passage' },
      { col: 1, row: 2, side: 'bottom' },
    ],
  ),

  // 55: Corridor with side nook
  tile(55, 'corridor',
    [
      '111111',
      '100000',
    ].join('\n'),
    [
      { col: 4, row: 0, side: 'top' },
      { col: 5, row: 0, side: 'right', type: 'passage' },
      { col: 0, row: 1, side: 'bottom', type: 'passage' },
    ],
  ),

  // 56: Spiral/winding passage
  tile(56, 'room',
    [
      '00111',
      '00111',
      '11111',
      '11111',
      '11111',
    ].join('\n'),
    [
      { col: 3, row: 0, side: 'top' },
      { col: 0, row: 3, side: 'left' },
      { col: 2, row: 4, side: 'bottom'},
    ],
  ),

  // ── 61–66: Special Rooms ──

  // 61: T-shaped grand hall
  tile(61, 'room',
    [
      '111',  
      '111',
      '111',
      '111',
      '111',
      '111',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 2, row: 3, side: 'right' },
      { col: 1, row: 5, side: 'bottom' },
    ],
  ),

  // 62: Cross-shaped room with corridors
  tile(62, 'room',
    [
      '010',
      '111',
      '010',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top', type: 'passage' },
      { col: 2, row: 1, side: 'right' , type: 'passage'},
      { col: 1, row: 2, side: 'bottom', type: 'passage' },
      { col: 0, row: 1, side: 'left', type: 'passage' },
    ],
  ),

  // 63: Guard room (room that narrows to corridor at bottom)
  tile(63, 'room',
    [
      '1',
      '1',
      '1',
      '1',
      '1',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top', type: 'passage' },
      { col: 0, row: 4, side: 'bottom', type: 'passage' },
      { col: 0, row: 2, side: 'left' },
      { col: 0, row: 2, side: 'right' },
    ],
  ),

  // 64: H-shaped room (two rooms connected by corridor)
  tile(64, 'room',
    [
      '111',
      '111',
      '010',
      '010',
      '010',
      '010',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 1, row: 5, side: 'bottom', type: 'passage' },
    ],
  ),

  // 65: Treasure room (diamond/rhombus room with single entrance)
  tile(65, 'room',
    [
      '100',
      '100',
      '111',
      '001',
      '001',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 2, row: 4, side: 'bottom' },
    ],
    true,
  ),

  // 66: Boss chamber (largest room, multiple entrances)
  tile(66, 'room',
    [
      '00001',
      '00111',
      '11111',
      '00111',
      '00001',
    ].join('\n'),
    [
      { col: 4, row: 0, side: 'top' },
      { col: 0, row: 2, side: 'left' },
      { col: 4, row: 4, side: 'bottom' },
    ],
    true,
  ),
]

export const TILE_TEMPLATES: TileTemplate[] = [...ENTRANCE_TILES, ...DUNGEON_TILES]

export function getTileById(id: number): TileTemplate | undefined {
  return TILE_TEMPLATES.find((t) => t.id === id)
}

export function getEntranceTiles(): TileTemplate[] {
  return TILE_TEMPLATES.filter((t) => t.category === 'entrance')
}

export function getDungeonTiles(): TileTemplate[] {
  return TILE_TEMPLATES.filter((t) => t.category !== 'entrance')
}
