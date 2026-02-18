import { useMemo, useCallback, useRef } from 'react'
import { useMapStore } from '@/stores/useMapStore'
import { MAP_COLS, MAP_ROWS } from '@/types/map'
import type { DoorSide, WallOpeningType } from '@/types/map'
import { stampTile, transformTile, computeBlackoutCells } from '@/utils/mapGeometry'
import { getTileById } from '@/data/tileTemplates'
import './MapGrid.css'

export function MapGrid() {
  const mapData = useMapStore((s) => s.mapData)
  const activeTool = useMapStore((s) => s.activeTool)
  const selectedTemplateId = useMapStore((s) => s.selectedTemplateId)
  const rotation = useMapStore((s) => s.rotation)
  const mirrored = useMapStore((s) => s.mirrored)
  const hoverCell = useMapStore((s) => s.hoverCell)
  const isDrawing = useMapStore((s) => s.isDrawing)

  const setHoverCell = useMapStore((s) => s.setHoverCell)
  const placeTile = useMapStore((s) => s.placeTile)
  const drawCell = useMapStore((s) => s.drawCell)
  const eraseCell = useMapStore((s) => s.eraseCell)
  const toggleOpening = useMapStore((s) => s.toggleOpening)
  const addLabel = useMapStore((s) => s.addLabel)
  const deleteLabel = useMapStore((s) => s.deleteLabel)
  const removePlacedTile = useMapStore((s) => s.removePlacedTile)
  const setIsDrawing = useMapStore((s) => s.setIsDrawing)
  const pushUndoForDraw = useMapStore((s) => s.pushUndoForDraw)

  const gridRef = useRef<HTMLDivElement>(null)

  // Build floor cell lookup set
  const cellSet = useMemo(() => {
    const set = new Set<string>()
    for (const c of mapData.cells) {
      set.add(`${c.col},${c.row}`)
    }
    return set
  }, [mapData.cells])

  // Compute blackout cells (enclosed empty regions with no door access)
  const blackoutCells = useMemo(
    () => computeBlackoutCells(mapData.cells, mapData.doors, MAP_COLS, MAP_ROWS),
    [mapData.cells, mapData.doors],
  )

  // Build door lookup map: cell key → Map<side, { type, source }>
  // source=true for the canonical entry (renders marker), source=false for the mirror (CSS class only)
  const doorMap = useMemo(() => {
    const map = new Map<string, Map<DoorSide, { type: WallOpeningType; source: boolean }>>()
    const addEntry = (col: number, row: number, side: DoorSide, type: WallOpeningType, source: boolean) => {
      const key = `${col},${row}`
      if (!map.has(key)) map.set(key, new Map())
      const cellMap = map.get(key)!
      // Don't overwrite a source entry with a mirror entry
      if (!cellMap.has(side) || source) cellMap.set(side, { type, source })
    }
    for (const d of mapData.doors) {
      const type = d.type ?? 'door'
      addEntry(d.col, d.row, d.side, type, true)
      // Mirror entry for the neighbor cell (CSS class only, no marker)
      if (d.side === 'right') addEntry(d.col + 1, d.row, 'left', type, false)
      else if (d.side === 'bottom') addEntry(d.col, d.row + 1, 'top', type, false)
      else if (d.side === 'left') addEntry(d.col - 1, d.row, 'right', type, false)
      else if (d.side === 'top') addEntry(d.col, d.row - 1, 'bottom', type, false)
    }
    return map
  }, [mapData.doors])

  // Build label lookup map
  const labelMap = useMemo(() => {
    const map = new Map<string, typeof mapData.labels>()
    for (const l of mapData.labels) {
      const key = `${l.col},${l.row}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(l)
    }
    return map
  }, [mapData.labels])

  // Compute center offset for the selected tile so cursor is at center, not top-left
  const tileOffset = useMemo(() => {
    if (!selectedTemplateId) return { col: 0, row: 0 }
    const template = getTileById(selectedTemplateId)
    if (!template) return { col: 0, row: 0 }
    const { width, height } = transformTile(template, rotation, mirrored)
    return { col: -Math.floor(width / 2), row: -Math.floor(height / 2) }
  }, [selectedTemplateId, rotation, mirrored])

  // Ghost cells and doors for tile preview
  const { ghostCells, ghostDoorMap } = useMemo(() => {
    if (activeTool !== 'place' || !selectedTemplateId || !hoverCell) {
      return { ghostCells: new Set<string>(), ghostDoorMap: new Map<string, Map<DoorSide, { type: WallOpeningType; source: boolean }>>() }
    }
    const template = getTileById(selectedTemplateId)
    if (!template) {
      return { ghostCells: new Set<string>(), ghostDoorMap: new Map<string, Map<DoorSide, { type: WallOpeningType; source: boolean }>>() }
    }
    const originCol = hoverCell.col + tileOffset.col
    const originRow = hoverCell.row + tileOffset.row
    const { cells, doors } = stampTile(template, originCol, originRow, rotation, mirrored)
    const cellSet = new Set(cells.map((c) => `${c.col},${c.row}`))
    const doorMap = new Map<string, Map<DoorSide, { type: WallOpeningType; source: boolean }>>()
    const addEntry = (col: number, row: number, side: DoorSide, type: WallOpeningType, source: boolean) => {
      const key = `${col},${row}`
      if (!doorMap.has(key)) doorMap.set(key, new Map())
      const cellMap = doorMap.get(key)!
      if (!cellMap.has(side) || source) cellMap.set(side, { type, source })
    }
    for (const d of doors) {
      const type = d.type ?? 'door'
      addEntry(d.col, d.row, d.side, type, true)
      if (d.side === 'right') addEntry(d.col + 1, d.row, 'left', type, false)
      else if (d.side === 'bottom') addEntry(d.col, d.row + 1, 'top', type, false)
      else if (d.side === 'left') addEntry(d.col - 1, d.row, 'right', type, false)
      else if (d.side === 'top') addEntry(d.col, d.row - 1, 'bottom', type, false)
    }
    return { ghostCells: cellSet, ghostDoorMap: doorMap }
  }, [activeTool, selectedTemplateId, hoverCell, rotation, mirrored, tileOffset])

  const handleCellMouseDown = useCallback(
    (col: number, row: number, e: React.MouseEvent) => {
      e.preventDefault()
      if (activeTool === 'place' && selectedTemplateId) {
        const template = getTileById(selectedTemplateId)
        if (template) placeTile(template, col + tileOffset.col, row + tileOffset.row)
      } else if (activeTool === 'draw') {
        pushUndoForDraw()
        setIsDrawing(true)
        drawCell(col, row)
      } else if (activeTool === 'erase') {
        pushUndoForDraw()
        setIsDrawing(true)
        eraseCell(col, row)
      } else if (activeTool === 'door' || activeTool === 'passage') {
        const side = getDoorSideFromClick(e)
        toggleOpening(col, row, side, activeTool === 'door' ? 'door' : 'passage')
      } else if (activeTool === 'label') {
        const existingLabels = labelMap.get(`${col},${row}`)
        if (existingLabels && existingLabels.length > 0) {
          deleteLabel(existingLabels[0]!.id)
        } else {
          const text = prompt('Label text:')
          if (text) addLabel(col, row, text)
        }
      } else if (activeTool === 'select') {
        // Find placed tile at this cell
        const tile = mapData.placedTiles.find((t) =>
          t.cells.some((c) => c.col === col && c.row === row),
        )
        if (tile) {
          if (confirm(`Remove tile #${tile.templateId}?`)) {
            removePlacedTile(tile.id)
          }
        }
      }
    },
    [activeTool, selectedTemplateId, placeTile, drawCell, eraseCell, toggleOpening, addLabel, deleteLabel, removePlacedTile, pushUndoForDraw, setIsDrawing, labelMap, mapData.placedTiles, tileOffset],
  )

  const handleCellMouseEnter = useCallback(
    (col: number, row: number) => {
      setHoverCell({ col, row })
      if (!isDrawing) return
      if (activeTool === 'draw') drawCell(col, row)
      else if (activeTool === 'erase') eraseCell(col, row)
    },
    [activeTool, isDrawing, drawCell, eraseCell, setHoverCell],
  )

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false)
  }, [setIsDrawing])

  const handleMouseLeave = useCallback(() => {
    setHoverCell(null)
    setIsDrawing(false)
  }, [setHoverCell, setIsDrawing])

  // Render all 560 cells
  const cells = useMemo(() => {
    const result: React.ReactNode[] = []
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const key = `${c},${r}`
        const isFloor = cellSet.has(key)
        const isGhost = ghostCells.has(key)
        const doors = doorMap.get(key)
        const labels = labelMap.get(key)

        const ghostDoors = ghostDoorMap.get(key)

        // Compute wall classes for floor cells
        let wallClasses = ''
        if (isFloor) {
          if (r === 0 || !cellSet.has(`${c},${r - 1}`)) wallClasses += ' wall-top'
          if (c === MAP_COLS - 1 || !cellSet.has(`${c + 1},${r}`)) wallClasses += ' wall-right'
          if (r === MAP_ROWS - 1 || !cellSet.has(`${c},${r + 1}`)) wallClasses += ' wall-bottom'
          if (c === 0 || !cellSet.has(`${c - 1},${r}`)) wallClasses += ' wall-left'
        } else if (isGhost) {
          if (r === 0 || !ghostCells.has(`${c},${r - 1}`)) wallClasses += ' wall-top'
          if (c === MAP_COLS - 1 || !ghostCells.has(`${c + 1},${r}`)) wallClasses += ' wall-right'
          if (r === MAP_ROWS - 1 || !ghostCells.has(`${c},${r + 1}`)) wallClasses += ' wall-bottom'
          if (c === 0 || !ghostCells.has(`${c - 1},${r}`)) wallClasses += ' wall-left'
        }

        // Opening class overrides (both doors and passages create a gap in the wall)
        let doorClasses = ''
        const activeDoors = isGhost ? ghostDoors : doors
        if (activeDoors) {
          if (activeDoors.has('top')) doorClasses += ' door-top'
          if (activeDoors.has('right')) doorClasses += ' door-right'
          if (activeDoors.has('bottom')) doorClasses += ' door-bottom'
          if (activeDoors.has('left')) doorClasses += ' door-left'
        }

        result.push(
          <div
            key={key}
            className={`map-cell${isFloor ? ' floor' : ''}${isGhost ? ' ghost' : ''}${!isFloor && !isGhost && blackoutCells.has(key) ? ' blackout' : ''}${wallClasses}${doorClasses}`}
            onMouseDown={(e) => handleCellMouseDown(c, r, e)}
            onMouseEnter={() => handleCellMouseEnter(c, r)}
          >
            {activeDoors && Array.from(activeDoors.entries()).map(([side, { type, source }]) => (
              (source || isGhost)
                ? type === 'door'
                  ? <span key={side} className={`door-marker door-marker-${side}`} />
                  : <span key={side} className={`passage-marker passage-marker-${side}`} />
                : null
            ))}
            {labels?.map((l) => (
              <span
                key={l.id}
                className={`map-label${activeTool === 'label' ? ' clickable' : ''}`}
                style={l.color ? { color: l.color } : undefined}
              >
                {l.text}
              </span>
            ))}
          </div>,
        )
      }
    }
    return result
  }, [cellSet, blackoutCells, ghostCells, ghostDoorMap, doorMap, labelMap, activeTool, handleCellMouseDown, handleCellMouseEnter])

  return (
    <div className="map-grid-wrapper">
      <div
        ref={gridRef}
        className="map-grid"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {cells}
      </div>
    </div>
  )
}

/** Determine which edge of a cell was clicked by dividing it into 4 triangles */
function getDoorSideFromClick(e: React.MouseEvent): DoorSide {
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const w = rect.width
  const h = rect.height
  // Normalize to 0..1
  const nx = x / w
  const ny = y / h
  // Compare diagonals to determine quadrant
  if (ny < nx && ny < 1 - nx) return 'top'
  if (ny > nx && ny > 1 - nx) return 'bottom'
  if (nx < 0.5) return 'left'
  return 'right'
}
