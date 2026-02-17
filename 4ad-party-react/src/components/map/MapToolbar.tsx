import { useMapStore } from '@/stores/useMapStore'
import type { MapTool } from '@/types/map'
import './MapToolbar.css'

const TOOLS: { key: MapTool; label: string }[] = [
  { key: 'place', label: 'Place' },
  { key: 'draw', label: 'Draw' },
  { key: 'erase', label: 'Erase' },
  { key: 'door', label: 'Door' },
  { key: 'passage', label: 'Gate' },
  { key: 'label', label: 'Label' },
  { key: 'select', label: 'Select' },
]

interface MapToolbarProps {
  onBack: () => void
}

export function MapToolbar({ onBack }: MapToolbarProps) {
  const activeTool = useMapStore((s) => s.activeTool)
  const rotation = useMapStore((s) => s.rotation)
  const mirrored = useMapStore((s) => s.mirrored)
  const undoStack = useMapStore((s) => s.undoStack)

  const setActiveTool = useMapStore((s) => s.setActiveTool)
  const cycleRotation = useMapStore((s) => s.cycleRotation)
  const toggleMirror = useMapStore((s) => s.toggleMirror)
  const undo = useMapStore((s) => s.undo)
  const clearMap = useMapStore((s) => s.clearMap)

  return (
    <div className="map-toolbar">
      <button className="map-back-btn" onClick={onBack}>
        Back
      </button>

      <div className="map-toolbar-group">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            className={`map-tool-btn${activeTool === t.key ? ' active' : ''}`}
            onClick={() => setActiveTool(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="map-toolbar-divider" />

      <div className="map-toolbar-group">
        <button className="map-tool-btn" onClick={cycleRotation}>
          Rot {rotation}°
        </button>
        <button
          className={`map-tool-btn${mirrored ? ' mirror-on' : ''}`}
          onClick={toggleMirror}
        >
          Mirror
        </button>
      </div>

      <div className="map-toolbar-divider" />

      <div className="map-toolbar-group">
        <button
          className="map-tool-btn"
          onClick={undo}
          disabled={undoStack.length === 0}
        >
          Undo
        </button>
        <button className="map-tool-btn" onClick={clearMap}>
          Clear
        </button>
      </div>
    </div>
  )
}
