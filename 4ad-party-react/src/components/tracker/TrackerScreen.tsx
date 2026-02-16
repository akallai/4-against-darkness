import { usePartyStore } from '@/stores/usePartyStore'
import { useGameSession } from '@/hooks/useGameSession'
import { FooterBar } from '@/components/layout/FooterBar'
import { CharacterCard } from './CharacterCard'
import './TrackerScreen.css'

export function TrackerScreen() {
  const characters = usePartyStore((s) => s.characters)
  const { save, saveAndQuit } = useGameSession()

  return (
    <div className="tracker-container">
      <div className="tracker-grid">
        {characters.map((char, i) => (
          <CharacterCard key={i} index={i} character={char} />
        ))}
      </div>
      <FooterBar onSave={save} onQuit={saveAndQuit} />
    </div>
  )
}
