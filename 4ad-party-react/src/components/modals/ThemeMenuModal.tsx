import { Modal } from '@/components/common/Modal'
import { useTheme } from '@/hooks/useTheme'

interface ThemeMenuModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ThemeMenuModal({ isOpen, onClose }: ThemeMenuModalProps) {
  const { theme, setTheme } = useTheme()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Theme">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          className={`btn-main ${theme === 'dark' ? '' : 'btn-secondary'}`}
          onClick={() => {
            setTheme('dark')
            onClose()
          }}
        >
          Dark Theme
        </button>
        <button
          className={`btn-main ${theme === 'classic' ? '' : 'btn-secondary'}`}
          onClick={() => {
            setTheme('classic')
            onClose()
          }}
        >
          Classic Parchment
        </button>
      </div>
    </Modal>
  )
}
