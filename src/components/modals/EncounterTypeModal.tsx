import { Modal } from '@/components/common/Modal'
import { useUIStore } from '@/stores/useUIStore'

interface EncounterTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EncounterTypeModal({ isOpen, onClose }: EncounterTypeModalProps) {
  const openModal = useUIStore((s) => s.openModal)

  const selectType = (category: string) => {
    // Store the category for the creation modal
    sessionStorage.setItem('4AD_pending_enc_category', category)
    openModal('encounter-creation')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Encounter">
      <p style={{ fontSize: '0.9em', color: '#aaa', marginBottom: '15px' }}>
        Select encounter type:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn-main" onClick={() => selectType('minion')}>
          Minion / Vermin
        </button>
        <button className="btn-main" onClick={() => selectType('boss')}>
          Boss / Special
        </button>
        <button className="btn-main" onClick={() => selectType('weird')}>
          Weird Monster
        </button>
      </div>
    </Modal>
  )
}
