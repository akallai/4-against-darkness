import { useUIStore } from '@/stores/useUIStore'
import { useFullscreen } from './AppShell'
import './FooterBar.css'

export function SetupFooter() {
  const openModal = useUIStore((s) => s.openModal)
  const { toggleFullscreen } = useFullscreen()

  return (
    <div className="setup-footer">
      <button className="setup-footer-btn" onClick={() => window.close()} title="Exit App">
        &#x2716; Quit
      </button>
      <button className="setup-footer-btn" onClick={() => openModal('theme-menu')} title="Select App Theme">
        &#x2600; Theme
      </button>
      <div className="version-label">v2.0.0</div>
      <button className="setup-footer-btn" onClick={() => openModal('credits')} title="App Credits">
        ? Info
      </button>
      <button className="setup-footer-btn" onClick={toggleFullscreen} title="Full Screen">
        &#x26F6;
      </button>
    </div>
  )
}
