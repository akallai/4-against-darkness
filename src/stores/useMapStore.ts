import { create } from 'zustand'
import type { MapData, MapTool, Rotation, GridCoord, AbsoluteDoor, MapLabel, WallOpeningType } from '@/types/map'
import { createEmptyMapData } from '@/types/map'
import type { TileTemplate } from '@/types/map'
import {
  stampTile,
  mergeCoords,
  subtractCoords,
  mergeDoors,
  subtractDoors,
  canonicalizeDoor,
} from '@/utils/mapGeometry'

const MAX_UNDO = 20

interface MapState {
  mapData: MapData
  activeTool: MapTool
  selectedTemplateId: number | null
  rotation: Rotation
  mirrored: boolean
  hoverCell: GridCoord | null
  undoStack: MapData[]
  isDrawing: boolean

  // Hydration
  setMapData: (data: MapData) => void
  resetMap: () => void

  // Tools
  setActiveTool: (tool: MapTool) => void
  setSelectedTemplate: (id: number | null) => void
  cycleRotation: () => void
  cycleRotationBack: () => void
  toggleMirror: () => void
  setHoverCell: (cell: GridCoord | null) => void

  // Tile operations
  placeTile: (template: TileTemplate, col: number, row: number) => void
  removePlacedTile: (id: string) => void

  // Draw operations
  drawCell: (col: number, row: number) => void
  eraseCell: (col: number, row: number) => void
  setIsDrawing: (val: boolean) => void
  pushUndoForDraw: () => void

  // Door/passage operations
  toggleOpening: (col: number, row: number, side: AbsoluteDoor['side'], type: WallOpeningType) => void

  // Label operations
  addLabel: (col: number, row: number, text: string, color?: string) => void
  updateLabel: (id: string, updates: Partial<Pick<MapLabel, 'text' | 'color' | 'col' | 'row'>>) => void
  deleteLabel: (id: string) => void

  // Undo
  undo: () => void
  clearMap: () => void
}

function pushUndo(stack: MapData[], current: MapData): MapData[] {
  const snapshot: MapData = {
    cells: [...current.cells],
    doors: [...current.doors],
    placedTiles: [...current.placedTiles],
    labels: [...current.labels],
  }
  const next = [...stack, snapshot]
  if (next.length > MAX_UNDO) next.shift()
  return next
}

let tileIdCounter = 0
function nextTileId(): string {
  return `tile_${Date.now()}_${tileIdCounter++}`
}

let labelIdCounter = 0
function nextLabelId(): string {
  return `label_${Date.now()}_${labelIdCounter++}`
}

export const useMapStore = create<MapState>()((set, get) => ({
  mapData: createEmptyMapData(),
  activeTool: 'place',
  selectedTemplateId: null,
  rotation: 0,
  mirrored: false,
  hoverCell: null,
  undoStack: [],
  isDrawing: false,

  setMapData: (data) => set({
    mapData: { ...data, doors: data.doors.map(canonicalizeDoor) },
    undoStack: [],
  }),
  resetMap: () => set({ mapData: createEmptyMapData(), undoStack: [] }),

  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedTemplate: (id) => set({ selectedTemplateId: id, activeTool: 'place' }),
  cycleRotation: () =>
    set((s) => ({ rotation: ((s.rotation + 90) % 360) as Rotation })),
  cycleRotationBack: () =>
    set((s) => ({ rotation: ((s.rotation + 270) % 360) as Rotation })),
  toggleMirror: () => set((s) => ({ mirrored: !s.mirrored })),
  setHoverCell: (cell) => set({ hoverCell: cell }),

  placeTile: (template, col, row) => {
    const state = get()
    const { cells: newCells, doors: newDoors } = stampTile(
      template,
      col,
      row,
      state.rotation,
      state.mirrored,
    )
    if (newCells.length === 0) return

    const placedTile = {
      id: nextTileId(),
      templateId: template.id,
      originCol: col,
      originRow: row,
      rotation: state.rotation,
      mirrored: state.mirrored,
      cells: newCells,
      doors: newDoors,
    }

    set({
      undoStack: pushUndo(state.undoStack, state.mapData),
      mapData: {
        ...state.mapData,
        cells: mergeCoords(state.mapData.cells, newCells),
        doors: mergeDoors(state.mapData.doors, newDoors),
        placedTiles: [...state.mapData.placedTiles, placedTile],
      },
    })
  },

  removePlacedTile: (id) => {
    const state = get()
    const tile = state.mapData.placedTiles.find((t) => t.id === id)
    if (!tile) return

    set({
      undoStack: pushUndo(state.undoStack, state.mapData),
      mapData: {
        ...state.mapData,
        cells: subtractCoords(state.mapData.cells, tile.cells),
        doors: subtractDoors(state.mapData.doors, tile.doors),
        placedTiles: state.mapData.placedTiles.filter((t) => t.id !== id),
      },
    })
  },

  drawCell: (col, row) => {
    const state = get()
    const exists = state.mapData.cells.some((c) => c.col === col && c.row === row)
    if (exists) return
    set({
      mapData: {
        ...state.mapData,
        cells: [...state.mapData.cells, { col, row }],
      },
    })
  },

  eraseCell: (col, row) => {
    const state = get()
    set({
      mapData: {
        ...state.mapData,
        cells: state.mapData.cells.filter((c) => !(c.col === col && c.row === row)),
        doors: state.mapData.doors.filter((d) => !(d.col === col && d.row === row)),
      },
    })
  },

  setIsDrawing: (val) => set({ isDrawing: val }),
  pushUndoForDraw: () => {
    const state = get()
    set({ undoStack: pushUndo(state.undoStack, state.mapData) })
  },

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

  addLabel: (col, row, text, color) => {
    const state = get()
    const label: MapLabel = { id: nextLabelId(), col, row, text, color }
    set({
      undoStack: pushUndo(state.undoStack, state.mapData),
      mapData: {
        ...state.mapData,
        labels: [...state.mapData.labels, label],
      },
    })
  },

  updateLabel: (id, updates) => {
    const state = get()
    set({
      mapData: {
        ...state.mapData,
        labels: state.mapData.labels.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      },
    })
  },

  deleteLabel: (id) => {
    const state = get()
    set({
      undoStack: pushUndo(state.undoStack, state.mapData),
      mapData: {
        ...state.mapData,
        labels: state.mapData.labels.filter((l) => l.id !== id),
      },
    })
  },

  undo: () => {
    const state = get()
    if (state.undoStack.length === 0) return
    const prev = state.undoStack[state.undoStack.length - 1]!
    set({
      mapData: prev,
      undoStack: state.undoStack.slice(0, -1),
    })
  },

  clearMap: () => {
    const state = get()
    set({
      undoStack: pushUndo(state.undoStack, state.mapData),
      mapData: createEmptyMapData(),
    })
  },
}))
