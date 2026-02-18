import { useState, useCallback } from 'react'
import { useUIStore } from '@/stores/useUIStore'
import { usePartyStore } from '@/stores/usePartyStore'
import { useFullscreen } from './AppShell'
import { useLongPress } from '@/hooks/useLongPress'
import { DiceToast } from '@/components/common/DiceToast'
import { GameIcon } from '@/components/common/GameIcon'
import { rollDice, rollD66 } from '@/utils/dice'
import type { Screen } from '@/types'
import type { IconName } from '@/components/common/GameIcon'
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
  exploded?: boolean
  rollChain?: number[]
  sides?: number
}

const NAV_ITEMS: { screen: Screen; icon: IconName; label: string }[] = [
  { screen: 'tracker', icon: 'campfire', label: 'Party' },
  { screen: 'journal', icon: 'open-book', label: 'Journal' },
  { screen: 'encounters', icon: 'crossed-swords', label: 'Combat' },
  { screen: 'followers', icon: 'rally-the-troops', label: 'Followers' },
  { screen: 'map', icon: 'treasure-map', label: 'Map' },
]

export function FooterBar({ onSave, onQuit }: FooterBarProps) {
  const screen = useUIStore((s) => s.screen)
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
      const didExplode = exploding && result.individualRolls.some((dr) => dr.length > 1)
      if (didExplode) {
        setToast({
          total: result.total,
          label: displayLabel,
          key: Date.now(),
          exploded: true,
          rollChain: result.individualRolls.flat(),
          sides,
        })
      } else {
        showRoll(result.total, displayLabel, result.detail)
      }
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
    <footer className="footer-bar">
      <nav className="footer-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.screen}
            className={`footer-icon-btn${screen === item.screen ? ' active' : ''}`}
            onClick={() => setScreen(item.screen)}
            title={item.label}
          >
            <GameIcon name={item.icon} />
            <span className="footer-icon-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="footer-center">
        {partyName && <span className="footer-party-name">{partyName}</span>}
      </div>

      <div className="footer-actions">
        <button
          className="footer-icon-btn"
          onClick={() => openModal('quest-tracker')}
          title="Quests"
        >
          <GameIcon name="tied-scroll" />
          <span className="footer-icon-label">Quests</span>
        </button>
        <button
          className="footer-icon-btn"
          onClick={() => openModal('gm-tools')}
          title="GM Tools"
        >
          <GameIcon name="crystal-ball" />
          <span className="footer-icon-label">Tools</span>
        </button>
        <a
          className="footer-icon-btn"
          href="https://akallai.github.io/four-against-darkness-shop/"
          target="_blank"
          rel="noopener noreferrer"
          title="Shop"
        >
          <GameIcon name="shop" />
          <span className="footer-icon-label">Shop</span>
        </a>

        <span className="footer-divider" />

        <div className="footer-dice-group">
          <div className="footer-dice-buttons">
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
          </div>
          <span className="footer-icon-label">Dice</span>
        </div>

        <span className="footer-divider" />

        <button className="footer-icon-btn" onClick={onSave} title="Save">
          <GameIcon name="save" />
          <span className="footer-icon-label">Save</span>
        </button>
        <button className="footer-icon-btn" onClick={onQuit} title="Save & Quit">
          <GameIcon name="exit-door" />
          <span className="footer-icon-label">Quit</span>
        </button>
        <button
          className="footer-icon-btn footer-icon-btn--subtle"
          onClick={toggleFullscreen}
          title="Fullscreen"
        >
          <GameIcon name="resize" size={16} />
        </button>
      </div>

      {toast && (
        <DiceToast
          key={toast.key}
          total={toast.total}
          detail={toast.detail}
          label={toast.label}
          exploded={toast.exploded}
          rollChain={toast.rollChain}
          sides={toast.sides}
          onDismiss={() => setToast(null)}
        />
      )}
    </footer>
  )
}
