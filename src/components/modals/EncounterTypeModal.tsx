import { Modal } from '@/components/common/Modal'
import { useUIStore } from '@/stores/useUIStore'
import './EncounterModals.css'

interface EncounterTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EncounterTypeModal({ isOpen, onClose }: EncounterTypeModalProps) {
  const openModal = useUIStore((s) => s.openModal)

  const selectType = (category: string) => {
    sessionStorage.setItem('4AD_pending_enc_category', category)
    openModal('encounter-creation')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Encounter">
      <p className="enc-type-prompt">What lurks in the darkness?</p>
      <div className="enc-type-grid">
        <button className="enc-type-option" onClick={() => selectType('minion')}>
          <span className="enc-type-icon">&#9876;</span>
          <div className="enc-type-info">
            <div className="enc-type-name">Minion / Vermin</div>
            <div className="enc-type-desc">Common foes, mooks, and crawling things</div>
          </div>
        </button>
        <button className="enc-type-option" onClick={() => selectType('boss')}>
          <span className="enc-type-icon">&#9760;</span>
          <div className="enc-type-info">
            <div className="enc-type-name">Boss / Special</div>
            <div className="enc-type-desc">Powerful enemies and named adversaries</div>
          </div>
        </button>
        <button className="enc-type-option" onClick={() => selectType('weird')}>
          <span className="enc-type-icon">&#10070;</span>
          <div className="enc-type-info">
            <div className="enc-type-name">Weird Monster</div>
            <div className="enc-type-desc">Strange and unusual creatures</div>
          </div>
        </button>
      </div>
    </Modal>
  )
}
