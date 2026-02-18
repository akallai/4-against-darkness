import type { Encounter } from '@/types'
import { useEncounterStore } from '@/stores/useEncounterStore'
import { usePartyStore } from '@/stores/usePartyStore'
import { AutoTextarea } from '@/components/common/AutoTextarea'
import './EncounterCard.css'

interface EncounterCardProps {
  encounter: Encounter
}

export function EncounterCard({ encounter }: EncounterCardProps) {
  const updateEncounter = useEncounterStore((s) => s.updateEncounter)
  const deleteEncounter = useEncounterStore((s) => s.deleteEncounter)
  const toggleEncounterCollapse = useEncounterStore((s) => s.toggleEncounterCollapse)
  const toggleEnemyStatus = useEncounterStore((s) => s.toggleEnemyStatus)
  const setEncounterCount = useEncounterStore((s) => s.setEncounterCount)
  const completeEncounter = useEncounterStore((s) => s.completeEncounter)
  const incrementStat = usePartyStore((s) => s.incrementStat)

  const defeated = encounter.status.filter(Boolean).length
  const total = encounter.count

  const handleComplete = (outcome: string) => {
    completeEncounter(encounter.id, outcome)
    if (outcome === 'victory') {
      const stat = encounter.category === 'minion' ? 'mv' : 'bw'
      incrementStat(stat, total)
    }
  }

  const handleReopen = () => {
    if (encounter.outcome === 'victory') {
      const stat = encounter.category === 'minion' ? 'mv' : 'bw'
      incrementStat(stat, -total)
    }
    updateEncounter(encounter.id, { isCompleted: false, outcome: '' })
  }

  const categoryLabel =
    encounter.category === 'minion' ? 'Minion' : encounter.category === 'boss' ? 'Boss' : 'Weird'

  return (
    <div className={`encounter-card ${encounter.isCompleted ? 'completed' : ''}`}>
      <div className="enc-header" onClick={() => toggleEncounterCollapse(encounter.id)}>
        <button className="arrow-btn">
          {encounter.collapsed ? '▶' : '▼'}
        </button>
        <input
          className="enc-type-input"
          value={encounter.type}
          onChange={(e) => updateEncounter(encounter.id, { type: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="Unknown"
        />
        {encounter.isCompleted ? (
          <button
            className="enc-status-badge done"
            onClick={(e) => {
              e.stopPropagation()
              handleReopen()
            }}
            title="Click to reopen encounter"
          >
            {encounter.outcome} ↺
          </button>
        ) : (
          <span className="enc-status-badge active">
            {defeated}/{total}
          </span>
        )}
        <span className="enc-category">{categoryLabel}</span>
        <button
          className="btn-list-action"
          onClick={(e) => {
            e.stopPropagation()
            deleteEncounter(encounter.id)
          }}
        >
          ✕
        </button>
      </div>

      {!encounter.collapsed && (
        <div className="enc-body">
          <div className="enc-ribbon">
            <div className="enc-ribbon-item">
              <label>Lvl</label>
              <input
                className="enc-tiny-input"
                value={encounter.lvl}
                onChange={(e) => updateEncounter(encounter.id, { lvl: e.target.value })}
              />
            </div>
            <div className="enc-ribbon-item">
              <label>Life</label>
              <input
                className="enc-tiny-input"
                value={encounter.life}
                onChange={(e) => updateEncounter(encounter.id, { life: e.target.value })}
              />
            </div>
            <div className="enc-ribbon-item">
              <label>Morale</label>
              <input
                className="enc-tiny-input"
                value={encounter.morale}
                onChange={(e) => updateEncounter(encounter.id, { morale: e.target.value })}
              />
            </div>
            <div className="enc-ribbon-item">
              <label>Attacks</label>
              <input
                className="enc-tiny-input"
                value={encounter.attacks}
                onChange={(e) => updateEncounter(encounter.id, { attacks: e.target.value })}
              />
            </div>
            <div className="enc-ribbon-item">
              <label>Treasure</label>
              <input
                className="enc-wide-input"
                value={encounter.treasure}
                onChange={(e) => updateEncounter(encounter.id, { treasure: e.target.value })}
              />
            </div>
          </div>

          <div className="enc-pip-section">
            <div className="enemy-pip-grid">
              {encounter.status.map((isDefeated, i) => (
                <label key={i} className="enemy-pip-label">
                  <input
                    type="checkbox"
                    className="enemy-check-input"
                    checked={isDefeated}
                    onChange={() => toggleEnemyStatus(encounter.id, i)}
                  />
                  <span className={`enemy-pip ${isDefeated ? 'defeated' : ''}`} />
                </label>
              ))}
            </div>
            {!encounter.isCompleted && (
              <div className="enc-count-control">
                <button
                  className="enc-count-btn"
                  onClick={() => setEncounterCount(encounter.id, encounter.count - 1)}
                  disabled={encounter.count <= 1}
                >
                  −
                </button>
                <span className="enc-count-value">{encounter.count}</span>
                <button
                  className="enc-count-btn"
                  onClick={() => setEncounterCount(encounter.id, encounter.count + 1)}
                >
                  +
                </button>
              </div>
            )}
          </div>

          <AutoTextarea
            className="enc-notes"
            value={encounter.notes}
            onChange={(notes) => updateEncounter(encounter.id, { notes })}
            placeholder="Notes..."
          />

          {!encounter.isCompleted && (
            <div className="enc-actions">
              <button className="btn-main" onClick={() => handleComplete('victory')}>
                Victory
              </button>
              <button className="btn-secondary" onClick={() => handleComplete('fled')}>
                Fled
              </button>
              <button className="btn-secondary" onClick={() => handleComplete('defeated')}>
                Defeated
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
