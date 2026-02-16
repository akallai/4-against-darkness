import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { rollDice, rollD66 } from '@/utils/dice'
import type { DiceResult } from '@/utils/dice'
import './DiceRollerModal.css'

interface DiceRollerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DiceRollerModal({ isOpen, onClose }: DiceRollerModalProps) {
  const [count, setCount] = useState(1)
  const [sides, setSides] = useState(6)
  const [exploding, setExploding] = useState(false)
  const [result, setResult] = useState<DiceResult | null>(null)
  const [d66Result, setD66Result] = useState<number | null>(null)

  const handleRoll = () => {
    setD66Result(null)
    setResult(rollDice(count, sides, exploding))
  }

  const handleD66 = () => {
    setResult(null)
    setD66Result(rollD66())
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dice Roller">
      <div className="dice-controls">
        <div className="dice-col-settings">
          <div className="dice-row-selects">
            <select value={count} onChange={(e) => setCount(parseInt(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span>d</span>
            <select value={sides} onChange={(e) => setSides(parseInt(e.target.value))}>
              {[4, 6, 8, 10, 12, 20, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <label>
            <input
              type="checkbox"
              checked={exploding}
              onChange={(e) => setExploding(e.target.checked)}
            />
            Exploding
          </label>
        </div>

        <div className="dice-buttons">
          <button className="btn-main dice-col-btn" onClick={handleRoll}>
            Roll
          </button>
          <button className="btn-secondary d66-btn" onClick={handleD66}>
            d66
          </button>
        </div>
      </div>

      <div className="dice-result-area">
        {result && (
          <div className="dice-col-result">
            <span className="dice-res-total">{result.total}</span>
            <span className="dice-res-detail">{result.detail}</span>
            <span className="dice-res-label">Result</span>
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
