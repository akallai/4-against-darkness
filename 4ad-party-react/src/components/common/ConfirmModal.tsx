import { useState } from 'react'
import './Modal.css'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  showDontAskAgain?: boolean
  onDontAskAgainChange?: (value: boolean) => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  showDontAskAgain,
  onDontAskAgainChange,
}: ConfirmModalProps) {
  const [dontAsk, setDontAsk] = useState(false)

  if (!isOpen) return null

  const handleConfirm = () => {
    if (dontAsk && onDontAskAgainChange) {
      onDontAskAgainChange(true)
    }
    onConfirm()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-content">
        <h3 className="modal-title">{title}</h3>
        <p>{message}</p>
        {showDontAskAgain && (
          <label className="confirm-dont-ask">
            <input
              type="checkbox"
              checked={dontAsk}
              onChange={(e) => setDontAsk(e.target.checked)}
            />
            Don&apos;t ask again
          </label>
        )}
        <div className="confirm-buttons">
          <button className="btn-main" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
