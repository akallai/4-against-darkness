import { useEffect } from 'react'
import { useUIStore } from '@/stores/useUIStore'
import { useMapStore } from '@/stores/useMapStore'
import { useGameSession } from '@/hooks/useGameSession'
import { FooterBar } from '@/components/layout/FooterBar'
import { MapToolbar } from './MapToolbar'
import { MapGrid } from './MapGrid'
import { TileCatalog } from './TileCatalog'
import './MapScreen.css'

export function MapScreen() {
  const setScreen = useUIStore((s) => s.setScreen)
  const { save, saveAndQuit } = useGameSession()

  const cycleRotation = useMapStore((s) => s.cycleRotation)
  const toggleMirror = useMapStore((s) => s.toggleMirror)
  const undo = useMapStore((s) => s.undo)

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        cycleRotation()
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        toggleMirror()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cycleRotation, toggleMirror, undo])

  return (
    <div className="map-screen">
      <MapToolbar onBack={() => setScreen('tracker')} />
      <div className="map-main">
        <MapGrid />
        <TileCatalog />
      </div>
      <FooterBar onSave={() => save()} onQuit={saveAndQuit} />
    </div>
  )
}
