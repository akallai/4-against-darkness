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
  // Tile 1: Wide room (7w × 2h) with 3-wide center extension below.
  // 3 doors on top, 3 on bottom center. Stairs inside.
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

  // Tile 2: Large room with upper corridors and right extension.
  // Isolated alcove at top-left. Lower 3-wide corridor going down.
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
  // horizontal base. Comb/trident shape. Passages at corridor tops.
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
  // horizontal base (5w × 2h). Fork shape.
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

  // Tile 5: Cross-junction with single corridor going up,
  // left and right exits, long corridor going down to 3×2 room at bottom.
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

  // Tile 6: Wide top section (6w), narrowing to 2-wide corridor,
  // then widening to 3-wide room at bottom.
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
// Corridors are 1 cell wide; rooms have at least a 2×2 block.
// Each tile is encoded as a grid string where 1=floor, 0=empty.
// Doors mark connection points on tile edges.
// ────────────────────────────────────────────────────────────────
const DUNGEON_TILES: TileTemplate[] = [

  // ── 11–16: Basic Corridors ──

  // 11: Straight vertical corridor, 1 wide, 4 long
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

  // 12: Short vertical corridor, 1 wide, 3 long
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

  // 13: S-shaped corridor (zigzag: horizontal-vertical-horizontal)
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

  // 14: I-shaped corridor (two horizontal bars connected by vertical passage)
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

  // 15: Irregular room with corridor extending down-right
  tile(15, 'room',
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

  // 16: Small room (3×2) with corridor extending down
  tile(16, 'room',
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

  // 21: Small square room (3×3)
  tile(21, 'room',
    [
      '111',
      '111',
      '111',
    ].join('\n'),
    [
      { col: 1, row: 2, side: 'bottom' },
    ],
  ),

  // 22: Room (3×3) with short corridor extending down
  tile(22, 'room',
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

  // 23: Room (3w × 4h) on right with 4-cell corridor extending left
  tile(23, 'room',
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

  // 24: Small room with corridors extending up and down
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

  // 25: Room (3w × 4h) on right with 3-cell corridor extending left
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

  // 26: Short vertical corridor, 1 wide, 2 long
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

  // 31: Stair-step shaped room
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

  // 32: T-shaped corridor junction
  tile(32, 'corridor',
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

  // 33: Short vertical corridor, 1 wide, 3 long
  tile(33, 'corridor',
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

  // 34: Room (3×3) with corridor extending up (2 cells) and down (1 cell)
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

  // 36: Winding room — zigzag corridors above and below a 3×2 room core
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

  // 41: Room (3×3) with corridors extending up-left and down
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

  // 42: Z-shaped corridor
  tile(42, 'corridor',
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

  // 43: Room (3×3) with short corridor extending down
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

  // 44: Wide room (4×2) with top-right extension and corridor extending down
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

  // 45: Cross-shaped corridor junction
  tile(45, 'corridor',
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

  // 46: Room (3×3) with long corridor extending down (2 cells)
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

  // 51: Branching corridor (2 top prongs, 1 bottom)
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

  // 52: Diamond-shaped room with corridor extending right
  tile(52, 'room',
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

  // 53: T-junction corridor (top bar with bottom center exit)
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

  // 54: Room (3×3) with corridor extending right
  tile(54, 'room',
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

  // 55: L-shaped corridor (6-wide top, 1-cell down-left nook)
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

  // 56: Large L-shaped room
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

  // 61: Grand hall (tall rectangular room, 3×6)
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

  // 62: Plus-shaped corridor junction
  tile(62, 'corridor',
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

  // 63: Long vertical corridor, 1 wide, 5 long
  tile(63, 'corridor',
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

  // 64: Room (3×2) with long corridor extending down (4 cells)
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

  // 65: Z-shaped corridor with stairs
  tile(65, 'corridor',
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

  // 66: Boss chamber (diamond/arrow-shaped room, wider at center)
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
