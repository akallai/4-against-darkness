import { useEffect } from 'react'
import './DiceToast.css'

interface DiceToastProps {
  total: number
  detail?: string
  label: string
  onDismiss: () => void
}

export function DiceToast({ total, detail, label, onDismiss }: DiceToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="dice-toast" onClick={onDismiss}>
      <span className="dice-toast-total">{total}</span>
      {detail && (
        <span className="dice-toast-detail" data-testid="dice-toast-detail">
          {detail}
        </span>
      )}
      <span className="dice-toast-label">{label}</span>
    </div>
  )
}
