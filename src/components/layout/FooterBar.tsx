import { useUIStore } from '@/stores/useUIStore'
import { usePartyStore } from '@/stores/usePartyStore'
import { useFullscreen } from './AppShell'
import './FooterBar.css'

interface FooterBarProps {
  onSave: () => void
  onQuit: () => void
}

export function FooterBar({ onSave, onQuit }: FooterBarProps) {
  const setScreen = useUIStore((s) => s.setScreen)
  const openModal = useUIStore((s) => s.openModal)
  const partyName = usePartyStore((s) => s.partyName)
  const { toggleFullscreen } = useFullscreen()

  return (
    <div className="footer-bar">
      <div className="footer-group">
        <button className="btn-fs" onClick={toggleFullscreen} title="Toggle Fullscreen">
          &#x26F6;
        </button>
        <button className="btn-journal-gold" onClick={() => setScreen('journal')}>
          Journal
        </button>
        <button className="btn-journal-gold" onClick={() => setScreen('followers')}>
          Followers
        </button>
        <button className="btn-journal-gold" onClick={() => setScreen('encounters')}>
          Combat
        </button>
        <button className="btn-journal-gold" onClick={() => setScreen('map')}>
          Map
        </button>
      </div>
      <div className="footer-group center">
        {partyName && <span className="active-party-label">{partyName}</span>}
      </div>
      <div className="footer-group">
        <button className="btn-journal-gold" onClick={() => openModal('quest-tracker')}>
          Quests
        </button>
        <button className="btn-oracle" onClick={() => openModal('gm-tools')}>
          GM Tools
        </button>
        <button className="btn-dice" onClick={() => openModal('dice-roller')}>
          Dice
        </button>
        <button className="btn-main" onClick={onSave}>
          Save
        </button>
        <button className="btn-main" onClick={onQuit}>
          Quit
        </button>
      </div>
    </div>
  )
}
