import { usePartyStore } from '@/stores/usePartyStore'
import './PartyCombatSummary.css'

export function PartyCombatSummary() {
  const characters = usePartyStore((s) => s.characters)
  const updateCharacter = usePartyStore((s) => s.updateCharacter)
  const partyStats = usePartyStore((s) => s.partyStats)

  const changeHp = (index: number, delta: number) => {
    const char = characters[index]
    if (!char) return
    const parts = char.hp.split('/')
    const current = parseInt(parts[0] ?? '0', 10)
    const max = parseInt(parts[1] ?? '0', 10)
    const newCurrent = Math.max(0, current + delta)
    updateCharacter(index, { hp: `${newCurrent}/${max}` })
  }

  return (
    <div className="party-combat-summary">
      <div className="summ-cards">
        {characters.map((char, i) => {
          if (!char.name) return null
          return (
            <div key={i} className="summ-card" style={{ borderTopColor: char.color }}>
              <span className="summ-name">{char.name}</span>
              <div className="summ-stats">
                <div className="summ-hp-controls">
                  <button className="summ-hp-btn" onClick={() => changeHp(i, -1)}>-</button>
                  <span className="summ-hp-val">{char.hp}</span>
                  <button className="summ-hp-btn" onClick={() => changeHp(i, 1)}>+</button>
                </div>
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
