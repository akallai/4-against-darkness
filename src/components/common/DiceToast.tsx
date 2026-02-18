import { useEffect, useState } from 'react'
import './DiceToast.css'

interface DiceToastProps {
  total: number
  detail?: string
  label: string
  exploded?: boolean
  rollChain?: number[]
  sides?: number
  onDismiss: () => void
}

export function DiceToast({
  total,
  detail,
  label,
  exploded,
  rollChain,
  sides,
  onDismiss,
}: DiceToastProps) {
  const chainLength = rollChain?.length ?? 0
  const [revealedCount, setRevealedCount] = useState(0)
  const [showTotal, setShowTotal] = useState(!exploded)

  useEffect(() => {
    if (!exploded || chainLength === 0) return
    const timers: ReturnType<typeof setTimeout>[] = []
    const baseDelay = 200
    for (let i = 0; i < chainLength; i++) {
      timers.push(setTimeout(() => setRevealedCount(i + 1), baseDelay + i * 400))
    }
    timers.push(setTimeout(() => setShowTotal(true), baseDelay + chainLength * 400))
    return () => timers.forEach(clearTimeout)
  }, [exploded, chainLength])

  useEffect(() => {
    const dismissDelay =
      exploded && chainLength > 0 ? 200 + chainLength * 400 + 2500 : 3000
    const timer = setTimeout(onDismiss, dismissDelay)
    return () => clearTimeout(timer)
  }, [onDismiss, exploded, chainLength])

  return (
    <div
      className={`dice-toast${exploded ? ' dice-toast--exploded' : ''}`}
      onClick={onDismiss}
    >
      {exploded && rollChain ? (
        <>
          <div className="dice-toast-chain">
            {rollChain.map((roll, i) => {
              if (i >= revealedCount) return null
              const isMax = roll === sides
              return (
                <span key={i} className="dice-toast-chain-step">
                  {i > 0 && <span className="dice-toast-chain-plus">+</span>}
                  <span
                    className={`dice-toast-die${isMax ? ' dice-toast-die--max' : ''}`}
                  >
                    {roll}
                  </span>
                </span>
              )
            })}
          </div>
          {showTotal && (
            <span className="dice-toast-total dice-toast-total--punch">= {total}</span>
          )}
          <span className="dice-toast-label">{label}</span>
        </>
      ) : (
        <>
          <span className="dice-toast-total">{total}</span>
          {detail && (
            <span className="dice-toast-detail" data-testid="dice-toast-detail">
              {detail}
            </span>
          )}
          <span className="dice-toast-label">{label}</span>
        </>
      )}
    </div>
  )
}
