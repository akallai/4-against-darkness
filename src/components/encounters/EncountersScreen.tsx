import { useEncounterStore } from '@/stores/useEncounterStore'
import { useUIStore } from '@/stores/useUIStore'
import { useGameSession } from '@/hooks/useGameSession'
import { FooterBar } from '@/components/layout/FooterBar'
import { PartyCombatSummary } from './PartyCombatSummary'
import { EncounterCard } from './EncounterCard'
import { CombatToolsBar } from './CombatToolsBar'
import './EncountersScreen.css'

export function EncountersScreen() {
  const encounters = useEncounterStore((s) => s.encounters)
  const setScreen = useUIStore((s) => s.setScreen)
  const openModal = useUIStore((s) => s.openModal)
  const { save, saveAndQuit } = useGameSession()

  return (
    <div className="encounters-screen">
      <PartyCombatSummary />
      <CombatToolsBar />
      <div className="encounters-list">
        {encounters.map((enc) => (
          <EncounterCard key={enc.id} encounter={enc} />
        ))}
        {encounters.length === 0 && (
          <p className="empty-state">No encounters yet. Add one to begin combat tracking.</p>
        )}
      </div>
      <div className="encounters-footer">
        <button className="btn-main" onClick={() => openModal('encounter-type')}>
          + New Encounter
        </button>
        <button className="btn-main" onClick={() => setScreen('tracker')}>
          &#x2190; Back
        </button>
      </div>
      <FooterBar onSave={save} onQuit={saveAndQuit} />
    </div>
  )
}
