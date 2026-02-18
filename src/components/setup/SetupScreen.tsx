import { SetupFooter } from '@/components/layout/SetupFooter'
import { ModeSelector } from './ModeSelector'
import { SaveSlotManager } from './SaveSlotManager'
import { CharacterInputGroup } from './CharacterInputGroup'
import { TroupeUI } from './TroupeUI'
import { usePartyStore } from '@/stores/usePartyStore'
import { useGameSession } from '@/hooks/useGameSession'
import './SetupScreen.css'

export function SetupScreen() {
  const creationMode = usePartyStore((s) => s.creationMode)
  const characters = usePartyStore((s) => s.characters)
  const { embark } = useGameSession()

  return (
    <div className="setup-screen">
      <div className="setup-scroll-area">
        <h1 className="setup-title">The Proper Party Portfolio</h1>
        <ModeSelector />
        <SaveSlotManager />

        {creationMode === 'troupe' ? (
          <TroupeUI />
        ) : (
          <div className="char-inputs-grid">
            {characters.map((char, i) => (
              <CharacterInputGroup key={i} index={i} character={char} />
            ))}
          </div>
        )}

        <div className="embark-row">
          <button className="btn-main embark-btn" onClick={embark}>
            &#x2694; Embark!
          </button>
        </div>
      </div>
      <SetupFooter />
    </div>
  )
}
