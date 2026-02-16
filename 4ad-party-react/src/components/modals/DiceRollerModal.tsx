import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { rollDice, rollD66 } from '@/utils/dice'
import type { DiceResult } from '@/utils/dice'
import './DiceRollerModal.css'

interface DiceRollerModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Preset {
  label: string
  count: number
  sides: number
  canExplode: boolean
}

const PRESETS: Preset[] = [
  { label: 'd6', count: 1, sides: 6, canExplode: true },
  { label: '2d6', count: 2, sides: 6, canExplode: false },
  { label: 'd8', count: 1, sides: 8, canExplode: true },
]

export function DiceRollerModal({ isOpen, onClose }: DiceRollerModalProps) {
  const [exploding, setExploding] = useState(false)
  const [result, setResult] = useState<{ label: string; data: DiceResult } | null>(null)
  const [d66Result, setD66Result] = useState<number | null>(null)

  const handlePreset = (preset: Preset) => {
    const useExploding = exploding && preset.canExplode
    const label = useExploding ? `${preset.label}!` : preset.label
    setD66Result(null)
    setResult({ label, data: rollDice(preset.count, preset.sides, useExploding) })
  }

  const handleD66 = () => {
    setResult(null)
    setD66Result(rollD66())
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dice Roller">
      <div className="dice-controls">
        <div className="dice-buttons">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              className={`btn-main dice-col-btn${exploding && p.canExplode ? ' dice-exploding-active' : ''}`}
              onClick={() => handlePreset(p)}
            >
              {exploding && p.canExplode ? `${p.label}!` : p.label}
            </button>
          ))}
          <button className="btn-secondary dice-col-btn" onClick={handleD66}>
            d66
          </button>
        </div>
        <button
          className={`dice-exploding-toggle${exploding ? ' active' : ''}`}
          onClick={() => setExploding(!exploding)}
        >
          Exploding
        </button>
      </div>

      <div className="dice-result-area">
        {result && (
          <div className="dice-col-result">
            <span className="dice-res-total">{result.data.total}</span>
            {result.data.rolls.length > 1 && (
              <span className="dice-res-detail">{result.data.detail}</span>
            )}
            <span className="dice-res-label">{result.label}</span>
          </div>
        )}
        {d66Result !== null && (
          <div className="dice-col-result">
            <span className="dice-res-total">{d66Result}</span>
            <span className="dice-res-label">d66</span>
          </div>
        )}
      </div>
    </Modal>
  )
}
