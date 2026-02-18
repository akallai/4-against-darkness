import { usePartyStore } from '@/stores/usePartyStore'
import './PartyCombatSummary.css'

export function PartyCombatSummary() {
  const characters = usePartyStore((s) => s.characters)
  const partyStats = usePartyStore((s) => s.partyStats)

  return (
    <div className="party-combat-summary">
      <div className="summ-cards">
        {characters.map((char, i) => {
          if (!char.name) return null
          return (
            <div key={i} className="summ-card" style={{ borderTopColor: char.color }}>
              <span className="summ-name">{char.name}</span>
              <div className="summ-stats">
                <span className="summ-hp-val">{char.hp}</span>
                <span className="summ-stat-val">A{char.atk}</span>
                <span className="summ-stat-val">D{char.def}</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="kill-counters">
        <div className="kill-counter">
          <span className="kill-icon">&#9876;</span>
          <div className="kill-detail">
            <span className="kill-label">Minions / Vermin</span>
            <span className="kill-value">{partyStats.mv}</span>
          </div>
        </div>
        <div className="kill-counter">
          <span className="kill-icon">&#9760;</span>
          <div className="kill-detail">
            <span className="kill-label">Bosses / Weird</span>
            <span className="kill-value">{partyStats.bw}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
