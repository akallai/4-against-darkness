export type DoorSide = 'top' | 'right' | 'bottom' | 'left'
export type WallOpeningType = 'door' | 'passage'

export interface TileDoor {
  col: number
  row: number
  side: DoorSide
  type?: WallOpeningType
}

export interface TileTemplate {
  id: number
  category: 'entrance' | 'corridor' | 'room'
  grid: string
  width: number
  height: number
  doors: TileDoor[]
  hasStairs?: boolean
}

export type Rotation = 0 | 90 | 180 | 270

export interface GridCoord {
  col: number
  row: number
}

export interface AbsoluteDoor {
  col: number
  row: number
  side: DoorSide
  type?: WallOpeningType
}

export interface PlacedTile {
  id: string
  templateId: number
  originCol: number
  originRow: number
  rotation: Rotation
  mirrored: boolean
  cells: GridCoord[]
  doors: AbsoluteDoor[]
}

export interface MapLabel {
  id: string
  col: number
  row: number
  text: string
  color?: string
}

export type MapTool = 'place' | 'draw' | 'erase' | 'door' | 'passage' | 'label' | 'select'

export interface MapData {
  cells: GridCoord[]
  doors: AbsoluteDoor[]
  placedTiles: PlacedTile[]
  labels: MapLabel[]
}

export const MAP_COLS = 20
export const MAP_ROWS = 28

export function createEmptyMapData(): MapData {
  return {
    cells: [],
    doors: [],
    placedTiles: [],
    labels: [],
  }
}
