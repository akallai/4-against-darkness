import { usePartyStore } from '@/stores/usePartyStore'
import { saveCreationMode } from '@/utils/persistence'
import type { CreationMode } from '@/types'
import './ModeSelector.css'

export function ModeSelector() {
  const creationMode = usePartyStore((s) => s.creationMode)
  const setCreationMode = usePartyStore((s) => s.setCreationMode)

  const handleMode = (mode: CreationMode) => {
    setCreationMode(mode)
    saveCreationMode(mode)
  }

  return (
    <div className="mode-selector">
      <button
        className={`mode-btn ${creationMode === 'standard' ? 'active' : ''}`}
        onClick={() => handleMode('standard')}
      >
        Standard Mode
      </button>
      <button
        className={`mode-btn ${creationMode === 'troupe' ? 'active' : ''}`}
        onClick={() => handleMode('troupe')}
      >
        Troupe Mode
      </button>
    </div>
  )
}
