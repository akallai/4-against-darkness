import { useUIStore } from '@/stores/useUIStore'
import { usePartyStore } from '@/stores/usePartyStore'
import './CombatToolsBar.css'

export function CombatToolsBar() {
  const openModal = useUIStore((s) => s.openModal)
  const partyStats = usePartyStore((s) => s.partyStats)
  const incrementStat = usePartyStore((s) => s.incrementStat)

  return (
    <div className="combat-tools-bar">
      <div className="combat-tools-left">
        <button className="btn-secondary" onClick={() => openModal('encounter-type')}>
          + Encounter
        </button>
        <button className="btn-secondary" onClick={() => openModal('bestiary-manager')}>
          Bestiary
        </button>
      </div>
      <div className="combat-tools-right">
        <div className="kill-counter-control">
          <span className="counter-label">MV</span>
          <button className="counter-btn" onClick={() => incrementStat('mv', -1)}>-</button>
          <span className="counter-value">{partyStats.mv}</span>
          <button className="counter-btn" onClick={() => incrementStat('mv')}>+</button>
        </div>
        <div className="kill-counter-control">
          <span className="counter-label">BW</span>
          <button className="counter-btn" onClick={() => incrementStat('bw', -1)}>-</button>
          <span className="counter-value">{partyStats.bw}</span>
          <button className="counter-btn" onClick={() => incrementStat('bw')}>+</button>
        </div>
      </div>
    </div>
  )
}
