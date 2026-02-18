import { useMapStore } from '@/stores/useMapStore'
import './MapTileControls.css'

// Icons from game-icons.net by Delapouite (CC BY 3.0)
function RotateLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="tile-ctrl-icon">
      <path fill="currentColor" d="M248.91 50a205.9 205.9 0 0 1 35.857 3.13c85.207 15.025 152.077 81.895 167.102 167.102 15.023 85.208-24.944 170.917-99.874 214.178-32.782 18.927-69.254 27.996-105.463 27.553-46.555-.57-92.675-16.865-129.957-48.15l30.855-36.768a157.846 157.846 0 0 0 180.566 15.797 157.846 157.846 0 0 0 76.603-164.274A157.848 157.848 0 0 0 276.429 100.4a157.84 157.84 0 0 0-139.17 43.862L185 192H57V64l46.34 46.342C141.758 71.962 194.17 50.03 248.91 50z"/>
    </svg>
  )
}

function RotateRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="tile-ctrl-icon">
      <path fill="currentColor" d="M263.09 50a205.803 205.803 0 0 0-35.857 3.13C142.026 68.156 75.156 135.026 60.13 220.233 45.108 305.44 85.075 391.15 160.005 434.41c32.782 18.927 69.254 27.996 105.463 27.553 46.555-.57 92.675-16.865 129.957-48.15l-30.855-36.768a157.846 157.846 0 0 1-180.566 15.797 157.846 157.846 0 0 1-76.603-164.274A157.848 157.848 0 0 1 235.571 100.4a157.84 157.84 0 0 1 139.17 43.862L327 192h128V64l-46.34 46.342C370.242 71.962 317.83 50.03 263.09 50z"/>
    </svg>
  )
}

function MirrorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="tile-ctrl-icon">
      <path fill="currentColor" d="M387.02 278.627v67.883L477.53 256l-90.51-90.51v67.883H124.98V165.49L34.47 256l90.51 90.51v-67.883h262.04z"/>
    </svg>
  )
}

export function MapTileControls() {
  const activeTool = useMapStore((s) => s.activeTool)
  const selectedTemplateId = useMapStore((s) => s.selectedTemplateId)
  const rotation = useMapStore((s) => s.rotation)
  const mirrored = useMapStore((s) => s.mirrored)

  const cycleRotation = useMapStore((s) => s.cycleRotation)
  const cycleRotationBack = useMapStore((s) => s.cycleRotationBack)
  const toggleMirror = useMapStore((s) => s.toggleMirror)

  if (activeTool !== 'place' || selectedTemplateId === null) return null

  return (
    <div className="map-tile-controls">
      <button
        className="tile-ctrl-btn"
        onClick={cycleRotationBack}
        title="Rotate left (E)"
      >
        <RotateLeftIcon />
        <kbd className="tile-ctrl-key">E</kbd>
      </button>

      <span className="tile-ctrl-label">{rotation}°</span>

      <button
        className="tile-ctrl-btn"
        onClick={cycleRotation}
        title="Rotate right (R)"
      >
        <RotateRightIcon />
        <kbd className="tile-ctrl-key">R</kbd>
      </button>

      <div className="tile-ctrl-divider" />

      <button
        className={`tile-ctrl-btn${mirrored ? ' active' : ''}`}
        onClick={toggleMirror}
        title="Mirror tile (F)"
      >
        <MirrorIcon />
        <kbd className="tile-ctrl-key">F</kbd>
      </button>
    </div>
  )
}
