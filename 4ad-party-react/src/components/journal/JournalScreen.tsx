import { useJournalStore } from '@/stores/useJournalStore'
import { useUIStore } from '@/stores/useUIStore'
import { FooterBar } from '@/components/layout/FooterBar'
import { useGameSession } from '@/hooks/useGameSession'
import { JournalEntry } from './JournalEntry'
import { NPCLocationPanel } from './NPCLocationPanel'
import './JournalScreen.css'

export function JournalScreen() {
  const journalData = useJournalStore((s) => s.journalData)
  const addEntry = useJournalStore((s) => s.addEntry)
  const addNPCLocation = useJournalStore((s) => s.addNPCLocation)
  const setScreen = useUIStore((s) => s.setScreen)
  const openModal = useUIStore((s) => s.openModal)
  const { save, saveAndQuit } = useGameSession()

  return (
    <div className="journal-screen">
      <div className="journal-layout">
        <div className="journal-column">
          <h2>
            Adventure Journal
            <button className="btn-secondary" onClick={() => openModal('journal-tools')} title="Journal Tools">
              <i className="fas fa-cog" />
            </button>
          </h2>
          <div className="journal-entries-area">
            {journalData.entries.map((entry) => (
              <JournalEntry key={entry.id} entry={entry} />
            ))}
          </div>
          <div className="journal-add-row">
            <button className="btn-gold-dashed" onClick={() => addEntry()}>
              + Add Entry
            </button>
          </div>
        </div>

        <div className="journal-column">
          <h2>NPC Locations</h2>
          <div className="npc-locations-area">
            {journalData.npcLocations.map((loc) => (
              <NPCLocationPanel key={loc.id} location={loc} />
            ))}
          </div>
          <div className="journal-add-row">
            <button className="btn-gold-dashed" onClick={() => addNPCLocation()}>
              + Add Location
            </button>
          </div>
        </div>
      </div>
      <div className="journal-floating-footer">
        <button className="btn-main" onClick={() => setScreen('tracker')}>
          &#x2190; Back to Tracker
        </button>
      </div>
      <FooterBar onSave={save} onQuit={saveAndQuit} />
    </div>
  )
}
