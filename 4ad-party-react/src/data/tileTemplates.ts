import type { TileTemplate, TileDoor } from '@/types/map'

/** Helper to define a tile concisely */
function tile(
  id: number,
  name: string,
  category: 'entrance' | 'corridor' | 'room',
  grid: string,
  doors: TileDoor[] = [],
  hasStairs = false,
): TileTemplate {
  const rows = grid.split('\n')
  const height = rows.length
  const width = Math.max(...rows.map((r) => r.length))
  return { id, name, category, grid, width, height, doors, hasStairs }
}

// ────────────────────────────────────────────────────────────────
// Entrance Tiles (d6: 1–6)
// These are larger starting rooms with stairs (X marks)
// and doors leading into the dungeon.
// ────────────────────────────────────────────────────────────────
const ENTRANCE_TILES: TileTemplate[] = [
  // Tile 1: Wide rectangular room with X-stairs.
  // Doors at bottom. ~6 wide x 4 tall.
  tile(1, 'Entrance Hall', 'entrance',
    [
      '111111',
      '111111',
      '111111',
      '111111',
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'top' },
      { col: 3, row: 3, side: 'bottom' },
    ],
    true,
  ),

  // Tile 2: Room with doors on right side and bottom.
  // X-stairs marker inside.
  tile(2, 'Side Entrance', 'entrance',
    [
      '111111',
      '111111',
      '111111',
      '111111',
    ].join('\n'),
    [
      { col: 5, row: 1, side: 'right' },
      { col: 5, row: 2, side: 'right' },
      { col: 1, row: 3, side: 'bottom' },
      { col: 2, row: 3, side: 'bottom' },
    ],
    true,
  ),

  // Tile 3: Junction entrance — corridors branch in 3 directions
  // (up, left, right) from a central area. NOT a simple room.
  tile(3, 'Junction Entrance', 'entrance',
    [
      '0110',
      '0110',
      '1111',
      '1001',
      '1001',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 2, row: 0, side: 'top' },
      { col: 0, row: 4, side: 'bottom' },
      { col: 3, row: 4, side: 'bottom' },
    ],
    true,
  ),

  // Tile 4: Cross-shaped junction entrance —
  // corridors extend in 4 directions from center.
  tile(4, 'Cross Entrance', 'entrance',
    [
      '0110',
      '0110',
      '1111',
      '0110',
      '0110',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 3, row: 2, side: 'right' },
      { col: 1, row: 4, side: 'bottom' },
      { col: 0, row: 2, side: 'left' },
    ],
    true,
  ),

  // Tile 5: Branching entrance — multiple parallel corridors
  // extending downward from a top junction. Tallest entrance.
  tile(5, 'Branching Entrance', 'entrance',
    [
      '10101',
      '10101',
      '11111',
      '10101',
      '10101',
      '10101',
      '10101',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 2, row: 0, side: 'top' },
      { col: 4, row: 0, side: 'top' },
      { col: 0, row: 6, side: 'bottom' },
      { col: 2, row: 6, side: 'bottom' },
      { col: 4, row: 6, side: 'bottom' },
    ],
    true,
  ),

  // Tile 6: Simple rectangular entrance room with bottom doors.
  tile(6, 'Grand Entrance', 'entrance',
    [
      '11111',
      '11111',
      '11111',
      '11111',
    ].join('\n'),
    [
      { col: 1, row: 3, side: 'bottom' },
      { col: 2, row: 3, side: 'bottom' },
      { col: 3, row: 3, side: 'bottom' },
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
  tile(11, 'Straight Corridor', 'corridor',
    [
      '1',
      '1',
      '1',
      '1',
      '1',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 0, row: 4, side: 'bottom' },
    ],
  ),

  // 12: Short corridor with a side door
  tile(12, 'Corridor with Door', 'corridor',
    [
      '1',
      '1',
      '1',
      '1',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 0, row: 1, side: 'right' },
      { col: 0, row: 3, side: 'bottom' },
    ],
  ),

  // 13: L-shaped corridor bending down then right
  tile(13, 'L-Corridor', 'corridor',
    [
      '10',
      '10',
      '10',
      '11',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 1, row: 3, side: 'right' },
    ],
  ),

  // 14: 4-way crossroads
  tile(14, 'Crossroads', 'corridor',
    [
      '010',
      '111',
      '010',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 2, row: 1, side: 'right' },
      { col: 1, row: 2, side: 'bottom' },
      { col: 0, row: 1, side: 'left' },
    ],
  ),

  // 15: T-junction (corridor from top, branches left+right)
  tile(15, 'T-Junction', 'corridor',
    [
      '010',
      '010',
      '111',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 0, row: 2, side: 'left' },
      { col: 2, row: 2, side: 'right' },
    ],
  ),

  // 16: Long straight corridor, 1 wide, 7 long
  tile(16, 'Long Corridor', 'corridor',
    [
      '1',
      '1',
      '1',
      '1',
      '1',
      '1',
      '1',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 0, row: 6, side: 'bottom' },
    ],
  ),

  // ── 21–26: Corridor Variants ──

  // 21: S-bend corridor
  tile(21, 'S-Bend', 'corridor',
    [
      '10',
      '10',
      '11',
      '01',
      '01',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 1, row: 4, side: 'bottom' },
    ],
  ),

  // 22: Wide L-corridor (2-wide corridors)
  tile(22, 'Wide L-Corridor', 'corridor',
    [
      '1100',
      '1100',
      '1111',
      '1111',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 1, row: 0, side: 'top' },
      { col: 3, row: 3, side: 'bottom' },
    ],
  ),

  // 23: Z-shaped corridor (bends twice)
  tile(23, 'Z-Corridor', 'corridor',
    [
      '110',
      '110',
      '011',
      '011',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 2, row: 3, side: 'bottom' },
    ],
  ),

  // 24: Room with corridor extending down
  tile(24, 'Room with Passage', 'room',
    [
      '1111',
      '1111',
      '1111',
      '0010',
      '0010',
    ].join('\n'),
    [
      { col: 0, row: 1, side: 'left' },
      { col: 2, row: 4, side: 'bottom' },
    ],
  ),

  // 25: L-shaped room with corridor
  tile(25, 'L-Room with Corridor', 'room',
    [
      '11110',
      '11110',
      '11111',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 4, row: 2, side: 'right' },
    ],
  ),

  // 26: Small room with attached corridor going down
  tile(26, 'Alcove Corridor', 'corridor',
    [
      '110',
      '110',
      '010',
      '010',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 1, row: 3, side: 'bottom' },
    ],
  ),

  // ── 31–36: Small Rooms ──

  // 31: Small rectangular room, 1 door on left
  tile(31, 'Small Room', 'room',
    [
      '1111',
      '1111',
      '1111',
    ].join('\n'),
    [
      { col: 0, row: 1, side: 'left' },
      { col: 3, row: 1, side: 'right' },
    ],
  ),

  // 32: Small room, 2 doors (left and right)
  tile(32, 'Small Room 2-Door', 'room',
    [
      '1111',
      '1111',
      '1111',
    ].join('\n'),
    [
      { col: 0, row: 1, side: 'left' },
      { col: 1, row: 2, side: 'bottom' },
      { col: 2, row: 2, side: 'bottom' },
    ],
  ),

  // 33: Taller narrow room
  tile(33, 'Narrow Room', 'room',
    [
      '111',
      '111',
      '111',
      '111',
    ].join('\n'),
    [
      { col: 0, row: 1, side: 'left' },
      { col: 1, row: 3, side: 'bottom' },
    ],
  ),

  // 34: Round room (octagonal approximation, 5x5)
  tile(34, 'Round Room', 'room',
    [
      '01110',
      '11111',
      '11111',
      '11111',
      '01110',
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'top' },
      { col: 4, row: 2, side: 'right' },
    ],
  ),

  // 35: L-shaped room
  tile(35, 'L-Shaped Room', 'room',
    [
      '11100',
      '11100',
      '11111',
      '11111',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 4, row: 3, side: 'right' },
      { col: 0, row: 2, side: 'left' },
    ],
  ),

  // 36: Oval room (elongated, 6x4)
  tile(36, 'Oval Room', 'room',
    [
      '011110',
      '111111',
      '111111',
      '011110',
    ].join('\n'),
    [
      { col: 0, row: 1, side: 'left' },
      { col: 5, row: 2, side: 'right' },
    ],
  ),

  // ── 41–46: Medium Rooms ──

  // 41: Large rectangular room
  tile(41, 'Large Room', 'room',
    [
      '11111',
      '11111',
      '11111',
      '11111',
    ].join('\n'),
    [
      { col: 0, row: 2, side: 'left' },
      { col: 4, row: 2, side: 'right' },
    ],
  ),

  // 42: Room with corridor extension to right
  tile(42, 'Room with Extension', 'room',
    [
      '111110',
      '111110',
      '111111',
      '111110',
    ].join('\n'),
    [
      { col: 0, row: 1, side: 'left' },
      { col: 5, row: 2, side: 'right' },
    ],
  ),

  // 43: T-shaped room (wider at bottom)
  tile(43, 'T-Room', 'room',
    [
      '01110',
      '01110',
      '11111',
      '11111',
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'top' },
      { col: 0, row: 3, side: 'left' },
      { col: 4, row: 3, side: 'right' },
    ],
  ),

  // 44: Room with corridor going up
  tile(44, 'Room with Corridor', 'room',
    [
      '0010',
      '0010',
      '1111',
      '1111',
      '1111',
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'top' },
      { col: 0, row: 3, side: 'left' },
    ],
  ),

  // 45: Cross-shaped room
  tile(45, 'Cross Room', 'room',
    [
      '01110',
      '01110',
      '11111',
      '01110',
      '01110',
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'top' },
      { col: 4, row: 2, side: 'right' },
      { col: 2, row: 4, side: 'bottom' },
      { col: 0, row: 2, side: 'left' },
    ],
  ),

  // 46: U-shaped room (open at top)
  tile(46, 'U-Room', 'room',
    [
      '10001',
      '10001',
      '11111',
      '11111',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 4, row: 0, side: 'top' },
      { col: 2, row: 3, side: 'bottom' },
    ],
  ),

  // ── 51–56: Complex Corridors ──

  // 51: Plus-shaped junction with longer vertical arms
  tile(51, 'Branching Corridor', 'corridor',
    [
      '010',
      '010',
      '111',
      '010',
      '010',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 0, row: 2, side: 'left' },
      { col: 2, row: 2, side: 'right' },
      { col: 1, row: 4, side: 'bottom' },
    ],
  ),

  // 52: Z-bend corridor (orthogonal bends)
  tile(52, 'Z-Bend', 'corridor',
    [
      '10',
      '11',
      '01',
      '01',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 1, row: 3, side: 'bottom' },
    ],
  ),

  // 53: Double L-bend corridor (winding path)
  tile(53, 'Winding Corridor', 'corridor',
    [
      '10',
      '11',
      '01',
      '01',
      '11',
      '10',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 0, row: 5, side: 'bottom' },
    ],
  ),

  // 54: Wide 2-cell passage
  tile(54, 'Wide Passage', 'corridor',
    [
      '11',
      '11',
      '11',
      '11',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 1, row: 0, side: 'top' },
      { col: 0, row: 3, side: 'bottom' },
      { col: 1, row: 3, side: 'bottom' },
    ],
  ),

  // 55: Corridor with side nook
  tile(55, 'Corridor with Nook', 'corridor',
    [
      '110',
      '010',
      '010',
      '010',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 1, row: 3, side: 'bottom' },
    ],
  ),

  // 56: Spiral/winding passage
  tile(56, 'Spiral Passage', 'room',
    [
      '11110',
      '11110',
      '11111',
      '00001',
      '00001',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 4, row: 4, side: 'bottom' },
    ],
  ),

  // ── 61–66: Special Rooms ──

  // 61: T-shaped grand hall
  tile(61, 'Grand Hall', 'room',
    [
      '01110',
      '01110',
      '11111',
      '11111',
      '11111',
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'top' },
      { col: 4, row: 3, side: 'right' },
      { col: 2, row: 4, side: 'bottom' },
      { col: 0, row: 3, side: 'left' },
    ],
  ),

  // 62: Cross-shaped room with corridors
  tile(62, 'Cross Hall', 'room',
    [
      '01100',
      '01100',
      '11111',
      '01100',
      '01100',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 4, row: 2, side: 'right' },
      { col: 1, row: 4, side: 'bottom' },
      { col: 0, row: 2, side: 'left' },
    ],
  ),

  // 63: Guard room (room that narrows to corridor at bottom)
  tile(63, 'Guard Room', 'room',
    [
      '1111',
      '1111',
      '1111',
      '0110',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
      { col: 2, row: 0, side: 'top' },
      { col: 1, row: 3, side: 'bottom' },
    ],
  ),

  // 64: H-shaped room (two rooms connected by corridor)
  tile(64, 'H-Room', 'room',
    [
      '10001',
      '10001',
      '11111',
      '10001',
      '10001',
    ].join('\n'),
    [
      { col: 0, row: 0, side: 'top' },
      { col: 4, row: 0, side: 'top' },
      { col: 0, row: 4, side: 'bottom' },
      { col: 4, row: 4, side: 'bottom' },
    ],
  ),

  // 65: Treasure room (diamond/rhombus room with single entrance)
  tile(65, 'Treasure Room', 'room',
    [
      '011',
      '111',
      '111',
      '011',
    ].join('\n'),
    [
      { col: 1, row: 0, side: 'top' },
    ],
    true,
  ),

  // 66: Boss chamber (largest room, multiple entrances)
  tile(66, 'Boss Chamber', 'room',
    [
      '011110',
      '111111',
      '111111',
      '111111',
      '111111',
      '011110',
    ].join('\n'),
    [
      { col: 2, row: 0, side: 'top' },
      { col: 5, row: 3, side: 'right' },
      { col: 3, row: 5, side: 'bottom' },
      { col: 0, row: 3, side: 'left' },
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
