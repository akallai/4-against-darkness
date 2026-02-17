import { useMemo, useCallback, useRef } from 'react'
import { useMapStore } from '@/stores/useMapStore'
import { MAP_COLS, MAP_ROWS } from '@/types/map'
import type { DoorSide } from '@/types/map'
import { stampTile } from '@/utils/mapGeometry'
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
  const toggleDoor = useMapStore((s) => s.toggleDoor)
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

  // Build door lookup map
  const doorMap = useMemo(() => {
    const map = new Map<string, Set<DoorSide>>()
    for (const d of mapData.doors) {
      const key = `${d.col},${d.row}`
      if (!map.has(key)) map.set(key, new Set())
      map.get(key)!.add(d.side)
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

  // Ghost cells for tile preview
  const ghostCells = useMemo(() => {
    if (activeTool !== 'place' || !selectedTemplateId || !hoverCell) return new Set<string>()
    const template = getTileById(selectedTemplateId)
    if (!template) return new Set<string>()
    const { cells } = stampTile(template, hoverCell.col, hoverCell.row, rotation, mirrored)
    return new Set(cells.map((c) => `${c.col},${c.row}`))
  }, [activeTool, selectedTemplateId, hoverCell, rotation, mirrored])

  const handleCellMouseDown = useCallback(
    (col: number, row: number, e: React.MouseEvent) => {
      e.preventDefault()
      if (activeTool === 'place' && selectedTemplateId) {
        const template = getTileById(selectedTemplateId)
        if (template) placeTile(template, col, row)
      } else if (activeTool === 'draw') {
        pushUndoForDraw()
        setIsDrawing(true)
        drawCell(col, row)
      } else if (activeTool === 'erase') {
        pushUndoForDraw()
        setIsDrawing(true)
        eraseCell(col, row)
      } else if (activeTool === 'door') {
        const side = getDoorSideFromClick(e)
        toggleDoor(col, row, side)
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
          if (confirm(`Remove tile "${getTileById(tile.templateId)?.name ?? tile.templateId}"?`)) {
            removePlacedTile(tile.id)
          }
        }
      }
    },
    [activeTool, selectedTemplateId, placeTile, drawCell, eraseCell, toggleDoor, addLabel, deleteLabel, removePlacedTile, pushUndoForDraw, setIsDrawing, labelMap, mapData.placedTiles],
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

        // Compute wall classes for floor cells
        let wallClasses = ''
        if (isFloor) {
          if (r === 0 || !cellSet.has(`${c},${r - 1}`)) wallClasses += ' wall-top'
          if (c === MAP_COLS - 1 || !cellSet.has(`${c + 1},${r}`)) wallClasses += ' wall-right'
          if (r === MAP_ROWS - 1 || !cellSet.has(`${c},${r + 1}`)) wallClasses += ' wall-bottom'
          if (c === 0 || !cellSet.has(`${c - 1},${r}`)) wallClasses += ' wall-left'
        }

        // Door class overrides
        let doorClasses = ''
        if (doors) {
          if (doors.has('top')) doorClasses += ' door-top'
          if (doors.has('right')) doorClasses += ' door-right'
          if (doors.has('bottom')) doorClasses += ' door-bottom'
          if (doors.has('left')) doorClasses += ' door-left'
        }

        result.push(
          <div
            key={key}
            className={`map-cell${isFloor ? ' floor' : ''}${isGhost ? ' ghost' : ''}${wallClasses}${doorClasses}`}
            onMouseDown={(e) => handleCellMouseDown(c, r, e)}
            onMouseEnter={() => handleCellMouseEnter(c, r)}
          >
            {doors && Array.from(doors).map((side) => (
              <span key={side} className={`door-marker door-marker-${side}`} />
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
  }, [cellSet, ghostCells, doorMap, labelMap, activeTool, handleCellMouseDown, handleCellMouseEnter])

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
