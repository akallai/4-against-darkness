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
        <span className="kill-counter">Minions/Vermin: {partyStats.mv}</span>
        <span className="kill-counter">Bosses/Weird: {partyStats.bw}</span>
      </div>
    </div>
  )
}
