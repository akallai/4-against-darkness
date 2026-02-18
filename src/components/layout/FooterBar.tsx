import { useState, useCallback } from 'react'
import { useUIStore } from '@/stores/useUIStore'
import { usePartyStore } from '@/stores/usePartyStore'
import { useFullscreen } from './AppShell'
import { useLongPress } from '@/hooks/useLongPress'
import { DiceToast } from '@/components/common/DiceToast'
import { rollDice, rollD66 } from '@/utils/dice'
import './FooterBar.css'

interface FooterBarProps {
  onSave: () => void
  onQuit: () => void
}

interface ToastData {
  total: number
  detail?: string
  label: string
  key: number
}

export function FooterBar({ onSave, onQuit }: FooterBarProps) {
  const setScreen = useUIStore((s) => s.setScreen)
  const openModal = useUIStore((s) => s.openModal)
  const partyName = usePartyStore((s) => s.partyName)
  const { toggleFullscreen } = useFullscreen()
  const [toast, setToast] = useState<ToastData | null>(null)

  const showRoll = useCallback((total: number, label: string, detail?: string) => {
    setToast({ total, label, detail, key: Date.now() })
  }, [])

  const rollStandard = useCallback(
    (count: number, sides: number, label: string, exploding: boolean) => {
      const result = rollDice(count, sides, exploding)
      const displayLabel = exploding ? `${label}!` : label
      showRoll(result.total, displayLabel, result.detail)
    },
    [showRoll],
  )

  const handleD66 = useCallback(() => {
    showRoll(rollD66(), 'd66')
  }, [showRoll])

  const d6Press = useLongPress({
    onClick: () => rollStandard(1, 6, 'd6', false),
    onLongPress: () => rollStandard(1, 6, 'd6', true),
  })

  const d8Press = useLongPress({
    onClick: () => rollStandard(1, 8, 'd8', false),
    onLongPress: () => rollStandard(1, 8, 'd8', true),
  })

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, count: number, sides: number, label: string) => {
      e.preventDefault()
      rollStandard(count, sides, label, true)
    },
    [rollStandard],
  )

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
        <button
          className="btn-dice-inline"
          {...d6Press}
          onContextMenu={(e) => handleContextMenu(e, 1, 6, 'd6')}
          title="Tap: d6 · Hold: d6!"
        >
          d6
        </button>
        <button
          className="btn-dice-inline"
          onClick={() => rollStandard(2, 6, '2d6', false)}
          title="Roll 2d6"
        >
          2d6
        </button>
        <button
          className="btn-dice-inline"
          {...d8Press}
          onContextMenu={(e) => handleContextMenu(e, 1, 8, 'd8')}
          title="Tap: d8 · Hold: d8!"
        >
          d8
        </button>
        <button
          className="btn-dice-inline"
          onClick={handleD66}
          title="Roll d66"
        >
          d66
        </button>
        <button className="btn-main" onClick={onSave}>
          Save
        </button>
        <button className="btn-main" onClick={onQuit}>
          Quit
        </button>
      </div>

      {toast && (
        <DiceToast
          key={toast.key}
          total={toast.total}
          detail={toast.detail}
          label={toast.label}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}
