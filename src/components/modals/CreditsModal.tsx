import { Modal } from '@/components/common/Modal'

interface CreditsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="The Proper Party Portfolio">
      <p style={{ fontSize: '0.9em', color: '#aaa' }}>
        A companion app for <strong>Four Against Darkness</strong> by Andrea Sfiligoi.
      </p>
      <p style={{ fontSize: '0.85em', color: '#888' }}>
        This is a fan-made tool. Four Against Darkness is a trademark of Ganesha Games.
      </p>
      <p style={{ fontSize: '0.8em', color: '#666', marginTop: '15px' }}>
        v2.0.0 &mdash; React Edition
      </p>
    </Modal>
  )
}
