import { type ReactNode, useEffect, useCallback } from 'react'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleBackdrop}>
      <div className="modal-content">
        {title && <h3 className="modal-title">{title}</h3>}
        {children}
        <button className="btn-main modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
